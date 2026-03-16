export interface FieldKnowledgeAuthor {
  id: string;
  name: string;
  avatar: string;
  role: string;
  credibilityScore: number;
}

export interface FieldAttachment {
  id: string;
  type: 'photo' | 'video' | 'audio' | 'document';
  name: string;
  url: string;
  size: string;
  mimeType: string;
  thumbnail?: string;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  placeName: string;
  country: string;
  region: string;
}

export interface LinkedInitiative {
  id: string;
  type: 'proposal' | 'ask' | 'dao';
  title: string;
  status: string;
}

export type FieldPostCategory = 
  | 'field_observation'
  | 'community_data'
  | 'implementation_lesson'
  | 'early_warning';

export interface FieldKnowledgePost {
  id: string;
  title: string;
  content: string;
  category: FieldPostCategory;
  author: FieldKnowledgeAuthor;
  createdAt: string;
  updatedAt: string;
  attachments: FieldAttachment[];
  geoLocation?: GeoLocation;
  tags: string[];
  issueArea: string;
  linkedInitiatives?: LinkedInitiative[];
  upvotes: number;
  commentCount: number;
  views: number;
  isVerified: boolean;
  urgencyLevel?: 'low' | 'medium' | 'high' | 'critical';
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
  endorsementType: 'quality' | 'accuracy' | 'insight' | 'methodology' | 'verification';
  comment?: string;
}

export interface AIAnalysis {
  summary: string;
  keyInsights: string[];
  detectedPatterns?: {
    type: 'regional' | 'temporal' | 'topic' | 'cross-domain' | 'outbreak' | 'climate';
    description: string;
    confidence: number;
    relatedPostIds?: string[];
    alertLevel?: 'info' | 'warning' | 'critical';
  }[];
  signalStrength: 'high' | 'medium' | 'low';
  governanceRelevance: number;
  suggestedActions?: string[];
  lastAnalyzedAt: string;
}

export type KnowledgeType = 'peer_reviewed' | 'field_reported' | 'community_sourced' | 'expert_observation';

export interface FieldComment {
  id: string;
  postId: string;
  author: FieldKnowledgeAuthor;
  content: string;
  createdAt: string;
  upvotes: number;
  endorsements?: PeerEndorsement[];
}

export const fieldKnowledgeAuthors: FieldKnowledgeAuthor[] = [
  {
    id: 'fauth1',
    name: 'Dr. Amina Okonkwo',
    avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&h=150&fit=crop',
    role: 'Researcher',
    credibilityScore: 94,
  },
  {
    id: 'fauth2',
    name: 'Emmanuel Banda',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    role: 'Field Worker',
    credibilityScore: 88,
  },
  {
    id: 'fauth3',
    name: 'Fatou Diallo',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    role: 'Community Health Worker',
    credibilityScore: 91,
  },
  {
    id: 'fauth4',
    name: 'Joseph Kamau',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
    role: 'Environmental Monitor',
    credibilityScore: 86,
  },
  {
    id: 'fauth5',
    name: 'Aisha Mohammed',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    role: 'Agricultural Extension Officer',
    credibilityScore: 89,
  },
];

export const fieldCategories: { id: FieldPostCategory; label: string; icon: string; color: string; description: string }[] = [
  {
    id: 'field_observation',
    label: 'Ground Reports',
    icon: 'Eye',
    color: '#4CAF50',
    description: 'Photos, videos & updates from practitioners',
  },
  {
    id: 'community_data',
    label: 'Community Updates',
    icon: 'Users',
    color: '#2196F3',
    description: 'Updates from local communities',
  },
  {
    id: 'implementation_lesson',
    label: 'Impact Stories',
    icon: 'Lightbulb',
    color: '#FF9800',
    description: 'Real-world impact & lessons learned',
  },
  {
    id: 'early_warning',
    label: 'Urgent Alerts',
    icon: 'AlertTriangle',
    color: '#F44336',
    description: 'Critical updates requiring attention',
  },
];

