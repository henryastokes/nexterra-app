export interface EconomicsPool {
  id: string;
  name: string;
  description: string;
  balance: number;
  allocationPercentage: number;
  targetPercentage: number;
  currency: string;
  lastUpdated: string;
  inflows30d: number;
  outflows30d: number;
  contractAddress: string;
  isOnChain: boolean;
}

export interface AllocationVote {
  id: string;
  proposalId: string;
  title: string;
  description: string;
  proposedAllocations: {
    poolId: string;
    currentPercentage: number;
    proposedPercentage: number;
  }[];
  status: 'active' | 'passed' | 'rejected' | 'executed';
  votesFor: number;
  votesAgainst: number;
  totalVotingPower: number;
  quorumRequired: number;
  quorumReached: boolean;
  startDate: string;
  endDate: string;
  executedAt?: string;
  transactionHash?: string;
}

export interface OnChainEnforcement {
  contractAddress: string;
  lastSyncBlock: number;
  lastSyncTimestamp: string;
  enforcementRules: {
    id: string;
    rule: string;
    isActive: boolean;
    lastEnforced: string;
    transactionHash: string;
  }[];
  autoRebalance: boolean;
  rebalanceThreshold: number;
  nextScheduledRebalance: string;
}

export interface EconomicsSnapshot {
  timestamp: string;
  totalValue: number;
  pools: {
    poolId: string;
    value: number;
    percentage: number;
  }[];
}

export const economicsPools: EconomicsPool[] = [
  {
    id: 'operations',
    name: 'Operations Pool',
    description: 'Funds allocated for day-to-day platform operations, maintenance, team compensation, and infrastructure costs.',
    balance: 1250000,
    allocationPercentage: 25,
    targetPercentage: 25,
    currency: 'USDC',
    lastUpdated: '2026-02-01T12:00:00Z',
    inflows30d: 180000,
    outflows30d: 145000,
    contractAddress: '0x1234567890abcdef1234567890abcdef12345678',
    isOnChain: true,
  },
  {
    id: 'treasury',
    name: 'Treasury Pool',
    description: 'Reserve funds for emergency situations, unexpected opportunities, and long-term stability. Requires multi-sig approval for withdrawals.',
    balance: 2750000,
    allocationPercentage: 55,
    targetPercentage: 55,
    currency: 'USDC',
    lastUpdated: '2026-02-01T12:00:00Z',
    inflows30d: 420000,
    outflows30d: 85000,
    contractAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
    isOnChain: true,
  },
  {
    id: 'strategic',
    name: 'Strategic Investment Pool',
    description: 'Capital allocated for strategic initiatives, partnerships, ecosystem growth, and high-impact project investments.',
    balance: 1000000,
    allocationPercentage: 20,
    targetPercentage: 20,
    currency: 'USDC',
    lastUpdated: '2026-02-01T12:00:00Z',
    inflows30d: 150000,
    outflows30d: 220000,
    contractAddress: '0x7890abcdef1234567890abcdef1234567890abcd',
    isOnChain: true,
  },
];

export const allocationVotes: AllocationVote[] = [
  {
    id: 'av-1',
    proposalId: 'prop-eco-001',
    title: 'Q1 2026 Allocation Rebalance',
    description: 'Proposal to increase Strategic Investment Pool allocation by 5% to fund new partnership initiatives in East Africa.',
    proposedAllocations: [
      { poolId: 'operations', currentPercentage: 25, proposedPercentage: 23 },
      { poolId: 'treasury', currentPercentage: 55, proposedPercentage: 52 },
      { poolId: 'strategic', currentPercentage: 20, proposedPercentage: 25 },
    ],
    status: 'active',
    votesFor: 156000,
    votesAgainst: 42000,
    totalVotingPower: 340000,
    quorumRequired: 136000,
    quorumReached: true,
    startDate: '2026-01-28T00:00:00Z',
    endDate: '2026-02-07T00:00:00Z',
  },
  {
    id: 'av-2',
    proposalId: 'prop-eco-002',
    title: 'Emergency Operations Boost',
    description: 'Temporary increase to Operations Pool to handle surge in platform activity and new DAO onboarding.',
    proposedAllocations: [
      { poolId: 'operations', currentPercentage: 25, proposedPercentage: 30 },
      { poolId: 'treasury', currentPercentage: 55, proposedPercentage: 52 },
      { poolId: 'strategic', currentPercentage: 20, proposedPercentage: 18 },
    ],
    status: 'executed',
    votesFor: 198000,
    votesAgainst: 28000,
    totalVotingPower: 340000,
    quorumRequired: 136000,
    quorumReached: true,
    startDate: '2025-12-15T00:00:00Z',
    endDate: '2025-12-25T00:00:00Z',
    executedAt: '2025-12-26T10:00:00Z',
    transactionHash: '0xabc123def456789...',
  },
  {
    id: 'av-3',
    proposalId: 'prop-eco-003',
    title: 'Treasury Reserve Increase',
    description: 'Build up treasury reserves ahead of potential market volatility and to ensure 18-month operational runway.',
    proposedAllocations: [
      { poolId: 'operations', currentPercentage: 25, proposedPercentage: 22 },
      { poolId: 'treasury', currentPercentage: 55, proposedPercentage: 60 },
      { poolId: 'strategic', currentPercentage: 20, proposedPercentage: 18 },
    ],
    status: 'rejected',
    votesFor: 89000,
    votesAgainst: 142000,
    totalVotingPower: 340000,
    quorumRequired: 136000,
    quorumReached: true,
    startDate: '2025-11-01T00:00:00Z',
    endDate: '2025-11-11T00:00:00Z',
  },
];

