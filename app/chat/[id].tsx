import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Animated,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Phone,
  Video,
  MoreVertical,
  Send,
  Plus,
  Mic,
  ImageIcon,
  FileText,
  Camera,
  Lock,
  Play,
  Download,
  Check,
  CheckCheck,
  X,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { conversations, chatMessages, Message } from '@/mocks/messages';

export default function ChatScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);
  const [message, setMessage] = useState('');
  const [showAttachments, setShowAttachments] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const attachmentAnim = useRef(new Animated.Value(0)).current;

  const conversation = conversations.find((c) => c.id === id);
  const participant = conversation?.participants[0];
  const isGroup = (conversation?.participants.length ?? 0) > 1;

  useEffect(() => {
    if (id && chatMessages[id]) {
      setMessages(chatMessages[id]);
    }
  }, [id]);

  useEffect(() => {
    Animated.timing(attachmentAnim, {
      toValue: showAttachments ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [showAttachments, attachmentAnim]);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: 'current-user',
      text: message.trim(),
      timestamp: new Date().toISOString(),
      type: 'text',
      read: false,
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage('');
    console.log('Message sent:', newMessage);
  };

  const handleVoiceCall = () => {
    Alert.alert(
      'Voice Call',
      `Start voice call with ${participant?.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => console.log('Starting voice call...') },
      ]
    );
  };

  const handleVideoCall = () => {
    Alert.alert(
      'Video Call',
      `Start video call with ${participant?.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => console.log('Starting video call...') },
      ]
    );
  };

  const handleAttachment = (type: string) => {
    setShowAttachments(false);
    console.log(`Uploading ${type}...`);
    Alert.alert(
      'Upload',
      `Select ${type} to upload`,
      [{ text: 'OK' }]
    );
  };

  const formatMessageTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const formatDateHeader = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
      });
    }
  };

  const shouldShowDateHeader = (index: number) => {
    if (index === 0) return true;
    const currentDate = new Date(messages[index].timestamp).toDateString();
    const prevDate = new Date(messages[index - 1].timestamp).toDateString();
    return currentDate !== prevDate;
  };

  const renderMessage = (msg: Message, index: number) => {
    const isCurrentUser = msg.senderId === 'current-user';
    const sender = conversation?.participants.find((p) => p.id === msg.senderId);

    return (
      <View key={msg.id}>
        {shouldShowDateHeader(index) && (
          <View style={styles.dateHeader}>
            <Text style={styles.dateHeaderText}>
              {formatDateHeader(msg.timestamp)}
            </Text>
          </View>
        )}

        <View
          style={[
            styles.messageRow,
            isCurrentUser && styles.messageRowRight,
          ]}
        >
          {!isCurrentUser && isGroup && (
            <Image
              source={{ uri: sender?.avatar }}
              style={styles.messageAvatar}
            />
          )}

          <View
            style={[
              styles.messageBubble,
              isCurrentUser ? styles.messageBubbleSent : styles.messageBubbleReceived,
            ]}
          >
            {!isCurrentUser && isGroup && (
              <Text style={styles.senderName}>{sender?.name}</Text>
            )}

            {msg.type === 'text' && (
              <Text
                style={[
                  styles.messageText,
                  isCurrentUser && styles.messageTextSent,
                ]}
              >
                {msg.text}
              </Text>
            )}

            {msg.type === 'file' && (
              <TouchableOpacity style={styles.fileAttachment}>
                <View style={styles.fileIcon}>
                  <FileText size={24} color={Colors.primary} />
                </View>
                <View style={styles.fileInfo}>
                  <Text style={styles.fileName} numberOfLines={1}>
                    {msg.fileName}
                  </Text>
                  <Text style={styles.fileSize}>{msg.fileSize}</Text>
                </View>
                <TouchableOpacity style={styles.downloadButton}>
                  <Download size={18} color={Colors.primary} />
                </TouchableOpacity>
              </TouchableOpacity>
            )}

            {msg.type === 'image' && (
              <TouchableOpacity style={styles.imageAttachment}>
                <Image
                  source={{ uri: msg.fileUrl }}
                  style={styles.attachedImage}
                />
              </TouchableOpacity>
            )}

            {msg.type === 'audio' && (
              <View style={styles.audioAttachment}>
                <TouchableOpacity style={styles.audioPlayButton}>
                  <Play size={18} color={Colors.background} />
                </TouchableOpacity>
                <View style={styles.audioWaveform}>
                  {[...Array(20)].map((_, i) => (
                    <View
                      key={i}
                      style={[
                        styles.audioBar,
                        { height: Math.random() * 20 + 8 },
                      ]}
                    />
                  ))}
                </View>
                <Text style={styles.audioDuration}>0:45</Text>
              </View>
            )}

            <View style={styles.messageFooter}>
              <Text
                style={[
                  styles.messageTime,
                  isCurrentUser && styles.messageTimeSent,
                ]}
              >
                {formatMessageTime(msg.timestamp)}
              </Text>
              {isCurrentUser && (
                <View style={styles.readStatus}>
                  {msg.read ? (
                    <CheckCheck size={14} color={Colors.primary} />
                  ) : (
                    <Check size={14} color={Colors.textMuted} />
                  )}
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
    );
  };

  if (!conversation) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>Conversation not found</Text>
        <TouchableOpacity
          style={styles.backButtonLarge}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

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

        <TouchableOpacity
          style={styles.headerProfile}
          onPress={() => participant && router.push(`/user/${participant.id}`)}
        >
          {isGroup ? (
            <View style={styles.groupAvatarSmall}>
              <Image
                source={{ uri: conversation.participants[0].avatar }}
                style={styles.groupAvatarImg}
              />
              <Image
                source={{ uri: conversation.participants[1].avatar }}
                style={[styles.groupAvatarImg, styles.groupAvatarOverlapSmall]}
              />
            </View>
          ) : (
            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: participant?.avatar }}
                style={styles.headerAvatar}
              />
              {participant?.online && <View style={styles.onlineIndicator} />}
            </View>
          )}
          <View style={styles.headerInfo}>
            <View style={styles.headerNameRow}>
              <Text style={styles.headerName} numberOfLines={1}>
                {isGroup
                  ? conversation.participants.map((p) => p.name.split(' ')[0]).join(', ')
                  : participant?.name}
              </Text>
              <Lock size={12} color={Colors.success} />
            </View>
            <Text style={styles.headerStatus}>
              {isGroup
                ? `${conversation.participants.length} members`
                : participant?.online
                ? 'Online'
                : 'Offline'}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerActionButton}
            onPress={handleVoiceCall}
            testID="voice-call-button"
          >
            <Phone size={20} color={Colors.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerActionButton}
            onPress={handleVideoCall}
            testID="video-call-button"
          >
            <Video size={20} color={Colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerActionButton}>
            <MoreVertical size={20} color={Colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {conversation.tag && (
        <View style={[styles.tagBanner, { backgroundColor: conversation.tag.color + '15' }]}>
          <View style={[styles.tagDot, { backgroundColor: conversation.tag.color }]} />
          <Text style={[styles.tagBannerText, { color: conversation.tag.color }]}>
            {conversation.tag.type.charAt(0).toUpperCase() + conversation.tag.type.slice(1)}: {conversation.tag.name}
          </Text>
        </View>
      )}

      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg, index) => renderMessage(msg, index))}
      </ScrollView>

      {showAttachments && (
        <Animated.View
          style={[
            styles.attachmentMenu,
            {
              opacity: attachmentAnim,
              transform: [
                {
                  translateY: attachmentAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.attachmentOption}
            onPress={() => handleAttachment('document')}
          >
            <View style={[styles.attachmentIcon, { backgroundColor: '#4CAF50' }]}>
              <FileText size={22} color={Colors.text} />
            </View>
            <Text style={styles.attachmentLabel}>Document</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.attachmentOption}
            onPress={() => handleAttachment('photo')}
          >
            <View style={[styles.attachmentIcon, { backgroundColor: '#2196F3' }]}>
              <ImageIcon size={22} color={Colors.text} />
            </View>
            <Text style={styles.attachmentLabel}>Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.attachmentOption}
            onPress={() => handleAttachment('camera')}
          >
            <View style={[styles.attachmentIcon, { backgroundColor: '#E91E63' }]}>
              <Camera size={22} color={Colors.text} />
            </View>
            <Text style={styles.attachmentLabel}>Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.attachmentOption}
            onPress={() => handleAttachment('audio')}
          >
            <View style={[styles.attachmentIcon, { backgroundColor: '#FF9800' }]}>
              <Mic size={22} color={Colors.text} />
            </View>
            <Text style={styles.attachmentLabel}>Audio</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.attachmentOption}
            onPress={() => handleAttachment('video')}
          >
            <View style={[styles.attachmentIcon, { backgroundColor: '#9C27B0' }]}>
              <Video size={22} color={Colors.text} />
            </View>
            <Text style={styles.attachmentLabel}>Video</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      <View style={[styles.inputContainer, { paddingBottom: insets.bottom + 8 }]}>
        <TouchableOpacity
          style={[
            styles.attachButton,
            showAttachments && styles.attachButtonActive,
          ]}
          onPress={() => setShowAttachments(!showAttachments)}
        >
          {showAttachments ? (
            <X size={22} color={Colors.text} />
          ) : (
            <Plus size={22} color={Colors.text} />
          )}
        </TouchableOpacity>

        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            placeholder="Type a message..."
            placeholderTextColor={Colors.textMuted}
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={2000}
          />
        </View>

        {message.trim() ? (
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSend}
            testID="send-button"
          >
            <Send size={20} color={Colors.background} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              styles.micButton,
              isRecording && styles.micButtonRecording,
            ]}
            onPressIn={() => setIsRecording(true)}
            onPressOut={() => {
              setIsRecording(false);
              console.log('Voice recording ended');
            }}
            testID="mic-button"
          >
            <Mic size={20} color={isRecording ? Colors.background : Colors.text} />
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  backButtonLarge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 12,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerProfile: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  avatarContainer: {
    position: 'relative',
  },
  headerAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.success,
    borderWidth: 2,
    borderColor: Colors.background,
  },
  groupAvatarSmall: {
    width: 42,
    height: 42,
    position: 'relative',
  },
  groupAvatarImg: {
    width: 28,
    height: 28,
    borderRadius: 14,
    position: 'absolute',
    top: 0,
    left: 0,
    borderWidth: 2,
    borderColor: Colors.background,
  },
  groupAvatarOverlapSmall: {
    top: 12,
    left: 12,
  },
  headerInfo: {
    marginLeft: 10,
    flex: 1,
  },
  headerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerName: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
    maxWidth: 150,
  },
  headerStatus: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 4,
  },
  headerActionButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  tagDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  tagBannerText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  dateHeader: {
    alignItems: 'center',
    marginVertical: 16,
  },
  dateHeaderText: {
    fontSize: 12,
    color: Colors.textMuted,
    backgroundColor: Colors.card,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-end',
  },
  messageRowRight: {
    flexDirection: 'row-reverse',
  },
  messageAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
  },
  messageBubble: {
    maxWidth: '78%',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  messageBubbleReceived: {
    backgroundColor: Colors.card,
    borderBottomLeftRadius: 4,
  },
  messageBubbleSent: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  senderName: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.primary,
    marginBottom: 4,
  },
  messageText: {
    fontSize: 15,
    color: Colors.text,
    lineHeight: 20,
  },
  messageTextSent: {
    color: Colors.background,
  },
  fileAttachment: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    padding: 10,
    gap: 10,
    minWidth: 200,
  },
  fileIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 2,
  },
  fileSize: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  downloadButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageAttachment: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 4,
  },
  attachedImage: {
    width: 220,
    height: 160,
    borderRadius: 12,
  },
  audioAttachment: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minWidth: 200,
  },
  audioPlayButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  audioWaveform: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    height: 32,
  },
  audioBar: {
    width: 3,
    backgroundColor: Colors.textMuted,
    borderRadius: 1.5,
  },
  audioDuration: {
    fontSize: 11,
    color: Colors.textMuted,
    marginLeft: 4,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
    gap: 4,
  },
  messageTime: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  messageTimeSent: {
    color: Colors.backgroundSecondary,
  },
  readStatus: {
    marginLeft: 2,
  },
  attachmentMenu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.card,
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  attachmentOption: {
    alignItems: 'center',
    gap: 6,
  },
  attachmentIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  attachmentLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingTop: 10,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 8,
  },
  attachButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  attachButtonActive: {
    backgroundColor: Colors.primary,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 21,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  textInput: {
    fontSize: 15,
    color: Colors.text,
    maxHeight: 100,
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micButtonRecording: {
    backgroundColor: Colors.error,
  },
});
