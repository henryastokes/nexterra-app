export type FocusArea = 
  | 'climate_adaptation'
  | 'pandemic_prevention'
  | 'disease_surveillance'
  | 'public_health'
  | 'environmental_health';

export type FundingReadiness = 'high' | 'medium' | 'low';

export interface ImpactScore {
  total: number;
  daoUsage: number;
  proposalCitations: number;
  peerEndorsements: number;
  implementationLinks: number;
}

export interface LinkedResearcher {
  id: string;
  name: string;
  avatar: string;
  role: string;
  isNetworkMember: boolean;
}

export interface RelatedInitiative {
  id: string;
  type: 'dao' | 'proposal' | 'field_work';
  title: string;
  status: string;
}

export interface ResearchPaper {
  id: string;
  title: string;
  authors: string[];
  institution: string;
  abstract: string;
  publicationDate: string;
  journal: string;
  focusArea: FocusArea;
  tags: {
    geography: string[];
    diseases: string[];
    climateIssues: string[];
    fundingReadiness: FundingReadiness;
  };
  citations: number;
  isOpenAccess: boolean;
  doi: string;
  imageUrl: string;
  isNetworkResearch: boolean;
  linkedResearchers: LinkedResearcher[];
  relatedInitiatives: RelatedInitiative[];
  impactScore: ImpactScore;
}

export const focusAreas: { id: FocusArea | 'all'; label: string; icon: string }[] = [
  { id: 'all', label: 'All Research', icon: 'BookOpen' },
  { id: 'climate_adaptation', label: 'Climate Adaptation', icon: 'ThermometerSun' },
  { id: 'pandemic_prevention', label: 'Pandemic Prevention', icon: 'ShieldAlert' },
  { id: 'disease_surveillance', label: 'Disease Surveillance', icon: 'Activity' },
  { id: 'public_health', label: 'Public Health', icon: 'Heart' },
  { id: 'environmental_health', label: 'Environmental Health', icon: 'Trees' },
];

