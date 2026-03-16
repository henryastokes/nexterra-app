export interface DAOGovernance {
  structure: 'democratic' | 'weighted' | 'quadratic' | 'delegated';
  description: string;
  quorumRequired: number;
  proposalThreshold: number;
  votingPeriod: number;
  executionDelay: number;
}

export interface VotingRights {
  totalVotingPower: number;
  memberCount: number;
  topHolders: {
    address: string;
    name: string;
    avatar: string;
    votingPower: number;
    percentage: number;
  }[];
}

export interface DisbursementSchedule {
  id: string;
  milestone: string;
  amount: number;
  scheduledDate: string;
  status: 'pending' | 'released' | 'locked';
  conditions: string[];
  transactionHash?: string;
}

export interface BlockchainTransaction {
  id: string;
  type: 'deposit' | 'disbursement' | 'vote' | 'proposal' | 'governance';
  description: string;
  amount?: number;
  currency?: string;
  from: string;
  to?: string;
  timestamp: string;
  transactionHash: string;
  status: 'confirmed' | 'pending';
  blockNumber: number;
}

export interface DAOReport {
  id: string;
  title: string;
  type: 'progress' | 'financial' | 'impact' | 'audit';
  date: string;
  summary: string;
  metrics: {
    label: string;
    value: string;
    change?: number;
  }[];
  attachmentUrl?: string;
}

export interface SmartContractDetails {
  contractAddress: string;
  implementationAddress?: string;
  version: string;
  deployedAt: string;
  isUpgradeable: boolean;
  milestoneLogic: {
    type: 'linear' | 'conditional' | 'milestone-based';
    description: string;
    autoRelease: boolean;
    requiredApprovals: number;
  };
  disbursementRules: {
    minApprovals: number;
    maxSingleDisbursement: number;
    cooldownPeriod: number;
    requiresReport: boolean;
  };
  parentDAO?: {
    id: string;
    name: string;
    contractAddress: string;
  };
  childDAOs?: {
    id: string;
    name: string;
    contractAddress: string;
  }[];
}

export interface DAO {
  id: string;
  name: string;
  description: string;
  type: 'proposal' | 'ask';
  sourceId: string;
  issueArea: string;
  country: string;
  region?: string;
  imageUrl: string;
  createdAt: string;
  status: 'active' | 'completed' | 'paused';
  smartContractAddress: string;
  chainId: string;
  chainName: string;
  governance: DAOGovernance;
  votingRights: VotingRights;
  capitalRaiseTarget: number;
  capitalRaised: number;
  currency: string;
  disbursementSchedule: DisbursementSchedule[];
  totalDisbursed: number;
  transactions: BlockchainTransaction[];
  reports: DAOReport[];
  smartContract: SmartContractDetails;
  leader: {
    id: string;
    name: string;
    avatar: string;
    role: string;
  };
  teamMembers: {
    id: string;
    name: string;
    avatar: string;
    role: string;
  }[];
}

