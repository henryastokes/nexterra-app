export type ContractVersion = '1.0.0' | '1.1.0' | '2.0.0';
export type ContractStatus = 'active' | 'paused' | 'completed' | 'terminated';
export type ProposalStatus = 'draft' | 'pending' | 'active' | 'passed' | 'rejected' | 'executed' | 'cancelled';
export type VoteChoice = 'yes' | 'no' | 'abstain';
export type FundingPreference = '25' | '50' | '100';
export type MilestoneStatus = 'locked' | 'pending' | 'released' | 'failed' | 'paused';
export type ReportStatus = 'pending' | 'submitted' | 'approved' | 'rejected' | 'overdue';
export type PaymentMethod = 'crypto_wallet' | 'bank_transfer' | 'mobile_money';
export type MobileMoneyProvider = 'mpesa' | 'mtn_momo' | 'airtel_money' | 'orange_money' | 'ecocash' | 'chipper';
export type UserRole = 'admin' | 'member' | 'proposer' | 'voter' | 'funder' | 'auditor' | 'observer';
export type AuditEventType = 'proposal_created' | 'vote_cast' | 'funds_deposited' | 'funds_disbursed' | 'milestone_released' | 'report_submitted' | 'role_changed' | 'contract_paused' | 'contract_upgraded' | 'permission_granted' | 'permission_revoked';
export type Jurisdiction = 'kenya' | 'nigeria' | 'senegal' | 'ethiopia' | 'drc' | 'tanzania' | 'uganda' | 'ghana' | 'south_africa' | 'rwanda' | 'other';

export interface ContractMetadata {
  version: ContractVersion;
  deployedAt: string;
  lastUpgraded?: string;
  upgradeHistory: UpgradeRecord[];
  chainId: string;
  chainName: string;
  contractAddress: string;
  implementationAddress?: string;
  proxyAdmin?: string;
}

export interface UpgradeRecord {
  id: string;
  fromVersion: ContractVersion;
  toVersion: ContractVersion;
  timestamp: string;
  transactionHash: string;
  initiator: string;
  description: string;
}

export interface ProposalRecord {
  id: string;
  daoId: string;
  title: string;
  description: string;
  type: 'funding' | 'governance' | 'membership' | 'operational' | 'emergency';
  status: ProposalStatus;
  proposer: string;
  proposerAddress: string;
  createdAt: string;
  updatedAt: string;
  votingStartsAt?: string;
  votingEndsAt?: string;
  executedAt?: string;
  requestedAmount?: number;
  currency?: string;
  milestones?: MilestoneDefinition[];
  attachments: ProposalAttachment[];
  metadata: Record<string, unknown>;
  transactionHash?: string;
  blockNumber?: number;
}

export interface ProposalAttachment {
  id: string;
  name: string;
  type: 'document' | 'image' | 'audio' | 'video';
  url: string;
  hash: string;
  uploadedAt: string;
}

export interface MilestoneDefinition {
  id: string;
  title: string;
  description: string;
  amount: number;
  percentage: number;
  scheduledDate: string;
  conditions: MilestoneCondition[];
  reportingRequirements: ReportingRequirement[];
  status: MilestoneStatus;
  releasedAt?: string;
  transactionHash?: string;
}

export interface MilestoneCondition {
  id: string;
  description: string;
  type: 'deliverable' | 'report' | 'approval' | 'time_based' | 'metric';
  isMet: boolean;
  verifiedAt?: string;
  verifiedBy?: string;
  evidence?: string;
}

export interface ReportingRequirement {
  id: string;
  type: 'progress' | 'financial' | 'impact' | 'audit';
  frequency: 'weekly' | 'monthly' | 'quarterly' | 'milestone';
  dueDate: string;
  status: ReportStatus;
  gracePeriodDays: number;
  submittedAt?: string;
  reportId?: string;
}

export interface VoteRecord {
  id: string;
  proposalId: string;
  voter: string;
  voterAddress: string;
  choice: VoteChoice;
  fundingPreference?: FundingPreference;
  votingPower: number;
  timestamp: string;
  transactionHash: string;
  blockNumber: number;
  signature?: string;
  delegatedFrom?: string;
}

export interface VotingSnapshot {
  proposalId: string;
  totalVotingPower: number;
  totalVotes: number;
  yesVotes: number;
  noVotes: number;
  abstainVotes: number;
  yesPower: number;
  noPower: number;
  abstainPower: number;
  fundingPreferences: {
    '25': number;
    '50': number;
    '100': number;
  };
  quorumReached: boolean;
  quorumRequired: number;
  participationRate: number;
}

export interface EscrowAccount {
  id: string;
  daoId: string;
  contractAddress: string;
  totalDeposited: number;
  totalDisbursed: number;
  availableBalance: number;
  lockedBalance: number;
  pendingDisbursements: number;
  currency: string;
  createdAt: string;
  lastActivityAt: string;
  deposits: EscrowDeposit[];
  disbursements: EscrowDisbursement[];
}

