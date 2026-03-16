import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Search,
  Plus,
  Lock,
  Phone,
  Video,
  Check,
  CheckCheck,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { conversations, tagFilters } from '@/mocks/messages';

export default function MessagesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredConversations = useMemo(() => {
    return conversations.filter((conv) => {
      const matchesSearch = conv.participants.some((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      ) || conv.tag?.name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter = activeFilter === 'all' || conv.tag?.type === activeFilter;

      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, activeFilter]);

  const totalUnread = conversations.reduce((acc, conv) => acc + conv.unreadCount, 0);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const getMessagePreview = (conv: typeof conversations[0]) => {
    const msg = conv.lastMessage;
    const isCurrentUser = msg.senderId === 'current-user';
    const prefix = isCurrentUser ? 'You: ' : '';

    switch (msg.type) {
      case 'file':
        return `${prefix}📎 ${msg.fileName}`;
      case 'image':
        return `${prefix}📷 Photo`;
      case 'audio':
        return `${prefix}🎵 Voice message`;
      case 'video':
        return `${prefix}🎬 Video`;
      default:
        return `${prefix}${msg.text}`;
    }
  };

  const getParticipantNames = (conv: typeof conversations[0]) => {
    if (conv.participants.length === 1) {
      return conv.participants[0].name;
    }
    return conv.participants.map((p) => p.name.split(' ')[0]).join(', ');
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
          <Text style={styles.headerTitle}>Messages</Text>
          {totalUnread > 0 && (
            <View style={styles.totalUnreadBadge}>
              <Text style={styles.totalUnreadText}>{totalUnread}</Text>
            </View>
          )}
        </View>
        <TouchableOpacity
          style={styles.newMessageButton}
          testID="new-message-button"
          onPress={() => router.push('/chat/compose')}
        >
          <Plus size={22} color={Colors.background} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={18} color={Colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search conversations..."
            placeholderTextColor={Colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {tagFilters.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterPill,
                activeFilter === filter.id && styles.filterPillActive,
                activeFilter === filter.id && { backgroundColor: filter.color },
              ]}
              onPress={() => setActiveFilter(filter.id)}
            >
              <Text
                style={[
                  styles.filterPillText,
                  activeFilter === filter.id && styles.filterPillTextActive,
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.conversationList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.conversationListContent}
      >
        {filteredConversations.map((conv) => (
          <TouchableOpacity
            key={conv.id}
            style={styles.conversationItem}
            onPress={() => router.push(`/chat/${conv.id}`)}
            activeOpacity={0.7}
            testID={`conversation-${conv.id}`}
          >
            <View style={styles.avatarSection}>
              {conv.participants.length === 1 ? (
                <View style={styles.singleAvatarContainer}>
                  <Image
                    source={{ uri: conv.participants[0].avatar }}
                    style={styles.avatar}
                  />
                  {conv.participants[0].online && (
                    <View style={styles.onlineIndicator} />
                  )}
                </View>
              ) : (
                <View style={styles.groupAvatarContainer}>
                  <Image
                    source={{ uri: conv.participants[0].avatar }}
                    style={styles.groupAvatar}
                  />
                  <Image
                    source={{ uri: conv.participants[1].avatar }}
                    style={[styles.groupAvatar, styles.groupAvatarOverlap]}
                  />
                </View>
              )}
            </View>

            <View style={styles.conversationContent}>
              <View style={styles.conversationHeader}>
                <View style={styles.nameContainer}>
                  <Text
                    style={[
                      styles.conversationName,
                      conv.unreadCount > 0 && styles.conversationNameUnread,
                    ]}
                    numberOfLines={1}
                  >
                    {getParticipantNames(conv)}
                  </Text>
                  {conv.encrypted && (
                    <Lock size={12} color={Colors.success} style={styles.lockIcon} />
                  )}
                </View>
                <Text style={styles.conversationTime}>
                  {formatTime(conv.lastMessage.timestamp)}
                </Text>
              </View>

              {conv.tag && (
                <View style={[styles.tagBadge, { backgroundColor: conv.tag.color + '20' }]}>
                  <View style={[styles.tagDot, { backgroundColor: conv.tag.color }]} />
                  <Text style={[styles.tagText, { color: conv.tag.color }]}>
                    {conv.tag.name}
                  </Text>
                </View>
              )}

              <View style={styles.messagePreviewRow}>
                <Text
                  style={[
                    styles.messagePreview,
                    conv.unreadCount > 0 && styles.messagePreviewUnread,
                  ]}
                  numberOfLines={1}
                >
                  {getMessagePreview(conv)}
                </Text>
                <View style={styles.messageStatus}>
                  {conv.lastMessage.senderId === 'current-user' && (
                    conv.lastMessage.read ? (
                      <CheckCheck size={16} color={Colors.primary} />
                    ) : (
                      <Check size={16} color={Colors.textMuted} />
                    )
                  )}
                  {conv.unreadCount > 0 && (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadBadgeText}>{conv.unreadCount}</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>

            <View style={styles.quickActions}>
              <TouchableOpacity style={styles.quickActionButton} testID={`call-${conv.id}`}>
                <Phone size={16} color={Colors.textSecondary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickActionButton} testID={`video-${conv.id}`}>
                <Video size={16} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}

        {filteredConversations.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No conversations found</Text>
            <Text style={styles.emptyStateSubtext}>
              Try adjusting your search or filters
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={[styles.encryptionBanner, { paddingBottom: insets.bottom + 12 }]}>
        <Lock size={14} color={Colors.success} />
        <Text style={styles.encryptionText}>
          All messages are end-to-end encrypted
        </Text>
      </View>
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
    paddingBottom: 12,
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  totalUnreadBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  totalUnreadText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: Colors.background,
  },
  newMessageButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
  },
  filterContainer: {
    marginBottom: 8,
  },
  filterScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 8,
  },
  filterPillActive: {
    borderColor: 'transparent',
  },
  filterPillText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  filterPillTextActive: {
    color: Colors.background,
  },
  conversationList: {
    flex: 1,
  },
  conversationListContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  avatarSection: {
    marginRight: 12,
  },
  singleAvatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.success,
    borderWidth: 2,
    borderColor: Colors.card,
  },
  groupAvatarContainer: {
    width: 52,
    height: 52,
    position: 'relative',
  },
  groupAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    position: 'absolute',
    top: 0,
    left: 0,
    borderWidth: 2,
    borderColor: Colors.card,
  },
  groupAvatarOverlap: {
    top: 14,
    left: 14,
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  conversationName: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
    flexShrink: 1,
  },
  conversationNameUnread: {
    fontWeight: '700' as const,
  },
  lockIcon: {
    marginLeft: 6,
  },
  conversationTime: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  tagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 6,
    gap: 4,
  },
  tagDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600' as const,
  },
  messagePreviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  messagePreview: {
    fontSize: 13,
    color: Colors.textMuted,
    flex: 1,
    marginRight: 8,
  },
  messagePreviewUnread: {
    color: Colors.textSecondary,
    fontWeight: '500' as const,
  },
  messageStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  unreadBadge: {
    backgroundColor: Colors.primary,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadBadgeText: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: Colors.background,
  },
  quickActions: {
    flexDirection: 'column',
    gap: 8,
    marginLeft: 8,
  },
  quickActionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  encryptionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingTop: 12,
    backgroundColor: Colors.backgroundSecondary,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  encryptionText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
});
