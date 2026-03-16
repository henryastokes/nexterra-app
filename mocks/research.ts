export interface ResearchProject {
  id: string;
  title: string;
  description: string;
  category: 'climate' | 'health' | 'agriculture' | 'energy';
  institution: string;
  location: string;
  fundingGoal: number;
  fundingRaised: number;
  votesFor: number;
  votesAgainst: number;
  status: 'voting' | 'funding' | 'active' | 'completed';
  imageUrl: string;
  researcher: {
    name: string;
    avatar: string;
  };
  daysLeft: number;
}

export interface DAOMember {
  id: string;
  name: string;
  avatar: string;
  votingPower: number;
  contributions: number;
  rank: number;
}

export const researchProjects: ResearchProject[] = [
  {
    id: '1',
    title: 'Drought-Resistant Maize Varieties',
    description: 'Developing climate-resilient maize strains for East African farmers facing increasing drought conditions.',
    category: 'agriculture',
    institution: 'University of Nairobi',
    location: 'Kenya',
    fundingGoal: 150000,
    fundingRaised: 89500,
    votesFor: 1247,
    votesAgainst: 123,
    status: 'funding',
    imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800',
    researcher: {
      name: 'Dr. Amina Okonkwo',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200',
    },
    daysLeft: 18,
  },
  {
    id: '2',
    title: 'Solar Microgrids for Rural Communities',
    description: 'Designing affordable solar microgrid solutions for off-grid communities in Sub-Saharan Africa.',
    category: 'energy',
    institution: 'Addis Ababa University',
    location: 'Ethiopia',
    fundingGoal: 200000,
    fundingRaised: 145000,
    votesFor: 2103,
    votesAgainst: 89,
    status: 'funding',
    imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800',
    researcher: {
      name: 'Prof. Yohannes Bekele',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    },
    daysLeft: 12,
  },
  {
    id: '3',
    title: 'Malaria Vaccine Distribution Model',
    description: 'Optimizing vaccine distribution networks in remote areas using AI and community health workers.',
    category: 'health',
    institution: 'Makerere University',
    location: 'Uganda',
    fundingGoal: 175000,
    fundingRaised: 52000,
    votesFor: 1876,
    votesAgainst: 201,
    status: 'voting',
    imageUrl: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=800',
    researcher: {
      name: 'Dr. Grace Nakimuli',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200',
    },
    daysLeft: 25,
  },
  {
    id: '4',
    title: 'Mangrove Restoration for Coastal Protection',
    description: 'Large-scale mangrove ecosystem restoration to protect coastal communities from climate change impacts.',
    category: 'climate',
    institution: 'University of Dar es Salaam',
    location: 'Tanzania',
    fundingGoal: 120000,
    fundingRaised: 120000,
    votesFor: 3421,
    votesAgainst: 67,
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1597655601841-214a4cfe8b2c?w=800',
    researcher: {
      name: 'Dr. Juma Mwalimu',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
    },
    daysLeft: 0,
  },
  {
    id: '5',
    title: 'Clean Water Filtration Systems',
    description: 'Low-cost, locally-manufactured water filtration systems for communities without access to clean water.',
    category: 'health',
    institution: 'University of Cape Town',
    location: 'South Africa',
    fundingGoal: 90000,
    fundingRaised: 67500,
    votesFor: 1542,
    votesAgainst: 98,
    status: 'funding',
    imageUrl: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=800',
    researcher: {
      name: 'Dr. Thabo Molefe',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200',
    },
    daysLeft: 8,
  },
];

export const daoMembers: DAOMember[] = [
  { id: '1', name: 'Chioma Adeyemi', avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200', votingPower: 2450, contributions: 45000, rank: 1 },
  { id: '2', name: 'Kwame Asante', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200', votingPower: 2180, contributions: 38000, rank: 2 },
  { id: '3', name: 'Fatima Hassan', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200', votingPower: 1920, contributions: 32000, rank: 3 },
  { id: '4', name: 'Samuel Obi', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200', votingPower: 1750, contributions: 28000, rank: 4 },
  { id: '5', name: 'Aisha Diallo', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200', votingPower: 1580, contributions: 25000, rank: 5 },
  { id: '6', name: 'David Mensah', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200', votingPower: 1420, contributions: 22000, rank: 6 },
  { id: '7', name: 'Zainab Kamara', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200', votingPower: 1280, contributions: 19500, rank: 7 },
  { id: '8', name: 'Emmanuel Koffi', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200', votingPower: 1150, contributions: 17000, rank: 8 },
];

export const categories = [
  { id: 'all', label: 'All', icon: 'Globe' },
  { id: 'climate', label: 'Climate', icon: 'Cloud' },
  { id: 'health', label: 'Health', icon: 'Heart' },
  { id: 'agriculture', label: 'Agriculture', icon: 'Leaf' },
  { id: 'energy', label: 'Energy', icon: 'Zap' },
];