export const fieldKnowledgePosts: FieldKnowledgePost[] = [
  {
    id: 'field1',
    title: 'Unusual Fish Die-off in Lake Victoria - Potential Water Quality Issue',
    knowledgeType: 'field_reported',
    aiAnalysis: {
      summary: 'Urgent field report: 2,000+ dead tilapia across 3km shoreline near Kisumu with signs of water quality issues. Samples collected for analysis. Potential health risk to communities using lake water.',
      keyInsights: [
        'Mass mortality event affecting multiple fish species',
        'Water appears darker with algal bloom indicators',
        'Similar smaller event reported 6 months ago - pattern emerging',
      ],
      detectedPatterns: [
        {
          type: 'temporal',
          description: 'Recurring water quality events in Lake Victoria region',
          confidence: 0.82,
          alertLevel: 'warning',
        },
        {
          type: 'cross-domain',
          description: 'Environmental-health nexus: water contamination affecting food security',
          confidence: 0.91,
          alertLevel: 'critical',
        },
      ],
      signalStrength: 'high',
      governanceRelevance: 95,
      suggestedActions: [
        'Expedite water quality testing',
        'Issue community health advisory',
        'Investigate upstream industrial activity',
      ],
      lastAnalyzedAt: '2025-01-28T14:30:00Z',
    },
    endorsements: [
      {
        id: 'fend1',
        endorserId: 'fauth1',
        endorserName: 'Dr. Amina Okonkwo',
        endorserAvatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&h=150&fit=crop',
        endorserCredibility: 94,
        endorserRole: 'Researcher',
        endorsedAt: '2025-01-28T15:00:00Z',
        endorsementType: 'verification',
        comment: 'Contacted local contacts - situation confirmed. Escalating to regional health authorities.',
      },
    ],
    credibilityImpact: 12,
    isHighSignal: true,
    content: `**Observation Date:** January 28, 2025

This morning, local fishermen reported large numbers of dead tilapia washing up on the shores near Kisumu. I visited three landing sites and documented the following:

**Key Observations:**
- Estimated 2,000+ dead fish across 3km of shoreline
- Fish appear to have died recently (within 24-48 hours)
- No visible signs of disease or parasites on external examination
- Water appears darker than usual with slight algal bloom
- Strong sulfurous smell near affected areas

**Community Reports:**
- Fishermen noticed fish behaving erratically 2 days ago
- Similar but smaller event occurred 6 months ago
- Locals report increased industrial activity upstream

**Samples Collected:**
- Water samples from 3 locations
- 5 fish specimens preserved for analysis
- Sediment samples from affected areas

**Immediate Concerns:**
- Potential health risk to communities using lake water
- Economic impact on fishing communities
- Need for rapid water quality testing

Requesting urgent collaboration from environmental health researchers and water quality experts.`,
    category: 'early_warning',
    author: fieldKnowledgeAuthors[3],
    createdAt: '2025-01-28T08:30:00Z',
    updatedAt: '2025-01-28T14:00:00Z',
    attachments: [
      {
        id: 'fatt1',
        type: 'photo',
        name: 'Fish_Dieoff_Shore.jpg',
        url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
        size: '2.1 MB',
        mimeType: 'image/jpeg',
      },
      {
        id: 'fatt2',
        type: 'photo',
        name: 'Water_Sample_Collection.jpg',
        url: 'https://images.unsplash.com/photo-1581093458791-9d42e3c7e117?w=800',
        size: '1.8 MB',
        mimeType: 'image/jpeg',
      },
      {
        id: 'fatt3',
        type: 'video',
        name: 'Shoreline_Survey.mp4',
        url: '#',
        size: '45.2 MB',
        mimeType: 'video/mp4',
      },
    ],
    geoLocation: {
      latitude: -0.1021,
      longitude: 34.7519,
      placeName: 'Kisumu Bay',
      country: 'Kenya',
      region: 'East Africa',
    },
    tags: ['Water Quality', 'Environmental Emergency', 'Lake Victoria', 'Fish Die-off'],
    issueArea: 'Environmental Health',
    linkedInitiatives: [
      { id: 'dao5', type: 'dao', title: 'East Africa Environmental Watch DAO', status: 'Active' },
    ],
    upvotes: 89,
    commentCount: 34,
    views: 567,
    isVerified: true,
    urgencyLevel: 'critical',
  },
  {
    id: 'field2',
    title: 'Community Malaria Prevention: What Worked and What Didn\'t in Rural Zambia',
    knowledgeType: 'expert_observation',
    aiAnalysis: {
      summary: '18-month implementation report from Luapula Province. Drama groups 3x more effective than pamphlets. Mobile money incentives increased net compliance 60%. Traditional leader engagement achieved 85% net usage.',
      keyInsights: [
        'Entertainment-based education significantly outperforms traditional methods',
        'Economic incentives create behavior change and community advocacy',
        'Traditional leader endorsement critical for adoption',
      ],
      detectedPatterns: [
        {
          type: 'topic',
          description: 'Community-led health interventions consistently showing higher success rates across Africa',
          confidence: 0.94,
          relatedPostIds: ['field5'],
        },
      ],
      signalStrength: 'high',
      governanceRelevance: 88,
      suggestedActions: [
        'Share methodology with other malaria-endemic regions',
        'Develop scalable drama group training program',
      ],
      lastAnalyzedAt: '2025-01-27T16:00:00Z',
    },
    endorsements: [
      {
        id: 'fend2',
        endorserId: 'fauth4',
        endorserName: 'Joseph Kamau',
        endorserAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
        endorserCredibility: 86,
        endorserRole: 'Environmental Monitor',
        endorsedAt: '2025-01-27T10:00:00Z',
        endorsementType: 'methodology',
      },
      {
        id: 'fend3',
        endorserId: 'fauth5',
        endorserName: 'Aisha Mohammed',
        endorserAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
        endorserCredibility: 89,
        endorserRole: 'Agricultural Extension Officer',
        endorsedAt: '2025-01-27T14:00:00Z',
        endorsementType: 'quality',
        comment: 'Excellent documentation of lessons learned.',
      },
    ],
    credibilityImpact: 10,
    isHighSignal: true,
    content: `After 18 months of implementing our community-based malaria prevention program in Luapula Province, I want to share honest lessons about what worked and what didn't.

**What Worked:**

1. **Drama Groups for Education**
   - Local theater groups were 3x more effective than pamphlets
   - Community members retained information better when it was entertaining
   - Created jobs for local artists

2. **Mobile Money Incentives for Net Use**
   - Small payments for verified net usage increased compliance by 60%
   - Cost-effective compared to repeated distribution campaigns
   - Families became advocates to neighbors

3. **Traditional Leader Engagement**
   - Chiefs who endorsed the program saw 85% net usage
   - Community meetings after church/mosque were ideal timing
   - Elders became monitoring volunteers

**What Failed:**

1. **SMS Reminders**
   - Only 30% of target population had consistent phone access
   - Network coverage too unreliable
   - Literacy barriers with text messages

2. **Standard Distribution Events**
   - Nets often traded or sold
   - Men collected nets but women needed training
   - One-time events didn't create behavior change

3. **Clinic-Based Education**
   - Missed healthy population
   - Overcrowded clinics, no time for education
   - Associated prevention with being sick

**Recommendations for Future Programs:**
- Budget for entertainment-based education from the start
- Design for the 70% without reliable phone/internet
- Include economic incentives in initial design
- Train women directly, not through male heads of household`,
    category: 'implementation_lesson',
    author: fieldKnowledgeAuthors[2],
    createdAt: '2025-01-26T10:15:00Z',
    updatedAt: '2025-01-27T16:30:00Z',
    attachments: [
      {
        id: 'fatt4',
        type: 'photo',
        name: 'Drama_Group_Performance.jpg',
        url: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800',
        size: '1.5 MB',
        mimeType: 'image/jpeg',
      },
      {
        id: 'fatt5',
        type: 'document',
        name: 'Program_Evaluation_Report.pdf',
        url: '#',
        size: '3.2 MB',
        mimeType: 'application/pdf',
      },
      {
        id: 'fatt6',
        type: 'audio',
        name: 'Community_Feedback_Recording.mp3',
        url: '#',
        size: '8.4 MB',
        mimeType: 'audio/mpeg',
      },
    ],
    geoLocation: {
      latitude: -11.7833,
      longitude: 29.0000,
      placeName: 'Mansa District',
      country: 'Zambia',
      region: 'Southern Africa',
    },
    tags: ['Malaria Prevention', 'Community Health', 'Implementation', 'Lessons Learned'],
    issueArea: 'Disease Prevention',
    linkedInitiatives: [
      { id: 'prop6', type: 'proposal', title: 'Zambia Malaria Prevention Scale-up', status: 'Funded' },
      { id: 'ask3', type: 'ask', title: 'Drama Group Training Materials', status: 'Completed' },
    ],
    upvotes: 156,
    commentCount: 42,
    views: 823,
    isVerified: true,
  },
  {
    id: 'field3',
    title: 'Groundwater Levels Dropping Alarmingly in Northern Nigeria - Farmer Survey Data',
    knowledgeType: 'community_sourced',
    aiAnalysis: {
      summary: '3-month survey of 127 farmers across 45 villages shows alarming groundwater decline: well depths increased 50-75% in 5 years. 78% report water access "much harder", 23% considering migration.',
      keyInsights: [
        'Well depths increased 50-75% across surveyed regions in 5 years',
        'Multiple contributing factors: reduced rainfall, commercial farming, population growth',
        'Early adoption of drip irrigation showing promise',
      ],
      detectedPatterns: [
        {
          type: 'climate',
          description: 'Accelerating water scarcity across Sahel region',
          confidence: 0.96,
          alertLevel: 'critical',
        },
        {
          type: 'regional',
          description: 'Similar water stress reports from Chad, Niger, and Mali',
          confidence: 0.88,
        },
      ],
      signalStrength: 'high',
      governanceRelevance: 98,
      suggestedActions: [
        'Commission comprehensive hydrogeological assessment',
        'Establish water extraction guidelines',
        'Fund water-efficient farming programs',
      ],
      lastAnalyzedAt: '2025-01-25T09:00:00Z',
    },
    credibilityImpact: 15,
    isHighSignal: true,
    dataSovereignty: {
      owner: 'Kano Farmers Cooperative',
      consentGiven: true,
      restrictions: ['Attribution required', 'Non-commercial research only'],
    },
    content: `Over the past 3 months, I've been surveying farming communities in Kano and Katsina states about their water access. The data reveals a concerning trend.

**Survey Summary:**
- 127 farmers interviewed
- 45 villages covered
- 3 local government areas

**Key Findings:**

**Well Depth Changes (5-year comparison):**
| Area | 2020 Avg Depth | 2025 Avg Depth | Change |
|------|----------------|----------------|--------|
| Kano Rural | 12m | 18m | +50% |
| Katsina East | 8m | 14m | +75% |
| Katsina West | 15m | 24m | +60% |

**Farmer Reports:**
- 78% say water access is "much harder" than 5 years ago
- 45% have abandoned at least one well
- 23% are considering migration
- Dry season now 6 weeks longer on average

**Contributing Factors Identified:**
1. Reduced rainfall (confirmed by meteorological data)
2. Increased commercial farming water extraction
3. Population growth
4. Deforestation reducing groundwater recharge

**Adaptation Strategies Already in Use:**
- Farmers digging deeper wells (expensive, temporary)
- Shifting to drought-resistant crops
- Water sharing cooperatives forming
- Some early adopters using drip irrigation

**Urgent Needs:**
- Hydrogeological assessment
- Sustainable extraction guidelines
- Investment in water-efficient farming
- Early warning system for water scarcity

This data should inform DAO funding priorities for the region.`,
    category: 'community_data',
    author: fieldKnowledgeAuthors[4],
    createdAt: '2025-01-24T14:00:00Z',
    updatedAt: '2025-01-25T09:30:00Z',
    attachments: [
      {
        id: 'fatt7',
        type: 'document',
        name: 'Groundwater_Survey_Data.xlsx',
        url: '#',
        size: '1.2 MB',
        mimeType: 'application/vnd.ms-excel',
      },
      {
        id: 'fatt8',
        type: 'photo',
        name: 'Dried_Well_Katsina.jpg',
        url: 'https://images.unsplash.com/photo-1504297050568-910d24c426d3?w=800',
        size: '2.3 MB',
        mimeType: 'image/jpeg',
      },
      {
        id: 'fatt9',
        type: 'photo',
        name: 'Farmer_Interview.jpg',
        url: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800',
        size: '1.9 MB',
        mimeType: 'image/jpeg',
      },
      {
        id: 'fatt10',
        type: 'video',
        name: 'Farmer_Testimonials.mp4',
        url: '#',
        size: '67.8 MB',
        mimeType: 'video/mp4',
      },
    ],
    geoLocation: {
      latitude: 12.0022,
      longitude: 8.5919,
      placeName: 'Kano State',
      country: 'Nigeria',
      region: 'West Africa',
    },
    tags: ['Water Security', 'Agriculture', 'Climate Impact', 'Community Survey'],
    issueArea: 'Water Security',
    linkedInitiatives: [
      { id: 'prop7', type: 'proposal', title: 'Northern Nigeria Water Security Assessment', status: 'Under Review' },
      { id: 'dao6', type: 'dao', title: 'Sahel Water Initiative DAO', status: 'Active' },
    ],
    upvotes: 203,
    commentCount: 67,
    views: 1245,
    isVerified: true,
    urgencyLevel: 'high',
  },
  {
    id: 'field4',
    title: 'First Cases of Unusual Respiratory Illness in Cattle - Potential Zoonotic Risk',
    knowledgeType: 'field_reported',
    aiAnalysis: {
      summary: 'URGENT: 23 cattle with unusual respiratory symptoms across 4 herds in Moshi, Tanzania. 3 deaths. 2 herders showing similar symptoms. Samples sent for analysis. High zoonotic spillover risk.',
      keyInsights: [
        'Novel clinical presentation not matching known cattle diseases',
        'Potential human transmission indicated - 2 herders symptomatic',
        'Rapid spread across multiple herds suggests high transmissibility',
      ],
      detectedPatterns: [
        {
          type: 'outbreak',
          description: 'Potential emerging zoonotic disease event',
          confidence: 0.89,
          alertLevel: 'critical',
        },
        {
          type: 'cross-domain',
          description: 'One Health alert: animal-human disease interface',
          confidence: 0.95,
          alertLevel: 'critical',
        },
      ],
      signalStrength: 'high',
      governanceRelevance: 100,
      suggestedActions: [
        'Immediate escalation to national veterinary authorities',
        'Deploy rapid diagnostic team',
        'Establish quarantine zone',
        'Activate One Health emergency protocol',
      ],
      lastAnalyzedAt: '2025-01-23T08:00:00Z',
    },
    endorsements: [
      {
        id: 'fend4',
        endorserId: 'fauth1',
        endorserName: 'Dr. Amina Okonkwo',
        endorserAvatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&h=150&fit=crop',
        endorserCredibility: 94,
        endorserRole: 'Researcher',
        endorsedAt: '2025-01-23T09:30:00Z',
        endorsementType: 'verification',
        comment: 'Critically important report. Mobilizing One Health networks.',
      },
    ],
    credibilityImpact: 20,
    isHighSignal: true,
    content: `**URGENT FIELD REPORT**

**Date:** January 22, 2025
**Location:** Moshi Rural District, Kilimanjaro Region, Tanzania

**Situation Summary:**
Local pastoralists have reported unusual respiratory symptoms in their cattle over the past 2 weeks. I was called to investigate after a veterinary officer noted the symptoms were unfamiliar.

**Affected Animals:**
- 23 cattle confirmed symptomatic
- 4 herds affected across 3 villages
- 3 animal deaths so far
- Mixed ages and breeds affected

**Clinical Signs Observed:**
- Severe coughing and labored breathing
- Nasal discharge (thick, yellowish)
- High fever (40-41°C)
- Rapid weight loss
- Reduced milk production

**Human Health Concerns:**
- 2 herders reporting similar respiratory symptoms
- Both had direct contact with sick animals
- Referred to district hospital for evaluation
- No confirmed human cases yet

**Samples Collected:**
- Nasal swabs from 8 animals
- Blood samples from 5 animals
- Post-mortem samples from 1 deceased animal
- Samples sent to Sokoine University for analysis

**Precautionary Measures Implemented:**
- Advised affected herders to limit contact
- Basic PPE distributed (masks, gloves)
- Quarantine of symptomatic animals
- Daily monitoring established

**Request for Support:**
- Rapid diagnostic testing capability
- Veterinary epidemiologist consultation
- Additional PPE for community
- Communication materials in Swahili

Will provide updates as laboratory results become available. Please escalate to One Health networks.`,
    category: 'early_warning',
    author: fieldKnowledgeAuthors[1],
    createdAt: '2025-01-22T16:45:00Z',
    updatedAt: '2025-01-23T08:00:00Z',
    attachments: [
      {
        id: 'fatt11',
        type: 'photo',
        name: 'Affected_Cattle.jpg',
        url: 'https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?w=800',
        size: '2.4 MB',
        mimeType: 'image/jpeg',
      },
      {
        id: 'fatt12',
        type: 'video',
        name: 'Clinical_Signs_Documentation.mp4',
        url: '#',
        size: '34.6 MB',
        mimeType: 'video/mp4',
      },
      {
        id: 'fatt13',
        type: 'audio',
        name: 'Herder_Interview_Swahili.mp3',
        url: '#',
        size: '5.2 MB',
        mimeType: 'audio/mpeg',
      },
    ],
    geoLocation: {
      latitude: -3.3500,
      longitude: 37.3400,
      placeName: 'Moshi Rural',
      country: 'Tanzania',
      region: 'East Africa',
    },
    tags: ['Zoonotic Disease', 'Animal Health', 'One Health', 'Early Warning'],
    issueArea: 'Disease Prevention',
    linkedInitiatives: [
      { id: 'dao7', type: 'dao', title: 'One Health Surveillance DAO', status: 'Active' },
    ],
    upvotes: 312,
    commentCount: 89,
    views: 2134,
    isVerified: true,
    urgencyLevel: 'critical',
  },
  {
    id: 'field5',
    title: 'Solar-Powered Cold Chain Success: Vaccine Storage in Off-Grid Clinics',
    knowledgeType: 'expert_observation',
    aiAnalysis: {
      summary: 'Successful 12-month pilot: 15 off-grid clinics in Ghana equipped with solar vaccine refrigerators. Vaccine wastage dropped from 35-40% to <5%. Childhood vaccination rates increased from 54% to 87%.',
      keyInsights: [
        'Solar cold chain dramatically reduces vaccine wastage',
        'Local technician training ensures sustainable maintenance',
        'Community ownership model creates pride and protection',
      ],
      detectedPatterns: [
        {
          type: 'topic',
          description: 'Solar health infrastructure showing consistent success across implementations',
          confidence: 0.93,
          relatedPostIds: ['field2'],
        },
      ],
      signalStrength: 'high',
      governanceRelevance: 85,
      suggestedActions: [
        'Prioritize funding for scale-up proposal',
        'Document for replication toolkit',
      ],
      lastAnalyzedAt: '2025-01-21T14:00:00Z',
    },
    endorsements: [
      {
        id: 'fend5',
        endorserId: 'fauth2',
        endorserName: 'Emmanuel Banda',
        endorserAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
        endorserCredibility: 88,
        endorserRole: 'Field Worker',
        endorsedAt: '2025-01-21T10:00:00Z',
        endorsementType: 'accuracy',
        comment: 'Visited 3 sites - results confirmed.',
      },
    ],
    credibilityImpact: 12,
    isHighSignal: true,
    content: `I want to share a success story from our pilot program installing solar-powered vaccine refrigerators in off-grid health clinics across rural Ghana.

**Program Overview:**
- 15 clinics equipped over 12 months
- Volta and Northern regions
- Partnership with local technical schools

**Results After 1 Year:**

**Before Solar Cold Chain:**
- Vaccine wastage: 35-40%
- Monthly stockouts: 8-12 days average
- Communities traveling 15-30km for vaccination
- Childhood vaccination rate: 54%

**After Solar Cold Chain:**
- Vaccine wastage: <5%
- Monthly stockouts: <1 day average
- Vaccination available at local clinic
- Childhood vaccination rate: 87%

**Key Success Factors:**

1. **Local Technician Training**
   - Trained 2 technicians per clinic
   - Created jobs and ensured maintenance
   - Reduced downtime to <24 hours

2. **Community Ownership**
   - Clinic committees manage the systems
   - Small user fees fund maintenance
   - Pride in "our" technology

3. **Appropriate Technology**
   - Used robust, repairable equipment
   - Spare parts available locally
   - No internet dependence

**Challenges Overcome:**
- Initial skepticism from clinic staff
- Battery theft (solved with secure housing)
- Dust affecting solar panels (community cleaning schedule)

**Cost Analysis:**
- Installation: $3,200 per clinic
- Annual maintenance: $180 per clinic
- Payback period: 14 months (vs vaccine wastage costs)

**Recommendation:**
This model is ready for scale-up across similar contexts. Happy to share detailed technical specifications and training materials.`,
    category: 'implementation_lesson',
    author: fieldKnowledgeAuthors[2],
    createdAt: '2025-01-20T11:30:00Z',
    updatedAt: '2025-01-21T15:00:00Z',
    attachments: [
      {
        id: 'fatt14',
        type: 'photo',
        name: 'Solar_Installation_Complete.jpg',
        url: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800',
        size: '1.7 MB',
        mimeType: 'image/jpeg',
      },
      {
        id: 'fatt15',
        type: 'photo',
        name: 'Technician_Training.jpg',
        url: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800',
        size: '2.1 MB',
        mimeType: 'image/jpeg',
      },
      {
        id: 'fatt16',
        type: 'document',
        name: 'Technical_Specifications.pdf',
        url: '#',
        size: '4.5 MB',
        mimeType: 'application/pdf',
      },
      {
        id: 'fatt17',
        type: 'document',
        name: 'Training_Manual_English.pdf',
        url: '#',
        size: '8.2 MB',
        mimeType: 'application/pdf',
      },
    ],
    geoLocation: {
      latitude: 7.9465,
      longitude: 1.0232,
      placeName: 'Volta Region',
      country: 'Ghana',
      region: 'West Africa',
    },
    tags: ['Solar Energy', 'Vaccine Cold Chain', 'Healthcare Infrastructure', 'Success Story'],
    issueArea: 'Healthcare Access',
    linkedInitiatives: [
      { id: 'prop8', type: 'proposal', title: 'Ghana Solar Cold Chain Expansion', status: 'Approved' },
      { id: 'dao8', type: 'dao', title: 'Health Infrastructure DAO', status: 'Active' },
    ],
    upvotes: 278,
    commentCount: 56,
    views: 1567,
    isVerified: true,
  },
  {
    id: 'field6',
    title: 'Documenting Indigenous Flood Prediction Methods in the Niger Delta',
    knowledgeType: 'community_sourced',
    aiAnalysis: {
      summary: 'Research documenting traditional ecological knowledge for flood prediction. 78% correlation with actual events, 4.2 days average lead time. Indigenous indicators include animal behavior, plant signs, and environmental cues.',
      keyInsights: [
        'Traditional knowledge achieves 78% flood prediction accuracy',
        'Average 4.2 day lead time - valuable for early warning',
        'Knowledge at risk of being lost as younger generations urbanize',
      ],
      detectedPatterns: [
        {
          type: 'topic',
          description: 'Indigenous knowledge proving valuable for climate adaptation across regions',
          confidence: 0.87,
        },
      ],
      signalStrength: 'medium',
      governanceRelevance: 75,
      lastAnalyzedAt: '2025-01-19T14:00:00Z',
    },
    credibilityImpact: 8,
    dataSovereignty: {
      owner: 'Niger Delta Indigenous Knowledge Council',
      consentGiven: true,
      restrictions: ['Cultural attribution required', 'No patenting of traditional knowledge'],
    },
    content: `As part of our climate adaptation research, I've been documenting traditional ecological knowledge (TEK) used by communities in the Niger Delta to predict and prepare for floods.

**Research Approach:**
- Interviews with 34 elders (ages 55-85)
- Focus groups in 8 communities
- 6-month observation period

**Traditional Indicators Identified:**

**Animal Behavior:**
- Ants moving to higher ground (3-5 days before flood)
- Fish swimming near surface in unusual patterns
- Certain bird species departing the area
- Snakes appearing in villages

**Plant Signs:**
- Water hyacinth flowering patterns
- Mangrove leaf color changes
- Specific grass species flowering early

**Environmental Cues:**
- River water color changes
- Specific wind patterns
- Cloud formations over the delta
- Moon phase relationships

**Accuracy Assessment:**
We tracked predictions from 12 community observers against actual flood events:
- 78% correlation with traditional indicators
- Average lead time: 4.2 days
- False positive rate: 15%

**Integration Potential:**
These indicators could complement technological early warning systems:
- Cost-free, community-based monitoring
- Works in areas without internet/electricity
- Trusted by local communities
- Captures localized variations

**Challenges:**
- Knowledge not being passed to younger generations
- Climate change affecting some indicators' reliability
- Need for systematic documentation before it's lost

**Recommendation:**
Integrate TEK into formal early warning systems while acknowledging limitations. Train young community members to preserve this knowledge.`,
    category: 'field_observation',
    author: fieldKnowledgeAuthors[0],
    createdAt: '2025-01-18T09:00:00Z',
    updatedAt: '2025-01-19T14:30:00Z',
    attachments: [
      {
        id: 'fatt18',
        type: 'photo',
        name: 'Elder_Interview.jpg',
        url: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800',
        size: '1.9 MB',
        mimeType: 'image/jpeg',
      },
      {
        id: 'fatt19',
        type: 'video',
        name: 'Community_Focus_Group.mp4',
        url: '#',
        size: '89.3 MB',
        mimeType: 'video/mp4',
      },
      {
        id: 'fatt20',
        type: 'audio',
        name: 'Elder_Oral_History.mp3',
        url: '#',
        size: '23.4 MB',
        mimeType: 'audio/mpeg',
      },
      {
        id: 'fatt21',
        type: 'document',
        name: 'TEK_Flood_Prediction_Study.pdf',
        url: '#',
        size: '5.7 MB',
        mimeType: 'application/pdf',
      },
    ],
    geoLocation: {
      latitude: 4.8156,
      longitude: 7.0498,
      placeName: 'Bayelsa State',
      country: 'Nigeria',
      region: 'West Africa',
    },
    tags: ['Traditional Knowledge', 'Flood Prediction', 'Climate Adaptation', 'Indigenous Science'],
    issueArea: 'Climate Adaptation',
    linkedInitiatives: [
      { id: 'prop9', type: 'proposal', title: 'Niger Delta Early Warning Integration', status: 'Under Review' },
    ],
    upvotes: 189,
    commentCount: 43,
    views: 987,
    isVerified: true,
  },
  {
    id: 'field7',
    title: 'Cholera Outbreak Indicators Emerging in Refugee Settlement - Immediate Attention Required',
    knowledgeType: 'field_reported',
    aiAnalysis: {
      summary: 'URGENT: 35 acute watery diarrhea cases in Kakuma Refugee Camp over 72 hours. 2 deaths under investigation. Water supply issues and latrine flooding identified. Immediate medical supplies needed.',
      keyInsights: [
        'Classic cholera outbreak indicators present',
        'Infrastructure failure (water, sanitation) as root cause',
        'Vulnerable population at high risk',
      ],
      detectedPatterns: [
        {
          type: 'outbreak',
          description: 'Potential cholera outbreak in refugee setting',
          confidence: 0.94,
          alertLevel: 'critical',
        },
        {
          type: 'temporal',
          description: 'Post-rain disease outbreaks following predictable pattern',
          confidence: 0.88,
          alertLevel: 'warning',
        },
      ],
      signalStrength: 'high',
      governanceRelevance: 100,
      suggestedActions: [
        'Deploy emergency medical supplies within 24 hours',
        'Activate emergency water trucking',
        'Conduct rapid case management training',
      ],
      lastAnalyzedAt: '2025-01-29T18:30:00Z',
    },
    endorsements: [
      {
        id: 'fend6',
        endorserId: 'fauth1',
        endorserName: 'Dr. Amina Okonkwo',
        endorserAvatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&h=150&fit=crop',
        endorserCredibility: 94,
        endorserRole: 'Researcher',
        endorsedAt: '2025-01-29T19:00:00Z',
        endorsementType: 'verification',
        comment: 'Situation verified via UNHCR contacts. Emergency response mobilizing.',
      },
    ],
    credibilityImpact: 18,
    isHighSignal: true,
    content: `**URGENT EARLY WARNING**

**Date:** January 29, 2025
**Location:** Kakuma Refugee Camp, Turkana County, Kenya

**Situation:**
Over the past 72 hours, our community health workers have identified concerning patterns that may indicate an emerging cholera outbreak.

**Reported Cases:**
- 23 cases of acute watery diarrhea (AWD) in Block 7
- 8 cases in Block 8
- 4 cases in Block 9
- Ages: predominantly children under 5 and elderly

**Clinical Presentation:**
- Sudden onset watery diarrhea
- Vomiting
- Rapid dehydration
- 2 deaths under investigation

**Environmental Assessment:**

**Water Supply Issues:**
- Main borehole serving Blocks 7-9 has had intermittent service
- Community using alternative, untested water sources
- Recent heavy rains may have contaminated shallow wells

**Sanitation Concerns:**
- Latrine coverage below minimum standards (1:30 vs 1:20 recommended)
- Several latrines flooded after recent rains
- Garbage collection disrupted for 5 days

**Response Initiated:**
- Activated case definition surveillance
- Set up oral rehydration points
- Distributed chlorine tablets (limited supply)
- Community messaging on water treatment

**Immediate Needs:**
1. Rapid diagnostic kits for cholera confirmation
2. Additional ORS and IV fluids
3. Water trucking to affected blocks
4. Emergency latrine construction/repair
5. Case management training refresh

**Coordination:**
- UNHCR notified
- County health department alerted
- Request for MSF support submitted

**Next Update:** 12 hours or sooner if situation changes significantly.`,
    category: 'early_warning',
    author: fieldKnowledgeAuthors[2],
    createdAt: '2025-01-29T06:00:00Z',
    updatedAt: '2025-01-29T18:00:00Z',
    attachments: [
      {
        id: 'fatt22',
        type: 'photo',
        name: 'Affected_Area_Overview.jpg',
        url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800',
        size: '2.8 MB',
        mimeType: 'image/jpeg',
      },
      {
        id: 'fatt23',
        type: 'photo',
        name: 'ORS_Distribution_Point.jpg',
        url: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=800',
        size: '1.6 MB',
        mimeType: 'image/jpeg',
      },
      {
        id: 'fatt24',
        type: 'document',
        name: 'Case_Line_List.xlsx',
        url: '#',
        size: '156 KB',
        mimeType: 'application/vnd.ms-excel',
      },
    ],
    geoLocation: {
      latitude: 3.7167,
      longitude: 34.8667,
      placeName: 'Kakuma Refugee Camp',
      country: 'Kenya',
      region: 'East Africa',
    },
    tags: ['Cholera', 'Outbreak', 'Refugee Health', 'Emergency Response'],
    issueArea: 'Disease Prevention',
    linkedInitiatives: [
      { id: 'dao9', type: 'dao', title: 'Emergency Response DAO', status: 'Active' },
      { id: 'ask4', type: 'ask', title: 'Kakuma Emergency Medical Supplies', status: 'Urgent' },
    ],
    upvotes: 445,
    commentCount: 112,
    views: 3456,
    isVerified: true,
    urgencyLevel: 'critical',
  },
  {
    id: 'field8',
    title: 'Successful Community-Led Reforestation: 50,000 Trees in 2 Years',
    knowledgeType: 'expert_observation',
    aiAnalysis: {
      summary: '24-month reforestation project in Ethiopian Highlands exceeds targets: 52,340 trees planted (130% of goal), 78% survival rate. 340 hectares restored, springs flowing again, wildlife returning.',
      keyInsights: [
        'Community ownership and economic incentives drive success',
        'Indigenous species comprise 65% - better suited to local conditions',
        'Multiple co-benefits: jobs, food security, carbon sequestration',
      ],
      detectedPatterns: [
        {
          type: 'topic',
          description: 'Community-led environmental restoration showing consistent success',
          confidence: 0.91,
        },
        {
          type: 'regional',
          description: 'East African highlands as priority for restoration initiatives',
          confidence: 0.84,
        },
      ],
      signalStrength: 'high',
      governanceRelevance: 92,
      suggestedActions: [
        'Fast-track Phase 2 funding proposal',
        'Create replication toolkit for other regions',
      ],
      lastAnalyzedAt: '2025-01-17T10:00:00Z',
    },
    endorsements: [
      {
        id: 'fend7',
        endorserId: 'fauth4',
        endorserName: 'Joseph Kamau',
        endorserAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
        endorserCredibility: 86,
        endorserRole: 'Environmental Monitor',
        endorsedAt: '2025-01-16T08:00:00Z',
        endorsementType: 'accuracy',
        comment: 'Field verified - impressive results.',
      },
      {
        id: 'fend8',
        endorserId: 'fauth3',
        endorserName: 'Fatou Diallo',
        endorserAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
        endorserCredibility: 91,
        endorserRole: 'Community Health Worker',
        endorsedAt: '2025-01-16T14:00:00Z',
        endorsementType: 'quality',
      },
    ],
    credibilityImpact: 14,
    isHighSignal: true,
    content: `I'm excited to share the results of our community-led reforestation project in the Ethiopian Highlands.

**Project Summary:**
- Location: Amhara Region, Ethiopia
- Duration: 24 months (Jan 2023 - Jan 2025)
- Communities involved: 12 villages
- Total participants: 1,847 households

**Results:**

**Trees Planted:**
- Target: 40,000 trees
- Achieved: 52,340 trees
- Survival rate: 78% (exceeds 70% target)

**Species Mix:**
- Indigenous species: 65%
- Fruit trees: 25%
- Fast-growing timber: 10%

**Environmental Impact:**
- 340 hectares under restoration
- Springs that had dried began flowing again
- Wildlife sightings increased (monkeys, birds returning)
- Soil erosion visibly reduced on hillsides

**Social Impact:**
- 234 full-time equivalent jobs created
- Women's participation: 52%
- Youth engagement: 38% of planters under 30
- School environmental clubs in 8 schools

**Economic Benefits:**
- First fruit harvests beginning (mango, avocado)
- Seedling sales generating community income
- Beekeeping established in restored areas
- Reduced time collecting firewood (2 hours/week saved)

**What Made It Work:**

1. **Community Ownership**
   - Villages selected their own sites
   - Traditional leaders drove participation
   - Benefits stay in community

2. **Economic Incentives**
   - Payment for planting and maintenance
   - Fruit tree ownership guaranteed
   - Carbon credit revenue sharing planned

3. **Technical Support Without Takeover**
   - Training, not doing
   - Local species knowledge respected
   - Extension workers from the community

**Lessons for Scaling:**
- Start with quick wins (fast-growing species)
- Make economic benefits visible early
- Don't underestimate traditional knowledge
- Plan for 5+ years, not project cycles

Happy to connect anyone interested in replicating this approach.`,
    category: 'field_observation',
    author: fieldKnowledgeAuthors[4],
    createdAt: '2025-01-15T13:00:00Z',
    updatedAt: '2025-01-17T10:30:00Z',
    attachments: [
      {
        id: 'fatt25',
        type: 'photo',
        name: 'Reforestation_Before.jpg',
        url: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=800',
        size: '2.2 MB',
        mimeType: 'image/jpeg',
      },
      {
        id: 'fatt26',
        type: 'photo',
        name: 'Reforestation_After.jpg',
        url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800',
        size: '2.5 MB',
        mimeType: 'image/jpeg',
      },
      {
        id: 'fatt27',
        type: 'photo',
        name: 'Community_Planting_Day.jpg',
        url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800',
        size: '1.8 MB',
        mimeType: 'image/jpeg',
      },
      {
        id: 'fatt28',
        type: 'document',
        name: 'Full_Project_Report.pdf',
        url: '#',
        size: '12.4 MB',
        mimeType: 'application/pdf',
      },
      {
        id: 'fatt29',
        type: 'video',
        name: 'Community_Voices.mp4',
        url: '#',
        size: '156.7 MB',
        mimeType: 'video/mp4',
      },
    ],
    geoLocation: {
      latitude: 11.5936,
      longitude: 37.3908,
      placeName: 'Amhara Region',
      country: 'Ethiopia',
      region: 'East Africa',
    },
    tags: ['Reforestation', 'Community Development', 'Climate Action', 'Success Story'],
    issueArea: 'Environmental Conservation',
    linkedInitiatives: [
      { id: 'prop10', type: 'proposal', title: 'Ethiopian Highlands Restoration Phase 2', status: 'Funded' },
      { id: 'dao10', type: 'dao', title: 'African Reforestation DAO', status: 'Active' },
    ],
    upvotes: 534,
    commentCount: 98,
    views: 2890,
    isVerified: true,
  },
];

