export interface PatternSummary {
  id: string;
  title: string;
  description: string;
  confidence: number;
  trend: 'rising' | 'stable' | 'declining';
  regions: string[];
  issueAreas: string[];
  dataPoints: number;
  lastUpdated: string;
  sources: {
    daoReports: number;
    onTheGround: number;
    research: number;
    discussions: number;
  };
}

export interface RiskSignal {
  id: string;
  severity: 'critical' | 'high' | 'moderate' | 'low';
  title: string;
  description: string;
  region: string;
  country: string;
  issueArea: string;
  detectedAt: string;
  dataConfidence: number;
  affectedPopulation?: string;
  relatedDAOs: string[];
  indicators: string[];
}

export interface EmergingAlert {
  id: string;
  type: 'disease' | 'climate' | 'conflict' | 'economic' | 'humanitarian';
  title: string;
  description: string;
  urgency: 'immediate' | 'developing' | 'monitoring';
  regions: string[];
  detectedAt: string;
  projectedImpact: string;
  recommendedActions: string[];
  dataSourceCount: number;
}

export interface DataSourceMetrics {
  totalDataPoints: number;
  daoReportsProcessed: number;
  onTheGroundUploads: number;
  researchActivities: number;
  discussionSignals: number;
  lastAggregation: string;
  coverageRegions: number;
  coverageIssueAreas: number;
}

export const patternSummaries: PatternSummary[] = [
  {
    id: 'pat-001',
    title: 'Increased Vaccine Hesitancy in Rural East Africa',
    description: 'Analysis of On the Ground reports and discussion signals shows a 23% increase in vaccine hesitancy mentions across rural communities in Kenya, Tanzania, and Uganda over the past 60 days. Pattern correlates with local misinformation campaigns identified through community health worker reports.',
    confidence: 0.87,
    trend: 'rising',
    regions: ['East Africa'],
    issueAreas: ['Public Health', 'Community Health'],
    dataPoints: 342,
    lastUpdated: '2024-01-15T08:30:00Z',
    sources: {
      daoReports: 45,
      onTheGround: 189,
      research: 23,
      discussions: 85,
    },
  },
  {
    id: 'pat-002',
    title: 'Drought-Driven Migration Corridors Emerging',
    description: 'Cross-referencing climate data with On the Ground practitioner reports reveals new migration patterns in the Sahel region. Three distinct corridors have been identified with increased movement toward coastal urban centers.',
    confidence: 0.92,
    trend: 'rising',
    regions: ['West Africa', 'Sahel'],
    issueAreas: ['Climate Adaptation', 'Migration', 'Food Security'],
    dataPoints: 567,
    lastUpdated: '2024-01-14T16:45:00Z',
    sources: {
      daoReports: 78,
      onTheGround: 312,
      research: 89,
      discussions: 88,
    },
  },
  {
    id: 'pat-003',
    title: 'mHealth Adoption Acceleration Post-Pandemic',
    description: 'Research activity and DAO milestone reports indicate 40% faster adoption of mobile health solutions in previously underserved areas. Pattern strongest in South Asia and Southeast Asia.',
    confidence: 0.79,
    trend: 'rising',
    regions: ['South Asia', 'Southeast Asia'],
    issueAreas: ['Digital Health', 'Healthcare Access'],
    dataPoints: 234,
    lastUpdated: '2024-01-13T11:20:00Z',
    sources: {
      daoReports: 56,
      onTheGround: 98,
      research: 45,
      discussions: 35,
    },
  },
  {
    id: 'pat-004',
    title: 'Antimicrobial Resistance Hotspots Identified',
    description: 'Aggregated research data and practitioner reports have identified emerging AMR hotspots in urban centers of Bangladesh, India, and Pakistan. Correlation with pharmaceutical waste management gaps.',
    confidence: 0.85,
    trend: 'stable',
    regions: ['South Asia'],
    issueAreas: ['Infectious Disease', 'Public Health', 'Environmental Health'],
    dataPoints: 456,
    lastUpdated: '2024-01-12T09:15:00Z',
    sources: {
      daoReports: 34,
      onTheGround: 156,
      research: 178,
      discussions: 88,
    },
  },
  {
    id: 'pat-005',
    title: 'Community-Led Surveillance Success Patterns',
    description: 'Analysis shows community-based disease surveillance programs achieve 3x faster outbreak detection when integrated with digital reporting tools. Pattern validated across 12 countries.',
    confidence: 0.91,
    trend: 'stable',
    regions: ['Global'],
    issueAreas: ['Epidemic Preparedness', 'Community Health'],
    dataPoints: 789,
    lastUpdated: '2024-01-11T14:30:00Z',
    sources: {
      daoReports: 167,
      onTheGround: 345,
      research: 156,
      discussions: 121,
    },
  },
];

