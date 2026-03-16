import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  Sparkles,
  Brain,
  TrendingUp,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Target,
  Clock,
  Link2,
} from 'lucide-react-native';
import Colors from '@/constants/colors';

interface DetectedPattern {
  type: 'regional' | 'temporal' | 'topic' | 'cross-domain' | 'outbreak' | 'climate';
  description: string;
  confidence: number;
  relatedPostIds?: string[];
  alertLevel?: 'info' | 'warning' | 'critical';
}

interface AIAnalysisData {
  summary: string;
  keyInsights: string[];
  detectedPatterns?: DetectedPattern[];
  signalStrength: 'high' | 'medium' | 'low';
  governanceRelevance: number;
  suggestedActions?: string[];
  lastAnalyzedAt: string;
}

interface AIInsightsProps {
  analysis: AIAnalysisData;
  variant?: 'compact' | 'full';
  showPatterns?: boolean;
}

const getPatternIcon = (type: string) => {
  switch (type) {
    case 'regional':
      return <TrendingUp size={14} color={Colors.primary} />;
    case 'temporal':
      return <Clock size={14} color={Colors.accent} />;
    case 'topic':
      return <Lightbulb size={14} color="#FF9800" />;
    case 'cross-domain':
      return <Link2 size={14} color="#9C27B0" />;
    case 'outbreak':
      return <AlertTriangle size={14} color="#F44336" />;
    case 'climate':
      return <TrendingUp size={14} color="#4CAF50" />;
    default:
      return <Brain size={14} color={Colors.textMuted} />;
  }
};

const getAlertColor = (level?: string) => {
  switch (level) {
    case 'critical':
      return '#F44336';
    case 'warning':
      return '#FF9800';
    default:
      return Colors.primary;
  }
};

const getSignalColor = (strength: string) => {
  switch (strength) {
    case 'high':
      return Colors.success;
    case 'medium':
      return Colors.accent;
    default:
      return Colors.textMuted;
  }
};

