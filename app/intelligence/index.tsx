import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import {
  Brain,
  AlertTriangle,
  Activity,
  Shield,
  TrendingUp,
  TrendingDown,
  Minus,
  MapPin,
  Clock,
  Database,
  FileText,
  Camera,
  BookOpen,
  MessageSquare,
  ChevronRight,
  Zap,
  Thermometer,
  Users,
  DollarSign,
  Heart,
  Lock,
  CheckCircle,
  Info,
  Globe,
  Layers,
  BarChart3,
  AlertCircle,
  X,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import {
  patternSummaries,
  riskSignals,
  emergingAlerts,
  dataSourceMetrics,
  complianceInfo,
  PatternSummary,
  RiskSignal,
  EmergingAlert,
} from '@/mocks/intelligence';

type TabType = 'patterns' | 'risks' | 'alerts' | 'sources';

export default function IntelligenceScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('patterns');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getTrendIcon = (trend: PatternSummary['trend']) => {
    switch (trend) {
      case 'rising':
        return <TrendingUp size={14} color={Colors.warning} />;
      case 'declining':
        return <TrendingDown size={14} color={Colors.success} />;
      default:
        return <Minus size={14} color={Colors.textMuted} />;
    }
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

  const getAlertTypeIcon = (type: EmergingAlert['type']) => {
    switch (type) {
      case 'disease':
        return <Activity size={18} color={Colors.error} />;
      case 'climate':
        return <Thermometer size={18} color="#FF8C42" />;
      case 'conflict':
        return <AlertTriangle size={18} color={Colors.error} />;
      case 'economic':
        return <DollarSign size={18} color={Colors.warning} />;
      case 'humanitarian':
        return <Heart size={18} color="#E91E63" />;
      default:
        return <AlertCircle size={18} color={Colors.textMuted} />;
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

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View style={styles.headerIcon}>
          <Brain size={28} color={Colors.primary} />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Intelligence Layer</Text>
          <Text style={styles.headerSubtitle}>
            Aggregated • Anonymized • Sovereignty-Compliant
          </Text>
        </View>
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <X size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.metricsBar}>
        <View style={styles.metricItem}>
          <Text style={styles.metricValue}>{(dataSourceMetrics.totalDataPoints / 1000).toFixed(1)}K</Text>
          <Text style={styles.metricLabel}>Data Points</Text>
        </View>
        <View style={styles.metricDivider} />
        <View style={styles.metricItem}>
          <Text style={styles.metricValue}>{dataSourceMetrics.coverageRegions}</Text>
          <Text style={styles.metricLabel}>Regions</Text>
        </View>
        <View style={styles.metricDivider} />
        <View style={styles.metricItem}>
          <Text style={styles.metricValue}>{patternSummaries.length}</Text>
          <Text style={styles.metricLabel}>Patterns</Text>
        </View>
        <View style={styles.metricDivider} />
        <View style={styles.metricItem}>
          <Text style={styles.metricValue}>{riskSignals.filter(r => r.severity === 'critical' || r.severity === 'high').length}</Text>
          <Text style={styles.metricLabel}>Active Risks</Text>
        </View>
      </View>
    </View>
  );

  const renderTabs = () => (
    <View style={styles.tabContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {[
          { key: 'patterns' as TabType, label: 'Patterns', icon: Layers },
          { key: 'risks' as TabType, label: 'Risk Signals', icon: AlertTriangle },
          { key: 'alerts' as TabType, label: 'Alerts', icon: Zap },
          { key: 'sources' as TabType, label: 'Data Sources', icon: Database },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => setActiveTab(tab.key)}
          >
            <tab.icon
              size={16}
              color={activeTab === tab.key ? Colors.primary : Colors.textMuted}
            />
            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderPatternCard = (pattern: PatternSummary) => (
    <TouchableOpacity 
      key={pattern.id} 
      style={styles.patternCard}
      onPress={() => router.push(`/intelligence/pattern-detail?id=${pattern.id}`)}
    >
      <View style={styles.patternHeader}>
        <View style={styles.confidenceBadge}>
          <Text style={styles.confidenceText}>{Math.round(pattern.confidence * 100)}% confidence</Text>
        </View>
        <View style={styles.trendBadge}>
          {getTrendIcon(pattern.trend)}
          <Text style={[styles.trendText, { color: pattern.trend === 'rising' ? Colors.warning : pattern.trend === 'declining' ? Colors.success : Colors.textMuted }]}>
            {pattern.trend}
          </Text>
        </View>
      </View>
      
      <Text style={styles.patternTitle}>{pattern.title}</Text>
      <Text style={styles.patternDescription} numberOfLines={3}>{pattern.description}</Text>
      
      <View style={styles.patternTags}>
        {pattern.regions.map((region, index) => (
          <View key={index} style={styles.regionTag}>
            <MapPin size={10} color={Colors.primary} />
            <Text style={styles.regionTagText}>{region}</Text>
          </View>
        ))}
        {pattern.issueAreas.slice(0, 2).map((area, index) => (
          <View key={index} style={styles.issueTag}>
            <Text style={styles.issueTagText}>{area}</Text>
          </View>
        ))}
      </View>
      
      <View style={styles.patternFooter}>
        <View style={styles.sourceStats}>
          <View style={styles.sourceStat}>
            <FileText size={12} color={Colors.textMuted} />
            <Text style={styles.sourceStatText}>{pattern.sources.daoReports}</Text>
          </View>
          <View style={styles.sourceStat}>
            <Camera size={12} color={Colors.textMuted} />
            <Text style={styles.sourceStatText}>{pattern.sources.onTheGround}</Text>
          </View>
          <View style={styles.sourceStat}>
            <BookOpen size={12} color={Colors.textMuted} />
            <Text style={styles.sourceStatText}>{pattern.sources.research}</Text>
          </View>
          <View style={styles.sourceStat}>
            <MessageSquare size={12} color={Colors.textMuted} />
            <Text style={styles.sourceStatText}>{pattern.sources.discussions}</Text>
          </View>
        </View>
        <View style={styles.updatedTime}>
          <Clock size={12} color={Colors.textMuted} />
          <Text style={styles.updatedTimeText}>{formatDate(pattern.lastUpdated)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderRiskCard = (risk: RiskSignal) => (
    <TouchableOpacity 
      key={risk.id} 
      style={styles.riskCard}
      onPress={() => router.push(`/intelligence/risk-detail?id=${risk.id}`)}
    >
      <View style={[styles.severityIndicator, { backgroundColor: getSeverityColor(risk.severity) }]} />
      <View style={styles.riskContent}>
        <View style={styles.riskHeader}>
          <View style={[styles.severityBadge, { backgroundColor: `${getSeverityColor(risk.severity)}20` }]}>
            <Text style={[styles.severityText, { color: getSeverityColor(risk.severity) }]}>
              {risk.severity.toUpperCase()}
            </Text>
          </View>
          <Text style={styles.riskConfidence}>{Math.round(risk.dataConfidence * 100)}% data confidence</Text>
        </View>
        
        <Text style={styles.riskTitle}>{risk.title}</Text>
        <Text style={styles.riskDescription} numberOfLines={2}>{risk.description}</Text>
        
        <View style={styles.riskMeta}>
          <View style={styles.riskLocation}>
            <MapPin size={12} color={Colors.textSecondary} />
            <Text style={styles.riskLocationText}>{risk.country}</Text>
          </View>
          {risk.affectedPopulation && (
            <View style={styles.riskPopulation}>
              <Users size={12} color={Colors.textSecondary} />
              <Text style={styles.riskPopulationText}>{risk.affectedPopulation}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.indicatorsContainer}>
          {risk.indicators.slice(0, 3).map((indicator, index) => (
            <View key={index} style={styles.indicatorPill}>
              <Text style={styles.indicatorText}>{indicator}</Text>
            </View>
          ))}
          {risk.indicators.length > 3 && (
            <Text style={styles.moreIndicators}>+{risk.indicators.length - 3}</Text>
          )}
        </View>
        
        <View style={styles.riskFooter}>
          <Text style={styles.relatedDaos}>
            {risk.relatedDAOs.length} related DAO{risk.relatedDAOs.length !== 1 ? 's' : ''}
          </Text>
          <View style={styles.detectedTime}>
            <Clock size={12} color={Colors.textMuted} />
            <Text style={styles.detectedTimeText}>{formatDate(risk.detectedAt)}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderAlertCard = (alert: EmergingAlert) => {
    const urgencyStyle = getUrgencyStyle(alert.urgency);
    
    return (
      <TouchableOpacity 
        key={alert.id} 
        style={styles.alertCard}
        onPress={() => router.push(`/intelligence/alert-detail?id=${alert.id}`)}
      >
        <View style={styles.alertHeader}>
          <View style={styles.alertTypeIcon}>
            {getAlertTypeIcon(alert.type)}
          </View>
          <View style={[styles.urgencyBadge, { backgroundColor: urgencyStyle.bg }]}>
            <Text style={[styles.urgencyText, { color: urgencyStyle.text }]}>
              {alert.urgency.toUpperCase()}
            </Text>
          </View>
        </View>
        
        <Text style={styles.alertTitle}>{alert.title}</Text>
        <Text style={styles.alertDescription} numberOfLines={2}>{alert.description}</Text>
        
        <View style={styles.alertRegions}>
          {alert.regions.map((region, index) => (
            <View key={index} style={styles.alertRegionTag}>
              <Globe size={10} color={Colors.primary} />
              <Text style={styles.alertRegionText}>{region}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.projectedImpact}>
          <BarChart3 size={14} color={Colors.warning} />
          <Text style={styles.projectedImpactText} numberOfLines={2}>{alert.projectedImpact}</Text>
        </View>
        
        <View style={styles.actionsPreview}>
          <Text style={styles.actionsTitle}>Recommended Actions</Text>
          {alert.recommendedActions.slice(0, 2).map((action, index) => (
            <View key={index} style={styles.actionItem}>
              <ChevronRight size={12} color={Colors.primary} />
              <Text style={styles.actionText} numberOfLines={1}>{action}</Text>
            </View>
          ))}
          {alert.recommendedActions.length > 2 && (
            <Text style={styles.moreActions}>+{alert.recommendedActions.length - 2} more actions</Text>
          )}
        </View>
        
        <View style={styles.alertFooter}>
          <Text style={styles.dataSourceCount}>{alert.dataSourceCount} data sources</Text>
          <View style={styles.detectedTime}>
            <Clock size={12} color={Colors.textMuted} />
            <Text style={styles.detectedTimeText}>{formatDate(alert.detectedAt)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderDataSources = () => (
    <View style={styles.dataSourcesContainer}>
      <View style={styles.sourceOverview}>
        <Text style={styles.sectionTitle}>Data Source Overview</Text>
        <Text style={styles.lastAggregation}>
          Last aggregation: {formatDate(dataSourceMetrics.lastAggregation)}
        </Text>
      </View>
      
      <View style={styles.sourceCardsGrid}>
        <View style={styles.sourceCard}>
          <View style={[styles.sourceCardIcon, { backgroundColor: 'rgba(45, 179, 160, 0.15)' }]}>
            <FileText size={24} color={Colors.primary} />
          </View>
          <Text style={styles.sourceCardValue}>{dataSourceMetrics.daoReportsProcessed.toLocaleString()}</Text>
          <Text style={styles.sourceCardLabel}>DAO Reports</Text>
          <Text style={styles.sourceCardDesc}>Milestone reports, progress updates, financial disclosures</Text>
        </View>
        
        <View style={styles.sourceCard}>
          <View style={[styles.sourceCardIcon, { backgroundColor: 'rgba(93, 187, 138, 0.15)' }]}>
            <Camera size={24} color={Colors.success} />
          </View>
          <Text style={styles.sourceCardValue}>{dataSourceMetrics.onTheGroundUploads.toLocaleString()}</Text>
          <Text style={styles.sourceCardLabel}>On the Ground</Text>
          <Text style={styles.sourceCardDesc}>Practitioner photos, videos, field updates</Text>
        </View>
        
        <View style={styles.sourceCard}>
          <View style={[styles.sourceCardIcon, { backgroundColor: 'rgba(212, 168, 83, 0.15)' }]}>
            <BookOpen size={24} color={Colors.warning} />
          </View>
          <Text style={styles.sourceCardValue}>{dataSourceMetrics.researchActivities.toLocaleString()}</Text>
          <Text style={styles.sourceCardLabel}>Research Activity</Text>
          <Text style={styles.sourceCardDesc}>Academic submissions, preprints, datasets</Text>
        </View>
        
        <View style={styles.sourceCard}>
          <View style={[styles.sourceCardIcon, { backgroundColor: 'rgba(139, 115, 85, 0.15)' }]}>
            <MessageSquare size={24} color={Colors.clay} />
          </View>
          <Text style={styles.sourceCardValue}>{(dataSourceMetrics.discussionSignals / 1000).toFixed(1)}K</Text>
          <Text style={styles.sourceCardLabel}>Discussion Signals</Text>
          <Text style={styles.sourceCardDesc}>Community discussions, expert validations</Text>
        </View>
      </View>
      
      <View style={styles.complianceSection}>
        <View style={styles.complianceHeader}>
          <Shield size={20} color={Colors.primary} />
          <Text style={styles.complianceTitle}>Data Governance & Compliance</Text>
        </View>
        
        <View style={styles.complianceGrid}>
          <View style={styles.complianceItem}>
            <Lock size={16} color={Colors.textSecondary} />
            <View style={styles.complianceItemContent}>
              <Text style={styles.complianceItemLabel}>Anonymization</Text>
              <Text style={styles.complianceItemValue}>{complianceInfo.anonymizationLevel}</Text>
            </View>
          </View>
          
          <View style={styles.complianceItem}>
            <Layers size={16} color={Colors.textSecondary} />
            <View style={styles.complianceItemContent}>
              <Text style={styles.complianceItemLabel}>Aggregation Threshold</Text>
              <Text style={styles.complianceItemValue}>{complianceInfo.aggregationThreshold}</Text>
            </View>
          </View>
          
          <View style={styles.complianceItem}>
            <Clock size={16} color={Colors.textSecondary} />
            <View style={styles.complianceItemContent}>
              <Text style={styles.complianceItemLabel}>Data Retention</Text>
              <Text style={styles.complianceItemValue}>{complianceInfo.dataRetentionDays} days rolling window</Text>
            </View>
          </View>
          
          <View style={styles.complianceItem}>
            <CheckCircle size={16} color={Colors.textSecondary} />
            <View style={styles.complianceItemContent}>
              <Text style={styles.complianceItemLabel}>Audit Frequency</Text>
              <Text style={styles.complianceItemValue}>{complianceInfo.auditFrequency}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.sovereigntyCompliance}>
          <Text style={styles.sovereigntyTitle}>Sovereignty Compliance</Text>
          <View style={styles.sovereigntyTags}>
            {complianceInfo.sovereigntyCompliance.map((item, index) => (
              <View key={index} style={styles.sovereigntyTag}>
                <CheckCircle size={10} color={Colors.success} />
                <Text style={styles.sovereigntyTagText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>
        
        <View style={styles.certifications}>
          <Text style={styles.certificationsTitle}>Certifications</Text>
          <View style={styles.certificationBadges}>
            {complianceInfo.certifications.map((cert, index) => (
              <View key={index} style={styles.certificationBadge}>
                <Shield size={12} color={Colors.primary} />
                <Text style={styles.certificationText}>{cert}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
      
      <View style={styles.disclaimerBox}>
        <Info size={16} color={Colors.textMuted} />
        <Text style={styles.disclaimerText}>
          All intelligence is derived from aggregated, anonymized data. Individual contributions cannot be traced. 
          Insights are for situational awareness only and should not replace expert judgment.
        </Text>
      </View>
    </View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'patterns':
        return (
          <View style={styles.contentSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Pattern Detection</Text>
              <Text style={styles.sectionSubtitle}>{patternSummaries.length} patterns identified</Text>
            </View>
            {patternSummaries.map(renderPatternCard)}
          </View>
        );
      case 'risks':
        return (
          <View style={styles.contentSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Regional Risk Signals</Text>
              <Text style={styles.sectionSubtitle}>{riskSignals.length} active signals</Text>
            </View>
            {riskSignals.map(renderRiskCard)}
          </View>
        );
      case 'alerts':
        return (
          <View style={styles.contentSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Emerging Alerts</Text>
              <Text style={styles.sectionSubtitle}>Disease, climate & humanitarian</Text>
            </View>
            {emergingAlerts.map(renderAlertCard)}
          </View>
        );
      case 'sources':
        return renderDataSources();
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
          />
        }
      >
        {renderHeader()}
        {renderTabs()}
        {renderContent()}
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
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(45, 179, 160, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  headerText: {
    flex: 1,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  metricsBar: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  metricLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  metricDivider: {
    width: 1,
    height: 32,
    backgroundColor: Colors.border,
  },
  tabContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: Colors.card,
    gap: 6,
  },
  tabActive: {
    backgroundColor: 'rgba(45, 179, 160, 0.15)',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  tabTextActive: {
    color: Colors.primary,
  },
  contentSection: {
    paddingHorizontal: 16,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  patternCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  patternHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  confidenceBadge: {
    backgroundColor: 'rgba(45, 179, 160, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  confidenceText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.primary,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  patternTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
    lineHeight: 22,
  },
  patternDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  patternTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  regionTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(45, 179, 160, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  regionTagText: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: '500',
  },
  issueTag: {
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  issueTagText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  patternFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  sourceStats: {
    flexDirection: 'row',
    gap: 12,
  },
  sourceStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sourceStatText: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  updatedTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  updatedTimeText: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  riskCard: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
  },
  severityIndicator: {
    width: 4,
  },
  riskContent: {
    flex: 1,
    padding: 16,
  },
  riskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  severityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  severityText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  riskConfidence: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  riskTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 6,
    lineHeight: 20,
  },
  riskDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 10,
  },
  riskMeta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 10,
  },
  riskLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  riskLocationText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  riskPopulation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  riskPopulationText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  indicatorsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  indicatorPill: {
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  indicatorText: {
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  moreIndicators: {
    fontSize: 10,
    color: Colors.textMuted,
    alignSelf: 'center',
  },
  riskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  relatedDaos: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: '500',
  },
  detectedTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detectedTimeText: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  alertCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  alertTypeIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  urgencyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  urgencyText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  alertTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 6,
    lineHeight: 20,
  },
  alertDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 10,
  },
  alertRegions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  alertRegionTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(45, 179, 160, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  alertRegionText: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: '500',
  },
  projectedImpact: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(212, 168, 83, 0.1)',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    gap: 10,
  },
  projectedImpactText: {
    flex: 1,
    fontSize: 12,
    color: Colors.warning,
    lineHeight: 18,
    fontWeight: '500',
  },
  actionsPreview: {
    marginBottom: 12,
  },
  actionsTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textMuted,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  actionText: {
    flex: 1,
    fontSize: 12,
    color: Colors.textSecondary,
  },
  moreActions: {
    fontSize: 11,
    color: Colors.primary,
    marginTop: 4,
  },
  alertFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  dataSourceCount: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  dataSourcesContainer: {
    paddingHorizontal: 16,
  },
  sourceOverview: {
    marginBottom: 16,
  },
  lastAggregation: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 4,
  },
  sourceCardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  sourceCard: {
    width: '48%',
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    minWidth: 150,
    flexGrow: 1,
  },
  sourceCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  sourceCardValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  sourceCardLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  sourceCardDesc: {
    fontSize: 11,
    color: Colors.textMuted,
    lineHeight: 16,
  },
  complianceSection: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  complianceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  complianceTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  complianceGrid: {
    gap: 12,
    marginBottom: 16,
  },
  complianceItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  complianceItemContent: {
    flex: 1,
  },
  complianceItemLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  complianceItemValue: {
    fontSize: 13,
    color: Colors.text,
    fontWeight: '500',
  },
  sovereigntyCompliance: {
    marginBottom: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  sovereigntyTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textMuted,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sovereigntyTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sovereigntyTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(93, 187, 138, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  sovereigntyTagText: {
    fontSize: 11,
    color: Colors.success,
    fontWeight: '500',
  },
  certifications: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  certificationsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textMuted,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  certificationBadges: {
    flexDirection: 'row',
    gap: 10,
  },
  certificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(45, 179, 160, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  certificationText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
  },
  disclaimerBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    padding: 14,
    gap: 10,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 11,
    color: Colors.textMuted,
    lineHeight: 16,
  },
  bottomPadding: {
    height: 40,
  },
});
