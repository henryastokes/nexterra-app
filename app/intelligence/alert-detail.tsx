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
  Clock,
  Globe,
  Zap,
  Activity,
  Thermometer,
  AlertTriangle,
  DollarSign,
  Heart,
  ChevronRight,
  AlertCircle,
  BarChart3,
  Database,
  Shield,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { emergingAlerts, EmergingAlert } from '@/mocks/intelligence';

export default function AlertDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  
  const alert = emergingAlerts.find(a => a.id === id);

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

  const getAlertTypeIcon = (type: EmergingAlert['type']) => {
    switch (type) {
      case 'disease':
        return <Activity size={24} color={Colors.error} />;
      case 'climate':
        return <Thermometer size={24} color="#FF8C42" />;
      case 'conflict':
        return <AlertTriangle size={24} color={Colors.error} />;
      case 'economic':
        return <DollarSign size={24} color={Colors.warning} />;
      case 'humanitarian':
        return <Heart size={24} color="#E91E63" />;
      default:
        return <AlertCircle size={24} color={Colors.textMuted} />;
    }
  };

  const getAlertTypeLabel = (type: EmergingAlert['type']) => {
    switch (type) {
      case 'disease':
        return 'Disease Alert';
      case 'climate':
        return 'Climate Alert';
      case 'conflict':
        return 'Conflict Alert';
      case 'economic':
        return 'Economic Alert';
      case 'humanitarian':
        return 'Humanitarian Alert';
      default:
        return 'Alert';
    }
  };

  const getUrgencyStyle = (urgency: EmergingAlert['urgency']) => {
    switch (urgency) {
      case 'immediate':
        return { bg: 'rgba(239, 83, 80, 0.15)', text: Colors.error };
      case 'developing':
        return { bg: 'rgba(212, 168, 83, 0.15)', text: Colors.warning };
      default:
        return { bg: 'rgba(45, 179, 160, 0.15)', text: Colors.primary };
    }
  };

  const getUrgencyLabel = (urgency: EmergingAlert['urgency']) => {
    switch (urgency) {
      case 'immediate':
        return 'Immediate Action Required';
      case 'developing':
        return 'Developing Situation';
      default:
        return 'Monitoring';
    }
  };

  if (!alert) {
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
          <Text style={styles.errorText}>Alert not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const urgencyStyle = getUrgencyStyle(alert.urgency);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Zap size={24} color={urgencyStyle.text} />
          <Text style={styles.headerTitle}>Emerging Alert</Text>
        </View>
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <X size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={[styles.urgencyBanner, { backgroundColor: urgencyStyle.bg }]}>
          <View style={styles.urgencyContent}>
            <View style={styles.alertTypeRow}>
              {getAlertTypeIcon(alert.type)}
              <Text style={[styles.alertTypeLabel, { color: urgencyStyle.text }]}>
                {getAlertTypeLabel(alert.type)}
              </Text>
            </View>
            <View style={[styles.urgencyBadge, { backgroundColor: `${urgencyStyle.text}20` }]}>
              <Text style={[styles.urgencyBadgeText, { color: urgencyStyle.text }]}>
                {alert.urgency.toUpperCase()}
              </Text>
            </View>
          </View>
          <Text style={[styles.urgencyLabel, { color: urgencyStyle.text }]}>
            {getUrgencyLabel(alert.urgency)}
          </Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{alert.title}</Text>
          <Text style={styles.description}>{alert.description}</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Affected Regions</Text>
            <View style={styles.regionsContainer}>
              {alert.regions.map((region, index) => (
                <View key={index} style={styles.regionTag}>
                  <Globe size={14} color={Colors.primary} />
                  <Text style={styles.regionText}>{region}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projected Impact</Text>
            <View style={styles.impactCard}>
              <BarChart3 size={20} color={Colors.warning} />
              <Text style={styles.impactText}>{alert.projectedImpact}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recommended Actions</Text>
            {alert.recommendedActions.map((action, index) => (
              <View key={index} style={styles.actionItem}>
                <View style={styles.actionNumber}>
                  <Text style={styles.actionNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.actionText}>{action}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Alert Details</Text>
            <View style={styles.detailsCard}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Alert Type</Text>
                <Text style={styles.detailValue}>{alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Urgency Level</Text>
                <View style={[styles.urgencyPill, { backgroundColor: urgencyStyle.bg }]}>
                  <Text style={[styles.urgencyPillText, { color: urgencyStyle.text }]}>
                    {alert.urgency.charAt(0).toUpperCase() + alert.urgency.slice(1)}
                  </Text>
                </View>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Data Sources</Text>
                <View style={styles.dataSourceBadge}>
                  <Database size={12} color={Colors.primary} />
                  <Text style={styles.dataSourceText}>{alert.dataSourceCount} sources</Text>
                </View>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Detection Date</Text>
                <Text style={styles.detailValue}>{formatDate(alert.detectedAt)}</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Related Resources</Text>
            {['View related DAO activities', 'Access field reports', 'Review historical data'].map((resource, index) => (
              <TouchableOpacity key={index} style={styles.resourceItem}>
                <Text style={styles.resourceText}>{resource}</Text>
                <ChevronRight size={16} color={Colors.primary} />
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.complianceNote}>
            <Shield size={16} color={Colors.textMuted} />
            <Text style={styles.complianceText}>
              This alert is generated from {alert.dataSourceCount} aggregated, anonymized data sources. 
              All data processing complies with regional data sovereignty requirements.
            </Text>
          </View>

          <View style={styles.footer}>
            <Clock size={14} color={Colors.textMuted} />
            <Text style={styles.footerText}>Detected: {formatDate(alert.detectedAt)}</Text>
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
  urgencyBanner: {
    margin: 20,
    marginBottom: 0,
    borderRadius: 16,
    padding: 20,
  },
  urgencyContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  alertTypeLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  urgencyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  urgencyBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  urgencyLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    padding: 20,
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
  regionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  regionTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(45, 179, 160, 0.1)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
  },
  regionText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  impactCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(212, 168, 83, 0.1)',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  impactText: {
    flex: 1,
    fontSize: 14,
    color: Colors.warning,
    lineHeight: 22,
    fontWeight: '500',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    gap: 14,
  },
  actionNumber: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(45, 179, 160, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionNumberText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  actionText: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
    lineHeight: 22,
  },
  detailsCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    gap: 14,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  detailValue: {
    fontSize: 13,
    color: Colors.text,
    fontWeight: '500',
  },
  urgencyPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  urgencyPillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  dataSourceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(45, 179, 160, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 6,
  },
  dataSourceText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  resourceText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
  complianceNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 10,
    padding: 14,
    gap: 10,
    marginBottom: 20,
  },
  complianceText: {
    flex: 1,
    fontSize: 12,
    color: Colors.textMuted,
    lineHeight: 18,
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