export const academicPapers: ResearchPaper[] = [
  {
    id: '1',
    title: 'Climate-Resilient Agriculture Strategies for Sub-Saharan Africa: A Systematic Review',
    authors: ['Dr. Amina Okonkwo', 'Prof. Kwesi Mensah', 'Dr. Fatou Diallo'],
    institution: 'University of Nairobi',
    abstract: 'This systematic review examines climate adaptation strategies in agricultural systems across Sub-Saharan Africa. We analyzed 147 peer-reviewed studies from 2015-2024, identifying key interventions including drought-resistant crop varieties, conservation agriculture practices, and integrated water management systems. Our findings indicate that community-led adaptation initiatives show 40% higher success rates compared to top-down approaches. The review highlights the critical role of indigenous knowledge integration and emphasizes the need for policy frameworks that support smallholder farmers in building climate resilience.',
    publicationDate: '2024-08-15',
    journal: 'Nature Climate Change',
    focusArea: 'climate_adaptation',
    tags: {
      geography: ['Kenya', 'Nigeria', 'Ghana', 'Tanzania'],
      diseases: [],
      climateIssues: ['Drought', 'Crop Failure', 'Food Security'],
      fundingReadiness: 'high',
    },
    citations: 89,
    isOpenAccess: true,
    doi: '10.1038/s41558-024-01234',
    imageUrl: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800',
    isNetworkResearch: true,
    linkedResearchers: [
      { id: 'auth1', name: 'Dr. Amina Okonkwo', avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150', role: 'Researcher', isNetworkMember: true },
      { id: 'auth2', name: 'Prof. Kwesi Mensah', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', role: 'Researcher', isNetworkMember: true },
    ],
    relatedInitiatives: [
      { id: 'dao1', type: 'dao', title: 'Climate Adaptation DAO', status: 'Active' },
      { id: 'prop1', type: 'proposal', title: 'Sahel Crop Resilience Initiative', status: 'Funded' },
    ],
    impactScore: { total: 87, daoUsage: 24, proposalCitations: 31, peerEndorsements: 18, implementationLinks: 14 },
  },
  {
    id: '2',
    title: 'Early Warning Systems for Emerging Zoonotic Diseases in African Wildlife-Human Interfaces',
    authors: ['Dr. Grace Nakimuli', 'Dr. Samuel Obi', 'Prof. Jean-Pierre Kabongo'],
    institution: 'Makerere University',
    abstract: 'Zoonotic disease spillover events pose significant pandemic risks, particularly in regions with high wildlife-human contact. This study presents a novel early warning framework integrating genomic surveillance, ecological monitoring, and community health reporting across 12 African nations. Our machine learning models achieved 87% accuracy in predicting high-risk spillover zones. We demonstrate that investment in One Health surveillance infrastructure could prevent estimated economic losses of $4.2 billion annually while protecting vulnerable communities from emerging infectious diseases.',
    publicationDate: '2024-06-22',
    journal: 'The Lancet Planetary Health',
    focusArea: 'pandemic_prevention',
    tags: {
      geography: ['Uganda', 'DRC', 'Rwanda', 'Cameroon'],
      diseases: ['Ebola', 'Marburg', 'Mpox', 'Zoonotic Influenza'],
      climateIssues: ['Habitat Destruction', 'Deforestation'],
      fundingReadiness: 'high',
    },
    citations: 156,
    isOpenAccess: true,
    doi: '10.1016/S2542-5196(24)00089',
    imageUrl: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=800',
    isNetworkResearch: true,
    linkedResearchers: [
      { id: 'auth3', name: 'Dr. Grace Nakimuli', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150', role: 'Researcher', isNetworkMember: true },
      { id: 'auth4', name: 'Dr. Samuel Obi', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', role: 'Researcher', isNetworkMember: true },
    ],
    relatedInitiatives: [
      { id: 'dao2', type: 'dao', title: 'One Health DAO', status: 'Active' },
      { id: 'prop2', type: 'proposal', title: 'Zoonotic Early Warning System', status: 'Under Review' },
      { id: 'field1', type: 'field_work', title: 'Wildlife Interface Monitoring', status: 'Ongoing' },
    ],
    impactScore: { total: 94, daoUsage: 28, proposalCitations: 35, peerEndorsements: 21, implementationLinks: 10 },
  },
  {
    id: '3',
    title: 'Digital Health Surveillance Networks for Malaria Control in Endemic Regions',
    authors: ['Dr. Chioma Adeyemi', 'Dr. Yohannes Bekele', 'Dr. Aisha Diallo'],
    institution: 'University of Cape Town',
    abstract: 'Malaria remains a leading cause of mortality in Africa, claiming over 600,000 lives annually. This paper presents findings from a five-year implementation study of digital surveillance networks across 8 endemic countries. Our mobile-based reporting system reduced case detection time by 72% and enabled targeted intervention deployment. Integration with climate data improved outbreak prediction accuracy to 91%. The study demonstrates that low-cost digital infrastructure can dramatically enhance disease surveillance capacity in resource-limited settings.',
    publicationDate: '2024-04-10',
    journal: 'PLOS Medicine',
    focusArea: 'disease_surveillance',
    tags: {
      geography: ['South Africa', 'Mozambique', 'Malawi', 'Zambia'],
      diseases: ['Malaria', 'Dengue'],
      climateIssues: ['Temperature Rise', 'Rainfall Patterns'],
      fundingReadiness: 'medium',
    },
    citations: 203,
    isOpenAccess: true,
    doi: '10.1371/journal.pmed.1004231',
    imageUrl: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=800',
    isNetworkResearch: true,
    linkedResearchers: [
      { id: 'auth5', name: 'Dr. Chioma Adeyemi', avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150', role: 'Researcher', isNetworkMember: true },
    ],
    relatedInitiatives: [
      { id: 'prop3', type: 'proposal', title: 'Malaria Surveillance Expansion', status: 'Funded' },
      { id: 'field2', type: 'field_work', title: 'Mobile Health Reporting Pilot', status: 'Completed' },
    ],
    impactScore: { total: 82, daoUsage: 18, proposalCitations: 29, peerEndorsements: 22, implementationLinks: 13 },
  },
  {
    id: '4',
    title: 'Strengthening Primary Healthcare Systems in Rural Africa: Lessons from Community Health Worker Programs',
    authors: ['Prof. Thabo Molefe', 'Dr. Esther Mwangi', 'Dr. Ibrahim Sanogo'],
    institution: 'Witwatersrand University',
    abstract: 'Community health workers (CHWs) are critical to achieving universal health coverage in Africa. This mixed-methods study evaluated CHW programs across 15 countries, examining factors influencing effectiveness and sustainability. Our analysis reveals that programs with structured supervision, adequate compensation, and integration into formal health systems show 3x higher retention rates. We propose a scalable framework for CHW program design that addresses common implementation challenges while maintaining community trust and cultural relevance.',
    publicationDate: '2024-02-28',
    journal: 'BMJ Global Health',
    focusArea: 'public_health',
    tags: {
      geography: ['Ethiopia', 'Rwanda', 'Senegal', 'Mali'],
      diseases: ['Maternal Health', 'Child Mortality', 'HIV/AIDS'],
      climateIssues: [],
      fundingReadiness: 'high',
    },
    citations: 127,
    isOpenAccess: true,
    doi: '10.1136/bmjgh-2024-014567',
    imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800',
    isNetworkResearch: false,
    linkedResearchers: [
      { id: 'ext1', name: 'Prof. Thabo Molefe', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150', role: 'Researcher', isNetworkMember: false },
    ],
    relatedInitiatives: [
      { id: 'dao3', type: 'dao', title: 'Health Infrastructure DAO', status: 'Active' },
    ],
    impactScore: { total: 71, daoUsage: 15, proposalCitations: 24, peerEndorsements: 19, implementationLinks: 13 },
  },
  {
    id: '5',
    title: 'Air Quality and Respiratory Health in African Megacities: A Multi-City Assessment',
    authors: ['Dr. Nadia Ouedraogo', 'Dr. David Mensah', 'Prof. Zainab Kamara'],
    institution: 'University of Lagos',
    abstract: 'Rapid urbanization in Africa has led to severe air quality degradation in major cities. This comprehensive study measured PM2.5 and PM10 concentrations across 10 African megacities over 24 months, correlating exposure data with respiratory health outcomes in 50,000 participants. We found that 78% of urban residents experience pollution levels exceeding WHO guidelines, contributing to an estimated 400,000 premature deaths annually. The study identifies key intervention points including transportation reform, clean cooking initiatives, and industrial emission controls.',
    publicationDate: '2024-01-15',
    journal: 'Environmental Health Perspectives',
    focusArea: 'environmental_health',
    tags: {
      geography: ['Nigeria', 'Egypt', 'South Africa', 'Kenya'],
      diseases: ['Asthma', 'COPD', 'Lung Cancer'],
      climateIssues: ['Air Pollution', 'Urban Heat'],
      fundingReadiness: 'medium',
    },
    citations: 94,
    isOpenAccess: false,
    doi: '10.1289/EHP2024-01234',
    imageUrl: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800',
    isNetworkResearch: false,
    linkedResearchers: [
      { id: 'ext2', name: 'Dr. Nadia Ouedraogo', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', role: 'Researcher', isNetworkMember: false },
    ],
    relatedInitiatives: [
      { id: 'prop4', type: 'proposal', title: 'Air Quality Monitoring Network', status: 'Under Review' },
    ],
    impactScore: { total: 58, daoUsage: 8, proposalCitations: 19, peerEndorsements: 17, implementationLinks: 14 },
  },
  {
    id: '6',
    title: 'Flood-Resilient Water Infrastructure for Coastal African Communities',
    authors: ['Dr. Juma Mwalimu', 'Dr. Abiodun Fatoki', 'Prof. Mariam Coulibaly'],
    institution: 'University of Dar es Salaam',
    abstract: 'Coastal African communities face increasing flood risks due to climate change and sea-level rise. This engineering study evaluates adaptive water infrastructure designs tested across 6 coastal cities. Our nature-based solutions, combining mangrove restoration with engineered drainage systems, reduced flood damage by 65% while providing co-benefits for biodiversity and fisheries. Cost-benefit analysis demonstrates a 4:1 return on investment over 20 years, making these approaches economically viable for resource-constrained municipalities.',
    publicationDate: '2023-11-20',
    journal: 'Water Research',
    focusArea: 'climate_adaptation',
    tags: {
      geography: ['Tanzania', 'Senegal', 'Mozambique', 'Côte d\'Ivoire'],
      diseases: ['Cholera', 'Waterborne Diseases'],
      climateIssues: ['Flooding', 'Sea Level Rise', 'Storm Surges'],
      fundingReadiness: 'high',
    },
    citations: 71,
    isOpenAccess: true,
    doi: '10.1016/j.watres.2023.120456',
    imageUrl: 'https://images.unsplash.com/photo-1597655601841-214a4cfe8b2c?w=800',
    isNetworkResearch: true,
    linkedResearchers: [
      { id: 'auth6', name: 'Dr. Juma Mwalimu', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', role: 'Researcher', isNetworkMember: true },
    ],
    relatedInitiatives: [
      { id: 'dao4', type: 'dao', title: 'Blue Carbon DAO', status: 'Active' },
      { id: 'prop5', type: 'proposal', title: 'Coastal Resilience Initiative', status: 'Funded' },
      { id: 'field3', type: 'field_work', title: 'Mangrove Restoration Monitoring', status: 'Ongoing' },
    ],
    impactScore: { total: 79, daoUsage: 22, proposalCitations: 26, peerEndorsements: 16, implementationLinks: 15 },
  },
  {
    id: '7',
    title: 'Cholera Outbreak Prediction Using Machine Learning and Environmental Data',
    authors: ['Dr. Emmanuel Koffi', 'Dr. Patience Asante', 'Dr. Mohamed Hassan'],
    institution: 'Addis Ababa University',
    abstract: 'Cholera remains endemic in many African regions, causing periodic devastating outbreaks. We developed a machine learning model integrating satellite-derived environmental data, population movement patterns, and historical outbreak records to predict cholera risk. Testing across 5 countries over 3 years, our model predicted 83% of outbreaks 2-4 weeks in advance, enabling preemptive resource deployment. This work demonstrates the potential of AI-driven disease prediction systems to save lives in resource-limited settings.',
    publicationDate: '2023-09-05',
    journal: 'Nature Communications',
    focusArea: 'disease_surveillance',
    tags: {
      geography: ['Ethiopia', 'Somalia', 'Yemen', 'Sudan'],
      diseases: ['Cholera', 'Typhoid'],
      climateIssues: ['Drought', 'Water Scarcity', 'Flooding'],
      fundingReadiness: 'medium',
    },
    citations: 188,
    isOpenAccess: true,
    doi: '10.1038/s41467-023-41234',
    imageUrl: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=800',
    isNetworkResearch: false,
    linkedResearchers: [
      { id: 'ext3', name: 'Dr. Emmanuel Koffi', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150', role: 'Researcher', isNetworkMember: false },
    ],
    relatedInitiatives: [
      { id: 'prop6', type: 'proposal', title: 'AI Disease Prediction Scale-up', status: 'Draft' },
    ],
    impactScore: { total: 65, daoUsage: 12, proposalCitations: 22, peerEndorsements: 18, implementationLinks: 13 },
  },
  {
    id: '8',
    title: 'Traditional Medicine Integration in African Healthcare Systems: Policy Frameworks and Implementation',
    authors: ['Prof. Oluwaseun Adebayo', 'Dr. Miriam Ndungu', 'Dr. Boubacar Traoré'],
    institution: 'University of Ghana',
    abstract: 'Traditional medicine serves 80% of Africa\'s population for primary healthcare needs. This policy analysis examines successful integration models across 12 African nations, identifying regulatory frameworks that ensure safety while preserving cultural practices. We document evidence-based traditional remedies with demonstrated efficacy and propose standardization protocols. Our findings suggest that strategic integration could reduce healthcare costs by 30% while improving access in underserved communities.',
    publicationDate: '2023-07-12',
    journal: 'Health Policy and Planning',
    focusArea: 'public_health',
    tags: {
      geography: ['Ghana', 'South Africa', 'Tanzania', 'Nigeria'],
      diseases: ['Chronic Diseases', 'Mental Health', 'Infectious Diseases'],
      climateIssues: [],
      fundingReadiness: 'low',
    },
    citations: 56,
    isOpenAccess: false,
    doi: '10.1093/heapol/czad045',
    imageUrl: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=800',
    isNetworkResearch: true,
    linkedResearchers: [
      { id: 'auth7', name: 'Prof. Oluwaseun Adebayo', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', role: 'Researcher', isNetworkMember: true },
      { id: 'auth8', name: 'Dr. Miriam Ndungu', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', role: 'Researcher', isNetworkMember: true },
    ],
    relatedInitiatives: [
      { id: 'prop7', type: 'proposal', title: 'Traditional Medicine Registry', status: 'Under Review' },
    ],
    impactScore: { total: 52, daoUsage: 8, proposalCitations: 16, peerEndorsements: 14, implementationLinks: 14 },
  },
  {
    id: '9',
    title: 'Heat Wave Early Warning Systems and Public Health Response in the Sahel',
    authors: ['Dr. Fatima Hassan', 'Dr. Amadou Diop', 'Prof. Nana Ama Browne'],
    institution: 'Cheikh Anta Diop University',
    abstract: 'The Sahel region experiences extreme heat events with increasing frequency and intensity. This implementation science study evaluated heat early warning systems deployed across 4 Sahelian countries. Community-based response protocols reduced heat-related mortality by 45% during the 2023 heat wave season. We identify vulnerable populations, effective cooling strategies, and communication channels that maximize protective behavior adoption. The study provides a replicable model for heat adaptation in resource-limited settings.',
    publicationDate: '2023-05-18',
    journal: 'International Journal of Environmental Research and Public Health',
    focusArea: 'environmental_health',
    tags: {
      geography: ['Senegal', 'Mali', 'Burkina Faso', 'Niger'],
      diseases: ['Heat Stroke', 'Cardiovascular Disease', 'Dehydration'],
      climateIssues: ['Heat Waves', 'Extreme Temperatures', 'Desertification'],
      fundingReadiness: 'high',
    },
    citations: 82,
    isOpenAccess: true,
    doi: '10.3390/ijerph20091234',
    imageUrl: 'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=800',
    isNetworkResearch: true,
    linkedResearchers: [
      { id: 'auth9', name: 'Dr. Fatima Hassan', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', role: 'Researcher', isNetworkMember: true },
    ],
    relatedInitiatives: [
      { id: 'dao5', type: 'dao', title: 'Sahel Climate Resilience DAO', status: 'Active' },
      { id: 'field4', type: 'field_work', title: 'Heat Wave Response Training', status: 'Completed' },
    ],
    impactScore: { total: 76, daoUsage: 20, proposalCitations: 24, peerEndorsements: 17, implementationLinks: 15 },
  },
  {
    id: '10',
    title: 'COVID-19 Vaccine Distribution Equity in Africa: Lessons for Future Pandemic Preparedness',
    authors: ['Dr. Zainab Kamara', 'Dr. Peter Odhiambo', 'Prof. Amara Bangura'],
    institution: 'African Union CDC',
    abstract: 'The COVID-19 pandemic exposed critical gaps in global health equity. This retrospective analysis examines vaccine distribution patterns across 54 African nations, identifying factors that enabled or hindered equitable access. Countries with strong primary healthcare infrastructure and community engagement achieved 2.5x higher vaccination rates. We propose a continental framework for pandemic preparedness that prioritizes local manufacturing capacity, cold chain infrastructure, and community trust-building to ensure equitable response to future health emergencies.',
    publicationDate: '2023-03-22',
    journal: 'The Lancet Global Health',
    focusArea: 'pandemic_prevention',
    tags: {
      geography: ['Continental Africa', 'Rwanda', 'Morocco', 'Seychelles'],
      diseases: ['COVID-19', 'Respiratory Infections', 'Vaccine-Preventable Diseases'],
      climateIssues: [],
      fundingReadiness: 'high',
    },
    citations: 312,
    isOpenAccess: true,
    doi: '10.1016/S2214-109X(23)00123',
    imageUrl: 'https://images.unsplash.com/photo-1605289982774-9a6fef564df8?w=800',
    isNetworkResearch: false,
    linkedResearchers: [
      { id: 'ext4', name: 'Dr. Zainab Kamara', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', role: 'Researcher', isNetworkMember: false },
    ],
    relatedInitiatives: [
      { id: 'dao6', type: 'dao', title: 'Pandemic Preparedness DAO', status: 'Active' },
      { id: 'prop8', type: 'proposal', title: 'Vaccine Manufacturing Hub', status: 'Funded' },
    ],
    impactScore: { total: 91, daoUsage: 26, proposalCitations: 34, peerEndorsements: 20, implementationLinks: 11 },
  },
];