export interface EscrowDeposit {
  id: string;
  escrowId: string;
  amount: number;
  currency: string;
  fromAddress: string;
  fromName?: string;
  paymentMethod: PaymentMethod;
  timestamp: string;
  transactionHash: string;
  blockNumber: number;
  status: 'pending' | 'confirmed' | 'failed';
  metadata?: Record<string, unknown>;
}

export interface EscrowDisbursement {
  id: string;
  escrowId: string;
  milestoneId: string;
  amount: number;
  currency: string;
  toAddress: string;
  toName?: string;
  paymentMethod: PaymentMethod;
  paymentDetails?: PaymentDetails;
  timestamp: string;
  transactionHash: string;
  blockNumber: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  approvals: DisbursementApproval[];
  failureReason?: string;
}

export interface DisbursementApproval {
  approver: string;
  approverRole: UserRole;
  timestamp: string;
  signature: string;
}

export interface PaymentDetails {
  method: PaymentMethod;
  provider?: MobileMoneyProvider;
  accountNumber?: string;
  accountName?: string;
  bankCode?: string;
  bankName?: string;
  routingNumber?: string;
  swiftCode?: string;
  phoneNumber?: string;
  walletAddress?: string;
  jurisdiction: Jurisdiction;
  currency: string;
  localCurrency?: string;
  exchangeRate?: number;
  fees?: PaymentFees;
}

export interface PaymentFees {
  platformFee: number;
  networkFee: number;
  exchangeFee?: number;
  withdrawalFee?: number;
  totalFees: number;
  currency: string;
}

export interface MobileMoneyConfig {
  provider: MobileMoneyProvider;
  apiEndpoint: string;
  supportedCountries: Jurisdiction[];
  supportedCurrencies: string[];
  minAmount: number;
  maxAmount: number;
  dailyLimit: number;
  fees: {
    percentage: number;
    flatFee: number;
    currency: string;
  };
}

export interface BankTransferConfig {
  supportedCountries: Jurisdiction[];
  supportedCurrencies: string[];
  processingDays: number;
  minAmount: number;
  maxAmount: number;
  fees: {
    domestic: PaymentFees;
    international: PaymentFees;
  };
}

export interface Report {
  id: string;
  daoId: string;
  milestoneId?: string;
  type: 'progress' | 'financial' | 'impact' | 'audit';
  title: string;
  summary: string;
  content: string;
  metrics: ReportMetric[];
  attachments: ReportAttachment[];
  submittedBy: string;
  submittedAt: string;
  status: ReportStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
  hash: string;
  transactionHash?: string;
}

export interface ReportMetric {
  id: string;
  label: string;
  value: string;
  previousValue?: string;
  change?: number;
  unit?: string;
  target?: string;
  isOnTrack: boolean;
}

export interface ReportAttachment {
  id: string;
  name: string;
  type: string;
  url: string;
  hash: string;
  size: number;
}

export interface UserPermission {
  userId: string;
  userAddress: string;
  role: UserRole;
  permissions: Permission[];
  grantedAt: string;
  grantedBy: string;
  expiresAt?: string;
  isActive: boolean;
  metadata?: Record<string, unknown>;
}

export interface Permission {
  action: string;
  resource: string;
  conditions?: PermissionCondition[];
}

export interface PermissionCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'in' | 'not_in';
  value: unknown;
}

export interface AuditEvent {
  id: string;
  daoId: string;
  type: AuditEventType;
  actor: string;
  actorAddress: string;
  actorRole: UserRole;
  timestamp: string;
  description: string;
  details: Record<string, unknown>;
  transactionHash?: string;
  blockNumber?: number;
  ipfsHash?: string;
  previousState?: Record<string, unknown>;
  newState?: Record<string, unknown>;
}

export interface RegulatoryConfig {
  jurisdiction: Jurisdiction;
  kycRequired: boolean;
  kycLevel: 'basic' | 'enhanced' | 'full';
  amlCheckRequired: boolean;
  maxTransactionLimit: number;
  dailyLimit: number;
  monthlyLimit: number;
  reportingThreshold: number;
  taxWithholding?: number;
  requiredDocuments: string[];
  restrictions: string[];
  complianceNotes: string;
}

export interface DAOContractState {
  daoId: string;
  metadata: ContractMetadata;
  status: ContractStatus;
  pauseReason?: string;
  pausedAt?: string;
  pausedBy?: string;
  escrow: EscrowAccount;
  proposals: ProposalRecord[];
  votes: VoteRecord[];
  permissions: UserPermission[];
  auditTrail: AuditEvent[];
  reports: Report[];
  regulatoryConfig: RegulatoryConfig;
  settings: DAOContractSettings;
}

export interface DAOContractSettings {
  votingPeriodDays: number;
  executionDelayDays: number;
  quorumPercentage: number;
  proposalThreshold: number;
  gracePeriodDays: number;
  autoPauseOnMissedReports: boolean;
  missedReportThreshold: number;
  requiredApprovals: number;
  allowDelegation: boolean;
  maxDelegationDepth: number;
}
