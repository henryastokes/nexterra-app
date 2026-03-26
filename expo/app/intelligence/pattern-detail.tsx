import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import {
  X,
  TrendingUp,
  TrendingDown,
  Minus,
  MapPin,
  Clock,
  FileText,
  Camera,
  BookOpen,
  MessageSquare,
  Layers,
  BarChart3,
  AlertCircle,
  ChevronRight,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { patternSummaries, PatternSummary } from '@/mocks/intelligence';

export default function PatternDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  
  const pattern = patternSummaries.find(p => p.id === id);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTrendIcon = (trend: PatternSummary['trend']) => {
    switch (trend) {
      case 'rising':
        return <TrendingUp size={18} color={Colors.warning} />;
      case 'declining':
        return <TrendingDown size={18} color={Colors.success} />;
      default:
        return <Minus size={18} color={Colors.textMuted} />;
    }
  };

  const getTrendColor = (trend: PatternSummary['trend']) => {
    switch (trend) {
      case 'rising':
        return Colors.warning;
      case 'declining':
        return Colors.success;
      default:
        return Colors.textMuted;
    }
  };

  if (!pattern) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
            <X size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>
        <View style={styles.errorContainer}>
          <AlertCircle size={48} color={Colors.textMuted} />
          <Text style={styles.errorText}>Pattern not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Layers size={24} color={Colors.primary} />
          <Text style={styles.headerTitle}>Pattern Detection</Text>
        </View>
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <X size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.badgeRow}>
            <View style={styles.confidenceBadge}>
              <BarChart3 size={14} color={Colors.primary} />
              <Text style={styles.confidenceText}>{Math.round(pattern.confidence * 100)}% confidence</Text>
            </View>
            <View style={[styles.trendBadge, { backgroundColor: `${getTrendColor(pattern.trend)}15` }]}>
              {getTrendIcon(pattern.trend)}
              <Text style={[styles.trendText, { color: getTrendColor(pattern.trend) }]}>
                {pattern.trend.charAt(0).toUpperCase() + pattern.trend.slice(1)} Trend
              </Text>
            </View>
          </View>

          <Text style={styles.title}>{pattern.title}</Text>
          <Text style={styles.description}>{pattern.description}</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Affected Regions</Text>
            <View style={styles.tagsContainer}>
              {pattern.regions.map((region, index) => (
                <View key={index} style={styles.regionTag}>
                  <MapPin size={12} color={Colors.primary} />
                  <Text style={styles.regionTagText}>{region}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Issue Areas</Text>
            <View style={styles.tagsContainer}>
              {pattern.issueAreas.map((area, index) => (
                <View key={index} style={styles.issueTag}>
                  <Text style={styles.issueTagText}>{area}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Data Sources</Text>
            <View style={styles.sourcesGrid}>
              <View style={styles.sourceCard}>
                <View style={[styles.sourceIcon, { backgroundColor: 'rgba(45, 179, 160, 0.15)' }]}>
                  <FileText size={20} color={Colors.primary} />
                </View>
                <Text style={styles.sourceValue}>{pattern.sources.daoReports}</Text>
                <Text style={styles.sourceLabel}>DAO Reports</Text>
              </View>
              <View style={styles.sourceCard}>
                <View style={[styles.sourceIcon, { backgroundColor: 'rgba(93, 187, 138, 0.15)' }]}>
                  <Camera size={20} color={Colors.success} />
                </View>
                <Text style={styles.sourceValue}>{pattern.sources.onTheGround}</Text>
                <Text style={styles.sourceLabel}>On the Ground</Text>
              </View>
              <View style={styles.sourceCard}>
                <View style={[styles.sourceIcon, { backgroundColor: 'rgba(212, 168, 83, 0.15)' }]}>
                  <BookOpen size={20} color={Colors.warning} />
                </View>
                <Text style={styles.sourceValue}>{pattern.sources.research}</Text>
                <Text style={styles.sourceLabel}>Research</Text>
              </View>
              <View style={styles.sourceCard}>
                <View style={[styles.sourceIcon, { backgroundColor: 'rgba(139, 115, 85, 0.15)' }]}>
                  <MessageSquare size={20} color={Colors.clay} />
                </View>
                <Text style={styles.sourceValue}>{pattern.sources.discussions}</Text>
                <Text style={styles.sourceLabel}>Discussions</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Analysis Insights</Text>
            <View style={styles.insightCard}>
              <Text style={styles.insightText}>
                This pattern has been detected through cross-referencing multiple data sources. 
                The {pattern.trend} trend indicates {pattern.trend === 'rising' ? 'increasing' : pattern.trend === 'declining' ? 'decreasing' : 'stable'} activity 
                in the affected regions.
              </Text>
            </View>
            <View style={styles.insightCard}>
              <Text style={styles.insightText}>
                {pattern.sources.daoReports + pattern.sources.onTheGround + pattern.sources.research + pattern.sources.discussions} total 
                data points contribute to this pattern with {Math.round(pattern.confidence * 100)}% confidence level.
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recommended Actions</Text>
            {['Monitor related DAOs for updates', 'Review recent field reports from affected regions', 'Cross-reference with academic research'].map((action, index) => (
              <View key={index} style={styles.actionItem}>
                <ChevronRight size={14} color={Colors.primary} />
                <Text style={styles.actionText}>{action}</Text>
              </View>
            ))}
          </View>

          <View style={styles.footer}>
            <Clock size={14} color={Colors.textMuted} />
            <Text style={styles.footerText}>Last updated: {formatDate(pattern.lastUpdated)}</Text>
          </View>
        </View>
        <View style={styles.bottomPadding} />
      </ScrollView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  confidenceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(45, 179, 160, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  confidenceText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  trendText: {
    fontSize: 13,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
    lineHeight: 32,
  },
  description: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 24,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  regionTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(45, 179, 160, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
  },
  regionTagText: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '500',
  },
  issueTag: {
    backgroundColor: Colors.card,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  issueTagText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  sourcesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  sourceCard: {
    width: '47%',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  sourceIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  sourceValue: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  sourceLabel: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  insightCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },
  insightText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    gap: 10,
  },
  actionText: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  footerText: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  errorText: {
    fontSize: 16,
    color: Colors.textMuted,
  },
  bottomPadding: {
    height: 40,
  },
});