export const riskSignals: RiskSignal[] = [
  {
    id: 'risk-001',
    severity: 'critical',
    title: 'Cholera Outbreak Risk - Cox\'s Bazar',
    description: 'Multiple indicators suggest elevated cholera outbreak risk in refugee camps. Water quality reports deteriorating, seasonal monsoon approaching, and healthcare capacity strained.',
    region: 'South Asia',
    country: 'Bangladesh',
    issueArea: 'Infectious Disease',
    detectedAt: '2024-01-15T06:00:00Z',
    dataConfidence: 0.94,
    affectedPopulation: '890,000 refugees',
    relatedDAOs: ['Rohingya Health Initiative', 'WASH Bangladesh'],
    indicators: ['Water quality decline', 'Seasonal risk window', 'Healthcare strain', 'Historical pattern match'],
  },
  {
    id: 'risk-002',
    severity: 'high',
    title: 'Food Insecurity Escalation - Horn of Africa',
    description: 'Converging signals from DAO reports and practitioner uploads indicate worsening food security situation. Four consecutive failed rainy seasons have depleted reserves.',
    region: 'East Africa',
    country: 'Ethiopia, Somalia, Kenya',
    issueArea: 'Food Security',
    detectedAt: '2024-01-14T12:00:00Z',
    dataConfidence: 0.89,
    affectedPopulation: '23 million at risk',
    relatedDAOs: ['Horn Food Security DAO', 'Pastoralist Resilience'],
    indicators: ['Crop failure reports', 'Livestock mortality increase', 'Market price volatility', 'Migration uptick'],
  },
  {
    id: 'risk-003',
    severity: 'high',
    title: 'Healthcare Worker Shortage - Rural India',
    description: 'Pattern analysis reveals critical healthcare worker shortages developing in rural districts of Madhya Pradesh and Uttar Pradesh. May impact ongoing immunization campaigns.',
    region: 'South Asia',
    country: 'India',
    issueArea: 'Healthcare Access',
    detectedAt: '2024-01-13T09:30:00Z',
    dataConfidence: 0.82,
    affectedPopulation: '45 million in affected districts',
    relatedDAOs: ['Rural Health India', 'mHealth Madhya Pradesh'],
    indicators: ['Staffing reports', 'Service delivery gaps', 'Training completion rates', 'Attrition signals'],
  },
  {
    id: 'risk-004',
    severity: 'moderate',
    title: 'Supply Chain Disruption - Essential Medicines',
    description: 'Discussion signals and DAO reports indicate emerging supply chain issues for essential medicines in West Africa. Port congestion and regulatory changes contributing factors.',
    region: 'West Africa',
    country: 'Nigeria, Ghana',
    issueArea: 'Supply Chain',
    detectedAt: '2024-01-12T15:45:00Z',
    dataConfidence: 0.76,
    relatedDAOs: ['West Africa Pharma DAO', 'Last Mile Delivery'],
    indicators: ['Stock-out reports', 'Lead time increases', 'Cost escalation', 'Regulatory flags'],
  },
  {
    id: 'risk-005',
    severity: 'moderate',
    title: 'Mental Health Crisis - Post-Conflict Zones',
    description: 'Aggregated practitioner reports show increasing mental health needs in post-conflict areas of DRC and South Sudan. Current service capacity significantly below demand.',
    region: 'Central Africa',
    country: 'DRC, South Sudan',
    issueArea: 'Mental Health',
    detectedAt: '2024-01-11T11:00:00Z',
    dataConfidence: 0.81,
    affectedPopulation: '2.3 million displaced',
    relatedDAOs: ['Mental Health Africa', 'Trauma Support Initiative'],
    indicators: ['Service utilization surge', 'Practitioner burnout', 'Referral backlogs', 'Community reports'],
  },
  {
    id: 'risk-006',
    severity: 'low',
    title: 'Cold Chain Infrastructure Gaps - Southeast Asia',
    description: 'Minor cold chain reliability issues detected in remote areas of Laos and Cambodia. May impact vaccine storage during upcoming campaigns.',
    region: 'Southeast Asia',
    country: 'Laos, Cambodia',
    issueArea: 'Immunization',
    detectedAt: '2024-01-10T08:20:00Z',
    dataConfidence: 0.71,
    relatedDAOs: ['Mekong Immunization DAO'],
    indicators: ['Temperature excursion reports', 'Equipment age', 'Maintenance gaps'],
  },
];

