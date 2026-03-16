import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  BookOpen,
  MapPin,
  Users,
  UserCheck,
  Shield,
  Info,
} from 'lucide-react-native';
import Colors from '@/constants/colors';

export type KnowledgeType = 'peer_reviewed' | 'field_reported' | 'community_sourced' | 'expert_opinion' | 'expert_observation';

interface KnowledgeTypeBadgeProps {
  type: KnowledgeType;
  variant?: 'badge' | 'full' | 'compact';
  showDescription?: boolean;
  onPress?: () => void;
}

const typeConfig: Record<KnowledgeType, {
  label: string;
  shortLabel: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  trustLevel: 'highest' | 'high' | 'medium';
}> = {
  peer_reviewed: {
    label: 'Peer-Reviewed Research',
    shortLabel: 'Peer-Reviewed',
    description: 'Published or validated by academic peer review process',
    icon: <BookOpen size={14} color="#4CAF50" />,
    color: '#4CAF50',
    trustLevel: 'highest',
  },
  field_reported: {
    label: 'Field-Reported Knowledge',
    shortLabel: 'Field Report',
    description: 'Direct observations from field workers and local monitors',
    icon: <MapPin size={14} color={Colors.primary} />,
    color: Colors.primary,
    trustLevel: 'high',
  },
  community_sourced: {
    label: 'Community-Sourced Data',
    shortLabel: 'Community Data',
    description: 'Aggregated knowledge from local community members',
    icon: <Users size={14} color={Colors.accent} />,
    color: Colors.accent,
    trustLevel: 'medium',
  },
  expert_opinion: {
    label: 'Expert Opinion',
    shortLabel: 'Expert',
    description: 'Professional insights from domain experts',
    icon: <UserCheck size={14} color="#9C27B0" />,
    color: '#9C27B0',
    trustLevel: 'high',
  },
  expert_observation: {
    label: 'Expert Observation',
    shortLabel: 'Expert Obs.',
    description: 'Field observations documented by trained professionals',
    icon: <UserCheck size={14} color="#FF9800" />,
    color: '#FF9800',
    trustLevel: 'high',
  },
};

const trustLevelConfig = {
  highest: { label: 'Highest Trust', color: '#4CAF50' },
  high: { label: 'High Trust', color: Colors.primary },
  medium: { label: 'Medium Trust', color: Colors.accent },
};

export default function KnowledgeTypeBadge({
  type,
  variant = 'badge',
  showDescription = false,
  onPress,
}: KnowledgeTypeBadgeProps) {
  const config = typeConfig[type];

  if (!config) {
    return null;
  }

  if (variant === 'compact') {
    return (
      <View style={[styles.compactBadge, { backgroundColor: config.color + '20' }]}>
        {config.icon}
        <Text style={[styles.compactText, { color: config.color }]}>
          {config.shortLabel}
        </Text>
      </View>
    );
  }

  if (variant === 'badge') {
    const Wrapper = onPress ? TouchableOpacity : View;
    return (
      <Wrapper
        style={[styles.badge, { backgroundColor: config.color + '20', borderColor: config.color + '40' }]}
        onPress={onPress}
        activeOpacity={onPress ? 0.7 : 1}
      >
        {config.icon}
        <Text style={[styles.badgeText, { color: config.color }]}>
          {config.shortLabel}
        </Text>
      </Wrapper>
    );
  }

  const trustLevel = trustLevelConfig[config.trustLevel];

  return (
    <TouchableOpacity
      style={styles.fullContainer}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}
    >
      <View style={styles.fullHeader}>
        <View style={[styles.fullIconWrapper, { backgroundColor: config.color + '20' }]}>
          {config.icon}
        </View>
        <View style={styles.fullInfo}>
          <Text style={styles.fullLabel}>{config.label}</Text>
          <View style={styles.trustRow}>
            <Shield size={12} color={trustLevel.color} />
            <Text style={[styles.trustText, { color: trustLevel.color }]}>
              {trustLevel.label}
            </Text>
          </View>
        </View>
        <Info size={16} color={Colors.textMuted} />
      </View>
      {showDescription && (
        <Text style={styles.fullDescription}>{config.description}</Text>
      )}
    </TouchableOpacity>
  );
}

interface KnowledgeTypeLegendProps {
  highlightType?: KnowledgeType;
}

export function KnowledgeTypeLegend({ highlightType }: KnowledgeTypeLegendProps) {
  return (
    <View style={styles.legendContainer}>
      <Text style={styles.legendTitle}>Knowledge Source Types</Text>
      <Text style={styles.legendSubtitle}>
        Content is categorized by source and verification level
      </Text>
      <View style={styles.legendItems}>
        {(Object.entries(typeConfig) as [KnowledgeType, typeof typeConfig[KnowledgeType]][]).map(([key, config]) => {
          const trustLevel = trustLevelConfig[config.trustLevel];
          const isHighlighted = highlightType === key;

          return (
            <View
              key={key}
              style={[
                styles.legendItem,
                isHighlighted && styles.legendItemHighlighted,
                isHighlighted && { borderColor: config.color },
              ]}
            >
              <View style={[styles.legendIcon, { backgroundColor: config.color + '20' }]}>
                {config.icon}
              </View>
              <View style={styles.legendContent}>
                <Text style={styles.legendLabel}>{config.label}</Text>
                <Text style={styles.legendDesc}>{config.description}</Text>
                <View style={styles.legendTrust}>
                  <Shield size={10} color={trustLevel.color} />
                  <Text style={[styles.legendTrustText, { color: trustLevel.color }]}>
                    {trustLevel.label}
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>
      <View style={styles.transparencyNote}>
        <Info size={14} color={Colors.textMuted} />
        <Text style={styles.transparencyText}>
          NexTerra respects local data ownership. Community-sourced knowledge is shared with explicit consent and attribution.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  compactBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  compactText: {
    fontSize: 10,
    fontWeight: '600' as const,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  fullContainer: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  fullHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  fullIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullInfo: {
    flex: 1,
  },
  fullLabel: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  trustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trustText: {
    fontSize: 11,
    fontWeight: '600' as const,
  },
  fullDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  legendContainer: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  legendSubtitle: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 16,
  },
  legendItems: {
    gap: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    padding: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  legendItemHighlighted: {
    backgroundColor: Colors.cardElevated,
    borderWidth: 2,
  },
  legendIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  legendContent: {
    flex: 1,
  },
  legendLabel: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 2,
  },
  legendDesc: {
    fontSize: 11,
    color: Colors.textSecondary,
    lineHeight: 16,
    marginBottom: 6,
  },
  legendTrust: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendTrustText: {
    fontSize: 10,
    fontWeight: '600' as const,
  },
  transparencyNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: Colors.primary + '10',
    padding: 12,
    borderRadius: 10,
    marginTop: 16,
  },
  transparencyText: {
    flex: 1,
    fontSize: 11,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
});
