import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  Modal,
  Pressable,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Search,
  BookOpen,
  Users,
  MapPin,
  MessageSquare,
  Clock,
  FileText,
  ChevronRight,
  ChevronDown,
  Lock,
  Unlock,
  Sparkles,
  TrendingUp,
  Award,
  Eye,
  AlertTriangle,
  Lightbulb,
  ThumbsUp,
  ClipboardList,
  Building2,
  Briefcase,
  GraduationCap,
  DollarSign,
  Calendar,
  Plus,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import {
  academicPapers,
  ResearchPaper,
  ImpactScore,
} from '@/mocks/academicResearch';
import { fieldKnowledgePosts, FieldKnowledgePost, fieldCategories } from '@/mocks/fieldKnowledge';
import { discussionThreads, DiscussionThread } from '@/mocks/discussions';
import { insightRequests, InsightRequest, insightRequestTypes } from '@/mocks/insightRequests';
import { generateText } from '@rork-ai/toolkit-sdk';
import { useMutation } from '@tanstack/react-query';

type InsightTab = 'relevant' | 'network' | 'field' | 'discussions' | 'requests';

type ResearchDropdownOption = { id: InsightTab; label: string; icon: React.ComponentType<{ size: number; color: string }> };

const researchDropdownOptions: ResearchDropdownOption[] = [
  { id: 'relevant', label: 'Relevant Research', icon: BookOpen },
  { id: 'network', label: 'Network Research', icon: Users },
  { id: 'field', label: 'On the Ground', icon: MapPin },
];

const otherTabs: { id: InsightTab; label: string; icon: React.ComponentType<{ size: number; color: string }> }[] = [
  { id: 'discussions', label: 'Discussions', icon: MessageSquare },
  { id: 'requests', label: 'Requests', icon: ClipboardList },
];

const requestTypeColors: Record<string, string> = {
  white_paper: Colors.primary,
  feasibility_study: Colors.accent,
  landscape_review: Colors.golden,
};

const requestStatusColors: Record<string, string> = {
  open: Colors.success,
  bidding: Colors.warning,
  in_progress: Colors.primary,
  completed: Colors.textMuted,
  approved: Colors.accent,
};

const requesterTypeIcons: Record<string, React.ComponentType<{ size: number; color: string }>> = {
  funder: DollarSign,
  company: Building2,
  institution: GraduationCap,
};

const fundingReadinessColors: Record<string, string> = {
  high: Colors.success,
  medium: Colors.warning,
  low: Colors.error,
};

const fieldCategoryIcons: Record<string, React.ComponentType<{ size: number; color: string }>> = {
  field_observation: Eye,
  community_data: Users,
  implementation_lesson: Lightbulb,
  early_warning: AlertTriangle,
};

const getImpactScoreColor = (score: number) => {
  if (score >= 80) return Colors.success;
  if (score >= 60) return Colors.primary;
  if (score >= 40) return Colors.warning;
  return Colors.textMuted;
};

