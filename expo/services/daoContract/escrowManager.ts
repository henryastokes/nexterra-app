import {
  EscrowAccount,
  EscrowDeposit,
  EscrowDisbursement,
  PaymentMethod,
  PaymentDetails,
  DisbursementApproval,
  UserRole,
} from './types';

const generateId = () => `esc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
const generateHash = () => `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;

export class EscrowManager {
  private escrow: EscrowAccount;
  private requiredApprovals: number;
  private daoId: string;

  constructor(daoId: string, contractAddress: string, currency: string, requiredApprovals: number = 2) {
    this.daoId = daoId;
    this.requiredApprovals = requiredApprovals;
    this.escrow = {
      id: generateId(),
      daoId,
      contractAddress,
      totalDeposited: 0,
      totalDisbursed: 0,
      availableBalance: 0,
      lockedBalance: 0,
      pendingDisbursements: 0,
      currency,
      createdAt: new Date().toISOString(),
      lastActivityAt: new Date().toISOString(),
      deposits: [],
      disbursements: [],
    };
    console.log(`[EscrowManager] Initialized for DAO: ${daoId}`);
  }

  deposit(params: {
    amount: number;
    fromAddress: string;
    fromName?: string;
    paymentMethod: PaymentMethod;
  }): EscrowDeposit | null {
    if (params.amount <= 0) {
      console.error(`[EscrowManager] Invalid deposit amount: ${params.amount}`);
      return null;
    }

    const deposit: EscrowDeposit = {
      id: `dep-${Date.now()}`,
      escrowId: this.escrow.id,
      amount: params.amount,
      currency: this.escrow.currency,
      fromAddress: params.fromAddress,
      fromName: params.fromName,
      paymentMethod: params.paymentMethod,
      timestamp: new Date().toISOString(),
      transactionHash: generateHash(),
      blockNumber: Math.floor(Math.random() * 1000000) + 50000000,
      status: 'confirmed',
    };

    this.escrow.deposits.push(deposit);
    this.escrow.totalDeposited += params.amount;
    this.escrow.availableBalance += params.amount;
    this.escrow.lastActivityAt = new Date().toISOString();

    console.log(`[EscrowManager] Deposit received: ${params.amount} ${this.escrow.currency}`);
    return deposit;
  }

  lockFundsForMilestone(milestoneId: string, amount: number): boolean {
    if (amount > this.escrow.availableBalance) {
      console.error(`[EscrowManager] Insufficient available balance for lock`);
      return false;
    }

    this.escrow.availableBalance -= amount;
    this.escrow.lockedBalance += amount;
    this.escrow.lastActivityAt = new Date().toISOString();

    console.log(`[EscrowManager] Locked ${amount} for milestone: ${milestoneId}`);
    return true;
  }

  unlockFunds(amount: number): boolean {
    if (amount > this.escrow.lockedBalance) {
      console.error(`[EscrowManager] Cannot unlock more than locked balance`);
      return false;
    }

    this.escrow.lockedBalance -= amount;
    this.escrow.availableBalance += amount;
    this.escrow.lastActivityAt = new Date().toISOString();

    console.log(`[EscrowManager] Unlocked ${amount}`);
    return true;
  }

  initiateDisbursement(params: {
    milestoneId: string;
    amount: number;
    toAddress: string;
    toName?: string;
    paymentMethod: PaymentMethod;
    paymentDetails?: PaymentDetails;
  }): EscrowDisbursement | null {
    if (params.amount > this.escrow.lockedBalance) {
      console.error(`[EscrowManager] Insufficient locked balance for disbursement`);
      return null;
    }

    const disbursement: EscrowDisbursement = {
      id: `dis-${Date.now()}`,
      escrowId: this.escrow.id,
      milestoneId: params.milestoneId,
      amount: params.amount,
      currency: this.escrow.currency,
      toAddress: params.toAddress,
      toName: params.toName,
      paymentMethod: params.paymentMethod,
      paymentDetails: params.paymentDetails,
      timestamp: new Date().toISOString(),
      transactionHash: generateHash(),
      blockNumber: Math.floor(Math.random() * 1000000) + 50000000,
      status: 'pending',
      approvals: [],
    };

    this.escrow.disbursements.push(disbursement);
    this.escrow.pendingDisbursements += params.amount;
    this.escrow.lastActivityAt = new Date().toISOString();

    console.log(`[EscrowManager] Disbursement initiated: ${params.amount} to ${params.toAddress}`);
    return disbursement;
  }

