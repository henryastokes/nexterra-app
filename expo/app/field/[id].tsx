import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Linking,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  MapPin,
  Eye,
  Users,
  Lightbulb,
  AlertTriangle,
  Share2,
  Bookmark,
  MoreHorizontal,
  ArrowUp,
  MessageCircle,
  Clock,
  Star,
  FileText,
  Video,
  Music,
  Image as ImageIcon,
  Download,
  Play,
  ExternalLink,
  Link2,
  CheckCircle,
  Send,
  Navigation,
  ChevronRight,
  TrendingUp,
  Award,
  Shield,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import {
  getFieldPostById,
  getCommentsByPostId,
  fieldCategories,
  FieldComment,
  FieldAttachment,
} from '@/mocks/fieldKnowledge';
import AIInsights from '@/components/AIInsights';
import PeerEndorsement from '@/components/PeerEndorsement';
import KnowledgeTypeBadge from '@/components/KnowledgeTypeBadge';

const categoryIcons: Record<string, React.ReactNode> = {
  field_observation: <Eye size={16} color={Colors.background} />,
  community_data: <Users size={16} color={Colors.background} />,
  implementation_lesson: <Lightbulb size={16} color={Colors.background} />,
  early_warning: <AlertTriangle size={16} color={Colors.background} />,
};

