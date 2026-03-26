import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { 
  Shield, 
  Globe, 
  TrendingUp, 
  ChevronDown, 
  ChevronUp,
  Award,
  Vote,
  MapPin,
  Users,
  Zap,
  Info
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { 
  TrustImpactProfile, 
  calculateGovernanceWeight,
  getVisibilityBoost
} from '@/mocks/trustImpact';

interface TrustImpactCardProps {
  profile: TrustImpactProfile;
  showGovernanceWeight?: boolean;
  showVisibilityBoost?: boolean;
  compact?: boolean;
  onLearnMore?: () => void;
}

const getCredibilityColor = (score: number) => {
  if (score >= 90) return Colors.success;
  if (score >= 75) return Colors.primary;
  if (score >= 60) return Colors.accent;
  return Colors.golden;
};

const getImpactColor = (score: number) => {
  if (score >= 85) return Colors.success;
  if (score >= 70) return Colors.primary;
  if (score >= 50) return Colors.accent;
  return Colors.golden;
};

export default function TrustImpactCard({ 
  profile, 
  showGovernanceWeight = false,
  showVisibilityBoost = false,
  compact = false,
  onLearnMore
}: TrustImpactCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const credibilityAnim = useRef(new Animated.Value(0)).current;
  const impactAnim = useRef(new Animated.Value(0)).current;

  const governanceWeight = calculateGovernanceWeight(profile.credibilityScore, profile.impactScore);
  const visibilityBoost = getVisibilityBoost(profile.credibilityScore, profile.impactScore);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(credibilityAnim, {
        toValue: profile.credibilityScore / 100,
        duration: 1000,
        useNativeDriver: false,
      }),
      Animated.timing(impactAnim, {
        toValue: profile.impactScore / 100,
        duration: 1000,
        delay: 200,
        useNativeDriver: false,
      }),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.credibilityScore, profile.impactScore]);

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <View style={styles.compactScores}>
          <View style={styles.compactScoreItem}>
            <View style={[styles.compactIcon, { backgroundColor: getCredibilityColor(profile.credibilityScore) + '20' }]}>
              <Shield size={14} color={getCredibilityColor(profile.credibilityScore)} />
            </View>
            <Text style={[styles.compactValue, { color: getCredibilityColor(profile.credibilityScore) }]}>
              {profile.credibilityScore}
            </Text>
          </View>
          <View style={styles.compactDivider} />
          <View style={styles.compactScoreItem}>
            <View style={[styles.compactIcon, { backgroundColor: getImpactColor(profile.impactScore) + '20' }]}>
              <Globe size={14} color={getImpactColor(profile.impactScore)} />
            </View>
            <Text style={[styles.compactValue, { color: getImpactColor(profile.impactScore) }]}>
              {profile.impactScore}
            </Text>
          </View>
        </View>
        {showGovernanceWeight && (
          <View style={styles.compactWeight}>
            <Vote size={12} color={Colors.primary} />
            <Text style={styles.compactWeightText}>{governanceWeight.effectiveVotingPower}x</Text>
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.header}
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.7}
      >
        <View style={styles.headerLeft}>
          <View style={styles.headerIcon}>
            <Zap size={18} color={Colors.golden} />
          </View>
          <View>
            <Text style={styles.headerTitle}>Trust & Impact</Text>
            <Text style={styles.headerSubtitle}>Multi-layer scoring system</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          {isExpanded ? (
            <ChevronUp size={20} color={Colors.textMuted} />
          ) : (
            <ChevronDown size={20} color={Colors.textMuted} />
          )}
        </View>
      </TouchableOpacity>

      <View style={styles.scoresRow}>
        <View style={styles.scoreCard}>
          <View style={[styles.scoreIconCircle, { backgroundColor: getCredibilityColor(profile.credibilityScore) + '20' }]}>
            <Shield size={20} color={getCredibilityColor(profile.credibilityScore)} />
          </View>
          <Text style={[styles.scoreValue, { color: getCredibilityColor(profile.credibilityScore) }]}>
            {profile.credibilityScore}
          </Text>
          <Text style={styles.scoreLabel}>Credibility</Text>
          <View style={styles.scoreBarBg}>
            <Animated.View 
              style={[
                styles.scoreBarFill, 
                { 
                  backgroundColor: getCredibilityColor(profile.credibilityScore),
                  width: credibilityAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  })
                }
              ]} 
            />
          </View>
          <Text style={styles.scoreDesc}>Execution-based</Text>
        </View>

        <View style={styles.scoreCard}>
          <View style={[styles.scoreIconCircle, { backgroundColor: getImpactColor(profile.impactScore) + '20' }]}>
            <Globe size={20} color={getImpactColor(profile.impactScore)} />
          </View>
          <Text style={[styles.scoreValue, { color: getImpactColor(profile.impactScore) }]}>
            {profile.impactScore}
          </Text>
          <Text style={styles.scoreLabel}>Impact</Text>
          <View style={styles.scoreBarBg}>
            <Animated.View 
              style={[
                styles.scoreBarFill, 
                { 
                  backgroundColor: getImpactColor(profile.impactScore),
                  width: impactAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  })
                }
              ]} 
            />
          </View>
          <Text style={styles.scoreDesc}>Real-world relevance</Text>
        </View>
      </View>

      {(showGovernanceWeight || showVisibilityBoost) && (
        <View style={styles.influenceRow}>
          {showGovernanceWeight && (
            <View style={styles.influenceCard}>
              <Vote size={16} color={Colors.primary} />
              <View style={styles.influenceInfo}>
                <Text style={styles.influenceLabel}>Governance Weight</Text>
                <Text style={styles.influenceValue}>{governanceWeight.effectiveVotingPower}x voting power</Text>
              </View>
            </View>
          )}
          {showVisibilityBoost && (
            <View style={styles.influenceCard}>
              <TrendingUp size={16} color={Colors.accent} />
              <View style={styles.influenceInfo}>
                <Text style={styles.influenceLabel}>Visibility Boost</Text>
                <Text style={styles.influenceValue}>{visibilityBoost}x in search & match</Text>
              </View>
            </View>
          )}
        </View>
      )}

      {isExpanded && (
        <View style={styles.expandedContent}>
          <View style={styles.breakdownSection}>
            <Text style={styles.breakdownTitle}>Credibility Components</Text>
            <View style={styles.componentsList}>
              <ComponentRow 
                icon={<Award size={14} color={Colors.accent} />}
                label="Peer Endorsements"
                value={`${profile.peerEndorsement.qualityEndorsements + profile.peerEndorsement.accuracyEndorsements}`}
                description="Quality & accuracy validations"
              />
              <ComponentRow 
                icon={<Shield size={14} color={Colors.primary} />}
                label="Completed Sub-DAOs"
                value={String(profile.executionCredibility.completedSubDAOs)}
                description={`${profile.executionCredibility.onTimeDelivery}% on-time delivery`}
              />
              <ComponentRow 
                icon={<Vote size={14} color={Colors.golden} />}
                label="Governance Quality"
                value={`${profile.governanceParticipation.totalVotes} votes`}
                description={`${profile.governanceParticipation.proposalsReviewed} proposals reviewed`}
              />
            </View>
          </View>

          <View style={styles.breakdownSection}>
            <Text style={styles.breakdownTitle}>Impact Components</Text>
            <View style={styles.componentsList}>
              <ComponentRow 
                icon={<MapPin size={14} color={Colors.accent} />}
                label="Field Contributions"
                value={String(profile.fieldContribution.verifiedFieldPosts)}
                description={`${profile.fieldContribution.usefulnessRating}/5 usefulness`}
              />
              <ComponentRow 
                icon={<TrendingUp size={14} color={Colors.primary} />}
                label="Proposal Citations"
                value={String(profile.fieldContribution.citationsInProposals)}
                description="Referenced in proposals"
              />
              <ComponentRow 
                icon={<Users size={14} color={Colors.golden} />}
                label="Implementation Links"
                value={String(profile.fieldContribution.implementationLinks)}
                description="Real-world deployments"
              />
            </View>
          </View>

          {showGovernanceWeight && (
            <View style={styles.governanceDetail}>
              <Text style={styles.breakdownTitle}>Governance Weight Calculation</Text>
              <View style={styles.calculationRow}>
                <Text style={styles.calcLabel}>Base Power</Text>
                <Text style={styles.calcValue}>{governanceWeight.baseVotingPower}</Text>
              </View>
              <View style={styles.calculationRow}>
                <Text style={styles.calcLabel}>Credibility Multiplier</Text>
                <Text style={styles.calcValue}>×{governanceWeight.credibilityMultiplier}</Text>
              </View>
              <View style={styles.calculationRow}>
                <Text style={styles.calcLabel}>Impact Multiplier</Text>
                <Text style={styles.calcValue}>×{governanceWeight.impactMultiplier}</Text>
              </View>
              <View style={[styles.calculationRow, styles.calculationTotal]}>
                <Text style={styles.calcTotalLabel}>Effective Power</Text>
                <Text style={styles.calcTotalValue}>{governanceWeight.effectiveVotingPower}x</Text>
              </View>
              <View style={styles.nonLinearNote}>
                <Info size={12} color={Colors.textMuted} />
                <Text style={styles.nonLinearText}>
                  Uses non-linear (√) scaling for fair representation
                </Text>
              </View>
            </View>
          )}

          {onLearnMore && (
            <TouchableOpacity style={styles.learnMoreButton} onPress={onLearnMore}>
              <Text style={styles.learnMoreText}>Learn how scores are calculated</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

interface ComponentRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  description: string;
}

function ComponentRow({ icon, label, value, description }: ComponentRowProps) {
  return (
    <View style={styles.componentRow}>
      <View style={styles.componentIcon}>{icon}</View>
      <View style={styles.componentInfo}>
        <View style={styles.componentHeader}>
          <Text style={styles.componentLabel}>{label}</Text>
          <Text style={styles.componentValue}>{value}</Text>
        </View>
        <Text style={styles.componentDesc}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  compactScores: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  compactScoreItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  compactIcon: {
    width: 24,
    height: 24,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactValue: {
    fontSize: 16,
    fontWeight: '700' as const,
  },
  compactDivider: {
    width: 1,
    height: 20,
    backgroundColor: Colors.border,
  },
  compactWeight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  compactWeightText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.golden + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  headerRight: {},
  scoresRow: {
    flexDirection: 'row',
    gap: 12,
  },
  scoreCard: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
  },
  scoreIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 32,
    fontWeight: '800' as const,
  },
  scoreLabel: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.text,
    marginTop: 4,
  },
  scoreBarBg: {
    width: '100%',
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    marginTop: 10,
    overflow: 'hidden',
  },
  scoreBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  scoreDesc: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 6,
  },
  influenceRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  influenceCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    padding: 12,
  },
  influenceInfo: {
    flex: 1,
  },
  influenceLabel: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  influenceValue: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.text,
    marginTop: 2,
  },
  expandedContent: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  breakdownSection: {
    marginBottom: 20,
  },
  breakdownTitle: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 12,
  },
  componentsList: {
    gap: 10,
  },
  componentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 10,
    padding: 10,
  },
  componentIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  componentInfo: {
    flex: 1,
  },
  componentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  componentLabel: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  componentValue: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  componentDesc: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  governanceDetail: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  calculationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  calcLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  calcValue: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  calculationTotal: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    marginTop: 8,
    paddingTop: 10,
  },
  calcTotalLabel: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  calcTotalValue: {
    fontSize: 16,
    fontWeight: '800' as const,
    color: Colors.primary,
  },
  nonLinearNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  nonLinearText: {
    flex: 1,
    fontSize: 11,
    color: Colors.textMuted,
  },
  learnMoreButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  learnMoreText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
});
