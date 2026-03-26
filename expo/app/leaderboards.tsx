import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Trophy,
  DollarSign,
  GraduationCap,
  Hammer,
  Building2,
  MapPin,
  TrendingUp,
  ChevronDown,
  Info,
  Target,
  CheckCircle,
  Globe,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import {
  TimePeriod,
  timePeriodLabels,
  funderLeaderboard,
  researcherLeaderboard,
  practitionerLeaderboard,
  institutionLeaderboard,
  leaderboardMetricDescriptions,
  FunderEntry,
  ResearcherEntry,
  PractitionerEntry,
  InstitutionEntry,
} from '@/mocks/leaderboards';

type LeaderboardCategory = 'funders' | 'researchers' | 'practitioners' | 'institutions';

const categoryConfig = {
  funders: {
    label: 'Funders',
    icon: DollarSign,
    color: '#10B981',
    data: funderLeaderboard,
  },
  researchers: {
    label: 'Researchers',
    icon: GraduationCap,
    color: '#3B82F6',
    data: researcherLeaderboard,
  },
  practitioners: {
    label: 'Practitioners',
    icon: Hammer,
    color: '#F59E0B',
    data: practitionerLeaderboard,
  },
  institutions: {
    label: 'Institutions',
    icon: Building2,
    color: '#8B5CF6',
    data: institutionLeaderboard,
  },
};

