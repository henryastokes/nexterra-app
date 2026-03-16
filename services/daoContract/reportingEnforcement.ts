import {
  Report,
  ReportMetric,
  ReportAttachment,
  ReportStatus,
  ReportingRequirement,
  AuditEvent,
} from './types';

const generateId = () => `rep-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
const generateHash = () => `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;

export interface ReportSubmission {
  daoId: string;
  milestoneId?: string;
  type: Report['type'];
  title: string;
  summary: string;
  content: string;
  metrics: Omit<ReportMetric, 'id'>[];
  attachments?: Omit<ReportAttachment, 'id'>[];
  submittedBy: string;
}

export interface ComplianceStatus {
  isCompliant: boolean;
  totalReports: number;
  submittedReports: number;
  approvedReports: number;
  overdueReports: number;
  pendingReports: number;
  complianceRate: number;
  overdueDetails: {
    requirementId: string;
    milestoneId: string;
    type: string;
    dueDate: string;
    daysOverdue: number;
  }[];
}

export class ReportingEnforcement {
  private reports: Map<string, Report> = new Map();
  private requirements: Map<string, ReportingRequirement[]> = new Map();
  private daoId: string;
  private autoPauseCallback?: (reason: string) => void;

  constructor(daoId: string, autoPauseCallback?: (reason: string) => void) {
    this.daoId = daoId;
    this.autoPauseCallback = autoPauseCallback;
    console.log(`[ReportingEnforcement] Initialized for DAO: ${daoId}`);
  }

  registerRequirements(milestoneId: string, requirements: ReportingRequirement[]): void {
    this.requirements.set(milestoneId, requirements);
    console.log(`[ReportingEnforcement] Registered ${requirements.length} requirements for milestone: ${milestoneId}`);
  }

  submitReport(submission: ReportSubmission): Report | null {
    const hash = generateHash();
    
    const report: Report = {
      id: generateId(),
      daoId: submission.daoId,
      milestoneId: submission.milestoneId,
      type: submission.type,
      title: submission.title,
      summary: submission.summary,
      content: submission.content,
      metrics: submission.metrics.map((m, i) => ({
        ...m,
        id: `metric-${i}`,
        isOnTrack: m.change === undefined || m.change >= 0,
      })),
      attachments: (submission.attachments || []).map((a, i) => ({
        ...a,
        id: `attach-${i}`,
      })),
      submittedBy: submission.submittedBy,
      submittedAt: new Date().toISOString(),
      status: 'submitted',
      hash,
      transactionHash: generateHash(),
    };

    this.reports.set(report.id, report);

    if (submission.milestoneId) {
      const requirements = this.requirements.get(submission.milestoneId);
      if (requirements) {
        const matchingReq = requirements.find(
          r => r.type === submission.type && r.status === 'pending'
        );
        if (matchingReq) {
          matchingReq.status = 'submitted';
          matchingReq.submittedAt = report.submittedAt;
          matchingReq.reportId = report.id;
        }
      }
    }

    console.log(`[ReportingEnforcement] Report submitted: ${report.id}`);
    return report;
  }

  reviewReport(
    reportId: string,
    approved: boolean,
    reviewedBy: string,
    reviewNotes?: string
  ): Report | null {
    const report = this.reports.get(reportId);
    if (!report) {
      console.error(`[ReportingEnforcement] Report not found: ${reportId}`);
      return null;
    }

    if (report.status !== 'submitted') {
      console.error(`[ReportingEnforcement] Report is not pending review`);
      return null;
    }

    report.status = approved ? 'approved' : 'rejected';
    report.reviewedBy = reviewedBy;
    report.reviewedAt = new Date().toISOString();
    report.reviewNotes = reviewNotes;

    if (report.milestoneId) {
      const requirements = this.requirements.get(report.milestoneId);
      if (requirements) {
        const matchingReq = requirements.find(r => r.reportId === reportId);
        if (matchingReq) {
          matchingReq.status = approved ? 'approved' : 'rejected';
        }
      }
    }

    console.log(`[ReportingEnforcement] Report ${approved ? 'approved' : 'rejected'}: ${reportId}`);
    return report;
  }

