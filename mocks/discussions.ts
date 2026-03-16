export interface ForumCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  threadCount: number;
  postCount: number;
  color: string;
}

export interface DiscussionAuthor {
  id: string;
  name: string;
  avatar: string;
  role: string;
  credibilityScore: number;
}

export interface Attachment {
  id: string;
  type: 'document' | 'photo' | 'video' | 'audio';
  name: string;
  url: string;
  size: string;
  mimeType: string;
}

export interface GeographicTag {
  country?: string;
  region?: string;
}

export interface LinkedInitiative {
  id: string;
  type: 'proposal' | 'ask' | 'dao';
  title: string;
  status: string;
}

export interface EditHistoryEntry {
  id: string;
  editedAt: string;
  editedBy: string;
  previousContent: string;
  reason?: string;
}

export interface PeerEndorsement {
  id: string;
  endorserId: string;
  endorserName: string;
  endorserAvatar: string;
  endorserCredibility: number;
  endorserRole: string;
  endorsedAt: string;
  endorsementType: 'quality' | 'accuracy' | 'insight' | 'methodology';
  comment?: string;
}

export interface AIAnalysis {
  summary: string;
  keyInsights: string[];
  detectedPatterns?: {
    type: 'regional' | 'temporal' | 'topic' | 'cross-domain';
    description: string;
    confidence: number;
    relatedThreadIds?: string[];
  }[];
  signalStrength: 'high' | 'medium' | 'low';
  governanceRelevance: number;
  suggestedTags?: string[];
  lastAnalyzedAt: string;
}

export interface Reply {
  id: string;
  threadId: string;
  author: DiscussionAuthor;
  content: string;
  createdAt: string;
  upvotes: number;
  isEdited: boolean;
  attachments?: Attachment[];
  editHistory?: EditHistoryEntry[];
  endorsements?: PeerEndorsement[];
}

export type KnowledgeType = 'peer_reviewed' | 'field_reported' | 'community_sourced' | 'expert_opinion';

export interface DiscussionThread {
  id: string;
  categoryId: string;
  title: string;
  content: string;
  author: DiscussionAuthor;
  createdAt: string;
  updatedAt: string;
  upvotes: number;
  replyCount: number;
  views: number;
  isPinned: boolean;
  tags: string[];
  replies: Reply[];
  attachments?: Attachment[];
  geographicTags?: GeographicTag;
  issueArea?: string;
  linkedInitiatives?: LinkedInitiative[];
  knowledgeType: KnowledgeType;
  aiAnalysis?: AIAnalysis;
  endorsements?: PeerEndorsement[];
  editHistory?: EditHistoryEntry[];
  credibilityImpact?: number;
  isHighSignal?: boolean;
  dataSovereignty?: {
    owner: string;
    consentGiven: boolean;
    restrictions?: string[];
  };
}

export const forumCategories: ForumCategory[] = [
  {
    id: 'climate',
    name: 'Climate Adaptation & Mitigation',
    description: 'Discuss strategies for climate resilience, carbon reduction, and sustainable development across Africa',
    icon: 'Leaf',
    threadCount: 47,
    postCount: 312,
    color: '#4CAF50',
  },
  {
    id: 'health',
    name: 'Public Health & Disease',
    description: 'Share insights on disease prevention, health systems strengthening, and medical research priorities',
    icon: 'Heart',
    threadCount: 38,
    postCount: 256,
    color: '#E91E63',
  },
  {
    id: 'pandemic',
    name: 'Pandemic Preparedness',
    description: 'Collaborate on surveillance systems, outbreak response, and pandemic prevention strategies',
    icon: 'Shield',
    threadCount: 29,
    postCount: 198,
    color: '#FF9800',
  },
  {
    id: 'environmental',
    name: 'Environmental Health',
    description: 'Explore the intersection of environmental factors and human health in African contexts',
    icon: 'Trees',
    threadCount: 24,
    postCount: 167,
    color: '#00BCD4',
  },
  {
    id: 'governance',
    name: 'Funding & DAO Governance',
    description: 'Discuss funding mechanisms, DAO operations, and transparent governance practices',
    icon: 'Vote',
    threadCount: 52,
    postCount: 423,
    color: '#9C27B0',
  },
];

