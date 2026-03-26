export interface MatchableProject {
  id: string;
  title: string;
  description: string;
  issueArea: string;
  country: string;
  region: string;
  fundingNeeded: number;
  fundingMin: number;
  fundingMax: number;
  currency: string;
  impactMetrics: string[];
  timeline: string;
  imageUrl: string;
  submittedBy: {
    id: string;
    name: string;
    avatar: string;
    organization: string;
  };
  tags: string[];
  status: 'seeking_funding' | 'partially_funded' | 'matched';
  matchedFunders?: string[];
  createdAt: string;
}

export interface FunderPreferences {
  id: string;
  visibleTo: string;
  geographyPreferences: string[];
  issuePreferences: string[];
  fundingRangeMin: number;
  fundingRangeMax: number;
  impactPreferences: string[];
  preferredTimeline: string[];
  excludedRegions?: string[];
}

export const impactCategories = [
  'Lives Saved',
  'Communities Reached',
  'Carbon Sequestered',
  'Water Access',
  'Healthcare Access',
  'Food Security',
  'Economic Development',
  'Education Impact',
  'Gender Equality',
  'Biodiversity Protection',
];

export const timelineOptions = [
  '6 months',
  '1 year',
  '2 years',
  '3+ years',
];

export const matchableProjects: MatchableProject[] = [
  {
    id: 'mp1',
    title: 'Solar-Powered Water Pumps for Sahel Villages',
    description: 'Installing 50 solar-powered water pumps across drought-affected villages in Mali and Niger, providing clean water to over 25,000 people.',
    issueArea: 'Water Security',
    country: 'Mali',
    region: 'Sahel',
    fundingNeeded: 180000,
    fundingMin: 50000,
    fundingMax: 200000,
    currency: 'USDC',
    impactMetrics: ['Water Access', 'Communities Reached', 'Lives Saved'],
    timeline: '1 year',
    imageUrl: 'https://images.unsplash.com/photo-1594398901394-4e34939a4fd0?w=800',
    submittedBy: {
      id: 'user_mp1',
      name: 'Amadou Traoré',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      organization: 'Sahel Water Initiative',
    },
    tags: ['water', 'solar', 'rural', 'community'],
    status: 'seeking_funding',
    createdAt: '2025-01-15T10:00:00Z',
  },
  {
    id: 'mp2',
    title: 'Mobile Malaria Testing Units - East Africa',
    description: 'Deploying 30 mobile malaria testing and treatment units across rural Kenya and Tanzania, targeting 100,000 screenings in year one.',
    issueArea: 'Disease Prevention',
    country: 'Kenya',
    region: 'East Africa',
    fundingNeeded: 320000,
    fundingMin: 100000,
    fundingMax: 400000,
    currency: 'USDC',
    impactMetrics: ['Lives Saved', 'Healthcare Access', 'Communities Reached'],
    timeline: '2 years',
    imageUrl: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=800',
    submittedBy: {
      id: 'user_mp2',
      name: 'Dr. Grace Wambui',
      avatar: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=150',
      organization: 'East Africa Health Network',
    },
    tags: ['malaria', 'mobile health', 'diagnostics', 'rural health'],
    status: 'seeking_funding',
    createdAt: '2025-01-18T14:30:00Z',
  },
  {
    id: 'mp3',
    title: 'Mangrove Carbon Sequestration - Ghana Coast',
    description: 'Restoring 500 hectares of mangrove forests along Ghana\'s coast, sequestering 50,000 tons of CO2 annually while protecting fisheries.',
    issueArea: 'Climate Mitigation',
    country: 'Ghana',
    region: 'West Africa',
    fundingNeeded: 250000,
    fundingMin: 75000,
    fundingMax: 300000,
    currency: 'USDC',
    impactMetrics: ['Carbon Sequestered', 'Biodiversity Protection', 'Economic Development'],
    timeline: '3+ years',
    imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
    submittedBy: {
      id: 'user_mp3',
      name: 'Kofi Mensah',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      organization: 'Ghana Coastal Conservation',
    },
    tags: ['mangroves', 'blue carbon', 'coastal', 'fisheries'],
    status: 'seeking_funding',
    createdAt: '2025-01-20T09:15:00Z',
  },
  {
    id: 'mp4',
    title: 'Community Health Worker Training - Nigeria',
    description: 'Training 500 community health workers in northern Nigeria on maternal and child health, vaccination protocols, and disease surveillance.',
    issueArea: 'Public Health Infrastructure',
    country: 'Nigeria',
    region: 'West Africa',
    fundingNeeded: 150000,
    fundingMin: 40000,
    fundingMax: 200000,
    currency: 'USDC',
    impactMetrics: ['Healthcare Access', 'Lives Saved', 'Communities Reached'],
    timeline: '1 year',
    imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800',
    submittedBy: {
      id: 'user_mp4',
      name: 'Dr. Amina Yusuf',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
      organization: 'Nigeria Health Foundation',
    },
    tags: ['training', 'community health', 'maternal health', 'vaccination'],
    status: 'partially_funded',
    matchedFunders: ['funder_003'],
    createdAt: '2025-01-10T11:00:00Z',
  },
  {
    id: 'mp5',
    title: 'Climate-Smart Agriculture - Ethiopia',
    description: 'Introducing drought-resistant crops and irrigation techniques to 2,000 smallholder farmers in the Ethiopian highlands.',
    issueArea: 'Agricultural Innovation',
    country: 'Ethiopia',
    region: 'Horn of Africa',
    fundingNeeded: 220000,
    fundingMin: 60000,
    fundingMax: 250000,
    currency: 'USDC',
    impactMetrics: ['Food Security', 'Economic Development', 'Communities Reached'],
    timeline: '2 years',
    imageUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800',
    submittedBy: {
      id: 'user_mp5',
      name: 'Yonas Bekele',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
      organization: 'Ethiopian Agriculture Innovation',
    },
    tags: ['agriculture', 'climate adaptation', 'smallholders', 'drought'],
    status: 'seeking_funding',
    createdAt: '2025-01-22T08:45:00Z',
  },
  {
    id: 'mp6',
    title: 'Pandemic Early Warning System - West Africa',
    description: 'Building an integrated disease surveillance network across 5 West African countries with real-time data sharing and AI-powered outbreak prediction.',
    issueArea: 'Pandemic Preparedness',
    country: 'Senegal',
    region: 'West Africa',
    fundingNeeded: 450000,
    fundingMin: 150000,
    fundingMax: 500000,
    currency: 'USDC',
    impactMetrics: ['Lives Saved', 'Healthcare Access', 'Communities Reached'],
    timeline: '3+ years',
    imageUrl: 'https://images.unsplash.com/photo-1584483766114-2cea6facdf57?w=800',
    submittedBy: {
      id: 'user_mp6',
      name: 'Dr. Ousmane Ndiaye',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
      organization: 'West Africa Health Security',
    },
    tags: ['surveillance', 'pandemic', 'AI', 'regional cooperation'],
    status: 'seeking_funding',
    createdAt: '2025-01-25T16:00:00Z',
  },
  {
    id: 'mp7',
    title: 'Clean Cookstove Distribution - Rwanda',
    description: 'Distributing 10,000 clean cookstoves to rural households in Rwanda, reducing indoor air pollution and deforestation.',
    issueArea: 'Environmental Conservation',
    country: 'Rwanda',
    region: 'East Africa',
    fundingNeeded: 85000,
    fundingMin: 25000,
    fundingMax: 100000,
    currency: 'USDC',
    impactMetrics: ['Carbon Sequestered', 'Lives Saved', 'Gender Equality'],
    timeline: '1 year',
    imageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800',
    submittedBy: {
      id: 'user_mp7',
      name: 'Diane Uwimana',
      avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150',
      organization: 'Rwanda Clean Energy Initiative',
    },
    tags: ['cookstoves', 'clean energy', 'women', 'deforestation'],
    status: 'seeking_funding',
    createdAt: '2025-01-28T12:30:00Z',
  },
  {
    id: 'mp8',
    title: 'Telemedicine Network - South Africa Rural',
    description: 'Establishing telemedicine hubs in 25 rural clinics across Eastern Cape and Limpopo provinces, connecting patients to specialists.',
    issueArea: 'Health Technology',
    country: 'South Africa',
    region: 'Southern Africa',
    fundingNeeded: 280000,
    fundingMin: 80000,
    fundingMax: 350000,
    currency: 'USDC',
    impactMetrics: ['Healthcare Access', 'Communities Reached', 'Lives Saved'],
    timeline: '2 years',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
    submittedBy: {
      id: 'user_mp8',
      name: 'Dr. Thabo Molefe',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      organization: 'South Africa Digital Health',
    },
    tags: ['telemedicine', 'digital health', 'rural', 'specialists'],
    status: 'seeking_funding',
    createdAt: '2025-01-26T09:00:00Z',
  },
];

