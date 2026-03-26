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
  Switch,
  Alert,
  FlatList,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Users,
  Wallet,
  MessageCircle,
  MessagesSquare,
  Handshake,
  MapPin,
  BookOpen,
  FileText,
  HelpCircle,
  Edit3,
  CheckCircle,
  CreditCard,
  Smartphone,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Globe,
  Calendar,
  Building,
  Building2,
  X,
  Camera,
  Video,
  Upload,
  MapPinned,
  Clock,
  Link2,
  Eye,
  Heart,
  DollarSign,
  Users2,
  Plus,
  Play,
  Download,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Shield,
  Send,
  Mic,
  Paperclip,
  ImageIcon,
  MoreHorizontal,
  } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { WEBSITE_URL } from '@/constants/website';
import * as WebBrowser from 'expo-web-browser';
import CredibilityScore from '@/components/CredibilityScore';
import { nxtTokenService } from '@/services/nxtToken';
import TrustImpactCard from '@/components/TrustImpactCard';
import { currentUser, userFieldPosts, userResearch, UserFieldPost, UserResearch, ResearchPricingType, ResearchCoAuthor } from '@/mocks/userProfile';
import { communityFeedPosts, CommunityPost, PostComment, getMorePosts } from '@/mocks/communityFeed';
import { sampleTrustProfiles, getTrustProfileByUserId } from '@/mocks/trustImpact';

type ProfileSection = 'overview' | 'trust' | 'credibility' | 'wallet' | 'field' | 'research' | 'community';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const profileButtons = [
  { id: 'funded', label: 'Funded', icon: Wallet, count: currentUser.stats.funded, route: '/funded' },
  { id: 'messages', label: 'Messages', icon: MessageCircle, count: currentUser.stats.messages, route: '/messages' },
  { id: 'discussions', label: 'Discussions', icon: MessagesSquare, count: currentUser.stats.discussions, route: '/discussions' },
  { id: 'collaboration', label: 'Collaboration', icon: Handshake, count: currentUser.stats.collaborations, route: '/collaboration' },
];

const actionButtons = [
  { id: 'proposal', label: 'Submit Proposal', icon: FileText, color: Colors.primary, route: '/submit-proposal' },
  { id: 'ask', label: 'Submit Ask', icon: HelpCircle, color: Colors.accent, route: '/submit-ask' },
];

const daoOptions = [
  { id: 'dao1', title: 'Climate Action DAO' },
  { id: 'dao2', title: 'Public Health DAO' },
  { id: 'dao5', title: 'East Africa Environmental Watch DAO' },
  { id: 'dao7', title: 'One Health Surveillance DAO' },
];