export const emergingAlerts: EmergingAlert[] = [
  {
    id: 'alert-001',
    type: 'disease',
    title: 'Novel Respiratory Pathogen Cluster - Vietnam',
    description: 'Unusual cluster of severe respiratory illness detected through community surveillance network. Samples being analyzed. Early-stage monitoring initiated.',
    urgency: 'immediate',
    regions: ['Southeast Asia'],
    detectedAt: '2024-01-15T04:00:00Z',
    projectedImpact: 'Potential regional spread if confirmed novel pathogen. 2-week monitoring window critical.',
    recommendedActions: [
      'Activate enhanced surveillance in bordering regions',
      'Pre-position diagnostic supplies',
      'Brief regional DAO coordinators',
      'Prepare communication templates',
    ],
    dataSourceCount: 23,
  },
  {
    id: 'alert-002',
    type: 'climate',
    title: 'Extreme Heat Event Forecast - South Asia',
    description: 'Climate models and historical patterns suggest unprecedented heat wave likely in April-May across northern India, Pakistan, and Nepal. Health infrastructure stress anticipated.',
    urgency: 'developing',
    regions: ['South Asia'],
    detectedAt: '2024-01-14T10:00:00Z',
    projectedImpact: 'Estimated 500 million people in high-risk zones. Healthcare system surge expected.',
    recommendedActions: [
      'Pre-position cooling supplies and oral rehydration',
      'Train community health workers on heat illness',
      'Establish cooling centers coordination',
      'Activate early warning messaging',
    ],
    dataSourceCount: 156,
  },
  {
    id: 'alert-003',
    type: 'humanitarian',
    title: 'Displacement Surge - Sudan Conflict',
    description: 'Escalating conflict in Darfur region driving new displacement wave. Cross-border movement into Chad accelerating. Humanitarian corridor access deteriorating.',
    urgency: 'immediate',
    regions: ['East Africa', 'Central Africa'],
    detectedAt: '2024-01-13T18:30:00Z',
    projectedImpact: 'Estimated 400,000 new displacements projected over next 30 days.',
    recommendedActions: [
      'Scale emergency health response in Chad border',
      'Coordinate with UNHCR on registration support',
      'Pre-position essential medicines',
      'Activate nutrition surveillance',
    ],
    dataSourceCount: 89,
  },
  {
    id: 'alert-004',
    type: 'disease',
    title: 'Dengue Season Early Onset - Latin America',
    description: 'Surveillance data indicates dengue season starting 6 weeks earlier than normal across Central America and Caribbean. Vector populations elevated due to recent flooding.',
    urgency: 'developing',
    regions: ['Latin America', 'Caribbean'],
    detectedAt: '2024-01-12T14:15:00Z',
    projectedImpact: 'Case counts potentially 40% above normal seasonal levels. Healthcare system planning needed.',
    recommendedActions: [
      'Accelerate vector control activities',
      'Reinforce clinical training on severe dengue',
      'Ensure IV fluid supplies adequate',
      'Launch community prevention campaigns',
    ],
    dataSourceCount: 234,
  },
  {
    id: 'alert-005',
    type: 'economic',
    title: 'Currency Crisis Impact on Health Spending - Pakistan',
    description: 'Rapid currency depreciation affecting health program budgets. Imported medicine costs increasing significantly. NGO operational sustainability concerns emerging.',
    urgency: 'monitoring',
    regions: ['South Asia'],
    detectedAt: '2024-01-11T09:00:00Z',
    projectedImpact: 'Estimated 15-20% reduction in effective health spending if trend continues.',
    recommendedActions: [
      'Review DAO budget contingencies',
      'Explore local sourcing alternatives',
      'Coordinate with funders on currency adjustments',
      'Monitor essential service delivery indicators',
    ],
    dataSourceCount: 67,
  },
  {
    id: 'alert-006',
    type: 'climate',
    title: 'Flooding Risk - Monsoon Season Bangladesh',
    description: 'Early monsoon indicators and soil saturation levels suggest elevated flooding risk for upcoming season. Historical patterns suggest Sylhet and Sunamganj most vulnerable.',
    urgency: 'monitoring',
    regions: ['South Asia'],
    detectedAt: '2024-01-10T11:30:00Z',
    projectedImpact: 'Potential displacement of 1.5 million if severe flooding occurs.',
    recommendedActions: [
      'Pre-position emergency health kits',
      'Review evacuation route accessibility',
      'Coordinate with disaster management authorities',
      'Prepare waterborne disease response protocols',
    ],
    dataSourceCount: 112,
  },
];

export const dataSourceMetrics: DataSourceMetrics = {
  totalDataPoints: 45678,
  daoReportsProcessed: 1234,
  onTheGroundUploads: 8967,
  researchActivities: 567,
  discussionSignals: 34910,
  lastAggregation: '2024-01-15T12:00:00Z',
  coverageRegions: 47,
  coverageIssueAreas: 23,
};

export const complianceInfo = {
  dataRetentionDays: 90,
  anonymizationLevel: 'Full individual de-identification',
  aggregationThreshold: 'Minimum 5 data points per insight',
  sovereigntyCompliance: [
    'GDPR (European Union)',
    'LGPD (Brazil)',
    'POPIA (South Africa)',
    'PDPA (Thailand)',
  ],
  auditFrequency: 'Monthly third-party audit',
  lastAuditDate: '2024-01-01',
  certifications: ['ISO 27001', 'SOC 2 Type II'],
};
