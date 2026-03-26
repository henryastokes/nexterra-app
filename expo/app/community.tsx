import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Search,
  Filter,
  X,
  MapPin,
  Building,
  ChevronDown,
  Star,
  Trophy,
  ChevronRight,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { communityUsers, roleOptions, countryOptions, expertiseOptions, CommunityUser } from '@/mocks/community';

type SortOption = 'name' | 'credibility' | 'recent';

export default function CommunityScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedExpertise, setSelectedExpertise] = useState<string | null>(null);
  const [minCredibility, setMinCredibility] = useState<number>(0);
  const [sortBy, setSortBy] = useState<SortOption>('credibility');

  const filteredUsers = useMemo(() => {
    let result = [...communityUsers];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.affiliation.toLowerCase().includes(query) ||
          user.expertise.some((e) => e.toLowerCase().includes(query))
      );
    }

    if (selectedRole) {
      result = result.filter((user) => user.role === selectedRole);
    }

    if (selectedCountry) {
      result = result.filter((user) => user.country === selectedCountry);
    }

    if (selectedExpertise) {
      result = result.filter((user) => user.expertise.includes(selectedExpertise));
    }

    if (minCredibility > 0) {
      result = result.filter((user) => user.credibilityScore >= minCredibility);
    }

    switch (sortBy) {
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'credibility':
        result.sort((a, b) => b.credibilityScore - a.credibilityScore);
        break;
      case 'recent':
        result.sort((a, b) => new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime());
        break;
    }

    return result;
  }, [searchQuery, selectedRole, selectedCountry, selectedExpertise, minCredibility, sortBy]);

  const activeFiltersCount = [selectedRole, selectedCountry, selectedExpertise, minCredibility > 0].filter(Boolean).length;

  const clearFilters = () => {
    setSelectedRole(null);
    setSelectedCountry(null);
    setSelectedExpertise(null);
    setMinCredibility(0);
  };

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

  const handleUserPress = (userId: string) => {
    router.push(`/user/${userId}`);
  };

  const renderFilterPill = (
    label: string,
    isSelected: boolean,
    onPress: () => void
  ) => (
    <TouchableOpacity
      style={[styles.filterPill, isSelected && styles.filterPillSelected]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.filterPillText, isSelected && styles.filterPillTextSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderUserCard = (user: CommunityUser) => (
    <TouchableOpacity
      key={user.id}
      style={styles.userCard}
      onPress={() => handleUserPress(user.id)}
      activeOpacity={0.7}
      testID={`user-card-${user.id}`}
    >
      <View style={styles.userCardHeader}>
        <Image source={{ uri: user.avatar }} style={styles.userAvatar} />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.name}</Text>
          <View style={styles.affiliationRow}>
            <Building size={12} color={Colors.textSecondary} />
            <Text style={styles.userAffiliation} numberOfLines={1}>
              {user.affiliation}
            </Text>
          </View>
          <View style={styles.locationRow}>
            <MapPin size={12} color={Colors.textMuted} />
            <Text style={styles.userLocation}>{user.location}</Text>
          </View>
        </View>
        <View style={styles.userMeta}>
          <View style={[styles.roleBadge, { backgroundColor: getRoleBadgeColor(user.role) }]}>
            <Text style={styles.roleBadgeText}>{user.role}</Text>
          </View>
          <View style={styles.credibilityBadge}>
            <Star size={12} color={Colors.accent} />
            <Text style={styles.credibilityText}>{user.credibilityScore}</Text>
          </View>
        </View>
      </View>
      <Text style={styles.userBio} numberOfLines={2}>
        {user.bio}
      </Text>
      <View style={styles.expertiseTags}>
        {user.expertise.slice(0, 3).map((exp) => (
          <View key={exp} style={styles.expertiseTag}>
            <Text style={styles.expertiseTagText}>{exp}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );

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
        <Text style={styles.headerTitle}>Community</Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Search size={18} color={Colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, affiliation, expertise..."
            placeholderTextColor={Colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={[styles.filterButton, activeFiltersCount > 0 && styles.filterButtonActive]}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Filter size={18} color={activeFiltersCount > 0 ? Colors.background : Colors.text} />
          {activeFiltersCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFiltersCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {showFilters && (
        <View style={styles.filtersContainer}>
          <View style={styles.filterHeader}>
            <Text style={styles.filterTitle}>Filters</Text>
            {activeFiltersCount > 0 && (
              <TouchableOpacity onPress={clearFilters}>
                <Text style={styles.clearFiltersText}>Clear all</Text>
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.filterLabel}>Role</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
            {roleOptions.map((role) =>
              renderFilterPill(role, selectedRole === role, () =>
                setSelectedRole(selectedRole === role ? null : role)
              )
            )}
          </ScrollView>

          <Text style={styles.filterLabel}>Country</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
            {countryOptions.map((country) =>
              renderFilterPill(country, selectedCountry === country, () =>
                setSelectedCountry(selectedCountry === country ? null : country)
              )
            )}
          </ScrollView>

          <Text style={styles.filterLabel}>Expertise</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
            {expertiseOptions.map((exp) =>
              renderFilterPill(exp, selectedExpertise === exp, () =>
                setSelectedExpertise(selectedExpertise === exp ? null : exp)
              )
            )}
          </ScrollView>

          <Text style={styles.filterLabel}>Minimum Credibility Score</Text>
          <View style={styles.credibilityFilter}>
            {[0, 70, 80, 90].map((score) => (
              <TouchableOpacity
                key={score}
                style={[
                  styles.credibilityOption,
                  minCredibility === score && styles.credibilityOptionSelected,
                ]}
                onPress={() => setMinCredibility(score)}
              >
                <Text
                  style={[
                    styles.credibilityOptionText,
                    minCredibility === score && styles.credibilityOptionTextSelected,
                  ]}
                >
                  {score === 0 ? 'Any' : `${score}+`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <TouchableOpacity
        style={styles.leaderboardLink}
        onPress={() => router.push('/leaderboards')}
        activeOpacity={0.7}
        testID="leaderboard-link"
      >
        <View style={styles.leaderboardLinkLeft}>
          <Trophy size={18} color="#FFD700" />
          <Text style={styles.leaderboardLinkText}>View Leaderboards</Text>
        </View>
        <ChevronRight size={18} color={Colors.textMuted} />
      </TouchableOpacity>

      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>{filteredUsers.length} members</Text>
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => {
            const options: SortOption[] = ['credibility', 'name', 'recent'];
            const currentIndex = options.indexOf(sortBy);
            setSortBy(options[(currentIndex + 1) % options.length]);
          }}
        >
          <Text style={styles.sortText}>
            Sort: {sortBy === 'credibility' ? 'Top Rated' : sortBy === 'name' ? 'A-Z' : 'Recent'}
          </Text>
          <ChevronDown size={14} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filteredUsers.map(renderUserCard)}
        {filteredUsers.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No members found</Text>
            <Text style={styles.emptyStateText}>
              Try adjusting your filters or search query
            </Text>
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
  searchSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: Colors.accent,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeText: {
    fontSize: 10,
    fontWeight: '700' as const,
    color: Colors.background,
  },
  filtersContainer: {
    backgroundColor: Colors.card,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  filterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  clearFiltersText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
    marginBottom: 8,
    marginTop: 12,
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.backgroundSecondary,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterPillSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterPillText: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: Colors.textSecondary,
  },
  filterPillTextSelected: {
    color: Colors.background,
  },
  credibilityFilter: {
    flexDirection: 'row',
    gap: 8,
  },
  credibilityOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  credibilityOptionSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  credibilityOptionText: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: Colors.textSecondary,
  },
  credibilityOptionTextSelected: {
    color: Colors.background,
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  resultsCount: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sortText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  userCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  userCardHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  userAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  userName: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  affiliationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  userAffiliation: {
    fontSize: 12,
    color: Colors.textSecondary,
    flex: 1,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  userLocation: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  userMeta: {
    alignItems: 'flex-end',
    gap: 6,
  },
  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: '700' as const,
    color: Colors.background,
  },
  credibilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  credibilityText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: Colors.accent,
  },
  userBio: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  expertiseTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  expertiseTag: {
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  expertiseTagText: {
    fontSize: 11,
    fontWeight: '500' as const,
    color: Colors.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  leaderboardLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.card,
    marginHorizontal: 16,
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  leaderboardLinkLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  leaderboardLinkText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
  },
});