export const fieldComments: FieldComment[] = [
  {
    id: 'fc1',
    postId: 'field1',
    author: fieldKnowledgeAuthors[0],
    content: 'This is deeply concerning. Have you been able to send samples to a certified lab? I can help connect you with the Kenya Marine and Fisheries Research Institute if needed.',
    createdAt: '2025-01-28T10:30:00Z',
    upvotes: 23,
  },
  {
    id: 'fc2',
    postId: 'field1',
    author: fieldKnowledgeAuthors[2],
    content: 'Similar events were reported in the eastern shores last year. There might be a pattern related to agricultural runoff during certain seasons. Important to document the timing.',
    createdAt: '2025-01-28T12:15:00Z',
    upvotes: 18,
  },
  {
    id: 'fc3',
    postId: 'field2',
    author: fieldKnowledgeAuthors[3],
    content: 'The drama group approach is brilliant! We\'ve seen similar success with radio programs in rural Kenya. Entertainment-education is seriously undervalued in global health.',
    createdAt: '2025-01-26T14:45:00Z',
    upvotes: 34,
  },
  {
    id: 'fc4',
    postId: 'field3',
    author: fieldKnowledgeAuthors[1],
    content: 'This data is invaluable. Would you be open to sharing the raw survey data? I\'d like to integrate it with satellite groundwater monitoring we\'re doing in the region.',
    createdAt: '2025-01-25T08:30:00Z',
    upvotes: 27,
  },
  {
    id: 'fc5',
    postId: 'field4',
    author: fieldKnowledgeAuthors[0],
    content: 'Please keep us updated on the lab results. If there\'s any indication of zoonotic transmission, we need to mobilize One Health networks immediately.',
    createdAt: '2025-01-23T09:00:00Z',
    upvotes: 45,
  },
];

export const getFieldPostById = (id: string): FieldKnowledgePost | undefined => {
  return fieldKnowledgePosts.find(post => post.id === id);
};

export const getFieldPostsByCategory = (category: FieldPostCategory): FieldKnowledgePost[] => {
  return fieldKnowledgePosts.filter(post => post.category === category);
};

export const getCommentsByPostId = (postId: string): FieldComment[] => {
  return fieldComments.filter(comment => comment.postId === postId);
};
