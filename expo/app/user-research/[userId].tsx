import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  BookOpen,
  DollarSign,
  Calendar,
  MapPin,
  FileText,
  CheckCircle,
  Clock,
  ChevronRight,
  Beaker,
  Award,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { communityUsers } from '@/mocks/community';
import { funders } from '@/mocks/funders';

type TabType = 'funded' | 'authored';

interface UserResearch {
  id: string;
  title: string;
  description: string;
  date: string;
  status: 'completed' | 'active' | 'pending';
  amount?: number;
  institution?: string;
  location?: string;
  category?: string;
}

const generateUserResearch = (userId: string, role: string): UserResearch[] => {
  const baseResearch: UserResearch[] = [
    {
      id: 'r1',
      title: 'Climate Resilience in East African Agriculture',
      description: 'A comprehensive study on drought-resistant farming techniques and their impact on food security.',
      date: '2024-06-15',
      status: 'completed',
      institution: 'University of Nairobi',
      location: 'Kenya',
      category: 'Climate Adaptation',
    },
    {
      id: 'r2',
      title: 'Disease Surveillance Network Optimization',
      description: 'Developing AI-powered early warning systems for infectious disease outbreaks.',
      date: '2024-08-20',
      status: 'active',
      institution: 'African CDC',
      location: 'Ethiopia',
      category: 'Public Health',
    },
    {
      id: 'r3',
      title: 'Community Health Worker Training Program',
      description: 'Evaluating the effectiveness of mobile-based training for rural health workers.',
      date: '2024-03-10',
      status: 'completed',
      institution: 'Makerere University',
      location: 'Uganda',
      category: 'Community Health',
    },
    {
      id: 'r4',
      title: 'Water Purification Solutions for Rural Communities',
      description: 'Low-cost, sustainable water treatment technologies for underserved areas.',
      date: '2024-09-01',
      status: 'active',
      institution: 'University of Cape Town',
      location: 'South Africa',
      category: 'Environmental Health',
    },
  ];

  return baseResearch.slice(0, role === 'Researcher' ? 4 : 2);
};

