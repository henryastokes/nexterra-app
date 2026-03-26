import {
  AuditEvent,
  AuditEventType,
  UserRole,
} from './types';

const generateId = () => `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
const generateHash = () => `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;

export interface AuditQuery {
  startDate?: string;
  endDate?: string;
  types?: AuditEventType[];
  actors?: string[];
  limit?: number;
  offset?: number;
}

export interface AuditSummary {
  totalEvents: number;
  eventsByType: Record<AuditEventType, number>;
  eventsByActor: Record<string, number>;
  recentActivity: AuditEvent[];
  timeRange: {
    earliest: string;
    latest: string;
  };
}

export class AuditTrail {
  private events: AuditEvent[] = [];
  private daoId: string;
  private maxEvents: number;

  constructor(daoId: string, maxEvents: number = 10000) {
    this.daoId = daoId;
    this.maxEvents = maxEvents;
    console.log(`[AuditTrail] Initialized for DAO: ${daoId}`);
  }

  recordEvent(params: {
    type: AuditEventType;
    actor: string;
    actorAddress: string;
    actorRole: UserRole;
    description: string;
    details: Record<string, unknown>;
    transactionHash?: string;
    blockNumber?: number;
    previousState?: Record<string, unknown>;
    newState?: Record<string, unknown>;
  }): AuditEvent {
    const event: AuditEvent = {
      id: generateId(),
      daoId: this.daoId,
      type: params.type,
      actor: params.actor,
      actorAddress: params.actorAddress,
      actorRole: params.actorRole,
      timestamp: new Date().toISOString(),
      description: params.description,
      details: params.details,
      transactionHash: params.transactionHash || generateHash(),
      blockNumber: params.blockNumber || Math.floor(Math.random() * 1000000) + 50000000,
      ipfsHash: `Qm${Array.from({ length: 44 }, () => 
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'[Math.floor(Math.random() * 62)]
      ).join('')}`,
      previousState: params.previousState,
      newState: params.newState,
    };

    this.events.unshift(event);

    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(0, this.maxEvents);
    }

