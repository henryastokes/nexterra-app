export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  type: 'text' | 'file' | 'image' | 'audio' | 'video';
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participants: {
    id: string;
    name: string;
    avatar: string;
    role: string;
    online: boolean;
  }[];
  lastMessage: Message;
  unreadCount: number;
  tag?: {
    type: 'proposal' | 'dao' | 'collaboration';
    name: string;
    color: string;
  };
  encrypted: boolean;
  createdAt: string;
}

export const conversations: Conversation[] = [
  {
    id: 'conv-1',
    participants: [
      {
        id: 'user-2',
        name: 'Dr. Amina Okafor',
        avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200',
        role: 'Researcher',
        online: true,
      },
    ],
    lastMessage: {
      id: 'msg-1-5',
      senderId: 'user-2',
      text: 'The field data from Lagos looks promising. Can we schedule a call to discuss the findings?',
      timestamp: '2026-01-31T10:30:00Z',
      type: 'text',
      read: false,
    },
    unreadCount: 3,
    tag: {
      type: 'proposal',
      name: 'Malaria Surveillance',
      color: '#C8E84B',
    },
    encrypted: true,
    createdAt: '2026-01-15T08:00:00Z',
  },
  {
    id: 'conv-2',
    participants: [
      {
        id: 'user-3',
        name: 'Emmanuel Mensah',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
        role: 'Builder',
        online: false,
      },
    ],
    lastMessage: {
      id: 'msg-2-3',
      senderId: 'current-user',
      text: 'Thanks for sharing the prototype specs. I\'ll review them this week.',
      timestamp: '2026-01-30T16:45:00Z',
      type: 'text',
      read: true,
    },
    unreadCount: 0,
    tag: {
      type: 'collaboration',
      name: 'Water Sensors',
      color: '#D4A853',
    },
    encrypted: true,
    createdAt: '2026-01-10T12:00:00Z',
  },
  {
    id: 'conv-3',
    participants: [
      {
        id: 'user-4',
        name: 'Dr. Fatima Hassan',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
        role: 'Funder',
        online: true,
      },
    ],
    lastMessage: {
      id: 'msg-3-4',
      senderId: 'user-4',
      text: 'Your proposal has been approved! Let\'s discuss the fund disbursement timeline.',
      timestamp: '2026-01-29T14:20:00Z',
      type: 'text',
      read: true,
    },
    unreadCount: 0,
    tag: {
      type: 'dao',
      name: 'East Africa Climate DAO',
      color: '#A67C52',
    },
    encrypted: true,
    createdAt: '2026-01-05T09:00:00Z',
  },
  {
    id: 'conv-4',
    participants: [
      {
        id: 'user-5',
        name: 'Kwame Asante',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
        role: 'Researcher',
        online: false,
      },
      {
        id: 'user-6',
        name: 'Dr. Grace Ndungu',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200',
        role: 'Hybrid',
        online: true,
      },
    ],
    lastMessage: {
      id: 'msg-4-8',
      senderId: 'user-6',
      text: 'I\'ve uploaded the latest climate data analysis to the shared folder.',
      timestamp: '2026-01-28T11:15:00Z',
      type: 'file',
      fileName: 'climate_analysis_q1.pdf',
      fileSize: '2.4 MB',
      read: true,
    },
    unreadCount: 0,
    tag: {
      type: 'collaboration',
      name: 'Climate Research Group',
      color: '#D4A853',
    },
    encrypted: true,
    createdAt: '2025-12-20T10:00:00Z',
  },
  {
    id: 'conv-5',
    participants: [
      {
        id: 'user-7',
        name: 'Ibrahim Diallo',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
        role: 'Builder',
        online: true,
      },
    ],
    lastMessage: {
      id: 'msg-5-2',
      senderId: 'user-7',
      text: 'Check out this voice note explaining the sensor calibration process.',
      timestamp: '2026-01-27T09:00:00Z',
      type: 'audio',
      fileName: 'calibration_guide.m4a',
      fileSize: '1.2 MB',
      read: false,
    },
    unreadCount: 1,
    encrypted: true,
    createdAt: '2026-01-25T14:00:00Z',
  },
  {
    id: 'conv-6',
    participants: [
      {
        id: 'user-8',
        name: 'NexTerra Support',
        avatar: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200',
        role: 'System',
        online: true,
      },
    ],
    lastMessage: {
      id: 'msg-6-1',
      senderId: 'user-8',
      text: 'Welcome to NexTerra! Your account verification is complete. Start exploring research opportunities.',
      timestamp: '2026-01-20T08:00:00Z',
      type: 'text',
      read: true,
    },
    unreadCount: 0,
    encrypted: true,
    createdAt: '2026-01-20T08:00:00Z',
  },
];