export const discussionAuthors: DiscussionAuthor[] = [
  {
    id: 'auth1',
    name: 'Dr. Amina Okonkwo',
    avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&h=150&fit=crop',
    role: 'Researcher',
    credibilityScore: 94,
  },
  {
    id: 'auth2',
    name: 'Samuel Mensah',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    role: 'Builder',
    credibilityScore: 87,
  },
  {
    id: 'auth3',
    name: 'Dr. Fatima Al-Hassan',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    role: 'Researcher',
    credibilityScore: 91,
  },
  {
    id: 'auth4',
    name: 'Kwame Asante',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
    role: 'Funder',
    credibilityScore: 89,
  },
  {
    id: 'auth5',
    name: 'Zara Ibrahim',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    role: 'Hybrid',
    credibilityScore: 85,
  },
];

export const countries = [
  'Nigeria', 'Kenya', 'Ghana', 'South Africa', 'Ethiopia', 'Tanzania',
  'Uganda', 'Rwanda', 'Senegal', 'Mali', 'Niger', 'Egypt', 'Morocco',
  'Cameroon', 'Côte d\'Ivoire', 'Zimbabwe', 'Zambia', 'Malawi', 'Mozambique'
];

export const regions = [
  'West Africa', 'East Africa', 'Southern Africa', 'North Africa',
  'Central Africa', 'Sahel', 'Horn of Africa', 'Great Lakes'
];

export const issueAreas = [
  'Climate Adaptation', 'Disease Prevention', 'Water Security',
  'Food Security', 'Renewable Energy', 'Healthcare Access',
  'Pandemic Preparedness', 'Environmental Conservation', 'Air Quality',
  'Sanitation', 'Maternal Health', 'Infectious Disease'
];

