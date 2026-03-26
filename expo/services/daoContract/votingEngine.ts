import {
  VoteRecord,
  VoteChoice,
  FundingPreference,
  VotingSnapshot,
  DAOContractSettings,
} from './types';

const generateId = () => `vote-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
const generateHash = () => `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;

export interface VoterInfo {
  address: string;
  name: string;
  votingPower: number;
  delegatedPower: number;
  delegatedFrom: string[];
}

export interface DelegationRecord {
  id: string;
  delegator: string;
  delegatorAddress: string;
  delegate: string;
  delegateAddress: string;
  votingPower: number;
  createdAt: string;
  expiresAt?: string;
  isActive: boolean;
}

export class VotingEngine {
  private votes: Map<string, VoteRecord[]> = new Map();
  private delegations: Map<string, DelegationRecord> = new Map();
  private voterRegistry: Map<string, VoterInfo> = new Map();
  private settings: DAOContractSettings;
  private daoId: string;

  constructor(daoId: string, settings: DAOContractSettings) {
    this.daoId = daoId;
    this.settings = settings;
    console.log(`[VotingEngine] Initialized for DAO: ${daoId}`);
  }

  registerVoter(voter: VoterInfo): void {
    this.voterRegistry.set(voter.address, voter);
    console.log(`[VotingEngine] Registered voter: ${voter.name} (${voter.address})`);
  }

  castVote(params: {
    proposalId: string;
    voter: string;
    voterAddress: string;
    choice: VoteChoice;
    fundingPreference?: FundingPreference;
  }): VoteRecord | null {
    const voterInfo = this.voterRegistry.get(params.voterAddress);
    if (!voterInfo) {
      console.error(`[VotingEngine] Voter not registered: ${params.voterAddress}`);
      return null;
    }

    const existingVotes = this.votes.get(params.proposalId) || [];
    const hasVoted = existingVotes.some(v => v.voterAddress === params.voterAddress);
    if (hasVoted) {
      console.error(`[VotingEngine] Voter has already voted on this proposal`);
      return null;
    }

    const totalPower = voterInfo.votingPower + voterInfo.delegatedPower;

    const vote: VoteRecord = {
      id: generateId(),
      proposalId: params.proposalId,
      voter: params.voter,
      voterAddress: params.voterAddress,
      choice: params.choice,
      fundingPreference: params.fundingPreference,
      votingPower: totalPower,
      timestamp: new Date().toISOString(),
      transactionHash: generateHash(),
      blockNumber: Math.floor(Math.random() * 1000000) + 50000000,
      signature: generateHash().slice(0, 130),
    };

    existingVotes.push(vote);
    this.votes.set(params.proposalId, existingVotes);

    console.log(`[VotingEngine] Vote cast: ${params.voter} voted ${params.choice} on ${params.proposalId}`);
    return vote;
  }

  delegate(params: {
    delegator: string;
    delegatorAddress: string;
    delegate: string;
    delegateAddress: string;
    votingPower: number;
    expiresAt?: string;
  }): DelegationRecord | null {
    if (!this.settings.allowDelegation) {
      console.error(`[VotingEngine] Delegation is not allowed in this DAO`);
      return null;
    }

    const delegatorInfo = this.voterRegistry.get(params.delegatorAddress);
    if (!delegatorInfo) {
      console.error(`[VotingEngine] Delegator not registered`);
      return null;
    }

    if (params.votingPower > delegatorInfo.votingPower) {
      console.error(`[VotingEngine] Cannot delegate more power than owned`);
      return null;
    }

    const delegation: DelegationRecord = {
      id: `del-${Date.now()}`,
      delegator: params.delegator,
      delegatorAddress: params.delegatorAddress,
      delegate: params.delegate,
      delegateAddress: params.delegateAddress,
      votingPower: params.votingPower,
      createdAt: new Date().toISOString(),
      expiresAt: params.expiresAt,
      isActive: true,
    };

    this.delegations.set(delegation.id, delegation);

    const delegateInfo = this.voterRegistry.get(params.delegateAddress);
    if (delegateInfo) {
      delegateInfo.delegatedPower += params.votingPower;
      delegateInfo.delegatedFrom.push(params.delegatorAddress);
    }

    delegatorInfo.votingPower -= params.votingPower;

    console.log(`[VotingEngine] Delegation created: ${params.delegator} -> ${params.delegate}`);
    return delegation;
  }

