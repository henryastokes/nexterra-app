import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import {
  Search,
  MapPin,
  Users,
  Briefcase,
  ChevronRight,
  Filter,
  X,
  Clock,
  DollarSign,
  ArrowLeft,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import {
  collaborations,
  Collaboration,
  collaborationTypes,
  collaborationStatuses,
  regionOptions,
} from '@/mocks/collaborations';
import { expertiseOptions } from '@/mocks/community';

export default function CollaborationScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedExpertise, setSelectedExpertise] = useState<string | null>(null);

  const filteredCollaborations = collaborations.filter((collab) => {
    const matchesSearch =
      searchQuery === '' ||
      collab.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collab.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collab.organization.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = !selectedType || collab.type === selectedType;
    const matchesStatus = !selectedStatus || collab.status === selectedStatus;
    const matchesRegion = !selectedRegion || collab.region === selectedRegion;
    const matchesExpertise =
      !selectedExpertise || collab.expertise.includes(selectedExpertise);

    return matchesSearch && matchesType && matchesStatus && matchesRegion && matchesExpertise;
  });

  const clearFilters = () => {
    setSelectedType(null);
    setSelectedStatus(null);
    setSelectedRegion(null);
    setSelectedExpertise(null);
  };

  const activeFilterCount = [selectedType, selectedStatus, selectedRegion, selectedExpertise].filter(
    Boolean
  ).length;

  const getStatusColor = (status: Collaboration['status']) => {
    switch (status) {
      case 'Open':
        return Colors.success;
      case 'In Progress':
        return Colors.warning;
      case 'Filled':
        return Colors.textMuted;
      default:
        return Colors.textMuted;
    }
  };

  const getTypeColor = (type: Collaboration['type']) => {
    switch (type) {
      case 'Research':
        return '#6B8AFF';
      case 'Field Work':
        return Colors.primary;
      case 'Technical':
        return '#FF6B9D';
      case 'Policy':
        return Colors.accent;
      case 'Community':
        return '#8B6BFF';
      default:
        return Colors.textMuted;
    }
  };

  const renderCollaborationCard = useCallback(
    ({ item }: { item: Collaboration }) => (
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push(`/collaboration/${item.id}`)}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <View style={styles.orgInfo}>
            <Image source={{ uri: item.organizationLogo }} style={styles.orgLogo} />
            <View style={styles.orgText}>
              <Text style={styles.orgName} numberOfLines={1}>
                {item.organization}
              </Text>
              <View style={styles.locationRow}>
                <MapPin size={12} color={Colors.textMuted} />
                <Text style={styles.locationText}>{item.location}</Text>
              </View>
            </View>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {item.status}
            </Text>
          </View>
        </View>

        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.title}
        </Text>

        <Text style={styles.cardDescription} numberOfLines={3}>
          {item.description}
        </Text>

        <View style={styles.tagsRow}>
          <View style={[styles.typeBadge, { backgroundColor: getTypeColor(item.type) + '20' }]}>
            <Briefcase size={12} color={getTypeColor(item.type)} />
            <Text style={[styles.typeText, { color: getTypeColor(item.type) }]}>{item.type}</Text>
          </View>
          {item.expertise.slice(0, 2).map((exp) => (
            <View key={exp} style={styles.expertiseBadge}>
              <Text style={styles.expertiseText}>{exp}</Text>
            </View>
          ))}
          {item.expertise.length > 2 && (
            <View style={styles.expertiseBadge}>
              <Text style={styles.expertiseText}>+{item.expertise.length - 2}</Text>
            </View>
          )}
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.footerInfo}>
            <View style={styles.footerItem}>
              <Clock size={14} color={Colors.textMuted} />
              <Text style={styles.footerText}>{item.timeline.duration}</Text>
            </View>
            <View style={styles.footerItem}>
              <Users size={14} color={Colors.textMuted} />
              <Text style={styles.footerText}>
                {item.applicants}/{item.maxCollaborators}
              </Text>
            </View>
            <View style={styles.footerItem}>
              <DollarSign size={14} color={Colors.textMuted} />
              <Text style={styles.footerText}>{item.compensation.type}</Text>
            </View>
          </View>
          <ChevronRight size={20} color={Colors.textMuted} />
        </View>
      </TouchableOpacity>
    ),
    [router]
  );

  const FilterPill = ({
    label,
    selected,
    onPress,
  }: {
    label: string;
    selected: boolean;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      style={[styles.filterPill, selected && styles.filterPillSelected]}
      onPress={onPress}
    >
      <Text style={[styles.filterPillText, selected && styles.filterPillTextSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            testID="collaboration-back-button"
          >
            <ArrowLeft size={22} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Collaboration Board</Text>
          <View style={styles.headerSpacer} />
        </View>
        <Text style={styles.headerSubtitle}>Find opportunities to collaborate</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color={Colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search opportunities..."
            placeholderTextColor={Colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={[styles.filterButton, showFilters && styles.filterButtonActive]}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Filter size={20} color={showFilters ? Colors.background : Colors.text} />
          {activeFilterCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {showFilters && (
        <View style={styles.filtersContainer}>
          <View style={styles.filterSection}>
            <View style={styles.filterHeader}>
              <Text style={styles.filterSectionTitle}>Type</Text>
              {selectedType && (
                <TouchableOpacity onPress={() => setSelectedType(null)}>
                  <Text style={styles.clearText}>Clear</Text>
                </TouchableOpacity>
              )}
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {collaborationTypes.map((type) => (
                <FilterPill
                  key={type}
                  label={type}
                  selected={selectedType === type}
                  onPress={() => setSelectedType(selectedType === type ? null : type)}
                />
              ))}
            </ScrollView>
          </View>

          <View style={styles.filterSection}>
            <View style={styles.filterHeader}>
              <Text style={styles.filterSectionTitle}>Status</Text>
              {selectedStatus && (
                <TouchableOpacity onPress={() => setSelectedStatus(null)}>
                  <Text style={styles.clearText}>Clear</Text>
                </TouchableOpacity>
              )}
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {collaborationStatuses.map((status) => (
                <FilterPill
                  key={status}
                  label={status}
                  selected={selectedStatus === status}
                  onPress={() => setSelectedStatus(selectedStatus === status ? null : status)}
                />
              ))}
            </ScrollView>
          </View>

          <View style={styles.filterSection}>
            <View style={styles.filterHeader}>
              <Text style={styles.filterSectionTitle}>Region</Text>
              {selectedRegion && (
                <TouchableOpacity onPress={() => setSelectedRegion(null)}>
                  <Text style={styles.clearText}>Clear</Text>
                </TouchableOpacity>
              )}
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {regionOptions.map((region) => (
                <FilterPill
                  key={region}
                  label={region}
                  selected={selectedRegion === region}
                  onPress={() => setSelectedRegion(selectedRegion === region ? null : region)}
                />
              ))}
            </ScrollView>
          </View>

          <View style={styles.filterSection}>
            <View style={styles.filterHeader}>
              <Text style={styles.filterSectionTitle}>Expertise</Text>
              {selectedExpertise && (
                <TouchableOpacity onPress={() => setSelectedExpertise(null)}>
                  <Text style={styles.clearText}>Clear</Text>
                </TouchableOpacity>
              )}
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {expertiseOptions.map((exp) => (
                <FilterPill
                  key={exp}
                  label={exp}
                  selected={selectedExpertise === exp}
                  onPress={() => setSelectedExpertise(selectedExpertise === exp ? null : exp)}
                />
              ))}
            </ScrollView>
          </View>

          {activeFilterCount > 0 && (
            <TouchableOpacity style={styles.clearAllButton} onPress={clearFilters}>
              <Text style={styles.clearAllText}>Clear All Filters</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>
          {filteredCollaborations.length} opportunit{filteredCollaborations.length !== 1 ? 'ies' : 'y'}
        </Text>
      </View>

      <FlatList
        data={filteredCollaborations}
        keyExtractor={(item) => item.id}
        renderItem={renderCollaborationCard}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Briefcase size={48} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>No opportunities found</Text>
            <Text style={styles.emptyText}>Try adjusting your filters or search query</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerSpacer: {
    width: 40,
  },
  headerTitle: {
    flex: 1,
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 16,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
  },
  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: Colors.card,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: Colors.primary,
  },
  filterBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: Colors.error,
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.text,
  },
  filtersContainer: {
    backgroundColor: Colors.card,
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  filterSection: {
    marginBottom: 16,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  filterSectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  clearText: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '500',
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: Colors.cardElevated,
    borderRadius: 20,
    marginRight: 8,
  },
  filterPillSelected: {
    backgroundColor: Colors.primary,
  },
  filterPillText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  filterPillTextSelected: {
    color: Colors.background,
  },
  clearAllButton: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 4,
  },
  clearAllText: {
    fontSize: 14,
    color: Colors.error,
    fontWeight: '600',
  },
  resultsHeader: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  resultsCount: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orgInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  orgLogo: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: Colors.cardElevated,
  },
  orgText: {
    marginLeft: 10,
    flex: 1,
  },
  orgName: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
    lineHeight: 22,
  },
  cardDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 5,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  expertiseBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: Colors.cardElevated,
    borderRadius: 12,
  },
  expertiseText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  footerInfo: {
    flexDirection: 'row',
    gap: 16,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  footerText: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});