export const onChainEnforcement: OnChainEnforcement = {
  contractAddress: '0x0000000000000000000000000000000000000001',
  lastSyncBlock: 52345678,
  lastSyncTimestamp: '2026-02-02T08:30:00Z',
  enforcementRules: [
    {
      id: 'rule-1',
      rule: 'Allocation ratios must match DAO-voted percentages within 2% tolerance',
      isActive: true,
      lastEnforced: '2026-02-01T00:00:00Z',
      transactionHash: '0xdef789abc123...',
    },
    {
      id: 'rule-2',
      rule: 'Treasury withdrawals require 3/5 multi-sig approval',
      isActive: true,
      lastEnforced: '2026-01-28T14:22:00Z',
      transactionHash: '0x456abc789def...',
    },
    {
      id: 'rule-3',
      rule: 'Auto-rebalance triggers when deviation exceeds 5%',
      isActive: true,
      lastEnforced: '2026-01-15T09:00:00Z',
      transactionHash: '0x789def123abc...',
    },
    {
      id: 'rule-4',
      rule: 'Daily inflow caps: Operations $50K, Strategic $100K',
      isActive: true,
      lastEnforced: '2026-02-01T23:59:00Z',
      transactionHash: '0xabc456def789...',
    },
  ],
  autoRebalance: true,
  rebalanceThreshold: 5,
  nextScheduledRebalance: '2026-02-15T00:00:00Z',
};

export const economicsHistory: EconomicsSnapshot[] = [
  {
    timestamp: '2026-02-01T00:00:00Z',
    totalValue: 5000000,
    pools: [
      { poolId: 'operations', value: 1250000, percentage: 25 },
      { poolId: 'treasury', value: 2750000, percentage: 55 },
      { poolId: 'strategic', value: 1000000, percentage: 20 },
    ],
  },
  {
    timestamp: '2026-01-01T00:00:00Z',
    totalValue: 4650000,
    pools: [
      { poolId: 'operations', value: 1162500, percentage: 25 },
      { poolId: 'treasury', value: 2557500, percentage: 55 },
      { poolId: 'strategic', value: 930000, percentage: 20 },
    ],
  },
  {
    timestamp: '2025-12-01T00:00:00Z',
    totalValue: 4200000,
    pools: [
      { poolId: 'operations', value: 1260000, percentage: 30 },
      { poolId: 'treasury', value: 2184000, percentage: 52 },
      { poolId: 'strategic', value: 756000, percentage: 18 },
    ],
  },
  {
    timestamp: '2025-11-01T00:00:00Z',
    totalValue: 3800000,
    pools: [
      { poolId: 'operations', value: 950000, percentage: 25 },
      { poolId: 'treasury', value: 2090000, percentage: 55 },
      { poolId: 'strategic', value: 760000, percentage: 20 },
    ],
  },
];

export const getTotalEconomicsValue = (): number => {
  return economicsPools.reduce((acc, pool) => acc + pool.balance, 0);
};

export const getPoolById = (id: string): EconomicsPool | undefined => {
  return economicsPools.find(pool => pool.id === id);
};

export const getActiveAllocationVotes = (): AllocationVote[] => {
  return allocationVotes.filter(vote => vote.status === 'active');
};
