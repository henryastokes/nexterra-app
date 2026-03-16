export interface Collaboration {
  id: string;
  title: string;
  description: string;
  organization: string;
  organizationLogo: string;
  location: string;
  country: string;
  region: string;
  expertise: string[];
  timeline: {
    startDate: string;
    endDate: string;
    duration: string;
  };
  type: 'Research' | 'Field Work' | 'Technical' | 'Policy' | 'Community';
  status: 'Open' | 'In Progress' | 'Filled';
  applicants: number;
  maxCollaborators: number;
  compensation: {
    type: 'Paid' | 'Stipend' | 'Volunteer' | 'Grant-funded';
    amount?: string;
  };
  requirements: string[];
  responsibilities: string[];
  linkedProposal?: {
    id: string;
    title: string;
  };
  linkedDAO?: {
    id: string;
    name: string;
  };
  postedBy: {
    id: string;
    name: string;
    avatar: string;
    role: string;
  };
  postedDate: string;
  tags: string[];
}

export const collaborationTypes = ['Research', 'Field Work', 'Technical', 'Policy', 'Community'] as const;
export const collaborationStatuses = ['Open', 'In Progress', 'Filled'] as const;
export const compensationTypes = ['Paid', 'Stipend', 'Volunteer', 'Grant-funded'] as const;

