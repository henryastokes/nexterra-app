import {
  ProposalRecord,
  ProposalStatus,
  ProposalAttachment,
  MilestoneDefinition,
  AuditEvent,
} from './types';

const generateId = () => `prop-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
const generateHash = () => `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;

export class ProposalRegistry {
  private proposals: Map<string, ProposalRecord> = new Map();
  private daoId: string;

  constructor(daoId: string) {
    this.daoId = daoId;
    console.log(`[ProposalRegistry] Initialized for DAO: ${daoId}`);
  }

  createProposal(params: {
    title: string;
    description: string;
    type: ProposalRecord['type'];
    proposer: string;
    proposerAddress: string;
    requestedAmount?: number;
    currency?: string;
    milestones?: MilestoneDefinition[];
    attachments?: ProposalAttachment[];
    metadata?: Record<string, unknown>;
  }): ProposalRecord {
    const now = new Date().toISOString();
    const proposal: ProposalRecord = {
      id: generateId(),
      daoId: this.daoId,
      title: params.title,
      description: params.description,
      type: params.type,
      status: 'draft',
      proposer: params.proposer,
      proposerAddress: params.proposerAddress,
      createdAt: now,
      updatedAt: now,
      requestedAmount: params.requestedAmount,
      currency: params.currency,
      milestones: params.milestones || [],
      attachments: params.attachments || [],
      metadata: params.metadata || {},
    };

    this.proposals.set(proposal.id, proposal);
    console.log(`[ProposalRegistry] Created proposal: ${proposal.id}`);
    return proposal;
  }

  submitProposal(proposalId: string): ProposalRecord | null {
    const proposal = this.proposals.get(proposalId);
    if (!proposal) {
      console.error(`[ProposalRegistry] Proposal not found: ${proposalId}`);
      return null;
    }

    if (proposal.status !== 'draft') {
      console.error(`[ProposalRegistry] Cannot submit proposal in status: ${proposal.status}`);
      return null;
    }

    proposal.status = 'pending';
    proposal.updatedAt = new Date().toISOString();
    proposal.transactionHash = generateHash();
    proposal.blockNumber = Math.floor(Math.random() * 1000000) + 50000000;

    console.log(`[ProposalRegistry] Submitted proposal: ${proposalId}`);
    return proposal;
  }

  activateVoting(proposalId: string, votingPeriodDays: number): ProposalRecord | null {
    const proposal = this.proposals.get(proposalId);
    if (!proposal) {
      console.error(`[ProposalRegistry] Proposal not found: ${proposalId}`);
      return null;
    }

    if (proposal.status !== 'pending') {
      console.error(`[ProposalRegistry] Cannot activate voting for proposal in status: ${proposal.status}`);
      return null;
    }

    const now = new Date();
    const endDate = new Date(now.getTime() + votingPeriodDays * 24 * 60 * 60 * 1000);

    proposal.status = 'active';
    proposal.votingStartsAt = now.toISOString();
    proposal.votingEndsAt = endDate.toISOString();
    proposal.updatedAt = now.toISOString();

    console.log(`[ProposalRegistry] Activated voting for proposal: ${proposalId}`);
    return proposal;
  }

  updateStatus(proposalId: string, status: ProposalStatus): ProposalRecord | null {
    const proposal = this.proposals.get(proposalId);
    if (!proposal) {
      console.error(`[ProposalRegistry] Proposal not found: ${proposalId}`);
      return null;
    }

    const validTransitions: Record<ProposalStatus, ProposalStatus[]> = {
      draft: ['pending', 'cancelled'],
      pending: ['active', 'cancelled'],
      active: ['passed', 'rejected', 'cancelled'],
      passed: ['executed'],
      rejected: [],
      executed: [],
      cancelled: [],
    };

    if (!validTransitions[proposal.status].includes(status)) {
      console.error(`[ProposalRegistry] Invalid status transition: ${proposal.status} -> ${status}`);
      return null;
    }

    proposal.status = status;
    proposal.updatedAt = new Date().toISOString();

    if (status === 'executed') {
      proposal.executedAt = new Date().toISOString();
    }

    console.log(`[ProposalRegistry] Updated proposal status: ${proposalId} -> ${status}`);
    return proposal;
  }

  addAttachment(proposalId: string, attachment: ProposalAttachment): ProposalRecord | null {
    const proposal = this.proposals.get(proposalId);
    if (!proposal) {
      console.error(`[ProposalRegistry] Proposal not found: ${proposalId}`);
      return null;
    }

    if (proposal.status !== 'draft') {
      console.error(`[ProposalRegistry] Cannot add attachments to submitted proposal`);
      return null;
    }

    proposal.attachments.push(attachment);
    proposal.updatedAt = new Date().toISOString();

    console.log(`[ProposalRegistry] Added attachment to proposal: ${proposalId}`);
    return proposal;
  }

  getProposal(proposalId: string): ProposalRecord | null {
    return this.proposals.get(proposalId) || null;
  }

  getProposalsByStatus(status: ProposalStatus): ProposalRecord[] {
    return Array.from(this.proposals.values()).filter(p => p.status === status);
  }

  getActiveProposals(): ProposalRecord[] {
    const now = new Date();
    return Array.from(this.proposals.values()).filter(p => {
      if (p.status !== 'active') return false;
      if (p.votingEndsAt && new Date(p.votingEndsAt) < now) return false;
      return true;
    });
  }

  getAllProposals(): ProposalRecord[] {
    return Array.from(this.proposals.values());
  }

  checkVotingDeadlines(): ProposalRecord[] {
    const now = new Date();
    const expiredProposals: ProposalRecord[] = [];

    this.proposals.forEach(proposal => {
      if (proposal.status === 'active' && proposal.votingEndsAt) {
        if (new Date(proposal.votingEndsAt) < now) {
          expiredProposals.push(proposal);
        }
      }
    });

    return expiredProposals;
  }

  generateAuditEvent(proposalId: string, action: string, actor: string): AuditEvent | null {
    const proposal = this.proposals.get(proposalId);
    if (!proposal) return null;

    return {
      id: `audit-${Date.now()}`,
      daoId: this.daoId,
      type: 'proposal_created',
      actor,
      actorAddress: proposal.proposerAddress,
      actorRole: 'proposer',
      timestamp: new Date().toISOString(),
      description: `${action}: ${proposal.title}`,
      details: {
        proposalId,
        proposalTitle: proposal.title,
        proposalType: proposal.type,
        proposalStatus: proposal.status,
      },
      transactionHash: proposal.transactionHash,
      blockNumber: proposal.blockNumber,
    };
  }
}

export const createProposalRegistry = (daoId: string): ProposalRegistry => {
  return new ProposalRegistry(daoId);
};