export const daos: DAO[] = [
  {
    id: 'dao-1',
    name: 'Sahel Water Security DAO',
    description: 'A comprehensive program to improve water access and management across the Sahel region through community-led infrastructure development. Deploying solar-powered water pumps and establishing community water management committees.',
    type: 'proposal',
    sourceId: 'vp1',
    issueArea: 'Water Security',
    country: 'Niger',
    region: 'Sahel',
    imageUrl: 'https://images.unsplash.com/photo-1541675154750-0444c7d51e8e?w=800',
    createdAt: '2024-11-15T00:00:00Z',
    status: 'active',
    smartContractAddress: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
    chainId: '137',
    chainName: 'Polygon',
    governance: {
      structure: 'quadratic',
      description: 'Quadratic voting ensures fair representation for all community members regardless of contribution size.',
      quorumRequired: 40,
      proposalThreshold: 100,
      votingPeriod: 7,
      executionDelay: 2,
    },
    votingRights: {
      totalVotingPower: 125000,
      memberCount: 847,
      topHolders: [
        { address: '0x1234...5678', name: 'Dr. Amara Diallo', avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150', votingPower: 12500, percentage: 10 },
        { address: '0x2345...6789', name: 'Niger Water Authority', avatar: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150', votingPower: 8750, percentage: 7 },
        { address: '0x3456...7890', name: 'Community Fund', avatar: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=150', votingPower: 6250, percentage: 5 },
      ],
    },
    capitalRaiseTarget: 125000,
    capitalRaised: 125000,
    currency: 'USDC',
    disbursementSchedule: [
      { id: 'dis-1', milestone: 'Community Assessment Complete', amount: 18750, scheduledDate: '2024-12-01T00:00:00Z', status: 'released', conditions: ['Assessment report approved', 'Community consent obtained'], transactionHash: '0xabc123...def456' },
      { id: 'dis-2', milestone: 'Infrastructure Design Approved', amount: 31250, scheduledDate: '2025-02-01T00:00:00Z', status: 'released', conditions: ['Engineering plans reviewed', 'Environmental impact assessed'], transactionHash: '0xdef456...ghi789' },
      { id: 'dis-3', milestone: 'Phase 1 Implementation', amount: 43750, scheduledDate: '2025-05-01T00:00:00Z', status: 'pending', conditions: ['25 villages completed', 'Quality inspection passed'] },
      { id: 'dis-4', milestone: 'Training & Handover', amount: 31250, scheduledDate: '2025-08-01T00:00:00Z', status: 'locked', conditions: ['All installations operational', 'Local teams trained'] },
    ],
    totalDisbursed: 50000,
    transactions: [
      { id: 'tx-1', type: 'deposit', description: 'Initial funding round complete', amount: 75000, currency: 'USDC', from: 'Funding Pool', timestamp: '2024-11-20T10:00:00Z', transactionHash: '0x111...aaa', status: 'confirmed', blockNumber: 48234567 },
      { id: 'tx-2', type: 'deposit', description: 'Second funding round', amount: 50000, currency: 'USDC', from: 'Community Contributions', timestamp: '2024-12-05T14:30:00Z', transactionHash: '0x222...bbb', status: 'confirmed', blockNumber: 48456789 },
      { id: 'tx-3', type: 'disbursement', description: 'Milestone 1 payment', amount: 18750, currency: 'USDC', from: 'DAO Treasury', to: 'Project Team', timestamp: '2024-12-15T09:00:00Z', transactionHash: '0x333...ccc', status: 'confirmed', blockNumber: 48567890 },
      { id: 'tx-4', type: 'disbursement', description: 'Milestone 2 payment', amount: 31250, currency: 'USDC', from: 'DAO Treasury', to: 'Project Team', timestamp: '2025-02-10T11:00:00Z', transactionHash: '0x444...ddd', status: 'confirmed', blockNumber: 49123456 },
      { id: 'tx-5', type: 'vote', description: 'Milestone 3 approval vote', from: '847 members', timestamp: '2025-01-25T16:00:00Z', transactionHash: '0x555...eee', status: 'confirmed', blockNumber: 49234567 },
    ],
    reports: [
      { id: 'rep-1', title: 'Q4 2024 Progress Report', type: 'progress', date: '2025-01-05T00:00:00Z', summary: 'Successfully completed community assessments in 50 villages. Strong community engagement with 92% participation rate.', metrics: [{ label: 'Villages Assessed', value: '50', change: 100 }, { label: 'Community Meetings', value: '127' }, { label: 'Participation Rate', value: '92%', change: 12 }] },
      { id: 'rep-2', title: 'Financial Audit Report', type: 'audit', date: '2025-01-20T00:00:00Z', summary: 'All expenditures verified and compliant with DAO governance guidelines.', metrics: [{ label: 'Total Disbursed', value: '$50,000' }, { label: 'Variance', value: '0.2%' }, { label: 'Audit Score', value: 'A+' }] },
    ],
    smartContract: {
      contractAddress: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
      implementationAddress: '0x8b3a250d5630B4cF539739dF2C5dAcb4c659F2499E',
      version: '2.1.0',
      deployedAt: '2024-11-15T00:00:00Z',
      isUpgradeable: true,
      milestoneLogic: {
        type: 'milestone-based',
        description: 'Funds released upon completion and verification of each milestone by community vote',
        autoRelease: false,
        requiredApprovals: 3,
      },
      disbursementRules: {
        minApprovals: 3,
        maxSingleDisbursement: 50000,
        cooldownPeriod: 7,
        requiresReport: true,
      },
      parentDAO: {
        id: 'master-dao',
        name: 'NexTerra Master DAO',
        contractAddress: '0x0000000000000000000000000000000000000001',
      },
    },
    leader: { id: 'user1', name: 'Dr. Amara Diallo', avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150', role: 'Project Lead' },
    teamMembers: [
      { id: 'tm-1', name: 'Ibrahim Moussa', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', role: 'Field Coordinator' },
      { id: 'tm-2', name: 'Fatou Seck', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150', role: 'Community Liaison' },
    ],
  },
  {
    id: 'dao-2',
    name: 'East Africa Malaria Warning DAO',
    description: 'AI-powered disease surveillance across Kenya, Uganda, and Tanzania to predict malaria outbreaks 2-4 weeks in advance. Integrates climate data, mosquito population monitoring, and community health reports.',
    type: 'proposal',
    sourceId: 'vp2',
    issueArea: 'Disease Prevention',
    country: 'Kenya',
    region: 'East Africa',
    imageUrl: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=800',
    createdAt: '2024-10-01T00:00:00Z',
    status: 'active',
    smartContractAddress: '0x8b3a250d5630B4cF539739dF2C5dAcb4c659F2499E',
    chainId: '137',
    chainName: 'Polygon',
    governance: {
      structure: 'delegated',
      description: 'Delegated voting allows scientific experts to represent community interests in technical decisions.',
      quorumRequired: 35,
      proposalThreshold: 200,
      votingPeriod: 5,
      executionDelay: 1,
    },
    votingRights: {
      totalVotingPower: 280000,
      memberCount: 1245,
      topHolders: [
        { address: '0x4567...8901', name: 'Prof. Wanjiku Muthoni', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150', votingPower: 28000, percentage: 10 },
        { address: '0x5678...9012', name: 'Kenya Health Ministry', avatar: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150', votingPower: 22400, percentage: 8 },
        { address: '0x6789...0123', name: 'Research Council', avatar: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=150', votingPower: 16800, percentage: 6 },
      ],
    },
    capitalRaiseTarget: 280000,
    capitalRaised: 280000,
    currency: 'USDC',
    disbursementSchedule: [
      { id: 'dis-5', milestone: 'System Design Complete', amount: 42000, scheduledDate: '2024-11-01T00:00:00Z', status: 'released', conditions: ['Architecture approved', 'Data sources confirmed'], transactionHash: '0xaaa111...bbb222' },
      { id: 'dis-6', milestone: 'Data Integration Phase', amount: 70000, scheduledDate: '2025-01-15T00:00:00Z', status: 'released', conditions: ['All data feeds operational', 'ML models trained'], transactionHash: '0xbbb222...ccc333' },
      { id: 'dis-7', milestone: 'Pilot Deployment', amount: 84000, scheduledDate: '2025-04-01T00:00:00Z', status: 'pending', conditions: ['3 districts live', 'Accuracy > 85%'] },
      { id: 'dis-8', milestone: 'Regional Rollout', amount: 84000, scheduledDate: '2025-08-01T00:00:00Z', status: 'locked', conditions: ['All 3 countries operational', 'Government partnerships signed'] },
    ],
    totalDisbursed: 112000,
    transactions: [
      { id: 'tx-6', type: 'deposit', description: 'Full funding secured', amount: 280000, currency: 'USDC', from: 'Multi-donor Pool', timestamp: '2024-10-15T10:00:00Z', transactionHash: '0x666...fff', status: 'confirmed', blockNumber: 47123456 },
      { id: 'tx-7', type: 'disbursement', description: 'System design payment', amount: 42000, currency: 'USDC', from: 'DAO Treasury', to: 'Tech Team', timestamp: '2024-11-10T09:00:00Z', transactionHash: '0x777...ggg', status: 'confirmed', blockNumber: 47456789 },
      { id: 'tx-8', type: 'disbursement', description: 'Data integration payment', amount: 70000, currency: 'USDC', from: 'DAO Treasury', to: 'Tech Team', timestamp: '2025-01-20T11:00:00Z', transactionHash: '0x888...hhh', status: 'confirmed', blockNumber: 49345678 },
    ],
    reports: [
      { id: 'rep-3', title: 'Technical Progress Q1 2025', type: 'progress', date: '2025-01-28T00:00:00Z', summary: 'ML model achieving 87% prediction accuracy in pilot areas. Successfully integrated 15 climate data sources.', metrics: [{ label: 'Prediction Accuracy', value: '87%', change: 12 }, { label: 'Data Sources', value: '15' }, { label: 'Health Centers', value: '234' }] },
      { id: 'rep-4', title: 'Impact Assessment', type: 'impact', date: '2025-01-15T00:00:00Z', summary: 'Early warning alerts have enabled proactive response in 3 pilot districts.', metrics: [{ label: 'Alerts Issued', value: '47' }, { label: 'Response Time', value: '-40%', change: -40 }, { label: 'Cases Prevented', value: '~2,100' }] },
    ],
    smartContract: {
      contractAddress: '0x8b3a250d5630B4cF539739dF2C5dAcb4c659F2499E',
      implementationAddress: '0x9c4b360d5630B4cF539739dF2C5dAcb4c659F2500F',
      version: '2.1.0',
      deployedAt: '2024-10-01T00:00:00Z',
      isUpgradeable: true,
      milestoneLogic: {
        type: 'conditional',
        description: 'Conditional release based on technical deliverables and accuracy metrics',
        autoRelease: false,
        requiredApprovals: 5,
      },
      disbursementRules: {
        minApprovals: 5,
        maxSingleDisbursement: 100000,
        cooldownPeriod: 14,
        requiresReport: true,
      },
      parentDAO: {
        id: 'master-dao',
        name: 'NexTerra Master DAO',
        contractAddress: '0x0000000000000000000000000000000000000001',
      },
    },
    leader: { id: 'user2', name: 'Prof. Wanjiku Muthoni', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150', role: 'Principal Investigator' },
    teamMembers: [
      { id: 'tm-3', name: 'Dr. James Ochieng', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', role: 'Data Scientist' },
      { id: 'tm-4', name: 'Sarah Kamau', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', role: 'Health Coordinator' },
    ],
  },
  {
    id: 'dao-3',
    name: 'Blue Carbon Mangrove DAO',
    description: 'Large-scale mangrove restoration along the Saloum Delta to sequester carbon, protect coastlines, and restore fisheries. Planting 500,000 mangrove seedlings with community-based monitoring.',
    type: 'proposal',
    sourceId: 'vp3',
    issueArea: 'Climate Mitigation',
    country: 'Senegal',
    region: 'West Africa',
    imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
    createdAt: '2024-08-15T00:00:00Z',
    status: 'active',
    smartContractAddress: '0x9c4b360d5630B4cF539739dF2C5dAcb4c659F2500F',
    chainId: '137',
    chainName: 'Polygon',
    governance: {
      structure: 'democratic',
      description: 'One member, one vote ensures equal say for all community stakeholders.',
      quorumRequired: 50,
      proposalThreshold: 50,
      votingPeriod: 10,
      executionDelay: 3,
    },
    votingRights: {
      totalVotingPower: 195000,
      memberCount: 623,
      topHolders: [
        { address: '0x7890...1234', name: 'Dr. Ousmane Sow', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', votingPower: 19500, percentage: 10 },
        { address: '0x8901...2345', name: 'Saloum Fishermen Union', avatar: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150', votingPower: 15600, percentage: 8 },
        { address: '0x9012...3456', name: 'Senegal Environment Agency', avatar: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=150', votingPower: 11700, percentage: 6 },
      ],
    },
    capitalRaiseTarget: 195000,
    capitalRaised: 195000,
    currency: 'USDC',
    disbursementSchedule: [
      { id: 'dis-9', milestone: 'Site Assessment', amount: 19500, scheduledDate: '2024-09-01T00:00:00Z', status: 'released', conditions: ['Mapping complete', 'Baseline data collected'], transactionHash: '0xccc333...ddd444' },
      { id: 'dis-10', milestone: 'Nursery Establishment', amount: 39000, scheduledDate: '2024-11-15T00:00:00Z', status: 'released', conditions: ['Nursery operational', '100k seedlings ready'], transactionHash: '0xddd444...eee555' },
      { id: 'dis-11', milestone: 'Planting Phase 1', amount: 58500, scheduledDate: '2025-03-01T00:00:00Z', status: 'pending', conditions: ['250k seedlings planted', 'Survival rate > 70%'] },
      { id: 'dis-12', milestone: 'Planting Phase 2', amount: 48750, scheduledDate: '2025-09-01T00:00:00Z', status: 'locked', conditions: ['500k seedlings planted', 'Community monitors trained'] },
      { id: 'dis-13', milestone: 'Monitoring Setup', amount: 29250, scheduledDate: '2026-03-01T00:00:00Z', status: 'locked', conditions: ['Carbon sequestration verified', 'Long-term monitoring plan'] },
    ],
    totalDisbursed: 58500,
    transactions: [
      { id: 'tx-9', type: 'deposit', description: 'Climate fund contribution', amount: 120000, currency: 'USDC', from: 'Green Climate Fund', timestamp: '2024-08-20T10:00:00Z', transactionHash: '0x999...iii', status: 'confirmed', blockNumber: 46123456 },
      { id: 'tx-10', type: 'deposit', description: 'Community matching', amount: 75000, currency: 'USDC', from: 'Local Partners', timestamp: '2024-09-05T14:30:00Z', transactionHash: '0xaaa...jjj', status: 'confirmed', blockNumber: 46456789 },
      { id: 'tx-11', type: 'disbursement', description: 'Site assessment', amount: 19500, currency: 'USDC', from: 'DAO Treasury', to: 'Survey Team', timestamp: '2024-09-15T09:00:00Z', transactionHash: '0xbbb...kkk', status: 'confirmed', blockNumber: 46567890 },
      { id: 'tx-12', type: 'disbursement', description: 'Nursery establishment', amount: 39000, currency: 'USDC', from: 'DAO Treasury', to: 'Operations', timestamp: '2024-12-01T11:00:00Z', transactionHash: '0xccc...lll', status: 'confirmed', blockNumber: 48234567 },
    ],
    reports: [
      { id: 'rep-5', title: 'Nursery Operations Report', type: 'progress', date: '2025-01-10T00:00:00Z', summary: '125,000 mangrove seedlings successfully propagated. Nursery infrastructure complete and operational.', metrics: [{ label: 'Seedlings Ready', value: '125,000', change: 25 }, { label: 'Survival Rate', value: '94%' }, { label: 'Species Varieties', value: '4' }] },
      { id: 'rep-6', title: 'Carbon Baseline Assessment', type: 'impact', date: '2024-12-20T00:00:00Z', summary: 'Established baseline carbon stock and projected sequestration rates for project area.', metrics: [{ label: 'Baseline Stock', value: '2,400 tCO2' }, { label: 'Projected Annual', value: '+1,200 tCO2' }, { label: 'Area Mapped', value: '450 ha' }] },
    ],
    smartContract: {
      contractAddress: '0x9c4b360d5630B4cF539739dF2C5dAcb4c659F2500F',
      implementationAddress: '0xad5c470d5630B4cF539739dF2C5dAcb4c659F2611G',
      version: '2.0.0',
      deployedAt: '2024-08-15T00:00:00Z',
      isUpgradeable: true,
      milestoneLogic: {
        type: 'linear',
        description: 'Phased release aligned with planting seasons and survival rate metrics',
        autoRelease: false,
        requiredApprovals: 2,
      },
      disbursementRules: {
        minApprovals: 2,
        maxSingleDisbursement: 60000,
        cooldownPeriod: 30,
        requiresReport: true,
      },
      parentDAO: {
        id: 'master-dao',
        name: 'NexTerra Master DAO',
        contractAddress: '0x0000000000000000000000000000000000000001',
      },
    },
    leader: { id: 'user3', name: 'Dr. Ousmane Sow', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', role: 'Project Director' },
    teamMembers: [
      { id: 'tm-5', name: 'Aminata Diop', avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150', role: 'Community Manager' },
      { id: 'tm-6', name: 'Papa Ndiaye', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', role: 'Nursery Manager' },
    ],
  },
  {
    id: 'dao-4',
    name: 'Cholera Response DAO - DRC',
    description: 'Emergency cholera response in eastern DRC providing oral rehydration supplies, water purification tablets, and community health worker deployment.',
    type: 'ask',
    sourceId: 'va3',
    issueArea: 'Disease Prevention',
    country: 'DRC',
    region: 'Central Africa',
    imageUrl: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=800',
    createdAt: '2024-12-01T00:00:00Z',
    status: 'active',
    smartContractAddress: '0xad5c470d5630B4cF539739dF2C5dAcb4c659F2611G',
    chainId: '137',
    chainName: 'Polygon',
    governance: {
      structure: 'weighted',
      description: 'Weighted voting based on expertise and contribution level for rapid emergency response decisions.',
      quorumRequired: 25,
      proposalThreshold: 50,
      votingPeriod: 3,
      executionDelay: 0,
    },
    votingRights: {
      totalVotingPower: 85000,
      memberCount: 412,
      topHolders: [
        { address: '0x0123...4567', name: 'Dr. Marie Kabongo', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', votingPower: 12750, percentage: 15 },
        { address: '0x1234...5678', name: 'MSF Partnership', avatar: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150', votingPower: 8500, percentage: 10 },
        { address: '0x2345...6789', name: 'WHO Response Team', avatar: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=150', votingPower: 6800, percentage: 8 },
      ],
    },
    capitalRaiseTarget: 85000,
    capitalRaised: 85000,
    currency: 'USDC',
    disbursementSchedule: [
      { id: 'dis-14', milestone: 'Immediate Response', amount: 34000, scheduledDate: '2024-12-05T00:00:00Z', status: 'released', conditions: ['Emergency supplies procured', 'Teams deployed'], transactionHash: '0xeee555...fff666' },
      { id: 'dis-15', milestone: 'Treatment Center Setup', amount: 25500, scheduledDate: '2024-12-20T00:00:00Z', status: 'released', conditions: ['3 centers operational', 'Staff trained'], transactionHash: '0xfff666...ggg777' },
      { id: 'dis-16', milestone: 'Community Prevention', amount: 25500, scheduledDate: '2025-02-01T00:00:00Z', status: 'pending', conditions: ['Water points secured', 'Hygiene education complete'] },
    ],
    totalDisbursed: 59500,
    transactions: [
      { id: 'tx-13', type: 'deposit', description: 'Emergency funding', amount: 85000, currency: 'USDC', from: 'Emergency Response Pool', timestamp: '2024-12-03T08:00:00Z', transactionHash: '0xddd...mmm', status: 'confirmed', blockNumber: 48345678 },
      { id: 'tx-14', type: 'disbursement', description: 'Immediate response', amount: 34000, currency: 'USDC', from: 'DAO Treasury', to: 'Field Team', timestamp: '2024-12-06T10:00:00Z', transactionHash: '0xeee...nnn', status: 'confirmed', blockNumber: 48367890 },
      { id: 'tx-15', type: 'disbursement', description: 'Treatment centers', amount: 25500, currency: 'USDC', from: 'DAO Treasury', to: 'Medical Operations', timestamp: '2024-12-22T14:00:00Z', transactionHash: '0xfff...ooo', status: 'confirmed', blockNumber: 48567890 },
    ],
    reports: [
      { id: 'rep-7', title: 'Emergency Response Report', type: 'progress', date: '2025-01-05T00:00:00Z', summary: 'Successfully contained outbreak in 4 affected districts. Treatment capacity at 95%.', metrics: [{ label: 'Cases Treated', value: '3,847', change: -23 }, { label: 'Mortality Rate', value: '0.8%', change: -65 }, { label: 'Districts Covered', value: '4' }] },
      { id: 'rep-8', title: 'Supply Chain Audit', type: 'audit', date: '2025-01-20T00:00:00Z', summary: 'All medical supplies accounted for. Distribution efficiency at 97%.', metrics: [{ label: 'ORS Distributed', value: '45,000' }, { label: 'Water Tablets', value: '120,000' }, { label: 'Efficiency', value: '97%' }] },
    ],
    smartContract: {
      contractAddress: '0xad5c470d5630B4cF539739dF2C5dAcb4c659F2611G',
      implementationAddress: '0xbe6d580d5630B4cF539739dF2C5dAcb4c659F2722H',
      version: '2.2.0',
      deployedAt: '2024-12-01T00:00:00Z',
      isUpgradeable: true,
      milestoneLogic: {
        type: 'conditional',
        description: 'Emergency fast-track release with reduced approval requirements',
        autoRelease: true,
        requiredApprovals: 2,
      },
      disbursementRules: {
        minApprovals: 2,
        maxSingleDisbursement: 40000,
        cooldownPeriod: 1,
        requiresReport: true,
      },
      parentDAO: {
        id: 'master-dao',
        name: 'NexTerra Master DAO',
        contractAddress: '0x0000000000000000000000000000000000000001',
      },
    },
    leader: { id: 'user8', name: 'Dr. Marie Kabongo', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', role: 'Emergency Coordinator' },
    teamMembers: [
      { id: 'tm-7', name: 'Jean-Pierre Lukusa', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', role: 'Field Director' },
      { id: 'tm-8', name: 'Esther Mwamba', avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150', role: 'Community Health Lead' },
    ],
  },
  {
    id: 'dao-5',
    name: 'One Health Surveillance DAO',
    description: 'Integrated human-animal-environment health monitoring across Ethiopia, Somalia, and Djibouti focusing on zoonotic disease detection and climate-health linkages in pastoral communities.',
    type: 'proposal',
    sourceId: 'vp4',
    issueArea: 'One Health',
    country: 'Ethiopia',
    region: 'Horn of Africa',
    imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800',
    createdAt: '2024-09-15T00:00:00Z',
    status: 'active',
    smartContractAddress: '0xbe6d580d5630B4cF539739dF2C5dAcb4c659F2722H',
    chainId: '137',
    chainName: 'Polygon',
    governance: {
      structure: 'delegated',
      description: 'Multi-stakeholder delegated governance with representatives from health, agriculture, and environment sectors.',
      quorumRequired: 45,
      proposalThreshold: 300,
      votingPeriod: 7,
      executionDelay: 2,
    },
    votingRights: {
      totalVotingPower: 340000,
      memberCount: 1567,
      topHolders: [
        { address: '0x3456...7890', name: 'Dr. Fatima Hassan', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', votingPower: 34000, percentage: 10 },
        { address: '0x4567...8901', name: 'Ethiopia Health Authority', avatar: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150', votingPower: 27200, percentage: 8 },
        { address: '0x5678...9012', name: 'AU-IBAR', avatar: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=150', votingPower: 20400, percentage: 6 },
      ],
    },
    capitalRaiseTarget: 340000,
    capitalRaised: 340000,
    currency: 'USDC',
    disbursementSchedule: [
      { id: 'dis-17', milestone: 'Partnership Building', amount: 51000, scheduledDate: '2024-10-15T00:00:00Z', status: 'released', conditions: ['MOUs signed', 'Steering committee formed'], transactionHash: '0xggg777...hhh888' },
      { id: 'dis-18', milestone: 'Lab Network Setup', amount: 85000, scheduledDate: '2025-01-01T00:00:00Z', status: 'released', conditions: ['5 labs equipped', 'Sample transport system'], transactionHash: '0xhhh888...iii999' },
      { id: 'dis-19', milestone: 'Training Program', amount: 102000, scheduledDate: '2025-05-01T00:00:00Z', status: 'pending', conditions: ['300 health workers trained', 'Curriculum approved'] },
      { id: 'dis-20', milestone: 'Surveillance Launch', amount: 102000, scheduledDate: '2025-10-01T00:00:00Z', status: 'locked', conditions: ['All 3 countries operational', 'Data sharing agreement'] },
    ],
    totalDisbursed: 136000,
    transactions: [
      { id: 'tx-16', type: 'deposit', description: 'Multi-donor funding', amount: 340000, currency: 'USDC', from: 'Global Health Initiative', timestamp: '2024-09-20T10:00:00Z', transactionHash: '0xggg...ppp', status: 'confirmed', blockNumber: 46789012 },
      { id: 'tx-17', type: 'disbursement', description: 'Partnership building', amount: 51000, currency: 'USDC', from: 'DAO Treasury', to: 'Admin Team', timestamp: '2024-10-20T09:00:00Z', transactionHash: '0xhhh...qqq', status: 'confirmed', blockNumber: 47012345 },
      { id: 'tx-18', type: 'disbursement', description: 'Lab network setup', amount: 85000, currency: 'USDC', from: 'DAO Treasury', to: 'Lab Operations', timestamp: '2025-01-10T11:00:00Z', transactionHash: '0xiii...rrr', status: 'confirmed', blockNumber: 49123456 },
    ],
    reports: [
      { id: 'rep-9', title: 'Network Establishment Report', type: 'progress', date: '2025-01-25T00:00:00Z', summary: 'Successfully established partnerships with health ministries in all 3 countries. 5 sentinel labs now operational.', metrics: [{ label: 'Partner Institutions', value: '23' }, { label: 'Labs Operational', value: '5' }, { label: 'Sample Capacity', value: '500/week' }] },
    ],
    smartContract: {
      contractAddress: '0xbe6d580d5630B4cF539739dF2C5dAcb4c659F2722H',
      implementationAddress: '0xcf7e690d5630B4cF539739dF2C5dAcb4c659F2833I',
      version: '2.1.0',
      deployedAt: '2024-09-15T00:00:00Z',
      isUpgradeable: true,
      milestoneLogic: {
        type: 'milestone-based',
        description: 'Multi-stakeholder approval with delegated voting from health authorities',
        autoRelease: false,
        requiredApprovals: 4,
      },
      disbursementRules: {
        minApprovals: 4,
        maxSingleDisbursement: 120000,
        cooldownPeriod: 21,
        requiresReport: true,
      },
      parentDAO: {
        id: 'master-dao',
        name: 'NexTerra Master DAO',
        contractAddress: '0x0000000000000000000000000000000000000001',
      },
      childDAOs: [
        { id: 'dao-5-eth', name: 'Ethiopia One Health Unit', contractAddress: '0xeth001...' },
        { id: 'dao-5-som', name: 'Somalia One Health Unit', contractAddress: '0xsom001...' },
      ],
    },
    leader: { id: 'user4', name: 'Dr. Fatima Hassan', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', role: 'Program Director' },
    teamMembers: [
      { id: 'tm-9', name: 'Dr. Ahmed Yusuf', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', role: 'Veterinary Lead' },
      { id: 'tm-10', name: 'Hawa Mohamud', avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150', role: 'Regional Coordinator' },
    ],
  },
  {
    id: 'dao-6',
    name: 'Mobile Health Clinics DAO - Nigeria',
    description: 'Mobile health clinics serving underserved rural communities in northern Nigeria with diagnostic equipment, basic medicines, and converted vehicles.',
    type: 'ask',
    sourceId: 'va1',
    issueArea: 'Healthcare Access',
    country: 'Nigeria',
    region: 'West Africa',
    imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800',
    createdAt: '2024-11-01T00:00:00Z',
    status: 'completed',
    smartContractAddress: '0xcf7e690d5630B4cF539739dF2C5dAcb4c659F2833I',
    chainId: '137',
    chainName: 'Polygon',
    governance: {
      structure: 'democratic',
      description: 'Community-driven governance with equal voting rights for all stakeholders.',
      quorumRequired: 40,
      proposalThreshold: 25,
      votingPeriod: 5,
      executionDelay: 1,
    },
    votingRights: {
      totalVotingPower: 45000,
      memberCount: 289,
      topHolders: [
        { address: '0x6789...0123', name: 'Dr. Aisha Bello', avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150', votingPower: 6750, percentage: 15 },
        { address: '0x7890...1234', name: 'Kano Health Network', avatar: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150', votingPower: 4500, percentage: 10 },
        { address: '0x8901...2345', name: 'Community Trust', avatar: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=150', votingPower: 3600, percentage: 8 },
      ],
    },
    capitalRaiseTarget: 45000,
    capitalRaised: 45000,
    currency: 'USDC',
    disbursementSchedule: [
      { id: 'dis-21', milestone: 'Equipment Procurement', amount: 27000, scheduledDate: '2024-11-15T00:00:00Z', status: 'released', conditions: ['Equipment sourced', 'Quality verified'], transactionHash: '0xiii999...jjjaaa' },
      { id: 'dis-22', milestone: 'Vehicle Conversion', amount: 13500, scheduledDate: '2024-12-15T00:00:00Z', status: 'released', conditions: ['Vehicles converted', 'Safety inspection'], transactionHash: '0xjjjaaa...kkkbbb' },
      { id: 'dis-23', milestone: 'Operations Launch', amount: 4500, scheduledDate: '2025-01-15T00:00:00Z', status: 'released', conditions: ['Team trained', 'Routes established'], transactionHash: '0xkkkbbb...lllccc' },
    ],
    totalDisbursed: 45000,
    transactions: [
      { id: 'tx-19', type: 'deposit', description: 'Full funding received', amount: 45000, currency: 'USDC', from: 'Health Donors Pool', timestamp: '2024-11-10T10:00:00Z', transactionHash: '0xjjj...sss', status: 'confirmed', blockNumber: 47890123 },
      { id: 'tx-20', type: 'disbursement', description: 'Equipment procurement', amount: 27000, currency: 'USDC', from: 'DAO Treasury', to: 'Procurement Team', timestamp: '2024-11-20T09:00:00Z', transactionHash: '0xkkk...ttt', status: 'confirmed', blockNumber: 48012345 },
      { id: 'tx-21', type: 'disbursement', description: 'Vehicle conversion', amount: 13500, currency: 'USDC', from: 'DAO Treasury', to: 'Operations', timestamp: '2024-12-20T11:00:00Z', transactionHash: '0xlll...uuu', status: 'confirmed', blockNumber: 48345678 },
      { id: 'tx-22', type: 'disbursement', description: 'Operations launch', amount: 4500, currency: 'USDC', from: 'DAO Treasury', to: 'Operations', timestamp: '2025-01-18T14:00:00Z', transactionHash: '0xmmm...vvv', status: 'confirmed', blockNumber: 49234567 },
    ],
    reports: [
      { id: 'rep-10', title: 'Project Completion Report', type: 'progress', date: '2025-01-28T00:00:00Z', summary: 'Successfully launched 3 mobile health clinics serving 12 rural communities. Over 2,500 patients treated in first month.', metrics: [{ label: 'Clinics Operational', value: '3' }, { label: 'Communities Served', value: '12' }, { label: 'Patients Treated', value: '2,547' }] },
      { id: 'rep-11', title: 'Final Financial Report', type: 'financial', date: '2025-01-30T00:00:00Z', summary: 'All funds disbursed and accounted for. Project delivered under budget.', metrics: [{ label: 'Total Spent', value: '$44,280' }, { label: 'Under Budget', value: '$720' }, { label: 'Cost per Patient', value: '$17.38' }] },
    ],
    smartContract: {
      contractAddress: '0xcf7e690d5630B4cF539739dF2C5dAcb4c659F2833I',
      implementationAddress: '0xdg8f7a0d5630B4cF539739dF2C5dAcb4c659F2944J',
      version: '2.0.0',
      deployedAt: '2024-11-01T00:00:00Z',
      isUpgradeable: true,
      milestoneLogic: {
        type: 'linear',
        description: 'Sequential milestone release with community verification',
        autoRelease: false,
        requiredApprovals: 2,
      },
      disbursementRules: {
        minApprovals: 2,
        maxSingleDisbursement: 30000,
        cooldownPeriod: 5,
        requiresReport: true,
      },
      parentDAO: {
        id: 'master-dao',
        name: 'NexTerra Master DAO',
        contractAddress: '0x0000000000000000000000000000000000000001',
      },
    },
    leader: { id: 'user6', name: 'Dr. Aisha Bello', avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150', role: 'Project Lead' },
    teamMembers: [
      { id: 'tm-11', name: 'Mohammed Garba', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', role: 'Operations Manager' },
      { id: 'tm-12', name: 'Hauwa Suleiman', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150', role: 'Nurse Coordinator' },
    ],
  },
];

export const getDAOProgress = (dao: DAO): number => {
  return (dao.totalDisbursed / dao.capitalRaised) * 100;
};

export const getDAOsByStatus = (status: 'active' | 'completed' | 'paused'): DAO[] => {
  return daos.filter(dao => dao.status === status);
};

export const getDAOsByType = (type: 'proposal' | 'ask'): DAO[] => {
  return daos.filter(dao => dao.type === type);
};
