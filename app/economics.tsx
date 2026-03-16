import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import {
  Wallet,
  Shield,
  TrendingUp,
  TrendingDown,
  PieChart,
  Vote,
  CheckCircle,
  XCircle,
  Clock,
  Link2,
  ChevronRight,
  Info,
  Lock,
  Zap,
  ArrowLeft,
  RefreshCw,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import {
  economicsPools,
  allocationVotes,
  onChainEnforcement,
  getTotalEconomicsValue,
  EconomicsPool,
  AllocationVote,
} from '@/mocks/economics';

type TabType = 'overview' | 'governance' | 'enforcement';

export default function EconomicsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const totalValue = getTotalEconomicsValue();

  const formatCurrency = (value: number): string => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    }
    return `$${(value / 1000).toFixed(0)}K`;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getPoolIcon = (poolId: string) => {
    switch (poolId) {
      case 'operations':
        return <Zap size={20} color={Colors.accent} />;
      case 'treasury':
        return <Shield size={20} color={Colors.golden} />;
      case 'strategic':
        return <TrendingUp size={20} color={Colors.primary} />;
      default:
        return <Wallet size={20} color={Colors.textSecondary} />;
    }
  };

  const getPoolColor = (poolId: string): string => {
    switch (poolId) {
      case 'operations':
        return Colors.accent;
      case 'treasury':
        return Colors.golden;
      case 'strategic':
        return Colors.primary;
      default:
        return Colors.textSecondary;
    }
  };

  const renderPoolCard = (pool: EconomicsPool) => {
    const netFlow = pool.inflows30d - pool.outflows30d;
    const isPositiveFlow = netFlow >= 0;

    return (
      <View key={pool.id} style={styles.poolCard}>
        <View style={styles.poolHeader}>
          <View style={[styles.poolIconContainer, { backgroundColor: `${getPoolColor(pool.id)}20` }]}>
            {getPoolIcon(pool.id)}
          </View>
          <View style={styles.poolHeaderInfo}>
            <Text style={styles.poolName}>{pool.name}</Text>
            <View style={styles.onChainBadge}>
              <Link2 size={10} color={Colors.success} />
              <Text style={styles.onChainText}>On-Chain</Text>
            </View>
          </View>
          <View style={styles.allocationBadge}>
            <Text style={styles.allocationText}>{pool.allocationPercentage}%</Text>
          </View>
        </View>

        <Text style={styles.poolDescription} numberOfLines={2}>
          {pool.description}
        </Text>

        <View style={styles.poolBalanceRow}>
          <Text style={styles.poolBalanceLabel}>Current Balance</Text>
          <Text style={styles.poolBalanceValue}>{formatCurrency(pool.balance)}</Text>
        </View>

        <View style={styles.poolFlowsRow}>
          <View style={styles.flowItem}>
            <TrendingUp size={14} color={Colors.success} />
            <Text style={styles.flowLabel}>30d Inflows</Text>
            <Text style={[styles.flowValue, { color: Colors.success }]}>
              +{formatCurrency(pool.inflows30d)}
            </Text>
          </View>
          <View style={styles.flowItem}>
            <TrendingDown size={14} color={Colors.error} />
            <Text style={styles.flowLabel}>30d Outflows</Text>
            <Text style={[styles.flowValue, { color: Colors.error }]}>
              -{formatCurrency(pool.outflows30d)}
            </Text>
          </View>
        </View>

        <View style={styles.netFlowRow}>
          <Text style={styles.netFlowLabel}>Net Flow (30d)</Text>
          <View style={[styles.netFlowBadge, { backgroundColor: isPositiveFlow ? 'rgba(93, 187, 138, 0.15)' : 'rgba(239, 83, 80, 0.15)' }]}>
            {isPositiveFlow ? (
              <TrendingUp size={12} color={Colors.success} />
            ) : (
              <TrendingDown size={12} color={Colors.error} />
            )}
            <Text style={[styles.netFlowValue, { color: isPositiveFlow ? Colors.success : Colors.error }]}>
              {isPositiveFlow ? '+' : ''}{formatCurrency(netFlow)}
            </Text>
          </View>
        </View>

        <View style={styles.contractRow}>
          <Text style={styles.contractLabel}>Contract</Text>
          <Text style={styles.contractAddress} numberOfLines={1}>
            {pool.contractAddress.slice(0, 8)}...{pool.contractAddress.slice(-6)}
          </Text>
        </View>
      </View>
    );
  };

  const renderVoteCard = (vote: AllocationVote) => {
    const getStatusColor = () => {
      switch (vote.status) {
        case 'active':
          return Colors.primary;
        case 'passed':
        case 'executed':
          return Colors.success;
        case 'rejected':
          return Colors.error;
        default:
          return Colors.textSecondary;
      }
    };

    const getStatusIcon = () => {
      switch (vote.status) {
        case 'active':
          return <Clock size={12} color={getStatusColor()} />;
        case 'passed':
        case 'executed':
          return <CheckCircle size={12} color={getStatusColor()} />;
        case 'rejected':
          return <XCircle size={12} color={getStatusColor()} />;
        default:
          return null;
      }
    };

    const voteProgress = ((vote.votesFor + vote.votesAgainst) / vote.totalVotingPower) * 100;
    const forPercentage = (vote.votesFor / (vote.votesFor + vote.votesAgainst)) * 100 || 0;

    return (
      <View key={vote.id} style={styles.voteCard}>
        <View style={styles.voteHeader}>
          <View style={[styles.voteStatusBadge, { backgroundColor: `${getStatusColor()}20` }]}>
            {getStatusIcon()}
            <Text style={[styles.voteStatusText, { color: getStatusColor() }]}>
              {vote.status.charAt(0).toUpperCase() + vote.status.slice(1)}
            </Text>
          </View>
          <Text style={styles.voteDate}>
            {vote.status === 'active' ? `Ends ${formatDate(vote.endDate)}` : formatDate(vote.endDate)}
          </Text>
        </View>

        <Text style={styles.voteTitle}>{vote.title}</Text>
        <Text style={styles.voteDescription} numberOfLines={2}>{vote.description}</Text>

        <View style={styles.proposedChangesSection}>
          <Text style={styles.proposedChangesLabel}>Proposed Changes</Text>
          {vote.proposedAllocations.map((allocation) => {
            const pool = economicsPools.find(p => p.id === allocation.poolId);
            const change = allocation.proposedPercentage - allocation.currentPercentage;
            return (
              <View key={allocation.poolId} style={styles.allocationChangeRow}>
                <View style={[styles.poolDot, { backgroundColor: getPoolColor(allocation.poolId) }]} />
                <Text style={styles.allocationPoolName}>{pool?.name || allocation.poolId}</Text>
                <Text style={styles.allocationCurrent}>{allocation.currentPercentage}%</Text>
                <ChevronRight size={14} color={Colors.textSecondary} />
                <Text style={styles.allocationProposed}>{allocation.proposedPercentage}%</Text>
                <Text style={[
                  styles.allocationChange,
                  { color: change > 0 ? Colors.success : change < 0 ? Colors.error : Colors.textSecondary }
                ]}>
                  ({change > 0 ? '+' : ''}{change}%)
                </Text>
              </View>
            );
          })}
        </View>

        <View style={styles.voteProgressSection}>
          <View style={styles.voteProgressHeader}>
            <Text style={styles.voteProgressLabel}>Vote Progress</Text>
            <Text style={styles.voteProgressValue}>{voteProgress.toFixed(0)}% participation</Text>
          </View>
          <View style={styles.voteBarContainer}>
            <View style={[styles.voteBarFor, { width: `${forPercentage}%` }]} />
            <View style={[styles.voteBarAgainst, { width: `${100 - forPercentage}%` }]} />
          </View>
          <View style={styles.voteStatsRow}>
            <View style={styles.voteStat}>
              <View style={[styles.voteStatDot, { backgroundColor: Colors.success }]} />
              <Text style={styles.voteStatLabel}>For</Text>
              <Text style={styles.voteStatValue}>{(vote.votesFor / 1000).toFixed(0)}K</Text>
            </View>
            <View style={styles.voteStat}>
              <View style={[styles.voteStatDot, { backgroundColor: Colors.error }]} />
              <Text style={styles.voteStatLabel}>Against</Text>
              <Text style={styles.voteStatValue}>{(vote.votesAgainst / 1000).toFixed(0)}K</Text>
            </View>
            <View style={styles.voteStat}>
              <Text style={styles.voteStatLabel}>Quorum</Text>
              <Text style={[styles.voteStatValue, { color: vote.quorumReached ? Colors.success : Colors.warning }]}>
                {vote.quorumReached ? 'Reached' : 'Pending'}
              </Text>
            </View>
          </View>
        </View>

        {vote.transactionHash && (
          <View style={styles.txHashRow}>
            <Link2 size={12} color={Colors.textSecondary} />
            <Text style={styles.txHashText}>{vote.transactionHash}</Text>
          </View>
        )}
      </View>
    );
  };

  const renderEnforcementSection = () => (
    <View style={styles.enforcementSection}>
      <View style={styles.enforcementHeader}>
        <View style={styles.enforcementIconContainer}>
          <Lock size={24} color={Colors.primary} />
        </View>
        <View style={styles.enforcementHeaderInfo}>
          <Text style={styles.enforcementTitle}>On-Chain Enforcement</Text>
          <Text style={styles.enforcementSubtitle}>
            All allocation rules are enforced by smart contracts
          </Text>
        </View>
      </View>

      <View style={styles.syncCard}>
        <View style={styles.syncRow}>
          <Text style={styles.syncLabel}>Master Contract</Text>
          <Text style={styles.syncValue}>
            {onChainEnforcement.contractAddress.slice(0, 10)}...
          </Text>
        </View>
        <View style={styles.syncRow}>
          <Text style={styles.syncLabel}>Last Sync Block</Text>
          <Text style={styles.syncValue}>#{onChainEnforcement.lastSyncBlock.toLocaleString()}</Text>
        </View>
        <View style={styles.syncRow}>
          <Text style={styles.syncLabel}>Last Sync Time</Text>
          <Text style={styles.syncValue}>{formatDate(onChainEnforcement.lastSyncTimestamp)}</Text>
        </View>
      </View>

      <View style={styles.rebalanceCard}>
        <View style={styles.rebalanceHeader}>
          <RefreshCw size={18} color={Colors.accent} />
          <Text style={styles.rebalanceTitle}>Auto-Rebalance</Text>
          <View style={[styles.rebalanceStatusBadge, { backgroundColor: onChainEnforcement.autoRebalance ? 'rgba(93, 187, 138, 0.15)' : 'rgba(239, 83, 80, 0.15)' }]}>
            <Text style={[styles.rebalanceStatusText, { color: onChainEnforcement.autoRebalance ? Colors.success : Colors.error }]}>
              {onChainEnforcement.autoRebalance ? 'Enabled' : 'Disabled'}
            </Text>
          </View>
        </View>
        <View style={styles.rebalanceDetails}>
          <View style={styles.rebalanceDetailItem}>
            <Text style={styles.rebalanceDetailLabel}>Threshold</Text>
            <Text style={styles.rebalanceDetailValue}>{onChainEnforcement.rebalanceThreshold}% deviation</Text>
          </View>
          <View style={styles.rebalanceDetailItem}>
            <Text style={styles.rebalanceDetailLabel}>Next Scheduled</Text>
            <Text style={styles.rebalanceDetailValue}>{formatDate(onChainEnforcement.nextScheduledRebalance)}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.rulesTitle}>Active Enforcement Rules</Text>
      {onChainEnforcement.enforcementRules.map((rule) => (
        <View key={rule.id} style={styles.ruleCard}>
          <View style={styles.ruleHeader}>
            <View style={[styles.ruleStatusDot, { backgroundColor: rule.isActive ? Colors.success : Colors.error }]} />
            <Text style={styles.ruleText}>{rule.rule}</Text>
          </View>
          <View style={styles.ruleFooter}>
            <Text style={styles.ruleEnforcedText}>
              Last enforced: {formatDate(rule.lastEnforced)}
            </Text>
            <View style={styles.ruleTxBadge}>
              <Link2 size={10} color={Colors.textMuted} />
              <Text style={styles.ruleTxText}>{rule.transactionHash.slice(0, 12)}...</Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Economics Dashboard',
          headerStyle: { backgroundColor: Colors.background },
          headerTintColor: Colors.text,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color={Colors.text} />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.readOnlyBanner}>
          <Info size={16} color={Colors.golden} />
          <Text style={styles.readOnlyText}>
            Read-only view. Allocation changes require DAO governance vote.
          </Text>
        </View>

        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Total Platform Capital</Text>
          <Text style={styles.totalValue}>{formatCurrency(totalValue)}</Text>
          <View style={styles.totalSubRow}>
            <View style={styles.totalSubItem}>
              <TrendingUp size={14} color={Colors.success} />
              <Text style={styles.totalSubText}>+7.5% this month</Text>
            </View>
            <View style={styles.chainBadge}>
              <Link2 size={12} color={Colors.primary} />
              <Text style={styles.chainText}>Polygon</Text>
            </View>
          </View>
        </View>

        <View style={styles.allocationVisual}>
          <Text style={styles.allocationVisualTitle}>Current Allocation</Text>
          <View style={styles.allocationBar}>
            {economicsPools.map((pool) => (
              <View
                key={pool.id}
                style={[
                  styles.allocationSegment,
                  {
                    width: `${pool.allocationPercentage}%`,
                    backgroundColor: getPoolColor(pool.id),
                  },
                ]}
              />
            ))}
          </View>
          <View style={styles.allocationLegend}>
            {economicsPools.map((pool) => (
              <View key={pool.id} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: getPoolColor(pool.id) }]} />
                <Text style={styles.legendText}>{pool.name.split(' ')[0]}</Text>
                <Text style={styles.legendPercent}>{pool.allocationPercentage}%</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'overview' && styles.tabActive]}
            onPress={() => setActiveTab('overview')}
          >
            <PieChart size={16} color={activeTab === 'overview' ? Colors.background : Colors.textSecondary} />
            <Text style={[styles.tabText, activeTab === 'overview' && styles.tabTextActive]}>Pools</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'governance' && styles.tabActive]}
            onPress={() => setActiveTab('governance')}
          >
            <Vote size={16} color={activeTab === 'governance' ? Colors.background : Colors.textSecondary} />
            <Text style={[styles.tabText, activeTab === 'governance' && styles.tabTextActive]}>Governance</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'enforcement' && styles.tabActive]}
            onPress={() => setActiveTab('enforcement')}
          >
            <Lock size={16} color={activeTab === 'enforcement' ? Colors.background : Colors.textSecondary} />
            <Text style={[styles.tabText, activeTab === 'enforcement' && styles.tabTextActive]}>On-Chain</Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'overview' && (
          <View style={styles.poolsSection}>
            {economicsPools.map(renderPoolCard)}
          </View>
        )}

        {activeTab === 'governance' && (
          <View style={styles.governanceSection}>
            <View style={styles.governanceHeader}>
              <Text style={styles.governanceTitle}>Allocation Votes</Text>
              <Text style={styles.governanceSubtitle}>
                All allocation changes are decided by DAO vote
              </Text>
            </View>
            {allocationVotes.map(renderVoteCard)}
          </View>
        )}

        {activeTab === 'enforcement' && renderEnforcementSection()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  backButton: {
    padding: 8,
    marginLeft: 8,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  readOnlyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(212, 168, 83, 0.1)',
    marginHorizontal: 20,
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(212, 168, 83, 0.3)',
  },
  readOnlyText: {
    flex: 1,
    fontSize: 13,
    color: Colors.golden,
    lineHeight: 18,
  },
  totalCard: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: Colors.cardElevated,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  totalLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  totalValue: {
    fontSize: 42,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 12,
  },
  totalSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  totalSubItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  totalSubText: {
    fontSize: 14,
    color: Colors.success,
    fontWeight: '500' as const,
  },
  chainBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(45, 179, 160, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  chainText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600' as const,
  },
  allocationVisual: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  allocationVisualTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 12,
  },
  allocationBar: {
    flexDirection: 'row',
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
    gap: 2,
  },
  allocationSegment: {
    height: '100%',
    borderRadius: 4,
  },
  allocationLegend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  legendPercent: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 24,
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 6,
  },
  tabActive: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: Colors.background,
  },
  poolsSection: {
    paddingHorizontal: 20,
    marginTop: 20,
    gap: 16,
  },
  poolCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  poolHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  poolIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  poolHeaderInfo: {
    flex: 1,
    marginLeft: 12,
  },
  poolName: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  onChainBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  onChainText: {
    fontSize: 11,
    color: Colors.success,
    fontWeight: '500' as const,
  },
  allocationBadge: {
    backgroundColor: Colors.cardElevated,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  allocationText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  poolDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 16,
  },
  poolBalanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.cardElevated,
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  poolBalanceLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  poolBalanceValue: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  poolFlowsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  flowItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.cardElevated,
    padding: 10,
    borderRadius: 8,
  },
  flowLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    flex: 1,
  },
  flowValue: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  netFlowRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  netFlowLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  netFlowBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  netFlowValue: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
  contractRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  contractLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  contractAddress: {
    fontSize: 12,
    color: Colors.textMuted,
    fontFamily: 'monospace',
  },
  governanceSection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  governanceHeader: {
    marginBottom: 16,
  },
  governanceTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  governanceSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  voteCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  voteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  voteStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  voteStatusText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  voteDate: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  voteTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 6,
  },
  voteDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 16,
  },
  proposedChangesSection: {
    backgroundColor: Colors.cardElevated,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  proposedChangesLabel: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
    marginBottom: 10,
  },
  allocationChangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  poolDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  allocationPoolName: {
    flex: 1,
    fontSize: 13,
    color: Colors.text,
  },
  allocationCurrent: {
    fontSize: 13,
    color: Colors.textSecondary,
    width: 36,
    textAlign: 'right' as const,
  },
  allocationProposed: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.text,
    width: 36,
    textAlign: 'right' as const,
  },
  allocationChange: {
    fontSize: 11,
    width: 44,
    textAlign: 'right' as const,
  },
  voteProgressSection: {
    marginBottom: 12,
  },
  voteProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  voteProgressLabel: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  voteProgressValue: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  voteBarContainer: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: Colors.cardElevated,
  },
  voteBarFor: {
    height: '100%',
    backgroundColor: Colors.success,
  },
  voteBarAgainst: {
    height: '100%',
    backgroundColor: Colors.error,
  },
  voteStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  voteStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  voteStatDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  voteStatLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  voteStatValue: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  txHashRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  txHashText: {
    fontSize: 11,
    color: Colors.textMuted,
    fontFamily: 'monospace',
  },
  enforcementSection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  enforcementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  enforcementIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(45, 179, 160, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  enforcementHeaderInfo: {
    flex: 1,
    marginLeft: 14,
  },
  enforcementTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  enforcementSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  syncCard: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  syncRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  syncLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  syncValue: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: Colors.text,
    fontFamily: 'monospace',
  },
  rebalanceCard: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 20,
  },
  rebalanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  rebalanceTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  rebalanceStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  rebalanceStatusText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  rebalanceDetails: {
    flexDirection: 'row',
    gap: 12,
  },
  rebalanceDetailItem: {
    flex: 1,
    backgroundColor: Colors.cardElevated,
    padding: 12,
    borderRadius: 10,
  },
  rebalanceDetailLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  rebalanceDetailValue: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  rulesTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 12,
  },
  ruleCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 10,
  },
  ruleHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 10,
  },
  ruleStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 5,
  },
  ruleText: {
    flex: 1,
    fontSize: 13,
    color: Colors.text,
    lineHeight: 18,
  },
  ruleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ruleEnforcedText: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  ruleTxBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ruleTxText: {
    fontSize: 10,
    color: Colors.textMuted,
    fontFamily: 'monospace',
  },
});
