export type TimePeriod = 'all_time' | 'this_year' | 'this_quarter' | 'this_month';

export interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  avatar: string;
  affiliation?: string;
  country: string;
}

export interface FunderEntry extends LeaderboardEntry {
  totalCapitalDeployed: number;
  projectsFunded: number;
  avgProjectSize: number;
  topIssueAreas: string[];
}

export interface ResearcherEntry extends LeaderboardEntry {
  completedDAOs: number;
  totalFundingSecured: number;
  avgImpactScore: number;
  specializations: string[];
}

export interface PractitionerEntry extends LeaderboardEntry {
  verifiedMilestones: number;
  fieldUpdates: number;
  implementationRate: number;
  regionsActive: string[];
}

export interface InstitutionEntry extends LeaderboardEntry {
  impactFootprint: number;
  membersOnPlatform: number;
  daosParticipated: number;
  countriesReached: number;
}

export const timePeriodLabels: Record<TimePeriod, string> = {
  all_time: 'All Time',
  this_year: '2026',
  this_quarter: 'Q1 2026',
  this_month: 'January 2026',
};

export const funderLeaderboard: FunderEntry[] = [
  {
    id: 'funder_001',
    rank: 1,
    name: 'Bill & Melinda Gates Foundation',
    avatar: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=400',
    country: 'Global',
    totalCapitalDeployed: 45000000,
    projectsFunded: 127,
    avgProjectSize: 354331,
    topIssueAreas: ['Disease Surveillance', 'Pandemic Prevention', 'Public Health'],
  },
  {
    id: 'funder_002',
    rank: 2,
    name: 'African Development Bank',
    avatar: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400',
    country: 'Pan-African',
    totalCapitalDeployed: 32000000,
    projectsFunded: 89,
    avgProjectSize: 359551,
    topIssueAreas: ['Climate Adaptation', 'Water Systems', 'Agriculture'],
  },
  {
    id: 'funder_003',
    rank: 3,
    name: 'Wellcome Trust',
    avatar: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400',
    country: 'Global',
    totalCapitalDeployed: 28500000,
    projectsFunded: 76,
    avgProjectSize: 375000,
    topIssueAreas: ['Pandemic Prevention', 'Disease Surveillance'],
  },
  {
    id: 'funder_004',
    rank: 4,
    name: 'Open Society Foundations',
    avatar: 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=400',
    country: 'Global',
    totalCapitalDeployed: 21000000,
    projectsFunded: 64,
    avgProjectSize: 328125,
    topIssueAreas: ['Policy Research', 'Community Health', 'Public Health'],
  },
  {
    id: 'funder_005',
    rank: 5,
    name: 'USAID',
    avatar: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=400',
    country: 'Global',
    totalCapitalDeployed: 18750000,
    projectsFunded: 53,
    avgProjectSize: 353774,
    topIssueAreas: ['Environmental Health', 'Water Systems', 'Agriculture'],
  },
  {
    id: 'funder_006',
    rank: 6,
    name: 'Mastercard Foundation',
    avatar: 'https://images.unsplash.com/photo-1553484771-371a605b060b?w=400',
    country: 'Global',
    totalCapitalDeployed: 15200000,
    projectsFunded: 41,
    avgProjectSize: 370732,
    topIssueAreas: ['Agriculture', 'Community Health', 'Data Science'],
  },
  {
    id: 'funder_007',
    rank: 7,
    name: 'AfriHealth Ventures',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400',
    affiliation: 'Daniel Okoro',
    country: 'Nigeria',
    totalCapitalDeployed: 8500000,
    projectsFunded: 34,
    avgProjectSize: 250000,
    topIssueAreas: ['Public Health', 'Data Science', 'Disease Surveillance'],
  },
  {
    id: 'funder_008',
    rank: 8,
    name: 'Skoll Foundation',
    avatar: 'https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=400',
    country: 'Global',
    totalCapitalDeployed: 7200000,
    projectsFunded: 28,
    avgProjectSize: 257143,
    topIssueAreas: ['Climate Adaptation', 'Environmental Health'],
  },
  {
    id: 'funder_009',
    rank: 9,
    name: 'Dr. Nana Akua',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    affiliation: 'Gates Foundation',
    country: 'Kenya',
    totalCapitalDeployed: 5800000,
    projectsFunded: 22,
    avgProjectSize: 263636,
    topIssueAreas: ['Public Health', 'Disease Surveillance', 'Community Health'],
  },
  {
    id: 'funder_010',
    rank: 10,
    name: 'Fatima El-Amin',
    avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400',
    affiliation: 'African Development Bank',
    country: 'Kenya',
    totalCapitalDeployed: 4200000,
    projectsFunded: 18,
    avgProjectSize: 233333,
    topIssueAreas: ['Climate Adaptation', 'Policy Research'],
  },
];

