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
  Users,
  TrendingUp,
  Shield,
  ChevronRight,
  Vote,
  PieChart,
  Building2,
  FileText,
  Wallet,
  CheckCircle,
  CircleDot,
  Brain,
  AlertTriangle,
} from 'lucide-react-native';
import Header from '@/components/Header';
import MemberRow from '@/components/MemberRow';
import Colors from '@/constants/colors';
import { nxtTokenService } from '@/services/nxtToken';
import { daoMembers } from '@/mocks/research';
import { daos, getDAOProgress, DAO } from '@/mocks/daos';

type TabType = 'daos' | 'members' | 'treasury';
type FilterType = 'all' | 'proposal' | 'ask';
type StatusFilter = 'all' | 'active' | 'completed';

export default function DAOScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('daos');
  const [typeFilter, setTypeFilter] = useState<FilterType>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const filteredDAOs = useMemo(() => {
    return daos.filter(dao => {
      const matchesType = typeFilter === 'all' || dao.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || dao.status === statusFilter;
      return matchesType && matchesStatus;
    });
  }, [typeFilter, statusFilter]);

  const totalCapitalRaised = daos.reduce((acc, dao) => acc + dao.capitalRaised, 0);
  const totalDisbursed = daos.reduce((acc, dao) => acc + dao.totalDisbursed, 0);
  const activeDAOs = daos.filter(dao => dao.status === 'active').length;
  const completedDAOs = daos.filter(dao => dao.status === 'completed').length;

  const handleDAOPress = (daoId: string) => {
    router.push(`/dao/${daoId}`);
  };

  const renderDAOCard = (dao: DAO) => {
    const progress = getDAOProgress(dao);
    
    return (
      <TouchableOpacity
        key={dao.id}
        style={styles.daoCard}
        onPress={() => handleDAOPress(dao.id)}
        activeOpacity={0.7}
      >
        <Image source={{ uri: dao.imageUrl }} style={styles.daoImage} />
        <View style={styles.daoContent}>
          <View style={styles.daoHeader}>
            <View style={styles.daoTags}>
              <View style={[styles.typeTag, dao.type === 'proposal' ? styles.proposalTag : styles.askTag]}>
                <Text style={[styles.typeTagText, dao.type === 'proposal' ? styles.proposalTagText : styles.askTagText]}>
                  {dao.type === 'proposal' ? 'Proposal' : 'Ask'}
                </Text>
              </View>
              <View style={[styles.statusTag, dao.status === 'active' ? styles.activeTag : styles.completedTag]}>
                {dao.status === 'active' ? (
                  <CircleDot size={10} color={Colors.success} />
                ) : (
                  <CheckCircle size={10} color={Colors.primary} />
                )}
                <Text style={[styles.statusTagText, dao.status === 'active' ? styles.activeTagText : styles.completedTagText]}>
                  {dao.status.charAt(0).toUpperCase() + dao.status.slice(1)}
                </Text>
              </View>
            </View>
            <ChevronRight size={18} color={Colors.textSecondary} />
          </View>
          
          <Text style={styles.daoName} numberOfLines={2}>{dao.name}</Text>
          <Text style={styles.daoDescription} numberOfLines={2}>{dao.description}</Text>
          
          <View style={styles.daoMeta}>
            <View style={styles.metaItem}>
              <Building2 size={14} color={Colors.textSecondary} />
              <Text style={styles.metaText}>{dao.governance.structure}</Text>
            </View>
            <View style={styles.metaItem}>
              <Users size={14} color={Colors.textSecondary} />
              <Text style={styles.metaText}>{dao.votingRights.memberCount}</Text>
            </View>
            <View style={styles.metaItem}>
              <Wallet size={14} color={Colors.textSecondary} />
              <Text style={styles.metaText}>${(dao.capitalRaised / 1000).toFixed(0)}K</Text>
            </View>
          </View>

          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Disbursement Progress</Text>
              <Text style={styles.progressValue}>{progress.toFixed(0)}%</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
            </View>
            <View style={styles.progressStats}>
              <Text style={styles.progressStat}>
                ${(dao.totalDisbursed / 1000).toFixed(1)}K disbursed
              </Text>
              <Text style={styles.progressStat}>
                ${((dao.capitalRaised - dao.totalDisbursed) / 1000).toFixed(1)}K remaining
              </Text>
            </View>
          </View>

          <View style={styles.daoFooter}>
            <View style={styles.leaderInfo}>
              <Image source={{ uri: dao.leader.avatar }} style={styles.leaderAvatar} />
              <View>
                <Text style={styles.leaderName}>{dao.leader.name}</Text>
                <Text style={styles.leaderRole}>{dao.leader.role}</Text>
              </View>
            </View>
            <View style={styles.chainBadge}>
              <Text style={styles.chainText}>{dao.chainName}</Text>
            </View>
          </View>
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
          <Text style={styles.greeting}>DAO Governance</Text>
          <Text style={styles.heroSubtitle}>
            Community-driven decision making for African science
          </Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: 'rgba(200, 232, 75, 0.15)' }]}>
              <Building2 size={20} color={Colors.primary} />
            </View>
            <Text style={styles.statValue}>{daos.length}</Text>
            <Text style={styles.statLabel}>Total DAOs</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: 'rgba(212, 168, 83, 0.15)' }]}>
              <Wallet size={20} color={Colors.accent} />
            </View>
            <Text style={styles.statValue}>${(totalCapitalRaised / 1000000).toFixed(1)}M</Text>
            <Text style={styles.statLabel}>Capital Raised</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: 'rgba(76, 175, 80, 0.15)' }]}>
              <TrendingUp size={20} color={Colors.success} />
            </View>
            <Text style={styles.statValue}>{activeDAOs}</Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: 'rgba(166, 124, 82, 0.15)' }]}>
              <CheckCircle size={20} color={Colors.clay} />
            </View>
            <Text style={styles.statValue}>{completedDAOs}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>

        <View style={styles.yourStatusCard}>
          <View style={styles.yourStatusHeader}>
            <Shield size={24} color={Colors.primary} />
            <View style={styles.yourStatusInfo}>
              <Text style={styles.yourStatusTitle}>Your DAO Status</Text>
              <Text style={styles.yourStatusLabel}>Active Member</Text>
            </View>
            <View style={styles.yourStatusBadge}>
              <Text style={styles.yourStatusBadgeText}>Level 3</Text>
            </View>
          </View>
          <View style={styles.yourStatusStats}>
            <View style={styles.yourStatusStat}>
              <Text style={styles.yourStatusStatValue}>{nxtTokenService.formatGovernanceCredits(1250)}</Text>
              <Text style={styles.yourStatusStatLabel}>Governance Credits</Text>
            </View>
            <View style={styles.yourStatusDivider} />
            <View style={styles.yourStatusStat}>
              <Text style={styles.yourStatusStatValue}>{nxtTokenService.formatFiatOnly(5200)}</Text>
              <Text style={styles.yourStatusStatLabel}>Contributed</Text>
            </View>
            <View style={styles.yourStatusDivider} />
            <View style={styles.yourStatusStat}>
              <Text style={styles.yourStatusStatValue}>47</Text>
              <Text style={styles.yourStatusStatLabel}>Votes Cast</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.intelligenceCard}
          onPress={() => router.push('/intelligence')}
          activeOpacity={0.7}
        >
          <View style={styles.intelligenceIcon}>
            <Brain size={24} color={Colors.primary} />
          </View>
          <View style={styles.intelligenceContent}>
            <Text style={styles.intelligenceTitle}>Intelligence Layer</Text>
            <Text style={styles.intelligenceSubtitle}>Pattern detection, risk signals & emerging alerts</Text>
          </View>
          <View style={styles.intelligenceBadges}>
            <View style={styles.alertBadge}>
              <AlertTriangle size={10} color={Colors.error} />
              <Text style={styles.alertBadgeText}>3</Text>
            </View>
            <ChevronRight size={18} color={Colors.textSecondary} />
          </View>
        </TouchableOpacity>

        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'daos' && styles.tabActive]}
            onPress={() => setActiveTab('daos')}
          >
            <Building2 size={16} color={activeTab === 'daos' ? Colors.background : Colors.textSecondary} />
            <Text style={[styles.tabText, activeTab === 'daos' && styles.tabTextActive]}>
              DAOs
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'members' && styles.tabActive]}
            onPress={() => setActiveTab('members')}
          >
            <Users size={16} color={activeTab === 'members' ? Colors.background : Colors.textSecondary} />
            <Text style={[styles.tabText, activeTab === 'members' && styles.tabTextActive]}>
              Leaderboard
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'treasury' && styles.tabActive]}
            onPress={() => setActiveTab('treasury')}
          >
            <PieChart size={16} color={activeTab === 'treasury' ? Colors.background : Colors.textSecondary} />
            <Text style={[styles.tabText, activeTab === 'treasury' && styles.tabTextActive]}>
              Treasury
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'daos' && (
          <View style={styles.daosSection}>
            <View style={styles.filtersRow}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersScroll}>
                <TouchableOpacity
                  style={[styles.filterChip, typeFilter === 'all' && styles.filterChipActive]}
                  onPress={() => setTypeFilter('all')}
                >
                  <Text style={[styles.filterChipText, typeFilter === 'all' && styles.filterChipTextActive]}>All Types</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.filterChip, typeFilter === 'proposal' && styles.filterChipActive]}
                  onPress={() => setTypeFilter('proposal')}
                >
                  <FileText size={14} color={typeFilter === 'proposal' ? Colors.background : Colors.textSecondary} />
                  <Text style={[styles.filterChipText, typeFilter === 'proposal' && styles.filterChipTextActive]}>Proposals</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.filterChip, typeFilter === 'ask' && styles.filterChipActive]}
                  onPress={() => setTypeFilter('ask')}
                >
                  <Vote size={14} color={typeFilter === 'ask' ? Colors.background : Colors.textSecondary} />
                  <Text style={[styles.filterChipText, typeFilter === 'ask' && styles.filterChipTextActive]}>Asks</Text>
                </TouchableOpacity>
                <View style={styles.filterDivider} />
                <TouchableOpacity
                  style={[styles.filterChip, statusFilter === 'all' && styles.filterChipActive]}
                  onPress={() => setStatusFilter('all')}
                >
                  <Text style={[styles.filterChipText, statusFilter === 'all' && styles.filterChipTextActive]}>All Status</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.filterChip, statusFilter === 'active' && styles.filterChipActive]}
                  onPress={() => setStatusFilter('active')}
                >
                  <CircleDot size={14} color={statusFilter === 'active' ? Colors.background : Colors.success} />
                  <Text style={[styles.filterChipText, statusFilter === 'active' && styles.filterChipTextActive]}>Active</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.filterChip, statusFilter === 'completed' && styles.filterChipActive]}
                  onPress={() => setStatusFilter('completed')}
                >
                  <CheckCircle size={14} color={statusFilter === 'completed' ? Colors.background : Colors.primary} />
                  <Text style={[styles.filterChipText, statusFilter === 'completed' && styles.filterChipTextActive]}>Completed</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>

            <Text style={styles.resultCount}>{filteredDAOs.length} DAOs found</Text>

            {filteredDAOs.map(renderDAOCard)}
          </View>
        )}

        {activeTab === 'members' && (
          <View style={styles.membersSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Top Contributors</Text>
              <TouchableOpacity style={styles.viewAllButton}>
                <Text style={styles.viewAllText}>View All</Text>
                <ChevronRight size={16} color={Colors.primary} />
              </TouchableOpacity>
            </View>
            {daoMembers.map((member) => (
              <MemberRow key={member.id} member={member} />
            ))}
          </View>
        )}

        {activeTab === 'treasury' && (
          <View style={styles.treasurySection}>
            <View style={styles.treasuryCard}>
              <Text style={styles.treasuryLabel}>Total Treasury</Text>
              <Text style={styles.treasuryAmount}>${(totalCapitalRaised / 1000000).toFixed(2)}M</Text>
              <View style={styles.treasuryChange}>
                <TrendingUp size={14} color={Colors.success} />
                <Text style={styles.treasuryChangeText}>+12.4% this quarter</Text>
              </View>
            </View>

            <View style={styles.disbursementOverview}>
              <Text style={styles.allocationTitle}>Disbursement Overview</Text>
              <View style={styles.disbursementStats}>
                <View style={styles.disbursementStat}>
                  <Text style={styles.disbursementValue}>${(totalDisbursed / 1000).toFixed(0)}K</Text>
                  <Text style={styles.disbursementLabel}>Total Disbursed</Text>
                </View>
                <View style={styles.disbursementStat}>
                  <Text style={styles.disbursementValue}>${((totalCapitalRaised - totalDisbursed) / 1000).toFixed(0)}K</Text>
                  <Text style={styles.disbursementLabel}>In Reserve</Text>
                </View>
              </View>
              <View style={styles.overallProgressBg}>
                <View style={[styles.overallProgressFill, { width: `${(totalDisbursed / totalCapitalRaised) * 100}%` }]} />
              </View>
              <Text style={styles.overallProgressText}>
                {((totalDisbursed / totalCapitalRaised) * 100).toFixed(0)}% of funds deployed
              </Text>
            </View>

            <Text style={styles.allocationTitle}>Fund Allocation by Area</Text>
            
            <View style={styles.allocationItem}>
              <View style={[styles.allocationDot, { backgroundColor: Colors.primary }]} />
              <Text style={styles.allocationLabel}>Health & Disease</Text>
              <Text style={styles.allocationValue}>$410,000</Text>
              <Text style={styles.allocationPercent}>39%</Text>
            </View>
            <View style={styles.allocationItem}>
              <View style={[styles.allocationDot, { backgroundColor: Colors.accent }]} />
              <Text style={styles.allocationLabel}>Climate & Environment</Text>
              <Text style={styles.allocationValue}>$320,000</Text>
              <Text style={styles.allocationPercent}>30%</Text>
            </View>
            <View style={styles.allocationItem}>
              <View style={[styles.allocationDot, { backgroundColor: Colors.clay }]} />
              <Text style={styles.allocationLabel}>Water & Infrastructure</Text>
              <Text style={styles.allocationValue}>$170,000</Text>
              <Text style={styles.allocationPercent}>16%</Text>
            </View>
            <View style={styles.allocationItem}>
              <View style={[styles.allocationDot, { backgroundColor: Colors.success }]} />
              <Text style={styles.allocationLabel}>One Health</Text>
              <Text style={styles.allocationValue}>$170,000</Text>
              <Text style={styles.allocationPercent}>15%</Text>
            </View>

            <TouchableOpacity 
              style={styles.economicsButton} 
              activeOpacity={0.8}
              onPress={() => router.push('/economics')}
            >
              <PieChart size={18} color={Colors.primary} />
              <View style={styles.economicsButtonContent}>
                <Text style={styles.economicsButtonTitle}>Economics Dashboard</Text>
                <Text style={styles.economicsButtonSubtitle}>
                  View Operations, Treasury & Strategic pools
                </Text>
              </View>
              <ChevronRight size={18} color={Colors.primary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.proposalButton} activeOpacity={0.8}>
              <Text style={styles.proposalButtonText}>Submit Treasury Proposal</Text>
              <ChevronRight size={18} color={Colors.background} />
            </TouchableOpacity>
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
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    marginTop: 20,
    gap: 12,
  },
  statCard: {
    width: '47%',
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  yourStatusCard: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: Colors.cardElevated,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  yourStatusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 20,
  },
  yourStatusInfo: {
    flex: 1,
  },
  yourStatusTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  yourStatusLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  yourStatusBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  yourStatusBadgeText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: Colors.background,
  },
  yourStatusStats: {
    flexDirection: 'row',
  },
  yourStatusStat: {
    flex: 1,
    alignItems: 'center',
  },
  yourStatusStatValue: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  yourStatusStatLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  yourStatusDivider: {
    width: 1,
    backgroundColor: Colors.border,
    marginHorizontal: 8,
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
  daosSection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  filtersRow: {
    marginBottom: 16,
  },
  filtersScroll: {
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: Colors.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: Colors.textSecondary,
  },
  filterChipTextActive: {
    color: Colors.background,
  },
  filterDivider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.border,
    marginHorizontal: 4,
  },
  resultCount: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  daoCard: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
    overflow: 'hidden',
  },
  daoImage: {
    width: '100%',
    height: 140,
    backgroundColor: Colors.cardElevated,
  },
  daoContent: {
    padding: 16,
  },
  daoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  daoTags: {
    flexDirection: 'row',
    gap: 8,
  },
  typeTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  proposalTag: {
    backgroundColor: 'rgba(200, 232, 75, 0.15)',
  },
  askTag: {
    backgroundColor: 'rgba(212, 168, 83, 0.15)',
  },
  typeTagText: {
    fontSize: 11,
    fontWeight: '600' as const,
  },
  proposalTagText: {
    color: Colors.primary,
  },
  askTagText: {
    color: Colors.golden,
  },
  statusTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeTag: {
    backgroundColor: 'rgba(76, 175, 80, 0.15)',
  },
  completedTag: {
    backgroundColor: 'rgba(200, 232, 75, 0.15)',
  },
  statusTagText: {
    fontSize: 11,
    fontWeight: '600' as const,
  },
  activeTagText: {
    color: Colors.success,
  },
  completedTagText: {
    color: Colors.primary,
  },
  daoName: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 6,
  },
  daoDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 12,
  },
  daoMeta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: Colors.textSecondary,
    textTransform: 'capitalize',
  },
  progressSection: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: Colors.textSecondary,
  },
  progressValue: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: Colors.cardElevated,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  progressStat: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  daoFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  leaderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  leaderAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.cardElevated,
  },
  leaderName: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  leaderRole: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  chainBadge: {
    backgroundColor: Colors.cardElevated,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  chainText: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  membersSection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  treasurySection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  treasuryCard: {
    backgroundColor: Colors.cardElevated,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  treasuryLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  treasuryAmount: {
    fontSize: 36,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  treasuryChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  treasuryChangeText: {
    fontSize: 13,
    color: Colors.success,
    fontWeight: '500' as const,
  },
  disbursementOverview: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  disbursementStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  disbursementStat: {
    alignItems: 'center',
  },
  disbursementValue: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  disbursementLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  overallProgressBg: {
    height: 8,
    backgroundColor: Colors.cardElevated,
    borderRadius: 4,
    overflow: 'hidden',
  },
  overallProgressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  overallProgressText: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  allocationTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 16,
  },
  allocationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  allocationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  allocationLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.text,
  },
  allocationValue: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
    marginRight: 12,
  },
  allocationPercent: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.primary,
    width: 40,
    textAlign: 'right' as const,
  },
  economicsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginTop: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  economicsButtonContent: {
    flex: 1,
  },
  economicsButtonTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  economicsButtonSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  proposalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 12,
    gap: 6,
  },
  proposalButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.background,
  },
  intelligenceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(45, 179, 160, 0.3)',
  },
  intelligenceIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(45, 179, 160, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  intelligenceContent: {
    flex: 1,
  },
  intelligenceTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 2,
  },
  intelligenceSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  intelligenceBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  alertBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 83, 80, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
  },
  alertBadgeText: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: Colors.error,
  },
});
