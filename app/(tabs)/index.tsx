import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  ThumbsUp, 
  ThumbsDown, 
  TrendingUp, 
  Clock, 
  Filter,
  FileText,
  HelpCircle,
  ChevronRight,
  MapPin,
  DollarSign,
  Users,
  AlertTriangle,
  Trophy,
} from 'lucide-react-native';
import Header from '@/components/Header';
import Colors from '@/constants/colors';
import { 
  votingProposals, 
  votingAsks, 
  getDaysRemaining,
  linkedDaos,
} from '@/mocks/submissions';

type FilterType = 'all' | 'proposals' | 'asks';

interface VotingItem {
  id: string;
  type: 'proposal' | 'ask';
  title: string;
  description: string;
  submittedBy: {
    id: string;
    name: string;
    avatar: string;
  };
  submittedAt: string;
  country?: string;
  region?: string;
  linkedDao?: string;
  budget?: number;
  targetAmount?: number;
  currency?: string;
  votesFor?: number;
  votesAgainst?: number;
  urgency?: 'low' | 'medium' | 'high' | 'critical';
  requestType?: 'funding' | 'resources' | 'expertise' | 'collaboration';
  issueArea?: string;
}

export default function VoteScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterType>('all');

  const allItems: VotingItem[] = useMemo(() => {
    const proposals: VotingItem[] = votingProposals.map((p) => ({
      id: p.id,
      type: 'proposal' as const,
      title: p.title,
      description: p.description,
      submittedBy: p.submittedBy,
      submittedAt: p.submittedAt,
      country: p.country,
      region: p.region,
      linkedDao: p.linkedDao,
      budget: p.budget,
      currency: p.currency,
      votesFor: p.votesFor,
      votesAgainst: p.votesAgainst,
      issueArea: p.issueArea,
    }));

    const asks: VotingItem[] = votingAsks.map((a) => ({
      id: a.id,
      type: 'ask' as const,
      title: a.title,
      description: a.description,
      submittedBy: a.submittedBy,
      submittedAt: a.submittedAt,
      country: a.country,
      region: a.region,
      linkedDao: a.linkedDao,
      targetAmount: a.targetAmount,
      currency: a.currency,
      urgency: a.urgency,
      requestType: a.requestType,
    }));

    return [...proposals, ...asks].sort(
      (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
  }, []);

  const filteredItems = useMemo(() => {
    if (filter === 'all') return allItems;
    if (filter === 'proposals') return allItems.filter((i) => i.type === 'proposal');
    return allItems.filter((i) => i.type === 'ask');
  }, [allItems, filter]);

  const stats = useMemo(() => {
    const totalVotes = votingProposals.reduce(
      (acc, p) => acc + (p.votesFor || 0) + (p.votesAgainst || 0),
      0
    );
    return {
      totalItems: allItems.length,
      proposals: votingProposals.length,
      asks: votingAsks.length,
      totalVotes,
    };
  }, [allItems]);

  const getDaoName = (daoId?: string) => {
    if (!daoId) return null;
    const dao = linkedDaos.find((d) => d.id === daoId);
    return dao?.name;
  };

  const getUrgencyColor = (urgency?: string) => {
    switch (urgency) {
      case 'critical':
        return Colors.error;
      case 'high':
        return Colors.warning;
      case 'medium':
        return Colors.accent;
      default:
        return Colors.textMuted;
    }
  };

  const formatAmount = (amount?: number, currency?: string) => {
    if (!amount) return null;
    return `${amount.toLocaleString()} ${currency || 'USDC'}`;
  };

  const handleItemPress = (item: VotingItem) => {
    router.push(`/vote/${item.id}?type=${item.type}`);
  };

  const renderFilterButton = (type: FilterType, label: string, count: number) => (
    <TouchableOpacity
      style={[styles.filterButton, filter === type && styles.filterButtonActive]}
      onPress={() => setFilter(type)}
      activeOpacity={0.7}
    >
      <Text style={[styles.filterButtonText, filter === type && styles.filterButtonTextActive]}>
        {label}
      </Text>
      <View style={[styles.filterCount, filter === type && styles.filterCountActive]}>
        <Text style={[styles.filterCountText, filter === type && styles.filterCountTextActive]}>
          {count}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderVotingCard = (item: VotingItem) => {
    const daysLeft = getDaysRemaining(item.submittedAt);
    const isProposal = item.type === 'proposal';
    const amount = isProposal ? item.budget : item.targetAmount;

    return (
      <TouchableOpacity
        key={item.id}
        style={styles.voteCard}
        onPress={() => handleItemPress(item)}
        activeOpacity={0.8}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.typeBadge, isProposal ? styles.proposalBadge : styles.askBadge]}>
            {isProposal ? (
              <FileText size={12} color={Colors.background} />
            ) : (
              <HelpCircle size={12} color={Colors.background} />
            )}
            <Text style={styles.typeBadgeText}>{isProposal ? 'Proposal' : 'Ask'}</Text>
          </View>
          <View style={styles.timeContainer}>
            <Clock size={12} color={Colors.accent} />
            <Text style={styles.timeText}>{daysLeft}d left</Text>
          </View>
        </View>

        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.cardDescription} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.metaRow}>
          {item.country && (
            <View style={styles.metaItem}>
              <MapPin size={12} color={Colors.textMuted} />
              <Text style={styles.metaText}>{item.country}</Text>
            </View>
          )}
          {amount && (
            <View style={styles.metaItem}>
              <DollarSign size={12} color={Colors.primary} />
              <Text style={[styles.metaText, styles.amountText]}>
                {formatAmount(amount, item.currency)}
              </Text>
            </View>
          )}
          {!isProposal && item.urgency && (
            <View style={styles.metaItem}>
              <AlertTriangle size={12} color={getUrgencyColor(item.urgency)} />
              <Text style={[styles.metaText, { color: getUrgencyColor(item.urgency) }]}>
                {item.urgency}
              </Text>
            </View>
          )}
        </View>

        {getDaoName(item.linkedDao) && (
          <View style={styles.daoTag}>
            <Users size={11} color={Colors.primary} />
            <Text style={styles.daoTagText}>{getDaoName(item.linkedDao)}</Text>
          </View>
        )}

        <View style={styles.cardFooter}>
          <View style={styles.submitterInfo}>
            <Image source={{ uri: item.submittedBy.avatar }} style={styles.submitterAvatar} />
            <Text style={styles.submitterName} numberOfLines={1}>
              {item.submittedBy.name}
            </Text>
          </View>

          {isProposal && item.votesFor !== undefined && (
            <View style={styles.voteIndicator}>
              <View style={styles.voteStat}>
                <ThumbsUp size={14} color={Colors.success} />
                <Text style={styles.voteStatText}>{item.votesFor?.toLocaleString()}</Text>
              </View>
              <View style={styles.voteStat}>
                <ThumbsDown size={14} color={Colors.error} />
                <Text style={styles.voteStatText}>{item.votesAgainst?.toLocaleString()}</Text>
              </View>
            </View>
          )}

          <ChevronRight size={18} color={Colors.textMuted} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.heroSection}>
          <Text style={styles.greeting}>Vote on Initiatives</Text>
          <Text style={styles.heroSubtitle}>
            Shape Africa&apos;s climate and health future. 7-day voting window.
          </Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <TrendingUp size={20} color={Colors.primary} />
            <Text style={styles.statValue}>{stats.totalItems}</Text>
            <Text style={styles.statLabel}>Active Items</Text>
          </View>
          <View style={styles.statCard}>
            <ThumbsUp size={20} color={Colors.success} />
            <Text style={styles.statValue}>{stats.totalVotes.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Total Votes</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.leaderboardBanner}
          onPress={() => router.push('/leaderboards')}
          activeOpacity={0.8}
          testID="leaderboard-banner"
        >
          <View style={styles.leaderboardIconContainer}>
            <Trophy size={22} color="#FFD700" />
          </View>
          <View style={styles.leaderboardContent}>
            <Text style={styles.leaderboardTitle}>Leaderboards</Text>
            <Text style={styles.leaderboardSubtitle}>Top funders, researchers & practitioners</Text>
          </View>
          <ChevronRight size={20} color={Colors.textMuted} />
        </TouchableOpacity>

        <View style={styles.filterSection}>
          <View style={styles.filterHeader}>
            <Filter size={16} color={Colors.textSecondary} />
            <Text style={styles.filterLabel}>Filter by type</Text>
          </View>
          <View style={styles.filterButtons}>
            {renderFilterButton('all', 'All', stats.totalItems)}
            {renderFilterButton('proposals', 'Proposals', stats.proposals)}
            {renderFilterButton('asks', 'Asks', stats.asks)}
          </View>
        </View>

        <View style={styles.listSection}>
          {filteredItems.map(renderVotingCard)}
        </View>

        {filteredItems.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No items found</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  heroSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginTop: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.text,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  filterSection: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  filterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: Colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 8,
  },
  filterButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  filterButtonTextActive: {
    color: Colors.background,
  },
  filterCount: {
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  filterCountActive: {
    backgroundColor: 'rgba(13, 21, 16, 0.2)',
  },
  filterCountText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  filterCountTextActive: {
    color: Colors.background,
  },
  listSection: {
    paddingHorizontal: 20,
    marginTop: 20,
    gap: 16,
  },
  voteCard: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 5,
  },
  proposalBadge: {
    backgroundColor: Colors.primary,
  },
  askBadge: {
    backgroundColor: Colors.golden,
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: Colors.background,
    textTransform: 'uppercase',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.accent,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 8,
    lineHeight: 24,
  },
  cardDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 14,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '500' as const,
  },
  amountText: {
    color: Colors.primary,
  },
  daoTag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 5,
    marginBottom: 14,
  },
  daoTagText: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: '500' as const,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  submitterInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  submitterAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  submitterName: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: Colors.text,
    flex: 1,
  },
  voteIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginRight: 12,
  },
  voteStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  voteStatText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 15,
    color: Colors.textMuted,
  },
  leaderboardBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  leaderboardIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFD70020',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leaderboardContent: {
    flex: 1,
    marginLeft: 14,
  },
  leaderboardTitle: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  leaderboardSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