export const discussionThreads: DiscussionThread[] = [
  {
    id: 'thread1',
    categoryId: 'climate',
    title: 'Drought-Resistant Crop Varieties: Lessons from the Sahel',
    knowledgeType: 'peer_reviewed',
    aiAnalysis: {
      summary: 'Research team presents 5-year findings on drought-resistant crops in the Sahel, showing 40% better tolerance with local varieties and 78% adoption rates through participatory breeding. Key recommendation: integrate regenerative agriculture with drought-resistant varieties for 60% amplified benefits.',
      keyInsights: [
        'Local seed varieties outperform imported hybrids by 40% in drought tolerance',
        'Farmer-participatory breeding achieves 78% adoption vs 34% for top-down approaches',
        'Combining drought-resistant varieties with regenerative agriculture amplifies benefits by 60%',
      ],
      detectedPatterns: [
        {
          type: 'regional',
          description: 'Similar drought adaptation strategies emerging across Sahel countries',
          confidence: 0.87,
          relatedThreadIds: ['thread6'],
        },
        {
          type: 'topic',
          description: 'Community-led approaches consistently showing higher success rates',
          confidence: 0.92,
        },
      ],
      signalStrength: 'high',
      governanceRelevance: 95,
      lastAnalyzedAt: '2025-01-30T08:00:00Z',
    },
    endorsements: [
      {
        id: 'end1',
        endorserId: 'auth3',
        endorserName: 'Dr. Fatima Al-Hassan',
        endorserAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
        endorserCredibility: 91,
        endorserRole: 'Researcher',
        endorsedAt: '2025-01-29T10:00:00Z',
        endorsementType: 'methodology',
        comment: 'Rigorous methodology with excellent community integration.',
      },
      {
        id: 'end2',
        endorserId: 'auth4',
        endorserName: 'Kwame Asante',
        endorserAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
        endorserCredibility: 89,
        endorserRole: 'Funder',
        endorsedAt: '2025-01-29T14:30:00Z',
        endorsementType: 'quality',
      },
    ],
    credibilityImpact: 8,
    isHighSignal: true,
    content: `Over the past five years, our research team has been working with farming communities across the Sahel region to develop and test drought-resistant crop varieties. I wanted to share some key findings and open a discussion on scaling these solutions.

**Key Findings:**

1. **Local Variety Adaptation**: Traditional seed varieties, when selectively bred, showed 40% better drought tolerance than imported hybrids.

2. **Community-Led Selection**: Farmer-participatory breeding programs resulted in higher adoption rates (78% vs 34% for top-down approaches).

3. **Soil Health Integration**: Combining drought-resistant varieties with regenerative agriculture practices amplified benefits by 60%.

**Challenges We Face:**

- Limited funding for long-term field trials
- Difficulty scaling across different microclimates
- Need for better data collection infrastructure

I believe this is an area where DAO funding could make a significant impact. Would love to hear from others working on similar challenges.`,
    author: discussionAuthors[0],
    createdAt: '2025-01-28T14:30:00Z',
    updatedAt: '2025-01-30T09:15:00Z',
    upvotes: 47,
    replyCount: 12,
    views: 234,
    isPinned: true,
    tags: ['Agriculture', 'Sahel', 'Climate Adaptation', 'Research'],
    geographicTags: { country: 'Niger', region: 'Sahel' },
    issueArea: 'Food Security',
    linkedInitiatives: [
      { id: 'prop1', type: 'proposal', title: 'Sahel Crop Resilience Initiative', status: 'Under Review' },
      { id: 'dao1', type: 'dao', title: 'Climate Adaptation DAO', status: 'Active' }
    ],
    attachments: [
      { id: 'att1', type: 'document', name: 'Research_Findings_2024.pdf', url: '#', size: '2.4 MB', mimeType: 'application/pdf' },
      { id: 'att2', type: 'photo', name: 'Field_Trial_Results.jpg', url: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800', size: '1.2 MB', mimeType: 'image/jpeg' }
    ],
    replies: [
      {
        id: 'reply1',
        threadId: 'thread1',
        author: discussionAuthors[1],
        content: 'This is excellent work, Dr. Okonkwo. At our tech hub in Accra, we\'ve been developing IoT sensors for soil moisture monitoring. Would love to explore a collaboration to integrate real-time data with your breeding programs.',
        createdAt: '2025-01-28T16:45:00Z',
        upvotes: 18,
        isEdited: false,
        attachments: [
          { id: 'ratt1', type: 'document', name: 'IoT_Sensor_Specs.pdf', url: '#', size: '890 KB', mimeType: 'application/pdf' }
        ],
      },
      {
        id: 'reply2',
        threadId: 'thread1',
        author: discussionAuthors[3],
        content: 'The funding gap you mentioned is exactly why we need more decentralized funding models. I\'d be interested in helping structure a proposal for the NexTerra DAO to support this research expansion.',
        createdAt: '2025-01-29T08:20:00Z',
        upvotes: 24,
        isEdited: false,
      },
      {
        id: 'reply3',
        threadId: 'thread1',
        author: discussionAuthors[2],
        content: 'The 78% adoption rate for farmer-participatory programs is remarkable. In my work on public health interventions, we\'ve seen similar patterns—community involvement is absolutely critical for sustainable impact.',
        createdAt: '2025-01-29T11:30:00Z',
        upvotes: 15,
        isEdited: true,
      },
    ],
  },
  {
    id: 'thread2',
    categoryId: 'health',
    title: 'Strengthening Primary Healthcare Networks in Rural Nigeria',
    knowledgeType: 'expert_opinion',
    aiAnalysis: {
      summary: 'Decade-long practitioner shares insights on rural healthcare challenges in Nigeria. Only 20% of rural communities have functional health centers. Proposes community health workers, mobile units, and SMS-based health tracking as innovative solutions.',
      keyInsights: [
        'Critical healthcare worker shortage: 1 doctor per 5,000+ people in some regions',
        'Supply chain issues persist for essential medicines',
        'Community Health Worker programs showing promise',
      ],
      detectedPatterns: [
        {
          type: 'cross-domain',
          description: 'Healthcare access issues correlating with climate vulnerability patterns',
          confidence: 0.78,
        },
      ],
      signalStrength: 'high',
      governanceRelevance: 88,
      lastAnalyzedAt: '2025-01-29T16:00:00Z',
    },
    credibilityImpact: 6,
    isHighSignal: true,
    content: `I'm writing to discuss the challenges and opportunities in building resilient primary healthcare networks in rural Nigeria. As someone who has worked in this space for over a decade, I've seen both remarkable progress and persistent barriers.

**Current State:**

- Only 20% of rural communities have access to functional primary health centers
- Healthcare worker shortages remain critical (1 doctor per 5,000+ people in some regions)
- Supply chain issues for essential medicines are common

**Innovative Approaches We're Testing:**

1. **Community Health Worker Programs**: Training local residents as first-line healthcare providers
2. **Mobile Health Units**: Rotating clinics that serve multiple villages
3. **Digital Health Records**: Implementing simple SMS-based health tracking

**Questions for the Community:**

- What funding models have worked for sustaining community health programs?
- How can we better integrate traditional medicine practitioners?
- What technology solutions have shown promise in similar contexts?

Looking forward to learning from this community's collective experience.`,
    author: discussionAuthors[2],
    createdAt: '2025-01-27T10:00:00Z',
    updatedAt: '2025-01-29T16:45:00Z',
    upvotes: 38,
    replyCount: 8,
    views: 189,
    isPinned: false,
    tags: ['Healthcare', 'Nigeria', 'Rural Health', 'Community'],
    geographicTags: { country: 'Nigeria', region: 'West Africa' },
    issueArea: 'Healthcare Access',
    linkedInitiatives: [
      { id: 'ask1', type: 'ask', title: 'Mobile Clinic Equipment Fund', status: 'Funding' },
      { id: 'prop2', type: 'proposal', title: 'Rural Health Network Expansion', status: 'Approved' }
    ],
    attachments: [
      { id: 'att3', type: 'photo', name: 'Mobile_Clinic_Photo.jpg', url: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=800', size: '980 KB', mimeType: 'image/jpeg' },
      { id: 'att4', type: 'video', name: 'CHW_Training_Video.mp4', url: '#', size: '45.2 MB', mimeType: 'video/mp4' }
    ],
    replies: [
      {
        id: 'reply4',
        threadId: 'thread2',
        author: discussionAuthors[4],
        content: 'The community health worker model has been transformative in Kenya as well. One key success factor we\'ve found is ensuring CHWs have clear career pathways and are not seen as just volunteers.',
        createdAt: '2025-01-27T14:20:00Z',
        upvotes: 22,
        isEdited: false,
      },
      {
        id: 'reply5',
        threadId: 'thread2',
        author: discussionAuthors[0],
        content: 'Regarding technology solutions—we\'ve had success with WhatsApp-based reporting systems. The key is using technology people already have and understand, rather than introducing new platforms.',
        createdAt: '2025-01-28T09:15:00Z',
        upvotes: 19,
        isEdited: false,
      },
    ],
  },
  {
    id: 'thread3',
    categoryId: 'pandemic',
    title: 'Building an Early Warning System for Zoonotic Disease Outbreaks',
    knowledgeType: 'community_sourced',
    aiAnalysis: {
      summary: 'Proposal for community-based zoonotic disease early warning system. Trains wildlife officers and community members, creates rapid reporting channels, and uses AI for pattern analysis. Seeking $800K for 5-country pilot.',
      keyInsights: [
        'Community-based surveillance can detect outbreaks earlier than centralized systems',
        'Trust and local relationships essential for timely reporting',
        'AI integration can predict potential spillover events',
      ],
      detectedPatterns: [
        {
          type: 'temporal',
          description: 'Increased zoonotic risk discussions following recent outbreak reports',
          confidence: 0.85,
          relatedThreadIds: ['field4'],
        },
      ],
      signalStrength: 'high',
      governanceRelevance: 98,
      lastAnalyzedAt: '2025-01-28T12:00:00Z',
    },
    endorsements: [
      {
        id: 'end3',
        endorserId: 'auth1',
        endorserName: 'Dr. Amina Okonkwo',
        endorserAvatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&h=150&fit=crop',
        endorserCredibility: 94,
        endorserRole: 'Researcher',
        endorsedAt: '2025-01-27T09:00:00Z',
        endorsementType: 'insight',
        comment: 'Critical proposal for pandemic prevention infrastructure.',
      },
    ],
    credibilityImpact: 10,
    isHighSignal: true,
    content: `The next pandemic is likely to emerge from the animal-human interface. Africa, with its rich biodiversity and growing human-wildlife interactions, is both at risk and uniquely positioned to lead in pandemic prevention.

**Our Proposal:**

We're developing a community-based early warning system that:

1. Trains wildlife officers and community members to recognize unusual animal mortality events
2. Creates rapid reporting channels to public health authorities
3. Integrates with existing disease surveillance networks
4. Uses AI to analyze patterns and predict potential spillover events

**Why Community-Based?**

- Local communities are often the first to notice unusual events
- Trust and relationships are essential for timely reporting
- Sustainable systems must be locally owned

**Funding Needed:**

- Pilot program in 5 countries: $450,000
- Technology infrastructure: $200,000
- Training and community engagement: $150,000

We're preparing a DAO proposal and would appreciate feedback from this community.`,
    author: discussionAuthors[1],
    createdAt: '2025-01-26T09:00:00Z',
    updatedAt: '2025-01-28T14:30:00Z',
    upvotes: 56,
    replyCount: 15,
    views: 312,
    isPinned: true,
    tags: ['Pandemic Prevention', 'Surveillance', 'One Health', 'Proposal'],
    geographicTags: { region: 'East Africa' },
    issueArea: 'Pandemic Preparedness',
    linkedInitiatives: [
      { id: 'prop3', type: 'proposal', title: 'Zoonotic Early Warning System', status: 'Draft' },
      { id: 'dao2', type: 'dao', title: 'One Health DAO', status: 'Active' }
    ],
    attachments: [
      { id: 'att5', type: 'document', name: 'Proposal_Draft_v2.pdf', url: '#', size: '3.1 MB', mimeType: 'application/pdf' },
      { id: 'att6', type: 'audio', name: 'Community_Interview.mp3', url: '#', size: '12.4 MB', mimeType: 'audio/mpeg' }
    ],
    replies: [
      {
        id: 'reply6',
        threadId: 'thread3',
        author: discussionAuthors[3],
        content: 'This is exactly the kind of preventive infrastructure we should be funding. The cost of this program is negligible compared to the economic impact of even a localized outbreak.',
        createdAt: '2025-01-26T11:30:00Z',
        upvotes: 31,
        isEdited: false,
      },
    ],
  },
  {
    id: 'thread4',
    categoryId: 'governance',
    title: 'Proposal: Quadratic Funding for Climate Research Grants',
    knowledgeType: 'expert_opinion',
    aiAnalysis: {
      summary: 'Detailed proposal for implementing quadratic funding in NexTerra climate grants. Addresses implementation considerations including matching pools, contribution rounds, sybil resistance, and geographic equity.',
      keyInsights: [
        'Quadratic funding prioritizes projects with broad community support',
        'Reduces influence of wealthy donors on funding decisions',
        'Geographic quotas may be needed for equitable distribution',
      ],
      signalStrength: 'high',
      governanceRelevance: 100,
      lastAnalyzedAt: '2025-01-30T09:00:00Z',
    },
    credibilityImpact: 7,
    isHighSignal: true,
    content: `I'd like to propose a discussion on implementing quadratic funding mechanisms for NexTerra's climate research grants.

**What is Quadratic Funding?**

Quadratic funding is a mathematically optimal way to fund public goods. It prioritizes projects with broad community support over those with a few large donors.

**Why This Matters:**

- Democratizes funding decisions
- Reduces influence of wealthy donors
- Surfaces projects with genuine community need
- Aligns incentives with public good

**Implementation Considerations:**

1. **Matching Pool**: DAO treasury would provide a matching pool
2. **Contribution Rounds**: Regular funding rounds (quarterly?)
3. **Sybil Resistance**: Need mechanisms to prevent gaming
4. **Project Eligibility**: Clear criteria for which projects can participate

**Open Questions:**

- What should be the minimum/maximum individual contribution?
- How do we verify contributor identity without compromising privacy?
- Should there be geographic quotas to ensure equitable distribution?

I've included a draft implementation proposal in the attached document. Looking forward to your thoughts.`,
    author: discussionAuthors[3],
    createdAt: '2025-01-25T15:00:00Z',
    updatedAt: '2025-01-30T10:00:00Z',
    upvotes: 72,
    replyCount: 23,
    views: 456,
    isPinned: true,
    tags: ['Governance', 'Quadratic Funding', 'DAO', 'Proposal'],
    linkedInitiatives: [
      { id: 'dao3', type: 'dao', title: 'NexTerra Governance DAO', status: 'Active' },
      { id: 'prop4', type: 'proposal', title: 'QF Implementation Proposal', status: 'Discussion' }
    ],
    attachments: [
      { id: 'att7', type: 'document', name: 'QF_Implementation_Draft.pdf', url: '#', size: '1.8 MB', mimeType: 'application/pdf' }
    ],
    replies: [
      {
        id: 'reply7',
        threadId: 'thread4',
        author: discussionAuthors[0],
        content: 'This is a fascinating approach. As a researcher, I appreciate mechanisms that value broad community validation. However, how do we ensure that technically complex but important research doesn\'t get overlooked in favor of more "popular" projects?',
        createdAt: '2025-01-25T17:30:00Z',
        upvotes: 28,
        isEdited: false,
      },
      {
        id: 'reply8',
        threadId: 'thread4',
        author: discussionAuthors[4],
        content: 'For sybil resistance, we could use a combination of wallet age, on-chain activity history, and optional KYC for larger contributions. This balances accessibility with security.',
        createdAt: '2025-01-26T09:45:00Z',
        upvotes: 19,
        isEdited: true,
      },
    ],
  },
  {
    id: 'thread5',
    categoryId: 'environmental',
    title: 'Air Quality Monitoring Networks in African Megacities',
    knowledgeType: 'field_reported',
    aiAnalysis: {
      summary: 'Initiative building low-cost air quality monitoring in Lagos, Nairobi, and Cairo. Preliminary Lagos data shows PM2.5 levels 5-10x WHO guidelines with clear correlation to respiratory hospital admissions.',
      keyInsights: [
        'Most African cities lack comprehensive air quality monitoring',
        'PM2.5 levels regularly exceed WHO guidelines by 5-10x',
        'Significant variation across neighborhoods indicates localized pollution sources',
      ],
      detectedPatterns: [
        {
          type: 'regional',
          description: 'Urban air quality concerns emerging as priority across multiple countries',
          confidence: 0.81,
        },
      ],
      signalStrength: 'medium',
      governanceRelevance: 75,
      lastAnalyzedAt: '2025-01-27T08:00:00Z',
    },
    credibilityImpact: 5,
    content: `Urban air pollution is one of the most pressing but underdiscussed environmental health challenges in Africa. With rapid urbanization, this issue will only grow more critical.

**Current Situation:**

- Most African cities lack comprehensive air quality monitoring
- Health impacts are significant but poorly documented
- Policy responses are limited by data gaps

**Our Initiative:**

We're building low-cost air quality monitoring networks in Lagos, Nairobi, and Cairo:

- Deploying 100+ sensors per city
- Real-time data available to public and researchers
- Community engagement for sensor maintenance
- Integration with health outcome tracking

**Preliminary Findings (Lagos pilot):**

- PM2.5 levels regularly exceed WHO guidelines by 5-10x
- Significant variation across neighborhoods
- Clear correlation with respiratory hospital admissions

**Call for Collaboration:**

Looking for partners in other cities and researchers interested in using our data. All data will be open-source.`,
    author: discussionAuthors[4],
    createdAt: '2025-01-24T11:00:00Z',
    updatedAt: '2025-01-27T08:30:00Z',
    upvotes: 41,
    replyCount: 9,
    views: 198,
    isPinned: false,
    tags: ['Air Quality', 'Urban Health', 'Open Data', 'Collaboration'],
    geographicTags: { country: 'Nigeria', region: 'West Africa' },
    issueArea: 'Air Quality',
    linkedInitiatives: [
      { id: 'ask2', type: 'ask', title: 'Air Sensor Deployment Fund', status: 'Active' }
    ],
    attachments: [
      { id: 'att8', type: 'photo', name: 'Sensor_Deployment_Lagos.jpg', url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', size: '1.5 MB', mimeType: 'image/jpeg' },
      { id: 'att9', type: 'document', name: 'PM25_Data_Analysis.xlsx', url: '#', size: '4.2 MB', mimeType: 'application/vnd.ms-excel' }
    ],
    replies: [
      {
        id: 'reply9',
        threadId: 'thread5',
        author: discussionAuthors[1],
        content: 'This is crucial work. The tech specs for your sensors would be really helpful for replication. Are you using custom hardware or adapting commercial sensors?',
        createdAt: '2025-01-24T14:15:00Z',
        upvotes: 12,
        isEdited: false,
      },
    ],
  },
  {
    id: 'thread6',
    categoryId: 'climate',
    title: 'Mangrove Restoration: Carbon Credits and Coastal Protection',
    knowledgeType: 'peer_reviewed',
    aiAnalysis: {
      summary: 'Community-led mangrove restoration in Niger Delta showing strong results: 500 hectares restored, 12 communities participating, 40% reduction in coastal erosion. First carbon credit verification in progress.',
      keyInsights: [
        'Africa lost 25% of mangroves in 30 years - urgent restoration needed',
        'Community-led approaches create sustainable livelihoods while restoring ecosystems',
        'Carbon credits can fund long-term conservation',
      ],
      detectedPatterns: [
        {
          type: 'topic',
          description: 'Blue carbon initiatives gaining momentum across coastal regions',
          confidence: 0.89,
          relatedThreadIds: ['thread1'],
        },
      ],
      signalStrength: 'high',
      governanceRelevance: 90,
      lastAnalyzedAt: '2025-01-26T10:00:00Z',
    },
    endorsements: [
      {
        id: 'end4',
        endorserId: 'auth2',
        endorserName: 'Samuel Mensah',
        endorserAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
        endorserCredibility: 87,
        endorserRole: 'Builder',
        endorsedAt: '2025-01-25T11:00:00Z',
        endorsementType: 'accuracy',
        comment: 'Verified data through field visit.',
      },
    ],
    credibilityImpact: 9,
    isHighSignal: true,
    dataSovereignty: {
      owner: 'Niger Delta Communities Collective',
      consentGiven: true,
      restrictions: ['No commercial use without community approval'],
    },
    content: `Mangroves are incredible ecosystems that provide both climate mitigation (carbon sequestration) and adaptation (coastal protection) benefits. Yet Africa has lost 25% of its mangroves in the last 30 years.

**Our Project:**

A community-led mangrove restoration initiative in the Niger Delta that:

1. Restores degraded mangrove areas
2. Creates sustainable livelihoods for local communities
3. Generates verified carbon credits
4. Protects coastlines from erosion and storm surge

**Results So Far (Year 2):**

- 500 hectares under restoration
- 12 communities actively participating
- First carbon credit verification in progress
- 40% reduction in coastal erosion in protected areas

**Challenges:**

- Balancing carbon credit revenue with community benefit
- Long-term monitoring and maintenance funding
- Navigating complex land tenure issues

Would love to connect with others working on blue carbon or community-based conservation.`,
    author: discussionAuthors[0],
    createdAt: '2025-01-23T13:30:00Z',
    updatedAt: '2025-01-26T11:00:00Z',
    upvotes: 53,
    replyCount: 11,
    views: 267,
    isPinned: false,
    tags: ['Mangroves', 'Carbon Credits', 'Community Conservation', 'Niger Delta'],
    geographicTags: { country: 'Nigeria', region: 'West Africa' },
    issueArea: 'Environmental Conservation',
    linkedInitiatives: [
      { id: 'prop5', type: 'proposal', title: 'Niger Delta Blue Carbon Initiative', status: 'Funded' },
      { id: 'dao4', type: 'dao', title: 'Blue Carbon DAO', status: 'Active' }
    ],
    attachments: [
      { id: 'att10', type: 'photo', name: 'Mangrove_Restoration_Before.jpg', url: 'https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=800', size: '2.1 MB', mimeType: 'image/jpeg' },
      { id: 'att11', type: 'photo', name: 'Mangrove_Restoration_After.jpg', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800', size: '1.9 MB', mimeType: 'image/jpeg' },
      { id: 'att12', type: 'video', name: 'Community_Testimonials.mp4', url: '#', size: '78.5 MB', mimeType: 'video/mp4' }
    ],
    replies: [],
  },
];

export const getThreadsByCategory = (categoryId: string): DiscussionThread[] => {
  return discussionThreads.filter(thread => thread.categoryId === categoryId);
};

export const getThreadById = (threadId: string): DiscussionThread | undefined => {
  return discussionThreads.find(thread => thread.id === threadId);
};

export const getCategoryById = (categoryId: string): ForumCategory | undefined => {
  return forumCategories.find(category => category.id === categoryId);
};
