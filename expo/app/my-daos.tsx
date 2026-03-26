import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Users,
  ChevronRight,
  Clock,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { daos, DAO, getDAOProgress } from '@/mocks/daos';

const userDAOs = daos.slice(0, 4);

export default function MyDAOsScreen() {
  const router = useRouter();

  const getStatusColor = (status: DAO['status']) => {
    switch (status) {
      case 'active':
        return Colors.success;
      case 'completed':
        return Colors.primary;
      case 'paused':
        return Colors.warning;
      default:
        return Colors.textMuted;
    }
  };

  const renderDAOCard = ({ item }: { item: DAO }) => {
    const progress = getDAOProgress(item);

    return (
      <TouchableOpacity
        style={styles.daoCard}
        onPress={() => router.push(`/dao/${item.id}`)}
        activeOpacity={0.7}
        testID={`dao-card-${item.id}`}
      >
        <Image source={{ uri: item.imageUrl }} style={styles.daoImage} />
        <View style={styles.daoContent}>
          <View style={styles.daoHeader}>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
              <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
              <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </Text>
            </View>
            <View style={styles.typeBadge}>
              <Text style={styles.typeText}>{item.type === 'proposal' ? 'Proposal' : 'Ask'}</Text>
            </View>
          </View>

          <Text style={styles.daoName} numberOfLines={2}>{item.name}</Text>

          <View style={styles.daoMeta}>
            <View style={styles.metaItem}>
              <MapPin size={12} color={Colors.textMuted} />
              <Text style={styles.metaText}>{item.country}</Text>
            </View>
            <View style={styles.metaItem}>
              <Building2 size={12} color={Colors.textMuted} />
              <Text style={styles.metaText}>{item.issueArea}</Text>
            </View>
          </View>

          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Funding Progress</Text>
              <Text style={styles.progressValue}>{progress.toFixed(0)}%</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${Math.min(progress, 100)}%` }]} />
            </View>
            <View style={styles.fundingDetails}>
              <Text style={styles.fundingText}>
                ${(item.totalDisbursed / 1000).toFixed(0)}K / ${(item.capitalRaised / 1000).toFixed(0)}K {item.currency}
              </Text>
            </View>
          </View>

          <View style={styles.daoFooter}>
            <View style={styles.footerItem}>
              <Users size={14} color={Colors.textSecondary} />
              <Text style={styles.footerText}>{item.votingRights.memberCount} members</Text>
            </View>
            <View style={styles.footerItem}>
              <Clock size={14} color={Colors.textSecondary} />
              <Text style={styles.footerText}>
                {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </Text>
            </View>
            <ChevronRight size={18} color={Colors.textMuted} />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          testID="my-daos-back-button"
        >
          <ArrowLeft size={22} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My DAOs</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{userDAOs.length}</Text>
          <Text style={styles.statLabel}>Total DAOs</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{userDAOs.filter(d => d.status === 'active').length}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{userDAOs.filter(d => d.status === 'completed').length}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
      </View>

      <FlatList
        data={userDAOs}
        keyExtractor={(item) => item.id}
        renderItem={renderDAOCard}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Building2 size={48} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>No DAOs yet</Text>
            <Text style={styles.emptyText}>
              DAOs you create or participate in will appear here
            </Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
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
    flex: 1,
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.border,
    marginHorizontal: 8,
  },
  listContent: {
    padding: 20,
    paddingTop: 12,
  },
  daoCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  daoImage: {
    width: '100%',
    height: 140,
  },
  daoContent: {
    padding: 16,
  },
  daoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  typeBadge: {
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: Colors.textSecondary,
  },
  daoName: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 10,
    lineHeight: 22,
  },
  daoMeta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 14,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  progressSection: {
    marginBottom: 14,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
  },
  progressValue: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  fundingDetails: {
    marginTop: 6,
  },
  fundingText: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  daoFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 16,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  footerText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