export const collaborations: Collaboration[] = [
  {
    id: 'collab_001',
    title: 'Malaria Early Warning System Field Researcher',
    description: 'Join our team deploying IoT sensors and mobile health tools across rural Ghana to build a real-time malaria outbreak prediction system. You will work directly with community health workers to collect data, validate models, and train local teams on the technology.',
    organization: 'University of Ghana & Africa CDC',
    organizationLogo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=400',
    location: 'Accra & Northern Region, Ghana',
    country: 'Ghana',
    region: 'West Africa',
    expertise: ['Disease Surveillance', 'Public Health', 'Data Science', 'Community Health'],
    timeline: {
      startDate: '2025-03-01',
      endDate: '2025-09-30',
      duration: '7 months',
    },
    type: 'Field Work',
    status: 'Open',
    applicants: 12,
    maxCollaborators: 4,
    compensation: {
      type: 'Grant-funded',
      amount: '$3,500/month + field allowance',
    },
    requirements: [
      'Masters degree in Public Health, Epidemiology, or related field',
      'Experience with mobile data collection tools',
      'Fluency in English; local language proficiency preferred',
      'Willingness to travel to remote areas',
      'Valid passport and ability to obtain Ghana visa',
    ],
    responsibilities: [
      'Deploy and maintain sensor networks in target communities',
      'Train community health workers on data collection protocols',
      'Conduct weekly data quality assessments',
      'Participate in outbreak response simulations',
      'Document field learnings and contribute to research publications',
    ],
    linkedProposal: {
      id: 'prop_001',
      title: 'AI-Powered Malaria Outbreak Prediction',
    },
    linkedDAO: {
      id: 'dao_001',
      name: 'West Africa Health Surveillance DAO',
    },
    postedBy: {
      id: 'user_002',
      name: 'Dr. Kwame Asante',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      role: 'Principal Investigator',
    },
    postedDate: '2025-01-15',
    tags: ['malaria', 'IoT', 'machine learning', 'ghana', 'field work'],
  },
  {
    id: 'collab_002',
    title: 'Climate-Smart Agriculture Data Analyst',
    description: 'Analyze satellite imagery and ground-truth data to develop predictive models for crop yield and drought risk across East Africa. This remote-friendly role involves building dashboards for smallholder farmers and agricultural extension workers.',
    organization: 'Senegal Climate Initiative',
    organizationLogo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400',
    location: 'Remote (Dakar-based team)',
    country: 'Senegal',
    region: 'West Africa',
    expertise: ['Climate Adaptation', 'Agriculture', 'Data Science'],
    timeline: {
      startDate: '2025-02-15',
      endDate: '2025-08-15',
      duration: '6 months',
    },
    type: 'Technical',
    status: 'Open',
    applicants: 28,
    maxCollaborators: 2,
    compensation: {
      type: 'Paid',
      amount: '$4,000/month',
    },
    requirements: [
      'Strong Python/R skills with experience in geospatial analysis',
      'Familiarity with satellite imagery (Sentinel, Landsat)',
      'Experience building data visualization dashboards',
      'Background in agriculture or climate science preferred',
    ],
    responsibilities: [
      'Process and analyze multi-source satellite data',
      'Develop crop yield prediction models',
      'Build farmer-facing dashboards in local languages',
      'Collaborate with field teams for model validation',
    ],
    linkedProposal: {
      id: 'prop_003',
      title: 'Climate-Resilient Farming Intelligence Platform',
    },
    postedBy: {
      id: 'user_008',
      name: 'Ibrahim Diallo',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
      role: 'Project Lead',
    },
    postedDate: '2025-01-20',
    tags: ['climate', 'agriculture', 'remote sensing', 'data science'],
  },
  {
    id: 'collab_003',
    title: 'Community Health Worker Training Facilitator',
    description: 'Lead training workshops for community health workers in Rwanda on pandemic preparedness protocols. You will adapt global best practices to local contexts and develop sustainable training materials.',
    organization: 'Rwanda Biomedical Centre',
    organizationLogo: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400',
    location: 'Kigali & Eastern Province, Rwanda',
    country: 'Rwanda',
    region: 'East Africa',
    expertise: ['Community Health', 'Public Health', 'Pandemic Prevention'],
    timeline: {
      startDate: '2025-04-01',
      endDate: '2025-07-31',
      duration: '4 months',
    },
    type: 'Community',
    status: 'Open',
    applicants: 8,
    maxCollaborators: 3,
    compensation: {
      type: 'Stipend',
      amount: '$2,000/month + accommodation',
    },
    requirements: [
      'Experience in health worker training or capacity building',
      'Strong facilitation and communication skills',
      'French or Kinyarwanda language skills highly valued',
      'Background in infectious disease or emergency response',
    ],
    responsibilities: [
      'Design and deliver 2-day training workshops',
      'Create locally-adapted training materials',
      'Assess trainee competencies and provide feedback',
      'Document best practices for scale-up',
    ],
    linkedDAO: {
      id: 'dao_002',
      name: 'East Africa Pandemic Preparedness Network',
    },
    postedBy: {
      id: 'user_007',
      name: 'Grace Mutoni',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
      role: 'Training Coordinator',
    },
    postedDate: '2025-01-18',
    tags: ['training', 'community health', 'pandemic', 'rwanda'],
  },
  {
    id: 'collab_004',
    title: 'Health Policy Research Assistant',
    description: 'Support policy analysis and stakeholder engagement for health system strengthening initiatives across Sub-Saharan Africa. This role combines desk research with policy brief writing and stakeholder interviews.',
    organization: 'Ethiopian Public Health Institute',
    organizationLogo: 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=400',
    location: 'Addis Ababa, Ethiopia (Hybrid)',
    country: 'Ethiopia',
    region: 'East Africa',
    expertise: ['Policy Research', 'Public Health'],
    timeline: {
      startDate: '2025-03-15',
      endDate: '2025-12-15',
      duration: '9 months',
    },
    type: 'Policy',
    status: 'Open',
    applicants: 15,
    maxCollaborators: 2,
    compensation: {
      type: 'Paid',
      amount: '$2,800/month',
    },
    requirements: [
      'Graduate degree in Public Policy, Public Health, or related field',
      'Strong research and analytical writing skills',
      'Experience conducting stakeholder interviews',
      'Knowledge of African health systems',
    ],
    responsibilities: [
      'Conduct systematic literature reviews',
      'Draft policy briefs and position papers',
      'Organize stakeholder consultations',
      'Support advocacy efforts with government officials',
    ],
    linkedProposal: {
      id: 'prop_005',
      title: 'Universal Health Coverage Roadmap for East Africa',
    },
    postedBy: {
      id: 'user_005',
      name: 'Dr. Amina Hassan',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
      role: 'Senior Researcher',
    },
    postedDate: '2025-01-22',
    tags: ['policy', 'health systems', 'research', 'ethiopia'],
  },
  {
    id: 'collab_005',
    title: 'Water Quality Monitoring System Developer',
    description: 'Build and deploy low-cost water quality sensors for community water sources across Nigeria. This technical role involves hardware prototyping, firmware development, and community deployment.',
    organization: 'WaterAid West Africa',
    organizationLogo: 'https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?w=400',
    location: 'Lagos & Niger Delta, Nigeria',
    country: 'Nigeria',
    region: 'West Africa',
    expertise: ['Water Systems', 'Environmental Health', 'Data Science'],
    timeline: {
      startDate: '2025-05-01',
      endDate: '2025-11-30',
      duration: '7 months',
    },
    type: 'Technical',
    status: 'In Progress',
    applicants: 6,
    maxCollaborators: 3,
    compensation: {
      type: 'Grant-funded',
      amount: '$3,200/month',
    },
    requirements: [
      'Experience with IoT hardware and embedded systems',
      'Programming skills (Python, C++)',
      'Understanding of water quality parameters',
      'Ability to work in challenging field conditions',
    ],
    responsibilities: [
      'Design and test sensor prototypes',
      'Develop data transmission and storage systems',
      'Train local technicians on maintenance',
      'Document technical specifications',
    ],
    linkedDAO: {
      id: 'dao_003',
      name: 'Africa Water Security Collective',
    },
    postedBy: {
      id: 'user_006',
      name: 'Samuel Osei',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
      role: 'Technical Director',
    },
    postedDate: '2025-01-10',
    tags: ['water', 'IoT', 'sensors', 'nigeria', 'environment'],
  },
  {
    id: 'collab_006',
    title: 'Genomic Surveillance Research Fellow',
    description: 'Join a cutting-edge research team conducting genomic surveillance of emerging pathogens. You will contribute to sequencing workflows, bioinformatics analysis, and regional data sharing initiatives.',
    organization: 'Africa CDC Pathogen Genomics Initiative',
    organizationLogo: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400',
    location: 'Nairobi, Kenya',
    country: 'Kenya',
    region: 'East Africa',
    expertise: ['Disease Surveillance', 'Pandemic Prevention', 'Data Science'],
    timeline: {
      startDate: '2025-06-01',
      endDate: '2026-05-31',
      duration: '12 months',
    },
    type: 'Research',
    status: 'Open',
    applicants: 22,
    maxCollaborators: 2,
    compensation: {
      type: 'Grant-funded',
      amount: '$4,500/month + research budget',
    },
    requirements: [
      'PhD or equivalent experience in molecular biology or bioinformatics',
      'Experience with NGS data analysis pipelines',
      'Strong publication record',
      'Commitment to open science and data sharing',
    ],
    responsibilities: [
      'Lead genomic analysis of pathogen samples',
      'Develop and optimize bioinformatics workflows',
      'Contribute to regional surveillance reports',
      'Mentor junior researchers and students',
    ],
    linkedProposal: {
      id: 'prop_008',
      title: 'Pan-African Pathogen Genomics Network',
    },
    linkedDAO: {
      id: 'dao_004',
      name: 'Genomic Surveillance for Africa DAO',
    },
    postedBy: {
      id: 'user_003',
      name: 'Fatima El-Amin',
      avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400',
      role: 'Program Director',
    },
    postedDate: '2025-01-25',
    tags: ['genomics', 'bioinformatics', 'surveillance', 'research'],
  },
  {
    id: 'collab_007',
    title: 'Urban Health Data Coordinator',
    description: 'Coordinate data collection and analysis for a multi-city study on air quality and respiratory health in African megacities. You will manage partnerships with local health authorities and ensure data quality.',
    organization: 'Cairo University & Africa Urban Health Network',
    organizationLogo: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=400',
    location: 'Cairo, Egypt (with travel)',
    country: 'Egypt',
    region: 'North Africa',
    expertise: ['Environmental Health', 'Public Health', 'Data Science'],
    timeline: {
      startDate: '2025-04-15',
      endDate: '2025-10-15',
      duration: '6 months',
    },
    type: 'Research',
    status: 'Open',
    applicants: 11,
    maxCollaborators: 1,
    compensation: {
      type: 'Paid',
      amount: '$3,000/month + travel',
    },
    requirements: [
      'Experience in epidemiological data management',
      'Strong coordination and communication skills',
      'Arabic language proficiency',
      'Familiarity with air quality monitoring',
    ],
    responsibilities: [
      'Coordinate data collection across 5 cities',
      'Ensure data quality and standardization',
      'Manage relationships with local partners',
      'Prepare interim analysis reports',
    ],
    postedBy: {
      id: 'user_011',
      name: 'Aisha Mohammed',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
      role: 'Study Coordinator',
    },
    postedDate: '2025-01-28',
    tags: ['urban health', 'air quality', 'data', 'egypt'],
  },
  {
    id: 'collab_008',
    title: 'Maternal Health App UX Designer',
    description: 'Design user interfaces for a mobile health app serving pregnant women and new mothers in Tanzania. You will conduct user research, create prototypes, and iterate based on community feedback.',
    organization: 'Tanzania Health Research Institute',
    organizationLogo: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400',
    location: 'Remote (with field visits to Dar es Salaam)',
    country: 'Tanzania',
    region: 'East Africa',
    expertise: ['Community Health', 'Public Health'],
    timeline: {
      startDate: '2025-03-01',
      endDate: '2025-06-30',
      duration: '4 months',
    },
    type: 'Technical',
    status: 'Filled',
    applicants: 35,
    maxCollaborators: 1,
    compensation: {
      type: 'Paid',
      amount: '$3,500/month',
    },
    requirements: [
      'Portfolio demonstrating mobile app design experience',
      'Experience with user research in low-resource settings',
      'Understanding of human-centered design principles',
      'Swahili language skills preferred',
    ],
    responsibilities: [
      'Conduct user research with target populations',
      'Create wireframes and interactive prototypes',
      'Collaborate with development team',
      'Iterate designs based on usability testing',
    ],
    linkedProposal: {
      id: 'prop_010',
      title: 'MamaCare: AI-Assisted Maternal Health Platform',
    },
    postedBy: {
      id: 'user_013',
      name: 'Dr. Zainab Kamara',
      avatar: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400',
      role: 'Project Lead',
    },
    postedDate: '2025-01-05',
    tags: ['UX', 'mobile health', 'maternal health', 'design'],
  },
];

export const regionOptions = ['West Africa', 'East Africa', 'North Africa', 'Southern Africa', 'Central Africa'];