export default function UserResearchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const [activeTab, setActiveTab] = useState<TabType>('authored');

  const communityUser = communityUsers.find((u) => u.id === userId);
  const funderUser = funders.find((f) => f.id === userId);
  const isFunder = !!funderUser;
  const user = communityUser || funderUser;

  const userResearch = useMemo(() => {
    if (!user) return [];
    const role = communityUser?.role || 'Funder';
    return generateUserResearch(userId || '', role);
  }, [userId, user, communityUser]);

  const fundedResearch = useMemo(() => {
    if (!funderUser) return [];
    return funderUser.fundingHistory.map((record) => ({
      ...record,
      description: `Funded research project in ${funderUser.focusAreas[0] || 'various fields'}`,
    }));
  }, [funderUser]);

  const getUserName = () => user?.name || 'User';
  const getUserAvatar = () => user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400';
  const getAffiliation = () => {
    if (communityUser) return communityUser.affiliation;
    if (funderUser) return funderUser.organization;
    return '';
  };
  const getRole = () => {
    if (communityUser) return communityUser.role;
    return 'Funder';
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
    return `$${amount}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return Colors.success;
      case 'active':
        return Colors.primary;
      case 'pending':
        return Colors.warning;
      default:
        return Colors.textMuted;
    }
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'Climate Adaptation':
        return Colors.clay;
      case 'Public Health':
        return Colors.primary;
      case 'Community Health':
        return Colors.success;
      case 'Environmental Health':
        return Colors.accent;
      default:
        return Colors.textSecondary;
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={22} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Research</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>User not found</Text>
        </View>
      </View>
    );
  }

  const showTabs = isFunder;
  const displayedTab = isFunder ? activeTab : 'authored';

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          testID="back-button"
        >
          <ArrowLeft size={22} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Research</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileCard}>
          <Image source={{ uri: getUserAvatar() }} style={styles.avatar} />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{getUserName()}</Text>
            <Text style={styles.profileAffiliation}>{getAffiliation()}</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleBadgeText}>{getRole()}</Text>
            </View>
          </View>
        </View>

        {isFunder && (
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <DollarSign size={20} color={Colors.primary} />
              <View>
                <Text style={styles.statValue}>{formatCurrency(funderUser.totalFunded)}</Text>
                <Text style={styles.statLabel}>Total Funded</Text>
              </View>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Award size={20} color={Colors.accent} />
              <View>
                <Text style={styles.statValue}>{funderUser.projectsFunded}</Text>
                <Text style={styles.statLabel}>Projects</Text>
              </View>
            </View>
          </View>
        )}

        {showTabs && (
          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'funded' && styles.tabActive]}
              onPress={() => setActiveTab('funded')}
            >
              <DollarSign size={16} color={activeTab === 'funded' ? Colors.background : Colors.textSecondary} />
              <Text style={[styles.tabText, activeTab === 'funded' && styles.tabTextActive]}>
                Funded Research
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'authored' && styles.tabActive]}
              onPress={() => setActiveTab('authored')}
            >
              <Beaker size={16} color={activeTab === 'authored' ? Colors.background : Colors.textSecondary} />
              <Text style={[styles.tabText, activeTab === 'authored' && styles.tabTextActive]}>
                Research Done
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {!showTabs && (
          <View style={styles.sectionHeader}>
            <Beaker size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Research by {getUserName().split(' ')[0]}</Text>
          </View>
        )}

        {displayedTab === 'funded' && isFunder && (
          <View style={styles.researchList}>
            {fundedResearch.length === 0 ? (
              <View style={styles.emptyState}>
                <DollarSign size={48} color={Colors.textMuted} />
                <Text style={styles.emptyTitle}>No funded research yet</Text>
                <Text style={styles.emptyText}>Research funded by this user will appear here</Text>
              </View>
            ) : (
              fundedResearch.map((record) => (
                <TouchableOpacity
                  key={record.id}
                  style={styles.researchCard}
                  activeOpacity={0.7}
                >
                  <View style={styles.cardHeader}>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(record.status) + '20' }]}>
                      {record.status === 'completed' ? (
                        <CheckCircle size={12} color={getStatusColor(record.status)} />
                      ) : (
                        <Clock size={12} color={getStatusColor(record.status)} />
                      )}
                      <Text style={[styles.statusText, { color: getStatusColor(record.status) }]}>
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </Text>
                    </View>
                    <Text style={styles.fundingAmount}>{formatCurrency(record.amount)}</Text>
                  </View>
                  <Text style={styles.cardTitle}>{record.projectTitle}</Text>
                  <View style={styles.cardMeta}>
                    <Calendar size={14} color={Colors.textMuted} />
                    <Text style={styles.metaText}>
                      {new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </Text>
                  </View>
                  <View style={styles.cardFooter}>
                    <Text style={styles.viewDetails}>View Details</Text>
                    <ChevronRight size={16} color={Colors.primary} />
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        )}

        {displayedTab === 'authored' && (
          <View style={styles.researchList}>
            {userResearch.length === 0 ? (
              <View style={styles.emptyState}>
                <BookOpen size={48} color={Colors.textMuted} />
                <Text style={styles.emptyTitle}>No research found</Text>
                <Text style={styles.emptyText}>Research by this user will appear here</Text>
              </View>
            ) : (
              userResearch.map((research) => (
                <TouchableOpacity
                  key={research.id}
                  style={styles.researchCard}
                  activeOpacity={0.7}
                >
                  <View style={styles.cardHeader}>
                    <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(research.category) + '15' }]}>
                      <Text style={[styles.categoryText, { color: getCategoryColor(research.category) }]}>
                        {research.category}
                      </Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(research.status) + '20' }]}>
                      {research.status === 'completed' ? (
                        <CheckCircle size={12} color={getStatusColor(research.status)} />
                      ) : (
                        <Clock size={12} color={getStatusColor(research.status)} />
                      )}
                      <Text style={[styles.statusText, { color: getStatusColor(research.status) }]}>
                        {research.status.charAt(0).toUpperCase() + research.status.slice(1)}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.cardTitle}>{research.title}</Text>
                  <Text style={styles.cardDescription} numberOfLines={2}>
                    {research.description}
                  </Text>
                  <View style={styles.cardMetaRow}>
                    {research.institution && (
                      <View style={styles.cardMeta}>
                        <FileText size={14} color={Colors.textMuted} />
                        <Text style={styles.metaText}>{research.institution}</Text>
                      </View>
                    )}
                    {research.location && (
                      <View style={styles.cardMeta}>
                        <MapPin size={14} color={Colors.textMuted} />
                        <Text style={styles.metaText}>{research.location}</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.cardMeta}>
                    <Calendar size={14} color={Colors.textMuted} />
                    <Text style={styles.metaText}>
                      {new Date(research.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </Text>
                  </View>
                  <View style={styles.cardFooter}>
                    <Text style={styles.viewDetails}>View Full Research</Text>
                    <ChevronRight size={16} color={Colors.primary} />
                  </View>
                </TouchableOpacity>
              ))
            )}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  profileInfo: {
    marginLeft: 14,
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  profileAffiliation: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: Colors.background,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.border,
    marginHorizontal: 12,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  researchList: {
    gap: 12,
  },
  researchCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600' as const,
    textTransform: 'capitalize' as const,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600' as const,
  },
  fundingAmount: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 8,
    lineHeight: 22,
  },
  cardDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  cardMetaRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  metaText: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: 12,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 4,
  },
  viewDetails: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundText: {
    fontSize: 16,
    color: Colors.textMuted,
  },
});