export const researcherLeaderboard: ResearcherEntry[] = [
  {
    id: 'researcher_001',
    rank: 1,
    name: 'Dr. Amara Okonkwo',
    avatar: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400',
    affiliation: 'Lagos University Teaching Hospital',
    country: 'Nigeria',
    completedDAOs: 12,
    totalFundingSecured: 2850000,
    avgImpactScore: 94,
    specializations: ['Disease Surveillance', 'Pandemic Prevention'],
  },
  {
    id: 'researcher_002',
    rank: 2,
    name: 'Dr. Kwame Asante',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    affiliation: 'University of Ghana',
    country: 'Ghana',
    completedDAOs: 10,
    totalFundingSecured: 2340000,
    avgImpactScore: 92,
    specializations: ['Disease Surveillance', 'Public Health', 'Data Science'],
  },
  {
    id: 'researcher_003',
    rank: 3,
    name: 'Grace Mutoni',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
    affiliation: 'Rwanda Biomedical Centre',
    country: 'Rwanda',
    completedDAOs: 9,
    totalFundingSecured: 1980000,
    avgImpactScore: 91,
    specializations: ['Pandemic Prevention', 'Disease Surveillance', 'Public Health'],
  },
  {
    id: 'researcher_004',
    rank: 4,
    name: 'Dr. Amina Hassan',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
    affiliation: 'Ethiopian Public Health Institute',
    country: 'Ethiopia',
    completedDAOs: 8,
    totalFundingSecured: 1750000,
    avgImpactScore: 89,
    specializations: ['Pandemic Prevention', 'Public Health', 'Policy Research'],
  },
  {
    id: 'researcher_005',
    rank: 5,
    name: 'Dr. Zainab Kamara',
    avatar: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400',
    affiliation: 'Tanzania Health Research Institute',
    country: 'Tanzania',
    completedDAOs: 7,
    totalFundingSecured: 1520000,
    avgImpactScore: 90,
    specializations: ['Community Health', 'Public Health', 'Policy Research'],
  },
  {
    id: 'researcher_006',
    rank: 6,
    name: 'Joseph Mwangi',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400',
    affiliation: 'Makerere University',
    country: 'Uganda',
    completedDAOs: 6,
    totalFundingSecured: 1280000,
    avgImpactScore: 83,
    specializations: ['Agriculture', 'Climate Adaptation', 'Environmental Health'],
  },
  {
    id: 'researcher_007',
    rank: 7,
    name: 'Ibrahim Diallo',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
    affiliation: 'Senegal Climate Initiative',
    country: 'Senegal',
    completedDAOs: 5,
    totalFundingSecured: 1150000,
    avgImpactScore: 86,
    specializations: ['Climate Adaptation', 'Agriculture', 'Policy Research'],
  },
  {
    id: 'researcher_008',
    rank: 8,
    name: 'Aisha Mohammed',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    affiliation: 'Cairo University',
    country: 'Egypt',
    completedDAOs: 4,
    totalFundingSecured: 890000,
    avgImpactScore: 79,
    specializations: ['Environmental Health', 'Public Health', 'Data Science'],
  },
];