  approveDisbursement(
    disbursementId: string,
    approver: string,
    approverRole: UserRole,
    signature: string
  ): boolean {
    const disbursement = this.escrow.disbursements.find(d => d.id === disbursementId);
    if (!disbursement) {
      console.error(`[EscrowManager] Disbursement not found: ${disbursementId}`);
      return false;
    }

    if (disbursement.status !== 'pending') {
      console.error(`[EscrowManager] Disbursement is not pending approval`);
      return false;
    }

    const hasApproved = disbursement.approvals.some(a => a.approver === approver);
    if (hasApproved) {
      console.error(`[EscrowManager] Approver has already approved`);
      return false;
    }

    const approval: DisbursementApproval = {
      approver,
      approverRole,
      timestamp: new Date().toISOString(),
      signature,
    };

    disbursement.approvals.push(approval);

    if (disbursement.approvals.length >= this.requiredApprovals) {
      this.executeDisbursement(disbursementId);
    }

    console.log(`[EscrowManager] Approval added for disbursement: ${disbursementId}`);
    return true;
  }

  private executeDisbursement(disbursementId: string): boolean {
    const disbursement = this.escrow.disbursements.find(d => d.id === disbursementId);
    if (!disbursement) return false;

    disbursement.status = 'processing';

    setTimeout(() => {
      disbursement.status = 'completed';
      this.escrow.lockedBalance -= disbursement.amount;
      this.escrow.totalDisbursed += disbursement.amount;
      this.escrow.pendingDisbursements -= disbursement.amount;
      this.escrow.lastActivityAt = new Date().toISOString();
      console.log(`[EscrowManager] Disbursement completed: ${disbursementId}`);
    }, 1000);

    return true;
  }

  rejectDisbursement(disbursementId: string, reason: string): boolean {
    const disbursement = this.escrow.disbursements.find(d => d.id === disbursementId);
    if (!disbursement) {
      console.error(`[EscrowManager] Disbursement not found: ${disbursementId}`);
      return false;
    }

    if (disbursement.status !== 'pending') {
      console.error(`[EscrowManager] Cannot reject non-pending disbursement`);
      return false;
    }

    disbursement.status = 'failed';
    disbursement.failureReason = reason;
    this.escrow.pendingDisbursements -= disbursement.amount;
    this.escrow.lastActivityAt = new Date().toISOString();

    console.log(`[EscrowManager] Disbursement rejected: ${disbursementId}`);
    return true;
  }

  getEscrowState(): EscrowAccount {
    return { ...this.escrow };
  }

  getDeposits(): EscrowDeposit[] {
    return [...this.escrow.deposits];
  }

  getDisbursements(): EscrowDisbursement[] {
    return [...this.escrow.disbursements];
  }

  getPendingDisbursements(): EscrowDisbursement[] {
    return this.escrow.disbursements.filter(d => d.status === 'pending');
  }

  getBalance(): {
    total: number;
    available: number;
    locked: number;
    pending: number;
    disbursed: number;
  } {
    return {
      total: this.escrow.totalDeposited,
      available: this.escrow.availableBalance,
      locked: this.escrow.lockedBalance,
      pending: this.escrow.pendingDisbursements,
      disbursed: this.escrow.totalDisbursed,
    };
  }
}

export const createEscrowManager = (
  daoId: string,
  contractAddress: string,
  currency: string,
  requiredApprovals?: number
): EscrowManager => {
  return new EscrowManager(daoId, contractAddress, currency, requiredApprovals);
};
