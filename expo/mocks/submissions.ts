export interface SubmissionAttachment {
  id: string;
  type: 'document' | 'photo' | 'audio' | 'video';
  name: string;
  url: string;
  size: string;
}

export interface ProposalSubmission {
  id: string;
  title: string;
  description: string;
  issueArea: string;
  country: string;
  region?: string;
  budget: number;
  currency: string;
  timeline: {
    startDate: string;
    endDate: string;
    milestones?: string[];
  };
  attachments: SubmissionAttachment[];
  status: 'draft' | 'pending_review' | 'approved' | 'rejected' | 'voting';
  submittedAt: string;
  submittedBy: {
    id: string;
    name: string;
    avatar: string;
  };
  linkedDao?: string;
  votesFor?: number;
  votesAgainst?: number;
}

export interface AskSubmission {
  id: string;
  title: string;
  description: string;
  requestType: 'funding' | 'resources' | 'expertise' | 'collaboration';
  urgency: 'low' | 'medium' | 'high' | 'critical';
  targetAmount?: number;
  currency?: string;
  expertiseNeeded?: string[];
  resourcesNeeded?: string[];
  country?: string;
  region?: string;
  attachments: SubmissionAttachment[];
  status: 'draft' | 'pending_review' | 'approved' | 'rejected' | 'voting' | 'fulfilled';
  submittedAt: string;
  submittedBy: {
    id: string;
    name: string;
    avatar: string;
  };
  linkedDao?: string;
  linkedProposal?: string;
  responseCount?: number;
}

export const issueAreas = [
  'Climate Adaptation',
  'Climate Mitigation',
  'Disease Prevention',
  'Pandemic Preparedness',
  'Water Security',
  'Food Security',
  'Renewable Energy',
  'Healthcare Access',
  'Environmental Conservation',
  'Air Quality',
  'Sanitation',
  'Maternal Health',
  'Infectious Disease',
  'One Health',
];

export const countries = [
  'Nigeria',
  'Kenya',
  'Ghana',
  'South Africa',
  'Ethiopia',
  'Tanzania',
  'Uganda',
  'Rwanda',
  'Senegal',
  'Mali',
  'Niger',
  'Egypt',
  'Morocco',
  'Cameroon',
  "Côte d'Ivoire",
  'Zimbabwe',
  'Zambia',
  'Malawi',
  'Mozambique',
  'DRC',
];

export const regions = [
  'West Africa',
  'East Africa',
  'Southern Africa',
  'North Africa',
  'Central Africa',
  'Sahel',
  'Horn of Africa',
  'Great Lakes',
];

export const expertiseTypes = [
  'Climate Science',
  'Epidemiology',
  'Public Health',
  'Data Science',
  'Agricultural Science',
  'Environmental Science',
  'Community Health',
  'Policy Development',
  'Project Management',
  'Technology Development',
  'Field Research',
  'Grant Writing',
];

export const resourceTypes = [
  'Medical Equipment',
  'Laboratory Supplies',
  'Field Equipment',
  'Transportation',
  'Computing Resources',
  'Office Space',
  'Training Materials',
  'Communication Tools',
];

export const linkedDaos = [
  { id: 'dao1', name: 'Climate Action DAO' },
  { id: 'dao2', name: 'Public Health DAO' },
  { id: 'dao3', name: 'NexTerra Governance DAO' },
  { id: 'dao4', name: 'Blue Carbon DAO' },
  { id: 'dao5', name: 'East Africa Environmental Watch DAO' },
  { id: 'dao6', name: 'Sahel Resilience DAO' },
  { id: 'dao7', name: 'One Health Surveillance DAO' },
];