const proposalOptions = [
  { id: 'prop1', title: 'Sahel Water Security Initiative' },
  { id: 'prop6', title: 'Zambia Malaria Prevention Scale-up' },
  { id: 'prop8', title: 'Ghana Solar Cold Chain Expansion' },
];

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeSection, setActiveSection] = useState<ProfileSection>('overview');
  const [showFieldUploadModal, setShowFieldUploadModal] = useState(false);
  const [showResearchUploadModal, setShowResearchUploadModal] = useState(false);
  
  const [fieldPosts, setFieldPosts] = useState<UserFieldPost[]>(userFieldPosts);
  const [researchPapers, setResearchPapers] = useState<UserResearch[]>(userResearch);

  const [fieldForm, setFieldForm] = useState({
    title: '',
    description: '',
    type: 'photo' as 'photo' | 'video',
    enableGeoTag: true,
    linkType: '' as '' | 'proposal' | 'dao',
    linkId: '',
  });

  const [researchForm, setResearchForm] = useState({
    title: '',
    abstract: '',
    pricingType: 'free' as ResearchPricingType,
    price: '',
    tags: '',
    focusArea: '',
    coAuthors: [] as ResearchCoAuthor[],
    hasWaivers: false,
  });

  const [showCoAuthorModal, setShowCoAuthorModal] = useState(false);
  const [coAuthorForm, setCoAuthorForm] = useState({
    name: '',
    walletAddress: '',
    splitPercentage: '',
  });

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
    if (!newPostContent.trim()) {
      Alert.alert('Error', 'Please enter some content for your post');
      return;
    }

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
    Alert.alert('Success', 'Your post has been published!');
  };

  const handleAddComment = () => {
    if (!newComment.trim() && !commentAttachmentType) {
      Alert.alert('Error', 'Please enter a comment or add an attachment');
      return;
    }

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return Colors.success;
      case 'pending_approval':
        return Colors.accent;
      case 'rejected':
        return Colors.error;
      default:
        return Colors.textMuted;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Published';
      case 'pending_approval':
        return 'Pending Review';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Draft';
    }
  };

  const handleFieldUpload = () => {
    if (!fieldForm.title || !fieldForm.description) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const linkedTo = fieldForm.linkType && fieldForm.linkId ? {
      type: fieldForm.linkType,
      id: fieldForm.linkId,
      title: fieldForm.linkType === 'dao' 
        ? daoOptions.find(d => d.id === fieldForm.linkId)?.title || ''
        : proposalOptions.find(p => p.id === fieldForm.linkId)?.title || '',
    } : undefined;

    const newPost: UserFieldPost = {
      id: `ufp${Date.now()}`,
      title: fieldForm.title,
      description: fieldForm.description,
      type: fieldForm.type,
      url: 'https://images.unsplash.com/photo-1581093458791-9d42e3c7e117?w=800',
      timestamp: new Date().toISOString(),
      geoLocation: fieldForm.enableGeoTag ? {
        latitude: -0.1021,
        longitude: 34.7519,
        placeName: 'Current Location',
      } : undefined,
      linkedTo,
      views: 0,
      likes: 0,
    };

    setFieldPosts([newPost, ...fieldPosts]);
    setShowFieldUploadModal(false);
    setFieldForm({
      title: '',
      description: '',
      type: 'photo',
      enableGeoTag: true,
      linkType: '',
      linkId: '',
    });
    Alert.alert('Success', 'Field post uploaded successfully!');
  };

  const handleResearchUpload = () => {
    if (!researchForm.title || !researchForm.abstract || !researchForm.focusArea) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (researchForm.pricingType !== 'free' && !researchForm.price) {
      Alert.alert('Error', 'Please set a price for paid research');
      return;
    }

    if (researchForm.pricingType === 'paid_group' && researchForm.coAuthors.length === 0) {
      Alert.alert('Error', 'Group pricing requires at least one co-author');
      return;
    }

    const totalSplit = researchForm.coAuthors.reduce((sum, ca) => sum + ca.splitPercentage, 0);
    if (researchForm.pricingType === 'paid_group' && totalSplit >= 100) {
      Alert.alert('Error', 'Co-author splits cannot exceed 100%');
      return;
    }

    const newResearch: UserResearch = {
      id: `ur${Date.now()}`,
      title: researchForm.title,
      abstract: researchForm.abstract,
      documentUrl: '#',
      documentName: 'uploaded_research.pdf',
      documentSize: '5.0 MB',
      uploadedAt: new Date().toISOString(),
      status: 'pending_approval',
      pricingType: researchForm.pricingType,
      price: researchForm.pricingType !== 'free' ? parseFloat(researchForm.price) : undefined,
      currency: researchForm.pricingType !== 'free' ? 'USDC' : undefined,
      coAuthors: researchForm.pricingType === 'paid_group' ? researchForm.coAuthors : undefined,
      tags: researchForm.tags.split(',').map(t => t.trim()).filter(Boolean),
      focusArea: researchForm.focusArea,
    };

    setResearchPapers([newResearch, ...researchPapers]);
    setShowResearchUploadModal(false);
    setResearchForm({
      title: '',
      abstract: '',
      pricingType: 'free',
      price: '',
      tags: '',
      focusArea: '',
      coAuthors: [],
      hasWaivers: false,
    });
    Alert.alert('Success', 'Research submitted for approval. It will appear on the Research Page once approved.');
  };

  const addCoAuthor = () => {
    if (!coAuthorForm.name || !coAuthorForm.walletAddress || !coAuthorForm.splitPercentage) {
      Alert.alert('Error', 'Please fill in all co-author fields');
      return;
    }

    const newCoAuthor: ResearchCoAuthor = {
      id: `ca${Date.now()}`,
      name: coAuthorForm.name,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      splitPercentage: parseFloat(coAuthorForm.splitPercentage),
      walletAddress: coAuthorForm.walletAddress,
    };

    setResearchForm({
      ...researchForm,
      coAuthors: [...researchForm.coAuthors, newCoAuthor],
    });
    setShowCoAuthorModal(false);
    setCoAuthorForm({ name: '', walletAddress: '', splitPercentage: '' });
  };

  const removeCoAuthor = (id: string) => {
    setResearchForm({
      ...researchForm,
      coAuthors: researchForm.coAuthors.filter(ca => ca.id !== id),
    });
  };

  const renderFieldSection = () => (
    <View style={styles.fieldSection}>
      <View style={styles.sectionHeaderRow}>
        <TouchableOpacity
          style={styles.sectionBackButton}
          onPress={() => setActiveSection('overview')}
          testID="field-back-button"
        >
          <X size={20} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.sectionHeaderText}>My Field Work</Text>
        <View style={{ width: 36 }} />
        </View>
      <View style={styles.sectionHeaderRow}>
        <View />
        <TouchableOpacity 
          style={styles.uploadButton}
          onPress={() => setShowFieldUploadModal(true)}
        >
          <Plus size={16} color={Colors.background} />
          <Text style={styles.uploadButtonText}>Upload</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionDescription}>
        Share photos and videos of your real-world work. Posts can be geo-tagged and linked to proposals or DAOs.
      </Text>

      {fieldPosts.length === 0 ? (
        <View style={styles.emptyState}>
          <Camera size={48} color={Colors.textMuted} />
          <Text style={styles.emptyStateText}>No field posts yet</Text>
          <Text style={styles.emptyStateSubtext}>Upload photos and videos of your work</Text>
        </View>
      ) : (
        <View style={styles.fieldGrid}>
          {fieldPosts.map((post) => (
            <TouchableOpacity key={post.id} style={styles.fieldCard}>
              <View style={styles.fieldImageContainer}>
                <Image source={{ uri: post.url }} style={styles.fieldImage} />
                {post.type === 'video' && (
                  <View style={styles.videoOverlay}>
                    <Play size={24} color={Colors.background} fill={Colors.background} />
                  </View>
                )}
              </View>
              <View style={styles.fieldCardContent}>
                <Text style={styles.fieldCardTitle} numberOfLines={2}>{post.title}</Text>
                <View style={styles.fieldMeta}>
                  <View style={styles.fieldMetaItem}>
                    <Clock size={12} color={Colors.textMuted} />
                    <Text style={styles.fieldMetaText}>
                      {new Date(post.timestamp).toLocaleDateString()}
                    </Text>
                  </View>
                  {post.geoLocation && (
                    <View style={styles.fieldMetaItem}>
                      <MapPinned size={12} color={Colors.primary} />
                      <Text style={[styles.fieldMetaText, { color: Colors.primary }]} numberOfLines={1}>
                        {post.geoLocation.placeName}
                      </Text>
                    </View>
                  )}
                </View>
                {post.linkedTo && (
                  <View style={styles.linkedBadge}>
                    <Link2 size={10} color={Colors.accent} />
                    <Text style={styles.linkedBadgeText} numberOfLines={1}>
                      {post.linkedTo.title}
                    </Text>
                  </View>
                )}
                <View style={styles.fieldStats}>
                  <View style={styles.fieldStatItem}>
                    <Eye size={12} color={Colors.textMuted} />
                    <Text style={styles.fieldStatText}>{post.views}</Text>
                  </View>
                  <View style={styles.fieldStatItem}>
                    <Heart size={12} color={Colors.textMuted} />
                    <Text style={styles.fieldStatText}>{post.likes}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  const renderResearchSection = () => {
    return (
      <View style={styles.researchSection}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeaderText}>My Research</Text>
          <TouchableOpacity 
            style={styles.uploadButton}
            onPress={() => setShowResearchUploadModal(true)}
          >
            <Plus size={16} color={Colors.background} />
            <Text style={styles.uploadButtonText}>Upload</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionDescription}>
          Upload research documents with flexible pricing. Approved research will appear on the Research Page.
        </Text>

        {researchPapers.length === 0 ? (
          <View style={styles.emptyState}>
            <BookOpen size={48} color={Colors.textMuted} />
            <Text style={styles.emptyStateText}>No research uploaded</Text>
            <Text style={styles.emptyStateSubtext}>Share your research with the community</Text>
          </View>
        ) : (
          <View style={styles.researchList}>
            {researchPapers.map((paper) => (
              <View key={paper.id} style={styles.researchCard}>
                <View style={styles.researchCardHeader}>
                  <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(paper.status)}20` }]}>
                    {paper.status === 'approved' && <CheckCircle2 size={12} color={getStatusColor(paper.status)} />}
                    {paper.status === 'pending_approval' && <Clock size={12} color={getStatusColor(paper.status)} />}
                    {paper.status === 'rejected' && <AlertCircle size={12} color={getStatusColor(paper.status)} />}
                    {paper.status === 'draft' && <Edit3 size={12} color={getStatusColor(paper.status)} />}
                    <Text style={[styles.statusText, { color: getStatusColor(paper.status) }]}>
                      {getStatusLabel(paper.status)}
                    </Text>
                  </View>
                  <View style={styles.pricingBadge}>
                    {paper.pricingType === 'free' ? (
                      <Text style={styles.freeBadgeText}>Free</Text>
                    ) : (
                      <View style={styles.paidBadge}>
                        <DollarSign size={12} color={Colors.primary} />
                        <Text style={styles.paidBadgeText}>{paper.price} {paper.currency}</Text>
                      </View>
                    )}
                  </View>
                </View>

                <Text style={styles.researchTitle}>{paper.title}</Text>
                <Text style={styles.researchAbstract} numberOfLines={2}>{paper.abstract}</Text>

                <View style={styles.researchMeta}>
                  <Text style={styles.researchFocusArea}>{paper.focusArea}</Text>
                  <Text style={styles.researchDate}>
                    {new Date(paper.uploadedAt).toLocaleDateString()}
                  </Text>
                </View>

                {paper.coAuthors && paper.coAuthors.length > 0 && (
                  <View style={styles.coAuthorsPreview}>
                    <Users2 size={14} color={Colors.textSecondary} />
                    <Text style={styles.coAuthorsText}>
                      {paper.coAuthors.length} co-author{paper.coAuthors.length > 1 ? 's' : ''} • Group Pricing
                    </Text>
                  </View>
                )}

                {paper.status === 'approved' && (
                  <View style={styles.researchStats}>
                    <View style={styles.researchStatItem}>
                      <Download size={14} color={Colors.primary} />
                      <Text style={styles.researchStatValue}>{paper.downloads || 0}</Text>
                      <Text style={styles.researchStatLabel}>Downloads</Text>
                    </View>
                    {paper.totalRevenue !== undefined && paper.totalRevenue > 0 && (
                      <View style={styles.researchStatItem}>
                        <DollarSign size={14} color={Colors.success} />
                        <Text style={[styles.researchStatValue, { color: Colors.success }]}>
                          {paper.totalRevenue}
                        </Text>
                        <Text style={styles.researchStatLabel}>Revenue</Text>
                      </View>
                    )}
                  </View>
                )}

                <View style={styles.researchTags}>
                  {paper.tags.slice(0, 3).map((tag, index) => (
                    <View key={index} style={styles.researchTag}>
                      <Text style={styles.researchTagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.headerBar, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.replace('/')}
          testID="profile-back-button"
          activeOpacity={0.7}
        >
          <ChevronLeft size={24} color={Colors.text} />
          <Text style={styles.backButtonText}>Home</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: currentUser.avatar }} style={styles.avatar} />
            <View style={[styles.roleBadge, { backgroundColor: getRoleBadgeColor(currentUser.role) }]}>
              <Text style={styles.roleBadgeText}>{currentUser.role}</Text>
            </View>
          </View>
          <Text style={styles.userName}>{currentUser.name}</Text>
          <View style={styles.affiliationRow}>
            <Building size={14} color={Colors.textSecondary} />
            <Text style={styles.affiliation}>{currentUser.affiliation}</Text>
          </View>
          <View style={styles.locationRow}>
            <MapPin size={14} color={Colors.textMuted} />
            <Text style={styles.location}>{currentUser.location}</Text>
            <View style={styles.dotSeparator} />
            <Calendar size={14} color={Colors.textMuted} />
            <Text style={styles.joinDate}>Joined {new Date(currentUser.joinedDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</Text>
          </View>
          <Text style={styles.bio}>{currentUser.bio}</Text>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.sectionTabsScroll}
          contentContainerStyle={styles.sectionTabsContent}
        >
          {(['overview', 'community', 'trust', 'field', 'research', 'credibility', 'wallet'] as ProfileSection[]).map((section) => (
            <TouchableOpacity
              key={section}
              style={[styles.sectionTab, activeSection === section && styles.sectionTabActive]}
              onPress={() => {
                if (section === 'community') {
                  router.push('/community-feed');
                } else if (section === 'field') {
                  router.push('/on-the-ground');
                } else if (section === 'research') {
                  router.push('/my-research');
                } else {
                  setActiveSection(section);
                }
              }}
            >
              <Text style={[styles.sectionTabText, activeSection === section && styles.sectionTabTextActive]}>
                {section === 'field' ? 'On the Ground' : section === 'research' ? 'My Research' : section === 'trust' ? 'Trust & Impact' : section === 'community' ? 'Community Feed' : section.charAt(0).toUpperCase() + section.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {activeSection === 'overview' && (
          <>
            <View style={styles.quickActions}>
              {actionButtons.map((btn) => (
                <TouchableOpacity
                  key={btn.id}
                  style={[styles.actionButton, { backgroundColor: btn.color }]}
                  testID={`${btn.id}-button`}
                  activeOpacity={0.8}
                  onPress={() => router.push(btn.route as any)}
                >
                  <btn.icon size={20} color={Colors.background} />
                  <Text style={styles.actionButtonText}>{btn.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.profileButtonsGrid}>
              {profileButtons.map((btn) => (
                <TouchableOpacity
                  key={btn.id}
                  style={styles.profileButton}
                  testID={`${btn.id}-button`}
                  activeOpacity={0.7}
                  onPress={() => btn.route && router.push(btn.route as any)}
                >
                  <View style={styles.profileButtonIcon}>
                    <btn.icon size={22} color={Colors.primary} />
                  </View>
                  <Text style={styles.profileButtonLabel}>{btn.label}</Text>
                  <View style={styles.profileButtonFooter}>
                    <Text style={styles.profileButtonCount}>{btn.count}</Text>
                    <ChevronRight size={16} color={Colors.textMuted} />
                  </View>
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                style={styles.profileButton}
                testID="community-button"
                activeOpacity={0.7}
                onPress={() => router.push('/community-feed')}
              >
                <View style={styles.profileButtonIcon}>
                  <Users size={22} color={Colors.primary} />
                </View>
                <Text style={styles.profileButtonLabel}>Community Feed</Text>
                <View style={styles.profileButtonFooter}>
                  <Text style={styles.profileButtonCount}>{feedPosts.length}</Text>
                  <ChevronRight size={16} color={Colors.textMuted} />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.profileButton}
                testID="field-button"
                activeOpacity={0.7}
                onPress={() => router.push('/on-the-ground')}
              >
                <View style={styles.profileButtonIcon}>
                  <MapPin size={22} color={Colors.primary} />
                </View>
                <Text style={styles.profileButtonLabel}>On the Ground</Text>
                <View style={styles.profileButtonFooter}>
                  <Text style={styles.profileButtonCount}>{fieldPosts.length}</Text>
                  <ChevronRight size={16} color={Colors.textMuted} />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.profileButton}
                testID="research-button"
                activeOpacity={0.7}
                onPress={() => router.push('/my-research')}
              >
                <View style={styles.profileButtonIcon}>
                  <BookOpen size={22} color={Colors.primary} />
                </View>
                <Text style={styles.profileButtonLabel}>My Research</Text>
                <View style={styles.profileButtonFooter}>
                  <Text style={styles.profileButtonCount}>{researchPapers.length}</Text>
                  <ChevronRight size={16} color={Colors.textMuted} />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.profileButton}
                testID="my-daos-button"
                activeOpacity={0.7}
                onPress={() => router.push('/my-daos')}
              >
                <View style={styles.profileButtonIcon}>
                  <Building2 size={22} color={Colors.primary} />
                </View>
                <Text style={styles.profileButtonLabel}>My DAOs</Text>
                <View style={styles.profileButtonFooter}>
                  <Text style={styles.profileButtonCount}>4</Text>
                  <ChevronRight size={16} color={Colors.textMuted} />
                </View>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.websiteCard}
              testID="visit-website-button"
              activeOpacity={0.8}
              onPress={async () => {
                try {
                  await WebBrowser.openBrowserAsync(WEBSITE_URL, {
                    toolbarColor: Colors.background,
                    controlsColor: Colors.primary,
                  });
                } catch (error) {
                  console.log('Error opening website:', error);
                }
              }}
            >
              <View style={styles.websiteCardLeft}>
                <View style={styles.websiteIconContainer}>
                  <Globe size={24} color={Colors.primary} />
                </View>
                <View style={styles.websiteCardContent}>
                  <Text style={styles.websiteCardTitle}>Visit NexTerra Website</Text>
                  <Text style={styles.websiteCardSubtitle}>nexterra-app.vercel.app</Text>
                </View>
              </View>
              <ExternalLink size={18} color={Colors.primary} />
            </TouchableOpacity>
          </>
        )}

        {activeSection === 'field' && renderFieldSection()}

        {activeSection === 'research' && renderResearchSection()}

        {activeSection === 'community' && (
          <View style={styles.communitySection}>
            <View style={styles.communitySectionHeader}>
              <TouchableOpacity
                style={styles.sectionBackButton}
                onPress={() => setActiveSection('overview')}
                testID="community-back-button"
              >
                <X size={20} color={Colors.text} />
              </TouchableOpacity>
              <Text style={styles.sectionHeaderText}>Community Feed</Text>
              <View style={{ width: 36 }} />
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
              scrollEnabled={false}
              onEndReached={handleLoadMorePosts}
              onEndReachedThreshold={0.5}
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
          </View>
        )}

        {activeSection === 'trust' && (
          <View style={styles.trustSection}>
            {(() => {
              const trustProfile = getTrustProfileByUserId(currentUser.id) || sampleTrustProfiles[0];
              return (
                <TrustImpactCard
                  profile={trustProfile}
                  showGovernanceWeight={true}
                  showVisibilityBoost={true}
                />
              );
            })()}
          </View>
        )}

        {activeSection === 'credibility' && (
          <View style={styles.credibilitySection}>
            <CredibilityScore
              score={currentUser.credibilityScore}
              metrics={currentUser.credibilityMetrics}
            />
          </View>
        )}

        {activeSection === 'wallet' && (
          <View style={styles.walletSection}>
            <View style={styles.nxtCreditsCard}>
              <View style={styles.nxtCreditsHeader}>
                <View style={styles.nxtIconContainer}>
                  <Shield size={24} color={Colors.primary} />
                </View>
                <View style={styles.nxtCreditsInfo}>
                  <Text style={styles.nxtCreditsTitle}>Governance Credits</Text>
                  <Text style={styles.nxtCreditsSubtitle}>Your platform participation power</Text>
                </View>
              </View>
              <View style={styles.nxtCreditsStats}>
                <View style={styles.nxtCreditsStat}>
                  <Text style={styles.nxtCreditsValue}>
                    {nxtTokenService.formatGovernanceCredits(nxtTokenService.getGovernanceCreditsFromFiat(currentUser.wallet.onChain.balance).amount)}
                  </Text>
                  <Text style={styles.nxtCreditsLabel}>Credits</Text>
                </View>
                <View style={styles.nxtStatDivider} />
                <View style={styles.nxtCreditsStat}>
                  <Text style={styles.nxtCreditsValue}>
                    {nxtTokenService.formatAccessUnits(nxtTokenService.getAccessUnitsFromFiat(currentUser.wallet.onChain.balance).amount)}
                  </Text>
                  <Text style={styles.nxtCreditsLabel}>Access Units</Text>
                </View>
                <View style={styles.nxtStatDivider} />
                <View style={styles.nxtCreditsStat}>
                  <Text style={styles.nxtCreditsValue}>
                    {nxtTokenService.getTierLabel(nxtTokenService.getAccessUnitsFromFiat(currentUser.wallet.onChain.balance).tier).split(' ')[0]}
                  </Text>
                  <Text style={styles.nxtCreditsLabel}>Tier</Text>
                </View>
              </View>
              <View style={styles.nxtExplainer}>
                <AlertCircle size={14} color={Colors.textSecondary} />
                <Text style={styles.nxtExplainerText}>
                  Credits enable governance, access, and coordination—not equity or investment.
                </Text>
              </View>
            </View>

            <View style={styles.walletCard}>
              <View style={styles.walletCardHeader}>
                <Text style={styles.walletCardTitle}>On-Chain Wallet</Text>
                <TouchableOpacity style={styles.walletViewButton}>
                  <ExternalLink size={16} color={Colors.primary} />
                </TouchableOpacity>
              </View>
              <Text style={styles.walletAddress}>{currentUser.wallet.onChain.address}</Text>
              <View style={styles.walletBalanceRow}>
                <Text style={styles.walletBalanceLabel}>Balance (Fiat Value)</Text>
                <Text style={styles.walletBalanceValue}>
                  {nxtTokenService.formatFiatOnly(currentUser.wallet.onChain.balance)}
                </Text>
              </View>
            </View>

            <View style={styles.walletCard}>
              <View style={styles.walletCardHeader}>
                <Text style={styles.walletCardTitle}>Off-Chain Balance</Text>
                <CreditCard size={18} color={Colors.accent} />
              </View>
              <View style={styles.walletBalanceRow}>
                <Text style={styles.walletBalanceLabel}>Available</Text>
                <Text style={styles.walletBalanceValue}>
                  {nxtTokenService.formatFiatOnly(currentUser.wallet.offChain.balance)}
                </Text>
              </View>
            </View>

            <View style={styles.linkedAccountCard}>
              <View style={styles.linkedAccountHeader}>
                <View style={styles.linkedAccountIcon}>
                  <Smartphone size={20} color={Colors.text} />
                </View>
                <View style={styles.linkedAccountInfo}>
                  <Text style={styles.linkedAccountName}>{currentUser.wallet.linkedAccount.name}</Text>
                  <Text style={styles.linkedAccountNumber}>
                    •••• {currentUser.wallet.linkedAccount.lastFour}
                  </Text>
                </View>
                {currentUser.wallet.linkedAccount.verified && (
                  <View style={styles.verifiedBadge}>
                    <CheckCircle size={14} color={Colors.success} />
                    <Text style={styles.verifiedText}>Verified</Text>
                  </View>
                )}
              </View>
              <View style={styles.linkedAccountActions}>
                <TouchableOpacity style={styles.linkedAccountButton}>
                  <Text style={styles.linkedAccountButtonText}>Withdraw</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.linkedAccountButton, styles.linkedAccountButtonOutline]}>
                  <Text style={styles.linkedAccountButtonTextOutline}>Deposit</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.addAccountButton}>
              <Text style={styles.addAccountText}>+ Link another account</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Field Upload Modal */}
      <Modal
        visible={showFieldUploadModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowFieldUploadModal(false)}
      >
        <View style={[styles.modalContainer, { paddingTop: insets.top }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowFieldUploadModal(false)}>
              <X size={24} color={Colors.text} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Upload Field Work</Text>
            <TouchableOpacity onPress={handleFieldUpload}>
              <Text style={styles.modalSaveText}>Upload</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={styles.uploadTypeSelector}>
              <TouchableOpacity
                style={[styles.uploadTypeOption, fieldForm.type === 'photo' && styles.uploadTypeOptionActive]}
                onPress={() => setFieldForm({ ...fieldForm, type: 'photo' })}
              >
                <Camera size={24} color={fieldForm.type === 'photo' ? Colors.primary : Colors.textMuted} />
                <Text style={[styles.uploadTypeText, fieldForm.type === 'photo' && styles.uploadTypeTextActive]}>
                  Photo
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.uploadTypeOption, fieldForm.type === 'video' && styles.uploadTypeOptionActive]}
                onPress={() => setFieldForm({ ...fieldForm, type: 'video' })}
              >
                <Video size={24} color={fieldForm.type === 'video' ? Colors.primary : Colors.textMuted} />
                <Text style={[styles.uploadTypeText, fieldForm.type === 'video' && styles.uploadTypeTextActive]}>
                  Video
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.uploadArea}>
              <Upload size={32} color={Colors.textMuted} />
              <Text style={styles.uploadAreaText}>Tap to select {fieldForm.type}</Text>
              <Text style={styles.uploadAreaSubtext}>Max 50MB for photos, 200MB for videos</Text>
            </TouchableOpacity>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Title *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter a descriptive title"
                placeholderTextColor={Colors.textMuted}
                value={fieldForm.title}
                onChangeText={(text) => setFieldForm({ ...fieldForm, title: text })}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Description *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe your field work..."
                placeholderTextColor={Colors.textMuted}
                multiline
                numberOfLines={4}
                value={fieldForm.description}
                onChangeText={(text) => setFieldForm({ ...fieldForm, description: text })}
              />
            </View>

            <View style={styles.switchRow}>
              <View style={styles.switchInfo}>
                <MapPinned size={20} color={Colors.primary} />
                <View style={styles.switchTextContainer}>
                  <Text style={styles.switchLabel}>Enable Geo-tagging</Text>
                  <Text style={styles.switchSubtext}>Add location to your post</Text>
                </View>
              </View>
              <Switch
                value={fieldForm.enableGeoTag}
                onValueChange={(value) => setFieldForm({ ...fieldForm, enableGeoTag: value })}
                trackColor={{ false: Colors.border, true: Colors.primary }}
                thumbColor={Colors.background}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Link to Initiative (Optional)</Text>
              <View style={styles.linkTypeSelector}>
                <TouchableOpacity
                  style={[styles.linkTypeOption, fieldForm.linkType === 'proposal' && styles.linkTypeOptionActive]}
                  onPress={() => setFieldForm({ ...fieldForm, linkType: 'proposal', linkId: '' })}
                >
                  <Text style={[styles.linkTypeText, fieldForm.linkType === 'proposal' && styles.linkTypeTextActive]}>
                    Proposal
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.linkTypeOption, fieldForm.linkType === 'dao' && styles.linkTypeOptionActive]}
                  onPress={() => setFieldForm({ ...fieldForm, linkType: 'dao', linkId: '' })}
                >
                  <Text style={[styles.linkTypeText, fieldForm.linkType === 'dao' && styles.linkTypeTextActive]}>
                    DAO
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {fieldForm.linkType && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Select {fieldForm.linkType === 'dao' ? 'DAO' : 'Proposal'}</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsScroll}>
                  {(fieldForm.linkType === 'dao' ? daoOptions : proposalOptions).map((option) => (
                    <TouchableOpacity
                      key={option.id}
                      style={[styles.optionChip, fieldForm.linkId === option.id && styles.optionChipActive]}
                      onPress={() => setFieldForm({ ...fieldForm, linkId: option.id })}
                    >
                      <Text style={[styles.optionChipText, fieldForm.linkId === option.id && styles.optionChipTextActive]}>
                        {option.title}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </ScrollView>
        </View>
      </Modal>

      {/* Research Upload Modal */}
      <Modal
        visible={showResearchUploadModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowResearchUploadModal(false)}
      >
        <View style={[styles.modalContainer, { paddingTop: insets.top }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowResearchUploadModal(false)}>
              <X size={24} color={Colors.text} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Upload Research</Text>
            <TouchableOpacity onPress={handleResearchUpload}>
              <Text style={styles.modalSaveText}>Submit</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <TouchableOpacity style={styles.uploadArea}>
              <FileText size={32} color={Colors.textMuted} />
              <Text style={styles.uploadAreaText}>Tap to select document</Text>
              <Text style={styles.uploadAreaSubtext}>PDF, DOC, DOCX up to 50MB</Text>
            </TouchableOpacity>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Title *</Text>
              <TextInput
                style={styles.input}
                placeholder="Research paper title"
                placeholderTextColor={Colors.textMuted}
                value={researchForm.title}
                onChangeText={(text) => setResearchForm({ ...researchForm, title: text })}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Abstract *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Brief summary of your research..."
                placeholderTextColor={Colors.textMuted}
                multiline
                numberOfLines={4}
                value={researchForm.abstract}
                onChangeText={(text) => setResearchForm({ ...researchForm, abstract: text })}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Focus Area *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Climate Adaptation, Disease Prevention"
                placeholderTextColor={Colors.textMuted}
                value={researchForm.focusArea}
                onChangeText={(text) => setResearchForm({ ...researchForm, focusArea: text })}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Tags (comma separated)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Climate, Agriculture, Policy"
                placeholderTextColor={Colors.textMuted}
                value={researchForm.tags}
                onChangeText={(text) => setResearchForm({ ...researchForm, tags: text })}
              />
            </View>

            <View style={styles.pricingSection}>
              <Text style={styles.pricingSectionTitle}>Pricing</Text>
              
              <View style={styles.pricingOptions}>
                <TouchableOpacity
                  style={[styles.pricingOption, researchForm.pricingType === 'free' && styles.pricingOptionActive]}
                  onPress={() => setResearchForm({ ...researchForm, pricingType: 'free', price: '', coAuthors: [] })}
                >
                  <View style={styles.pricingOptionHeader}>
                    <View style={[styles.pricingRadio, researchForm.pricingType === 'free' && styles.pricingRadioActive]}>
                      {researchForm.pricingType === 'free' && <View style={styles.pricingRadioInner} />}
                    </View>
                    <Text style={styles.pricingOptionTitle}>Free</Text>
                  </View>
                  <Text style={styles.pricingOptionDesc}>Anyone can download</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.pricingOption, researchForm.pricingType === 'paid_individual' && styles.pricingOptionActive]}
                  onPress={() => setResearchForm({ ...researchForm, pricingType: 'paid_individual', coAuthors: [] })}
                >
                  <View style={styles.pricingOptionHeader}>
                    <View style={[styles.pricingRadio, researchForm.pricingType === 'paid_individual' && styles.pricingRadioActive]}>
                      {researchForm.pricingType === 'paid_individual' && <View style={styles.pricingRadioInner} />}
                    </View>
                    <Text style={styles.pricingOptionTitle}>Paid (Individual)</Text>
                  </View>
                  <Text style={styles.pricingOptionDesc}>You receive 100% of revenue</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.pricingOption, researchForm.pricingType === 'paid_group' && styles.pricingOptionActive]}
                  onPress={() => setResearchForm({ ...researchForm, pricingType: 'paid_group' })}
                >
                  <View style={styles.pricingOptionHeader}>
                    <View style={[styles.pricingRadio, researchForm.pricingType === 'paid_group' && styles.pricingRadioActive]}>
                      {researchForm.pricingType === 'paid_group' && <View style={styles.pricingRadioInner} />}
                    </View>
                    <Text style={styles.pricingOptionTitle}>Paid (Group)</Text>
                  </View>
                  <Text style={styles.pricingOptionDesc}>Split revenue with co-authors on-chain</Text>
                </TouchableOpacity>
              </View>

              {researchForm.pricingType !== 'free' && (
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Price (USDC) *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g., 25"
                    placeholderTextColor={Colors.textMuted}
                    keyboardType="numeric"
                    value={researchForm.price}
                    onChangeText={(text) => setResearchForm({ ...researchForm, price: text })}
                  />
                </View>
              )}

              {researchForm.pricingType === 'paid_group' && (
                <View style={styles.coAuthorsSection}>
                  <View style={styles.coAuthorsSectionHeader}>
                    <Text style={styles.coAuthorsSectionTitle}>Co-Authors & Payment Split</Text>
                    <TouchableOpacity 
                      style={styles.addCoAuthorButton}
                      onPress={() => setShowCoAuthorModal(true)}
                    >
                      <Plus size={16} color={Colors.primary} />
                      <Text style={styles.addCoAuthorText}>Add</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.splitPreview}>
                    <View style={styles.splitPreviewItem}>
                      <Text style={styles.splitPreviewName}>You</Text>
                      <Text style={styles.splitPreviewPercent}>
                        {100 - researchForm.coAuthors.reduce((sum, ca) => sum + ca.splitPercentage, 0)}%
                      </Text>
                    </View>
                    {researchForm.coAuthors.map((ca) => (
                      <View key={ca.id} style={styles.splitPreviewItem}>
                        <Text style={styles.splitPreviewName}>{ca.name}</Text>
                        <View style={styles.splitPreviewRight}>
                          <Text style={styles.splitPreviewPercent}>{ca.splitPercentage}%</Text>
                          <TouchableOpacity onPress={() => removeCoAuthor(ca.id)}>
                            <Trash2 size={14} color={Colors.error} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}
                  </View>

                  <View style={styles.switchRow}>
                    <View style={styles.switchInfo}>
                      <FileText size={20} color={Colors.primary} />
                      <View style={styles.switchTextContainer}>
                        <Text style={styles.switchLabel}>Waiver Uploaded</Text>
                        <Text style={styles.switchSubtext}>Co-author agreements on file</Text>
                      </View>
                    </View>
                    <Switch
                      value={researchForm.hasWaivers}
                      onValueChange={(value) => setResearchForm({ ...researchForm, hasWaivers: value })}
                      trackColor={{ false: Colors.border, true: Colors.primary }}
                      thumbColor={Colors.background}
                    />
                  </View>
                </View>
              )}
            </View>

            <View style={styles.infoBox}>
              <AlertCircle size={16} color={Colors.accent} />
              <Text style={styles.infoBoxText}>
                Research will be reviewed before appearing on the Research Page. On-chain payment splits are executed automatically on each purchase.
              </Text>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Co-Author Modal */}
      <Modal
        visible={showCoAuthorModal}
        animationType="fade"
        transparent
        onRequestClose={() => setShowCoAuthorModal(false)}
      >
        <View style={styles.coAuthorModalOverlay}>
          <View style={styles.coAuthorModalContent}>
            <Text style={styles.coAuthorModalTitle}>Add Co-Author</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Co-author's name"
                placeholderTextColor={Colors.textMuted}
                value={coAuthorForm.name}
                onChangeText={(text) => setCoAuthorForm({ ...coAuthorForm, name: text })}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Wallet Address</Text>
              <TextInput
                style={styles.input}
                placeholder="0x..."
                placeholderTextColor={Colors.textMuted}
                value={coAuthorForm.walletAddress}
                onChangeText={(text) => setCoAuthorForm({ ...coAuthorForm, walletAddress: text })}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Revenue Split (%)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 25"
                placeholderTextColor={Colors.textMuted}
                keyboardType="numeric"
                value={coAuthorForm.splitPercentage}
                onChangeText={(text) => setCoAuthorForm({ ...coAuthorForm, splitPercentage: text })}
              />
            </View>

            <View style={styles.coAuthorModalActions}>
              <TouchableOpacity 
                style={styles.coAuthorModalCancel}
                onPress={() => setShowCoAuthorModal(false)}
              >
                <Text style={styles.coAuthorModalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.coAuthorModalAdd}
                onPress={addCoAuthor}
              >
                <Text style={styles.coAuthorModalAddText}>Add Co-Author</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Create Post Modal */}
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

      {/* Comments Modal */}
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
  headerBar: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: Colors.background,
  },
  backButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 4,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: Colors.text,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  editButton: {
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
    paddingBottom: 40,
  },
  profileHeader: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 4,
    borderColor: Colors.primary,
  },
  roleBadge: {
    position: 'absolute',
    bottom: 0,
    right: -8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: Colors.background,
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: Colors.background,
  },
  userName: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: Colors.text,
    marginBottom: 6,
  },
  affiliationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  affiliation: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 14,
  },
  location: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  dotSeparator: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: Colors.textMuted,
    marginHorizontal: 4,
  },
  joinDate: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  bio: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  sectionTabsScroll: {
    marginTop: 8,
    marginBottom: 20,
  },
  sectionTabsContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  sectionTab: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionTabActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  sectionTabText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  sectionTabTextActive: {
    color: Colors.background,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.background,
  },
  profileButtonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  profileButton: {
    width: '47%',
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  profileButtonIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  profileButtonLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  profileButtonFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileButtonCount: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  credibilitySection: {
    paddingHorizontal: 20,
  },
  trustSection: {
    paddingHorizontal: 20,
  },
  walletSection: {
    paddingHorizontal: 20,
  },
  walletCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  walletCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  walletCardTitle: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  walletViewButton: {
    padding: 4,
  },
  walletAddress: {
    fontSize: 14,
    color: Colors.textMuted,
    fontFamily: 'monospace',
    marginBottom: 14,
  },
  walletBalanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  walletBalanceLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  walletBalanceValue: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  linkedAccountCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  linkedAccountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  linkedAccountIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  linkedAccountInfo: {
    flex: 1,
  },
  linkedAccountName: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 2,
  },
  linkedAccountNumber: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  verifiedText: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: Colors.success,
  },
  linkedAccountActions: {
    flexDirection: 'row',
    gap: 12,
  },
  linkedAccountButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  linkedAccountButtonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  linkedAccountButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.background,
  },
  linkedAccountButtonTextOutline: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  addAccountButton: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  addAccountText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  nxtCreditsCard: {
    backgroundColor: Colors.cardElevated,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  nxtCreditsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 20,
  },
  nxtIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nxtCreditsInfo: {
    flex: 1,
  },
  nxtCreditsTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  nxtCreditsSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  nxtCreditsStats: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: 14,
    padding: 16,
  },
  nxtCreditsStat: {
    flex: 1,
    alignItems: 'center',
  },
  nxtStatDivider: {
    width: 1,
    backgroundColor: Colors.border,
    marginHorizontal: 8,
  },
  nxtCreditsValue: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  nxtCreditsLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  nxtExplainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  nxtExplainerText: {
    flex: 1,
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  fieldSection: {
    paddingHorizontal: 20,
  },
  researchSection: {
    paddingHorizontal: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  uploadButtonText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.background,
  },
  sectionDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginTop: 12,
  },
  emptyStateSubtext: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 4,
  },
  fieldGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  fieldCard: {
    width: '48%',
    backgroundColor: Colors.card,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  fieldImageContainer: {
    position: 'relative',
    height: 120,
  },
  fieldImage: {
    width: '100%',
    height: '100%',
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldCardContent: {
    padding: 10,
  },
  fieldCardTitle: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 6,
    lineHeight: 18,
  },
  fieldMeta: {
    gap: 4,
    marginBottom: 6,
  },
  fieldMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  fieldMetaText: {
    fontSize: 11,
    color: Colors.textMuted,
    flex: 1,
  },
  linkedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: `${Colors.accent}15`,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 6,
    alignSelf: 'flex-start',
  },
  linkedBadgeText: {
    fontSize: 10,
    color: Colors.accent,
    fontWeight: '500' as const,
  },
  fieldStats: {
    flexDirection: 'row',
    gap: 12,
  },
  fieldStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  fieldStatText: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  researchList: {
    gap: 12,
  },
  researchCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  researchCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600' as const,
  },
  pricingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  freeBadgeText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.success,
  },
  paidBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  paidBadgeText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  researchTitle: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 6,
  },
  researchAbstract: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 10,
  },
  researchMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  researchFocusArea: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: Colors.primary,
  },
  researchDate: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  coAuthorsPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  coAuthorsText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  researchStats: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  researchStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  researchStatValue: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  researchStatLabel: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  researchTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  researchTag: {
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  researchTagText: {
    fontSize: 11,
    color: Colors.textSecondary,
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
    fontSize: 17,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  modalSaveText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  uploadTypeSelector: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  uploadTypeOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: Colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  uploadTypeOptionActive: {
    borderColor: Colors.primary,
    backgroundColor: `${Colors.primary}10`,
  },
  uploadTypeText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.textMuted,
    marginTop: 6,
  },
  uploadTypeTextActive: {
    color: Colors.primary,
  },
  uploadArea: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    backgroundColor: Colors.card,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: Colors.border,
    marginBottom: 20,
  },
  uploadAreaText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
    marginTop: 12,
  },
  uploadAreaSubtext: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 4,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.card,
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  switchInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  switchTextContainer: {
    flex: 1,
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  switchSubtext: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  linkTypeSelector: {
    flexDirection: 'row',
    gap: 12,
  },
  linkTypeOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: Colors.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  linkTypeOptionActive: {
    borderColor: Colors.primary,
    backgroundColor: `${Colors.primary}10`,
  },
  linkTypeText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.textMuted,
  },
  linkTypeTextActive: {
    color: Colors.primary,
  },
  optionsScroll: {
    marginTop: 8,
  },
  optionChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: Colors.card,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  optionChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  optionChipText: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: Colors.textSecondary,
  },
  optionChipTextActive: {
    color: Colors.background,
  },
  pricingSection: {
    marginBottom: 20,
  },
  pricingSectionTitle: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 12,
  },
  pricingOptions: {
    gap: 10,
    marginBottom: 16,
  },
  pricingOption: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pricingOptionActive: {
    borderColor: Colors.primary,
    backgroundColor: `${Colors.primary}08`,
  },
  pricingOptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  pricingRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pricingRadioActive: {
    borderColor: Colors.primary,
  },
  pricingRadioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  pricingOptionTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  pricingOptionDesc: {
    fontSize: 12,
    color: Colors.textMuted,
    marginLeft: 30,
  },
  coAuthorsSection: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: 16,
  },
  coAuthorsSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  coAuthorsSectionTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  addCoAuthorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addCoAuthorText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  splitPreview: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  splitPreviewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  splitPreviewName: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: Colors.text,
  },
  splitPreviewRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  splitPreviewPercent: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  infoBox: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: `${Colors.accent}15`,
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
  },
  infoBoxText: {
    flex: 1,
    fontSize: 12,
    color: Colors.accent,
    lineHeight: 18,
  },
  coAuthorModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  coAuthorModalContent: {
    width: '100%',
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 20,
  },
  coAuthorModalTitle: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  coAuthorModalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  coAuthorModalCancel: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: Colors.card,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  coAuthorModalCancelText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  coAuthorModalAdd: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    alignItems: 'center',
  },
  coAuthorModalAddText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.background,
  },
  communitySection: {
    paddingHorizontal: 16,
  },
  communitySectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionBackButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  communityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12,
  },
  communityMembersButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 8,
  },
  communityMembersText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  createPostButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  createPostButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.background,
  },
  feedPost: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  feedPostHeader: {
    flexDirection: 'row',
    alignItems: 'center',
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
  },
  feedPostMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  feedPostRoleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
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
    marginHorizontal: -16,
  },
  feedPostMediaContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  feedPostMediaItem: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  feedPostMedia: {
    width: SCREEN_WIDTH - 64,
    height: 200,
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
    gap: 24,
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
    fontWeight: '600' as const,
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
    color: Colors.textMuted,
    marginBottom: 8,
  },
  commentPreview: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  commentPreviewName: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: Colors.text,
    marginRight: 6,
  },
  commentPreviewText: {
    flex: 1,
    fontSize: 13,
    color: Colors.textSecondary,
  },
  loadingMore: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  loadingMoreText: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  createPostUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  createPostAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  createPostUserName: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  createPostUserAffiliation: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  createPostInput: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.text,
    minHeight: 150,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  createPostMediaOptions: {
    marginBottom: 16,
  },
  createPostMediaLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 12,
  },
  createPostMediaButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  createPostMediaButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.card,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  createPostMediaButtonActive: {
    borderColor: Colors.primary,
    backgroundColor: `${Colors.primary}10`,
  },
  createPostMediaButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.textMuted,
  },
  commentsList: {
    flex: 1,
  },
  commentsListContent: {
    padding: 16,
  },
  commentsPostPreview: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
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
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 16,
    padding: 12,
    borderTopLeftRadius: 4,
  },
  commentUserName: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  commentText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  commentAttachment: {
    marginTop: 10,
  },
  commentAttachmentImage: {
    width: 150,
    height: 100,
    borderRadius: 8,
  },
  commentAttachmentVideo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.card,
    padding: 12,
    borderRadius: 8,
  },
  commentAttachmentVideoText: {
    fontSize: 13,
    color: Colors.text,
  },
  commentAttachmentAudio: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: `${Colors.primary}15`,
    padding: 12,
    borderRadius: 20,
  },
  commentAttachmentAudioText: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '500' as const,
  },
  commentAttachmentDoc: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.card,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  commentAttachmentDocText: {
    fontSize: 13,
    color: Colors.text,
  },
  commentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 6,
    marginLeft: 12,
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
    paddingVertical: 60,
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
    backgroundColor: Colors.background,
    paddingTop: 12,
    paddingHorizontal: 16,
  },
  attachmentOptions: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  attachmentOption: {
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
  attachmentOptionActive: {
    borderColor: Colors.primary,
    backgroundColor: `${Colors.primary}10`,
  },
  attachmentOptionText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  attachmentPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: `${Colors.primary}15`,
    paddingHorizontal: 12,
    paddingVertical: 8,
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
    textTransform: 'capitalize',
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
    paddingVertical: 4,
  },
  attachButton: {
    padding: 4,
    marginLeft: 8,
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
    opacity: 0.5,
  },
  websiteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.card,
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: `${Colors.primary}30`,
  },
  websiteCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  websiteIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: `${Colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  websiteCardContent: {
    marginLeft: 14,
    flex: 1,
  },
  websiteCardTitle: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  websiteCardSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
