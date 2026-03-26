export interface CommentAttachment {
  id: string;
  type: 'photo' | 'video' | 'audio' | 'document';
  url: string;
  name?: string;
  duration?: number;
}

export interface PostComment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  attachments?: CommentAttachment[];
  timestamp: string;
  likes: number;
  isLiked: boolean;
}

export interface CommunityPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userRole: 'Researcher' | 'Builder' | 'Funder' | 'Hybrid';
  userAffiliation: string;
  content: string;
  media?: {
    type: 'photo' | 'video';
    url: string;
    thumbnail?: string;
  }[];
  timestamp: string;
  likes: number;
  isLiked: boolean;
  comments: PostComment[];
  commentsCount: number;
}

export const communityFeedPosts: CommunityPost[] = [
  {
    id: 'post_001',
    userId: 'user_002',
    userName: 'Dr. Kwame Asante',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    userRole: 'Researcher',
    userAffiliation: 'University of Ghana',
    content: 'Just completed our field assessment in the Northern Region. The malaria surveillance system is showing promising results - early detection rates up by 40% compared to last year. Excited to share more findings soon! 🦟📊',
    media: [
      {
        type: 'photo',
        url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800',
      },
    ],
    timestamp: '2025-02-02T10:30:00Z',
    likes: 47,
    isLiked: false,
    comments: [
      {
        id: 'comment_001',
        userId: 'user_003',
        userName: 'Fatima El-Amin',
        userAvatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400',
        content: 'This is incredible progress! Would love to discuss potential funding opportunities for scaling this.',
        timestamp: '2025-02-02T11:15:00Z',
        likes: 12,
        isLiked: false,
      },
      {
        id: 'comment_002',
        userId: 'user_004',
        userName: 'Tendai Moyo',
        userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
        content: 'What technology stack are you using for the surveillance system? We might be able to contribute some open-source tools.',
        timestamp: '2025-02-02T12:00:00Z',
        likes: 8,
        isLiked: true,
      },
    ],
    commentsCount: 15,
  },
  {
    id: 'post_002',
    userId: 'user_005',
    userName: 'Dr. Amina Hassan',
    userAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
    userRole: 'Hybrid',
    userAffiliation: 'Ethiopian Public Health Institute',
    content: 'Our pandemic preparedness workshop with local health workers was a success! 120 participants trained on early warning protocols. The community engagement was truly inspiring. 💪🏥',
    media: [
      {
        type: 'photo',
        url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
      },
      {
        type: 'photo',
        url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800',
      },
    ],
    timestamp: '2025-02-01T16:45:00Z',
    likes: 89,
    isLiked: true,
    comments: [
      {
        id: 'comment_003',
        userId: 'user_007',
        userName: 'Grace Mutoni',
        userAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
        content: 'Amazing work! We should coordinate on similar training in Rwanda.',
        timestamp: '2025-02-01T17:30:00Z',
        likes: 5,
        isLiked: false,
      },
    ],
    commentsCount: 23,
  },
  {
    id: 'post_003',
    userId: 'user_006',
    userName: 'Samuel Osei',
    userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    userRole: 'Builder',
    userAffiliation: 'WaterAid West Africa',
    content: 'New water purification system installed in Kano State! Clean water now accessible to 5,000+ residents. This wouldn\'t have been possible without our incredible partners and the DAO funding. 💧🙏',
    media: [
      {
        type: 'video',
        url: 'https://images.unsplash.com/photo-1581093458791-9d42e3c7e117?w=800',
        thumbnail: 'https://images.unsplash.com/photo-1581093458791-9d42e3c7e117?w=800',
      },
    ],
    timestamp: '2025-02-01T09:20:00Z',
    likes: 156,
    isLiked: false,
    comments: [
      {
        id: 'comment_004',
        userId: 'user_009',
        userName: 'Dr. Nana Akua',
        userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
        content: 'Congratulations! This is exactly the kind of impact we love to see. Documentation looks thorough.',
        attachments: [
          {
            id: 'att_001',
            type: 'document',
            url: '#',
            name: 'Impact_Assessment_Report.pdf',
          },
        ],
        timestamp: '2025-02-01T10:00:00Z',
        likes: 18,
        isLiked: false,
      },
    ],
    commentsCount: 31,
  },
  {
    id: 'post_004',
    userId: 'user_008',
    userName: 'Ibrahim Diallo',
    userAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
    userRole: 'Hybrid',
    userAffiliation: 'Senegal Climate Initiative',
    content: 'Published our latest research on agricultural adaptation strategies for the Sahel region. The findings suggest that intercropping with drought-resistant varieties can increase yields by 35% while reducing water usage. Link to full paper in comments.',
    timestamp: '2025-01-31T14:00:00Z',
    likes: 72,
    isLiked: false,
    comments: [
      {
        id: 'comment_005',
        userId: 'user_010',
        userName: 'Joseph Mwangi',
        userAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400',
        content: 'Fascinating research! We\'ve seen similar results in Uganda. Here\'s a voice note with some additional context.',
        attachments: [
          {
            id: 'att_002',
            type: 'audio',
            url: '#',
            duration: 45,
          },
        ],
        timestamp: '2025-01-31T15:30:00Z',
        likes: 9,
        isLiked: false,
      },
    ],
    commentsCount: 18,
  },
  {
    id: 'post_005',
    userId: 'user_007',
    userName: 'Grace Mutoni',
    userAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
    userRole: 'Researcher',
    userAffiliation: 'Rwanda Biomedical Centre',
    content: 'Breakthrough in our vaccine cold chain monitoring project! Our IoT sensors detected a temperature excursion before it could compromise any vaccines. Technology + local expertise = lives saved. 🌡️✨',
    media: [
      {
        type: 'photo',
        url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800',
      },
    ],
    timestamp: '2025-01-30T11:00:00Z',
    likes: 134,
    isLiked: true,
    comments: [],
    commentsCount: 42,
  },
  {
    id: 'post_006',
    userId: 'user_012',
    userName: 'Daniel Okoro',
    userAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400',
    userRole: 'Funder',
    userAffiliation: 'AfriHealth Ventures',
    content: 'Excited to announce our new $2M fund for early-stage health tech in Sub-Saharan Africa! Looking for innovative solutions in diagnostics, telemedicine, and health data analytics. DM me if you have a proposal.',
    timestamp: '2025-01-29T08:30:00Z',
    likes: 245,
    isLiked: false,
    comments: [
      {
        id: 'comment_006',
        userId: 'user_004',
        userName: 'Tendai Moyo',
        userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
        content: 'This is huge news! Sending over our proposal for the mobile diagnostics platform.',
        timestamp: '2025-01-29T09:15:00Z',
        likes: 6,
        isLiked: false,
      },
      {
        id: 'comment_007',
        userId: 'user_011',
        userName: 'Aisha Mohammed',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
        content: 'Great initiative! What\'s the typical ticket size you\'re looking at?',
        timestamp: '2025-01-29T10:00:00Z',
        likes: 3,
        isLiked: false,
      },
    ],
    commentsCount: 56,
  },
  {
    id: 'post_007',
    userId: 'user_013',
    userName: 'Dr. Zainab Kamara',
    userAvatar: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400',
    userRole: 'Hybrid',
    userAffiliation: 'Tanzania Health Research Institute',
    content: 'Reflecting on 10 years of community health work in rural Tanzania. From skepticism to trust, watching communities embrace preventive care has been the most rewarding journey. Here\'s to the next decade! 🎉',
    media: [
      {
        type: 'photo',
        url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800',
      },
      {
        type: 'photo',
        url: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800',
      },
      {
        type: 'photo',
        url: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800',
      },
    ],
    timestamp: '2025-01-28T18:00:00Z',
    likes: 312,
    isLiked: true,
    comments: [],
    commentsCount: 89,
  },
  {
    id: 'post_008',
    userId: 'user_011',
    userName: 'Aisha Mohammed',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    userRole: 'Researcher',
    userAffiliation: 'Cairo University',
    content: 'Air quality monitoring stations now live in 15 neighborhoods across Cairo! Real-time data helping policymakers and residents make informed decisions. Check out our dashboard - feedback welcome! 🌍💨',
    media: [
      {
        type: 'photo',
        url: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800',
      },
    ],
    timestamp: '2025-01-27T12:15:00Z',
    likes: 98,
    isLiked: false,
    comments: [
      {
        id: 'comment_008',
        userId: 'user_008',
        userName: 'Ibrahim Diallo',
        userAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
        content: 'Impressive work! Would love to see this model replicated in Dakar.',
        attachments: [
          {
            id: 'att_003',
            type: 'photo',
            url: 'https://images.unsplash.com/photo-1569683795645-b62e50fbf103?w=400',
          },
        ],
        timestamp: '2025-01-27T13:00:00Z',
        likes: 4,
        isLiked: false,
      },
    ],
    commentsCount: 27,
  },
];

export const getMorePosts = (page: number): CommunityPost[] => {
  const basePosts = communityFeedPosts.map((post, index) => ({
    ...post,
    id: `post_page${page}_${index}`,
    timestamp: new Date(Date.now() - (page * 7 + index) * 24 * 60 * 60 * 1000).toISOString(),
  }));
  return basePosts;
};
