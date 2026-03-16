import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  FlatList,
  Animated,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Users,
  Plus,
  Heart,
  MessageCircle,
  Play,
  MoreHorizontal,
  X,
  Upload,
  Video,
  ImageIcon,
  Send,
  Paperclip,
  Mic,
  FileText,
  ChevronRight,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { currentUser } from '@/mocks/userProfile';
import { communityFeedPosts, CommunityPost, PostComment, getMorePosts } from '@/mocks/communityFeed';

export default function CommunityFeedScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [feedPosts, setFeedPosts] = useState<CommunityPost[]>(communityFeedPosts);
  const [feedPage, setFeedPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostMediaType, setNewPostMediaType] = useState<'text' | 'photo' | 'video'>('text');
  const [newComment, setNewComment] = useState('');
  const [commentAttachmentType, setCommentAttachmentType] = useState<'text' | 'photo' | 'video' | 'audio' | 'document' | null>(null);
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
  const likeAnimations = useRef<{ [key: string]: Animated.Value }>({}).current;

  const getOrCreateLikeAnimation = (postId: string) => {
    if (!likeAnimations[postId]) {
      likeAnimations[postId] = new Animated.Value(1);
    }
    return likeAnimations[postId];
  };

  const handleLikePost = (postId: string) => {
    const animation = getOrCreateLikeAnimation(postId);
    Animated.sequence([
      Animated.timing(animation, { toValue: 1.3, duration: 100, useNativeDriver: true }),
      Animated.timing(animation, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();

    setFeedPosts(posts => posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
        };
      }
      return post;
    }));
  };

  const handleLoadMorePosts = useCallback(() => {
    if (loadingMore) return;
    setLoadingMore(true);
    setTimeout(() => {
      const morePosts = getMorePosts(feedPage + 1);
      setFeedPosts(prev => [...prev, ...morePosts]);
      setFeedPage(prev => prev + 1);
      setLoadingMore(false);
    }, 1000);
  }, [feedPage, loadingMore]);

  const handleCreatePost = () => {
    if (!newPostContent.trim()) return;

    const newPost: CommunityPost = {
      id: `post_new_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      userRole: currentUser.role as 'Researcher' | 'Builder' | 'Funder' | 'Hybrid',
      userAffiliation: currentUser.affiliation,
      content: newPostContent,
      media: newPostMediaType !== 'text' ? [{
        type: newPostMediaType,
        url: 'https://images.unsplash.com/photo-1581093458791-9d42e3c7e117?w=800',
      }] : undefined,
      timestamp: new Date().toISOString(),
      likes: 0,
      isLiked: false,
      comments: [],
      commentsCount: 0,
    };

    setFeedPosts([newPost, ...feedPosts]);
    setShowCreatePostModal(false);
    setNewPostContent('');
    setNewPostMediaType('text');
  };

  const handleAddComment = () => {
    if (!newComment.trim() && !commentAttachmentType) return;

    if (selectedPost) {
      const newCommentObj: PostComment = {
        id: `comment_new_${Date.now()}`,
        userId: currentUser.id,
        userName: currentUser.name,
        userAvatar: currentUser.avatar,
        content: newComment,
        attachments: commentAttachmentType ? [{
          id: `att_new_${Date.now()}`,
          type: commentAttachmentType as 'photo' | 'video' | 'audio' | 'document',
          url: '#',
          name: commentAttachmentType === 'document' ? 'Attachment.pdf' : undefined,
          duration: commentAttachmentType === 'audio' ? 30 : undefined,
        }] : undefined,
        timestamp: new Date().toISOString(),
        likes: 0,
        isLiked: false,
      };

      setFeedPosts(posts => posts.map(post => {
        if (post.id === selectedPost.id) {
          return {
            ...post,
            comments: [...post.comments, newCommentObj],
            commentsCount: post.commentsCount + 1,
          };
        }
        return post;
      }));

      setSelectedPost(prev => prev ? {
        ...prev,
        comments: [...prev.comments, newCommentObj],
        commentsCount: prev.commentsCount + 1,
      } : null);

      setNewComment('');
      setCommentAttachmentType(null);
      setShowAttachmentOptions(false);
    }
  };

  const openComments = (post: CommunityPost) => {
    setSelectedPost(post);
    setShowCommentsModal(true);
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Researcher':
        return Colors.primary;
      case 'Builder':
        return Colors.accent;
      case 'Funder':
        return Colors.clay;
      case 'Hybrid':
        return Colors.success;
      default:
        return Colors.textSecondary;
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push('/profile')}
          testID="back-button"
        >
          <ArrowLeft size={22} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Community Feed</Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.communityHeader}>
        <TouchableOpacity
          style={styles.communityMembersButton}
          onPress={() => router.push('/community')}
          testID="community-members-button"
        >
          <Users size={18} color={Colors.primary} />
          <Text style={styles.communityMembersText}>Community Members</Text>
          <ChevronRight size={16} color={Colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.createPostButton}
          onPress={() => setShowCreatePostModal(true)}
          testID="create-post-button"
        >
          <Plus size={18} color={Colors.background} />
          <Text style={styles.createPostButtonText}>Post</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={feedPosts}
        keyExtractor={(item) => item.id}
        onEndReached={handleLoadMorePosts}
        onEndReachedThreshold={0.5}
        contentContainerStyle={styles.feedContent}
        renderItem={({ item: post }) => (
          <View style={styles.feedPost}>
            <View style={styles.feedPostHeader}>
              <Image source={{ uri: post.userAvatar }} style={styles.feedPostAvatar} />
              <View style={styles.feedPostUserInfo}>
                <Text style={styles.feedPostUserName}>{post.userName}</Text>
                <View style={styles.feedPostMeta}>
                  <View style={[styles.feedPostRoleBadge, { backgroundColor: getRoleBadgeColor(post.userRole) }]}>
                    <Text style={styles.feedPostRoleBadgeText}>{post.userRole}</Text>
                  </View>
                  <Text style={styles.feedPostTime}>{formatTimeAgo(post.timestamp)}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.feedPostMoreButton}>
                <MoreHorizontal size={20} color={Colors.textMuted} />
              </TouchableOpacity>
            </View>

            <Text style={styles.feedPostContent}>{post.content}</Text>

            {post.media && post.media.length > 0 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.feedPostMediaScroll}
                contentContainerStyle={styles.feedPostMediaContent}
              >
                {post.media.map((media, index) => (
                  <View key={index} style={styles.feedPostMediaItem}>
                    <Image source={{ uri: media.url }} style={styles.feedPostMedia} />
                    {media.type === 'video' && (
                      <View style={styles.feedPostVideoOverlay}>
                        <Play size={32} color={Colors.background} fill={Colors.background} />
                      </View>
                    )}
                  </View>
                ))}
              </ScrollView>
            )}

            <View style={styles.feedPostActions}>
              <TouchableOpacity
                style={styles.feedPostAction}
                onPress={() => handleLikePost(post.id)}
              >
                <Animated.View style={{ transform: [{ scale: getOrCreateLikeAnimation(post.id) }] }}>
                  <Heart
                    size={22}
                    color={post.isLiked ? Colors.error : Colors.textMuted}
                    fill={post.isLiked ? Colors.error : 'transparent'}
                  />
                </Animated.View>
                <Text style={[styles.feedPostActionText, post.isLiked && { color: Colors.error }]}>
                  {post.likes}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.feedPostAction}
                onPress={() => openComments(post)}
              >
                <MessageCircle size={22} color={Colors.textMuted} />
                <Text style={styles.feedPostActionText}>{post.commentsCount}</Text>
              </TouchableOpacity>
            </View>

            {post.comments.length > 0 && (
              <TouchableOpacity
                style={styles.feedPostCommentsPreview}
                onPress={() => openComments(post)}
              >
                <Text style={styles.viewAllComments}>View all {post.commentsCount} comments</Text>
                {post.comments.slice(0, 2).map((comment) => (
                  <View key={comment.id} style={styles.commentPreview}>
                    <Text style={styles.commentPreviewName}>{comment.userName}</Text>
                    <Text style={styles.commentPreviewText} numberOfLines={1}>{comment.content}</Text>
                  </View>
                ))}
              </TouchableOpacity>
            )}
          </View>
        )}
        ListFooterComponent={
          loadingMore ? (
            <View style={styles.loadingMore}>
              <Text style={styles.loadingMoreText}>Loading more posts...</Text>
            </View>
          ) : null
        }
      />

      <Modal
        visible={showCreatePostModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowCreatePostModal(false)}
      >
        <View style={[styles.modalContainer, { paddingTop: insets.top }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowCreatePostModal(false)}>
              <X size={24} color={Colors.text} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Create Post</Text>
            <TouchableOpacity onPress={handleCreatePost}>
              <Text style={styles.modalSaveText}>Post</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={styles.createPostUserRow}>
              <Image source={{ uri: currentUser.avatar }} style={styles.createPostAvatar} />
              <View>
                <Text style={styles.createPostUserName}>{currentUser.name}</Text>
                <Text style={styles.createPostUserAffiliation}>{currentUser.affiliation}</Text>
              </View>
            </View>

            <TextInput
              style={styles.createPostInput}
              placeholder="What's happening in your work?"
              placeholderTextColor={Colors.textMuted}
              multiline
              numberOfLines={6}
              value={newPostContent}
              onChangeText={setNewPostContent}
              textAlignVertical="top"
            />

            <View style={styles.createPostMediaOptions}>
              <Text style={styles.createPostMediaLabel}>Add to your post</Text>
              <View style={styles.createPostMediaButtons}>
                <TouchableOpacity
                  style={[styles.createPostMediaButton, newPostMediaType === 'photo' && styles.createPostMediaButtonActive]}
                  onPress={() => setNewPostMediaType(newPostMediaType === 'photo' ? 'text' : 'photo')}
                >
                  <ImageIcon size={22} color={newPostMediaType === 'photo' ? Colors.primary : Colors.textMuted} />
                  <Text style={[styles.createPostMediaButtonText, newPostMediaType === 'photo' && { color: Colors.primary }]}>Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.createPostMediaButton, newPostMediaType === 'video' && styles.createPostMediaButtonActive]}
                  onPress={() => setNewPostMediaType(newPostMediaType === 'video' ? 'text' : 'video')}
                >
                  <Video size={22} color={newPostMediaType === 'video' ? Colors.primary : Colors.textMuted} />
                  <Text style={[styles.createPostMediaButtonText, newPostMediaType === 'video' && { color: Colors.primary }]}>Video</Text>
                </TouchableOpacity>
              </View>
            </View>

            {newPostMediaType !== 'text' && (
              <TouchableOpacity style={styles.uploadArea}>
                <Upload size={32} color={Colors.textMuted} />
                <Text style={styles.uploadAreaText}>Tap to select {newPostMediaType}</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      </Modal>

      <Modal
        visible={showCommentsModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowCommentsModal(false)}
      >
        <View style={[styles.modalContainer, { paddingTop: insets.top }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowCommentsModal(false)}>
              <X size={24} color={Colors.text} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Comments</Text>
            <View style={{ width: 24 }} />
          </View>

          <FlatList
            data={selectedPost?.comments || []}
            keyExtractor={(item) => item.id}
            style={styles.commentsList}
            contentContainerStyle={styles.commentsListContent}
            ListHeaderComponent={
              selectedPost ? (
                <View style={styles.commentsPostPreview}>
                  <View style={styles.feedPostHeader}>
                    <Image source={{ uri: selectedPost.userAvatar }} style={styles.feedPostAvatar} />
                    <View style={styles.feedPostUserInfo}>
                      <Text style={styles.feedPostUserName}>{selectedPost.userName}</Text>
                      <Text style={styles.feedPostTime}>{formatTimeAgo(selectedPost.timestamp)}</Text>
                    </View>
                  </View>
                  <Text style={styles.feedPostContent}>{selectedPost.content}</Text>
                </View>
              ) : null
            }
            renderItem={({ item: comment }) => (
              <View style={styles.commentItem}>
                <Image source={{ uri: comment.userAvatar }} style={styles.commentAvatar} />
                <View style={styles.commentContent}>
                  <View style={styles.commentBubble}>
                    <Text style={styles.commentUserName}>{comment.userName}</Text>
                    <Text style={styles.commentText}>{comment.content}</Text>
                    {comment.attachments && comment.attachments.map((att) => (
                      <View key={att.id} style={styles.commentAttachment}>
                        {att.type === 'photo' && (
                          <Image source={{ uri: att.url }} style={styles.commentAttachmentImage} />
                        )}
                        {att.type === 'video' && (
                          <View style={styles.commentAttachmentVideo}>
                            <Play size={24} color={Colors.background} />
                            <Text style={styles.commentAttachmentVideoText}>Video</Text>
                          </View>
                        )}
                        {att.type === 'audio' && (
                          <View style={styles.commentAttachmentAudio}>
                            <Mic size={18} color={Colors.primary} />
                            <Text style={styles.commentAttachmentAudioText}>Voice message ({att.duration}s)</Text>
                          </View>
                        )}
                        {att.type === 'document' && (
                          <View style={styles.commentAttachmentDoc}>
                            <FileText size={18} color={Colors.primary} />
                            <Text style={styles.commentAttachmentDocText}>{att.name}</Text>
                          </View>
                        )}
                      </View>
                    ))}
                  </View>
                  <View style={styles.commentMeta}>
                    <Text style={styles.commentTime}>{formatTimeAgo(comment.timestamp)}</Text>
                    <TouchableOpacity style={styles.commentLikeButton}>
                      <Heart size={14} color={comment.isLiked ? Colors.error : Colors.textMuted} fill={comment.isLiked ? Colors.error : 'transparent'} />
                      <Text style={styles.commentLikes}>{comment.likes}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
            ListEmptyComponent={
              <View style={styles.emptyComments}>
                <MessageCircle size={48} color={Colors.textMuted} />
                <Text style={styles.emptyCommentsText}>No comments yet</Text>
                <Text style={styles.emptyCommentsSubtext}>Be the first to comment!</Text>
              </View>
            }
          />

          <View style={[styles.commentInputContainer, { paddingBottom: Platform.OS === 'ios' ? insets.bottom + 8 : 16 }]}>
            {showAttachmentOptions && (
              <View style={styles.attachmentOptions}>
                <TouchableOpacity
                  style={[styles.attachmentOption, commentAttachmentType === 'photo' && styles.attachmentOptionActive]}
                  onPress={() => setCommentAttachmentType(commentAttachmentType === 'photo' ? null : 'photo')}
                >
                  <ImageIcon size={20} color={commentAttachmentType === 'photo' ? Colors.primary : Colors.textSecondary} />
                  <Text style={styles.attachmentOptionText}>Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.attachmentOption, commentAttachmentType === 'video' && styles.attachmentOptionActive]}
                  onPress={() => setCommentAttachmentType(commentAttachmentType === 'video' ? null : 'video')}
                >
                  <Video size={20} color={commentAttachmentType === 'video' ? Colors.primary : Colors.textSecondary} />
                  <Text style={styles.attachmentOptionText}>Video</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.attachmentOption, commentAttachmentType === 'audio' && styles.attachmentOptionActive]}
                  onPress={() => setCommentAttachmentType(commentAttachmentType === 'audio' ? null : 'audio')}
                >
                  <Mic size={20} color={commentAttachmentType === 'audio' ? Colors.primary : Colors.textSecondary} />
                  <Text style={styles.attachmentOptionText}>Audio</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.attachmentOption, commentAttachmentType === 'document' && styles.attachmentOptionActive]}
                  onPress={() => setCommentAttachmentType(commentAttachmentType === 'document' ? null : 'document')}
                >
                  <FileText size={20} color={commentAttachmentType === 'document' ? Colors.primary : Colors.textSecondary} />
                  <Text style={styles.attachmentOptionText}>Doc</Text>
                </TouchableOpacity>
              </View>
            )}
            {commentAttachmentType && (
              <View style={styles.attachmentPreview}>
                <View style={styles.attachmentPreviewContent}>
                  {commentAttachmentType === 'photo' && <ImageIcon size={16} color={Colors.primary} />}
                  {commentAttachmentType === 'video' && <Video size={16} color={Colors.primary} />}
                  {commentAttachmentType === 'audio' && <Mic size={16} color={Colors.primary} />}
                  {commentAttachmentType === 'document' && <FileText size={16} color={Colors.primary} />}
                  <Text style={styles.attachmentPreviewText}>{commentAttachmentType} attached</Text>
                </View>
                <TouchableOpacity onPress={() => setCommentAttachmentType(null)}>
                  <X size={18} color={Colors.textMuted} />
                </TouchableOpacity>
              </View>
            )}
            <View style={styles.commentInputRow}>
              <Image source={{ uri: currentUser.avatar }} style={styles.commentInputAvatar} />
              <View style={styles.commentInputWrapper}>
                <TextInput
                  style={styles.commentInput}
                  placeholder="Write a comment..."
                  placeholderTextColor={Colors.textMuted}
                  value={newComment}
                  onChangeText={setNewComment}
                  multiline
                />
                <TouchableOpacity
                  style={styles.attachButton}
                  onPress={() => setShowAttachmentOptions(!showAttachmentOptions)}
                >
                  <Paperclip size={20} color={showAttachmentOptions ? Colors.primary : Colors.textMuted} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={[styles.sendButton, (!newComment.trim() && !commentAttachmentType) && styles.sendButtonDisabled]}
                onPress={handleAddComment}
                disabled={!newComment.trim() && !commentAttachmentType}
              >
                <Send size={20} color={Colors.background} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  headerRight: {
    width: 40,
  },
  communityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  communityMembersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  communityMembersText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  createPostButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  createPostButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.background,
  },
  feedContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },
  feedPost: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  feedPostHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  feedPostAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  feedPostUserInfo: {
    flex: 1,
    marginLeft: 12,
  },
  feedPostUserName: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  feedPostMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  feedPostRoleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  feedPostRoleBadgeText: {
    fontSize: 10,
    fontWeight: '600' as const,
    color: Colors.background,
  },
  feedPostTime: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  feedPostMoreButton: {
    padding: 4,
  },
  feedPostContent: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 22,
    marginBottom: 12,
  },
  feedPostMediaScroll: {
    marginBottom: 12,
    marginHorizontal: -4,
  },
  feedPostMediaContent: {
    paddingHorizontal: 4,
    gap: 8,
  },
  feedPostMediaItem: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  feedPostMedia: {
    width: 200,
    height: 150,
    borderRadius: 12,
  },
  feedPostVideoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedPostActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  feedPostAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  feedPostActionText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.textMuted,
  },
  feedPostCommentsPreview: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  viewAllComments: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  commentPreview: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  commentPreviewName: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.text,
    marginRight: 6,
  },
  commentPreviewText: {
    fontSize: 13,
    color: Colors.textSecondary,
    flex: 1,
  },
  loadingMore: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  loadingMoreText: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  modalSaveText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  createPostUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  createPostAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  createPostUserName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  createPostUserAffiliation: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  createPostInput: {
    fontSize: 16,
    color: Colors.text,
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  createPostMediaOptions: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 16,
  },
  createPostMediaLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  createPostMediaButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  createPostMediaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  createPostMediaButtonActive: {
    borderColor: Colors.primary,
    backgroundColor: `${Colors.primary}10`,
  },
  createPostMediaButtonText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.textMuted,
  },
  uploadArea: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: Colors.border,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    marginTop: 16,
    backgroundColor: Colors.card,
  },
  uploadAreaText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
    marginTop: 12,
  },
  commentsList: {
    flex: 1,
  },
  commentsListContent: {
    padding: 16,
  },
  commentsPostPreview: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  commentContent: {
    flex: 1,
  },
  commentBubble: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  commentUserName: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  commentText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  commentAttachment: {
    marginTop: 8,
  },
  commentAttachmentImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
  },
  commentAttachmentVideo: {
    width: '100%',
    height: 80,
    borderRadius: 8,
    backgroundColor: Colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  commentAttachmentVideoText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  commentAttachmentAudio: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.backgroundSecondary,
    padding: 10,
    borderRadius: 8,
  },
  commentAttachmentAudioText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  commentAttachmentDoc: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.backgroundSecondary,
    padding: 10,
    borderRadius: 8,
  },
  commentAttachmentDocText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  commentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 8,
    paddingHorizontal: 4,
  },
  commentTime: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  commentLikeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  commentLikes: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  emptyComments: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyCommentsText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginTop: 12,
  },
  emptyCommentsSubtext: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 4,
  },
  commentInputContainer: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.background,
  },
  attachmentOptions: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  attachmentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  attachmentOptionActive: {
    borderColor: Colors.primary,
    backgroundColor: `${Colors.primary}10`,
  },
  attachmentOptionText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  attachmentPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.card,
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  attachmentPreviewContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  attachmentPreviewText: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '500' as const,
  },
  commentInputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
  },
  commentInputAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  commentInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: Colors.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  commentInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
    maxHeight: 100,
    paddingRight: 8,
  },
  attachButton: {
    padding: 4,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: Colors.textMuted,
  },
});
