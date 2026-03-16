import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  ArrowUp,
  MessageSquare,
  Eye,
  MoreVertical,
  Send,
  Pin,
  Star,
  Edit2,
  Trash2,
  Share2,
  MapPin,
  Globe,
  Link2,
  FileText,
  Image as ImageIcon,
  Video,
  Music,
  Paperclip,
  Download,
  ExternalLink,
  Plus,
  Shield,
  TrendingUp,
  Award,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import {
  getThreadById,
  getCategoryById,
  Reply,
  Attachment,
  LinkedInitiative,
} from '@/mocks/discussions';
import AIInsights from '@/components/AIInsights';
import PeerEndorsement from '@/components/PeerEndorsement';
import KnowledgeTypeBadge from '@/components/KnowledgeTypeBadge';

const CURRENT_USER_ID = 'auth1';

export default function DiscussionThreadScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [replyText, setReplyText] = useState('');
  const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [showOptionsMenu, setShowOptionsMenu] = useState<string | null>(null);
  const [userUpvotes, setUserUpvotes] = useState<Set<string>>(new Set());
  const [localReplies, setLocalReplies] = useState<Reply[]>([]);
  const [showAttachmentPicker, setShowAttachmentPicker] = useState(false);

  const thread = useMemo(() => getThreadById(id || ''), [id]);
  const category = useMemo(
    () => (thread ? getCategoryById(thread.categoryId) : undefined),
    [thread]
  );

  const allReplies = useMemo(() => {
    if (!thread) return [];
    return [...thread.replies, ...localReplies];
  }, [thread, localReplies]);

  if (!thread) {
    return (
      <View style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={22} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Discussion</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.errorState}>
          <Text style={styles.errorTitle}>Discussion not found</Text>
          <Text style={styles.errorText}>
            This discussion may have been deleted or moved.
          </Text>
        </View>
      </View>
    );
  }

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
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleUpvote = (itemId: string) => {
    setUserUpvotes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const handleSubmitReply = () => {
    if (!replyText.trim()) return;

    const newReply: Reply = {
      id: `local-${Date.now()}`,
      threadId: thread.id,
      author: {
        id: CURRENT_USER_ID,
        name: 'Dr. Amina Okonkwo',
        avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&h=150&fit=crop',
        role: 'Researcher',
        credibilityScore: 94,
      },
      content: replyText.trim(),
      createdAt: new Date().toISOString(),
      upvotes: 0,
      isEdited: false,
    };

    setLocalReplies((prev) => [...prev, newReply]);
    setReplyText('');
    console.log('Reply submitted:', newReply);
  };

  const handleEditReply = (replyId: string, content: string) => {
    setEditingReplyId(replyId);
    setEditText(content);
    setShowOptionsMenu(null);
  };

  const handleSaveEdit = (replyId: string) => {
    if (!editText.trim()) return;

    setLocalReplies((prev) =>
      prev.map((reply) =>
        reply.id === replyId
          ? { ...reply, content: editText.trim(), isEdited: true }
          : reply
      )
    );
    setEditingReplyId(null);
    setEditText('');
    console.log('Reply edited:', replyId);
  };

  const handleDeleteReply = (replyId: string) => {
    Alert.alert(
      'Delete Reply',
      'Are you sure you want to delete this reply? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setLocalReplies((prev) => prev.filter((r) => r.id !== replyId));
            setShowOptionsMenu(null);
            console.log('Reply deleted:', replyId);
          },
        },
      ]
    );
  };

  const isOwnContent = (authorId: string) => authorId === CURRENT_USER_ID;

  const getAttachmentIcon = (type: string) => {
    switch (type) {
      case 'document': return <FileText size={16} color={Colors.primary} />;
      case 'photo': return <ImageIcon size={16} color={Colors.success} />;
      case 'video': return <Video size={16} color={Colors.accent} />;
      case 'audio': return <Music size={16} color={Colors.warning} />;
      default: return <Paperclip size={16} color={Colors.textMuted} />;
    }
  };

  const getInitiativeColor = (type: string) => {
    switch (type) {
      case 'proposal': return Colors.primary;
      case 'ask': return Colors.accent;
      case 'dao': return Colors.success;
      default: return Colors.textMuted;
    }
  };

  const handleAttachFile = (type: 'document' | 'photo' | 'video' | 'audio') => {
    console.log('Attaching file type:', type);
    setShowAttachmentPicker(false);
    Alert.alert('Attachment', `${type.charAt(0).toUpperCase() + type.slice(1)} upload would open here`);
  };

  const renderAttachment = (attachment: Attachment) => (
    <TouchableOpacity key={attachment.id} style={styles.attachmentItem}>
      <View style={styles.attachmentIcon}>
        {getAttachmentIcon(attachment.type)}
      </View>
      <View style={styles.attachmentInfo}>
        <Text style={styles.attachmentName} numberOfLines={1}>{attachment.name}</Text>
        <Text style={styles.attachmentSize}>{attachment.size}</Text>
      </View>
      <TouchableOpacity style={styles.attachmentAction}>
        <Download size={16} color={Colors.primary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderLinkedInitiative = (initiative: LinkedInitiative) => (
    <TouchableOpacity key={initiative.id} style={styles.linkedItem}>
      <View style={[styles.linkedIcon, { backgroundColor: getInitiativeColor(initiative.type) + '20' }]}>
        <Link2 size={14} color={getInitiativeColor(initiative.type)} />
      </View>
      <View style={styles.linkedInfo}>
        <Text style={styles.linkedType}>{initiative.type.toUpperCase()}</Text>
        <Text style={styles.linkedTitle} numberOfLines={1}>{initiative.title}</Text>
      </View>
      <View style={[styles.linkedStatus, { backgroundColor: getInitiativeColor(initiative.type) + '15' }]}>
        <Text style={[styles.linkedStatusText, { color: getInitiativeColor(initiative.type) }]}>{initiative.status}</Text>
      </View>
      <ExternalLink size={14} color={Colors.textMuted} />
    </TouchableOpacity>
  );

  const renderContent = (content: string) => {
    const parts = content.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <Text key={index} style={styles.boldText}>
            {part.slice(2, -2)}
          </Text>
        );
      }
      return <Text key={index}>{part}</Text>;
    });
  };

  const renderReply = (reply: Reply, index: number) => {
    const isEditing = editingReplyId === reply.id;
    const isOwn = isOwnContent(reply.author.id);
    const hasUpvoted = userUpvotes.has(reply.id);
    const isLocal = reply.id.startsWith('local-');

    return (
      <View key={reply.id} style={styles.replyCard}>
        <View style={styles.replyHeader}>
          <TouchableOpacity
            style={styles.replyAuthor}
            onPress={() => router.push(`/user/${reply.author.id}`)}
          >
            <Image
              source={{ uri: reply.author.avatar }}
              style={styles.replyAvatar}
            />
            <View>
              <View style={styles.authorNameRow}>
                <Text style={styles.replyAuthorName}>{reply.author.name}</Text>
                {isOwn && (
                  <View style={styles.youBadge}>
                    <Text style={styles.youBadgeText}>You</Text>
                  </View>
                )}
              </View>
              <View style={styles.replyMeta}>
                <Star size={10} color={Colors.accent} />
                <Text style={styles.replyScore}>{reply.author.credibilityScore}</Text>
                <Text style={styles.replyRole}>· {reply.author.role}</Text>
              </View>
            </View>
          </TouchableOpacity>

          <View style={styles.replyActions}>
            <Text style={styles.replyTime}>{formatTimeAgo(reply.createdAt)}</Text>
            {(isOwn || isLocal) && (
              <TouchableOpacity
                style={styles.moreButton}
                onPress={() =>
                  setShowOptionsMenu(showOptionsMenu === reply.id ? null : reply.id)
                }
              >
                <MoreVertical size={16} color={Colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {showOptionsMenu === reply.id && (
          <View style={styles.optionsMenu}>
            <TouchableOpacity
              style={styles.optionItem}
              onPress={() => handleEditReply(reply.id, reply.content)}
            >
              <Edit2 size={16} color={Colors.text} />
              <Text style={styles.optionText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionItem, styles.optionItemDanger]}
              onPress={() => handleDeleteReply(reply.id)}
            >
              <Trash2 size={16} color={Colors.error} />
              <Text style={[styles.optionText, styles.optionTextDanger]}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}

        {isEditing ? (
          <View style={styles.editContainer}>
            <TextInput
              style={styles.editInput}
              value={editText}
              onChangeText={setEditText}
              multiline
              autoFocus
            />
            <View style={styles.editActions}>
              <TouchableOpacity
                style={styles.editCancel}
                onPress={() => {
                  setEditingReplyId(null);
                  setEditText('');
                }}
              >
                <Text style={styles.editCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.editSave}
                onPress={() => handleSaveEdit(reply.id)}
              >
                <Text style={styles.editSaveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <Text style={styles.replyContent}>
            {reply.content}
            {reply.isEdited && (
              <Text style={styles.editedLabel}> (edited)</Text>
            )}
          </Text>
        )}

        <View style={styles.replyFooter}>
          <TouchableOpacity
            style={[styles.upvoteButton, hasUpvoted && styles.upvoteButtonActive]}
            onPress={() => handleUpvote(reply.id)}
          >
            <ArrowUp
              size={16}
              color={hasUpvoted ? Colors.primary : Colors.textMuted}
            />
            <Text
              style={[
                styles.upvoteCount,
                hasUpvoted && styles.upvoteCountActive,
              ]}
            >
              {reply.upvotes + (hasUpvoted ? 1 : 0)}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.replyToButton}>
            <MessageSquare size={14} color={Colors.textMuted} />
            <Text style={styles.replyToText}>Reply</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const threadHasUpvoted = userUpvotes.has(thread.id);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
    >
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          testID="back-button"
        >
          <ArrowLeft size={22} color={Colors.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            Discussion
          </Text>
          {category && (
            <Text style={[styles.headerCategory, { color: category.color }]}>
              {category.name.split('&')[0].trim()}
            </Text>
          )}
        </View>
        <TouchableOpacity style={styles.shareButton}>
          <Share2 size={20} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 80 },
        ]}
      >
        <View style={styles.threadContainer}>
          {thread.isPinned && (
            <View style={styles.pinnedBadge}>
              <Pin size={12} color={Colors.accent} />
              <Text style={styles.pinnedText}>Pinned Discussion</Text>
            </View>
          )}

          <Text style={styles.threadTitle}>{thread.title}</Text>

          <View style={styles.knowledgeTypeRow}>
            <KnowledgeTypeBadge type={thread.knowledgeType} variant="badge" />
            {thread.isHighSignal && (
              <View style={styles.highSignalBadge}>
                <TrendingUp size={12} color={Colors.success} />
                <Text style={styles.highSignalText}>High Signal</Text>
              </View>
            )}
            {thread.credibilityImpact && thread.credibilityImpact > 0 && (
              <View style={styles.credImpactBadge}>
                <Award size={12} color={Colors.accent} />
                <Text style={styles.credImpactText}>+{thread.credibilityImpact} credibility</Text>
              </View>
            )}
          </View>

          <View style={styles.threadMeta}>
            {thread.geographicTags?.country && (
              <View style={styles.geoTag}>
                <MapPin size={12} color={Colors.primary} />
                <Text style={styles.geoTagText}>{thread.geographicTags.country}</Text>
              </View>
            )}
            {thread.geographicTags?.region && (
              <View style={styles.regionTag}>
                <Globe size={12} color={Colors.textSecondary} />
                <Text style={styles.regionTagText}>{thread.geographicTags.region}</Text>
              </View>
            )}
            {thread.issueArea && (
              <View style={styles.issueTag}>
                <Text style={styles.issueTagText}>{thread.issueArea}</Text>
              </View>
            )}
          </View>

          <View style={styles.threadTags}>
            {thread.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={styles.authorSection}
            onPress={() => router.push(`/user/${thread.author.id}`)}
          >
            <Image
              source={{ uri: thread.author.avatar }}
              style={styles.authorAvatar}
            />
            <View style={styles.authorDetails}>
              <Text style={styles.authorName}>{thread.author.name}</Text>
              <View style={styles.authorMeta}>
                <View style={styles.credibilityBadge}>
                  <Star size={10} color={Colors.accent} />
                  <Text style={styles.credibilityText}>
                    {thread.author.credibilityScore}
                  </Text>
                </View>
                <Text style={styles.authorRole}>{thread.author.role}</Text>
                <Text style={styles.postDate}>· {formatDate(thread.createdAt)}</Text>
              </View>
            </View>
          </TouchableOpacity>

          <Text style={styles.threadContent}>{renderContent(thread.content)}</Text>

          {thread.attachments && thread.attachments.length > 0 && (
            <View style={styles.attachmentsSection}>
              <Text style={styles.attachmentsTitle}>
                <Paperclip size={14} color={Colors.text} /> Attachments ({thread.attachments.length})
              </Text>
              {thread.attachments.map(renderAttachment)}
            </View>
          )}

          {thread.linkedInitiatives && thread.linkedInitiatives.length > 0 && (
            <View style={styles.linkedSection}>
              <Text style={styles.linkedSectionTitle}>
                <Link2 size={14} color={Colors.text} /> Linked Initiatives
              </Text>
              {thread.linkedInitiatives.map(renderLinkedInitiative)}
            </View>
          )}

          {thread.aiAnalysis && (
            <View style={styles.aiSection}>
              <AIInsights analysis={thread.aiAnalysis} variant="full" showPatterns={true} />
            </View>
          )}

          {thread.endorsements && thread.endorsements.length > 0 && (
            <View style={styles.endorsementSection}>
              <PeerEndorsement
                endorsements={thread.endorsements}
                credibilityImpact={thread.credibilityImpact}
                onAddEndorsement={(type, comment) => {
                  console.log('Adding endorsement:', type, comment);
                }}
              />
            </View>
          )}

          {thread.dataSovereignty && (
            <View style={styles.sovereigntySection}>
              <View style={styles.sovereigntyHeader}>
                <Shield size={16} color={Colors.primary} />
                <Text style={styles.sovereigntyTitle}>Data Sovereignty</Text>
              </View>
              <Text style={styles.sovereigntyOwner}>Owner: {thread.dataSovereignty.owner}</Text>
              {thread.dataSovereignty.restrictions && thread.dataSovereignty.restrictions.length > 0 && (
                <View style={styles.restrictionsList}>
                  {thread.dataSovereignty.restrictions.map((restriction, index) => (
                    <Text key={index} style={styles.restrictionText}>• {restriction}</Text>
                  ))}
                </View>
              )}
            </View>
          )}

          <View style={styles.threadStats}>
            <TouchableOpacity
              style={[
                styles.upvoteSection,
                threadHasUpvoted && styles.upvoteSectionActive,
              ]}
              onPress={() => handleUpvote(thread.id)}
            >
              <ArrowUp
                size={18}
                color={threadHasUpvoted ? Colors.primary : Colors.textMuted}
              />
              <Text
                style={[
                  styles.upvoteText,
                  threadHasUpvoted && styles.upvoteTextActive,
                ]}
              >
                {thread.upvotes + (threadHasUpvoted ? 1 : 0)} upvotes
              </Text>
            </TouchableOpacity>

            <View style={styles.statItem}>
              <Eye size={16} color={Colors.textMuted} />
              <Text style={styles.statText}>{thread.views} views</Text>
            </View>

            <View style={styles.statItem}>
              <MessageSquare size={16} color={Colors.textMuted} />
              <Text style={styles.statText}>{allReplies.length} replies</Text>
            </View>
          </View>
        </View>

        <View style={styles.repliesSection}>
          <Text style={styles.repliesTitle}>
            Replies ({allReplies.length})
          </Text>

          {allReplies.length === 0 ? (
            <View style={styles.noReplies}>
              <MessageSquare size={32} color={Colors.textMuted} />
              <Text style={styles.noRepliesText}>
                No replies yet. Be the first to contribute!
              </Text>
            </View>
          ) : (
            allReplies.map(renderReply)
          )}
        </View>
      </ScrollView>

      <View style={[styles.replyInput, { paddingBottom: insets.bottom + 12 }]}>
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&h=150&fit=crop',
          }}
          style={styles.replyInputAvatar}
        />
        <View style={styles.replyInputWrapper}>
          <View style={styles.replyInputContainer}>
            <TouchableOpacity
              style={styles.attachButton}
              onPress={() => setShowAttachmentPicker(!showAttachmentPicker)}
            >
              <Plus size={18} color={Colors.textMuted} />
            </TouchableOpacity>
            <TextInput
              style={styles.replyTextInput}
              placeholder="Write a reply..."
              placeholderTextColor={Colors.textMuted}
              value={replyText}
              onChangeText={setReplyText}
              multiline
              maxLength={2000}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                !replyText.trim() && styles.sendButtonDisabled,
              ]}
              onPress={handleSubmitReply}
              disabled={!replyText.trim()}
            >
              <Send
                size={18}
                color={replyText.trim() ? Colors.background : Colors.textMuted}
              />
            </TouchableOpacity>
          </View>
          {showAttachmentPicker && (
            <View style={styles.attachmentPicker}>
              <TouchableOpacity style={styles.attachmentOption} onPress={() => handleAttachFile('document')}>
                <View style={[styles.attachOptionIcon, { backgroundColor: Colors.primary + '20' }]}>
                  <FileText size={18} color={Colors.primary} />
                </View>
                <Text style={styles.attachOptionText}>Document</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.attachmentOption} onPress={() => handleAttachFile('photo')}>
                <View style={[styles.attachOptionIcon, { backgroundColor: Colors.success + '20' }]}>
                  <ImageIcon size={18} color={Colors.success} />
                </View>
                <Text style={styles.attachOptionText}>Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.attachmentOption} onPress={() => handleAttachFile('video')}>
                <View style={[styles.attachOptionIcon, { backgroundColor: Colors.accent + '20' }]}>
                  <Video size={18} color={Colors.accent} />
                </View>
                <Text style={styles.attachOptionText}>Video</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.attachmentOption} onPress={() => handleAttachFile('audio')}>
                <View style={[styles.attachOptionIcon, { backgroundColor: Colors.warning + '20' }]}>
                  <Music size={18} color={Colors.warning} />
                </View>
                <Text style={styles.attachOptionText}>Audio</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
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
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  headerCategory: {
    fontSize: 11,
    fontWeight: '600' as const,
    marginTop: 2,
  },
  headerRight: {
    width: 40,
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
  },
  threadContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  pinnedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  pinnedText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.accent,
  },
  threadTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.text,
    lineHeight: 30,
    marginBottom: 12,
  },
  threadMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  geoTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primary + '15',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  geoTagText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  regionTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  regionTagText: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: Colors.textSecondary,
  },
  issueTag: {
    backgroundColor: Colors.accent + '20',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  issueTagText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.accent,
  },
  threadTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    backgroundColor: Colors.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: Colors.textSecondary,
  },
  authorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: Colors.card,
    padding: 12,
    borderRadius: 12,
  },
  authorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  authorDetails: {
    marginLeft: 12,
    flex: 1,
  },
  authorName: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  authorMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  credibilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  credibilityText: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: Colors.accent,
  },
  authorRole: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  postDate: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  threadContent: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 24,
    marginBottom: 20,
  },
  boldText: {
    fontWeight: '700' as const,
    color: Colors.text,
  },
  attachmentsSection: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  attachmentsTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 12,
  },
  attachmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
  },
  attachmentIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  attachmentInfo: {
    flex: 1,
    marginLeft: 10,
  },
  attachmentName: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: Colors.text,
  },
  attachmentSize: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  attachmentAction: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkedSection: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  linkedSectionTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 12,
  },
  linkedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    gap: 10,
  },
  linkedIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkedInfo: {
    flex: 1,
  },
  linkedType: {
    fontSize: 9,
    fontWeight: '700' as const,
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
  linkedTitle: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: Colors.text,
    marginTop: 2,
  },
  linkedStatus: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  linkedStatusText: {
    fontSize: 10,
    fontWeight: '600' as const,
  },
  threadStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  upvoteSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.card,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  upvoteSectionActive: {
    backgroundColor: Colors.primary + '20',
    borderColor: Colors.primary,
  },
  upvoteText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.textMuted,
  },
  upvoteTextActive: {
    color: Colors.primary,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  repliesSection: {
    padding: 16,
  },
  repliesTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 16,
  },
  noReplies: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noRepliesText: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 12,
    textAlign: 'center',
  },
  replyCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  replyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  replyAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  replyAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  authorNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginLeft: 10,
  },
  replyAuthorName: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  youBadge: {
    backgroundColor: Colors.primary + '30',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  youBadgeText: {
    fontSize: 9,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  replyMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: 10,
    marginTop: 2,
  },
  replyScore: {
    fontSize: 10,
    fontWeight: '600' as const,
    color: Colors.accent,
  },
  replyRole: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  replyActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  replyTime: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  moreButton: {
    padding: 4,
  },
  optionsMenu: {
    backgroundColor: Colors.cardElevated,
    borderRadius: 10,
    marginBottom: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  optionItemDanger: {
    borderBottomWidth: 0,
  },
  optionText: {
    fontSize: 14,
    color: Colors.text,
  },
  optionTextDanger: {
    color: Colors.error,
  },
  replyContent: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: 12,
  },
  editedLabel: {
    fontSize: 11,
    fontStyle: 'italic',
    color: Colors.textMuted,
  },
  editContainer: {
    marginBottom: 12,
  },
  editInput: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: Colors.text,
    minHeight: 80,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 10,
  },
  editCancel: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: Colors.backgroundSecondary,
  },
  editCancelText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  editSave: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: Colors.primary,
  },
  editSaveText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.background,
  },
  replyFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  upvoteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.backgroundSecondary,
  },
  upvoteButtonActive: {
    backgroundColor: Colors.primary + '20',
  },
  upvoteCount: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.textMuted,
  },
  upvoteCountActive: {
    color: Colors.primary,
  },
  replyToButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  replyToText: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  replyInput: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  replyInputAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
    marginBottom: 4,
  },
  replyInputWrapper: {
    flex: 1,
  },
  replyInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: Colors.card,
    borderRadius: 20,
    paddingLeft: 6,
    paddingRight: 6,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  attachButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  replyTextInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
    maxHeight: 100,
    paddingVertical: 6,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: Colors.backgroundSecondary,
  },
  attachmentPicker: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  attachmentOption: {
    alignItems: 'center',
    gap: 6,
  },
  attachOptionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  attachOptionText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
  },
  errorState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  knowledgeTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
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
    marginBottom: 16,
  },
  endorsementSection: {
    marginBottom: 16,
  },
  sovereigntySection: {
    backgroundColor: Colors.primary + '10',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
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