export default function FieldKnowledgeDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const [newComment, setNewComment] = useState('');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [localUpvotes, setLocalUpvotes] = useState(0);

  const post = useMemo(() => getFieldPostById(id || ''), [id]);
  const comments = useMemo(() => getCommentsByPostId(id || ''), [id]);

  React.useEffect(() => {
    if (post) {
      setLocalUpvotes(post.upvotes);
    }
  }, [post]);

  if (!post) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>Post not found</Text>
        <TouchableOpacity style={styles.backLink} onPress={() => router.back()}>
          <Text style={styles.backLinkText}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const category = fieldCategories.find(c => c.id === post.category);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(dateString);
  };

  const handleUpvote = () => {
    if (hasUpvoted) {
      setLocalUpvotes(prev => prev - 1);
    } else {
      setLocalUpvotes(prev => prev + 1);
    }
    setHasUpvoted(!hasUpvoted);
  };

  const handleShare = () => {
    console.log('Sharing post:', post.id);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      console.log('Submitting comment:', newComment);
      setNewComment('');
    }
  };

  const handleOpenMap = () => {
    if (post.geoLocation) {
      const url = Platform.select({
        ios: `maps://app?daddr=${post.geoLocation.latitude},${post.geoLocation.longitude}`,
        android: `geo:${post.geoLocation.latitude},${post.geoLocation.longitude}`,
        default: `https://www.google.com/maps?q=${post.geoLocation.latitude},${post.geoLocation.longitude}`,
      });
      Linking.openURL(url);
    }
  };

  const handleAuthorPress = () => {
    router.push(`/user/${post.author.id}`);
  };

  const getUrgencyColor = (urgency?: string) => {
    switch (urgency) {
      case 'critical': return '#F44336';
      case 'high': return '#FF9800';
      case 'medium': return '#FFC107';
      case 'low': return '#4CAF50';
      default: return Colors.textMuted;
    }
  };

  const getInitiativeColor = (type: string) => {
    switch (type) {
      case 'proposal': return Colors.primary;
      case 'ask': return Colors.accent;
      case 'dao': return '#4CAF50';
      default: return Colors.textMuted;
    }
  };

  const getAttachmentIcon = (type: string) => {
    switch (type) {
      case 'document': return <FileText size={20} color={Colors.primary} />;
      case 'photo': return <ImageIcon size={20} color="#4CAF50" />;
      case 'video': return <Video size={20} color={Colors.accent} />;
      case 'audio': return <Music size={20} color="#FF9800" />;
      default: return <FileText size={20} color={Colors.textMuted} />;
    }
  };

  const renderAttachment = (attachment: FieldAttachment) => {
    const isMedia = attachment.type === 'photo' || attachment.type === 'video';

    return (
      <TouchableOpacity
        key={attachment.id}
        style={[styles.attachmentCard, isMedia && styles.attachmentCardMedia]}
        activeOpacity={0.7}
      >
        {attachment.type === 'photo' && attachment.url !== '#' ? (
          <Image source={{ uri: attachment.url }} style={styles.attachmentImage} />
        ) : attachment.type === 'video' ? (
          <View style={styles.videoThumbnail}>
            <View style={styles.playButton}>
              <Play size={24} color={Colors.background} />
            </View>
            <Text style={styles.videoDuration}>Video</Text>
          </View>
        ) : (
          <View style={styles.attachmentFileCard}>
            <View style={styles.attachmentIconWrapper}>
              {getAttachmentIcon(attachment.type)}
            </View>
            <View style={styles.attachmentFileInfo}>
              <Text style={styles.attachmentFileName} numberOfLines={1}>
                {attachment.name}
              </Text>
              <Text style={styles.attachmentFileSize}>{attachment.size}</Text>
            </View>
            <Download size={18} color={Colors.primary} />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderComment = (comment: FieldComment) => (
    <View key={comment.id} style={styles.commentCard}>
      <TouchableOpacity
        style={styles.commentAuthorRow}
        onPress={() => router.push(`/user/${comment.author.id}`)}
      >
        <Image source={{ uri: comment.author.avatar }} style={styles.commentAvatar} />
        <View style={styles.commentAuthorInfo}>
          <Text style={styles.commentAuthorName}>{comment.author.name}</Text>
          <View style={styles.commentMeta}>
            <Star size={10} color={Colors.accent} />
            <Text style={styles.commentScore}>{comment.author.credibilityScore}</Text>
            <Text style={styles.commentTime}>· {formatTimeAgo(comment.createdAt)}</Text>
          </View>
        </View>
      </TouchableOpacity>
      <Text style={styles.commentContent}>{comment.content}</Text>
      <View style={styles.commentActions}>
        <TouchableOpacity style={styles.commentAction}>
          <ArrowUp size={14} color={Colors.textMuted} />
          <Text style={styles.commentActionText}>{comment.upvotes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.commentAction}>
          <MessageCircle size={14} color={Colors.textMuted} />
          <Text style={styles.commentActionText}>Reply</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, index) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <Text key={index} style={styles.contentHeading}>
            {line.replace(/\*\*/g, '')}
          </Text>
        );
      }
      if (line.startsWith('- ')) {
        return (
          <View key={index} style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>{line.substring(2)}</Text>
          </View>
        );
      }
      if (line.startsWith('| ')) {
        return (
          <Text key={index} style={styles.tableRow}>
            {line}
          </Text>
        );
      }
      if (line.trim() === '') {
        return <View key={index} style={styles.spacer} />;
      }
      return (
        <Text key={index} style={styles.contentText}>
          {line.replace(/\*\*/g, '')}
        </Text>
      );
    });
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
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[styles.headerAction, isBookmarked && styles.headerActionActive]}
            onPress={handleBookmark}
          >
            <Bookmark
              size={20}
              color={isBookmarked ? Colors.accent : Colors.text}
              fill={isBookmarked ? Colors.accent : 'transparent'}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerAction} onPress={handleShare}>
            <Share2 size={20} color={Colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerAction}>
            <MoreHorizontal size={20} color={Colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {post.urgencyLevel && (post.urgencyLevel === 'critical' || post.urgencyLevel === 'high') && (
          <View style={[styles.urgencyBanner, { backgroundColor: getUrgencyColor(post.urgencyLevel) }]}>
            <AlertTriangle size={16} color={Colors.background} />
            <Text style={styles.urgencyText}>
              {post.urgencyLevel === 'critical' ? 'CRITICAL ALERT' : 'HIGH PRIORITY'}
            </Text>
          </View>
        )}

        <View style={styles.postHeader}>
          <View style={styles.categoryRow}>
            <View style={[styles.categoryBadge, { backgroundColor: category?.color }]}>
              {categoryIcons[post.category]}
              <Text style={styles.categoryBadgeText}>{category?.label}</Text>
            </View>
            {post.isVerified && (
              <View style={styles.verifiedBadge}>
                <CheckCircle size={14} color={Colors.success} />
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            )}
          </View>

          <View style={styles.knowledgeTypeRow}>
            <KnowledgeTypeBadge type={post.knowledgeType} variant="badge" />
            {post.isHighSignal && (
              <View style={styles.highSignalBadge}>
                <TrendingUp size={12} color={Colors.success} />
                <Text style={styles.highSignalText}>High Signal</Text>
              </View>
            )}
            {post.credibilityImpact && post.credibilityImpact > 0 && (
              <View style={styles.credImpactBadge}>
                <Award size={12} color={Colors.accent} />
                <Text style={styles.credImpactText}>+{post.credibilityImpact} credibility</Text>
              </View>
            )}
          </View>

          <Text style={styles.postTitle}>{post.title}</Text>

          <TouchableOpacity style={styles.authorCard} onPress={handleAuthorPress}>
            <Image source={{ uri: post.author.avatar }} style={styles.authorAvatar} />
            <View style={styles.authorInfo}>
              <Text style={styles.authorName}>{post.author.name}</Text>
              <Text style={styles.authorRole}>{post.author.role}</Text>
            </View>
            <View style={styles.authorScore}>
              <Star size={14} color={Colors.accent} />
              <Text style={styles.scoreValue}>{post.author.credibilityScore}</Text>
            </View>
            <ChevronRight size={18} color={Colors.textMuted} />
          </TouchableOpacity>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Clock size={14} color={Colors.textMuted} />
              <Text style={styles.metaText}>{formatDate(post.createdAt)}</Text>
            </View>
            <View style={styles.metaItem}>
              <Eye size={14} color={Colors.textMuted} />
              <Text style={styles.metaText}>{post.views} views</Text>
            </View>
          </View>
        </View>

        {post.geoLocation && (
          <TouchableOpacity style={styles.locationCard} onPress={handleOpenMap}>
            <View style={styles.locationIconWrapper}>
              <MapPin size={20} color={Colors.primary} />
            </View>
            <View style={styles.locationInfo}>
              <Text style={styles.locationPlace}>{post.geoLocation.placeName}</Text>
              <Text style={styles.locationCountry}>
                {post.geoLocation.country}, {post.geoLocation.region}
              </Text>
            </View>
            <View style={styles.locationCoords}>
              <Navigation size={14} color={Colors.textMuted} />
              <Text style={styles.coordsText}>
                {post.geoLocation.latitude.toFixed(4)}, {post.geoLocation.longitude.toFixed(4)}
              </Text>
            </View>
            <ExternalLink size={16} color={Colors.primary} />
          </TouchableOpacity>
        )}

        <View style={styles.contentSection}>
          {renderContent(post.content)}
        </View>

        {post.attachments.length > 0 && (
          <View style={styles.attachmentsSection}>
            <Text style={styles.sectionTitle}>
              Attachments ({post.attachments.length})
            </Text>
            <View style={styles.attachmentsGrid}>
              {post.attachments.map(renderAttachment)}
            </View>
          </View>
        )}

        <View style={styles.tagsSection}>
          <Text style={styles.sectionTitle}>Tags</Text>
          <View style={styles.tagsRow}>
            {post.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
            {post.issueArea && (
              <View style={[styles.tag, styles.issueTag]}>
                <Text style={[styles.tagText, styles.issueTagText]}>{post.issueArea}</Text>
              </View>
            )}
          </View>
        </View>

        {post.linkedInitiatives && post.linkedInitiatives.length > 0 && (
          <View style={styles.linkedSection}>
            <Text style={styles.sectionTitle}>Linked Initiatives</Text>
            {post.linkedInitiatives.map((initiative) => (
              <TouchableOpacity key={initiative.id} style={styles.linkedCard}>
                <View style={[styles.linkedIcon, { backgroundColor: getInitiativeColor(initiative.type) + '20' }]}>
                  <Link2 size={16} color={getInitiativeColor(initiative.type)} />
                </View>
                <View style={styles.linkedInfo}>
                  <Text style={[styles.linkedType, { color: getInitiativeColor(initiative.type) }]}>
                    {initiative.type.toUpperCase()}
                  </Text>
                  <Text style={styles.linkedTitle}>{initiative.title}</Text>
                </View>
                <View style={[styles.linkedStatus, { backgroundColor: getInitiativeColor(initiative.type) + '20' }]}>
                  <Text style={[styles.linkedStatusText, { color: getInitiativeColor(initiative.type) }]}>
                    {initiative.status}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {post.aiAnalysis && (
          <View style={styles.aiSection}>
            <AIInsights analysis={post.aiAnalysis} variant="full" showPatterns={true} />
          </View>
        )}

        {post.endorsements && post.endorsements.length > 0 && (
          <View style={styles.endorsementSection}>
            <PeerEndorsement
              endorsements={post.endorsements}
              credibilityImpact={post.credibilityImpact}
              onAddEndorsement={(type, comment) => {
                console.log('Adding endorsement:', type, comment);
              }}
            />
          </View>
        )}

        {post.dataSovereignty && (
          <View style={styles.sovereigntySection}>
            <View style={styles.sovereigntyHeader}>
              <Shield size={16} color={Colors.primary} />
              <Text style={styles.sovereigntyTitle}>Data Sovereignty</Text>
            </View>
            <Text style={styles.sovereigntyOwner}>Owner: {post.dataSovereignty.owner}</Text>
            {post.dataSovereignty.restrictions && post.dataSovereignty.restrictions.length > 0 && (
              <View style={styles.restrictionsList}>
                {post.dataSovereignty.restrictions.map((restriction, index) => (
                  <Text key={index} style={styles.restrictionText}>• {restriction}</Text>
                ))}
              </View>
            )}
          </View>
        )}

        <View style={styles.engagementCard}>
          <TouchableOpacity
            style={[styles.engagementAction, hasUpvoted && styles.engagementActionActive]}
            onPress={handleUpvote}
          >
            <ArrowUp size={22} color={hasUpvoted ? Colors.primary : Colors.text} />
            <Text style={[styles.engagementCount, hasUpvoted && styles.engagementCountActive]}>
              {localUpvotes}
            </Text>
            <Text style={styles.engagementLabel}>Upvotes</Text>
          </TouchableOpacity>
          <View style={styles.engagementDivider} />
          <View style={styles.engagementAction}>
            <MessageCircle size={22} color={Colors.text} />
            <Text style={styles.engagementCount}>{post.commentCount}</Text>
            <Text style={styles.engagementLabel}>Comments</Text>
          </View>
          <View style={styles.engagementDivider} />
          <TouchableOpacity style={styles.engagementAction} onPress={handleShare}>
            <Share2 size={22} color={Colors.text} />
            <Text style={styles.engagementLabel}>Share</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.commentsSection}>
          <Text style={styles.sectionTitle}>
            Comments ({comments.length})
          </Text>

          <View style={styles.commentInputWrapper}>
            <TextInput
              style={styles.commentInput}
              placeholder="Share your thoughts or expertise..."
              placeholderTextColor={Colors.textMuted}
              value={newComment}
              onChangeText={setNewComment}
              multiline
            />
            <TouchableOpacity
              style={[
                styles.commentSubmit,
                !newComment.trim() && styles.commentSubmitDisabled,
              ]}
              onPress={handleSubmitComment}
              disabled={!newComment.trim()}
            >
              <Send size={18} color={newComment.trim() ? Colors.background : Colors.textMuted} />
            </TouchableOpacity>
          </View>

          {comments.length > 0 ? (
            comments.map(renderComment)
          ) : (
            <View style={styles.noComments}>
              <MessageCircle size={32} color={Colors.textMuted} />
              <Text style={styles.noCommentsText}>No comments yet</Text>
              <Text style={styles.noCommentsSubtext}>Be the first to share your insights</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 16,
    color: Colors.textMuted,
    marginBottom: 16,
  },
  backLink: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  backLinkText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600' as const,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerAction: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerActionActive: {
    backgroundColor: Colors.accent + '20',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  urgencyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  urgencyText: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: Colors.background,
    letterSpacing: 0.5,
  },
  postHeader: {
    padding: 16,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.background,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.success + '20',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verifiedText: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: Colors.success,
  },
  postTitle: {
    fontSize: 22,
    fontWeight: '800' as const,
    color: Colors.text,
    lineHeight: 30,
    marginBottom: 16,
  },
  authorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  authorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: Colors.primary,
    marginRight: 12,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 2,
  },
  authorRole: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  authorScore: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
  },
  scoreValue: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.accent,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.primary + '40',
  },
  locationIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  locationInfo: {
    flex: 1,
  },
  locationPlace: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 2,
  },
  locationCountry: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  locationCoords: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginRight: 10,
  },
  coordsText: {
    fontSize: 10,
    color: Colors.textMuted,
    fontFamily: 'monospace',
  },
  contentSection: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  contentText: {
    fontSize: 15,
    color: Colors.text,
    lineHeight: 24,
    marginBottom: 8,
  },
  contentHeading: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  bulletPoint: {
    flexDirection: 'row',
    paddingLeft: 8,
    marginBottom: 6,
  },
  bullet: {
    fontSize: 15,
    color: Colors.primary,
    marginRight: 10,
    lineHeight: 24,
  },
  bulletText: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
    lineHeight: 24,
  },
  tableRow: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontFamily: 'monospace',
    backgroundColor: Colors.card,
    padding: 6,
    marginBottom: 2,
    borderRadius: 4,
  },
  spacer: {
    height: 12,
  },
  attachmentsSection: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 14,
  },
  attachmentsGrid: {
    gap: 10,
  },
  attachmentCard: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  attachmentCardMedia: {
    borderRadius: 12,
  },
  attachmentImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  videoThumbnail: {
    width: '100%',
    height: 180,
    backgroundColor: Colors.card,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoDuration: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    fontSize: 11,
    fontWeight: '600' as const,
    color: Colors.background,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  attachmentFileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  attachmentIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  attachmentFileInfo: {
    flex: 1,
  },
  attachmentFileName: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.text,
    marginBottom: 2,
  },
  attachmentFileSize: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  tagsSection: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: Colors.card,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tagText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
  },
  issueTag: {
    backgroundColor: Colors.accent + '20',
    borderColor: Colors.accent + '40',
  },
  issueTagText: {
    color: Colors.accent,
  },
  linkedSection: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  linkedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  linkedIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  linkedInfo: {
    flex: 1,
  },
  linkedType: {
    fontSize: 10,
    fontWeight: '700' as const,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  linkedTitle: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.text,
  },
  linkedStatus: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  linkedStatusText: {
    fontSize: 11,
    fontWeight: '600' as const,
  },
  engagementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: Colors.card,
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  engagementAction: {
    alignItems: 'center',
    flex: 1,
  },
  engagementActionActive: {
    opacity: 1,
  },
  engagementCount: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
    marginTop: 6,
  },
  engagementCountActive: {
    color: Colors.primary,
  },
  engagementLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  engagementDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.border,
  },
  commentsSection: {
    paddingHorizontal: 16,
  },
  commentInputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 10,
  },
  commentInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
    maxHeight: 100,
    minHeight: 40,
  },
  commentSubmit: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  commentSubmitDisabled: {
    backgroundColor: Colors.backgroundSecondary,
  },
  commentCard: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  commentAuthorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  commentAuthorInfo: {
    flex: 1,
  },
  commentAuthorName: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 2,
  },
  commentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  commentScore: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: Colors.accent,
  },
  commentTime: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  commentContent: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 22,
    marginBottom: 10,
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  commentAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  commentActionText: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '500' as const,
  },
  noComments: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noCommentsText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginTop: 12,
  },
  noCommentsSubtext: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 4,
  },
  knowledgeTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
    flexWrap: 'wrap',
  },
  highSignalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.success + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  highSignalText: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: Colors.success,
  },
  credImpactBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.accent + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  credImpactText: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: Colors.accent,
  },
  aiSection: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  endorsementSection: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sovereigntySection: {
    backgroundColor: Colors.primary + '10',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.primary + '30',
  },
  sovereigntyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  sovereigntyTitle: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  sovereigntyOwner: {
    fontSize: 13,
    color: Colors.text,
    marginBottom: 6,
  },
  restrictionsList: {
    marginTop: 6,
  },
  restrictionText: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});
