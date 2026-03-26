export type InsightRequestType = 'white_paper' | 'feasibility_study' | 'landscape_review';

export type InsightRequestStatus = 'open' | 'bidding' | 'in_progress' | 'completed' | 'approved';

export interface Bid {
  id: string;
  teamId: string;
  teamName: string;
  teamAvatar: string;
  teamMembers: number;
  proposedBudget: number;
  proposedTimeline: string;
  proposal: string;
  experience: string[];
  submittedAt: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface InsightRequest {
  id: string;
  title: string;
  type: InsightRequestType;
  description: string;
  requester: {
    id: string;
    name: string;
    avatar: string;
    type: 'funder' | 'company' | 'institution';
    organization: string;
  };
  scope: string[];
  deliverables: string[];
  budget: {
    min: number;
    max: number;
    currency: string;
  };
  timeline: string;
  deadline: string;
  requirements: string[];
  tags: string[];
  status: InsightRequestStatus;
  bids: Bid[];
  createdAt: string;
  views: number;
  region?: string;
  linkedDaos?: string[];
}

export const insightRequestTypes: { id: InsightRequestType; label: string; description: string }[] = [
  {
    id: 'white_paper',
    label: 'White Paper',
    description: 'Comprehensive research document on a specific topic',
  },
  {
    id: 'feasibility_study',
    label: 'Feasibility Study',
    description: 'Analysis of project viability and implementation potential',
  },
  {
    id: 'landscape_review',
    label: 'Landscape Review',
    description: 'Overview of existing solutions, competitors, and market conditions',
  },
];

export const insightRequests: InsightRequest[] = [
  {
    id: 'ir-1',
    title: 'Climate-Smart Agriculture Technologies in Sub-Saharan Africa',
    type: 'white_paper',
    description: 'We are seeking a comprehensive white paper that explores the current state and future potential of climate-smart agriculture technologies in Sub-Saharan Africa. The paper should cover emerging technologies, adoption barriers, success stories, and recommendations for scaling.',
    requester: {
      id: 'funder-1',
      name: 'African Development Foundation',
      avatar: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop',
      type: 'funder',
      organization: 'African Development Foundation',
    },
    scope: [
      'Current technology landscape',
      'Adoption barriers analysis',
      'Case studies from 5+ countries',
      'Policy recommendations',
      'Investment opportunities',
    ],
    deliverables: [
      '40-60 page white paper',
      'Executive summary (5 pages)',
      'Infographic summary',
      'Presentation deck',
    ],
    budget: {
      min: 15000,
      max: 25000,
      currency: 'USD',
    },
    timeline: '8-10 weeks',
    deadline: '2026-03-15',
    requirements: [
      'Team with agricultural research background',
      'Experience in African contexts',
      'Published research track record',
      'Local partnerships preferred',
    ],
    tags: ['agriculture', 'climate', 'technology', 'Sub-Saharan Africa'],
    status: 'open',
    bids: [
      {
        id: 'bid-1',
        teamId: 'team-1',
        teamName: 'AgriTech Research Collective',
        teamAvatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=100&h=100&fit=crop',
        teamMembers: 5,
        proposedBudget: 22000,
        proposedTimeline: '9 weeks',
        proposal: 'Our team brings 15+ years of combined experience in agricultural research across East and West Africa. We propose a mixed-methods approach combining desk research with field interviews in Kenya, Nigeria, and Ghana.',
        experience: ['Kenya Agricultural Research Institute', 'CGIAR', 'FAO consultant'],
        submittedAt: '2026-02-01T10:00:00Z',
        status: 'pending',
      },
    ],
    createdAt: '2026-01-20T08:00:00Z',
    views: 342,
    region: 'Sub-Saharan Africa',
    linkedDaos: ['dao-1'],
  },
  {
    id: 'ir-2',
    title: 'Mobile Money Integration for Rural Health Services',
    type: 'feasibility_study',
    description: 'Assess the feasibility of integrating mobile money payment systems with rural health service delivery in East Africa. The study should evaluate technical requirements, regulatory landscape, and implementation pathways.',
    requester: {
      id: 'company-1',
      name: 'HealthBridge Africa',
      avatar: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=100&h=100&fit=crop',
      type: 'company',
      organization: 'HealthBridge Africa Ltd',
    },
    scope: [
      'Technical infrastructure assessment',
      'Regulatory compliance analysis',
      'Cost-benefit analysis',
      'Risk assessment',
      'Implementation roadmap',
    ],
    deliverables: [
      'Feasibility report (30-40 pages)',
      'Technical specification document',
      'Financial projections',
      'Risk matrix',
    ],
    budget: {
      min: 20000,
      max: 35000,
      currency: 'USD',
    },
    timeline: '6-8 weeks',
    deadline: '2026-02-28',
    requirements: [
      'Fintech expertise',
      'Healthcare sector knowledge',
      'East Africa market experience',
      'Regulatory compliance background',
    ],
    tags: ['fintech', 'healthcare', 'mobile money', 'East Africa'],
    status: 'bidding',
    bids: [
      {
        id: 'bid-2',
        teamId: 'team-2',
        teamName: 'Digital Finance Lab',
        teamAvatar: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=100&h=100&fit=crop',
        teamMembers: 4,
        proposedBudget: 28000,
        proposedTimeline: '7 weeks',
        proposal: 'We have conducted similar feasibility studies for M-Pesa integrations. Our team includes former regulators and fintech engineers with direct implementation experience.',
        experience: ['Safaricom', 'Central Bank of Kenya', 'World Bank Digital Finance'],
        submittedAt: '2026-01-28T14:30:00Z',
        status: 'pending',
      },
      {
        id: 'bid-3',
        teamId: 'team-3',
        teamName: 'Healthcare Innovation Partners',
        teamAvatar: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=100&h=100&fit=crop',
        teamMembers: 3,
        proposedBudget: 32000,
        proposedTimeline: '8 weeks',
        proposal: 'Our healthcare-first approach ensures the study considers patient needs alongside technical feasibility. We have partnerships with 12 rural clinics for pilot validation.',
        experience: ['WHO', 'PATH', 'Clinton Health Access Initiative'],
        submittedAt: '2026-01-30T09:15:00Z',
        status: 'pending',
      },
    ],
    createdAt: '2026-01-15T12:00:00Z',
    views: 518,
    region: 'East Africa',
  },
  {
    id: 'ir-3',
    title: 'Renewable Energy Mini-Grid Market Landscape',
    type: 'landscape_review',
    description: 'Comprehensive review of the renewable energy mini-grid market across West Africa, including key players, technologies, business models, regulatory frameworks, and investment trends.',
    requester: {
      id: 'institution-1',
      name: 'West African Energy Institute',
      avatar: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=100&h=100&fit=crop',
      type: 'institution',
      organization: 'West African Energy Institute',
    },
    scope: [
      'Market size and growth projections',
      'Technology comparison',
      'Business model analysis',
      'Regulatory review by country',
      'Investment landscape',
      'Key player profiles',
    ],
    deliverables: [
      'Market landscape report (50-70 pages)',
      'Country profiles (5 countries)',
      'Competitive analysis matrix',
      'Investment opportunity brief',
    ],
    budget: {
      min: 25000,
      max: 40000,
      currency: 'USD',
    },
    timeline: '10-12 weeks',
    deadline: '2026-04-01',
    requirements: [
      'Energy sector expertise',
      'West Africa regional knowledge',
      'Investment analysis experience',
      'Access to industry networks',
    ],
    tags: ['energy', 'renewable', 'mini-grid', 'West Africa', 'investment'],
    status: 'open',
    bids: [],
    createdAt: '2026-01-25T16:00:00Z',
    views: 267,
    region: 'West Africa',
    linkedDaos: ['dao-2', 'dao-3'],
  },
  {
    id: 'ir-4',
    title: 'Water Purification Technologies for Refugee Settlements',
    type: 'feasibility_study',
    description: 'Evaluate the feasibility of deploying advanced water purification technologies in refugee settlements across the Horn of Africa. Focus on solar-powered and low-maintenance solutions.',
    requester: {
      id: 'funder-2',
      name: 'Humanitarian Innovation Fund',
      avatar: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=100&h=100&fit=crop',
      type: 'funder',
      organization: 'Humanitarian Innovation Fund',
    },
    scope: [
      'Technology assessment',
      'Cost analysis per beneficiary',
      'Maintenance requirements',
      'Supply chain evaluation',
      'Community acceptance factors',
    ],
    deliverables: [
      'Technical feasibility report',
      'Cost-benefit analysis',
      'Implementation guidelines',
      'Monitoring framework',
    ],
    budget: {
      min: 18000,
      max: 30000,
      currency: 'USD',
    },
    timeline: '8-10 weeks',
    deadline: '2026-03-20',
    requirements: [
      'WASH sector experience',
      'Humanitarian context expertise',
      'Engineering background',
      'Field research capability',
    ],
    tags: ['water', 'humanitarian', 'technology', 'refugees', 'Horn of Africa'],
    status: 'in_progress',
    bids: [
      {
        id: 'bid-4',
        teamId: 'team-4',
        teamName: 'WASH Innovation Lab',
        teamAvatar: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=100&h=100&fit=crop',
        teamMembers: 6,
        proposedBudget: 26000,
        proposedTimeline: '9 weeks',
        proposal: 'Our team has implemented water systems in 8 refugee settlements. We will combine technical assessment with community-centered design principles.',
        experience: ['UNHCR', 'UNICEF WASH', 'Engineers Without Borders'],
        submittedAt: '2026-01-18T11:00:00Z',
        status: 'accepted',
      },
    ],
    createdAt: '2026-01-10T09:00:00Z',
    views: 423,
    region: 'Horn of Africa',
  },
  {
    id: 'ir-5',
    title: 'Digital Identity Solutions for Unbanked Populations',
    type: 'white_paper',
    description: 'Research paper examining digital identity solutions that can facilitate financial inclusion for unbanked populations across Africa. Focus on privacy-preserving technologies and regulatory considerations.',
    requester: {
      id: 'institution-2',
      name: 'African Digital Rights Alliance',
      avatar: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&h=100&fit=crop',
      type: 'institution',
      organization: 'African Digital Rights Alliance',
    },
    scope: [
      'Technology review (blockchain, biometrics, etc.)',
      'Privacy and security analysis',
      'Regulatory landscape',
      'Case studies of existing implementations',
      'Recommendations for policy makers',
    ],
    deliverables: [
      'White paper (35-50 pages)',
      'Policy brief',
      'Technical appendix',
      'Stakeholder presentation',
    ],
    budget: {
      min: 12000,
      max: 20000,
      currency: 'USD',
    },
    timeline: '6-8 weeks',
    deadline: '2026-03-01',
    requirements: [
      'Digital identity expertise',
      'Privacy/security background',
      'Financial inclusion knowledge',
      'Policy analysis experience',
    ],
    tags: ['digital identity', 'financial inclusion', 'privacy', 'blockchain'],
    status: 'approved',
    bids: [
      {
        id: 'bid-5',
        teamId: 'team-5',
        teamName: 'Identity Research Consortium',
        teamAvatar: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=100&h=100&fit=crop',
        teamMembers: 4,
        proposedBudget: 18000,
        proposedTimeline: '7 weeks',
        proposal: 'Our consortium specializes in digital identity with a focus on African contexts. We have advised multiple central banks on digital ID frameworks.',
        experience: ['ID4Africa', 'World Bank ID4D', 'African Union Digital Transformation Strategy'],
        submittedAt: '2026-01-05T08:00:00Z',
        status: 'accepted',
      },
    ],
    createdAt: '2026-01-01T10:00:00Z',
    views: 689,
    linkedDaos: ['dao-4'],
  },
];
