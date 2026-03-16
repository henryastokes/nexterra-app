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
  MessageSquare,
  ChevronRight,
  Pin,
  ArrowUp,
  X,
  Leaf,
  Heart,
  Shield,
  Trees,
  Vote,
  Star,
  Filter,
  MapPin,
  Globe,
  Link2,
  Paperclip,
  FileText,
  Image as ImageIcon,
  Video,
  Music,
  ExternalLink,
  ChevronDown,
  TrendingUp,
  Award,
  Sparkles,
  } from 'lucide-react-native';
import Colors from '@/constants/colors';
import {
  forumCategories,
  discussionThreads,
  getThreadsByCategory,
  ForumCategory,
  DiscussionThread,
  countries,
  regions,
  issueAreas,
  Attachment,
  LinkedInitiative,
} from '@/mocks/discussions';
import KnowledgeTypeBadge from '@/components/KnowledgeTypeBadge';

const categoryIcons: Record<string, React.ReactNode> = {
  Leaf: <Leaf size={24} color={Colors.background} />,
  Heart: <Heart size={24} color={Colors.background} />,
  Shield: <Shield size={24} color={Colors.background} />,
  Trees: <Trees size={24} color={Colors.background} />,
  Vote: <Vote size={24} color={Colors.background} />,
};