  checkCompliance(): ComplianceStatus {
    const now = new Date();
    let totalReports = 0;
    let submittedReports = 0;
    let approvedReports = 0;
    let overdueReports = 0;
    let pendingReports = 0;
    const overdueDetails: ComplianceStatus['overdueDetails'] = [];

    this.requirements.forEach((requirements, milestoneId) => {
      requirements.forEach(req => {
        totalReports++;

        switch (req.status) {
          case 'approved':
            approvedReports++;
            submittedReports++;
            break;
          case 'submitted':
            submittedReports++;
            break;
          case 'pending':
            pendingReports++;
            const dueDate = new Date(req.dueDate);
            const gracePeriodEnd = new Date(
              dueDate.getTime() + req.gracePeriodDays * 24 * 60 * 60 * 1000
            );
            if (now > gracePeriodEnd) {
              overdueReports++;
              req.status = 'overdue';
              const daysOverdue = Math.floor(
                (now.getTime() - gracePeriodEnd.getTime()) / (24 * 60 * 60 * 1000)
              );
              overdueDetails.push({
                requirementId: req.id,
                milestoneId,
                type: req.type,
                dueDate: req.dueDate,
                daysOverdue,
              });
            }
            break;
          case 'overdue':
            overdueReports++;
            const dueDateOverdue = new Date(req.dueDate);
            const gracePeriodEndOverdue = new Date(
              dueDateOverdue.getTime() + req.gracePeriodDays * 24 * 60 * 60 * 1000
            );
            const daysOverdue = Math.floor(
              (now.getTime() - gracePeriodEndOverdue.getTime()) / (24 * 60 * 60 * 1000)
            );
            overdueDetails.push({
              requirementId: req.id,
              milestoneId,
              type: req.type,
              dueDate: req.dueDate,
              daysOverdue,
            });
            break;
        }
      });
    });

    const complianceRate = totalReports > 0 
      ? ((approvedReports + submittedReports) / totalReports) * 100 
      : 100;

    const isCompliant = overdueReports === 0;

    if (!isCompliant && this.autoPauseCallback && overdueReports >= 2) {
      this.autoPauseCallback(`${overdueReports} reports overdue`);
    }

    return {
      isCompliant,
      totalReports,
      submittedReports,
      approvedReports,
      overdueReports,
      pendingReports,
      complianceRate,
      overdueDetails,
    };
  }

  getUpcomingDeadlines(daysAhead: number = 30): {
    requirementId: string;
    milestoneId: string;
    type: string;
    dueDate: string;
    daysUntilDue: number;
  }[] {
    const now = new Date();
    const upcoming: ReturnType<typeof this.getUpcomingDeadlines> = [];

    this.requirements.forEach((requirements, milestoneId) => {
      requirements.forEach(req => {
        if (req.status === 'pending') {
          const dueDate = new Date(req.dueDate);
          const daysUntilDue = Math.ceil(
            (dueDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)
          );

          if (daysUntilDue > 0 && daysUntilDue <= daysAhead) {
            upcoming.push({
              requirementId: req.id,
              milestoneId,
              type: req.type,
              dueDate: req.dueDate,
              daysUntilDue,
            });
          }
        }
      });
    });

    return upcoming.sort((a, b) => a.daysUntilDue - b.daysUntilDue);
  }

  getReport(reportId: string): Report | null {
    return this.reports.get(reportId) || null;
  }

  getReportsByType(type: Report['type']): Report[] {
    return Array.from(this.reports.values()).filter(r => r.type === type);
  }

  getReportsByMilestone(milestoneId: string): Report[] {
    return Array.from(this.reports.values()).filter(r => r.milestoneId === milestoneId);
  }

  getAllReports(): Report[] {
    return Array.from(this.reports.values());
  }

  getRequirements(milestoneId: string): ReportingRequirement[] {
    return this.requirements.get(milestoneId) || [];
  }

  generateAuditEvent(reportId: string, action: string, actor: string): AuditEvent | null {
    const report = this.reports.get(reportId);
    if (!report) return null;

    return {
      id: `audit-${Date.now()}`,
      daoId: this.daoId,
      type: 'report_submitted',
      actor,
      actorAddress: '',
      actorRole: 'member',
      timestamp: new Date().toISOString(),
      description: `${action}: ${report.title}`,
      details: {
        reportId,
        reportType: report.type,
        reportStatus: report.status,
        milestoneId: report.milestoneId,
      },
      transactionHash: report.transactionHash,
    };
  }
}

export const createReportingEnforcement = (
  daoId: string,
  autoPauseCallback?: (reason: string) => void
): ReportingEnforcement => {
  return new ReportingEnforcement(daoId, autoPauseCallback);
};