export const calculateMatchScore = (
  project: MatchableProject,
  funderPreferences: {
    geographyPreferences: string[];
    issuePreferences: string[];
    fundingRangeMin: number;
    fundingRangeMax: number;
    impactPreferences: string[];
  }
): number => {
  let score = 0;
  let maxScore = 0;

  // Geography match (30 points max)
  maxScore += 30;
  if (funderPreferences.geographyPreferences.includes(project.region)) {
    score += 20;
  }
  if (funderPreferences.geographyPreferences.includes(project.country)) {
    score += 10;
  }

  // Issue area match (30 points max)
  maxScore += 30;
  if (funderPreferences.issuePreferences.includes(project.issueArea)) {
    score += 30;
  }

  // Funding range match (20 points max)
  maxScore += 20;
  if (
    project.fundingNeeded >= funderPreferences.fundingRangeMin &&
    project.fundingNeeded <= funderPreferences.fundingRangeMax
  ) {
    score += 20;
  } else if (
    project.fundingMin <= funderPreferences.fundingRangeMax &&
    project.fundingMax >= funderPreferences.fundingRangeMin
  ) {
    score += 10;
  }

  // Impact preferences match (20 points max)
  maxScore += 20;
  const impactMatches = project.impactMetrics.filter((metric) =>
    funderPreferences.impactPreferences.includes(metric)
  ).length;
  score += Math.min(20, impactMatches * 7);

  return Math.round((score / maxScore) * 100);
};