  revokeDelegation(delegationId: string): boolean {
    const delegation = this.delegations.get(delegationId);
    if (!delegation || !delegation.isActive) {
      console.error(`[VotingEngine] Delegation not found or inactive`);
      return false;
    }

    delegation.isActive = false;

    const delegatorInfo = this.voterRegistry.get(delegation.delegatorAddress);
    const delegateInfo = this.voterRegistry.get(delegation.delegateAddress);

    if (delegatorInfo) {
      delegatorInfo.votingPower += delegation.votingPower;
    }

    if (delegateInfo) {
      delegateInfo.delegatedPower -= delegation.votingPower;
      delegateInfo.delegatedFrom = delegateInfo.delegatedFrom.filter(
        addr => addr !== delegation.delegatorAddress
      );
    }

    console.log(`[VotingEngine] Delegation revoked: ${delegationId}`);
    return true;
  }

  getVotingSnapshot(proposalId: string, totalVotingPower: number): VotingSnapshot {
    const votes = this.votes.get(proposalId) || [];

    let yesVotes = 0;
    let noVotes = 0;
    let abstainVotes = 0;
    let yesPower = 0;
    let noPower = 0;
    let abstainPower = 0;
    const fundingPreferences: VotingSnapshot['fundingPreferences'] = {
      '25': 0,
      '50': 0,
      '100': 0,
    };

    votes.forEach(vote => {
      switch (vote.choice) {
        case 'yes':
          yesVotes++;
          yesPower += vote.votingPower;
          if (vote.fundingPreference) {
            fundingPreferences[vote.fundingPreference]++;
          }
          break;
        case 'no':
          noVotes++;
          noPower += vote.votingPower;
          break;
        case 'abstain':
          abstainVotes++;
          abstainPower += vote.votingPower;
          break;
      }
    });

    const totalVotedPower = yesPower + noPower + abstainPower;
    const participationRate = totalVotingPower > 0 
      ? (totalVotedPower / totalVotingPower) * 100 
      : 0;
    const quorumReached = participationRate >= this.settings.quorumPercentage;

    return {
      proposalId,
      totalVotingPower,
      totalVotes: votes.length,
      yesVotes,
      noVotes,
      abstainVotes,
      yesPower,
      noPower,
      abstainPower,
      fundingPreferences,
      quorumReached,
      quorumRequired: this.settings.quorumPercentage,
      participationRate,
    };
  }

  determineOutcome(proposalId: string, totalVotingPower: number): {
    passed: boolean;
    reason: string;
    snapshot: VotingSnapshot;
    recommendedFunding?: FundingPreference;
  } {
    const snapshot = this.getVotingSnapshot(proposalId, totalVotingPower);

    if (!snapshot.quorumReached) {
      return {
        passed: false,
        reason: `Quorum not reached. Required: ${snapshot.quorumRequired}%, Got: ${snapshot.participationRate.toFixed(1)}%`,
        snapshot,
      };
    }

    const passed = snapshot.yesPower > snapshot.noPower;
    const reason = passed
      ? `Proposal passed with ${snapshot.yesVotes} yes votes (${snapshot.yesPower} voting power)`
      : `Proposal rejected with ${snapshot.noVotes} no votes (${snapshot.noPower} voting power)`;

    let recommendedFunding: FundingPreference | undefined;
    if (passed) {
      const maxPref = Object.entries(snapshot.fundingPreferences).reduce(
        (max, [key, val]) => (val > max.val ? { key, val } : max),
        { key: '100', val: 0 }
      );
      recommendedFunding = maxPref.key as FundingPreference;
    }

    return {
      passed,
      reason,
      snapshot,
      recommendedFunding,
    };
  }

  getVotesForProposal(proposalId: string): VoteRecord[] {
    return this.votes.get(proposalId) || [];
  }

  getVoterVote(proposalId: string, voterAddress: string): VoteRecord | null {
    const votes = this.votes.get(proposalId) || [];
    return votes.find(v => v.voterAddress === voterAddress) || null;
  }

  getActiveDelegations(): DelegationRecord[] {
    return Array.from(this.delegations.values()).filter(d => d.isActive);
  }

  getVoterInfo(voterAddress: string): VoterInfo | null {
    return this.voterRegistry.get(voterAddress) || null;
  }

  updateSettings(settings: Partial<DAOContractSettings>): void {
    this.settings = { ...this.settings, ...settings };
    console.log(`[VotingEngine] Settings updated`);
  }
}

export const createVotingEngine = (
  daoId: string,
  settings: DAOContractSettings
): VotingEngine => {
  return new VotingEngine(daoId, settings);
};
