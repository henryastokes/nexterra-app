import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  MapPin,
  Building,
  Calendar,
  Star,
  MessageCircle,
  Handshake,
  BookOpen,
  DollarSign,
  Briefcase,
  CheckCircle,
  Clock,
  ExternalLink,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { communityUsers, CommunityUser } from '@/mocks/community';
import { funders, Funder, FundingRecord } from '@/mocks/funders';

type ProfileSection = 'overview' | 'funding';

type CommunityUserWithType = CommunityUser & { userType: 'community' };
type FunderWithType = Funder & { userType: 'funder' };
type UserData = CommunityUserWithType | FunderWithType;

export default function UserProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [activeSection, setActiveSection] = useState<ProfileSection>('overview');

  const user = useMemo((): UserData | null => {
    const communityUser = communityUsers.find((u) => u.id === id);
    if (communityUser) return { ...communityUser, userType: 'community' };
    
    const funder = funders.find((f) => f.id === id);
    if (funder) return { ...funder, userType: 'funder' };
    
    return null;
  }, [id]);

  if (!user) {
    return (
      <View style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={22} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>User not found</Text>
        </View>
      </View>
    );
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Researcher':
        return Colors.primary;
      case 'Builder':
        return Colors.accent;
      case 'Funder':
        return Colors.clay;
      case 'Hybrid':
        return Colors.success;
      default:
        return Colors.textSecondary;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Foundation':
        return Colors.primary;
      case 'Institution':
        return Colors.accent;
      case 'Corporate':
        return Colors.clay;
      case 'Individual':
        return Colors.success;
      default:
        return Colors.textSecondary;
    }
  };

  const getStatusColor = (status: FundingRecord['status']) => {
    switch (status) {
      case 'completed':
        return Colors.success;
      case 'active':
        return Colors.primary;
      case 'pending':
        return Colors.accent;
      default:
        return Colors.textMuted;
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount}`;
  };

  const isFunder = user.userType === 'funder';
  const funderData = isFunder ? (user as FunderWithType) : null;
  const communityData = !isFunder ? (user as CommunityUserWithType) : null;

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
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
            {communityData && (
              <View style={[styles.roleBadge, { backgroundColor: getRoleBadgeColor(communityData.role) }]}>
                <Text style={styles.roleBadgeText}>{communityData.role}</Text>
              </View>
            )}
            {funderData && (
              <View style={[styles.roleBadge, { backgroundColor: getTypeColor(funderData.type as string) }]}>
                <Text style={styles.roleBadgeText}>{funderData.type}</Text>
              </View>
            )}
          </View>
          <Text style={styles.userName}>{user.name}</Text>
          <View style={styles.affiliationRow}>
            <Building size={14} color={Colors.textSecondary} />
            <Text style={styles.affiliation}>
              {funderData ? funderData.organization : communityData?.affiliation}
            </Text>
          </View>
          <View style={styles.locationRow}>
            <MapPin size={14} color={Colors.textMuted} />
            <Text style={styles.location}>{user.location}</Text>
            <View style={styles.dotSeparator} />
            <Calendar size={14} color={Colors.textMuted} />
            <Text style={styles.joinDate}>
              Joined {new Date(user.joinedDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </Text>
          </View>
          <View style={styles.credibilityRow}>
            <Star size={16} color={Colors.accent} />
            <Text style={styles.credibilityScore}>{user.credibilityScore}</Text>
            <Text style={styles.credibilityLabel}>Credibility Score</Text>
          </View>
          <Text style={styles.bio}>{user.bio}</Text>
        </View>

        {isFunder && funderData && (
          <>
            <View style={styles.sectionTabs}>
              <TouchableOpacity
                style={[styles.sectionTab, activeSection === 'overview' && styles.sectionTabActive]}
                onPress={() => setActiveSection('overview')}
              >
                <Text style={[styles.sectionTabText, activeSection === 'overview' && styles.sectionTabTextActive]}>
                  Overview
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.sectionTab, activeSection === 'funding' && styles.sectionTabActive]}
                onPress={() => setActiveSection('funding')}
              >
                <Text style={[styles.sectionTabText, activeSection === 'funding' && styles.sectionTabTextActive]}>
                  Funding History
                </Text>
              </TouchableOpacity>
            </View>

            {activeSection === 'overview' && (
              <>
                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <DollarSign size={20} color={Colors.primary} />
                    <View>
                      <Text style={styles.statValue}>{formatCurrency(funderData.totalFunded)}</Text>
                      <Text style={styles.statLabel}>Total Funded</Text>
                    </View>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Briefcase size={20} color={Colors.accent} />
                    <View>
                      <Text style={styles.statValue}>{funderData.projectsFunded}</Text>
                      <Text style={styles.statLabel}>Projects</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Focus Areas</Text>
                  <View style={styles.tagsList}>
                    {funderData.focusAreas.map((area) => (
                      <View key={area} style={styles.tag}>
                        <Text style={styles.tagText}>{area}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </>
            )}

            {activeSection === 'funding' && (
              <View style={styles.fundingSection}>
                {funderData.fundingHistory.map((record) => (
                  <View key={record.id} style={styles.fundingRecord}>
                    <View style={styles.fundingRecordInfo}>
                      <Text style={styles.fundingProjectTitle}>{record.projectTitle}</Text>
                      <Text style={styles.fundingDate}>
                        {new Date(record.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </Text>
                    </View>
                    <View style={styles.fundingRecordMeta}>
                      <Text style={styles.fundingAmount}>{formatCurrency(record.amount)}</Text>
                      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(record.status) }]}>
                        {record.status === 'completed' ? (
                          <CheckCircle size={10} color={Colors.background} />
                        ) : (
                          <Clock size={10} color={Colors.background} />
                        )}
                        <Text style={styles.statusText}>{record.status}</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </>
        )}

        {!isFunder && communityData && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Expertise</Text>
              <View style={styles.tagsList}>
                {communityData.expertise.map((exp) => (
                  <View key={exp} style={styles.tag}>
                    <Text style={styles.tagText}>{exp}</Text>
                  </View>
                ))}
              </View>
            </View>
          </>
        )}

        <View style={styles.actionsSection}>
          <TouchableOpacity 
            style={styles.actionButton} 
            activeOpacity={0.8}
            onPress={() => router.push(`/chat/new/${id}`)}
            testID="message-button"
          >
            <MessageCircle size={18} color={Colors.background} />
            <Text style={styles.actionButtonText}>Message</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.actionButtonOutline]} 
            activeOpacity={0.8}
            onPress={() => router.push(`/collaborate/${id}`)}
            testID="collaborate-button"
          >
            <Handshake size={18} color={Colors.primary} />
            <Text style={styles.actionButtonTextOutline}>Collaborate</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.researchLink} 
          activeOpacity={0.7}
          onPress={() => router.push(`/user-research/${id}`)}
          testID="view-research-button"
        >
          <BookOpen size={18} color={Colors.primary} />
          <Text style={styles.researchLinkText}>
            {isFunder ? 'View Funded Research' : 'View Research'}
          </Text>
          <ExternalLink size={14} color={Colors.primary} />
        </TouchableOpacity>
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
    paddingBottom: 40,
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
  profileHeader: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 4,
    borderColor: Colors.primary,
  },
  roleBadge: {
    position: 'absolute',
    bottom: 0,
    right: -8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: Colors.background,
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: Colors.background,
  },
  userName: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: Colors.text,
    marginBottom: 6,
  },
  affiliationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  affiliation: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  location: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  dotSeparator: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: Colors.textMuted,
    marginHorizontal: 4,
  },
  joinDate: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  credibilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.card,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 14,
  },
  credibilityScore: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.accent,
  },
  credibilityLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  bio: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  sectionTabs: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 20,
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  sectionTabActive: {
    backgroundColor: Colors.primary,
  },
  sectionTabText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  sectionTabTextActive: {
    color: Colors.background,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 18,
    marginHorizontal: 20,
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
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 12,
  },
  tagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: Colors.card,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tagText: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: Colors.textSecondary,
  },
  fundingSection: {
    paddingHorizontal: 20,
  },
  fundingRecord: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  fundingRecordInfo: {
    flex: 1,
    marginRight: 12,
  },
  fundingProjectTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  fundingDate: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  fundingRecordMeta: {
    alignItems: 'flex-end',
    gap: 6,
  },
  fundingAmount: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600' as const,
    color: Colors.background,
    textTransform: 'capitalize' as const,
  },
  actionsSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginTop: 20,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
  },
  actionButtonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.background,
  },
  actionButtonTextOutline: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  researchLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    marginHorizontal: 20,
    backgroundColor: Colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  researchLinkText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
});