export default function AIInsights({ analysis, variant = 'full', showPatterns = true }: AIInsightsProps) {
  const [isExpanded, setIsExpanded] = useState(variant === 'full');

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays}d ago`;
  };

  if (variant === 'compact') {
    return (
      <TouchableOpacity
        style={styles.compactContainer}
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.7}
      >
        <View style={styles.compactHeader}>
          <View style={styles.aiLabel}>
            <Sparkles size={14} color={Colors.primary} />
            <Text style={styles.aiLabelText}>AI Analysis</Text>
          </View>
          <View style={styles.compactMeta}>
            <View style={[styles.signalBadge, { backgroundColor: getSignalColor(analysis.signalStrength) + '20' }]}>
              <View style={[styles.signalDot, { backgroundColor: getSignalColor(analysis.signalStrength) }]} />
              <Text style={[styles.signalText, { color: getSignalColor(analysis.signalStrength) }]}>
                {analysis.signalStrength.charAt(0).toUpperCase() + analysis.signalStrength.slice(1)} Signal
              </Text>
            </View>
            {isExpanded ? (
              <ChevronUp size={16} color={Colors.textMuted} />
            ) : (
              <ChevronDown size={16} color={Colors.textMuted} />
            )}
          </View>
        </View>

        {!isExpanded && (
          <Text style={styles.compactSummary} numberOfLines={2}>
            {analysis.summary}
          </Text>
        )}

        {isExpanded && (
          <View style={styles.expandedContent}>
            <Text style={styles.summaryText}>{analysis.summary}</Text>

            {analysis.keyInsights.length > 0 && (
              <View style={styles.insightsSection}>
                <Text style={styles.sectionLabel}>Key Insights</Text>
                {analysis.keyInsights.map((insight, index) => (
                  <View key={index} style={styles.insightRow}>
                    <Lightbulb size={12} color={Colors.accent} />
                    <Text style={styles.insightText}>{insight}</Text>
                  </View>
                ))}
              </View>
            )}

            {showPatterns && analysis.detectedPatterns && analysis.detectedPatterns.length > 0 && (
              <View style={styles.patternsSection}>
                <Text style={styles.sectionLabel}>Detected Patterns</Text>
                {analysis.detectedPatterns.map((pattern, index) => (
                  <View
                    key={index}
                    style={[
                      styles.patternCard,
                      pattern.alertLevel && {
                        borderLeftColor: getAlertColor(pattern.alertLevel),
                        borderLeftWidth: 3,
                      },
                    ]}
                  >
                    <View style={styles.patternHeader}>
                      {getPatternIcon(pattern.type)}
                      <Text style={styles.patternType}>
                        {pattern.type.replace('_', ' ').replace('-', ' ').toUpperCase()}
                      </Text>
                      <View style={styles.confidenceBadge}>
                        <Text style={styles.confidenceText}>{Math.round(pattern.confidence * 100)}%</Text>
                      </View>
                    </View>
                    <Text style={styles.patternDescription}>{pattern.description}</Text>
                  </View>
                ))}
              </View>
            )}

            <View style={styles.metaRow}>
              <Text style={styles.metaText}>
                Governance Relevance: {analysis.governanceRelevance}%
              </Text>
              <Text style={styles.metaText}>
                Updated {formatTimeAgo(analysis.lastAnalyzedAt)}
              </Text>
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.aiIconWrapper}>
            <Sparkles size={18} color={Colors.background} />
          </View>
          <View>
            <Text style={styles.headerTitle}>AI Analysis</Text>
            <Text style={styles.headerSubtitle}>
              Updated {formatTimeAgo(analysis.lastAnalyzedAt)}
            </Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <View style={[styles.signalBadgeLarge, { backgroundColor: getSignalColor(analysis.signalStrength) + '20' }]}>
            <View style={[styles.signalDotLarge, { backgroundColor: getSignalColor(analysis.signalStrength) }]} />
            <Text style={[styles.signalTextLarge, { color: getSignalColor(analysis.signalStrength) }]}>
              {analysis.signalStrength.charAt(0).toUpperCase() + analysis.signalStrength.slice(1)} Signal
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.summarySection}>
        <Text style={styles.summaryLabel}>Summary</Text>
        <Text style={styles.summaryTextFull}>{analysis.summary}</Text>
      </View>

      {analysis.keyInsights.length > 0 && (
        <View style={styles.insightsSectionFull}>
          <Text style={styles.sectionLabelFull}>Key Insights</Text>
          {analysis.keyInsights.map((insight, index) => (
            <View key={index} style={styles.insightRowFull}>
              <View style={styles.insightBullet}>
                <Lightbulb size={14} color={Colors.accent} />
              </View>
              <Text style={styles.insightTextFull}>{insight}</Text>
            </View>
          ))}
        </View>
      )}

      {showPatterns && analysis.detectedPatterns && analysis.detectedPatterns.length > 0 && (
        <View style={styles.patternsSectionFull}>
          <Text style={styles.sectionLabelFull}>
            <Brain size={14} color={Colors.text} /> Pattern Detection
          </Text>
          {analysis.detectedPatterns.map((pattern, index) => (
            <View
              key={index}
              style={[
                styles.patternCardFull,
                pattern.alertLevel && {
                  borderLeftColor: getAlertColor(pattern.alertLevel),
                  borderLeftWidth: 4,
                },
              ]}
            >
              <View style={styles.patternHeaderFull}>
                <View style={styles.patternTypeWrapper}>
                  {getPatternIcon(pattern.type)}
                  <Text style={styles.patternTypeFull}>
                    {pattern.type.replace('_', ' ').replace('-', ' ')}
                  </Text>
                </View>
                <View style={styles.confidenceBadgeFull}>
                  <Target size={10} color={Colors.textMuted} />
                  <Text style={styles.confidenceTextFull}>{Math.round(pattern.confidence * 100)}% confidence</Text>
                </View>
              </View>
              <Text style={styles.patternDescriptionFull}>{pattern.description}</Text>
              {pattern.alertLevel && (
                <View style={[styles.alertBadge, { backgroundColor: getAlertColor(pattern.alertLevel) + '20' }]}>
                  <AlertTriangle size={12} color={getAlertColor(pattern.alertLevel)} />
                  <Text style={[styles.alertText, { color: getAlertColor(pattern.alertLevel) }]}>
                    {pattern.alertLevel.charAt(0).toUpperCase() + pattern.alertLevel.slice(1)} Alert
                  </Text>
                </View>
              )}
            </View>
          ))}
        </View>
      )}

      {analysis.suggestedActions && analysis.suggestedActions.length > 0 && (
        <View style={styles.actionsSection}>
          <Text style={styles.sectionLabelFull}>Suggested Actions</Text>
          {analysis.suggestedActions.map((action, index) => (
            <View key={index} style={styles.actionRow}>
              <View style={styles.actionNumber}>
                <Text style={styles.actionNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.actionText}>{action}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.footer}>
        <View style={styles.governanceScore}>
          <Text style={styles.governanceLabel}>Governance Relevance</Text>
          <View style={styles.governanceBar}>
            <View style={[styles.governanceFill, { width: `${analysis.governanceRelevance}%` }]} />
          </View>
          <Text style={styles.governanceValue}>{analysis.governanceRelevance}%</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.primary + '40',
  },
  compactContainer: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.primary + '30',
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
    gap: 10,
  },
  aiIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  headerRight: {},
  compactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  aiLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  aiLabelText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  compactMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  signalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  signalBadgeLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  signalDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  signalDotLarge: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  signalText: {
    fontSize: 10,
    fontWeight: '600' as const,
  },
  signalTextLarge: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  compactSummary: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  expandedContent: {
    marginTop: 8,
  },
  summarySection: {
    marginBottom: 16,
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: Colors.textMuted,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  summaryText: {
    fontSize: 13,
    color: Colors.text,
    lineHeight: 20,
  },
  summaryTextFull: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 22,
  },
  insightsSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  insightsSectionFull: {
    marginBottom: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: Colors.textMuted,
    marginBottom: 8,
  },
  sectionLabelFull: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 12,
  },
  insightRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 6,
  },
  insightRowFull: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 10,
  },
  insightBullet: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.accent + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightText: {
    flex: 1,
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  insightTextFull: {
    flex: 1,
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  patternsSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  patternsSectionFull: {
    marginBottom: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  patternCard: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  patternCardFull: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  patternHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  patternHeaderFull: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  patternTypeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  patternType: {
    fontSize: 9,
    fontWeight: '700' as const,
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
  patternTypeFull: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.text,
    textTransform: 'capitalize',
  },
  confidenceBadge: {
    backgroundColor: Colors.background,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 'auto',
  },
  confidenceBadgeFull: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  confidenceText: {
    fontSize: 9,
    fontWeight: '600' as const,
    color: Colors.textMuted,
  },
  confidenceTextFull: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  patternDescription: {
    fontSize: 11,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  patternDescriptionFull: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  alertBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 8,
  },
  alertText: {
    fontSize: 10,
    fontWeight: '600' as const,
  },
  actionsSection: {
    marginBottom: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 10,
  },
  actionNumber: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionNumberText: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: Colors.background,
  },
  actionText: {
    flex: 1,
    fontSize: 13,
    color: Colors.text,
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  metaText: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  footer: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  governanceScore: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  governanceLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
  },
  governanceBar: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 3,
    overflow: 'hidden',
  },
  governanceFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  governanceValue: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
});