export const getMatchedFundersForProject = (
  project: MatchableProject,
  funders: {
    id: string;
    name: string;
    avatar: string;
    organization: string;
    focusAreas: string[];
    country: string;
    totalFunded: number;
  }[]
): {
  funder: typeof funders[0];
  matchScore: number;
  matchReasons: string[];
}[] => {
  return funders.map((funder) => {
    let score = 0;
    const reasons: string[] = [];

    // Check issue area overlap
    const focusAreaMapping: Record<string, string[]> = {
      'Climate Research': ['Climate Mitigation', 'Climate Adaptation'],
      'Disease Prevention': ['Disease Prevention', 'Pandemic Preparedness'],
      'Public Health Infrastructure': ['Public Health Infrastructure', 'Healthcare Access'],
      'Clean Water Access': ['Water Security'],
      'Agricultural Innovation': ['Agricultural Innovation', 'Food Security'],
      'Pandemic Preparedness': ['Pandemic Preparedness', 'Disease Prevention'],
      'Environmental Conservation': ['Environmental Conservation', 'Climate Mitigation'],
      'Health Technology': ['Health Technology', 'Healthcare Access'],
      'Community Health': ['Public Health Infrastructure', 'Healthcare Access'],
      'Policy Research': ['Climate Adaptation', 'Public Health Infrastructure'],
    };

    funder.focusAreas.forEach((area) => {
      const mappedAreas = focusAreaMapping[area] || [];
      if (mappedAreas.includes(project.issueArea)) {
        score += 25;
        reasons.push(`Focus area: ${area}`);
      }
    });

    // Check region match
    const countryToRegion: Record<string, string> = {
      'Kenya': 'East Africa',
      'Nigeria': 'West Africa',
      'Ghana': 'West Africa',
      'South Africa': 'Southern Africa',
      'Ethiopia': 'Horn of Africa',
      'Senegal': 'West Africa',
      'Egypt': 'North Africa',
    };

    if (countryToRegion[funder.country] === project.region) {
      score += 20;
      reasons.push(`Regional match: ${project.region}`);
    }

    // Check funding capacity
    if (funder.totalFunded > project.fundingNeeded * 0.1) {
      score += 15;
      reasons.push('Funding capacity aligned');
    }

    // Add some randomness for demo variety
    score += Math.floor(Math.random() * 15);

    return {
      funder,
      matchScore: Math.min(98, score),
      matchReasons: reasons.slice(0, 3),
    };
  }).sort((a, b) => b.matchScore - a.matchScore);
};