export const practitionerLeaderboard: PractitionerEntry[] = [
  {
    id: 'practitioner_001',
    rank: 1,
    name: 'Tendai Moyo',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    affiliation: 'Tech4Africa',
    country: 'South Africa',
    verifiedMilestones: 47,
    fieldUpdates: 234,
    implementationRate: 96,
    regionsActive: ['Cape Town', 'Johannesburg', 'Durban'],
  },
  {
    id: 'practitioner_002',
    rank: 2,
    name: 'Samuel Osei',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    affiliation: 'WaterAid West Africa',
    country: 'Nigeria',
    verifiedMilestones: 42,
    fieldUpdates: 189,
    implementationRate: 94,
    regionsActive: ['Lagos', 'Abuja', 'Kano', 'Port Harcourt'],
  },
  {
    id: 'practitioner_003',
    rank: 3,
    name: 'Esther Njeri',
    avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400',
    affiliation: 'Kenya Red Cross',
    country: 'Kenya',
    verifiedMilestones: 38,
    fieldUpdates: 156,
    implementationRate: 92,
    regionsActive: ['Nairobi', 'Mombasa', 'Kisumu'],
  },
  {
    id: 'practitioner_004',
    rank: 4,
    name: 'Emmanuel Koffi',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400',
    affiliation: 'Cocoa Health Initiative',
    country: 'Ghana',
    verifiedMilestones: 35,
    fieldUpdates: 142,
    implementationRate: 89,
    regionsActive: ['Accra', 'Kumasi', 'Tamale'],
  },
  {
    id: 'practitioner_005',
    rank: 5,
    name: 'Marie Claire Uwimana',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
    affiliation: 'Partners in Health Rwanda',
    country: 'Rwanda',
    verifiedMilestones: 31,
    fieldUpdates: 128,
    implementationRate: 95,
    regionsActive: ['Kigali', 'Butare', 'Gisenyi'],
  },
  {
    id: 'practitioner_006',
    rank: 6,
    name: 'David Ochieng',
    avatar: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400',
    affiliation: 'AgriTech Kenya',
    country: 'Kenya',
    verifiedMilestones: 28,
    fieldUpdates: 115,
    implementationRate: 88,
    regionsActive: ['Eldoret', 'Nakuru', 'Kisii'],
  },
  {
    id: 'practitioner_007',
    rank: 7,
    name: 'Fatou Diop',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400',
    affiliation: 'Senegal Solar Initiative',
    country: 'Senegal',
    verifiedMilestones: 24,
    fieldUpdates: 98,
    implementationRate: 91,
    regionsActive: ['Dakar', 'Saint-Louis', 'Thiès'],
  },
  {
    id: 'practitioner_008',
    rank: 8,
    name: 'Chidi Eze',
    avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=400',
    affiliation: 'Nigeria Malaria Consortium',
    country: 'Nigeria',
    verifiedMilestones: 21,
    fieldUpdates: 87,
    implementationRate: 86,
    regionsActive: ['Enugu', 'Onitsha', 'Owerri'],
  },
];

export const institutionLeaderboard: InstitutionEntry[] = [
  {
    id: 'institution_001',
    rank: 1,
    name: 'African Union Health Commission',
    avatar: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400',
    country: 'Pan-African',
    impactFootprint: 98,
    membersOnPlatform: 156,
    daosParticipated: 84,
    countriesReached: 54,
  },
  {
    id: 'institution_002',
    rank: 2,
    name: 'Kenya Medical Research Institute',
    avatar: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400',
    country: 'Kenya',
    impactFootprint: 94,
    membersOnPlatform: 89,
    daosParticipated: 52,
    countriesReached: 12,
  },
  {
    id: 'institution_003',
    rank: 3,
    name: 'University of Cape Town',
    avatar: 'https://images.unsplash.com/photo-1562774053-701939374585?w=400',
    country: 'South Africa',
    impactFootprint: 91,
    membersOnPlatform: 124,
    daosParticipated: 47,
    countriesReached: 18,
  },
  {
    id: 'institution_004',
    rank: 4,
    name: 'Nigerian Centre for Disease Control',
    avatar: 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=400',
    country: 'Nigeria',
    impactFootprint: 89,
    membersOnPlatform: 78,
    daosParticipated: 41,
    countriesReached: 8,
  },
  {
    id: 'institution_005',
    rank: 5,
    name: 'Ethiopia Public Health Institute',
    avatar: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=400',
    country: 'Ethiopia',
    impactFootprint: 87,
    membersOnPlatform: 67,
    daosParticipated: 38,
    countriesReached: 6,
  },
  {
    id: 'institution_006',
    rank: 6,
    name: 'Rwanda Biomedical Centre',
    avatar: 'https://images.unsplash.com/photo-1553484771-371a605b060b?w=400',
    country: 'Rwanda',
    impactFootprint: 85,
    membersOnPlatform: 45,
    daosParticipated: 32,
    countriesReached: 5,
  },
  {
    id: 'institution_007',
    rank: 7,
    name: 'Makerere University School of Public Health',
    avatar: 'https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=400',
    country: 'Uganda',
    impactFootprint: 82,
    membersOnPlatform: 58,
    daosParticipated: 29,
    countriesReached: 7,
  },
  {
    id: 'institution_008',
    rank: 8,
    name: 'Institut Pasteur de Dakar',
    avatar: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=400',
    country: 'Senegal',
    impactFootprint: 79,
    membersOnPlatform: 34,
    daosParticipated: 24,
    countriesReached: 9,
  },
];

export const leaderboardMetricDescriptions = {
  funders: {
    metric: 'Total Capital Deployed',
    description: 'Cumulative funding committed to NexTerra DAOs',
    unit: 'USD',
  },
  researchers: {
    metric: 'Completed DAOs',
    description: 'Successfully delivered research projects with verified outcomes',
    unit: 'DAOs',
  },
  practitioners: {
    metric: 'Verified Milestones',
    description: 'On-the-ground milestones confirmed by DAO governance',
    unit: 'Milestones',
  },
  institutions: {
    metric: 'Impact Footprint',
    description: 'Composite score based on reach, outcomes, and network effects',
    unit: 'Score (0-100)',
  },
};
