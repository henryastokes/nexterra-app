import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { 
  Globe, 
  MapPin, 
  FileText, 
  Link2, 
  Users, 
  TrendingUp,
  Zap 
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { FieldContribution } from '@/mocks/trustImpact';

interface ImpactMetric {
  id: string;
  label: string;
  value: number;
  maxValue: number;
  description: string;
}

interface ImpactScoreProps {
  score: number;
  fieldContribution: FieldContribution;
  showBreakdown?: boolean;
  compact?: boolean;
}

const getMetricIcon = (id: string) => {
  switch (id) {
    case 'verified_posts':
      return <MapPin size={16} color={Colors.accent} />;
    case 'usefulness':
      return <TrendingUp size={16} color={Colors.primary} />;
    case 'citations':
      return <FileText size={16} color={Colors.golden} />;
    case 'implementations':
      return <Link2 size={16} color={Colors.success} />;
    case 'community_impact':
      return <Users size={16} color={Colors.clay} />;
    default:
      return <Globe size={16} color={Colors.textSecondary} />;
  }
};

const getScoreColor = (score: number) => {
  if (score >= 85) return Colors.success;
  if (score >= 70) return Colors.primary;
  if (score >= 50) return Colors.accent;
  return Colors.golden;
};

const getScoreLabel = (score: number) => {
  if (score >= 90) return 'Exceptional';
  if (score >= 75) return 'High Impact';
  if (score >= 60) return 'Growing';
  if (score >= 40) return 'Emerging';
  return 'Building';
};

export default function ImpactScore({ 
  score, 
  fieldContribution, 
  showBreakdown = true,
  compact = false 
}: ImpactScoreProps) {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const progressAnims = useRef<Animated.Value[]>([]);

  const metrics: ImpactMetric[] = [
    {
      id: 'verified_posts',
      label: 'Verified Field Posts',
      value: fieldContribution.verifiedFieldPosts,
      maxValue: 30,
      description: `${fieldContribution.verifiedFieldPosts} geo-tagged field contributions`,
    },
    {
      id: 'usefulness',
      label: 'Usefulness Rating',
      value: fieldContribution.usefulnessRating * 20,
      maxValue: 100,
      description: `${fieldContribution.usefulnessRating}/5 average rating`,
    },
    {
      id: 'citations',
      label: 'Proposal Citations',
      value: fieldContribution.citationsInProposals,
      maxValue: 20,
      description: `Referenced in ${fieldContribution.citationsInProposals} proposals`,
    },
    {
      id: 'implementations',
      label: 'Implementation Links',
      value: fieldContribution.implementationLinks,
      maxValue: 10,
      description: `${fieldContribution.implementationLinks} real-world deployments`,
    },
    {
      id: 'community_impact',
      label: 'Community Impact',
      value: fieldContribution.communityImpactScore,
      maxValue: 100,
      description: `Score: ${fieldContribution.communityImpactScore}/100`,
    },
  ];

  if (progressAnims.current.length !== metrics.length) {
    progressAnims.current = metrics.map(() => new Animated.Value(0));
  }

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: false,
    }).start();

    metrics.forEach((metric, index) => {
      Animated.timing(progressAnims.current[index], {
        toValue: Math.min(metric.value / metric.maxValue, 1),
        duration: 800,
        delay: 300 + index * 100,
        useNativeDriver: false,
      }).start();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scoreColor = getScoreColor(score);

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <View style={[styles.compactBadge, { borderColor: scoreColor }]}>
          <Globe size={14} color={scoreColor} />
          <Text style={[styles.compactScore, { color: scoreColor }]}>{score}</Text>
        </View>
        <Text style={styles.compactLabel}>Impact</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.mainScoreContainer}>
        <View style={styles.scoreCircle}>
          <View style={[styles.scoreCircleInner, { borderColor: scoreColor }]}>
            <Globe size={24} color={scoreColor} />
            <Animated.Text style={[styles.scoreValue, { color: scoreColor }]}>
              {score}
            </Animated.Text>
            <Text style={styles.scoreLabel}>Impact</Text>
          </View>
        </View>
        <View style={styles.scoreInfo}>
          <View style={styles.scoreTitleRow}>
            <Text style={styles.scoreTitle}>Real-World Impact Score</Text>
            <Zap size={16} color={scoreColor} />
          </View>
          <Text style={styles.scoreDescription}>
            Measures your tangible contributions: field work, implementations, community benefit, and proposal influence.
          </Text>
          <View style={styles.scoreBadge}>
            <Text style={[styles.scoreBadgeText, { color: scoreColor }]}>
              {getScoreLabel(score)}
            </Text>
          </View>
        </View>
      </View>

      {showBreakdown && (
        <View style={styles.breakdown}>
          <Text style={styles.breakdownTitle}>Impact Breakdown</Text>
          {metrics.map((metric, index) => (
            <View key={metric.id} style={styles.metricRow}>
              <View style={styles.metricHeader}>
                {getMetricIcon(metric.id)}
                <Text style={styles.metricLabel}>{metric.label}</Text>
              </View>
              <View style={styles.progressBarBg}>
                <Animated.View
                  style={[
                    styles.progressBarFill,
                    {
                      backgroundColor: getScoreColor((metric.value / metric.maxValue) * 100),
                      width: progressAnims.current[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0%', '100%'],
                      }),
                    },
                  ]}
                />
              </View>
              <Text style={styles.metricDescription}>{metric.description}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  compactContainer: {
    alignItems: 'center',
    gap: 4,
  },
  compactBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 2,
    backgroundColor: Colors.backgroundSecondary,
  },
  compactScore: {
    fontSize: 18,
    fontWeight: '800' as const,
  },
  compactLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '600' as const,
  },
  mainScoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  scoreCircle: {
    width: 100,
    height: 100,
  },
  scoreCircleInner: {
    flex: 1,
    borderRadius: 50,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.backgroundSecondary,
  },
  scoreValue: {
    fontSize: 28,
    fontWeight: '800' as const,
    marginTop: 2,
  },
  scoreLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: '600' as const,
  },
  scoreInfo: {
    flex: 1,
  },
  scoreTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  scoreTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  scoreDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  scoreBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 8,
  },
  scoreBadgeText: {
    fontSize: 12,
    fontWeight: '700' as const,
  },
  breakdown: {
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  breakdownTitle: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 16,
  },
  metricRow: {
    marginBottom: 16,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  metricLabel: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  metricDescription: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 6,
  },
});
