export interface FundingRecord {
  id: string;
  projectTitle: string;
  amount: number;
  date: string;
  status: 'completed' | 'active' | 'pending';
}

export interface Funder {
  id: string;
  name: string;
  avatar: string;
  organization: string;
  type: 'Individual' | 'Foundation' | 'Institution' | 'Corporate';
  bio: string;
  location: string;
  country: string;
  focusAreas: string[];
  joinedDate: string;
  credibilityScore: number;
  totalFunded: number;
  projectsFunded: number;
  fundingHistory: FundingRecord[];
}

export const focusAreaOptions = [
  'Climate Research',
  'Disease Prevention',
  'Public Health Infrastructure',
  'Clean Water Access',
  'Agricultural Innovation',
  'Pandemic Preparedness',
  'Environmental Conservation',
  'Health Technology',
  'Community Health',
  'Policy Research',
];

export const funders: Funder[] = [
  {
    id: 'funder_001',
    name: 'Fatima El-Amin',
    avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400',
    organization: 'African Development Bank',
    type: 'Institution',
    bio: 'Climate finance specialist with 15 years experience in sustainable development funding across the continent.',
    location: 'Nairobi, Kenya',
    country: 'Kenya',
    focusAreas: ['Climate Research', 'Environmental Conservation', 'Agricultural Innovation'],
    joinedDate: '2023-11-20',
    credibilityScore: 95,
    totalFunded: 2450000,
    projectsFunded: 34,
    fundingHistory: [
      { id: 'f1', projectTitle: 'East Africa Drought Early Warning System', amount: 250000, date: '2024-08-15', status: 'active' },
      { id: 'f2', projectTitle: 'Renewable Energy for Rural Clinics', amount: 180000, date: '2024-06-22', status: 'completed' },
      { id: 'f3', projectTitle: 'Sustainable Farming Initiative - Ghana', amount: 320000, date: '2024-03-10', status: 'completed' },
    ],
  },
  {
    id: 'funder_002',
    name: 'Dr. Nana Akua',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    organization: 'Bill & Melinda Gates Foundation',
    type: 'Foundation',
    bio: 'Program officer overseeing health innovation grants across Sub-Saharan Africa, focusing on disease eradication.',
    location: 'Nairobi, Kenya',
    country: 'Kenya',
    focusAreas: ['Disease Prevention', 'Public Health Infrastructure', 'Pandemic Preparedness'],
    joinedDate: '2023-08-15',
    credibilityScore: 97,
    totalFunded: 8750000,
    projectsFunded: 52,
    fundingHistory: [
      { id: 'f4', projectTitle: 'Malaria Surveillance Network - West Africa', amount: 1200000, date: '2024-09-01', status: 'active' },
      { id: 'f5', projectTitle: 'Mobile Health Clinics - Nigeria', amount: 450000, date: '2024-07-18', status: 'active' },
      { id: 'f6', projectTitle: 'Vaccine Cold Chain Improvement', amount: 680000, date: '2024-04-25', status: 'completed' },
    ],
  },
  {
    id: 'funder_003',
    name: 'Daniel Okoro',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400',
    organization: 'AfriHealth Ventures',
    type: 'Corporate',
    bio: 'Impact investor focused on early-stage health tech startups transforming healthcare delivery across Africa.',
    location: 'Lagos, Nigeria',
    country: 'Nigeria',
    focusAreas: ['Health Technology', 'Community Health', 'Disease Prevention'],
    joinedDate: '2023-10-25',
    credibilityScore: 88,
    totalFunded: 1250000,
    projectsFunded: 18,
    fundingHistory: [
      { id: 'f7', projectTitle: 'AI Diagnostic Tool for Rural Clinics', amount: 150000, date: '2024-08-28', status: 'active' },
      { id: 'f8', projectTitle: 'Telemedicine Platform - East Africa', amount: 200000, date: '2024-05-12', status: 'completed' },
      { id: 'f9', projectTitle: 'Community Health Worker App', amount: 85000, date: '2024-02-20', status: 'completed' },
    ],
  },
  {
    id: 'funder_004',
    name: 'Marcus Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    organization: 'GreenFuture Capital',
    type: 'Corporate',
    bio: 'Venture partner specializing in climate tech investments with a focus on African adaptation solutions.',
    location: 'Cape Town, South Africa',
    country: 'South Africa',
    focusAreas: ['Climate Research', 'Agricultural Innovation', 'Environmental Conservation'],
    joinedDate: '2024-01-08',
    credibilityScore: 85,
    totalFunded: 890000,
    projectsFunded: 12,
    fundingHistory: [
      { id: 'f10', projectTitle: 'Smart Irrigation Systems - Kenya', amount: 175000, date: '2024-09-10', status: 'active' },
      { id: 'f11', projectTitle: 'Carbon Capture Research', amount: 250000, date: '2024-06-30', status: 'active' },
      { id: 'f12', projectTitle: 'Reforestation Monitoring Drones', amount: 120000, date: '2024-01-25', status: 'completed' },
    ],
  },
  {
    id: 'funder_005',
    name: 'Dr. Sarah Mensah',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
    organization: 'Wellcome Trust Africa',
    type: 'Foundation',
    bio: 'Regional director funding cutting-edge biomedical research and health systems strengthening.',
    location: 'Accra, Ghana',
    country: 'Ghana',
    focusAreas: ['Disease Prevention', 'Pandemic Preparedness', 'Public Health Infrastructure'],
    joinedDate: '2023-09-12',
    credibilityScore: 94,
    totalFunded: 4200000,
    projectsFunded: 28,
    fundingHistory: [
      { id: 'f13', projectTitle: 'Genomic Sequencing Lab - Nigeria', amount: 800000, date: '2024-08-05', status: 'active' },
      { id: 'f14', projectTitle: 'Antimicrobial Resistance Study', amount: 350000, date: '2024-04-18', status: 'completed' },
      { id: 'f15', projectTitle: 'Health Worker Training Program', amount: 220000, date: '2024-02-10', status: 'completed' },
    ],
  },
  {
    id: 'funder_006',
    name: 'Ahmed Hassan',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    organization: 'Individual Philanthropist',
    type: 'Individual',
    bio: 'Tech entrepreneur turned philanthropist, passionate about bringing clean water access to underserved communities.',
    location: 'Cairo, Egypt',
    country: 'Egypt',
    focusAreas: ['Clean Water Access', 'Community Health', 'Environmental Conservation'],
    joinedDate: '2024-02-20',
    credibilityScore: 82,
    totalFunded: 380000,
    projectsFunded: 8,
    fundingHistory: [
      { id: 'f16', projectTitle: 'Solar Water Purification - Ethiopia', amount: 95000, date: '2024-07-22', status: 'active' },
      { id: 'f17', projectTitle: 'Well Drilling Initiative - Sudan', amount: 150000, date: '2024-03-15', status: 'completed' },
      { id: 'f18', projectTitle: 'Water Quality Monitoring Network', amount: 65000, date: '2024-01-08', status: 'completed' },
    ],
  },
  {
    id: 'funder_007',
    name: 'Amara Diop',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
    organization: 'African Union Climate Fund',
    type: 'Institution',
    bio: 'Program manager coordinating multi-national climate adaptation initiatives across the Sahel region.',
    location: 'Dakar, Senegal',
    country: 'Senegal',
    focusAreas: ['Climate Research', 'Agricultural Innovation', 'Policy Research'],
    joinedDate: '2023-12-05',
    credibilityScore: 91,
    totalFunded: 3100000,
    projectsFunded: 22,
    fundingHistory: [
      { id: 'f19', projectTitle: 'Sahel Climate Resilience Program', amount: 750000, date: '2024-09-05', status: 'active' },
      { id: 'f20', projectTitle: 'Desert Locust Early Warning', amount: 280000, date: '2024-05-28', status: 'completed' },
      { id: 'f21', projectTitle: 'Agroforestry Research Network', amount: 420000, date: '2024-02-15', status: 'completed' },
    ],
  },
  {
    id: 'funder_008',
    name: 'Peter Okonkwo',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400',
    organization: 'Dangote Foundation',
    type: 'Foundation',
    bio: 'Executive director focusing on nutrition security and childhood health across Nigeria and West Africa.',
    location: 'Abuja, Nigeria',
    country: 'Nigeria',
    focusAreas: ['Community Health', 'Public Health Infrastructure', 'Agricultural Innovation'],
    joinedDate: '2023-07-18',
    credibilityScore: 89,
    totalFunded: 5600000,
    projectsFunded: 41,
    fundingHistory: [
      { id: 'f22', projectTitle: 'Childhood Malnutrition Prevention', amount: 900000, date: '2024-08-20', status: 'active' },
      { id: 'f23', projectTitle: 'School Feeding Program Expansion', amount: 1200000, date: '2024-04-10', status: 'active' },
      { id: 'f24', projectTitle: 'Fortified Food Production', amount: 550000, date: '2024-01-30', status: 'completed' },
    ],
  },
];
