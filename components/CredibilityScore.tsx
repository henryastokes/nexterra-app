import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Shield, TrendingUp, Award, FileCheck, Users, Target } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { CredibilityMetric } from '@/mocks/userProfile';

interface CredibilityScoreProps {
  score: number;
  metrics: CredibilityMetric[];
  showBreakdown?: boolean;
}

const getMetricIcon = (id: string) => {
  switch (id) {
    case 'funded_work':
      return <Award size={16} color={Colors.accent} />;
    case 'dao_participation':
      return <Users size={16} color={Colors.primary} />;
    case 'reporting':
      return <FileCheck size={16} color={Colors.success} />;
    case 'peer_reviews':
      return <TrendingUp size={16} color={Colors.clay} />;
    case 'outcomes':
      return <Target size={16} color={Colors.primaryDim} />;
    default:
      return <Shield size={16} color={Colors.textSecondary} />;
  }
};

const getScoreColor = (score: number) => {
  if (score >= 90) return Colors.success;
  if (score >= 75) return Colors.primary;
  if (score >= 60) return Colors.accent;
  return Colors.warning;
};

export default function CredibilityScore({ score, metrics, showBreakdown = true }: CredibilityScoreProps) {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const progressAnims = useRef(metrics.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: false,
    }).start();

    metrics.forEach((metric, index) => {
      Animated.timing(progressAnims[index], {
        toValue: metric.score / metric.maxScore,
        duration: 800,
        delay: 300 + index * 100,
        useNativeDriver: false,
      }).start();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scoreColor = getScoreColor(score);

  return (
    <View style={styles.container}>
      <View style={styles.mainScoreContainer}>
        <View style={styles.scoreCircle}>
          <View style={[styles.scoreCircleInner, { borderColor: scoreColor }]}>
            <Shield size={24} color={scoreColor} />
            <Animated.Text style={[styles.scoreValue, { color: scoreColor }]}>
              {score}
            </Animated.Text>
            <Text style={styles.scoreLabel}>Credibility</Text>
          </View>
        </View>
        <View style={styles.scoreInfo}>
          <Text style={styles.scoreTitle}>AI-Calculated Trust Score</Text>
          <Text style={styles.scoreDescription}>
            Based on your funding history, DAO participation, reporting compliance, peer reviews, and real-world impact.
          </Text>
          <View style={styles.scoreBadge}>
            <Text style={[styles.scoreBadgeText, { color: scoreColor }]}>
              {score >= 90 ? 'Excellent' : score >= 75 ? 'Very Good' : score >= 60 ? 'Good' : 'Building'}
            </Text>
          </View>
        </View>
      </View>

      {showBreakdown && (
        <View style={styles.breakdown}>
          <Text style={styles.breakdownTitle}>Score Breakdown</Text>
          {metrics.map((metric, index) => (
            <View key={metric.id} style={styles.metricRow}>
              <View style={styles.metricHeader}>
                {getMetricIcon(metric.id)}
                <Text style={styles.metricLabel}>{metric.label}</Text>
                <Text style={styles.metricScore}>{metric.score}/{metric.maxScore}</Text>
              </View>
              <View style={styles.progressBarBg}>
                <Animated.View
                  style={[
                    styles.progressBarFill,
                    {
                      backgroundColor: getScoreColor(metric.score),
                      width: progressAnims[index].interpolate({
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
  scoreTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 6,
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
  metricScore: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: Colors.textSecondary,
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