export default function InsightsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<InsightTab>('relevant');
  const [searchQuery, setSearchQuery] = useState('');
  const [summaries, setSummaries] = useState<Record<string, string>>({});
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [showResearchDropdown, setShowResearchDropdown] = useState(false);

  const summarizeMutation = useMutation({
    mutationFn: async (paper: ResearchPaper) => {
      const prompt = `Summarize this research paper in 2-3 concise sentences for a funding decision-maker. Focus on the key findings, methodology, and potential impact for African communities.

Title: ${paper.title}
Authors: ${paper.authors.join(', ')}
Institution: ${paper.institution}
Abstract: ${paper.abstract}`;

      const summary = await generateText(prompt);
      return { paperId: paper.id, summary };
    },
    onSuccess: (data) => {
      setSummaries((prev) => ({ ...prev, [data.paperId]: data.summary }));
    },
  });

  const { isPending: isSummarizing, mutate: summarize, variables: summarizeVariables } = summarizeMutation;

  const handleSummarize = useCallback((paper: ResearchPaper) => {
    if (!summaries[paper.id] && !isSummarizing) {
      summarize(paper);
    }
    setExpandedItem(expandedItem === paper.id ? null : paper.id);
  }, [summaries, isSummarizing, summarize, expandedItem]);

  const filteredRelevantPapers = useMemo(() => {
    return academicPapers.filter((paper) => {
      const matchesSearch = searchQuery === '' ||
        paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        paper.authors.some((a) => a.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesSearch;
    });
  }, [searchQuery]);

  const filteredNetworkPapers = useMemo(() => {
    return academicPapers.filter((paper) => {
      const matchesSearch = searchQuery === '' ||
        paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        paper.authors.some((a) => a.toLowerCase().includes(searchQuery.toLowerCase()));
      return paper.isNetworkResearch && matchesSearch;
    });
  }, [searchQuery]);

  const filteredFieldPosts = useMemo(() => {
    return fieldKnowledgePosts.filter((post) => {
      const matchesSearch = searchQuery === '' ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [searchQuery]);

  const filteredDiscussions = useMemo(() => {
    return discussionThreads.filter((thread) => {
      const matchesSearch = searchQuery === '' ||
        thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        thread.author.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [searchQuery]);

  const filteredRequests = useMemo(() => {
    return insightRequests.filter((request) => {
      const matchesSearch = searchQuery === '' ||
        request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.requester.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesSearch;
    });
  }, [searchQuery]);

  const navigateToResearchDetail = useCallback((paperId: string) => {
    router.push(`/research/${paperId}`);
  }, [router]);

  const navigateToFieldDetail = useCallback((postId: string) => {
    router.push(`/field/${postId}`);
  }, [router]);

  const navigateToDiscussion = useCallback((threadId: string) => {
    router.push(`/discussion/${threadId}`);
  }, [router]);

  const navigateToRequest = useCallback((requestId: string) => {
    router.push(`/insight-request/${requestId}`);
  }, [router]);

  const navigateToSubmitRequest = useCallback(() => {
    router.push('/submit-insight-request');
  }, [router]);

  const navigateToUserProfile = useCallback((userId: string) => {
    router.push(`/user/${userId}`);
  }, [router]);

  const navigateToDAO = useCallback((daoId: string) => {
    router.push(`/dao/${daoId}`);
  }, [router]);

  const navigateToProposal = useCallback((proposalId: string) => {
    router.push(`/vote/${proposalId}`);
  }, [router]);

  const handleResearchDropdownSelect = useCallback((tabId: InsightTab) => {
    setActiveTab(tabId);
    setShowResearchDropdown(false);
  }, []);

  const selectedResearchOption = useMemo(() => {
    return researchDropdownOptions.find(opt => opt.id === activeTab);
  }, [activeTab]);

  const isResearchTab = useMemo(() => {
    return researchDropdownOptions.some(opt => opt.id === activeTab);
  }, [activeTab]);

  const renderImpactScore = useCallback((impactScore: ImpactScore) => {
    const color = getImpactScoreColor(impactScore.total);
    return (
      <View style={styles.impactScoreContainer}>
        <View style={[styles.impactScoreBadge, { backgroundColor: color + '20' }]}>
          <TrendingUp size={12} color={color} />
          <Text style={[styles.impactScoreText, { color }]}>{impactScore.total}</Text>
        </View>
        <View style={styles.impactBreakdown}>
          <View style={styles.impactItem}>
            <Text style={styles.impactLabel}>DAO</Text>
            <Text style={styles.impactValue}>{impactScore.daoUsage}</Text>
          </View>
          <View style={styles.impactItem}>
            <Text style={styles.impactLabel}>Citations</Text>
            <Text style={styles.impactValue}>{impactScore.proposalCitations}</Text>
          </View>
          <View style={styles.impactItem}>
            <Text style={styles.impactLabel}>Endorsed</Text>
            <Text style={styles.impactValue}>{impactScore.peerEndorsements}</Text>
          </View>
          <View style={styles.impactItem}>
            <Text style={styles.impactLabel}>Impl.</Text>
            <Text style={styles.impactValue}>{impactScore.implementationLinks}</Text>
          </View>
        </View>
      </View>
    );
  }, []);

  const renderPaperCard = useCallback((paper: ResearchPaper, showNetworkBadge: boolean = false) => {
    const isExpanded = expandedItem === paper.id;
    const summary = summaries[paper.id];
    const isLoadingSummary = isSummarizing && summarizeVariables?.id === paper.id;

    return (
      <TouchableOpacity
        key={paper.id}
        style={styles.paperCard}
        onPress={() => navigateToResearchDetail(paper.id)}
        activeOpacity={0.8}
        testID={`paper-card-${paper.id}`}
      >
        <Image source={{ uri: paper.imageUrl }} style={styles.paperImage} />
        <View style={styles.paperContent}>
          <View style={styles.paperHeader}>
            <View style={styles.badgeRow}>
              <View style={styles.accessBadge}>
                {paper.isOpenAccess ? (
                  <>
                    <Unlock size={10} color={Colors.success} />
                    <Text style={[styles.accessText, { color: Colors.success }]}>Open Access</Text>
                  </>
                ) : (
                  <>
                    <Lock size={10} color={Colors.warning} />
                    <Text style={[styles.accessText, { color: Colors.warning }]}>Metadata Only</Text>
                  </>
                )}
              </View>
              {showNetworkBadge && paper.isNetworkResearch && (
                <View style={styles.networkBadge}>
                  <Users size={10} color={Colors.primary} />
                  <Text style={styles.networkBadgeText}>Network</Text>
                </View>
              )}
            </View>
            <View style={[styles.fundingBadge, { backgroundColor: fundingReadinessColors[paper.tags.fundingReadiness] + '20' }]}>
              <Text style={[styles.fundingText, { color: fundingReadinessColors[paper.tags.fundingReadiness] }]}>
                {paper.tags.fundingReadiness.toUpperCase()} READINESS
              </Text>
            </View>
          </View>

          <Text style={styles.paperTitle} numberOfLines={2}>{paper.title}</Text>
          
          <View style={styles.researcherRow}>
            {paper.linkedResearchers.slice(0, 2).map((researcher) => (
              <TouchableOpacity
                key={researcher.id}
                style={styles.researcherChip}
                onPress={(e) => {
                  e.stopPropagation();
                  navigateToUserProfile(researcher.id);
                }}
                activeOpacity={0.7}
                testID={`researcher-${researcher.id}`}
              >
                <Image source={{ uri: researcher.avatar }} style={styles.researcherAvatar} />
                <Text style={styles.researcherName} numberOfLines={1}>{researcher.name}</Text>
                {researcher.isNetworkMember && (
                  <View style={styles.memberDot} />
                )}
              </TouchableOpacity>
            ))}
            {paper.linkedResearchers.length > 2 && (
              <Text style={styles.moreResearchers}>+{paper.linkedResearchers.length - 2}</Text>
            )}
          </View>

          <View style={styles.paperMeta}>
            <View style={styles.metaItem}>
              <FileText size={12} color={Colors.textMuted} />
              <Text style={styles.metaText}>{paper.journal}</Text>
            </View>
            <View style={styles.metaItem}>
              <Clock size={12} color={Colors.textMuted} />
              <Text style={styles.metaText}>{paper.publicationDate}</Text>
            </View>
          </View>

          {renderImpactScore(paper.impactScore)}

          {paper.relatedInitiatives.length > 0 && (
            <View style={styles.initiativesRow}>
              {paper.relatedInitiatives.slice(0, 2).map((initiative) => (
                <TouchableOpacity
                  key={initiative.id}
                  style={[styles.initiativeChip, { backgroundColor: initiative.type === 'dao' ? Colors.primary + '15' : initiative.type === 'proposal' ? Colors.accent + '15' : Colors.golden + '15' }]}
                  onPress={(e) => {
                    e.stopPropagation();
                    if (initiative.type === 'dao') {
                      navigateToDAO(initiative.id);
                    } else if (initiative.type === 'proposal') {
                      navigateToProposal(initiative.id);
                    } else {
                      navigateToFieldDetail(initiative.id);
                    }
                  }}
                  activeOpacity={0.7}
                  testID={`initiative-${initiative.id}`}
                >
                  <Text style={[styles.initiativeText, { color: initiative.type === 'dao' ? Colors.primary : initiative.type === 'proposal' ? Colors.accent : Colors.golden }]}>
                    {initiative.type === 'dao' ? 'DAO' : initiative.type === 'proposal' ? 'Proposal' : 'Field'}: {initiative.title.length > 20 ? initiative.title.slice(0, 20) + '...' : initiative.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <TouchableOpacity
            style={styles.summarizeButton}
            onPress={(e) => {
              e.stopPropagation();
              handleSummarize(paper);
            }}
            testID={`summarize-${paper.id}`}
          >
            <Sparkles size={14} color={Colors.primary} />
            <Text style={styles.summarizeText}>
              {isExpanded ? 'Hide AI Summary' : 'AI Summary'}
            </Text>
            {isLoadingSummary && <ActivityIndicator size="small" color={Colors.primary} />}
          </TouchableOpacity>

          {isExpanded && (
            <View style={styles.summaryContainer}>
              {summary ? (
                <Text style={styles.summaryText}>{summary}</Text>
              ) : isLoadingSummary ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color={Colors.primary} />
                  <Text style={styles.loadingText}>Generating AI summary...</Text>
                </View>
              ) : null}
            </View>
          )}

          <View style={styles.cardFooter}>
            <Text style={styles.citationsText}>{paper.citations} citations</Text>
            <View style={styles.viewProfile}>
              <Text style={styles.viewProfileText}>View Details</Text>
              <ChevronRight size={14} color={Colors.primary} />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }, [expandedItem, summaries, isSummarizing, summarizeVariables, handleSummarize, navigateToResearchDetail, renderImpactScore, navigateToUserProfile, navigateToDAO, navigateToProposal, navigateToFieldDetail]);

  const renderFieldPostCard = useCallback((post: FieldKnowledgePost) => {
    const categoryInfo = fieldCategories.find(c => c.id === post.category);
    const IconComponent = fieldCategoryIcons[post.category] || Eye;

    return (
      <TouchableOpacity
        key={post.id}
        style={styles.fieldCard}
        onPress={() => navigateToFieldDetail(post.id)}
        activeOpacity={0.8}
        testID={`field-card-${post.id}`}
      >
        {post.attachments.length > 0 && post.attachments[0].type === 'photo' && (
          <Image source={{ uri: post.attachments[0].url }} style={styles.fieldImage} />
        )}
        <View style={styles.fieldContent}>
          <View style={styles.fieldHeader}>
            <View style={[styles.categoryBadge, { backgroundColor: categoryInfo?.color + '20' }]}>
              <IconComponent size={12} color={categoryInfo?.color || Colors.primary} />
              <Text style={[styles.categoryText, { color: categoryInfo?.color }]}>{categoryInfo?.label}</Text>
            </View>
            {post.urgencyLevel === 'critical' && (
              <View style={styles.urgencyBadge}>
                <AlertTriangle size={10} color={Colors.error} />
                <Text style={styles.urgencyText}>URGENT</Text>
              </View>
            )}
          </View>

          <Text style={styles.fieldTitle} numberOfLines={2}>{post.title}</Text>

          <View style={styles.authorRow}>
            <Image source={{ uri: post.author.avatar }} style={styles.authorAvatar} />
            <View>
              <Text style={styles.authorName}>{post.author.name}</Text>
              <Text style={styles.authorRole}>{post.author.role}</Text>
            </View>
            <View style={styles.credibilityBadge}>
              <Award size={10} color={Colors.golden} />
              <Text style={styles.credibilityText}>{post.author.credibilityScore}</Text>
            </View>
          </View>

          {post.geoLocation && (
            <View style={styles.locationRow}>
              <MapPin size={12} color={Colors.accent} />
              <Text style={styles.locationText}>{post.geoLocation.placeName}, {post.geoLocation.country}</Text>
            </View>
          )}

          <View style={styles.fieldMeta}>
            <View style={styles.metaItem}>
              <ThumbsUp size={12} color={Colors.textMuted} />
              <Text style={styles.metaText}>{post.upvotes}</Text>
            </View>
            <View style={styles.metaItem}>
              <MessageSquare size={12} color={Colors.textMuted} />
              <Text style={styles.metaText}>{post.commentCount}</Text>
            </View>
            <View style={styles.metaItem}>
              <Eye size={12} color={Colors.textMuted} />
              <Text style={styles.metaText}>{post.views}</Text>
            </View>
          </View>

          <View style={styles.cardFooter}>
            <Text style={styles.dateText}>{new Date(post.createdAt).toLocaleDateString()}</Text>
            <View style={styles.viewProfile}>
              <Text style={styles.viewProfileText}>Read More</Text>
              <ChevronRight size={14} color={Colors.primary} />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }, [navigateToFieldDetail]);

  const renderDiscussionCard = useCallback((thread: DiscussionThread) => {
    return (
      <TouchableOpacity
        key={thread.id}
        style={styles.discussionCard}
        onPress={() => navigateToDiscussion(thread.id)}
        activeOpacity={0.8}
        testID={`discussion-card-${thread.id}`}
      >
        <View style={styles.discussionContent}>
          <View style={styles.discussionHeader}>
            {thread.isPinned && (
              <View style={styles.pinnedBadge}>
                <Text style={styles.pinnedText}>PINNED</Text>
              </View>
            )}
            {thread.isHighSignal && (
              <View style={styles.signalBadge}>
                <Sparkles size={10} color={Colors.golden} />
                <Text style={styles.signalText}>High Signal</Text>
              </View>
            )}
          </View>

          <Text style={styles.discussionTitle} numberOfLines={2}>{thread.title}</Text>

          <View style={styles.authorRow}>
            <Image source={{ uri: thread.author.avatar }} style={styles.authorAvatar} />
            <View>
              <Text style={styles.authorName}>{thread.author.name}</Text>
              <Text style={styles.authorRole}>{thread.author.role}</Text>
            </View>
          </View>

          <View style={styles.tagsRow}>
            {thread.tags.slice(0, 3).map((tag) => (
              <View key={tag} style={styles.tagChip}>
                <Text style={styles.tagChipText}>{tag}</Text>
              </View>
            ))}
          </View>

          <View style={styles.discussionMeta}>
            <View style={styles.metaItem}>
              <ThumbsUp size={12} color={Colors.textMuted} />
              <Text style={styles.metaText}>{thread.upvotes}</Text>
            </View>
            <View style={styles.metaItem}>
              <MessageSquare size={12} color={Colors.textMuted} />
              <Text style={styles.metaText}>{thread.replyCount} replies</Text>
            </View>
            <View style={styles.metaItem}>
              <Eye size={12} color={Colors.textMuted} />
              <Text style={styles.metaText}>{thread.views}</Text>
            </View>
          </View>

          <View style={styles.cardFooter}>
            <Text style={styles.dateText}>{new Date(thread.createdAt).toLocaleDateString()}</Text>
            <View style={styles.viewProfile}>
              <Text style={styles.viewProfileText}>Join Discussion</Text>
              <ChevronRight size={14} color={Colors.primary} />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }, [navigateToDiscussion]);

  const renderRequestCard = useCallback((request: InsightRequest) => {
    const typeInfo = insightRequestTypes.find(t => t.id === request.type);
    const RequesterIcon = requesterTypeIcons[request.requester.type] || Building2;
    const typeColor = requestTypeColors[request.type] || Colors.primary;
    const statusColor = requestStatusColors[request.status] || Colors.textMuted;

    return (
      <TouchableOpacity
        key={request.id}
        style={styles.requestCard}
        onPress={() => navigateToRequest(request.id)}
        activeOpacity={0.8}
        testID={`request-card-${request.id}`}
      >
        <View style={styles.requestContent}>
          <View style={styles.requestHeader}>
            <View style={[styles.typeBadge, { backgroundColor: typeColor + '20' }]}>
              <FileText size={10} color={typeColor} />
              <Text style={[styles.typeText, { color: typeColor }]}>{typeInfo?.label}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
              <Text style={[styles.statusText, { color: statusColor }]}>
                {request.status.replace('_', ' ').toUpperCase()}
              </Text>
            </View>
          </View>

          <Text style={styles.requestTitle} numberOfLines={2}>{request.title}</Text>

          <View style={styles.requesterRow}>
            <Image source={{ uri: request.requester.avatar }} style={styles.requesterAvatar} />
            <View style={styles.requesterInfo}>
              <Text style={styles.requesterName}>{request.requester.name}</Text>
              <View style={styles.requesterTypeRow}>
                <RequesterIcon size={10} color={Colors.textMuted} />
                <Text style={styles.requesterType}>{request.requester.type}</Text>
              </View>
            </View>
          </View>

          <View style={styles.requestDetails}>
            <View style={styles.detailItem}>
              <DollarSign size={14} color={Colors.golden} />
              <Text style={styles.detailText}>
                ${request.budget.min.toLocaleString()} - ${request.budget.max.toLocaleString()}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Clock size={14} color={Colors.accent} />
              <Text style={styles.detailText}>{request.timeline}</Text>
            </View>
          </View>

          <View style={styles.requestTags}>
            {request.tags.slice(0, 3).map((tag) => (
              <View key={tag} style={styles.requestTag}>
                <Text style={styles.requestTagText}>{tag}</Text>
              </View>
            ))}
            {request.tags.length > 3 && (
              <Text style={styles.moreTags}>+{request.tags.length - 3}</Text>
            )}
          </View>

          <View style={styles.requestMeta}>
            <View style={styles.metaItem}>
              <Briefcase size={12} color={Colors.textMuted} />
              <Text style={styles.metaText}>{request.bids.length} bids</Text>
            </View>
            <View style={styles.metaItem}>
              <Eye size={12} color={Colors.textMuted} />
              <Text style={styles.metaText}>{request.views} views</Text>
            </View>
            <View style={styles.metaItem}>
              <Calendar size={12} color={Colors.textMuted} />
              <Text style={styles.metaText}>Due {new Date(request.deadline).toLocaleDateString()}</Text>
            </View>
          </View>

          <View style={styles.cardFooter}>
            <Text style={styles.dateText}>{new Date(request.createdAt).toLocaleDateString()}</Text>
            <View style={styles.viewProfile}>
              <Text style={styles.viewProfileText}>
                {request.status === 'open' ? 'Submit Bid' : 'View Details'}
              </Text>
              <ChevronRight size={14} color={Colors.primary} />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }, [navigateToRequest]);

  const renderContent = () => {
    switch (activeTab) {
      case 'relevant':
        return (
          <>
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsCount}>{filteredRelevantPapers.length} research papers</Text>
              <Text style={styles.resultsSubtext}>from global academic sources</Text>
            </View>
            {filteredRelevantPapers.map((paper) => renderPaperCard(paper, true))}
            {filteredRelevantPapers.length === 0 && (
              <View style={styles.emptyState}>
                <BookOpen size={48} color={Colors.textMuted} />
                <Text style={styles.emptyTitle}>No papers found</Text>
                <Text style={styles.emptySubtext}>Try adjusting your search</Text>
              </View>
            )}
          </>
        );
      case 'network':
        return (
          <>
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsCount}>{filteredNetworkPapers.length} network publications</Text>
              <Text style={styles.resultsSubtext}>authored by NexTerra members</Text>
            </View>
            {filteredNetworkPapers.map((paper) => renderPaperCard(paper, false))}
            {filteredNetworkPapers.length === 0 && (
              <View style={styles.emptyState}>
                <Users size={48} color={Colors.textMuted} />
                <Text style={styles.emptyTitle}>No network research found</Text>
                <Text style={styles.emptySubtext}>Try adjusting your search</Text>
              </View>
            )}
          </>
        );
      case 'field':
        return (
          <>
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsCount}>{filteredFieldPosts.length} field reports</Text>
              <Text style={styles.resultsSubtext}>updates from practitioners</Text>
            </View>
            {filteredFieldPosts.map(renderFieldPostCard)}
            {filteredFieldPosts.length === 0 && (
              <View style={styles.emptyState}>
                <MapPin size={48} color={Colors.textMuted} />
                <Text style={styles.emptyTitle}>No field insights found</Text>
                <Text style={styles.emptySubtext}>Try adjusting your search</Text>
              </View>
            )}
          </>
        );
      case 'discussions':
        return (
          <>
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsCount}>{filteredDiscussions.length} discussions</Text>
              <Text style={styles.resultsSubtext}>community knowledge exchange</Text>
            </View>
            {filteredDiscussions.map(renderDiscussionCard)}
            {filteredDiscussions.length === 0 && (
              <View style={styles.emptyState}>
                <MessageSquare size={48} color={Colors.textMuted} />
                <Text style={styles.emptyTitle}>No discussions found</Text>
                <Text style={styles.emptySubtext}>Try adjusting your search</Text>
              </View>
            )}
          </>
        );
      case 'requests':
        return (
          <>
            <View style={styles.requestsHeader}>
              <TouchableOpacity
                style={styles.postRequestButton}
                onPress={navigateToSubmitRequest}
                testID="post-request-button"
              >
                <Plus size={16} color={Colors.background} />
                <Text style={styles.postRequestText}>Post Request</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.requestTypeFilters}>
              {insightRequestTypes.map((type) => (
                <View key={type.id} style={[styles.typeFilterChip, { borderColor: requestTypeColors[type.id] }]}>
                  <View style={[styles.typeFilterDot, { backgroundColor: requestTypeColors[type.id] }]} />
                  <Text style={styles.typeFilterText}>{type.label}</Text>
                </View>
              ))}
            </View>

            {filteredRequests.map(renderRequestCard)}
            {filteredRequests.length === 0 && (
              <View style={styles.emptyState}>
                <ClipboardList size={48} color={Colors.textMuted} />
                <Text style={styles.emptyTitle}>No requests found</Text>
                <Text style={styles.emptySubtext}>Try adjusting your search</Text>
              </View>
            )}
          </>
        );
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Insights',
          headerStyle: { backgroundColor: Colors.background },
          headerTintColor: Colors.text,
          headerTitleStyle: { fontWeight: '600' as const },
        }}
      />

      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <Search size={18} color={Colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search insights, authors, topics..."
            placeholderTextColor={Colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            testID="insights-search-input"
          />
        </View>
      </View>

      <View style={styles.tabsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsList}
        >
          <View style={styles.dropdownWrapper}>
            <TouchableOpacity
              style={[styles.tab, styles.dropdownTab, isResearchTab && styles.tabActive]}
              onPress={() => setShowResearchDropdown(!showResearchDropdown)}
              testID="research-dropdown-toggle"
            >
              {selectedResearchOption && isResearchTab ? (
                <>
                  <selectedResearchOption.icon size={16} color={Colors.background} />
                  <Text style={[styles.tabText, styles.tabTextActive]}>{selectedResearchOption.label}</Text>
                </>
              ) : (
                <>
                  <BookOpen size={16} color={Colors.textSecondary} />
                  <Text style={styles.tabText}>Research & Field</Text>
                </>
              )}
              <ChevronDown size={14} color={isResearchTab ? Colors.background : Colors.textSecondary} />
            </TouchableOpacity>
          </View>
          {otherTabs.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[styles.tab, isActive && styles.tabActive]}
                onPress={() => {
                  setActiveTab(tab.id);
                  setShowResearchDropdown(false);
                }}
                testID={`tab-${tab.id}`}
              >
                <IconComponent size={16} color={isActive ? Colors.background : Colors.textSecondary} />
                <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{tab.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.contentList}
        contentContainerStyle={[styles.contentContainer, { paddingBottom: insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        {renderContent()}
      </ScrollView>

      <Modal
        visible={showResearchDropdown}
        transparent
        animationType="fade"
        onRequestClose={() => setShowResearchDropdown(false)}
      >
        <Pressable 
          style={styles.dropdownOverlay} 
          onPress={() => setShowResearchDropdown(false)}
        >
          <View style={styles.dropdownMenuModal}>
            {researchDropdownOptions.map((option) => {
              const IconComponent = option.icon;
              const isActive = activeTab === option.id;
              return (
                <TouchableOpacity
                  key={option.id}
                  style={[styles.dropdownItem, isActive && styles.dropdownItemActive]}
                  onPress={() => handleResearchDropdownSelect(option.id)}
                  testID={`dropdown-${option.id}`}
                >
                  <IconComponent size={16} color={isActive ? Colors.primary : Colors.textSecondary} />
                  <Text style={[styles.dropdownItemText, isActive && styles.dropdownItemTextActive]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
  },
  tabsContainer: {
    paddingBottom: 12,
    zIndex: 100,
  },
  tabsList: {
    paddingHorizontal: 20,
    gap: 8,
  },
  dropdownWrapper: {
    position: 'relative',
    zIndex: 100,
  },
  dropdownTab: {
    gap: 6,
  },
  dropdownOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-start',
    paddingTop: 160,
    paddingHorizontal: 20,
  },
  dropdownMenuModal: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 8,
    minWidth: 180,
    maxWidth: 220,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 10,
  },
  dropdownItemActive: {
    backgroundColor: Colors.primary + '15',
  },
  dropdownItemText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  dropdownItemTextActive: {
    color: Colors.primary,
    fontWeight: '500' as const,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
    marginRight: 8,
  },
  tabActive: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: Colors.background,
  },
  contentList: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 4,
  },
  resultsCount: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  resultsSubtext: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  paperCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    overflow: 'hidden',
  },
  paperImage: {
    width: '100%',
    height: 120,
    backgroundColor: Colors.backgroundSecondary,
  },
  paperContent: {
    padding: 16,
  },
  paperHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  accessBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  accessText: {
    fontSize: 10,
    fontWeight: '600' as const,
  },
  networkBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primary + '15',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  networkBadgeText: {
    fontSize: 10,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  fundingBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  fundingText: {
    fontSize: 9,
    fontWeight: '700' as const,
    letterSpacing: 0.5,
  },
  paperTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
    lineHeight: 21,
    marginBottom: 10,
  },
  researcherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  researcherChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    gap: 6,
  },
  researcherAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  researcherName: {
    fontSize: 11,
    color: Colors.textSecondary,
    maxWidth: 100,
  },
  memberDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
  },
  moreResearchers: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  paperMeta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  impactScoreContainer: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  impactScoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },
  impactScoreText: {
    fontSize: 14,
    fontWeight: '700' as const,
  },
  impactBreakdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  impactItem: {
    alignItems: 'center',
  },
  impactLabel: {
    fontSize: 9,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  impactValue: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  initiativesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  initiativeChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  initiativeText: {
    fontSize: 10,
    fontWeight: '500' as const,
  },
  summarizeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  summarizeText: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: Colors.primary,
  },
  summaryContainer: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 12,
    marginTop: 4,
  },
  citationsText: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  dateText: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  viewProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewProfileText: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: Colors.primary,
  },
  fieldCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    overflow: 'hidden',
  },
  fieldImage: {
    width: '100%',
    height: 140,
    backgroundColor: Colors.backgroundSecondary,
  },
  fieldContent: {
    padding: 16,
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600' as const,
  },
  urgencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.error + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  urgencyText: {
    fontSize: 10,
    fontWeight: '700' as const,
    color: Colors.error,
  },
  fieldTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
    lineHeight: 21,
    marginBottom: 10,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  authorAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  authorName: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: Colors.text,
  },
  authorRole: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  credibilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.golden + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 'auto',
  },
  credibilityText: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: Colors.golden,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  locationText: {
    fontSize: 12,
    color: Colors.accent,
  },
  fieldMeta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  discussionCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    overflow: 'hidden',
  },
  discussionContent: {
    padding: 16,
  },
  discussionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  pinnedBadge: {
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  pinnedText: {
    fontSize: 9,
    fontWeight: '700' as const,
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  signalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.golden + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  signalText: {
    fontSize: 10,
    fontWeight: '600' as const,
    color: Colors.golden,
  },
  discussionTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
    lineHeight: 21,
    marginBottom: 10,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  tagChip: {
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagChipText: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  discussionMeta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  requestsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  postRequestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
  },
  postRequestText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.background,
  },
  requestTypeFilters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  typeFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    gap: 6,
  },
  typeFilterDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  typeFilterText: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  requestCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    overflow: 'hidden',
  },
  requestContent: {
    padding: 16,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  typeText: {
    fontSize: 10,
    fontWeight: '600' as const,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 9,
    fontWeight: '700' as const,
    letterSpacing: 0.5,
  },
  requestTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
    lineHeight: 21,
    marginBottom: 12,
  },
  requesterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  requesterAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  requesterInfo: {
    flex: 1,
  },
  requesterName: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: Colors.text,
    marginBottom: 2,
  },
  requesterTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  requesterType: {
    fontSize: 11,
    color: Colors.textMuted,
    textTransform: 'capitalize' as const,
  },
  requestDetails: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 12,
    backgroundColor: Colors.backgroundSecondary,
    padding: 12,
    borderRadius: 10,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: Colors.text,
  },
  requestTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  requestTag: {
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  requestTagText: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  moreTags: {
    fontSize: 11,
    color: Colors.textMuted,
    alignSelf: 'center',
  },
  requestMeta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
});
