export interface CredibilityMetric {
  id: string;
  label: string;
  score: number;
  maxScore: number;
  description: string;
}

export interface WalletInfo {
  onChain: {
    address: string;
    balance: number;
    currency: string;
  };
  offChain: {
    balance: number;
    currency: string;
  };
  linkedAccount: {
    type: 'bank' | 'mobile_money';
    name: string;
    lastFour: string;
    verified: boolean;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  affiliation: string;
  role: 'Researcher' | 'Builder' | 'Funder' | 'Hybrid';
  bio: string;
  location: string;
  joinedDate: string;
  credibilityScore: number;
  credibilityMetrics: CredibilityMetric[];
  wallet: WalletInfo;
  stats: {
    community: number;
    funded: number;
    messages: number;
    discussions: number;
    collaborations: number;
    fieldWork: number;
    research: number;
  };
  fieldPosts?: UserFieldPost[];
  userResearch?: UserResearch[];
}

export const credibilityMetrics: CredibilityMetric[] = [
  {
    id: 'funded_work',
    label: 'Past Funded Work',
    score: 92,
    maxScore: 100,
    description: '12 projects successfully funded and completed',
  },
  {
    id: 'dao_participation',
    label: 'DAO Participation',
    score: 87,
    maxScore: 100,
    description: '156 votes cast, 23 proposals reviewed',
  },
  {
    id: 'reporting',
    label: 'Reporting Compliance',
    score: 95,
    maxScore: 100,
    description: '100% on-time milestone reports',
  },
  {
    id: 'peer_reviews',
    label: 'Peer Reviews',
    score: 88,
    maxScore: 100,
    description: '34 reviews given, 4.6/5 helpfulness rating',
  },
  {
    id: 'outcomes',
    label: 'Real-World Outcomes',
    score: 78,
    maxScore: 100,
    description: '3 implementations deployed, 45K beneficiaries',
  },
];

export interface UserFieldPost {
  id: string;
  title: string;
  description: string;
  type: 'photo' | 'video';
  url: string;
  thumbnail?: string;
  timestamp: string;
  geoLocation?: {
    latitude: number;
    longitude: number;
    placeName: string;
  };
  linkedTo?: {
    type: 'proposal' | 'dao';
    id: string;
    title: string;
  };
  views: number;
  likes: number;
}

export type ResearchPricingType = 'free' | 'paid_individual' | 'paid_group';

export interface ResearchCoAuthor {
  id: string;
  name: string;
  avatar: string;
  splitPercentage: number;
  walletAddress: string;
  hasWaiver?: boolean;
}

export interface UserResearch {
  id: string;
  title: string;
  abstract: string;
  documentUrl: string;
  documentName: string;
  documentSize: string;
  uploadedAt: string;
  status: 'draft' | 'pending_approval' | 'approved' | 'rejected';
  pricingType: ResearchPricingType;
  price?: number;
  currency?: string;
  coAuthors?: ResearchCoAuthor[];
  totalRevenue?: number;
  downloads?: number;
  tags: string[];
  focusArea: string;
}

export const userFieldPosts: UserFieldPost[] = [
  {
    id: 'ufp1',
    title: 'Water Quality Testing at Lake Victoria',
    description: 'Collecting water samples from multiple locations around Kisumu Bay to assess pollution levels and impact on local fishing communities.',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1581093458791-9d42e3c7e117?w=800',
    timestamp: '2025-01-28T09:30:00Z',
    geoLocation: {
      latitude: -0.1021,
      longitude: 34.7519,
      placeName: 'Kisumu Bay, Kenya',
    },
    linkedTo: {
      type: 'dao',
      id: 'dao5',
      title: 'East Africa Environmental Watch DAO',
    },
    views: 234,
    likes: 45,
  },
  {
    id: 'ufp2',
    title: 'Community Health Worker Training Session',
    description: 'Training local CHWs on new malaria rapid diagnostic testing protocols in Luapula Province.',
    type: 'video',
    url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800',
    thumbnail: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400',
    timestamp: '2025-01-25T14:15:00Z',
    geoLocation: {
      latitude: -11.7833,
      longitude: 29.0000,
      placeName: 'Mansa District, Zambia',
    },
    linkedTo: {
      type: 'proposal',
      id: 'prop6',
      title: 'Zambia Malaria Prevention Scale-up',
    },
    views: 567,
    likes: 89,
  },
  {
    id: 'ufp3',
    title: 'Drought Impact Assessment',
    description: 'Documenting the impact of prolonged drought on agricultural land in Northern Nigeria.',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1504297050568-910d24c426d3?w=800',
    timestamp: '2025-01-20T11:00:00Z',
    geoLocation: {
      latitude: 12.0022,
      longitude: 8.5919,
      placeName: 'Kano State, Nigeria',
    },
    views: 189,
    likes: 32,
  },
  {
    id: 'ufp4',
    title: 'Solar Cold Chain Installation',
    description: 'Installing solar-powered vaccine refrigerators at off-grid clinic in Volta Region.',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800',
    timestamp: '2025-01-15T08:45:00Z',
    geoLocation: {
      latitude: 7.9465,
      longitude: 1.0232,
      placeName: 'Volta Region, Ghana',
    },
    linkedTo: {
      type: 'proposal',
      id: 'prop8',
      title: 'Ghana Solar Cold Chain Expansion',
    },
    views: 423,
    likes: 78,
  },
];

export const userResearch: UserResearch[] = [
  {
    id: 'ur1',
    title: 'Climate-Resilient Agriculture Strategies for Sub-Saharan Africa',
    abstract: 'This systematic review examines climate adaptation strategies in agricultural systems across Sub-Saharan Africa, identifying key interventions and success factors.',
    documentUrl: '#',
    documentName: 'Climate_Agriculture_Review.pdf',
    documentSize: '4.2 MB',
    uploadedAt: '2025-01-10T10:00:00Z',
    status: 'approved',
    pricingType: 'free',
    downloads: 156,
    tags: ['Climate', 'Agriculture', 'Adaptation'],
    focusArea: 'Climate Adaptation',
  },
  {
    id: 'ur2',
    title: 'Disease Surveillance Systems in West Africa: Implementation Guide',
    abstract: 'A comprehensive implementation guide for establishing digital disease surveillance networks in resource-limited settings.',
    documentUrl: '#',
    documentName: 'Surveillance_Implementation.pdf',
    documentSize: '8.7 MB',
    uploadedAt: '2025-01-05T14:30:00Z',
    status: 'approved',
    pricingType: 'paid_individual',
    price: 25,
    currency: 'USDC',
    totalRevenue: 625,
    downloads: 25,
    tags: ['Disease Surveillance', 'Digital Health', 'Implementation'],
    focusArea: 'Disease Prevention',
  },
  {
    id: 'ur3',
    title: 'Community-Led Water Management: A Multi-Country Study',
    abstract: 'Research on effective community-based water resource management across 5 African countries with policy recommendations.',
    documentUrl: '#',
    documentName: 'Water_Management_Study.pdf',
    documentSize: '12.3 MB',
    uploadedAt: '2024-12-20T09:15:00Z',
    status: 'approved',
    pricingType: 'paid_group',
    price: 150,
    currency: 'USDC',
    coAuthors: [
      {
        id: 'ca1',
        name: 'Prof. Kwesi Mensah',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        splitPercentage: 30,
        walletAddress: '0x8b21...3e7f',
      },
      {
        id: 'ca2',
        name: 'Dr. Fatou Diallo',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        splitPercentage: 25,
        walletAddress: '0x4a56...9c2d',
      },
    ],
    totalRevenue: 1350,
    downloads: 9,
    tags: ['Water Security', 'Community Health', 'Policy'],
    focusArea: 'Environmental Health',
  },
  {
    id: 'ur4',
    title: 'One Health Approach to Zoonotic Disease Prevention',
    abstract: 'Framework for integrating human, animal, and environmental health surveillance for early detection of zoonotic diseases.',
    documentUrl: '#',
    documentName: 'One_Health_Framework.pdf',
    documentSize: '5.8 MB',
    uploadedAt: '2025-01-25T16:00:00Z',
    status: 'pending_approval',
    pricingType: 'paid_individual',
    price: 35,
    currency: 'USDC',
    tags: ['One Health', 'Zoonotic Diseases', 'Surveillance'],
    focusArea: 'Pandemic Prevention',
  },
  {
    id: 'ur5',
    title: 'Traditional Ecological Knowledge for Climate Adaptation',
    abstract: 'Draft paper documenting indigenous knowledge systems for climate prediction and adaptation in West Africa.',
    documentUrl: '#',
    documentName: 'TEK_Climate_Draft.pdf',
    documentSize: '3.1 MB',
    uploadedAt: '2025-01-28T11:30:00Z',
    status: 'draft',
    pricingType: 'free',
    tags: ['Traditional Knowledge', 'Climate', 'Indigenous'],
    focusArea: 'Climate Adaptation',
  },
];

export const currentUser: UserProfile = {
  id: 'user_001',
  name: 'Dr. Amara Okonkwo',
  avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400',
  affiliation: 'University of Lagos, Nigeria',
  role: 'Hybrid',
  bio: 'Climate scientist & public health researcher focused on disease surveillance systems and environmental health across West Africa.',
  location: 'Lagos, Nigeria',
  joinedDate: '2024-03-15',
  credibilityScore: 88,
  credibilityMetrics: credibilityMetrics,
  wallet: {
    onChain: {
      address: '0x7a23...8f4d',
      balance: 2450.75,
      currency: 'USDC',
    },
    offChain: {
      balance: 5200.00,
      currency: 'USD',
    },
    linkedAccount: {
      type: 'mobile_money',
      name: 'MTN Mobile Money',
      lastFour: '4521',
      verified: true,
    },
  },
  stats: {
    community: 342,
    funded: 12,
    messages: 89,
    discussions: 56,
    collaborations: 8,
    fieldWork: 15,
    research: 23,
  },
  fieldPosts: userFieldPosts,
  userResearch: userResearch,
};
