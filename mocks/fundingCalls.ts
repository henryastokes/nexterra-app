export type FundingCallSource = 'google_alerts' | 'funding_repository' | 'admin_upload';
export type FundingCallType = 'cepi_call' | 'government_rfp' | 'multilateral_grant' | 'foundation_grant' | 'corporate_partnership';

export interface FundingCall {
  id: string;
  title: string;
  description: string;
  source: FundingCallSource;
  type: FundingCallType;
  organization: string;
  organizationLogo: string;
  countries: string[];
  issueAreas: string[];
  budgetMin: number;
  budgetMax: number;
  currency: string;
  deadline: string;
  postedDate: string;
  eligibility: string[];
  requirements: string[];
  url: string;
  isUrgent: boolean;
  matchScore?: number;
}

export const fundingCallSources: { key: FundingCallSource; label: string }[] = [
  { key: 'google_alerts', label: 'Google Alerts' },
  { key: 'funding_repository', label: 'Funding Repository' },
  { key: 'admin_upload', label: 'Admin Upload' },
];

export const fundingCallTypes: { key: FundingCallType; label: string; color: string }[] = [
  { key: 'cepi_call', label: 'CEPI Call', color: '#0891B2' },
  { key: 'government_rfp', label: 'Government RFP', color: '#7C3AED' },
  { key: 'multilateral_grant', label: 'Multilateral Grant', color: '#059669' },
  { key: 'foundation_grant', label: 'Foundation Grant', color: '#DC2626' },
  { key: 'corporate_partnership', label: 'Corporate Partnership', color: '#EA580C' },
];

