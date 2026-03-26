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
  MapPin,
  Clock,
  Users,
  AlertTriangle,
  Shield,
  ChevronRight,
  AlertCircle,
  FileText,
  Activity,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { riskSignals, RiskSignal } from '@/mocks/intelligence';

export default function RiskDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  
  const risk = riskSignals.find(r => r.id === id);

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

  const getSeverityColor = (severity: RiskSignal['severity']) => {
    switch (severity) {
      case 'critical':
        return Colors.error;
      case 'high':
        return '#FF8C42';
      case 'moderate':
        return Colors.warning;
      default:
        return Colors.textMuted;
    }
  };

  const getSeverityLabel = (severity: RiskSignal['severity']) => {
    switch (severity) {
      case 'critical':
        return 'Critical Risk';
      case 'high':
        return 'High Risk';
      case 'moderate':
        return 'Moderate Risk';
      default:
        return 'Low Risk';
    }
  };

  if (!risk) {
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
          <Text style={styles.errorText}>Risk signal not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const severityColor = getSeverityColor(risk.severity);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <AlertTriangle size={24} color={severityColor} />
          <Text style={styles.headerTitle}>Risk Signal</Text>
        </View>
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <X size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={[styles.severityBanner, { backgroundColor: `${severityColor}15` }]}>
          <View style={[styles.severityIndicator, { backgroundColor: severityColor }]} />
          <View style={styles.severityContent}>
            <Text style={[styles.severityLabel, { color: severityColor }]}>
              {getSeverityLabel(risk.severity)}
            </Text>
            <Text style={styles.severityConfidence}>
              {Math.round(risk.dataConfidence * 100)}% data confidence
            </Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{risk.title}</Text>
          <Text style={styles.description}>{risk.description}</Text>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <MapPin size={16} color={Colors.primary} />
              <View>
                <Text style={styles.metaLabel}>Location</Text>
                <Text style={styles.metaValue}>{risk.region}, {risk.country}</Text>
              </View>
            </View>
            {risk.affectedPopulation && (
              <View style={styles.metaItem}>
                <Users size={16} color={Colors.primary} />
                <View>
                  <Text style={styles.metaLabel}>Affected Population</Text>
                  <Text style={styles.metaValue}>{risk.affectedPopulation}</Text>
                </View>
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Risk Indicators</Text>
            <View style={styles.indicatorsList}>
              {risk.indicators.map((indicator, index) => (
                <View key={index} style={styles.indicatorItem}>
                  <Activity size={14} color={severityColor} />
                  <Text style={styles.indicatorText}>{indicator}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Related DAOs</Text>
            {risk.relatedDAOs.length > 0 ? (
              <View style={styles.daosList}>
                {risk.relatedDAOs.map((dao, index) => (
                  <TouchableOpacity key={index} style={styles.daoItem}>
                    <View style={styles.daoIcon}>
                      <FileText size={16} color={Colors.primary} />
                    </View>
                    <Text style={styles.daoName}>{dao}</Text>
                    <ChevronRight size={16} color={Colors.textMuted} />
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <Text style={styles.noDataText}>No related DAOs found</Text>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Risk Assessment</Text>
            <View style={styles.assessmentCard}>
              <View style={styles.assessmentRow}>
                <Text style={styles.assessmentLabel}>Severity Level</Text>
                <View style={[styles.severityBadge, { backgroundColor: `${severityColor}20` }]}>
                  <Text style={[styles.severityBadgeText, { color: severityColor }]}>
                    {risk.severity.toUpperCase()}
                  </Text>
                </View>
              </View>
              <View style={styles.assessmentRow}>
                <Text style={styles.assessmentLabel}>Data Confidence</Text>
                <View style={styles.confidenceBar}>
                  <View style={[styles.confidenceFill, { width: `${risk.dataConfidence * 100}%` }]} />
                </View>
                <Text style={styles.confidenceValue}>{Math.round(risk.dataConfidence * 100)}%</Text>
              </View>
              <View style={styles.assessmentRow}>
                <Text style={styles.assessmentLabel}>Detection Date</Text>
                <Text style={styles.assessmentValue}>{formatDate(risk.detectedAt)}</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recommended Actions</Text>
            {['Review related DAO activities in this region', 'Monitor field reports for updates', 'Coordinate with local practitioners', 'Assess funding allocation if applicable'].map((action, index) => (
              <View key={index} style={styles.actionItem}>
                <ChevronRight size={14} color={Colors.primary} />
                <Text style={styles.actionText}>{action}</Text>
              </View>
            ))}
          </View>

          <View style={styles.complianceNote}>
            <Shield size={16} color={Colors.textMuted} />
            <Text style={styles.complianceText}>
              This risk signal is derived from aggregated, anonymized data sources in compliance with data sovereignty requirements.
            </Text>
          </View>

          <View style={styles.footer}>
            <Clock size={14} color={Colors.textMuted} />
            <Text style={styles.footerText}>Detected: {formatDate(risk.detectedAt)}</Text>
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
  severityBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 20,
    marginBottom: 0,
    borderRadius: 12,
    overflow: 'hidden',
  },
  severityIndicator: {
    width: 6,
    alignSelf: 'stretch',
  },
  severityContent: {
    flex: 1,
    padding: 16,
  },
  severityLabel: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  severityConfidence: {
    fontSize: 13,
    color: Colors.textMuted,
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
    marginBottom: 20,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 24,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    flex: 1,
  },
  metaLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '600',
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
  indicatorsList: {
    gap: 10,
  },
  indicatorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 10,
    padding: 14,
    gap: 12,
  },
  indicatorText: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
  },
  daosList: {
    gap: 8,
  },
  daoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 14,
    gap: 12,
  },
  daoIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(45, 179, 160, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  daoName: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
  noDataText: {
    fontSize: 14,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
  assessmentCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    gap: 16,
  },
  assessmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  assessmentLabel: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  assessmentValue: {
    fontSize: 13,
    color: Colors.text,
    fontWeight: '500',
  },
  severityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  severityBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  confidenceBar: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 3,
    marginHorizontal: 12,
    overflow: 'hidden',
  },
  confidenceFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  confidenceValue: {
    fontSize: 13,
    color: Colors.text,
    fontWeight: '600',
    width: 40,
    textAlign: 'right',
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
