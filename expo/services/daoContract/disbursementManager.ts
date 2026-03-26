import {
  MilestoneDefinition,
  MilestoneStatus,
  ReportingRequirement,
  AuditEvent,
} from './types';
import { EscrowManager } from './escrowManager';

const generateHash = () => `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;

export interface MilestoneUpdate {
  milestoneId: string;
  previousStatus: MilestoneStatus;
  newStatus: MilestoneStatus;
  reason: string;
  timestamp: string;
}

export class DisbursementManager {
  private milestones: Map<string, MilestoneDefinition> = new Map();
  private escrowManager: EscrowManager;
  private daoId: string;
  private autoPauseEnabled: boolean;
  private missedReportThreshold: number;
  private gracePeriodDays: number;

  constructor(
    daoId: string,
    escrowManager: EscrowManager,
    options: {
      autoPauseEnabled?: boolean;
      missedReportThreshold?: number;
      gracePeriodDays?: number;
    } = {}
  ) {
    this.daoId = daoId;
    this.escrowManager = escrowManager;
    this.autoPauseEnabled = options.autoPauseEnabled ?? true;
    this.missedReportThreshold = options.missedReportThreshold ?? 2;
    this.gracePeriodDays = options.gracePeriodDays ?? 7;
    console.log(`[DisbursementManager] Initialized for DAO: ${daoId}`);
  }

  registerMilestone(milestone: MilestoneDefinition): void {
    this.milestones.set(milestone.id, milestone);
    
    const escrowState = this.escrowManager.getEscrowState();
    if (escrowState.availableBalance >= milestone.amount) {
      this.escrowManager.lockFundsForMilestone(milestone.id, milestone.amount);
      console.log(`[DisbursementManager] Registered milestone with locked funds: ${milestone.title}`);
    } else {
      console.log(`[DisbursementManager] Registered milestone (funds will be locked when available): ${milestone.title}`);
    }
  }

  registerMilestones(milestones: MilestoneDefinition[]): void {
    milestones.forEach(m => this.registerMilestone(m));
  }

  updateCondition(
    milestoneId: string,
    conditionId: string,
    isMet: boolean,
    verifiedBy: string,
    evidence?: string
  ): MilestoneUpdate | null {
    const milestone = this.milestones.get(milestoneId);
    if (!milestone) {
      console.error(`[DisbursementManager] Milestone not found: ${milestoneId}`);
      return null;
    }

    const condition = milestone.conditions.find(c => c.id === conditionId);
    if (!condition) {
      console.error(`[DisbursementManager] Condition not found: ${conditionId}`);
      return null;
    }

    condition.isMet = isMet;
    condition.verifiedAt = new Date().toISOString();
    condition.verifiedBy = verifiedBy;
    condition.evidence = evidence;

    const allConditionsMet = milestone.conditions.every(c => c.isMet);
    const previousStatus = milestone.status;

    if (allConditionsMet && milestone.status === 'pending') {
      milestone.status = 'released';
      milestone.releasedAt = new Date().toISOString();
      milestone.transactionHash = generateHash();
    }

    console.log(`[DisbursementManager] Condition updated: ${conditionId} = ${isMet}`);
    
    return {
      milestoneId,
      previousStatus,
      newStatus: milestone.status,
      reason: allConditionsMet ? 'All conditions met' : 'Condition verified',
      timestamp: new Date().toISOString(),
    };
  }

  checkReportingCompliance(): {
    compliant: boolean;
    overdue: ReportingRequirement[];
    missedCount: number;
    shouldPause: boolean;
  } {
    const now = new Date();
    const overdue: ReportingRequirement[] = [];
    let missedCount = 0;

    this.milestones.forEach(milestone => {
      milestone.reportingRequirements.forEach(req => {
        if (req.status === 'pending' || req.status === 'overdue') {
          const dueDate = new Date(req.dueDate);
          const gracePeriodEnd = new Date(dueDate.getTime() + req.gracePeriodDays * 24 * 60 * 60 * 1000);

          if (now > gracePeriodEnd) {
            req.status = 'overdue';
            overdue.push(req);
            missedCount++;
          }
        }
      });
    });

    const shouldPause = this.autoPauseEnabled && missedCount >= this.missedReportThreshold;

    return {
      compliant: overdue.length === 0,
      overdue,
      missedCount,
      shouldPause,
    };
  }

  submitReport(milestoneId: string, requirementId: string, reportId: string): boolean {
    const milestone = this.milestones.get(milestoneId);
    if (!milestone) {
      console.error(`[DisbursementManager] Milestone not found: ${milestoneId}`);
      return false;
    }

    const requirement = milestone.reportingRequirements.find(r => r.id === requirementId);
    if (!requirement) {
      console.error(`[DisbursementManager] Requirement not found: ${requirementId}`);
      return false;
    }

    requirement.status = 'submitted';
    requirement.submittedAt = new Date().toISOString();
    requirement.reportId = reportId;

    console.log(`[DisbursementManager] Report submitted for requirement: ${requirementId}`);
    return true;
  }

  approveReport(milestoneId: string, requirementId: string): boolean {
    const milestone = this.milestones.get(milestoneId);
    if (!milestone) return false;

    const requirement = milestone.reportingRequirements.find(r => r.id === requirementId);
    if (!requirement || requirement.status !== 'submitted') return false;

    requirement.status = 'approved';
    console.log(`[DisbursementManager] Report approved: ${requirementId}`);
    return true;
  }

  pauseMilestone(milestoneId: string, reason: string): MilestoneUpdate | null {
    const milestone = this.milestones.get(milestoneId);
    if (!milestone) {
      console.error(`[DisbursementManager] Milestone not found: ${milestoneId}`);
      return null;
    }

    if (milestone.status === 'released' || milestone.status === 'failed') {
      console.error(`[DisbursementManager] Cannot pause milestone in status: ${milestone.status}`);
      return null;
    }

    const previousStatus = milestone.status;
    milestone.status = 'paused';

    console.log(`[DisbursementManager] Milestone paused: ${milestoneId}`);
    
    return {
      milestoneId,
      previousStatus,
      newStatus: 'paused',
      reason,
      timestamp: new Date().toISOString(),
    };
  }

  resumeMilestone(milestoneId: string): MilestoneUpdate | null {
    const milestone = this.milestones.get(milestoneId);
    if (!milestone || milestone.status !== 'paused') {
      console.error(`[DisbursementManager] Cannot resume milestone`);
      return null;
    }

    const previousStatus = milestone.status;
    milestone.status = 'pending';

    console.log(`[DisbursementManager] Milestone resumed: ${milestoneId}`);
    
    return {
      milestoneId,
      previousStatus,
      newStatus: 'pending',
      reason: 'Milestone resumed',
      timestamp: new Date().toISOString(),
    };
  }

  releaseMilestone(milestoneId: string): MilestoneUpdate | null {
    const milestone = this.milestones.get(milestoneId);
    if (!milestone) {
      console.error(`[DisbursementManager] Milestone not found: ${milestoneId}`);
      return null;
    }

    if (milestone.status !== 'pending') {
      console.error(`[DisbursementManager] Milestone not in pending status`);
      return null;
    }

    const allConditionsMet = milestone.conditions.every(c => c.isMet);
    if (!allConditionsMet) {
      console.error(`[DisbursementManager] Not all conditions met`);
      return null;
    }

    const compliance = this.checkReportingCompliance();
    if (!compliance.compliant) {
      console.error(`[DisbursementManager] Reporting requirements not met`);
      return null;
    }

    milestone.status = 'released';
    milestone.releasedAt = new Date().toISOString();
    milestone.transactionHash = generateHash();

    console.log(`[DisbursementManager] Milestone released: ${milestoneId}`);
    
    return {
      milestoneId,
      previousStatus: 'pending',
      newStatus: 'released',
      reason: 'All conditions and requirements met',
      timestamp: new Date().toISOString(),
    };
  }

  getMilestone(milestoneId: string): MilestoneDefinition | null {
    return this.milestones.get(milestoneId) || null;
  }

  getAllMilestones(): MilestoneDefinition[] {
    return Array.from(this.milestones.values());
  }

  getMilestonesByStatus(status: MilestoneStatus): MilestoneDefinition[] {
    return Array.from(this.milestones.values()).filter(m => m.status === status);
  }

  getProgress(): {
    total: number;
    released: number;
    pending: number;
    locked: number;
    paused: number;
    failed: number;
    percentComplete: number;
    amountReleased: number;
    amountPending: number;
  } {
    const milestones = Array.from(this.milestones.values());
    const total = milestones.length;
    const released = milestones.filter(m => m.status === 'released').length;
    const pending = milestones.filter(m => m.status === 'pending').length;
    const locked = milestones.filter(m => m.status === 'locked').length;
    const paused = milestones.filter(m => m.status === 'paused').length;
    const failed = milestones.filter(m => m.status === 'failed').length;

    const amountReleased = milestones
      .filter(m => m.status === 'released')
      .reduce((sum, m) => sum + m.amount, 0);
    const amountPending = milestones
      .filter(m => m.status !== 'released' && m.status !== 'failed')
      .reduce((sum, m) => sum + m.amount, 0);

    return {
      total,
      released,
      pending,
      locked,
      paused,
      failed,
      percentComplete: total > 0 ? (released / total) * 100 : 0,
      amountReleased,
      amountPending,
    };
  }

  generateAuditEvent(milestoneId: string, action: string, actor: string): AuditEvent | null {
    const milestone = this.milestones.get(milestoneId);
    if (!milestone) return null;

    return {
      id: `audit-${Date.now()}`,
      daoId: this.daoId,
      type: 'milestone_released',
      actor,
      actorAddress: '',
      actorRole: 'admin',
      timestamp: new Date().toISOString(),
      description: `${action}: ${milestone.title}`,
      details: {
        milestoneId,
        milestoneTitle: milestone.title,
        milestoneStatus: milestone.status,
        amount: milestone.amount,
      },
      transactionHash: milestone.transactionHash,
    };
  }
}

export const createDisbursementManager = (
  daoId: string,
  escrowManager: EscrowManager,
  options?: {
    autoPauseEnabled?: boolean;
    missedReportThreshold?: number;
    gracePeriodDays?: number;
  }
): DisbursementManager => {
  return new DisbursementManager(daoId, escrowManager, options);
};
