import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  MapPin,
  Tag,
  ThermometerSun,
  Calendar,
  BookOpen,
  Building2,
  Quote,
  ExternalLink,
  Sparkles,
  FileText,
  Lock,
  Unlock,
  ArrowRight,
  Users,
  TrendingUp,
  Award,
  ChevronRight,
  Vote,
  Layers,
  Compass,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { academicPapers } from '@/mocks/academicResearch';
import { generateText } from '@rork-ai/toolkit-sdk';
import { useMutation } from '@tanstack/react-query';

const fundingReadinessColors: Record<string, string> = {
  high: Colors.success,
  medium: Colors.warning,
  low: Colors.error,
};

const focusAreaLabels: Record<string, string> = {
  climate_adaptation: 'Climate Adaptation & Mitigation',
  pandemic_prevention: 'Pandemic Prevention',
  disease_surveillance: 'Disease Surveillance',
  public_health: 'Public Health Systems',
  environmental_health: 'Environmental Health',
};

const getImpactScoreColor = (score: number) => {
  if (score >= 80) return Colors.success;
  if (score >= 60) return Colors.primary;
  if (score >= 40) return Colors.warning;
  return Colors.textMuted;
};

const initiativeIcons: Record<string, React.ComponentType<{ size: number; color: string }>> = {
  dao: Users,
  proposal: Vote,
  field_work: Compass,
};