export const userProposals: ProposalSubmission[] = [
  {
    id: 'prop1',
    title: 'Sahel Water Security Initiative',
    description: 'A comprehensive program to improve water access and management across the Sahel region through community-led infrastructure development.',
    issueArea: 'Water Security',
    country: 'Niger',
    region: 'Sahel',
    budget: 125000,
    currency: 'USDC',
    timeline: {
      startDate: '2025-03-01',
      endDate: '2026-02-28',
      milestones: ['Community Assessment', 'Infrastructure Design', 'Implementation', 'Training'],
    },
    attachments: [
      { id: 'att1', type: 'document', name: 'Proposal_Full.pdf', url: '#', size: '3.2 MB' },
      { id: 'att2', type: 'photo', name: 'Site_Survey.jpg', url: 'https://images.unsplash.com/photo-1541675154750-0444c7d51e8e?w=800', size: '1.4 MB' },
    ],
    status: 'voting',
    submittedAt: '2025-01-15T10:00:00Z',
    submittedBy: {
      id: 'user1',
      name: 'Dr. Amara Diallo',
      avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150',
    },
    linkedDao: 'dao6',
    votesFor: 1250,
    votesAgainst: 340,
  },
];

export const votingProposals: ProposalSubmission[] = [
  {
    id: 'vp1',
    title: 'Sahel Water Security Initiative',
    description: 'A comprehensive program to improve water access and management across the Sahel region through community-led infrastructure development. This initiative will deploy solar-powered water pumps, establish community water management committees, and implement rainwater harvesting systems across 50 villages.',
    issueArea: 'Water Security',
    country: 'Niger',
    region: 'Sahel',
    budget: 125000,
    currency: 'USDC',
    timeline: {
      startDate: '2025-03-01',
      endDate: '2026-02-28',
      milestones: ['Community Assessment', 'Infrastructure Design', 'Implementation', 'Training'],
    },
    attachments: [
      { id: 'att1', type: 'document', name: 'Proposal_Full.pdf', url: '#', size: '3.2 MB' },
      { id: 'att2', type: 'photo', name: 'Site_Survey.jpg', url: 'https://images.unsplash.com/photo-1541675154750-0444c7d51e8e?w=800', size: '1.4 MB' },
      { id: 'att3', type: 'video', name: 'Community_Intro.mp4', url: '#', size: '28 MB' },
    ],
    status: 'voting',
    submittedAt: '2025-01-15T10:00:00Z',
    submittedBy: {
      id: 'user1',
      name: 'Dr. Amara Diallo',
      avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150',
    },
    linkedDao: 'dao6',
    votesFor: 1250,
    votesAgainst: 340,
  },
  {
    id: 'vp2',
    title: 'East Africa Malaria Early Warning System',
    description: 'Deploying AI-powered disease surveillance across Kenya, Uganda, and Tanzania to predict malaria outbreaks 2-4 weeks in advance. The system integrates climate data, mosquito population monitoring, and community health reports.',
    issueArea: 'Disease Prevention',
    country: 'Kenya',
    region: 'East Africa',
    budget: 280000,
    currency: 'USDC',
    timeline: {
      startDate: '2025-04-01',
      endDate: '2026-09-30',
      milestones: ['System Design', 'Data Integration', 'Pilot Deployment', 'Regional Rollout'],
    },
    attachments: [
      { id: 'att4', type: 'document', name: 'Technical_Architecture.pdf', url: '#', size: '5.1 MB' },
      { id: 'att5', type: 'document', name: 'Budget_Breakdown.xlsx', url: '#', size: '890 KB' },
    ],
    status: 'voting',
    submittedAt: '2025-01-18T14:30:00Z',
    submittedBy: {
      id: 'user2',
      name: 'Prof. Wanjiku Muthoni',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
    },
    linkedDao: 'dao2',
    votesFor: 2180,
    votesAgainst: 420,
  },
  {
    id: 'vp3',
    title: 'Blue Carbon Mangrove Restoration - Senegal',
    description: 'Large-scale mangrove restoration along the Saloum Delta to sequester carbon, protect coastlines, and restore fisheries. The project will plant 500,000 mangrove seedlings and establish community-based monitoring.',
    issueArea: 'Climate Mitigation',
    country: 'Senegal',
    region: 'West Africa',
    budget: 195000,
    currency: 'USDC',
    timeline: {
      startDate: '2025-06-01',
      endDate: '2027-05-31',
      milestones: ['Site Assessment', 'Nursery Establishment', 'Planting Phase 1', 'Planting Phase 2', 'Monitoring Setup'],
    },
    attachments: [
      { id: 'att6', type: 'document', name: 'Restoration_Plan.pdf', url: '#', size: '4.2 MB' },
      { id: 'att7', type: 'photo', name: 'Delta_Aerial.jpg', url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800', size: '2.1 MB' },
      { id: 'att8', type: 'audio', name: 'Community_Testimonials.mp3', url: '#', size: '15 MB' },
    ],
    status: 'voting',
    submittedAt: '2025-01-20T09:15:00Z',
    submittedBy: {
      id: 'user3',
      name: 'Dr. Ousmane Sow',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    },
    linkedDao: 'dao4',
    votesFor: 1890,
    votesAgainst: 156,
  },
  {
    id: 'vp4',
    title: 'One Health Surveillance Network - Horn of Africa',
    description: 'Establishing integrated human-animal-environment health monitoring across Ethiopia, Somalia, and Djibouti. Focus on zoonotic disease detection and climate-health linkages in pastoral communities.',
    issueArea: 'One Health',
    country: 'Ethiopia',
    region: 'Horn of Africa',
    budget: 340000,
    currency: 'USDC',
    timeline: {
      startDate: '2025-05-01',
      endDate: '2027-04-30',
      milestones: ['Partnership Building', 'Lab Network Setup', 'Training Program', 'Surveillance Launch'],
    },
    attachments: [
      { id: 'att9', type: 'document', name: 'Network_Design.pdf', url: '#', size: '6.8 MB' },
      { id: 'att10', type: 'document', name: 'MOU_Partners.pdf', url: '#', size: '1.2 MB' },
    ],
    status: 'voting',
    submittedAt: '2025-01-22T11:00:00Z',
    submittedBy: {
      id: 'user4',
      name: 'Dr. Fatima Hassan',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    },
    linkedDao: 'dao7',
    votesFor: 980,
    votesAgainst: 210,
  },
  {
    id: 'vp5',
    title: 'Solar-Powered Cold Chain for Vaccines - Rural Nigeria',
    description: 'Installing solar-powered refrigeration units in 200 rural health centers to maintain vaccine cold chain. Includes IoT monitoring and community health worker training.',
    issueArea: 'Healthcare Access',
    country: 'Nigeria',
    region: 'West Africa',
    budget: 420000,
    currency: 'USDC',
    timeline: {
      startDate: '2025-04-15',
      endDate: '2026-10-15',
      milestones: ['Site Selection', 'Equipment Procurement', 'Installation Phase 1', 'Installation Phase 2', 'Training'],
    },
    attachments: [
      { id: 'att11', type: 'document', name: 'Technical_Specs.pdf', url: '#', size: '3.5 MB' },
      { id: 'att12', type: 'photo', name: 'Pilot_Installation.jpg', url: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=800', size: '1.8 MB' },
    ],
    status: 'voting',
    submittedAt: '2025-01-24T16:45:00Z',
    submittedBy: {
      id: 'user5',
      name: 'Dr. Chukwuemeka Obi',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    },
    linkedDao: 'dao2',
    votesFor: 2450,
    votesAgainst: 180,
  },
];

export const votingAsks: AskSubmission[] = [
  {
    id: 'va1',
    title: 'Mobile Clinic Equipment for Rural Health Outreach',
    description: 'Seeking funding and medical equipment donations to establish mobile health clinics serving underserved rural communities in northern Nigeria. We need diagnostic equipment, basic medicines, and a converted vehicle.',
    requestType: 'resources',
    urgency: 'high',
    targetAmount: 45000,
    currency: 'USDC',
    resourcesNeeded: ['Medical Equipment', 'Transportation', 'Communication Tools'],
    country: 'Nigeria',
    region: 'West Africa',
    attachments: [
      { id: 'att13', type: 'document', name: 'Equipment_List.pdf', url: '#', size: '1.1 MB' },
      { id: 'att14', type: 'video', name: 'Community_Need_Video.mp4', url: '#', size: '45 MB' },
    ],
    status: 'voting',
    submittedAt: '2025-01-20T14:30:00Z',
    submittedBy: {
      id: 'user6',
      name: 'Dr. Aisha Bello',
      avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150',
    },
    linkedDao: 'dao2',
    responseCount: 12,
  },
  {
    id: 'va2',
    title: 'Climate Data Scientists for Sahel Drought Prediction',
    description: 'Urgently seeking 3 experienced climate data scientists to help build predictive models for drought conditions in the Sahel. Remote collaboration possible, 6-month commitment.',
    requestType: 'expertise',
    urgency: 'critical',
    expertiseNeeded: ['Climate Science', 'Data Science', 'Agricultural Science'],
    country: 'Mali',
    region: 'Sahel',
    attachments: [
      { id: 'att15', type: 'document', name: 'Project_Brief.pdf', url: '#', size: '2.3 MB' },
    ],
    status: 'voting',
    submittedAt: '2025-01-21T09:00:00Z',
    submittedBy: {
      id: 'user7',
      name: 'Dr. Ibrahim Touré',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    },
    linkedDao: 'dao1',
    responseCount: 8,
  },
  {
    id: 'va3',
    title: 'Emergency Funding for Cholera Response - DRC',
    description: 'Critical funding needed for emergency cholera response in eastern DRC. Requires oral rehydration supplies, water purification tablets, and community health worker deployment.',
    requestType: 'funding',
    urgency: 'critical',
    targetAmount: 85000,
    currency: 'USDC',
    resourcesNeeded: ['Medical Equipment', 'Laboratory Supplies'],
    country: 'DRC',
    region: 'Central Africa',
    attachments: [
      { id: 'att16', type: 'document', name: 'Situation_Report.pdf', url: '#', size: '1.8 MB' },
      { id: 'att17', type: 'photo', name: 'Field_Assessment.jpg', url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800', size: '1.2 MB' },
      { id: 'att18', type: 'audio', name: 'Field_Worker_Report.mp3', url: '#', size: '8 MB' },
    ],
    status: 'voting',
    submittedAt: '2025-01-23T18:00:00Z',
    submittedBy: {
      id: 'user8',
      name: 'Dr. Marie Kabongo',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    },
    linkedDao: 'dao2',
    responseCount: 24,
  },
  {
    id: 'va4',
    title: 'Lab Equipment Partnership - East Africa TB Research',
    description: 'Seeking collaboration with institutions that can provide or share PCR machines and biosafety equipment for tuberculosis research in rural Tanzania.',
    requestType: 'collaboration',
    urgency: 'medium',
    resourcesNeeded: ['Laboratory Supplies', 'Computing Resources'],
    expertiseNeeded: ['Epidemiology', 'Field Research'],
    country: 'Tanzania',
    region: 'East Africa',
    attachments: [
      { id: 'att19', type: 'document', name: 'Research_Protocol.pdf', url: '#', size: '4.5 MB' },
    ],
    status: 'voting',
    submittedAt: '2025-01-24T10:30:00Z',
    submittedBy: {
      id: 'user9',
      name: 'Prof. John Mwangi',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
    },
    linkedDao: 'dao7',
    linkedProposal: 'vp4',
    responseCount: 6,
  },
  {
    id: 'va5',
    title: 'Funding for Community Air Quality Monitors - Ghana',
    description: 'Seeking $32,000 to deploy low-cost air quality monitoring stations in Accra and surrounding industrial areas. Data will be open-source and linked to health outcome tracking.',
    requestType: 'funding',
    urgency: 'medium',
    targetAmount: 32000,
    currency: 'USDC',
    country: 'Ghana',
    region: 'West Africa',
    attachments: [
      { id: 'att20', type: 'document', name: 'Monitor_Specifications.pdf', url: '#', size: '2.1 MB' },
      { id: 'att21', type: 'photo', name: 'Pilot_Station.jpg', url: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800', size: '980 KB' },
    ],
    status: 'voting',
    submittedAt: '2025-01-25T12:15:00Z',
    submittedBy: {
      id: 'user10',
      name: 'Dr. Kwame Asante',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    },
    linkedDao: 'dao1',
    responseCount: 15,
  },
  {
    id: 'va6',
    title: 'Grant Writers for Climate Adaptation Proposals',
    description: 'Need experienced grant writers familiar with GCF, GEF, and bilateral climate funds to help develop 3 large-scale adaptation proposals for Southern Africa.',
    requestType: 'expertise',
    urgency: 'high',
    expertiseNeeded: ['Grant Writing', 'Policy Development', 'Climate Science'],
    country: 'South Africa',
    region: 'Southern Africa',
    attachments: [
      { id: 'att22', type: 'document', name: 'Concept_Notes.pdf', url: '#', size: '3.8 MB' },
    ],
    status: 'voting',
    submittedAt: '2025-01-26T08:45:00Z',
    submittedBy: {
      id: 'user11',
      name: 'Dr. Nomvula Dlamini',
      avatar: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=150',
    },
    linkedDao: 'dao1',
    responseCount: 9,
  },
];

export const userAsks: AskSubmission[] = [
  {
    id: 'ask1',
    title: 'Mobile Clinic Equipment for Rural Health Outreach',
    description: 'Seeking funding and medical equipment donations to establish mobile health clinics serving underserved rural communities.',
    requestType: 'resources',
    urgency: 'high',
    targetAmount: 45000,
    currency: 'USDC',
    resourcesNeeded: ['Medical Equipment', 'Transportation', 'Communication Tools'],
    country: 'Nigeria',
    region: 'West Africa',
    attachments: [
      { id: 'att3', type: 'document', name: 'Equipment_List.pdf', url: '#', size: '1.1 MB' },
      { id: 'att4', type: 'video', name: 'Community_Need_Video.mp4', url: '#', size: '45 MB' },
    ],
    status: 'voting',
    submittedAt: '2025-01-20T14:30:00Z',
    submittedBy: {
      id: 'user2',
      name: 'Dr. Fatima Al-Hassan',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    },
    linkedDao: 'dao2',
    responseCount: 8,
  },
];

export interface VoteRecord {
  id: string;
  itemId: string;
  itemType: 'proposal' | 'ask';
  userId: string;
  vote: 'yes' | 'no';
  fundingPreference?: 25 | 50 | 100;
  timestamp: string;
  transactionHash: string;
}

export interface FundingItem {
  id: string;
  type: 'proposal' | 'ask';
  title: string;
  description: string;
  issueArea: string;
  country: string;
  region?: string;
  fundingGoal: number;
  fundingRaised: number;
  currency: string;
  votePercentage: 25 | 50;
  votesFor: number;
  votesAgainst: number;
  fundingStartDate: string;
  fundingDeadline: string;
  daysRemaining: number;
  submittedBy: {
    id: string;
    name: string;
    avatar: string;
  };
  linkedDao?: string;
  linkedDaoName?: string;
  attachments: SubmissionAttachment[];
  imageUrl?: string;
}

export const fundingItems: FundingItem[] = [
  {
    id: 'fund1',
    type: 'proposal',
    title: 'Sahel Water Security Initiative',
    description: 'A comprehensive program to improve water access and management across the Sahel region through community-led infrastructure development.',
    issueArea: 'Water Security',
    country: 'Niger',
    region: 'Sahel',
    fundingGoal: 125000,
    fundingRaised: 48750,
    currency: 'USDC',
    votePercentage: 50,
    votesFor: 1250,
    votesAgainst: 340,
    fundingStartDate: '2025-01-20T00:00:00Z',
    fundingDeadline: '2025-02-19T00:00:00Z',
    daysRemaining: 18,
    submittedBy: {
      id: 'user1',
      name: 'Dr. Amara Diallo',
      avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150',
    },
    linkedDao: 'dao6',
    linkedDaoName: 'Sahel Resilience DAO',
    attachments: [
      { id: 'att1', type: 'document', name: 'Proposal_Full.pdf', url: '#', size: '3.2 MB' },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1541675154750-0444c7d51e8e?w=800',
  },
  {
    id: 'fund2',
    type: 'proposal',
    title: 'East Africa Malaria Early Warning System',
    description: 'Deploying AI-powered disease surveillance across Kenya, Uganda, and Tanzania to predict malaria outbreaks 2-4 weeks in advance.',
    issueArea: 'Disease Prevention',
    country: 'Kenya',
    region: 'East Africa',
    fundingGoal: 280000,
    fundingRaised: 156800,
    currency: 'USDC',
    votePercentage: 50,
    votesFor: 2180,
    votesAgainst: 420,
    fundingStartDate: '2025-01-18T00:00:00Z',
    fundingDeadline: '2025-02-17T00:00:00Z',
    daysRemaining: 16,
    submittedBy: {
      id: 'user2',
      name: 'Prof. Wanjiku Muthoni',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
    },
    linkedDao: 'dao2',
    linkedDaoName: 'Public Health DAO',
    attachments: [
      { id: 'att4', type: 'document', name: 'Technical_Architecture.pdf', url: '#', size: '5.1 MB' },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=800',
  },
  {
    id: 'fund3',
    type: 'proposal',
    title: 'Blue Carbon Mangrove Restoration - Senegal',
    description: 'Large-scale mangrove restoration along the Saloum Delta to sequester carbon, protect coastlines, and restore fisheries.',
    issueArea: 'Climate Mitigation',
    country: 'Senegal',
    region: 'West Africa',
    fundingGoal: 195000,
    fundingRaised: 68250,
    currency: 'USDC',
    votePercentage: 25,
    votesFor: 1890,
    votesAgainst: 156,
    fundingStartDate: '2025-01-22T00:00:00Z',
    fundingDeadline: '2025-02-21T00:00:00Z',
    daysRemaining: 20,
    submittedBy: {
      id: 'user3',
      name: 'Dr. Ousmane Sow',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    },
    linkedDao: 'dao4',
    linkedDaoName: 'Blue Carbon DAO',
    attachments: [
      { id: 'att6', type: 'document', name: 'Restoration_Plan.pdf', url: '#', size: '4.2 MB' },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
  },
  {
    id: 'fund4',
    type: 'ask',
    title: 'Mobile Clinic Equipment for Rural Health Outreach',
    description: 'Seeking funding and medical equipment donations to establish mobile health clinics serving underserved rural communities in northern Nigeria.',
    issueArea: 'Healthcare Access',
    country: 'Nigeria',
    region: 'West Africa',
    fundingGoal: 45000,
    fundingRaised: 31500,
    currency: 'USDC',
    votePercentage: 50,
    votesFor: 890,
    votesAgainst: 120,
    fundingStartDate: '2025-01-15T00:00:00Z',
    fundingDeadline: '2025-02-14T00:00:00Z',
    daysRemaining: 13,
    submittedBy: {
      id: 'user6',
      name: 'Dr. Aisha Bello',
      avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150',
    },
    linkedDao: 'dao2',
    linkedDaoName: 'Public Health DAO',
    attachments: [
      { id: 'att13', type: 'document', name: 'Equipment_List.pdf', url: '#', size: '1.1 MB' },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800',
  },
  {
    id: 'fund5',
    type: 'ask',
    title: 'Emergency Funding for Cholera Response - DRC',
    description: 'Critical funding needed for emergency cholera response in eastern DRC. Requires oral rehydration supplies, water purification tablets, and community health worker deployment.',
    issueArea: 'Disease Prevention',
    country: 'DRC',
    region: 'Central Africa',
    fundingGoal: 85000,
    fundingRaised: 72250,
    currency: 'USDC',
    votePercentage: 50,
    votesFor: 1560,
    votesAgainst: 89,
    fundingStartDate: '2025-01-12T00:00:00Z',
    fundingDeadline: '2025-02-11T00:00:00Z',
    daysRemaining: 10,
    submittedBy: {
      id: 'user8',
      name: 'Dr. Marie Kabongo',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    },
    linkedDao: 'dao2',
    linkedDaoName: 'Public Health DAO',
    attachments: [
      { id: 'att16', type: 'document', name: 'Situation_Report.pdf', url: '#', size: '1.8 MB' },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=800',
  },
  {
    id: 'fund6',
    type: 'ask',
    title: 'Community Air Quality Monitors - Ghana',
    description: 'Seeking funding to deploy low-cost air quality monitoring stations in Accra and surrounding industrial areas. Data will be open-source.',
    issueArea: 'Air Quality',
    country: 'Ghana',
    region: 'West Africa',
    fundingGoal: 32000,
    fundingRaised: 11200,
    currency: 'USDC',
    votePercentage: 25,
    votesFor: 720,
    votesAgainst: 180,
    fundingStartDate: '2025-01-25T00:00:00Z',
    fundingDeadline: '2025-02-24T00:00:00Z',
    daysRemaining: 23,
    submittedBy: {
      id: 'user10',
      name: 'Dr. Kwame Asante',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    },
    linkedDao: 'dao1',
    linkedDaoName: 'Climate Action DAO',
    attachments: [
      { id: 'att20', type: 'document', name: 'Monitor_Specifications.pdf', url: '#', size: '2.1 MB' },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800',
  },
  {
    id: 'fund7',
    type: 'proposal',
    title: 'Solar-Powered Cold Chain for Vaccines - Rural Nigeria',
    description: 'Installing solar-powered refrigeration units in 200 rural health centers to maintain vaccine cold chain.',
    issueArea: 'Healthcare Access',
    country: 'Nigeria',
    region: 'West Africa',
    fundingGoal: 420000,
    fundingRaised: 189000,
    currency: 'USDC',
    votePercentage: 50,
    votesFor: 2450,
    votesAgainst: 180,
    fundingStartDate: '2025-01-10T00:00:00Z',
    fundingDeadline: '2025-02-09T00:00:00Z',
    daysRemaining: 8,
    submittedBy: {
      id: 'user5',
      name: 'Dr. Chukwuemeka Obi',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    },
    linkedDao: 'dao2',
    linkedDaoName: 'Public Health DAO',
    attachments: [
      { id: 'att11', type: 'document', name: 'Technical_Specs.pdf', url: '#', size: '3.5 MB' },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=800',
  },
];

export const getFundingDaysRemaining = (fundingDeadline: string): number => {
  const deadline = new Date(fundingDeadline);
  const now = new Date();
  const diff = deadline.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (24 * 60 * 60 * 1000)));
};

export const getFundingProgress = (raised: number, goal: number): number => {
  return Math.min(100, (raised / goal) * 100);
};

export const calculateVotingDeadline = (submittedAt: string): string => {
  const submitted = new Date(submittedAt);
  const deadline = new Date(submitted.getTime() + 7 * 24 * 60 * 60 * 1000);
  return deadline.toISOString();
};

export const getDaysRemaining = (submittedAt: string): number => {
  const deadline = new Date(calculateVotingDeadline(submittedAt));
  const now = new Date();
  const diff = deadline.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (24 * 60 * 60 * 1000)));
};
