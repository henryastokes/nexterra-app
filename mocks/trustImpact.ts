export interface PeerEndorsementMetric {
  discussionUpvotes: number;
  expertValidations: number;
  qualityEndorsements: number;
  accuracyEndorsements: number;
  insightEndorsements: number;
}

export interface ExecutionCredibility {
  completedSubDAOs: number;
  onTimeDelivery: number;
  budgetAdherence: number;
  milestoneSuccess: number;
  stakeholderSatisfaction: number;
}

export interface FieldContribution {
  verifiedFieldPosts: number;
  usefulnessRating: number;
  citationsInProposals: number;
  implementationLinks: number;
  communityImpactScore: number;
}

export interface GovernanceParticipation {
  totalVotes: number;
  proposalsReviewed: number;
  constructiveFeedback: number;
  consensusAlignment: number;
  participationConsistency: number;
}

export interface TrustImpactProfile {
  userId: string;
  credibilityScore: number;
  impactScore: number;
  peerEndorsement: PeerEndorsementMetric;
  executionCredibility: ExecutionCredibility;
  fieldContribution: FieldContribution;
  governanceParticipation: GovernanceParticipation;
  lastUpdated: string;
  scoreHistory: ScoreHistoryEntry[];
}

export interface ScoreHistoryEntry {
  date: string;
  credibilityScore: number;
  impactScore: number;
  event?: string;
}

export interface GovernanceWeight {
  baseVotingPower: number;
  credibilityMultiplier: number;
  impactMultiplier: number;
  effectiveVotingPower: number;
}

export const calculateCredibilityScore = (profile: TrustImpactProfile): number => {
  const exec = profile.executionCredibility;
  const gov = profile.governanceParticipation;
  const peer = profile.peerEndorsement;

  const executionScore = (
    (exec.completedSubDAOs * 10) +
    (exec.onTimeDelivery * 0.3) +
    (exec.budgetAdherence * 0.3) +
    (exec.milestoneSuccess * 0.2) +
    (exec.stakeholderSatisfaction * 0.2)
  );

  const governanceScore = (
    Math.min(gov.totalVotes * 0.1, 20) +
    (gov.proposalsReviewed * 0.5) +
    (gov.constructiveFeedback * 0.3) +
    (gov.consensusAlignment * 0.2) +
    (gov.participationConsistency * 0.2)
  );

  const peerScore = (
    Math.min(peer.discussionUpvotes * 0.05, 15) +
    (peer.expertValidations * 3) +
    (peer.qualityEndorsements * 2) +
    (peer.accuracyEndorsements * 2) +
    (peer.insightEndorsements * 1.5)
  );

  const rawScore = (executionScore * 0.5) + (governanceScore * 0.25) + (peerScore * 0.25);
  return Math.min(Math.round(rawScore), 100);
};

export const calculateImpactScore = (profile: TrustImpactProfile): number => {
  const field = profile.fieldContribution;
  const exec = profile.executionCredibility;
  const peer = profile.peerEndorsement;

  const fieldScore = (
    (field.verifiedFieldPosts * 2) +
    (field.usefulnessRating * 15) +
    (field.citationsInProposals * 5) +
    (field.implementationLinks * 10) +
    (field.communityImpactScore * 0.5)
  );

  const realWorldScore = (
    (exec.completedSubDAOs * 8) +
    (exec.stakeholderSatisfaction * 0.3)
  );

  const endorsementScore = (
    (peer.expertValidations * 2) +
    (peer.insightEndorsements * 1.5)
  );

  const rawScore = (fieldScore * 0.5) + (realWorldScore * 0.35) + (endorsementScore * 0.15);
  return Math.min(Math.round(rawScore), 100);
};

export const calculateGovernanceWeight = (
  credibilityScore: number,
  impactScore: number
): GovernanceWeight => {
  const baseVotingPower = 1;
  
  // Non-linear multipliers using square root for diminishing returns
  const credibilityMultiplier = 1 + (Math.sqrt(credibilityScore) / 10);
  const impactMultiplier = 1 + (Math.sqrt(impactScore) / 12);
  
  const effectiveVotingPower = baseVotingPower * credibilityMultiplier * impactMultiplier;

  return {
    baseVotingPower,
    credibilityMultiplier: Math.round(credibilityMultiplier * 100) / 100,
    impactMultiplier: Math.round(impactMultiplier * 100) / 100,
    effectiveVotingPower: Math.round(effectiveVotingPower * 100) / 100,
  };
};

export const getVisibilityBoost = (credibilityScore: number, impactScore: number): number => {
  const combinedScore = (credibilityScore * 0.6) + (impactScore * 0.4);
  if (combinedScore >= 85) return 3;
  if (combinedScore >= 70) return 2;
  if (combinedScore >= 50) return 1.5;
  return 1;
};

export const getMatchingPriority = (credibilityScore: number, impactScore: number): number => {
  return Math.round((credibilityScore * 0.5) + (impactScore * 0.5));
};