export default function LeaderboardsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeCategory, setActiveCategory] = useState<LeaderboardCategory>('funders');
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('all_time');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showMetricInfo, setShowMetricInfo] = useState(false);

  const currentConfig = categoryConfig[activeCategory];
  const currentMetric = leaderboardMetricDescriptions[activeCategory];

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount}`;
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return { backgroundColor: '#FFD700', borderColor: '#DAA520' };
      case 2:
        return { backgroundColor: '#C0C0C0', borderColor: '#A9A9A9' };
      case 3:
        return { backgroundColor: '#CD7F32', borderColor: '#8B4513' };
      default:
        return { backgroundColor: Colors.backgroundSecondary, borderColor: Colors.border };
    }
  };

  const renderFunderCard = (entry: FunderEntry, index: number) => (
    <TouchableOpacity
      key={entry.id}
      style={[styles.leaderCard, index < 3 && styles.topThreeCard]}
      activeOpacity={0.7}
      testID={`funder-${entry.id}`}
    >
      <View style={[styles.rankBadge, getRankStyle(entry.rank)]}>
        {entry.rank <= 3 ? (
          <Trophy size={14} color={entry.rank === 1 ? '#8B4513' : '#FFF'} />
        ) : (
          <Text style={styles.rankText}>{entry.rank}</Text>
        )}
      </View>
      <Image source={{ uri: entry.avatar }} style={styles.avatar} />
      <View style={styles.cardContent}>
        <Text style={styles.entryName} numberOfLines={1}>{entry.name}</Text>
        {entry.affiliation && (
          <Text style={styles.entryAffiliation} numberOfLines={1}>{entry.affiliation}</Text>
        )}
        <View style={styles.locationRow}>
          <MapPin size={10} color={Colors.textMuted} />
          <Text style={styles.locationText}>{entry.country}</Text>
        </View>
      </View>
      <View style={styles.metricContainer}>
        <Text style={[styles.metricValue, { color: currentConfig.color }]}>
          {formatCurrency(entry.totalCapitalDeployed)}
        </Text>
        <Text style={styles.metricLabel}>{entry.projectsFunded} projects</Text>
      </View>
    </TouchableOpacity>
  );

  const renderResearcherCard = (entry: ResearcherEntry, index: number) => (
    <TouchableOpacity
      key={entry.id}
      style={[styles.leaderCard, index < 3 && styles.topThreeCard]}
      activeOpacity={0.7}
      testID={`researcher-${entry.id}`}
    >
      <View style={[styles.rankBadge, getRankStyle(entry.rank)]}>
        {entry.rank <= 3 ? (
          <Trophy size={14} color={entry.rank === 1 ? '#8B4513' : '#FFF'} />
        ) : (
          <Text style={styles.rankText}>{entry.rank}</Text>
        )}
      </View>
      <Image source={{ uri: entry.avatar }} style={styles.avatar} />
      <View style={styles.cardContent}>
        <Text style={styles.entryName} numberOfLines={1}>{entry.name}</Text>
        {entry.affiliation && (
          <Text style={styles.entryAffiliation} numberOfLines={1}>{entry.affiliation}</Text>
        )}
        <View style={styles.locationRow}>
          <MapPin size={10} color={Colors.textMuted} />
          <Text style={styles.locationText}>{entry.country}</Text>
        </View>
      </View>
      <View style={styles.metricContainer}>
        <View style={styles.metricRow}>
          <CheckCircle size={14} color={currentConfig.color} />
          <Text style={[styles.metricValue, { color: currentConfig.color }]}>
            {entry.completedDAOs}
          </Text>
        </View>
        <Text style={styles.metricLabel}>Avg Impact: {entry.avgImpactScore}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderPractitionerCard = (entry: PractitionerEntry, index: number) => (
    <TouchableOpacity
      key={entry.id}
      style={[styles.leaderCard, index < 3 && styles.topThreeCard]}
      activeOpacity={0.7}
      testID={`practitioner-${entry.id}`}
    >
      <View style={[styles.rankBadge, getRankStyle(entry.rank)]}>
        {entry.rank <= 3 ? (
          <Trophy size={14} color={entry.rank === 1 ? '#8B4513' : '#FFF'} />
        ) : (
          <Text style={styles.rankText}>{entry.rank}</Text>
        )}
      </View>
      <Image source={{ uri: entry.avatar }} style={styles.avatar} />
      <View style={styles.cardContent}>
        <Text style={styles.entryName} numberOfLines={1}>{entry.name}</Text>
        {entry.affiliation && (
          <Text style={styles.entryAffiliation} numberOfLines={1}>{entry.affiliation}</Text>
        )}
        <View style={styles.locationRow}>
          <MapPin size={10} color={Colors.textMuted} />
          <Text style={styles.locationText}>{entry.country}</Text>
        </View>
      </View>
      <View style={styles.metricContainer}>
        <View style={styles.metricRow}>
          <Target size={14} color={currentConfig.color} />
          <Text style={[styles.metricValue, { color: currentConfig.color }]}>
            {entry.verifiedMilestones}
          </Text>
        </View>
        <Text style={styles.metricLabel}>{entry.implementationRate}% success</Text>
      </View>
    </TouchableOpacity>
  );

  const renderInstitutionCard = (entry: InstitutionEntry, index: number) => (
    <TouchableOpacity
      key={entry.id}
      style={[styles.leaderCard, index < 3 && styles.topThreeCard]}
      activeOpacity={0.7}
      testID={`institution-${entry.id}`}
    >
      <View style={[styles.rankBadge, getRankStyle(entry.rank)]}>
        {entry.rank <= 3 ? (
          <Trophy size={14} color={entry.rank === 1 ? '#8B4513' : '#FFF'} />
        ) : (
          <Text style={styles.rankText}>{entry.rank}</Text>
        )}
      </View>
      <Image source={{ uri: entry.avatar }} style={styles.avatar} />
      <View style={styles.cardContent}>
        <Text style={styles.entryName} numberOfLines={1}>{entry.name}</Text>
        <View style={styles.locationRow}>
          <MapPin size={10} color={Colors.textMuted} />
          <Text style={styles.locationText}>{entry.country}</Text>
        </View>
        <View style={styles.statsRow}>
          <Globe size={10} color={Colors.textMuted} />
          <Text style={styles.statsText}>{entry.countriesReached} countries</Text>
        </View>
      </View>
      <View style={styles.metricContainer}>
        <View style={styles.metricRow}>
          <TrendingUp size={14} color={currentConfig.color} />
          <Text style={[styles.metricValue, { color: currentConfig.color }]}>
            {entry.impactFootprint}
          </Text>
        </View>
        <Text style={styles.metricLabel}>{entry.daosParticipated} DAOs</Text>
      </View>
    </TouchableOpacity>
  );

  const renderLeaderboardContent = () => {
    switch (activeCategory) {
      case 'funders':
        return funderLeaderboard.map((entry, index) => renderFunderCard(entry, index));
      case 'researchers':
        return researcherLeaderboard.map((entry, index) => renderResearcherCard(entry, index));
      case 'practitioners':
        return practitionerLeaderboard.map((entry, index) => renderPractitionerCard(entry, index));
      case 'institutions':
        return institutionLeaderboard.map((entry, index) => renderInstitutionCard(entry, index));
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          testID="back-button"
        >
          <ArrowLeft size={22} color={Colors.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Trophy size={20} color={Colors.accent} />
          <Text style={styles.headerTitle}>Leaderboards</Text>
        </View>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.categoryTabs}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContent}>
          {(Object.keys(categoryConfig) as LeaderboardCategory[]).map((category) => {
            const config = categoryConfig[category];
            const IconComponent = config.icon;
            const isActive = activeCategory === category;
            return (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryTab,
                  isActive && { backgroundColor: config.color },
                ]}
                onPress={() => setActiveCategory(category)}
                activeOpacity={0.7}
              >
                <IconComponent size={16} color={isActive ? '#FFF' : Colors.textSecondary} />
                <Text style={[styles.categoryTabText, isActive && styles.categoryTabTextActive]}>
                  {config.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.metricInfoBar}>
        <View style={styles.metricInfoLeft}>
          <Text style={styles.metricTitle}>{currentMetric.metric}</Text>
          <TouchableOpacity onPress={() => setShowMetricInfo(!showMetricInfo)}>
            <Info size={14} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.timePeriodButton}
          onPress={() => setShowTimePicker(!showTimePicker)}
        >
          <Text style={styles.timePeriodText}>{timePeriodLabels[timePeriod]}</Text>
          <ChevronDown size={14} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {showMetricInfo && (
        <View style={styles.metricDescriptionBox}>
          <Text style={styles.metricDescriptionText}>{currentMetric.description}</Text>
          <Text style={styles.metricUnitText}>Unit: {currentMetric.unit}</Text>
        </View>
      )}

      {showTimePicker && (
        <View style={styles.timePickerContainer}>
          {(Object.keys(timePeriodLabels) as TimePeriod[]).map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.timeOption,
                timePeriod === period && styles.timeOptionActive,
              ]}
              onPress={() => {
                setTimePeriod(period);
                setShowTimePicker(false);
              }}
            >
              <Text
                style={[
                  styles.timeOptionText,
                  timePeriod === period && styles.timeOptionTextActive,
                ]}
              >
                {timePeriodLabels[period]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.disclaimerBar}>
        <Info size={12} color={Colors.textMuted} />
        <Text style={styles.disclaimerText}>
          Rankings based on verified on-chain activity. No speculative metrics.
        </Text>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderLeaderboardContent()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.background,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  headerRight: {
    width: 40,
  },
  categoryTabs: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tabsContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryTabText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  categoryTabTextActive: {
    color: '#FFF',
  },
  metricInfoBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  metricInfoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metricTitle: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  timePeriodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
  },
  timePeriodText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  metricDescriptionBox: {
    backgroundColor: Colors.backgroundSecondary,
    marginHorizontal: 16,
    marginTop: 8,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  metricDescriptionText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  metricUnitText: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 4,
    fontWeight: '500' as const,
  },
  timePickerContainer: {
    backgroundColor: Colors.card,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  timeOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  timeOptionActive: {
    backgroundColor: Colors.primary + '15',
  },
  timeOptionText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  timeOptionTextActive: {
    color: Colors.primary,
    fontWeight: '600' as const,
  },
  disclaimerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.backgroundSecondary,
  },
  disclaimerText: {
    fontSize: 11,
    color: Colors.textMuted,
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 40,
  },
  leaderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  topThreeCard: {
    borderWidth: 2,
    borderColor: Colors.accent + '40',
  },
  rankBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 2,
  },
  rankText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  cardContent: {
    flex: 1,
    marginLeft: 12,
  },
  entryName: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 2,
  },
  entryAffiliation: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  locationText: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },
  statsText: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  metricContainer: {
    alignItems: 'flex-end',
    minWidth: 80,
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '800' as const,
  },
  metricLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 2,
  },
});
