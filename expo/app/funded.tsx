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
  DollarSign,
  Briefcase,
  TrendingUp,
  CheckCircle,
  Clock,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { funders, focusAreaOptions, Funder, FundingRecord } from '@/mocks/funders';

type SortOption = 'total' | 'projects' | 'credibility';
type FunderType = 'Individual' | 'Foundation' | 'Institution' | 'Corporate';

const funderTypeOptions: FunderType[] = ['Individual', 'Foundation', 'Institution', 'Corporate'];

export default function FundedScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedType, setSelectedType] = useState<FunderType | null>(null);
  const [selectedFocusArea, setSelectedFocusArea] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('total');
  const [expandedFunder, setExpandedFunder] = useState<string | null>(null);

  const filteredFunders = useMemo(() => {
    let result = [...funders];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (funder) =>
          funder.name.toLowerCase().includes(query) ||
          funder.organization.toLowerCase().includes(query) ||
          funder.focusAreas.some((f) => f.toLowerCase().includes(query))
      );
    }

    if (selectedType) {
      result = result.filter((funder) => funder.type === selectedType);
    }

    if (selectedFocusArea) {
      result = result.filter((funder) => funder.focusAreas.includes(selectedFocusArea));
    }

    switch (sortBy) {
      case 'total':
        result.sort((a, b) => b.totalFunded - a.totalFunded);
        break;
      case 'projects':
        result.sort((a, b) => b.projectsFunded - a.projectsFunded);
        break;
      case 'credibility':
        result.sort((a, b) => b.credibilityScore - a.credibilityScore);
        break;
    }

    return result;
  }, [searchQuery, selectedType, selectedFocusArea, sortBy]);

  const activeFiltersCount = [selectedType, selectedFocusArea].filter(Boolean).length;

  const clearFilters = () => {
    setSelectedType(null);
    setSelectedFocusArea(null);
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

  const getTypeColor = (type: FunderType) => {
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

  const handleFunderPress = (funderId: string) => {
    router.push(`/user/${funderId}`);
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

  const renderFundingHistory = (history: FundingRecord[]) => (
    <View style={styles.fundingHistory}>
      <Text style={styles.fundingHistoryTitle}>Recent Funding</Text>
      {history.map((record) => (
        <View key={record.id} style={styles.fundingRecord}>
          <View style={styles.fundingRecordInfo}>
            <Text style={styles.fundingProjectTitle} numberOfLines={1}>
              {record.projectTitle}
            </Text>
            <Text style={styles.fundingDate}>
              {new Date(record.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
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
  );

  const renderFunderCard = (funder: Funder) => {
    const isExpanded = expandedFunder === funder.id;

    return (
      <TouchableOpacity
        key={funder.id}
        style={styles.funderCard}
        onPress={() => handleFunderPress(funder.id)}
        activeOpacity={0.7}
        testID={`funder-card-${funder.id}`}
      >
        <View style={styles.funderCardHeader}>
          <Image source={{ uri: funder.avatar }} style={styles.funderAvatar} />
          <View style={styles.funderInfo}>
            <Text style={styles.funderName}>{funder.name}</Text>
            <View style={styles.organizationRow}>
              <Building size={12} color={Colors.textSecondary} />
              <Text style={styles.funderOrganization} numberOfLines={1}>
                {funder.organization}
              </Text>
            </View>
            <View style={styles.locationRow}>
              <MapPin size={12} color={Colors.textMuted} />
              <Text style={styles.funderLocation}>{funder.location}</Text>
            </View>
          </View>
          <View style={styles.funderMeta}>
            <View style={[styles.typeBadge, { backgroundColor: getTypeColor(funder.type) }]}>
              <Text style={styles.typeBadgeText}>{funder.type}</Text>
            </View>
            <View style={styles.credibilityBadge}>
              <Star size={12} color={Colors.accent} />
              <Text style={styles.credibilityText}>{funder.credibilityScore}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.funderBio} numberOfLines={2}>
          {funder.bio}
        </Text>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <DollarSign size={16} color={Colors.primary} />
            <View>
              <Text style={styles.statValue}>{formatCurrency(funder.totalFunded)}</Text>
              <Text style={styles.statLabel}>Total Funded</Text>
            </View>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Briefcase size={16} color={Colors.accent} />
            <View>
              <Text style={styles.statValue}>{funder.projectsFunded}</Text>
              <Text style={styles.statLabel}>Projects</Text>
            </View>
          </View>
        </View>

        <View style={styles.focusAreasSection}>
          <Text style={styles.focusAreasLabel}>Focus Areas</Text>
          <View style={styles.focusAreasTags}>
            {funder.focusAreas.map((area) => (
              <View key={area} style={styles.focusAreaTag}>
                <Text style={styles.focusAreaTagText}>{area}</Text>
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={styles.expandButton}
          onPress={(e) => {
            e.stopPropagation();
            setExpandedFunder(isExpanded ? null : funder.id);
          }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.expandButtonText}>
            {isExpanded ? 'Hide History' : 'View Funding History'}
          </Text>
          <TrendingUp size={14} color={Colors.primary} />
        </TouchableOpacity>

        {isExpanded && renderFundingHistory(funder.fundingHistory)}
      </TouchableOpacity>
    );
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
        <Text style={styles.headerTitle}>Funders</Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Search size={18} color={Colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search funders, organizations, focus areas..."
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

          <Text style={styles.filterLabel}>Funder Type</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
            {funderTypeOptions.map((type) =>
              renderFilterPill(type, selectedType === type, () =>
                setSelectedType(selectedType === type ? null : type)
              )
            )}
          </ScrollView>

          <Text style={styles.filterLabel}>Focus Area</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
            {focusAreaOptions.map((area) =>
              renderFilterPill(area, selectedFocusArea === area, () =>
                setSelectedFocusArea(selectedFocusArea === area ? null : area)
              )
            )}
          </ScrollView>
        </View>
      )}

      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>{filteredFunders.length} funders</Text>
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => {
            const options: SortOption[] = ['total', 'projects', 'credibility'];
            const currentIndex = options.indexOf(sortBy);
            setSortBy(options[(currentIndex + 1) % options.length]);
          }}
        >
          <Text style={styles.sortText}>
            Sort: {sortBy === 'total' ? 'Total Funded' : sortBy === 'projects' ? 'Projects' : 'Rating'}
          </Text>
          <ChevronDown size={14} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filteredFunders.map(renderFunderCard)}
        {filteredFunders.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No funders found</Text>
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
  funderCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  funderCardHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  funderAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  funderInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  funderName: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  organizationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  funderOrganization: {
    fontSize: 12,
    color: Colors.textSecondary,
    flex: 1,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  funderLocation: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  funderMeta: {
    alignItems: 'flex-end',
    gap: 6,
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  typeBadgeText: {
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
  funderBio: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.border,
    marginHorizontal: 12,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  focusAreasSection: {
    marginBottom: 14,
  },
  focusAreasLabel: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  focusAreasTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  focusAreaTag: {
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  focusAreaTagText: {
    fontSize: 11,
    fontWeight: '500' as const,
    color: Colors.textSecondary,
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  expandButtonText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  fundingHistory: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  fundingHistoryTitle: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 12,
  },
  fundingRecord: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  fundingRecordInfo: {
    flex: 1,
    marginRight: 12,
  },
  fundingProjectTitle: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 2,
  },
  fundingDate: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  fundingRecordMeta: {
    alignItems: 'flex-end',
    gap: 4,
  },
  fundingAmount: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 9,
    fontWeight: '600' as const,
    color: Colors.background,
    textTransform: 'capitalize' as const,
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
});
