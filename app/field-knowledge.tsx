import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Search,
  Plus,
  MapPin,
  Eye,
  Users,
  Lightbulb,
  AlertTriangle,
  X,
  Filter,
  Globe,
  Link2,
  ChevronRight,
  ChevronDown,
  Star,
  ArrowUp,
  MessageCircle,
  Camera,
  FileText,
  Video,
  Music,
  Navigation,
  Calendar,
  CheckCircle,
  Image as ImageIcon,
  TrendingUp,
  Award,
  Sparkles,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import {
  fieldKnowledgePosts,
  fieldCategories,
  FieldKnowledgePost,
  FieldPostCategory,
  FieldAttachment,
  LinkedInitiative,
} from '@/mocks/fieldKnowledge';
import { countries, regions, issueAreas } from '@/mocks/discussions';
import KnowledgeTypeBadge from '@/components/KnowledgeTypeBadge';

const categoryIcons: Record<string, React.ReactNode> = {
  Eye: <Eye size={22} color={Colors.background} />,
  Users: <Users size={22} color={Colors.background} />,
  Lightbulb: <Lightbulb size={22} color={Colors.background} />,
  AlertTriangle: <AlertTriangle size={22} color={Colors.background} />,
};

export default function FieldKnowledgeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FieldPostCategory | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedIssueArea, setSelectedIssueArea] = useState<string | null>(null);
  const [filterByLinked, setFilterByLinked] = useState<'all' | 'proposals' | 'asks' | 'daos'>('all');
  const [filterByUrgency, setFilterByUrgency] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all');
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState<FieldPostCategory>('field_observation');
  const [newPostTags, setNewPostTags] = useState('');
  const [newPostCountry, setNewPostCountry] = useState<string | null>(null);
  const [newPostRegion, setNewPostRegion] = useState<string | null>(null);
  const [newPostIssueArea, setNewPostIssueArea] = useState<string | null>(null);
  const [newPostAttachments, setNewPostAttachments] = useState<FieldAttachment[]>([]);
  const [newPostLinkedInitiatives, setNewPostLinkedInitiatives] = useState<LinkedInitiative[]>([]);
  const [enableGeotagging, setEnableGeotagging] = useState(false);
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
  const [showLinkOptions, setShowLinkOptions] = useState(false);
  const [viewMode, setViewMode] = useState<'global' | 'dao' | 'profile'>('global');
  const [selectedDaoFilter, setSelectedDaoFilter] = useState<string | null>(null);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCountry) count++;
    if (selectedRegion) count++;
    if (selectedIssueArea) count++;
    if (filterByLinked !== 'all') count++;
    if (filterByUrgency !== 'all') count++;
    return count;
  }, [selectedCountry, selectedRegion, selectedIssueArea, filterByLinked, filterByUrgency]);

  const filteredPosts = useMemo(() => {
    let posts = [...fieldKnowledgePosts];

    if (selectedCategory) {
      posts = posts.filter((post) => post.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      posts = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.content.toLowerCase().includes(query) ||
          post.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    if (selectedCountry) {
      posts = posts.filter((post) => post.geoLocation?.country === selectedCountry);
    }

    if (selectedRegion) {
      posts = posts.filter((post) => post.geoLocation?.region === selectedRegion);
    }

    if (selectedIssueArea) {
      posts = posts.filter((post) => post.issueArea === selectedIssueArea);
    }

    if (filterByLinked !== 'all') {
      posts = posts.filter((post) => {
        if (!post.linkedInitiatives) return false;
        return post.linkedInitiatives.some((li) => {
          if (filterByLinked === 'proposals') return li.type === 'proposal';
          if (filterByLinked === 'asks') return li.type === 'ask';
          if (filterByLinked === 'daos') return li.type === 'dao';
          return false;
        });
      });
    }

    if (filterByUrgency !== 'all') {
      posts = posts.filter((post) => post.urgencyLevel === filterByUrgency);
    }

    return posts.sort((a, b) => {
      if (a.urgencyLevel === 'critical' && b.urgencyLevel !== 'critical') return -1;
      if (b.urgencyLevel === 'critical' && a.urgencyLevel !== 'critical') return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [searchQuery, selectedCategory, selectedCountry, selectedRegion, selectedIssueArea, filterByLinked, filterByUrgency]);

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
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return `${Math.floor(diffDays / 30)}mo ago`;
  };

  const handlePostPress = (postId: string) => {
    router.push(`/field/${postId}`);
  };

  const clearAllFilters = () => {
    setSelectedCountry(null);
    setSelectedRegion(null);
    setSelectedIssueArea(null);
    setFilterByLinked('all');
    setFilterByUrgency('all');
  };

  const handleCreatePost = () => {
    console.log('Creating new field knowledge post:', {
      title: newPostTitle,
      content: newPostContent,
      category: newPostCategory,
      tags: newPostTags.split(',').map((t) => t.trim()),
      geoLocation: enableGeotagging ? {
        country: newPostCountry,
        region: newPostRegion,
      } : null,
      issueArea: newPostIssueArea,
      attachments: newPostAttachments,
      linkedInitiatives: newPostLinkedInitiatives,
    });
    setShowNewPostModal(false);
    resetNewPostForm();
  };

  const resetNewPostForm = () => {
    setNewPostTitle('');
    setNewPostContent('');
    setNewPostCategory('field_observation');
    setNewPostTags('');
    setNewPostCountry(null);
    setNewPostRegion(null);
    setNewPostIssueArea(null);
    setNewPostAttachments([]);
    setNewPostLinkedInitiatives([]);
    setEnableGeotagging(false);
  };

  const handleAddAttachment = (type: 'photo' | 'video' | 'audio' | 'document') => {
    const mockAttachment: FieldAttachment = {
      id: `att-${Date.now()}`,
      type,
      name: `Field_${type}_${Date.now().toString().slice(-4)}.${type === 'document' ? 'pdf' : type === 'photo' ? 'jpg' : type === 'video' ? 'mp4' : 'mp3'}`,
      url: '#',
      size: type === 'video' ? '45.2 MB' : type === 'audio' ? '12.4 MB' : '1.2 MB',
      mimeType: type === 'document' ? 'application/pdf' : type === 'photo' ? 'image/jpeg' : type === 'video' ? 'video/mp4' : 'audio/mpeg',
    };
    setNewPostAttachments(prev => [...prev, mockAttachment]);
    setShowAttachmentOptions(false);
  };

  const handleRemoveAttachment = (attachmentId: string) => {
    setNewPostAttachments(prev => prev.filter(a => a.id !== attachmentId));
  };

  const handleAddLinkedInitiative = (type: 'proposal' | 'ask' | 'dao') => {
    const mockInitiative: LinkedInitiative = {
      id: `init-${Date.now()}`,
      type,
      title: type === 'proposal' ? 'Field Research Proposal' : type === 'ask' ? 'Equipment Request' : 'Climate Adaptation DAO',
      status: type === 'proposal' ? 'Under Review' : type === 'ask' ? 'Active' : 'Active',
    };
    setNewPostLinkedInitiatives(prev => [...prev, mockInitiative]);
    setShowLinkOptions(false);
  };

  const handleRemoveLinkedInitiative = (initiativeId: string) => {
    setNewPostLinkedInitiatives(prev => prev.filter(i => i.id !== initiativeId));
  };

  const getAttachmentIcon = (type: string) => {
    switch (type) {
      case 'document': return <FileText size={14} color={Colors.primary} />;
      case 'photo': return <ImageIcon size={14} color="#4CAF50" />;
      case 'video': return <Video size={14} color={Colors.accent} />;
      case 'audio': return <Music size={14} color="#FF9800" />;
      default: return <FileText size={14} color={Colors.textMuted} />;
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

  const getUrgencyColor = (urgency?: string) => {
    switch (urgency) {
      case 'critical': return '#F44336';
      case 'high': return '#FF9800';
      case 'medium': return '#FFC107';
      case 'low': return '#4CAF50';
      default: return Colors.textMuted;
    }
  };

  const getCategoryInfo = (categoryId: FieldPostCategory) => {
    return fieldCategories.find(c => c.id === categoryId);
  };

  const renderCategoryCard = (category: typeof fieldCategories[0]) => (
    <TouchableOpacity
      key={category.id}
      style={[
        styles.categoryCard,
        selectedCategory === category.id && styles.categoryCardSelected,
      ]}
      onPress={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
      activeOpacity={0.7}
      testID={`category-${category.id}`}
    >
      <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
        {categoryIcons[category.icon]}
      </View>
      <Text
        style={[
          styles.categoryName,
          selectedCategory === category.id && styles.categoryNameSelected,
        ]}
        numberOfLines={2}
      >
        {category.label}
      </Text>
      <Text style={styles.categoryDescription} numberOfLines={1}>
        {category.description}
      </Text>
    </TouchableOpacity>
  );

  const renderPostCard = (post: FieldKnowledgePost) => {
    const category = getCategoryInfo(post.category);

    return (
      <TouchableOpacity
        key={post.id}
        style={styles.postCard}
        onPress={() => handlePostPress(post.id)}
        activeOpacity={0.7}
        testID={`post-${post.id}`}
      >
        {post.urgencyLevel && (post.urgencyLevel === 'critical' || post.urgencyLevel === 'high') && (
          <View style={[styles.urgencyBanner, { backgroundColor: getUrgencyColor(post.urgencyLevel) }]}>
            <AlertTriangle size={12} color={Colors.background} />
            <Text style={styles.urgencyText}>
              {post.urgencyLevel === 'critical' ? 'CRITICAL' : 'HIGH PRIORITY'}
            </Text>
          </View>
        )}

        <View style={styles.postHeader}>
          <View style={[styles.categoryBadge, { backgroundColor: category?.color + '20' }]}>
            <Text style={[styles.categoryBadgeText, { color: category?.color }]}>
              {category?.label}
            </Text>
          </View>
          {post.isVerified && (
            <View style={styles.verifiedBadge}>
              <CheckCircle size={12} color={Colors.success} />
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          )}
        </View>

        <View style={styles.postBadgesRow}>
          <KnowledgeTypeBadge type={post.knowledgeType} variant="compact" />
          {post.isHighSignal && (
            <View style={styles.highSignalBadge}>
              <TrendingUp size={10} color={Colors.success} />
              <Text style={styles.highSignalText}>High Signal</Text>
            </View>
          )}
          {post.aiAnalysis && (
            <View style={styles.aiAnalyzedBadge}>
              <Sparkles size={10} color={Colors.primary} />
              <Text style={styles.aiAnalyzedText}>AI Analyzed</Text>
            </View>
          )}
        </View>

        <Text style={styles.postTitle} numberOfLines={2}>
          {post.title}
        </Text>

        <Text style={styles.postPreview} numberOfLines={3}>
          {post.content.replace(/\*\*/g, '').replace(/\n/g, ' ').slice(0, 150)}...
        </Text>

        {post.geoLocation && (
          <View style={styles.locationRow}>
            <MapPin size={12} color={Colors.primary} />
            <Text style={styles.locationText}>
              {post.geoLocation.placeName}, {post.geoLocation.country}
            </Text>
          </View>
        )}

        <View style={styles.postMeta}>
          {post.issueArea && (
            <View style={styles.issueTag}>
              <Text style={styles.issueTagText}>{post.issueArea}</Text>
            </View>
          )}
          {post.linkedInitiatives && post.linkedInitiatives.length > 0 && (
            <View style={styles.linkedTag}>
              <Link2 size={10} color={Colors.accent} />
              <Text style={styles.linkedTagText}>{post.linkedInitiatives.length} linked</Text>
            </View>
          )}
          {post.attachments.length > 0 && (
            <View style={styles.attachmentIndicator}>
              <Camera size={10} color={Colors.textMuted} />
              <Text style={styles.attachmentIndicatorText}>{post.attachments.length}</Text>
            </View>
          )}
        </View>

        <View style={styles.postTags}>
          {post.tags.slice(0, 3).map((tag) => (
            <View key={tag} style={styles.postTag}>
              <Text style={styles.postTagText}>{tag}</Text>
            </View>
          ))}
        </View>

        <View style={styles.postFooter}>
          <View style={styles.authorInfo}>
            <Image source={{ uri: post.author.avatar }} style={styles.authorAvatar} />
            <View>
              <Text style={styles.authorName}>{post.author.name}</Text>
              <View style={styles.authorMeta}>
                <Star size={10} color={Colors.accent} />
                <Text style={styles.authorScore}>{post.author.credibilityScore}</Text>
                <Text style={styles.postTime}>· {formatTimeAgo(post.createdAt)}</Text>
              </View>
            </View>
          </View>

          <View style={styles.postStats}>
            <View style={styles.stat}>
              <ArrowUp size={14} color={Colors.primary} />
              <Text style={styles.statText}>{post.upvotes}</Text>
            </View>
            <View style={styles.stat}>
              <MessageCircle size={14} color={Colors.textMuted} />
              <Text style={styles.statText}>{post.commentCount}</Text>
            </View>
            {post.endorsements && post.endorsements.length > 0 && (
              <View style={styles.stat}>
                <Award size={14} color={Colors.accent} />
                <Text style={styles.statText}>{post.endorsements.length}</Text>
              </View>
            )}
          </View>
        </View>

        <ChevronRight size={18} color={Colors.textMuted} style={styles.postChevron} />
      </TouchableOpacity>
    );
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
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>On the Ground</Text>
          <Text style={styles.headerSubtitle}>Real-world updates from practitioners</Text>
        </View>
        <TouchableOpacity
          style={styles.newPostButton}
          onPress={() => setShowNewPostModal(true)}
          testID="new-post-button"
        >
          <Plus size={20} color={Colors.background} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <Search size={18} color={Colors.textMuted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search field knowledge..."
              placeholderTextColor={Colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <X size={18} color={Colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity
            style={[
              styles.filterButton,
              showFilters && styles.filterButtonActive,
            ]}
            onPress={() => setShowFilters(!showFilters)}
            testID="filter-button"
          >
            <Filter size={18} color={showFilters ? Colors.background : Colors.text} />
            {activeFiltersCount > 0 && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>{activeFiltersCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {showFilters && (
          <View style={styles.filtersContainer}>
            <View style={styles.filterHeader}>
              <Text style={styles.filterTitle}>Filters</Text>
              {activeFiltersCount > 0 && (
                <TouchableOpacity onPress={clearAllFilters}>
                  <Text style={styles.clearFiltersText}>Clear all</Text>
                </TouchableOpacity>
              )}
            </View>

            <Text style={styles.filterLabel}>Urgency</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
              {(['all', 'critical', 'high', 'medium', 'low'] as const).map((urgency) => (
                <TouchableOpacity
                  key={urgency}
                  style={[
                    styles.filterChip,
                    filterByUrgency === urgency && styles.filterChipActive,
                    urgency !== 'all' && { borderLeftWidth: 3, borderLeftColor: getUrgencyColor(urgency) },
                  ]}
                  onPress={() => setFilterByUrgency(urgency)}
                >
                  {urgency !== 'all' && <AlertTriangle size={12} color={filterByUrgency === urgency ? Colors.background : getUrgencyColor(urgency)} />}
                  <Text style={[styles.filterChipText, filterByUrgency === urgency && styles.filterChipTextActive]}>
                    {urgency.charAt(0).toUpperCase() + urgency.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.filterLabel}>Country</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
              <TouchableOpacity
                style={[styles.filterChip, !selectedCountry && styles.filterChipActive]}
                onPress={() => setSelectedCountry(null)}
              >
                <Text style={[styles.filterChipText, !selectedCountry && styles.filterChipTextActive]}>All</Text>
              </TouchableOpacity>
              {countries.slice(0, 8).map((country) => (
                <TouchableOpacity
                  key={country}
                  style={[styles.filterChip, selectedCountry === country && styles.filterChipActive]}
                  onPress={() => setSelectedCountry(selectedCountry === country ? null : country)}
                >
                  <MapPin size={12} color={selectedCountry === country ? Colors.background : Colors.textMuted} />
                  <Text style={[styles.filterChipText, selectedCountry === country && styles.filterChipTextActive]}>{country}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.filterLabel}>Region</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
              <TouchableOpacity
                style={[styles.filterChip, !selectedRegion && styles.filterChipActive]}
                onPress={() => setSelectedRegion(null)}
              >
                <Text style={[styles.filterChipText, !selectedRegion && styles.filterChipTextActive]}>All</Text>
              </TouchableOpacity>
              {regions.map((region) => (
                <TouchableOpacity
                  key={region}
                  style={[styles.filterChip, selectedRegion === region && styles.filterChipActive]}
                  onPress={() => setSelectedRegion(selectedRegion === region ? null : region)}
                >
                  <Globe size={12} color={selectedRegion === region ? Colors.background : Colors.textMuted} />
                  <Text style={[styles.filterChipText, selectedRegion === region && styles.filterChipTextActive]}>{region}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.filterLabel}>Linked To</Text>
            <View style={styles.linkedFilters}>
              {(['all', 'proposals', 'asks', 'daos'] as const).map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[styles.linkedChip, filterByLinked === option && styles.linkedChipActive]}
                  onPress={() => setFilterByLinked(option)}
                >
                  <Link2 size={12} color={filterByLinked === option ? Colors.background : Colors.textMuted} />
                  <Text style={[styles.linkedChipText, filterByLinked === option && styles.linkedChipTextActive]}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.viewModeSection}>
          <Text style={styles.viewModeLabel}>View Feed</Text>
          <View style={styles.viewModeRow}>
            <TouchableOpacity
              style={[styles.viewModeChip, viewMode === 'global' && styles.viewModeChipActive]}
              onPress={() => setViewMode('global')}
              testID="view-mode-global"
            >
              <Globe size={14} color={viewMode === 'global' ? Colors.background : Colors.textSecondary} />
              <Text style={[styles.viewModeText, viewMode === 'global' && styles.viewModeTextActive]}>Global Feed</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.viewModeChip, viewMode === 'dao' && styles.viewModeChipActive]}
              onPress={() => setViewMode('dao')}
              testID="view-mode-dao"
            >
              <Users size={14} color={viewMode === 'dao' ? Colors.background : Colors.textSecondary} />
              <Text style={[styles.viewModeText, viewMode === 'dao' && styles.viewModeTextActive]}>DAO Feed</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.viewModeChip, viewMode === 'profile' && styles.viewModeChipActive]}
              onPress={() => setViewMode('profile')}
              testID="view-mode-profile"
            >
              <Eye size={14} color={viewMode === 'profile' ? Colors.background : Colors.textSecondary} />
              <Text style={[styles.viewModeText, viewMode === 'profile' && styles.viewModeTextActive]}>My Posts</Text>
            </TouchableOpacity>
          </View>
          {viewMode === 'dao' && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daoFilterScroll}>
              <TouchableOpacity
                style={[styles.daoFilterChip, !selectedDaoFilter && styles.daoFilterChipActive]}
                onPress={() => setSelectedDaoFilter(null)}
              >
                <Text style={[styles.daoFilterText, !selectedDaoFilter && styles.daoFilterTextActive]}>All DAOs</Text>
              </TouchableOpacity>
              {['Climate Adaptation DAO', 'Health Infrastructure DAO', 'Water Initiative DAO', 'One Health DAO'].map((dao) => (
                <TouchableOpacity
                  key={dao}
                  style={[styles.daoFilterChip, selectedDaoFilter === dao && styles.daoFilterChipActive]}
                  onPress={() => setSelectedDaoFilter(selectedDaoFilter === dao ? null : dao)}
                >
                  <Text style={[styles.daoFilterText, selectedDaoFilter === dao && styles.daoFilterTextActive]}>{dao}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        <Text style={styles.sectionTitle}>Post Types</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesRow}
          contentContainerStyle={styles.categoriesContent}
        >
          {fieldCategories.map(renderCategoryCard)}
        </ScrollView>

        <View style={styles.postsHeader}>
          <Text style={styles.sectionTitle}>
            {selectedCategory
              ? fieldCategories.find((c) => c.id === selectedCategory)?.label
              : 'Recent Posts'}
          </Text>
          <Text style={styles.postCount}>{filteredPosts.length} posts</Text>
        </View>

        {filteredPosts.map(renderPostCard)}

        {filteredPosts.length === 0 && (
          <View style={styles.emptyState}>
            <MapPin size={48} color={Colors.textMuted} />
            <Text style={styles.emptyStateTitle}>No field posts found</Text>
            <Text style={styles.emptyStateText}>
              {searchQuery
                ? 'Try a different search term'
                : 'Be the first to share field knowledge'}
            </Text>
          </View>
        )}
      </ScrollView>

      <Modal
        visible={showNewPostModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowNewPostModal(false)}
      >
        <View style={[styles.modalContainer, { paddingTop: insets.top }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => { setShowNewPostModal(false); resetNewPostForm(); }}>
              <X size={24} color={Colors.text} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Share Field Knowledge</Text>
            <TouchableOpacity
              style={[
                styles.postButton,
                (!newPostTitle || !newPostContent) && styles.postButtonDisabled,
              ]}
              onPress={handleCreatePost}
              disabled={!newPostTitle || !newPostContent}
            >
              <Text
                style={[
                  styles.postButtonText,
                  (!newPostTitle || !newPostContent) && styles.postButtonTextDisabled,
                ]}
              >
                Post
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.inputLabel}>Post Type</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categorySelector}
            >
              {fieldCategories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categorySelectorItem,
                    newPostCategory === cat.id && styles.categorySelectorItemSelected,
                    { borderLeftWidth: 3, borderLeftColor: cat.color },
                  ]}
                  onPress={() => setNewPostCategory(cat.id)}
                >
                  <Text
                    style={[
                      styles.categorySelectorText,
                      newPostCategory === cat.id && styles.categorySelectorTextSelected,
                    ]}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.inputLabel}>Title</Text>
            <TextInput
              style={styles.titleInput}
              placeholder="What did you observe or learn?"
              placeholderTextColor={Colors.textMuted}
              value={newPostTitle}
              onChangeText={setNewPostTitle}
              maxLength={150}
            />

            <Text style={styles.inputLabel}>Content</Text>
            <TextInput
              style={styles.contentInput}
              placeholder="Share your field observations, data, lessons learned, or early warning signals..."
              placeholderTextColor={Colors.textMuted}
              value={newPostContent}
              onChangeText={setNewPostContent}
              multiline
              textAlignVertical="top"
            />

            <Text style={styles.inputLabel}>Tags (comma separated)</Text>
            <TextInput
              style={styles.tagsInput}
              placeholder="e.g., Water Quality, Field Survey, Kenya"
              placeholderTextColor={Colors.textMuted}
              value={newPostTags}
              onChangeText={setNewPostTags}
            />

            <View style={styles.geoToggleRow}>
              <View style={styles.geoToggleInfo}>
                <Navigation size={18} color={Colors.primary} />
                <View>
                  <Text style={styles.geoToggleLabel}>Enable Geo-tagging</Text>
                  <Text style={styles.geoToggleDescription}>Add location to your post</Text>
                </View>
              </View>
              <TouchableOpacity
                style={[styles.toggleButton, enableGeotagging && styles.toggleButtonActive]}
                onPress={() => setEnableGeotagging(!enableGeotagging)}
              >
                <View style={[styles.toggleKnob, enableGeotagging && styles.toggleKnobActive]} />
              </TouchableOpacity>
            </View>

            {enableGeotagging && (
              <View style={styles.geoTagsContainer}>
                <View style={styles.geoTagColumn}>
                  <Text style={styles.geoTagLabel}>Country</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.geoTagScroll}>
                    {countries.slice(0, 10).map((country) => (
                      <TouchableOpacity
                        key={country}
                        style={[styles.geoTagChip, newPostCountry === country && styles.geoTagChipActive]}
                        onPress={() => setNewPostCountry(newPostCountry === country ? null : country)}
                      >
                        <MapPin size={10} color={newPostCountry === country ? Colors.background : Colors.textMuted} />
                        <Text style={[styles.geoTagChipText, newPostCountry === country && styles.geoTagChipTextActive]}>{country}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
                <View style={styles.geoTagColumn}>
                  <Text style={styles.geoTagLabel}>Region</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.geoTagScroll}>
                    {regions.map((region) => (
                      <TouchableOpacity
                        key={region}
                        style={[styles.geoTagChip, newPostRegion === region && styles.geoTagChipActive]}
                        onPress={() => setNewPostRegion(newPostRegion === region ? null : region)}
                      >
                        <Globe size={10} color={newPostRegion === region ? Colors.background : Colors.textMuted} />
                        <Text style={[styles.geoTagChipText, newPostRegion === region && styles.geoTagChipTextActive]}>{region}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>
            )}

            <Text style={styles.inputLabel}>Issue Area</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.issueAreaScroll}>
              <TouchableOpacity
                style={[styles.issueAreaChip, !newPostIssueArea && styles.issueAreaChipActive]}
                onPress={() => setNewPostIssueArea(null)}
              >
                <Text style={[styles.issueAreaChipText, !newPostIssueArea && styles.issueAreaChipTextActive]}>None</Text>
              </TouchableOpacity>
              {issueAreas.map((issue) => (
                <TouchableOpacity
                  key={issue}
                  style={[styles.issueAreaChip, newPostIssueArea === issue && styles.issueAreaChipActive]}
                  onPress={() => setNewPostIssueArea(newPostIssueArea === issue ? null : issue)}
                >
                  <Text style={[styles.issueAreaChipText, newPostIssueArea === issue && styles.issueAreaChipTextActive]}>{issue}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.inputLabel}>Attachments</Text>
            <View style={styles.attachmentsContainer}>
              {newPostAttachments.map((attachment) => (
                <View key={attachment.id} style={styles.attachmentItem}>
                  <View style={styles.attachmentItemIcon}>
                    {getAttachmentIcon(attachment.type)}
                  </View>
                  <View style={styles.attachmentItemInfo}>
                    <Text style={styles.attachmentItemName} numberOfLines={1}>{attachment.name}</Text>
                    <Text style={styles.attachmentItemSize}>{attachment.size}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.attachmentItemRemove}
                    onPress={() => handleRemoveAttachment(attachment.id)}
                  >
                    <X size={14} color={Colors.error} />
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity
                style={styles.addAttachmentButton}
                onPress={() => setShowAttachmentOptions(!showAttachmentOptions)}
              >
                <Plus size={16} color={Colors.primary} />
                <Text style={styles.addAttachmentText}>Add Attachment</Text>
                <ChevronDown size={14} color={Colors.primary} style={showAttachmentOptions ? { transform: [{ rotate: '180deg' }] } : undefined} />
              </TouchableOpacity>
              {showAttachmentOptions && (
                <View style={styles.attachmentOptionsRow}>
                  <TouchableOpacity style={styles.attachmentOption} onPress={() => handleAddAttachment('photo')}>
                    <View style={[styles.attachmentOptionIcon, { backgroundColor: '#4CAF50' + '20' }]}>
                      <Camera size={16} color="#4CAF50" />
                    </View>
                    <Text style={styles.attachmentOptionText}>Photo</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.attachmentOption} onPress={() => handleAddAttachment('video')}>
                    <View style={[styles.attachmentOptionIcon, { backgroundColor: Colors.accent + '20' }]}>
                      <Video size={16} color={Colors.accent} />
                    </View>
                    <Text style={styles.attachmentOptionText}>Video</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.attachmentOption} onPress={() => handleAddAttachment('audio')}>
                    <View style={[styles.attachmentOptionIcon, { backgroundColor: '#FF9800' + '20' }]}>
                      <Music size={16} color="#FF9800" />
                    </View>
                    <Text style={styles.attachmentOptionText}>Audio</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.attachmentOption} onPress={() => handleAddAttachment('document')}>
                    <View style={[styles.attachmentOptionIcon, { backgroundColor: Colors.primary + '20' }]}>
                      <FileText size={16} color={Colors.primary} />
                    </View>
                    <Text style={styles.attachmentOptionText}>Document</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <Text style={styles.inputLabel}>Link to Governance</Text>
            <View style={styles.linkedContainer}>
              {newPostLinkedInitiatives.map((initiative) => (
                <View key={initiative.id} style={styles.linkedItemNew}>
                  <View style={[styles.linkedItemIcon, { backgroundColor: getInitiativeColor(initiative.type) + '20' }]}>
                    <Link2 size={12} color={getInitiativeColor(initiative.type)} />
                  </View>
                  <View style={styles.linkedItemInfo}>
                    <Text style={[styles.linkedItemType, { color: getInitiativeColor(initiative.type) }]}>{initiative.type.toUpperCase()}</Text>
                    <Text style={styles.linkedItemTitle} numberOfLines={1}>{initiative.title}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.linkedItemRemove}
                    onPress={() => handleRemoveLinkedInitiative(initiative.id)}
                  >
                    <X size={14} color={Colors.error} />
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity
                style={styles.addLinkedButton}
                onPress={() => setShowLinkOptions(!showLinkOptions)}
              >
                <Link2 size={16} color={Colors.primary} />
                <Text style={styles.addLinkedText}>Link to Initiative</Text>
                <ChevronDown size={14} color={Colors.primary} style={showLinkOptions ? { transform: [{ rotate: '180deg' }] } : undefined} />
              </TouchableOpacity>
              {showLinkOptions && (
                <View style={styles.linkOptionsRow}>
                  <TouchableOpacity style={styles.linkOption} onPress={() => handleAddLinkedInitiative('proposal')}>
                    <View style={[styles.linkOptionIcon, { backgroundColor: Colors.primary + '20' }]}>
                      <FileText size={16} color={Colors.primary} />
                    </View>
                    <Text style={styles.linkOptionText}>Proposal</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.linkOption} onPress={() => handleAddLinkedInitiative('ask')}>
                    <View style={[styles.linkOptionIcon, { backgroundColor: Colors.accent + '20' }]}>
                      <Calendar size={16} color={Colors.accent} />
                    </View>
                    <Text style={styles.linkOptionText}>Ask</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.linkOption} onPress={() => handleAddLinkedInitiative('dao')}>
                    <View style={[styles.linkOptionIcon, { backgroundColor: '#4CAF50' + '20' }]}>
                      <Users size={16} color="#4CAF50" />
                    </View>
                    <Text style={styles.linkOptionText}>DAO</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <View style={styles.guidelines}>
              <Text style={styles.guidelinesTitle}>Field Knowledge Guidelines</Text>
              <Text style={styles.guidelinesText}>
                • Share accurate, firsthand observations{'\n'}
                • Include timestamps and locations when possible{'\n'}
                • For urgent findings, mark appropriately{'\n'}
                • Respect community privacy and consent{'\n'}
                • Upload supporting media when available
              </Text>
            </View>
          </ScrollView>
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
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  newPostButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeText: {
    fontSize: 10,
    fontWeight: '700' as const,
    color: Colors.background,
  },
  filtersContainer: {
    marginTop: 12,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  filterTitle: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  clearFiltersText: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '600' as const,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
    marginBottom: 8,
    marginTop: 10,
  },
  filterScroll: {
    marginBottom: 4,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
  },
  filterChipText: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '500' as const,
  },
  filterChipTextActive: {
    color: Colors.background,
  },
  linkedFilters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  linkedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  linkedChipActive: {
    backgroundColor: Colors.primary,
  },
  linkedChipText: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '500' as const,
  },
  linkedChipTextActive: {
    color: Colors.background,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 12,
  },
  categoriesRow: {
    marginBottom: 20,
  },
  categoriesContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  categoryCard: {
    width: 140,
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 12,
  },
  categoryCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.cardElevated,
  },
  categoryIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 4,
    lineHeight: 16,
  },
  categoryNameSelected: {
    color: Colors.primary,
  },
  categoryDescription: {
    fontSize: 10,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  postsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  postCount: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  postCard: {
    backgroundColor: Colors.card,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  urgencyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 12,
  },
  urgencyText: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: Colors.background,
    letterSpacing: 0.5,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '600' as const,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.success + '20',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: '600' as const,
    color: Colors.success,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 8,
    paddingRight: 24,
  },
  postPreview: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 10,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  locationText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500' as const,
  },
  postMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  issueTag: {
    backgroundColor: Colors.accent + '20',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  issueTagText: {
    fontSize: 10,
    fontWeight: '600' as const,
    color: Colors.accent,
  },
  linkedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.cardElevated,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.accent + '40',
  },
  linkedTagText: {
    fontSize: 10,
    fontWeight: '600' as const,
    color: Colors.accent,
  },
  attachmentIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  attachmentIndicatorText: {
    fontSize: 10,
    fontWeight: '500' as const,
    color: Colors.textMuted,
  },
  postTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 14,
  },
  postTag: {
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  postTagText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
  },
  postFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  authorAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  authorName: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 2,
  },
  authorMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  authorScore: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: Colors.accent,
  },
  postTime: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  postStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
  },
  postChevron: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
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
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  postButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 18,
  },
  postButtonDisabled: {
    backgroundColor: Colors.backgroundSecondary,
  },
  postButtonText: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.background,
  },
  postButtonTextDisabled: {
    color: Colors.textMuted,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
    marginBottom: 8,
    marginTop: 16,
  },
  categorySelector: {
    marginBottom: 8,
  },
  categorySelectorItem: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: Colors.card,
    marginRight: 8,
  },
  categorySelectorItemSelected: {
    backgroundColor: Colors.primary,
  },
  categorySelectorText: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: Colors.textSecondary,
  },
  categorySelectorTextSelected: {
    color: Colors.background,
  },
  titleInput: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  contentInput: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 160,
  },
  tagsInput: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  geoToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 14,
    marginTop: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  geoToggleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  geoToggleLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  geoToggleDescription: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  toggleButton: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.backgroundSecondary,
    padding: 3,
  },
  toggleButtonActive: {
    backgroundColor: Colors.primary,
  },
  toggleKnob: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.textMuted,
  },
  toggleKnobActive: {
    backgroundColor: Colors.background,
    marginLeft: 'auto',
  },
  geoTagsContainer: {
    marginTop: 12,
    gap: 12,
  },
  geoTagColumn: {
    gap: 8,
  },
  geoTagLabel: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.textMuted,
  },
  geoTagScroll: {
    marginBottom: 4,
  },
  geoTagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    marginRight: 6,
  },
  geoTagChipActive: {
    backgroundColor: Colors.primary,
  },
  geoTagChipText: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '500' as const,
  },
  geoTagChipTextActive: {
    color: Colors.background,
  },
  issueAreaScroll: {
    marginBottom: 4,
  },
  issueAreaChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: Colors.backgroundSecondary,
    marginRight: 6,
  },
  issueAreaChipActive: {
    backgroundColor: Colors.accent,
  },
  issueAreaChipText: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '500' as const,
  },
  issueAreaChipTextActive: {
    color: Colors.background,
  },
  attachmentsContainer: {
    gap: 8,
  },
  attachmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 10,
    padding: 10,
    gap: 10,
  },
  attachmentItemIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  attachmentItemInfo: {
    flex: 1,
  },
  attachmentItemName: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: Colors.text,
    marginBottom: 2,
  },
  attachmentItemSize: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  attachmentItemRemove: {
    padding: 4,
  },
  addAttachmentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
  },
  addAttachmentText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  attachmentOptionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 8,
  },
  attachmentOption: {
    alignItems: 'center',
    gap: 6,
    width: '22%',
  },
  attachmentOptionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  attachmentOptionText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
  },
  linkedContainer: {
    gap: 8,
  },
  linkedItemNew: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 10,
    padding: 10,
    gap: 10,
  },
  linkedItemIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkedItemInfo: {
    flex: 1,
  },
  linkedItemType: {
    fontSize: 9,
    fontWeight: '700' as const,
    letterSpacing: 0.5,
  },
  linkedItemTitle: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: Colors.text,
    marginTop: 2,
  },
  linkedItemRemove: {
    padding: 4,
  },
  addLinkedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
  },
  addLinkedText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  linkOptionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  linkOption: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  linkOptionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkOptionText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
  },
  guidelines: {
    backgroundColor: Colors.cardElevated,
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    marginBottom: 40,
  },
  guidelinesTitle: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 10,
  },
  guidelinesText: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  postBadgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  highSignalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Colors.success + '20',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
  },
  highSignalText: {
    fontSize: 9,
    fontWeight: '600' as const,
    color: Colors.success,
  },
  aiAnalyzedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Colors.primary + '15',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
  },
  aiAnalyzedText: {
    fontSize: 9,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  viewModeSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  viewModeLabel: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
    marginBottom: 10,
  },
  viewModeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  viewModeChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.card,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  viewModeChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  viewModeText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  viewModeTextActive: {
    color: Colors.background,
  },
  daoFilterScroll: {
    marginTop: 12,
  },
  daoFilterChip: {
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  daoFilterChipActive: {
    backgroundColor: Colors.accent,
  },
  daoFilterText: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: Colors.textMuted,
  },
  daoFilterTextActive: {
    color: Colors.background,
  },
});
