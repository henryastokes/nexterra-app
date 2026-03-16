import {
  DAOContractState,
  DAOContractSettings,
  ContractMetadata,
  ContractStatus,
  ContractVersion,
  RegulatoryConfig,
  Jurisdiction,
  MilestoneDefinition,
  ProposalRecord,
  VoteChoice,
  FundingPreference,
  PaymentMethod,
  PaymentDetails,
  UserRole,
} from './types';
import { ProposalRegistry, createProposalRegistry } from './proposalRegistry';
import { VotingEngine, createVotingEngine, VoterInfo } from './votingEngine';
import { EscrowManager, createEscrowManager } from './escrowManager';
import { DisbursementManager, createDisbursementManager } from './disbursementManager';
import { ReportingEnforcement, createReportingEnforcement, ReportSubmission } from './reportingEnforcement';
import { PermissionManager, createPermissionManager } from './permissionManager';
import { PaymentRails, createPaymentRails } from './paymentRails';
import { AuditTrail, createAuditTrail } from './auditTrail';

export * from './types';
export * from './proposalRegistry';
export * from './votingEngine';
export * from './escrowManager';
export * from './disbursementManager';
export * from './reportingEnforcement';
export * from './permissionManager';
export * from './paymentRails';
export * from './auditTrail';

const generateHash = () => `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;

export class DAOContractService {
  private daoId: string;
  private status: ContractStatus = 'active';
  private pauseReason?: string;
  private pausedAt?: string;
  private pausedBy?: string;
  private metadata: ContractMetadata;
  private settings: DAOContractSettings;
  private regulatoryConfig: RegulatoryConfig;

  public proposalRegistry: ProposalRegistry;
  public votingEngine: VotingEngine;
  public escrowManager: EscrowManager;
  public disbursementManager: DisbursementManager;
  public reportingEnforcement: ReportingEnforcement;
  public permissionManager: PermissionManager;
  public paymentRails: PaymentRails;
  public auditTrail: AuditTrail;

  constructor(
    daoId: string,
    options: {
      chainId?: string;
      chainName?: string;
      currency?: string;
      jurisdiction?: Jurisdiction;
      settings?: Partial<DAOContractSettings>;
    } = {}
  ) {
    this.daoId = daoId;

    this.settings = {
      votingPeriodDays: 7,
      executionDelayDays: 2,
      quorumPercentage: 40,
      proposalThreshold: 100,
      gracePeriodDays: 7,
      autoPauseOnMissedReports: true,
      missedReportThreshold: 2,
      requiredApprovals: 2,
      allowDelegation: true,
      maxDelegationDepth: 2,
      ...options.settings,
    };

    this.metadata = {
      version: '2.0.0',
      deployedAt: new Date().toISOString(),
      upgradeHistory: [],
      chainId: options.chainId || '137',
      chainName: options.chainName || 'Polygon',
      contractAddress: generateHash(),
      implementationAddress: generateHash(),
      proxyAdmin: generateHash(),
    };

    this.regulatoryConfig = {
      jurisdiction: options.jurisdiction || 'kenya',
      kycRequired: true,
      kycLevel: 'basic',
      amlCheckRequired: true,
      maxTransactionLimit: 100000,
      dailyLimit: 50000,
      monthlyLimit: 500000,
      reportingThreshold: 10000,
      requiredDocuments: ['Government ID', 'Proof of Address'],
      restrictions: [],
      complianceNotes: '',
    };

    this.proposalRegistry = createProposalRegistry(daoId);
    this.votingEngine = createVotingEngine(daoId, this.settings);
    this.escrowManager = createEscrowManager(
      daoId,
      this.metadata.contractAddress,
      options.currency || 'USDC',
      this.settings.requiredApprovals
    );
    this.disbursementManager = createDisbursementManager(daoId, this.escrowManager, {
      autoPauseEnabled: this.settings.autoPauseOnMissedReports,
      missedReportThreshold: this.settings.missedReportThreshold,
      gracePeriodDays: this.settings.gracePeriodDays,
    });
    this.reportingEnforcement = createReportingEnforcement(daoId, (reason) => {
      this.pause(reason, 'System');
    });
    this.permissionManager = createPermissionManager(daoId);
    this.paymentRails = createPaymentRails(daoId);
    this.auditTrail = createAuditTrail(daoId);

    console.log(`[DAOContractService] Initialized for DAO: ${daoId}`);
  }

  pause(reason: string, pausedBy: string): boolean {
    if (this.status === 'paused') {
      console.error(`[DAOContractService] Contract is already paused`);
      return false;
    }

    this.status = 'paused';
    this.pauseReason = reason;
    this.pausedAt = new Date().toISOString();
    this.pausedBy = pausedBy;

    this.auditTrail.recordContractPaused({
      reason,
      actor: pausedBy,
      actorAddress: '',
    });

    console.log(`[DAOContractService] Contract paused: ${reason}`);
    return true;
  }

  resume(resumedBy: string): boolean {
    if (this.status !== 'paused') {
      console.error(`[DAOContractService] Contract is not paused`);
      return false;
    }

    const compliance = this.reportingEnforcement.checkCompliance();
    if (!compliance.isCompliant) {
      console.error(`[DAOContractService] Cannot resume - reporting compliance not met`);
      return false;
    }

    this.status = 'active';
    this.pauseReason = undefined;
    this.pausedAt = undefined;
    this.pausedBy = undefined;

    console.log(`[DAOContractService] Contract resumed by ${resumedBy}`);
    return true;
  }

  upgrade(newVersion: ContractVersion, upgrader: string, description: string): boolean {
    if (this.status === 'paused') {
      console.error(`[DAOContractService] Cannot upgrade paused contract`);
      return false;
    }

    const fromVersion = this.metadata.version;
    const transactionHash = generateHash();

    this.metadata.upgradeHistory.push({
      id: `upgrade-${Date.now()}`,
      fromVersion,
      toVersion: newVersion,
      timestamp: new Date().toISOString(),
      transactionHash,
      initiator: upgrader,
      description,
    });

    this.metadata.version = newVersion;
    this.metadata.lastUpgraded = new Date().toISOString();
    this.metadata.implementationAddress = generateHash();

    this.auditTrail.recordContractUpgraded({
      fromVersion,
      toVersion: newVersion,
      actor: upgrader,
      actorAddress: '',
      transactionHash,
    });

    console.log(`[DAOContractService] Contract upgraded to ${newVersion}`);
    return true;
  }

  createProposal(params: {
    title: string;
    description: string;
    type: ProposalRecord['type'];
    proposer: string;
    proposerAddress: string;
    requestedAmount?: number;
    milestones?: MilestoneDefinition[];
  }): ProposalRecord | null {
    if (this.status === 'paused') {
      console.error(`[DAOContractService] Contract is paused`);
      return null;
    }

    if (!this.permissionManager.checkPermission(params.proposerAddress, 'create', 'proposal')) {
      console.error(`[DAOContractService] No permission to create proposals`);
      return null;
    }

    const proposal = this.proposalRegistry.createProposal({
      ...params,
      currency: this.escrowManager.getEscrowState().currency,
      attachments: [],
      metadata: {},
    });

    if (proposal) {
      this.auditTrail.recordProposalCreated({
        proposalId: proposal.id,
        proposalTitle: proposal.title,
        actor: params.proposer,
        actorAddress: params.proposerAddress,
        actorRole: 'proposer',
      });
    }

    return proposal;
  }

  castVote(params: {
    proposalId: string;
    voter: string;
    voterAddress: string;
    choice: VoteChoice;
    fundingPreference?: FundingPreference;
  }): boolean {
    if (this.status === 'paused') {
      console.error(`[DAOContractService] Contract is paused`);
      return false;
    }

    if (!this.permissionManager.checkPermission(params.voterAddress, 'vote', 'proposal')) {
      console.error(`[DAOContractService] No permission to vote`);
      return false;
    }

    const vote = this.votingEngine.castVote(params);
    
    if (vote) {
      this.auditTrail.recordVoteCast({
        proposalId: params.proposalId,
        choice: params.choice,
        votingPower: vote.votingPower,
        actor: params.voter,
        actorAddress: params.voterAddress,
      });
      return true;
    }

    return false;
  }

  depositFunds(params: {
    amount: number;
    fromAddress: string;
    fromName?: string;
    paymentMethod: PaymentMethod;
  }): boolean {
    if (this.status === 'paused') {
      console.error(`[DAOContractService] Contract is paused`);
      return false;
    }

    const deposit = this.escrowManager.deposit(params);
    
    if (deposit) {
      this.auditTrail.recordFundsDeposited({
        amount: params.amount,
        currency: this.escrowManager.getEscrowState().currency,
        fromAddress: params.fromAddress,
        actor: params.fromName || params.fromAddress,
        transactionHash: deposit.transactionHash,
      });
      return true;
    }

    return false;
  }

  requestDisbursement(params: {
    milestoneId: string;
    toAddress: string;
    toName?: string;
    paymentMethod: PaymentMethod;
    paymentDetails?: PaymentDetails;
    requester: string;
    requesterAddress: string;
  }): boolean {
    if (this.status === 'paused') {
      console.error(`[DAOContractService] Contract is paused`);
      return false;
    }

    const milestone = this.disbursementManager.getMilestone(params.milestoneId);
    if (!milestone) {
      console.error(`[DAOContractService] Milestone not found`);
      return false;
    }

    if (milestone.status !== 'pending') {
      console.error(`[DAOContractService] Milestone not in pending status`);
      return false;
    }

    const compliance = this.reportingEnforcement.checkCompliance();
    if (!compliance.isCompliant) {
      console.error(`[DAOContractService] Reporting compliance not met`);
      return false;
    }

    const disbursement = this.escrowManager.initiateDisbursement({
      milestoneId: params.milestoneId,
      amount: milestone.amount,
      toAddress: params.toAddress,
      toName: params.toName,
      paymentMethod: params.paymentMethod,
      paymentDetails: params.paymentDetails,
    });

    return disbursement !== null;
  }

  submitReport(submission: ReportSubmission): boolean {
    const report = this.reportingEnforcement.submitReport(submission);
    
    if (report) {
      this.auditTrail.recordReportSubmitted({
        reportId: report.id,
        reportTitle: report.title,
        reportType: report.type,
        actor: submission.submittedBy,
        actorAddress: '',
      });
      return true;
    }

    return false;
  }

  grantRole(params: {
    userId: string;
    userAddress: string;
    role: UserRole;
    grantedBy: string;
    grantedByAddress: string;
  }): boolean {
    if (!this.permissionManager.checkPermission(params.grantedByAddress, 'grant', 'role')) {
      console.error(`[DAOContractService] No permission to grant roles`);
      return false;
    }

    const permission = this.permissionManager.grantRole({
      userId: params.userId,
      userAddress: params.userAddress,
      role: params.role,
      grantedBy: params.grantedBy,
    });

    if (permission) {
      this.auditTrail.recordRoleChanged({
        userId: params.userId,
        userAddress: params.userAddress,
        newRole: params.role,
        actor: params.grantedBy,
        actorAddress: params.grantedByAddress,
      });
      return true;
    }

    return false;
  }

  registerVoter(voter: VoterInfo): void {
    this.votingEngine.registerVoter(voter);
  }

  registerMilestones(milestones: MilestoneDefinition[]): void {
    this.disbursementManager.registerMilestones(milestones);
    milestones.forEach(m => {
      if (m.reportingRequirements) {
        this.reportingEnforcement.registerRequirements(m.id, m.reportingRequirements);
      }
    });
  }

  getState(): DAOContractState {
    return {
      daoId: this.daoId,
      metadata: this.metadata,
      status: this.status,
      pauseReason: this.pauseReason,
      pausedAt: this.pausedAt,
      pausedBy: this.pausedBy,
      escrow: this.escrowManager.getEscrowState(),
      proposals: this.proposalRegistry.getAllProposals(),
      votes: [],
      permissions: this.permissionManager.getAllUsers(),
      auditTrail: this.auditTrail.getAllEvents(),
      reports: this.reportingEnforcement.getAllReports(),
      regulatoryConfig: this.regulatoryConfig,
      settings: this.settings,
    };
  }

  getContractStatus(): {
    status: ContractStatus;
    pauseReason?: string;
    pausedAt?: string;
    pausedBy?: string;
  } {
    return {
      status: this.status,
      pauseReason: this.pauseReason,
      pausedAt: this.pausedAt,
      pausedBy: this.pausedBy,
    };
  }

  getMetadata(): ContractMetadata {
    return { ...this.metadata };
  }

  getSettings(): DAOContractSettings {
    return { ...this.settings };
  }

  updateSettings(settings: Partial<DAOContractSettings>): void {
    this.settings = { ...this.settings, ...settings };
    this.votingEngine.updateSettings(this.settings);
  }

  getComplianceStatus(): {
    reporting: ReturnType<ReportingEnforcement['checkCompliance']>;
    milestones: ReturnType<DisbursementManager['getProgress']>;
    regulatory: RegulatoryConfig;
  } {
    return {
      reporting: this.reportingEnforcement.checkCompliance(),
      milestones: this.disbursementManager.getProgress(),
      regulatory: this.regulatoryConfig,
    };
  }
}

export const createDAOContractService = (
  daoId: string,
  options?: {
    chainId?: string;
    chainName?: string;
    currency?: string;
    jurisdiction?: Jurisdiction;
    settings?: Partial<DAOContractSettings>;
  }
): DAOContractService => {
  return new DAOContractService(daoId, options);
};