export const chatMessages: Record<string, Message[]> = {
  'conv-1': [
    {
      id: 'msg-1-1',
      senderId: 'current-user',
      text: 'Hi Dr. Okafor, I reviewed your malaria surveillance proposal. Very impressive methodology!',
      timestamp: '2026-01-30T09:00:00Z',
      type: 'text',
      read: true,
    },
    {
      id: 'msg-1-2',
      senderId: 'user-2',
      text: 'Thank you! We\'ve been refining it based on the DAO feedback. The community input has been invaluable.',
      timestamp: '2026-01-30T09:15:00Z',
      type: 'text',
      read: true,
    },
    {
      id: 'msg-1-3',
      senderId: 'user-2',
      text: 'Here\'s the updated research protocol document.',
      timestamp: '2026-01-30T09:20:00Z',
      type: 'file',
      fileName: 'malaria_protocol_v3.pdf',
      fileSize: '3.8 MB',
      read: true,
    },
    {
      id: 'msg-1-4',
      senderId: 'current-user',
      text: 'This looks great. I\'ll share it with the funding committee.',
      timestamp: '2026-01-30T10:00:00Z',
      type: 'text',
      read: true,
    },
    {
      id: 'msg-1-5',
      senderId: 'user-2',
      text: 'The field data from Lagos looks promising. Can we schedule a call to discuss the findings?',
      timestamp: '2026-01-31T10:30:00Z',
      type: 'text',
      read: false,
    },
  ],
  'conv-2': [
    {
      id: 'msg-2-1',
      senderId: 'user-3',
      text: 'I\'ve completed the initial design for the water quality sensors.',
      timestamp: '2026-01-29T14:00:00Z',
      type: 'text',
      read: true,
    },
    {
      id: 'msg-2-2',
      senderId: 'user-3',
      text: 'Here are the prototype specifications.',
      timestamp: '2026-01-29T14:05:00Z',
      type: 'file',
      fileName: 'sensor_specs.pdf',
      fileSize: '1.5 MB',
      read: true,
    },
    {
      id: 'msg-2-3',
      senderId: 'current-user',
      text: 'Thanks for sharing the prototype specs. I\'ll review them this week.',
      timestamp: '2026-01-30T16:45:00Z',
      type: 'text',
      read: true,
    },
  ],
  'conv-3': [
    {
      id: 'msg-3-1',
      senderId: 'current-user',
      text: 'Dr. Hassan, thank you for considering our climate adaptation proposal.',
      timestamp: '2026-01-28T10:00:00Z',
      type: 'text',
      read: true,
    },
    {
      id: 'msg-3-2',
      senderId: 'user-4',
      text: 'The proposal aligns perfectly with our funding priorities. The DAO members have voted favorably.',
      timestamp: '2026-01-28T11:30:00Z',
      type: 'text',
      read: true,
    },
    {
      id: 'msg-3-3',
      senderId: 'current-user',
      text: 'That\'s wonderful news! What are the next steps?',
      timestamp: '2026-01-29T09:00:00Z',
      type: 'text',
      read: true,
    },
    {
      id: 'msg-3-4',
      senderId: 'user-4',
      text: 'Your proposal has been approved! Let\'s discuss the fund disbursement timeline.',
      timestamp: '2026-01-29T14:20:00Z',
      type: 'text',
      read: true,
    },
  ],
  'conv-4': [
    {
      id: 'msg-4-1',
      senderId: 'user-5',
      text: 'Team, let\'s coordinate on the climate data collection for Q1.',
      timestamp: '2026-01-26T08:00:00Z',
      type: 'text',
      read: true,
    },
    {
      id: 'msg-4-2',
      senderId: 'current-user',
      text: 'I can handle the West Africa region data.',
      timestamp: '2026-01-26T08:30:00Z',
      type: 'text',
      read: true,
    },
    {
      id: 'msg-4-3',
      senderId: 'user-6',
      text: 'I\'ll take East Africa. Let me share my initial findings.',
      timestamp: '2026-01-26T09:00:00Z',
      type: 'text',
      read: true,
    },
    {
      id: 'msg-4-4',
      senderId: 'user-6',
      text: 'Preliminary temperature data from Kenya.',
      timestamp: '2026-01-26T09:05:00Z',
      type: 'image',
      fileUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
      fileName: 'kenya_temp_chart.png',
      read: true,
    },
    {
      id: 'msg-4-5',
      senderId: 'user-5',
      text: 'Excellent visualization! Can you add the rainfall correlation?',
      timestamp: '2026-01-27T10:00:00Z',
      type: 'text',
      read: true,
    },
    {
      id: 'msg-4-6',
      senderId: 'user-6',
      text: 'Working on it now. Should have it ready by tomorrow.',
      timestamp: '2026-01-27T11:00:00Z',
      type: 'text',
      read: true,
    },
    {
      id: 'msg-4-7',
      senderId: 'current-user',
      text: 'Looking forward to seeing the combined analysis.',
      timestamp: '2026-01-28T09:00:00Z',
      type: 'text',
      read: true,
    },
    {
      id: 'msg-4-8',
      senderId: 'user-6',
      text: 'I\'ve uploaded the latest climate data analysis to the shared folder.',
      timestamp: '2026-01-28T11:15:00Z',
      type: 'file',
      fileName: 'climate_analysis_q1.pdf',
      fileSize: '2.4 MB',
      read: true,
    },
  ],
  'conv-5': [
    {
      id: 'msg-5-1',
      senderId: 'current-user',
      text: 'Ibrahim, could you walk me through the sensor calibration process?',
      timestamp: '2026-01-26T15:00:00Z',
      type: 'text',
      read: true,
    },
    {
      id: 'msg-5-2',
      senderId: 'user-7',
      text: 'Check out this voice note explaining the sensor calibration process.',
      timestamp: '2026-01-27T09:00:00Z',
      type: 'audio',
      fileName: 'calibration_guide.m4a',
      fileSize: '1.2 MB',
      read: false,
    },
  ],
  'conv-6': [
    {
      id: 'msg-6-1',
      senderId: 'user-8',
      text: 'Welcome to NexTerra! Your account verification is complete. Start exploring research opportunities.',
      timestamp: '2026-01-20T08:00:00Z',
      type: 'text',
      read: true,
    },
  ],
};

export const tagFilters = [
  { id: 'all', label: 'All', color: '#FFFFFF' },
  { id: 'proposal', label: 'Proposals', color: '#C8E84B' },
  { id: 'dao', label: 'DAO', color: '#A67C52' },
  { id: 'collaboration', label: 'Collaborations', color: '#D4A853' },
];