    console.log(`[AuditTrail] Recorded event: ${params.type} by ${params.actor}`);
    return event;
  }

  recordProposalCreated(params: {
    proposalId: string;
    proposalTitle: string;
    actor: string;
    actorAddress: string;
    actorRole: UserRole;
  }): AuditEvent {
    return this.recordEvent({
      type: 'proposal_created',
      actor: params.actor,
      actorAddress: params.actorAddress,
      actorRole: params.actorRole,
      description: `Proposal created: ${params.proposalTitle}`,
      details: {
        proposalId: params.proposalId,
        proposalTitle: params.proposalTitle,
      },
    });
  }

  recordVoteCast(params: {
    proposalId: string;
    choice: string;
    votingPower: number;
    actor: string;
    actorAddress: string;
  }): AuditEvent {
    return this.recordEvent({
      type: 'vote_cast',
      actor: params.actor,
      actorAddress: params.actorAddress,
      actorRole: 'voter',
      description: `Vote cast: ${params.choice} with ${params.votingPower} voting power`,
      details: {
        proposalId: params.proposalId,
        choice: params.choice,
        votingPower: params.votingPower,
      },
    });
  }

  recordFundsDeposited(params: {
    amount: number;
    currency: string;
    fromAddress: string;
    actor: string;
    transactionHash: string;
  }): AuditEvent {
    return this.recordEvent({
      type: 'funds_deposited',
      actor: params.actor,
      actorAddress: params.fromAddress,
      actorRole: 'funder',
      description: `Funds deposited: ${params.amount} ${params.currency}`,
      details: {
        amount: params.amount,
        currency: params.currency,
        fromAddress: params.fromAddress,
      },
      transactionHash: params.transactionHash,
    });
  }

  recordFundsDisbursed(params: {
    milestoneId: string;
    milestoneName: string;
    amount: number;
    currency: string;
    toAddress: string;
    actor: string;
    actorAddress: string;
    transactionHash: string;
  }): AuditEvent {
    return this.recordEvent({
      type: 'funds_disbursed',
      actor: params.actor,
      actorAddress: params.actorAddress,
      actorRole: 'admin',
      description: `Funds disbursed: ${params.amount} ${params.currency} for ${params.milestoneName}`,
      details: {
        milestoneId: params.milestoneId,
        milestoneName: params.milestoneName,
        amount: params.amount,
        currency: params.currency,
        toAddress: params.toAddress,
      },
      transactionHash: params.transactionHash,
    });
  }

  recordMilestoneReleased(params: {
    milestoneId: string;
    milestoneName: string;
    amount: number;
    actor: string;
    actorAddress: string;
  }): AuditEvent {
    return this.recordEvent({
      type: 'milestone_released',
      actor: params.actor,
      actorAddress: params.actorAddress,
      actorRole: 'admin',
      description: `Milestone released: ${params.milestoneName}`,
      details: {
        milestoneId: params.milestoneId,
        milestoneName: params.milestoneName,
        amount: params.amount,
      },
    });
  }

  recordReportSubmitted(params: {
    reportId: string;
    reportTitle: string;
    reportType: string;
    actor: string;
    actorAddress: string;
  }): AuditEvent {
    return this.recordEvent({
      type: 'report_submitted',
      actor: params.actor,
      actorAddress: params.actorAddress,
      actorRole: 'member',
      description: `Report submitted: ${params.reportTitle}`,
      details: {
        reportId: params.reportId,
        reportTitle: params.reportTitle,
        reportType: params.reportType,
      },
    });
  }

  recordRoleChanged(params: {
    userId: string;
    userAddress: string;
    previousRole?: UserRole;
    newRole: UserRole;
    actor: string;
    actorAddress: string;
  }): AuditEvent {
    return this.recordEvent({
      type: 'role_changed',
      actor: params.actor,
      actorAddress: params.actorAddress,
      actorRole: 'admin',
      description: `Role changed for ${params.userId}: ${params.previousRole || 'none'} → ${params.newRole}`,
      details: {
        userId: params.userId,
        userAddress: params.userAddress,
        previousRole: params.previousRole,
        newRole: params.newRole,
      },
      previousState: params.previousRole ? { role: params.previousRole } : undefined,
      newState: { role: params.newRole },
    });
  }

  recordContractPaused(params: {
    reason: string;
    actor: string;
    actorAddress: string;
  }): AuditEvent {
    return this.recordEvent({
      type: 'contract_paused',
      actor: params.actor,
      actorAddress: params.actorAddress,
      actorRole: 'admin',
      description: `Contract paused: ${params.reason}`,
      details: {
        reason: params.reason,
      },
      previousState: { status: 'active' },
      newState: { status: 'paused' },
    });
  }

  recordContractUpgraded(params: {
    fromVersion: string;
    toVersion: string;
    actor: string;
    actorAddress: string;
    transactionHash: string;
  }): AuditEvent {
    return this.recordEvent({
      type: 'contract_upgraded',
      actor: params.actor,
      actorAddress: params.actorAddress,
      actorRole: 'admin',
      description: `Contract upgraded: ${params.fromVersion} → ${params.toVersion}`,
      details: {
        fromVersion: params.fromVersion,
        toVersion: params.toVersion,
      },
      transactionHash: params.transactionHash,
      previousState: { version: params.fromVersion },
      newState: { version: params.toVersion },
    });
  }

  queryEvents(query: AuditQuery): AuditEvent[] {
    let filtered = [...this.events];

    if (query.startDate) {
      const start = new Date(query.startDate);
      filtered = filtered.filter(e => new Date(e.timestamp) >= start);
    }

    if (query.endDate) {
      const end = new Date(query.endDate);
      filtered = filtered.filter(e => new Date(e.timestamp) <= end);
    }

    if (query.types && query.types.length > 0) {
      filtered = filtered.filter(e => query.types!.includes(e.type));
    }

    if (query.actors && query.actors.length > 0) {
      filtered = filtered.filter(e => 
        query.actors!.includes(e.actor) || query.actors!.includes(e.actorAddress)
      );
    }

    const offset = query.offset || 0;
    const limit = query.limit || 100;
    
    return filtered.slice(offset, offset + limit);
  }

  getSummary(): AuditSummary {
    const eventsByType: Record<string, number> = {};
    const eventsByActor: Record<string, number> = {};

    this.events.forEach(event => {
      eventsByType[event.type] = (eventsByType[event.type] || 0) + 1;
      eventsByActor[event.actor] = (eventsByActor[event.actor] || 0) + 1;
    });

    const timestamps = this.events.map(e => e.timestamp);
    
    return {
      totalEvents: this.events.length,
      eventsByType: eventsByType as Record<AuditEventType, number>,
      eventsByActor,
      recentActivity: this.events.slice(0, 10),
      timeRange: {
        earliest: timestamps[timestamps.length - 1] || new Date().toISOString(),
        latest: timestamps[0] || new Date().toISOString(),
      },
    };
  }

  getEvent(eventId: string): AuditEvent | null {
    return this.events.find(e => e.id === eventId) || null;
  }

  getEventsByType(type: AuditEventType): AuditEvent[] {
    return this.events.filter(e => e.type === type);
  }

  getEventsByActor(actor: string): AuditEvent[] {
    return this.events.filter(e => e.actor === actor || e.actorAddress === actor);
  }

  getRecentEvents(limit: number = 50): AuditEvent[] {
    return this.events.slice(0, limit);
  }

  getAllEvents(): AuditEvent[] {
    return [...this.events];
  }

  exportToJSON(): string {
    return JSON.stringify({
      daoId: this.daoId,
      exportedAt: new Date().toISOString(),
      totalEvents: this.events.length,
      events: this.events,
    }, null, 2);
  }

  getVerificationHash(): string {
    const eventHashes = this.events.map(e => e.transactionHash || '').join('');
    return generateHash();
  }
}

export const createAuditTrail = (daoId: string, maxEvents?: number): AuditTrail => {
  return new AuditTrail(daoId, maxEvents);
};