export const fundingCalls: FundingCall[] = [
  {
    id: 'fc_1',
    title: 'CEPI Emerging Infectious Disease Preparedness Call',
    description: 'Coalition for Epidemic Preparedness Innovations seeks proposals for vaccine development platforms targeting emerging pathogens with pandemic potential. Focus on rapid-response manufacturing capabilities and equitable access mechanisms.',
    source: 'google_alerts',
    type: 'cepi_call',
    organization: 'CEPI',
    organizationLogo: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=100',
    countries: ['Global', 'Low-Income Countries'],
    issueAreas: ['Disease Prevention', 'Vaccine Development', 'Pandemic Preparedness'],
    budgetMin: 500000,
    budgetMax: 5000000,
    currency: 'USD',
    deadline: '2026-04-15',
    postedDate: '2026-01-15',
    eligibility: [
      'Research institutions',
      'Biotechnology companies',
      'Public-private partnerships',
      'Academic consortia',
    ],
    requirements: [
      'Proof of concept data',
      'Manufacturing scalability plan',
      'Equitable access commitment',
      'Regulatory pathway strategy',
    ],
    url: 'https://cepi.net/calls',
    isUrgent: true,
    matchScore: 92,
  },
  {
    id: 'fc_2',
    title: 'USAID Climate Resilience in Agriculture RFP',
    description: 'Request for proposals to develop and scale climate-smart agricultural practices in Sub-Saharan Africa. Emphasis on smallholder farmer engagement, local capacity building, and measurable climate adaptation outcomes.',
    source: 'funding_repository',
    type: 'government_rfp',
    organization: 'USAID',
    organizationLogo: 'https://images.unsplash.com/photo-1569025743873-ea3a9ber?w=100',
    countries: ['Kenya', 'Ethiopia', 'Tanzania', 'Uganda'],
    issueAreas: ['Climate Mitigation', 'Agriculture', 'Food Security'],
    budgetMin: 1000000,
    budgetMax: 10000000,
    currency: 'USD',
    deadline: '2026-03-30',
    postedDate: '2026-01-20',
    eligibility: [
      'NGOs with 5+ years experience',
      'Local implementing partners',
      'Research institutions',
    ],
    requirements: [
      'Past performance references',
      'Local partner MOUs',
      'M&E framework',
      'Gender integration plan',
    ],
    url: 'https://usaid.gov/rfps',
    isUrgent: false,
    matchScore: 88,
  },
  {
    id: 'fc_3',
    title: 'Global Fund Malaria Elimination Grant',
    description: 'The Global Fund invites proposals for innovative malaria elimination strategies in high-burden countries. Priority given to community-based interventions, novel diagnostics, and surveillance systems.',
    source: 'funding_repository',
    type: 'multilateral_grant',
    organization: 'The Global Fund',
    organizationLogo: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=100',
    countries: ['Nigeria', 'DRC', 'Mozambique', 'Burkina Faso'],
    issueAreas: ['Disease Prevention', 'Healthcare Access', 'Community Health'],
    budgetMin: 2000000,
    budgetMax: 15000000,
    currency: 'USD',
    deadline: '2026-05-01',
    postedDate: '2026-01-10',
    eligibility: [
      'Country Coordinating Mechanisms',
      'Principal Recipients',
      'Civil society organizations',
    ],
    requirements: [
      'National strategy alignment',
      'Co-financing commitment',
      'Sustainability plan',
      'Community engagement evidence',
    ],
    url: 'https://theglobalfund.org/grants',
    isUrgent: false,
    matchScore: 85,
  },
  {
    id: 'fc_4',
    title: 'Gates Foundation Water & Sanitation Innovation',
    description: 'Seeking breakthrough innovations in water purification and sanitation technologies for resource-limited settings. Focus on low-cost, scalable solutions with potential for commercial sustainability.',
    source: 'admin_upload',
    type: 'foundation_grant',
    organization: 'Bill & Melinda Gates Foundation',
    organizationLogo: 'https://images.unsplash.com/photo-1548438294-1ad5d5f4f063?w=100',
    countries: ['India', 'Bangladesh', 'Ethiopia', 'Nigeria'],
    issueAreas: ['Water Security', 'Sanitation', 'Public Health'],
    budgetMin: 100000,
    budgetMax: 2000000,
    currency: 'USD',
    deadline: '2026-06-15',
    postedDate: '2026-02-01',
    eligibility: [
      'Social enterprises',
      'Research institutions',
      'Start-ups with proof of concept',
    ],
    requirements: [
      'Technical feasibility data',
      'Cost-effectiveness analysis',
      'Scalability pathway',
      'IP disclosure',
    ],
    url: 'https://gatesfoundation.org/grants',
    isUrgent: true,
    matchScore: 78,
  },
  {
    id: 'fc_5',
    title: 'World Bank Education Technology Fund',
    description: 'Financing available for EdTech solutions addressing learning gaps in post-pandemic education systems. Priority for projects demonstrating improved learning outcomes for marginalized populations.',
    source: 'google_alerts',
    type: 'multilateral_grant',
    organization: 'World Bank',
    organizationLogo: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=100',
    countries: ['Brazil', 'Indonesia', 'Pakistan', 'Philippines'],
    issueAreas: ['Education', 'Technology', 'Youth Development'],
    budgetMin: 500000,
    budgetMax: 3000000,
    currency: 'USD',
    deadline: '2026-04-30',
    postedDate: '2026-01-25',
    eligibility: [
      'EdTech companies',
      'Ministry partnerships',
      'NGOs with education focus',
    ],
    requirements: [
      'Impact evaluation design',
      'Government endorsement',
      'Teacher training component',
      'Offline functionality',
    ],
    url: 'https://worldbank.org/education',
    isUrgent: false,
    matchScore: 72,
  },
  {
    id: 'fc_6',
    title: 'Novartis Access to Medicine Partnership',
    description: 'Corporate partnership opportunity for expanding access to essential medicines in underserved markets. Seeking innovative distribution models and last-mile delivery solutions.',
    source: 'admin_upload',
    type: 'corporate_partnership',
    organization: 'Novartis',
    organizationLogo: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=100',
    countries: ['Kenya', 'Ghana', 'Vietnam', 'Cambodia'],
    issueAreas: ['Healthcare Access', 'Supply Chain', 'NCDs'],
    budgetMin: 250000,
    budgetMax: 1500000,
    currency: 'USD',
    deadline: '2026-03-15',
    postedDate: '2026-01-05',
    eligibility: [
      'Healthcare NGOs',
      'Social enterprises',
      'Distribution companies',
    ],
    requirements: [
      'Supply chain expertise',
      'Local presence',
      'Regulatory compliance',
      'Data sharing agreement',
    ],
    url: 'https://novartis.com/access',
    isUrgent: true,
    matchScore: 81,
  },
  {
    id: 'fc_7',
    title: 'European Commission Horizon Health Research',
    description: 'EU funding for collaborative health research projects addressing antimicrobial resistance, rare diseases, and health systems strengthening. Requires cross-border consortium formation.',
    source: 'funding_repository',
    type: 'government_rfp',
    organization: 'European Commission',
    organizationLogo: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=100',
    countries: ['EU Member States', 'Associated Countries'],
    issueAreas: ['Health Research', 'AMR', 'Health Systems'],
    budgetMin: 3000000,
    budgetMax: 20000000,
    currency: 'EUR',
    deadline: '2026-05-20',
    postedDate: '2026-01-30',
    eligibility: [
      'EU research institutions',
      'International consortia',
      'Public health agencies',
    ],
    requirements: [
      'Minimum 3 country consortium',
      'Open science commitment',
      'Gender equality plan',
      'Ethics approval pathway',
    ],
    url: 'https://ec.europa.eu/horizon',
    isUrgent: false,
    matchScore: 68,
  },
  {
    id: 'fc_8',
    title: 'DFID Renewable Energy Access Programme',
    description: 'UK aid funding for off-grid renewable energy solutions in rural communities. Emphasis on women-led enterprises and productive use applications.',
    source: 'google_alerts',
    type: 'government_rfp',
    organization: 'UK FCDO',
    organizationLogo: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=100',
    countries: ['Rwanda', 'Sierra Leone', 'Myanmar', 'Nepal'],
    issueAreas: ['Clean Energy', 'Rural Development', 'Gender Equality'],
    budgetMin: 500000,
    budgetMax: 5000000,
    currency: 'GBP',
    deadline: '2026-04-01',
    postedDate: '2026-01-18',
    eligibility: [
      'Energy companies',
      'NGOs',
      'Social enterprises',
      'Research institutions',
    ],
    requirements: [
      'Value for money assessment',
      'Climate impact measurement',
      'Women empowerment strategy',
      'Private sector leverage',
    ],
    url: 'https://gov.uk/fcdo',
    isUrgent: false,
    matchScore: 75,
  },
];

export const getTypeColor = (type: FundingCallType): string => {
  const found = fundingCallTypes.find(t => t.key === type);
  return found?.color || '#6B7280';
};

export const getTypeLabel = (type: FundingCallType): string => {
  const found = fundingCallTypes.find(t => t.key === type);
  return found?.label || type;
};

export const getSourceLabel = (source: FundingCallSource): string => {
  const found = fundingCallSources.find(s => s.key === source);
  return found?.label || source;
};