export const sampleTrustProfiles: TrustImpactProfile[] = [
  {
    userId: 'user_001',
    credibilityScore: 88,
    impactScore: 82,
    peerEndorsement: {
      discussionUpvotes: 234,
      expertValidations: 12,
      qualityEndorsements: 18,
      accuracyEndorsements: 15,
      insightEndorsements: 22,
    },
    executionCredibility: {
      completedSubDAOs: 5,
      onTimeDelivery: 92,
      budgetAdherence: 88,
      milestoneSuccess: 95,
      stakeholderSatisfaction: 90,
    },
    fieldContribution: {
      verifiedFieldPosts: 15,
      usefulnessRating: 4.6,
      citationsInProposals: 8,
      implementationLinks: 3,
      communityImpactScore: 78,
    },
    governanceParticipation: {
      totalVotes: 156,
      proposalsReviewed: 23,
      constructiveFeedback: 45,
      consensusAlignment: 82,
      participationConsistency: 88,
    },
    lastUpdated: '2025-01-30T10:00:00Z',
    scoreHistory: [
      { date: '2024-12-01', credibilityScore: 72, impactScore: 65 },
      { date: '2024-12-15', credibilityScore: 76, impactScore: 70, event: 'Completed Sub-DAO' },
      { date: '2025-01-01', credibilityScore: 82, impactScore: 75, event: 'Expert Validation' },
      { date: '2025-01-15', credibilityScore: 85, impactScore: 78, event: 'Implementation Link' },
      { date: '2025-01-30', credibilityScore: 88, impactScore: 82, event: 'Peer Endorsements' },
    ],
  },
  {
    userId: 'user_002',
    credibilityScore: 76,
    impactScore: 68,
    peerEndorsement: {
      discussionUpvotes: 145,
      expertValidations: 6,
      qualityEndorsements: 10,
      accuracyEndorsements: 8,
      insightEndorsements: 14,
    },
    executionCredibility: {
      completedSubDAOs: 2,
      onTimeDelivery: 85,
      budgetAdherence: 90,
      milestoneSuccess: 82,
      stakeholderSatisfaction: 78,
    },
    fieldContribution: {
      verifiedFieldPosts: 8,
      usefulnessRating: 4.2,
      citationsInProposals: 4,
      implementationLinks: 1,
      communityImpactScore: 56,
    },
    governanceParticipation: {
      totalVotes: 89,
      proposalsReviewed: 12,
      constructiveFeedback: 28,
      consensusAlignment: 75,
      participationConsistency: 72,
    },
    lastUpdated: '2025-01-28T14:00:00Z',
    scoreHistory: [
      { date: '2024-12-01', credibilityScore: 62, impactScore: 52 },
      { date: '2025-01-01', credibilityScore: 70, impactScore: 60 },
      { date: '2025-01-28', credibilityScore: 76, impactScore: 68 },
    ],
  },
  {
    userId: 'user_003',
    credibilityScore: 94,
    impactScore: 91,
    peerEndorsement: {
      discussionUpvotes: 456,
      expertValidations: 24,
      qualityEndorsements: 32,
      accuracyEndorsements: 28,
      insightEndorsements: 38,
    },
    executionCredibility: {
      completedSubDAOs: 8,
      onTimeDelivery: 96,
      budgetAdherence: 94,
      milestoneSuccess: 98,
      stakeholderSatisfaction: 95,
    },
    fieldContribution: {
      verifiedFieldPosts: 28,
      usefulnessRating: 4.9,
      citationsInProposals: 18,
      implementationLinks: 7,
      communityImpactScore: 92,
    },
    governanceParticipation: {
      totalVotes: 312,
      proposalsReviewed: 45,
      constructiveFeedback: 78,
      consensusAlignment: 90,
      participationConsistency: 95,
    },
    lastUpdated: '2025-01-30T16:00:00Z',
    scoreHistory: [
      { date: '2024-10-01', credibilityScore: 78, impactScore: 72 },
      { date: '2024-11-01', credibilityScore: 84, impactScore: 80 },
      { date: '2024-12-01', credibilityScore: 88, impactScore: 85 },
      { date: '2025-01-01', credibilityScore: 92, impactScore: 88 },
      { date: '2025-01-30', credibilityScore: 94, impactScore: 91 },
    ],
  },
];

export const getTrustProfileByUserId = (userId: string): TrustImpactProfile | undefined => {
  return sampleTrustProfiles.find(p => p.userId === userId);
};

export const defaultTrustProfile: TrustImpactProfile = {
  userId: '',
  credibilityScore: 50,
  impactScore: 40,
  peerEndorsement: {
    discussionUpvotes: 0,
    expertValidations: 0,
    qualityEndorsements: 0,
    accuracyEndorsements: 0,
    insightEndorsements: 0,
  },
  executionCredibility: {
    completedSubDAOs: 0,
    onTimeDelivery: 0,
    budgetAdherence: 0,
    milestoneSuccess: 0,
    stakeholderSatisfaction: 0,
  },
  fieldContribution: {
    verifiedFieldPosts: 0,
    usefulnessRating: 0,
    citationsInProposals: 0,
    implementationLinks: 0,
    communityImpactScore: 0,
  },
  governanceParticipation: {
    totalVotes: 0,
    proposalsReviewed: 0,
    constructiveFeedback: 0,
    consensusAlignment: 0,
    participationConsistency: 0,
  },
  lastUpdated: new Date().toISOString(),
  scoreHistory: [],
};