export default function DiscussionsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showNewThreadModal, setShowNewThreadModal] = useState(false);
  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [newThreadContent, setNewThreadContent] = useState('');
  const [newThreadCategory, setNewThreadCategory] = useState<string>('climate');
  const [newThreadTags, setNewThreadTags] = useState('');
  const [newThreadCountry, setNewThreadCountry] = useState<string | null>(null);
  const [newThreadRegion, setNewThreadRegion] = useState<string | null>(null);
  const [newThreadIssueArea, setNewThreadIssueArea] = useState<string | null>(null);
  const [newThreadAttachments, setNewThreadAttachments] = useState<Attachment[]>([]);
  const [newThreadLinkedInitiatives, setNewThreadLinkedInitiatives] = useState<LinkedInitiative[]>([]);
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
  const [showLinkOptions, setShowLinkOptions] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedIssueArea, setSelectedIssueArea] = useState<string | null>(null);
  const [filterByLinked, setFilterByLinked] = useState<'all' | 'proposals' | 'asks' | 'daos'>('all');

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCountry) count++;
    if (selectedRegion) count++;
    if (selectedIssueArea) count++;
    if (filterByLinked !== 'all') count++;
    return count;
  }, [selectedCountry, selectedRegion, selectedIssueArea, filterByLinked]);

  const filteredThreads = useMemo(() => {
    let threads = selectedCategory
      ? getThreadsByCategory(selectedCategory)
      : discussionThreads;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      threads = threads.filter(
        (thread) =>
          thread.title.toLowerCase().includes(query) ||
          thread.content.toLowerCase().includes(query) ||
          thread.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    if (selectedCountry) {
      threads = threads.filter(
        (thread) => thread.geographicTags?.country === selectedCountry
      );
    }

    if (selectedRegion) {
      threads = threads.filter(
        (thread) => thread.geographicTags?.region === selectedRegion
      );
    }

    if (selectedIssueArea) {
      threads = threads.filter(
        (thread) => thread.issueArea === selectedIssueArea
      );
    }

    if (filterByLinked !== 'all') {
      threads = threads.filter((thread) => {
        if (!thread.linkedInitiatives) return false;
        return thread.linkedInitiatives.some((li) => {
          if (filterByLinked === 'proposals') return li.type === 'proposal';
          if (filterByLinked === 'asks') return li.type === 'ask';
          if (filterByLinked === 'daos') return li.type === 'dao';
          return false;
        });
      });
    }

    return threads.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }, [searchQuery, selectedCategory, selectedCountry, selectedRegion, selectedIssueArea, filterByLinked]);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return `${Math.floor(diffDays / 30)}mo ago`;
  };

  const handleThreadPress = (threadId: string) => {
    router.push(`/discussion/${threadId}`);
  };

  const handleCreateThread = () => {
    console.log('Creating new thread:', {
      title: newThreadTitle,
      content: newThreadContent,
      category: newThreadCategory,
      tags: newThreadTags.split(',').map((t) => t.trim()),
      geographicTags: {
        country: newThreadCountry,
        region: newThreadRegion,
      },
      issueArea: newThreadIssueArea,
      attachments: newThreadAttachments,
      linkedInitiatives: newThreadLinkedInitiatives,
    });
    setShowNewThreadModal(false);
    setNewThreadTitle('');
    setNewThreadContent('');
    setNewThreadTags('');
    setNewThreadCountry(null);
    setNewThreadRegion(null);
    setNewThreadIssueArea(null);
    setNewThreadAttachments([]);
    setNewThreadLinkedInitiatives([]);
  };

  const handleAddAttachment = (type: 'document' | 'photo' | 'video' | 'audio') => {
    const mockAttachment: Attachment = {
      id: `att-${Date.now()}`,
      type,
      name: `New_${type}_${Date.now().toString().slice(-4)}.${type === 'document' ? 'pdf' : type === 'photo' ? 'jpg' : type === 'video' ? 'mp4' : 'mp3'}`,
      url: '#',
      size: type === 'video' ? '45.2 MB' : type === 'audio' ? '12.4 MB' : '1.2 MB',
      mimeType: type === 'document' ? 'application/pdf' : type === 'photo' ? 'image/jpeg' : type === 'video' ? 'video/mp4' : 'audio/mpeg',
    };
    setNewThreadAttachments(prev => [...prev, mockAttachment]);
    setShowAttachmentOptions(false);
    console.log('Attachment added:', mockAttachment);
  };

  const handleRemoveAttachment = (attachmentId: string) => {
    setNewThreadAttachments(prev => prev.filter(a => a.id !== attachmentId));
  };

  const handleAddLinkedInitiative = (type: 'proposal' | 'ask' | 'dao') => {
    const mockInitiative: LinkedInitiative = {
      id: `init-${Date.now()}`,
      type,
      title: type === 'proposal' ? 'Climate Research Proposal' : type === 'ask' ? 'Equipment Funding Request' : 'Climate Adaptation DAO',
      status: type === 'proposal' ? 'Under Review' : type === 'ask' ? 'Active' : 'Active',
    };
    setNewThreadLinkedInitiatives(prev => [...prev, mockInitiative]);
    setShowLinkOptions(false);
    console.log('Initiative linked:', mockInitiative);
  };

  const handleRemoveLinkedInitiative = (initiativeId: string) => {
    setNewThreadLinkedInitiatives(prev => prev.filter(i => i.id !== initiativeId));
  };

  const getAttachmentIcon = (type: string) => {
    switch (type) {
      case 'document': return <FileText size={14} color={Colors.primary} />;
      case 'photo': return <ImageIcon size={14} color="#4CAF50" />;
      case 'video': return <Video size={14} color={Colors.accent} />;
      case 'audio': return <Music size={14} color="#FF9800" />;
      default: return <Paperclip size={14} color={Colors.textMuted} />;
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

  const clearAllFilters = () => {
    setSelectedCountry(null);
    setSelectedRegion(null);
    setSelectedIssueArea(null);
    setFilterByLinked('all');
  };

  const renderCategoryCard = (category: ForumCategory) => (
    <TouchableOpacity
      key={category.id}
      style={[
        styles.categoryCard,
        selectedCategory === category.id && styles.categoryCardSelected,
      ]}
      onPress={() =>
        setSelectedCategory(selectedCategory === category.id ? null : category.id)
      }
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
        {category.name}
      </Text>
      <Text style={styles.categoryStats}>
        {category.threadCount} threads
      </Text>
    </TouchableOpacity>
  );

  const renderThreadCard = (thread: DiscussionThread) => {
    const category = forumCategories.find((c) => c.id === thread.categoryId);

    return (
      <TouchableOpacity
        key={thread.id}
        style={styles.threadCard}
        onPress={() => handleThreadPress(thread.id)}
        activeOpacity={0.7}
        testID={`thread-${thread.id}`}
      >
        {thread.isPinned && (
          <View style={styles.pinnedBadge}>
            <Pin size={12} color={Colors.accent} />
            <Text style={styles.pinnedText}>Pinned</Text>
          </View>
        )}

        <View style={styles.threadBadgesRow}>
          <KnowledgeTypeBadge type={thread.knowledgeType} variant="compact" />
          {thread.isHighSignal && (
            <View style={styles.highSignalBadge}>
              <TrendingUp size={10} color={Colors.success} />
              <Text style={styles.highSignalText}>High Signal</Text>
            </View>
          )}
          {thread.aiAnalysis && (
            <View style={styles.aiAnalyzedBadge}>
              <Sparkles size={10} color={Colors.primary} />
              <Text style={styles.aiAnalyzedText}>AI Analyzed</Text>
            </View>
          )}
        </View>
        
        <Text style={styles.threadTitle} numberOfLines={2}>
          {thread.title}
        </Text>

        <Text style={styles.threadPreview} numberOfLines={3}>
          {thread.content.replace(/\*\*/g, '').replace(/\n/g, ' ').slice(0, 150)}...
        </Text>

        <View style={styles.threadMeta}>
          {thread.geographicTags?.country && (
            <View style={styles.geoTag}>
              <MapPin size={10} color={Colors.primary} />
              <Text style={styles.geoTagText}>{thread.geographicTags.country}</Text>
            </View>
          )}
          {thread.issueArea && (
            <View style={styles.issueTag}>
              <Text style={styles.issueTagText}>{thread.issueArea}</Text>
            </View>
          )}
          {thread.linkedInitiatives && thread.linkedInitiatives.length > 0 && (
            <View style={styles.linkedTag}>
              <Link2 size={10} color={Colors.accent} />
              <Text style={styles.linkedTagText}>{thread.linkedInitiatives.length} linked</Text>
            </View>
          )}
          {thread.attachments && thread.attachments.length > 0 && (
            <View style={styles.attachmentIndicator}>
              <Paperclip size={10} color={Colors.textMuted} />
              <Text style={styles.attachmentIndicatorText}>{thread.attachments.length}</Text>
            </View>
          )}
        </View>

        <View style={styles.threadTags}>
          {thread.tags.slice(0, 3).map((tag) => (
            <View key={tag} style={styles.threadTag}>
              <Text style={styles.threadTagText}>{tag}</Text>
            </View>
          ))}
          {category && (
            <View style={[styles.categoryBadge, { backgroundColor: category.color + '20' }]}>
              <Text style={[styles.categoryBadgeText, { color: category.color }]}>
                {category.name.split(' ')[0]}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.threadFooter}>
          <View style={styles.authorInfo}>
            <Image source={{ uri: thread.author.avatar }} style={styles.authorAvatar} />
            <View>
              <Text style={styles.authorName}>{thread.author.name}</Text>
              <View style={styles.authorMeta}>
                <Star size={10} color={Colors.accent} />
                <Text style={styles.authorScore}>{thread.author.credibilityScore}</Text>
                <Text style={styles.threadTime}>· {formatTimeAgo(thread.updatedAt)}</Text>
              </View>
            </View>
          </View>

          <View style={styles.threadStats}>
            <View style={styles.stat}>
              <ArrowUp size={14} color={Colors.primary} />
              <Text style={styles.statText}>{thread.upvotes}</Text>
            </View>
            <View style={styles.stat}>
              <MessageSquare size={14} color={Colors.textMuted} />
              <Text style={styles.statText}>{thread.replyCount}</Text>
            </View>
            {thread.endorsements && thread.endorsements.length > 0 && (
              <View style={styles.stat}>
                <Award size={14} color={Colors.accent} />
                <Text style={styles.statText}>{thread.endorsements.length}</Text>
              </View>
            )}
          </View>
        </View>

        <ChevronRight
          size={18}
          color={Colors.textMuted}
          style={styles.threadChevron}
        />
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
          <Text style={styles.headerTitle}>Discussions</Text>
          <Text style={styles.headerSubtitle}>Research-level dialogue</Text>
        </View>
        <TouchableOpacity
          style={styles.newThreadButton}
          onPress={() => setShowNewThreadModal(true)}
          testID="new-thread-button"
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
              placeholder="Search discussions..."
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

            <Text style={styles.filterLabel}>Issue Area</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
              <TouchableOpacity
                style={[styles.filterChip, !selectedIssueArea && styles.filterChipActive]}
                onPress={() => setSelectedIssueArea(null)}
              >
                <Text style={[styles.filterChipText, !selectedIssueArea && styles.filterChipTextActive]}>All</Text>
              </TouchableOpacity>
              {issueAreas.slice(0, 6).map((issue) => (
                <TouchableOpacity
                  key={issue}
                  style={[styles.filterChip, selectedIssueArea === issue && styles.filterChipActive]}
                  onPress={() => setSelectedIssueArea(selectedIssueArea === issue ? null : issue)}
                >
                  <Text style={[styles.filterChipText, selectedIssueArea === issue && styles.filterChipTextActive]}>{issue}</Text>
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
        <Text style={styles.sectionTitle}>Forums</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesRow}
          contentContainerStyle={styles.categoriesContent}
        >
          {forumCategories.map(renderCategoryCard)}
        </ScrollView>

        <View style={styles.threadsHeader}>
          <Text style={styles.sectionTitle}>
            {selectedCategory
              ? forumCategories.find((c) => c.id === selectedCategory)?.name
              : 'Recent Discussions'}
          </Text>
          <Text style={styles.threadCount}>{filteredThreads.length} threads</Text>
        </View>

        {filteredThreads.map(renderThreadCard)}

        {filteredThreads.length === 0 && (
          <View style={styles.emptyState}>
            <MessageSquare size={48} color={Colors.textMuted} />
            <Text style={styles.emptyStateTitle}>No discussions found</Text>
            <Text style={styles.emptyStateText}>
              {searchQuery
                ? 'Try a different search term'
                : 'Be the first to start a discussion in this forum'}
            </Text>
          </View>
        )}
      </ScrollView>

      <Modal
        visible={showNewThreadModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowNewThreadModal(false)}
      >
        <View style={[styles.modalContainer, { paddingTop: insets.top }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowNewThreadModal(false)}>
              <X size={24} color={Colors.text} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>New Discussion</Text>
            <TouchableOpacity
              style={[
                styles.postButton,
                (!newThreadTitle || !newThreadContent) && styles.postButtonDisabled,
              ]}
              onPress={handleCreateThread}
              disabled={!newThreadTitle || !newThreadContent}
            >
              <Text
                style={[
                  styles.postButtonText,
                  (!newThreadTitle || !newThreadContent) && styles.postButtonTextDisabled,
                ]}
              >
                Post
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.inputLabel}>Forum</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categorySelector}
            >
              {forumCategories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categorySelectorItem,
                    newThreadCategory === cat.id && styles.categorySelectorItemSelected,
                  ]}
                  onPress={() => setNewThreadCategory(cat.id)}
                >
                  <Text
                    style={[
                      styles.categorySelectorText,
                      newThreadCategory === cat.id && styles.categorySelectorTextSelected,
                    ]}
                  >
                    {cat.name.split('&')[0].trim()}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.inputLabel}>Title</Text>
            <TextInput
              style={styles.titleInput}
              placeholder="What would you like to discuss?"
              placeholderTextColor={Colors.textMuted}
              value={newThreadTitle}
              onChangeText={setNewThreadTitle}
              maxLength={150}
            />

            <Text style={styles.inputLabel}>Content</Text>
            <TextInput
              style={styles.contentInput}
              placeholder="Share your thoughts, research findings, or questions..."
              placeholderTextColor={Colors.textMuted}
              value={newThreadContent}
              onChangeText={setNewThreadContent}
              multiline
              textAlignVertical="top"
            />

            <Text style={styles.inputLabel}>Tags (comma separated)</Text>
            <TextInput
              style={styles.tagsInput}
              placeholder="e.g., Climate, Research, Nigeria"
              placeholderTextColor={Colors.textMuted}
              value={newThreadTags}
              onChangeText={setNewThreadTags}
            />

            <Text style={styles.inputLabel}>Geographic Tags</Text>
            <View style={styles.geoTagsContainer}>
              <View style={styles.geoTagColumn}>
                <Text style={styles.geoTagLabel}>Country</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.geoTagScroll}>
                  <TouchableOpacity
                    style={[styles.geoTagChip, !newThreadCountry && styles.geoTagChipActive]}
                    onPress={() => setNewThreadCountry(null)}
                  >
                    <Text style={[styles.geoTagChipText, !newThreadCountry && styles.geoTagChipTextActive]}>None</Text>
                  </TouchableOpacity>
                  {countries.slice(0, 10).map((country) => (
                    <TouchableOpacity
                      key={country}
                      style={[styles.geoTagChip, newThreadCountry === country && styles.geoTagChipActive]}
                      onPress={() => setNewThreadCountry(newThreadCountry === country ? null : country)}
                    >
                      <MapPin size={10} color={newThreadCountry === country ? Colors.background : Colors.textMuted} />
                      <Text style={[styles.geoTagChipText, newThreadCountry === country && styles.geoTagChipTextActive]}>{country}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
              <View style={styles.geoTagColumn}>
                <Text style={styles.geoTagLabel}>Region</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.geoTagScroll}>
                  <TouchableOpacity
                    style={[styles.geoTagChip, !newThreadRegion && styles.geoTagChipActive]}
                    onPress={() => setNewThreadRegion(null)}
                  >
                    <Text style={[styles.geoTagChipText, !newThreadRegion && styles.geoTagChipTextActive]}>None</Text>
                  </TouchableOpacity>
                  {regions.map((region) => (
                    <TouchableOpacity
                      key={region}
                      style={[styles.geoTagChip, newThreadRegion === region && styles.geoTagChipActive]}
                      onPress={() => setNewThreadRegion(newThreadRegion === region ? null : region)}
                    >
                      <Globe size={10} color={newThreadRegion === region ? Colors.background : Colors.textMuted} />
                      <Text style={[styles.geoTagChipText, newThreadRegion === region && styles.geoTagChipTextActive]}>{region}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            <Text style={styles.inputLabel}>Issue Area</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.issueAreaScroll}>
              <TouchableOpacity
                style={[styles.issueAreaChip, !newThreadIssueArea && styles.issueAreaChipActive]}
                onPress={() => setNewThreadIssueArea(null)}
              >
                <Text style={[styles.issueAreaChipText, !newThreadIssueArea && styles.issueAreaChipTextActive]}>None</Text>
              </TouchableOpacity>
              {issueAreas.map((issue) => (
                <TouchableOpacity
                  key={issue}
                  style={[styles.issueAreaChip, newThreadIssueArea === issue && styles.issueAreaChipActive]}
                  onPress={() => setNewThreadIssueArea(newThreadIssueArea === issue ? null : issue)}
                >
                  <Text style={[styles.issueAreaChipText, newThreadIssueArea === issue && styles.issueAreaChipTextActive]}>{issue}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.inputLabel}>Attachments</Text>
            <View style={styles.attachmentsContainer}>
              {newThreadAttachments.map((attachment) => (
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
                <ChevronDown size={14} color={Colors.primary} style={showAttachmentOptions && { transform: [{ rotate: '180deg' }] }} />
              </TouchableOpacity>
              {showAttachmentOptions && (
                <View style={styles.attachmentOptionsRow}>
                  <TouchableOpacity style={styles.attachmentOption} onPress={() => handleAddAttachment('document')}>
                    <View style={[styles.attachmentOptionIcon, { backgroundColor: Colors.primary + '20' }]}>
                      <FileText size={16} color={Colors.primary} />
                    </View>
                    <Text style={styles.attachmentOptionText}>Document</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.attachmentOption} onPress={() => handleAddAttachment('photo')}>
                    <View style={[styles.attachmentOptionIcon, { backgroundColor: '#4CAF50' + '20' }]}>
                      <ImageIcon size={16} color="#4CAF50" />
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
                </View>
              )}
            </View>

            <Text style={styles.inputLabel}>Link to Governance</Text>
            <View style={styles.linkedContainer}>
              {newThreadLinkedInitiatives.map((initiative) => (
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
                <ChevronDown size={14} color={Colors.primary} style={showLinkOptions && { transform: [{ rotate: '180deg' }] }} />
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
                      <ExternalLink size={16} color={Colors.accent} />
                    </View>
                    <Text style={styles.linkOptionText}>Ask</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.linkOption} onPress={() => handleAddLinkedInitiative('dao')}>
                    <View style={[styles.linkOptionIcon, { backgroundColor: '#4CAF50' + '20' }]}>
                      <Vote size={16} color="#4CAF50" />
                    </View>
                    <Text style={styles.linkOptionText}>DAO</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <View style={styles.guidelines}>
              <Text style={styles.guidelinesTitle}>Community Guidelines</Text>
              <Text style={styles.guidelinesText}>
                • Be respectful and constructive{'\n'}
                • Support claims with evidence or citations{'\n'}
                • Stay on topic and contribute meaningfully{'\n'}
                • No promotional content without disclosure
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
  newThreadButton: {
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
    width: 120,
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
    width: 48,
    height: 48,
    borderRadius: 24,
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
  categoryStats: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  threadsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  threadCount: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  threadCard: {
    backgroundColor: Colors.card,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pinnedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  pinnedText: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: Colors.accent,
  },
  threadTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 8,
    paddingRight: 24,
  },
  threadPreview: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  threadMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  geoTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primary + '15',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  geoTagText: {
    fontSize: 10,
    fontWeight: '600' as const,
    color: Colors.primary,
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
  threadTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 14,
  },
  threadTag: {
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  threadTagText: {
    fontSize: 11,
    fontWeight: '500' as const,
    color: Colors.textMuted,
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
  threadFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  authorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  authorName: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  authorMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  authorScore: {
    fontSize: 10,
    fontWeight: '600' as const,
    color: Colors.accent,
  },
  threadTime: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  threadStats: {
    flexDirection: 'row',
    gap: 12,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: Colors.textMuted,
  },
  threadChevron: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  emptyState: {
    alignItems: 'center',
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
    lineHeight: 20,
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
  postButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  postButtonDisabled: {
    backgroundColor: Colors.border,
  },
  postButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.background,
  },
  postButtonTextDisabled: {
    color: Colors.textMuted,
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
    marginBottom: 8,
    marginTop: 16,
  },
  categorySelector: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  categorySelectorItem: {
    backgroundColor: Colors.card,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categorySelectorItemSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
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
    padding: 14,
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  contentInput: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 200,
  },
  tagsInput: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  guidelines: {
    backgroundColor: Colors.cardElevated,
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    marginBottom: 40,
  },
  guidelinesTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  guidelinesText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  geoTagsContainer: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
  },
  geoTagColumn: {
    gap: 6,
  },
  geoTagLabel: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  geoTagScroll: {
    flexDirection: 'row',
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
    fontWeight: '500' as const,
    color: Colors.textMuted,
  },
  geoTagChipTextActive: {
    color: Colors.background,
  },
  issueAreaScroll: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  issueAreaChip: {
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    marginRight: 6,
  },
  issueAreaChipActive: {
    backgroundColor: Colors.accent,
  },
  issueAreaChipText: {
    fontSize: 11,
    fontWeight: '500' as const,
    color: Colors.textMuted,
  },
  issueAreaChipTextActive: {
    color: Colors.background,
  },
  attachmentsContainer: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 8,
  },
  attachmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 8,
    padding: 10,
    gap: 10,
  },
  attachmentItemIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.background,
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
  },
  attachmentItemSize: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 2,
  },
  attachmentItemRemove: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.error + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addAttachmentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.primary + '40',
    borderRadius: 8,
    borderStyle: 'dashed',
  },
  addAttachmentText: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: Colors.primary,
  },
  attachmentOptionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 10,
    padding: 12,
    marginTop: 4,
  },
  attachmentOption: {
    alignItems: 'center',
    gap: 6,
  },
  attachmentOptionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  attachmentOptionText: {
    fontSize: 10,
    fontWeight: '500' as const,
    color: Colors.textSecondary,
  },
  linkedContainer: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 8,
  },
  linkedItemNew: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 8,
    padding: 10,
    gap: 10,
  },
  linkedItemIcon: {
    width: 28,
    height: 28,
    borderRadius: 6,
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
    marginTop: 1,
  },
  linkedItemRemove: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.error + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addLinkedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.primary + '40',
    borderRadius: 8,
    borderStyle: 'dashed',
  },
  addLinkedText: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: Colors.primary,
  },
  linkOptionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 10,
    padding: 12,
    marginTop: 4,
  },
  linkOption: {
    alignItems: 'center',
    gap: 6,
  },
  linkOptionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkOptionText: {
    fontSize: 10,
    fontWeight: '500' as const,
    color: Colors.textSecondary,
  },
  threadBadgesRow: {
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
});