export default function ResearchDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [keyInsights, setKeyInsights] = useState<string[] | null>(null);

  const paper = useMemo(() => {
    return academicPapers.find((p) => p.id === id);
  }, [id]);

  const summarizeMutation = useMutation({
    mutationFn: async () => {
      if (!paper) return null;
      const prompt = `Provide a comprehensive but concise summary (3-4 sentences) of this research paper for potential funders and DAO members. Focus on methodology, key findings, and real-world impact for African communities.

Title: ${paper.title}
Authors: ${paper.authors.join(', ')}
Institution: ${paper.institution}
Abstract: ${paper.abstract}`;

      return await generateText(prompt);
    },
    onSuccess: (data) => {
      if (data) setAiSummary(data);
    },
  });

  const insightsMutation = useMutation({
    mutationFn: async () => {
      if (!paper) return null;
      const prompt = `Extract exactly 4 key insights from this research paper as bullet points. Each insight should be one sentence highlighting actionable findings or important discoveries. Return only the bullet points, one per line.

Title: ${paper.title}
Abstract: ${paper.abstract}`;

      const result = await generateText(prompt);
      return result.split('\n').filter((line) => line.trim().length > 0).slice(0, 4);
    },
    onSuccess: (data) => {
      if (data) setKeyInsights(data);
    },
  });

  const { mutate: generateSummary } = summarizeMutation;
  const { mutate: extractInsights } = insightsMutation;

  const handleGenerateSummary = useCallback(() => {
    if (!aiSummary) {
      generateSummary();
    }
  }, [aiSummary, generateSummary]);

  const handleGenerateInsights = useCallback(() => {
    if (!keyInsights) {
      extractInsights();
    }
  }, [keyInsights, extractInsights]);

  const handleOpenDOI = useCallback(() => {
    if (paper?.doi) {
      Linking.openURL(`https://doi.org/${paper.doi}`);
    }
  }, [paper]);

  const handleConvertToProposal = useCallback(() => {
    Alert.alert(
      'Convert to Proposal',
      'This will create a funding proposal based on this research. Authors will be notified and can customize the proposal details.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Create Proposal', 
          onPress: () => {
            Alert.alert('Success', 'Proposal draft created! The research team has been notified.');
          }
        },
      ]
    );
  }, []);

  if (!paper) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Not Found' }} />
        <View style={styles.errorState}>
          <BookOpen size={48} color={Colors.textMuted} />
          <Text style={styles.errorTitle}>Paper not found</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: '',
          headerStyle: { backgroundColor: Colors.background },
          headerTintColor: Colors.text,
          headerTransparent: true,
        }}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <Image source={{ uri: paper.imageUrl }} style={styles.heroImage} />
        
        <View style={styles.mainContent}>
          <View style={styles.headerSection}>
            <View style={styles.badges}>
              <View style={styles.accessBadge}>
                {paper.isOpenAccess ? (
                  <>
                    <Unlock size={12} color={Colors.success} />
                    <Text style={[styles.accessText, { color: Colors.success }]}>Open Access</Text>
                  </>
                ) : (
                  <>
                    <Lock size={12} color={Colors.warning} />
                    <Text style={[styles.accessText, { color: Colors.warning }]}>Metadata Only</Text>
                  </>
                )}
              </View>
              <View style={[styles.fundingBadge, { backgroundColor: fundingReadinessColors[paper.tags.fundingReadiness] + '20' }]}>
                <Text style={[styles.fundingText, { color: fundingReadinessColors[paper.tags.fundingReadiness] }]}>
                  {paper.tags.fundingReadiness.toUpperCase()} FUNDING READINESS
                </Text>
              </View>
            </View>

            <Text style={styles.title}>{paper.title}</Text>

            <View style={styles.authorsSection}>
              <Users size={16} color={Colors.textSecondary} />
              <Text style={styles.authors}>{paper.authors.join(', ')}</Text>
            </View>

            <View style={styles.metaGrid}>
              <View style={styles.metaItem}>
                <Building2 size={14} color={Colors.textMuted} />
                <Text style={styles.metaText}>{paper.institution}</Text>
              </View>
              <View style={styles.metaItem}>
                <BookOpen size={14} color={Colors.textMuted} />
                <Text style={styles.metaText}>{paper.journal}</Text>
              </View>
              <View style={styles.metaItem}>
                <Calendar size={14} color={Colors.textMuted} />
                <Text style={styles.metaText}>{paper.publicationDate}</Text>
              </View>
              <View style={styles.metaItem}>
                <Quote size={14} color={Colors.textMuted} />
                <Text style={styles.metaText}>{paper.citations} citations</Text>
              </View>
            </View>
          </View>

          <View style={styles.focusAreaBadge}>
            <TrendingUp size={14} color={Colors.primary} />
            <Text style={styles.focusAreaText}>{focusAreaLabels[paper.focusArea]}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Impact Score</Text>
            <View style={styles.impactScoreCard}>
              <View style={styles.impactScoreHeader}>
                <View style={[styles.impactScoreBadge, { backgroundColor: getImpactScoreColor(paper.impactScore.total) + '20' }]}>
                  <TrendingUp size={16} color={getImpactScoreColor(paper.impactScore.total)} />
                  <Text style={[styles.impactScoreValue, { color: getImpactScoreColor(paper.impactScore.total) }]}>
                    {paper.impactScore.total}
                  </Text>
                </View>
                <Text style={styles.impactScoreLabel}>NexTerra Impact Score</Text>
              </View>
              <View style={styles.impactBreakdown}>
                <View style={styles.impactMetric}>
                  <View style={[styles.impactMetricIcon, { backgroundColor: Colors.primary + '20' }]}>
                    <Users size={14} color={Colors.primary} />
                  </View>
                  <Text style={styles.impactMetricValue}>{paper.impactScore.daoUsage}</Text>
                  <Text style={styles.impactMetricLabel}>DAO Usage</Text>
                </View>
                <View style={styles.impactMetric}>
                  <View style={[styles.impactMetricIcon, { backgroundColor: Colors.accent + '20' }]}>
                    <Quote size={14} color={Colors.accent} />
                  </View>
                  <Text style={styles.impactMetricValue}>{paper.impactScore.proposalCitations}</Text>
                  <Text style={styles.impactMetricLabel}>Proposal Citations</Text>
                </View>
                <View style={styles.impactMetric}>
                  <View style={[styles.impactMetricIcon, { backgroundColor: Colors.golden + '20' }]}>
                    <Award size={14} color={Colors.golden} />
                  </View>
                  <Text style={styles.impactMetricValue}>{paper.impactScore.peerEndorsements}</Text>
                  <Text style={styles.impactMetricLabel}>Endorsements</Text>
                </View>
                <View style={styles.impactMetric}>
                  <View style={[styles.impactMetricIcon, { backgroundColor: Colors.success + '20' }]}>
                    <Layers size={14} color={Colors.success} />
                  </View>
                  <Text style={styles.impactMetricValue}>{paper.impactScore.implementationLinks}</Text>
                  <Text style={styles.impactMetricLabel}>Implementations</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Researcher Profiles</Text>
            <View style={styles.researchersList}>
              {paper.linkedResearchers.map((researcher) => (
                <TouchableOpacity
                  key={researcher.id}
                  style={styles.researcherCard}
                  onPress={() => researcher.isNetworkMember && router.push(`/user/${researcher.id}`)}
                  activeOpacity={researcher.isNetworkMember ? 0.7 : 1}
                >
                  <Image source={{ uri: researcher.avatar }} style={styles.researcherAvatar} />
                  <View style={styles.researcherInfo}>
                    <Text style={styles.researcherName}>{researcher.name}</Text>
                    <Text style={styles.researcherRole}>{researcher.role}</Text>
                  </View>
                  {researcher.isNetworkMember ? (
                    <View style={styles.networkMemberBadge}>
                      <Award size={12} color={Colors.primary} />
                      <Text style={styles.networkMemberText}>Network Member</Text>
                      <ChevronRight size={14} color={Colors.primary} />
                    </View>
                  ) : (
                    <View style={styles.externalBadge}>
                      <ExternalLink size={12} color={Colors.textMuted} />
                      <Text style={styles.externalText}>External</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {paper.relatedInitiatives.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Related DAOs, Proposals & Field Work</Text>
              <View style={styles.initiativesList}>
                {paper.relatedInitiatives.map((initiative) => {
                  const IconComponent = initiativeIcons[initiative.type] || Layers;
                  const bgColor = initiative.type === 'dao' ? Colors.primary : initiative.type === 'proposal' ? Colors.accent : Colors.golden;
                  return (
                    <TouchableOpacity
                      key={initiative.id}
                      style={styles.initiativeCard}
                      onPress={() => {
                        if (initiative.type === 'dao') router.push(`/dao/${initiative.id}`);
                        else if (initiative.type === 'proposal') router.push(`/vote/${initiative.id}`);
                        else router.push(`/field/${initiative.id}`);
                      }}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.initiativeIcon, { backgroundColor: bgColor + '20' }]}>
                        <IconComponent size={18} color={bgColor} />
                      </View>
                      <View style={styles.initiativeInfo}>
                        <Text style={styles.initiativeType}>
                          {initiative.type === 'dao' ? 'DAO' : initiative.type === 'proposal' ? 'Proposal' : 'Field Work'}
                        </Text>
                        <Text style={styles.initiativeTitle} numberOfLines={1}>{initiative.title}</Text>
                        <View style={[styles.initiativeStatus, { backgroundColor: initiative.status === 'Active' || initiative.status === 'Funded' || initiative.status === 'Ongoing' ? Colors.success + '20' : Colors.warning + '20' }]}>
                          <Text style={[styles.initiativeStatusText, { color: initiative.status === 'Active' || initiative.status === 'Funded' || initiative.status === 'Ongoing' ? Colors.success : Colors.warning }]}>
                            {initiative.status}
                          </Text>
                        </View>
                      </View>
                      <ChevronRight size={18} color={Colors.textMuted} />
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Abstract</Text>
            <Text style={styles.abstractText}>{paper.abstract}</Text>
            {!paper.isOpenAccess && (
              <View style={styles.accessNote}>
                <Lock size={12} color={Colors.warning} />
                <Text style={styles.accessNoteText}>
                  Full paper requires institutional access. Abstract and metadata shown.
                </Text>
              </View>
            )}
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>AI Summary</Text>
              <TouchableOpacity 
                style={styles.generateButton}
                onPress={handleGenerateSummary}
                disabled={summarizeMutation.isPending}
              >
                <Sparkles size={14} color={Colors.primary} />
                <Text style={styles.generateButtonText}>
                  {aiSummary ? 'Regenerate' : 'Generate'}
                </Text>
              </TouchableOpacity>
            </View>
            {summarizeMutation.isPending ? (
              <View style={styles.loadingBox}>
                <ActivityIndicator size="small" color={Colors.primary} />
                <Text style={styles.loadingText}>Generating AI summary...</Text>
              </View>
            ) : aiSummary ? (
              <View style={styles.summaryBox}>
                <Text style={styles.summaryText}>{aiSummary}</Text>
              </View>
            ) : (
              <View style={styles.placeholderBox}>
                <Sparkles size={20} color={Colors.textMuted} />
                <Text style={styles.placeholderText}>
                  Tap Generate for an AI-powered summary
                </Text>
              </View>
            )}
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Key Insights</Text>
              <TouchableOpacity 
                style={styles.generateButton}
                onPress={handleGenerateInsights}
                disabled={insightsMutation.isPending}
              >
                <Sparkles size={14} color={Colors.primary} />
                <Text style={styles.generateButtonText}>
                  {keyInsights ? 'Regenerate' : 'Extract'}
                </Text>
              </TouchableOpacity>
            </View>
            {insightsMutation.isPending ? (
              <View style={styles.loadingBox}>
                <ActivityIndicator size="small" color={Colors.primary} />
                <Text style={styles.loadingText}>Extracting insights...</Text>
              </View>
            ) : keyInsights ? (
              <View style={styles.insightsList}>
                {keyInsights.map((insight, index) => (
                  <View key={index} style={styles.insightItem}>
                    <View style={styles.insightBullet} />
                    <Text style={styles.insightText}>{insight.replace(/^[-•*]\s*/, '')}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.placeholderBox}>
                <FileText size={20} color={Colors.textMuted} />
                <Text style={styles.placeholderText}>
                  Tap Extract for AI-identified key findings
                </Text>
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Research Tags</Text>
            <View style={styles.tagsSection}>
              {paper.tags.geography.length > 0 && (
                <View style={styles.tagGroup}>
                  <View style={styles.tagGroupHeader}>
                    <MapPin size={14} color={Colors.accent} />
                    <Text style={styles.tagGroupLabel}>Geography</Text>
                  </View>
                  <View style={styles.tagsList}>
                    {paper.tags.geography.map((geo) => (
                      <View key={geo} style={[styles.tag, styles.geoTag]}>
                        <Text style={[styles.tagText, { color: Colors.accent }]}>{geo}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {paper.tags.diseases.length > 0 && (
                <View style={styles.tagGroup}>
                  <View style={styles.tagGroupHeader}>
                    <Tag size={14} color={Colors.primary} />
                    <Text style={styles.tagGroupLabel}>Diseases / Health Topics</Text>
                  </View>
                  <View style={styles.tagsList}>
                    {paper.tags.diseases.map((disease) => (
                      <View key={disease} style={[styles.tag, styles.diseaseTag]}>
                        <Text style={[styles.tagText, { color: Colors.primary }]}>{disease}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {paper.tags.climateIssues.length > 0 && (
                <View style={styles.tagGroup}>
                  <View style={styles.tagGroupHeader}>
                    <ThermometerSun size={14} color={Colors.clay} />
                    <Text style={styles.tagGroupLabel}>Climate Issues</Text>
                  </View>
                  <View style={styles.tagsList}>
                    {paper.tags.climateIssues.map((issue) => (
                      <View key={issue} style={[styles.tag, styles.climateTag]}>
                        <Text style={[styles.tagText, { color: Colors.clay }]}>{issue}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          </View>

          <TouchableOpacity style={styles.doiButton} onPress={handleOpenDOI}>
            <View style={styles.doiContent}>
              <ExternalLink size={16} color={Colors.text} />
              <View>
                <Text style={styles.doiLabel}>Digital Object Identifier</Text>
                <Text style={styles.doiValue}>{paper.doi}</Text>
              </View>
            </View>
            <ArrowRight size={18} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity 
          style={styles.convertButton}
          onPress={handleConvertToProposal}
          testID="convert-to-proposal"
        >
          <FileText size={18} color={Colors.background} />
          <Text style={styles.convertButtonText}>Convert to Proposal</Text>
        </TouchableOpacity>
      </View>
    </View>
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
  content: {
    paddingBottom: 20,
  },
  heroImage: {
    width: '100%',
    height: 220,
    backgroundColor: Colors.backgroundSecondary,
  },
  mainContent: {
    padding: 20,
  },
  headerSection: {
    marginBottom: 16,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  accessBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.card,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  accessText: {
    fontSize: 11,
    fontWeight: '600' as const,
  },
  fundingBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  fundingText: {
    fontSize: 10,
    fontWeight: '700' as const,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.text,
    lineHeight: 30,
    marginBottom: 12,
  },
  authorsSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 16,
  },
  authors: {
    flex: 1,
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  metaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.card,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  metaText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  focusAreaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primary + '15',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 24,
  },
  focusAreaText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 12,
  },
  abstractText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  accessNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.warning + '15',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  accessNoteText: {
    flex: 1,
    fontSize: 12,
    color: Colors.warning,
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: Colors.primary + '15',
    borderRadius: 6,
  },
  generateButtonText: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: Colors.primary,
  },
  loadingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 12,
  },
  loadingText: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  summaryBox: {
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  summaryText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  placeholderBox: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.card,
    padding: 24,
    borderRadius: 12,
    gap: 8,
  },
  placeholderText: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  insightsList: {
    gap: 10,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: Colors.card,
    padding: 12,
    borderRadius: 10,
  },
  insightBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
    marginTop: 6,
  },
  insightText: {
    flex: 1,
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  tagsSection: {
    gap: 16,
  },
  tagGroup: {
    gap: 8,
  },
  tagGroupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tagGroupLabel: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: Colors.textMuted,
  },
  tagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  geoTag: {
    backgroundColor: Colors.accent + '15',
  },
  diseaseTag: {
    backgroundColor: Colors.primary + '15',
  },
  climateTag: {
    backgroundColor: Colors.clay + '15',
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500' as const,
  },
  impactScoreCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
  },
  impactScoreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  impactScoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  impactScoreValue: {
    fontSize: 24,
    fontWeight: '700' as const,
  },
  impactScoreLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  impactBreakdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  impactMetric: {
    alignItems: 'center',
    flex: 1,
  },
  impactMetricIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  impactMetricValue: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 2,
  },
  impactMetricLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  researchersList: {
    gap: 10,
  },
  researcherCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    padding: 14,
    borderRadius: 12,
    gap: 12,
  },
  researcherAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  researcherInfo: {
    flex: 1,
  },
  researcherName: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 2,
  },
  researcherRole: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  networkMemberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primary + '15',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  networkMemberText: {
    fontSize: 11,
    fontWeight: '500' as const,
    color: Colors.primary,
  },
  externalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  externalText: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  initiativesList: {
    gap: 10,
  },
  initiativeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    padding: 14,
    borderRadius: 12,
    gap: 12,
  },
  initiativeIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initiativeInfo: {
    flex: 1,
  },
  initiativeType: {
    fontSize: 10,
    fontWeight: '600' as const,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  initiativeTitle: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  initiativeStatus: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  initiativeStatusText: {
    fontSize: 10,
    fontWeight: '600' as const,
  },
  doiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 12,
  },
  doiContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  doiLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  doiValue: {
    fontSize: 13,
    color: Colors.text,
    fontWeight: '500' as const,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    padding: 16,
  },
  convertButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
  },
  convertButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.background,
  },
  errorState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  backButton: {
    backgroundColor: Colors.card,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.primary,
  },
});
