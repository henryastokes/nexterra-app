import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import {
  ArrowLeft,
  Send,
  Image as ImageIcon,
  Video,
  Mic,
  FileText,
  Phone,
  VideoIcon,
  X,
  Search,
  Music,
  Paperclip,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { conversations } from '@/mocks/messages';

interface Attachment {
  id: string;
  type: 'image' | 'video' | 'audio' | 'document';
  uri: string;
  name: string;
  size?: string;
}

interface Contact {
  id: string;
  name: string;
  avatar: string;
  role: string;
  online: boolean;
}

const allContacts: Contact[] = conversations.flatMap(conv => 
  conv.participants.map(p => ({
    id: p.id,
    name: p.name,
    avatar: p.avatar,
    role: p.role,
    online: p.online,
  }))
).filter((contact, index, self) => 
  index === self.findIndex(c => c.id === contact.id)
);

export default function ComposeMessageScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [, setIsRecording] = useState(false);
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);

  const filteredContacts = allContacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    !selectedContacts.some(sc => sc.id === contact.id)
  );

  const toggleContactSelection = (contact: Contact) => {
    if (selectedContacts.some(sc => sc.id === contact.id)) {
      setSelectedContacts(selectedContacts.filter(sc => sc.id !== contact.id));
    } else {
      setSelectedContacts([...selectedContacts, contact]);
    }
  };

  const removeSelectedContact = (contactId: string) => {
    setSelectedContacts(selectedContacts.filter(sc => sc.id !== contactId));
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets) {
        const newAttachments: Attachment[] = result.assets.map((asset, index) => ({
          id: `img-${Date.now()}-${index}`,
          type: 'image',
          uri: asset.uri,
          name: asset.fileName || `Image ${attachments.length + index + 1}`,
        }));
        setAttachments([...attachments, ...newAttachments]);
      }
    } catch (error) {
      console.log('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
    setShowAttachmentOptions(false);
  };

  const pickVideo = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsMultipleSelection: false,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const newAttachment: Attachment = {
          id: `vid-${Date.now()}`,
          type: 'video',
          uri: asset.uri,
          name: asset.fileName || `Video ${attachments.length + 1}`,
        };
        setAttachments([...attachments, newAttachment]);
      }
    } catch (error) {
      console.log('Error picking video:', error);
      Alert.alert('Error', 'Failed to pick video');
    }
    setShowAttachmentOptions(false);
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
        multiple: true,
      });

      if (!result.canceled && result.assets) {
        const newAttachments: Attachment[] = result.assets.map((asset, index) => ({
          id: `doc-${Date.now()}-${index}`,
          type: 'document',
          uri: asset.uri,
          name: asset.name || `Document ${attachments.length + index + 1}`,
          size: asset.size ? `${(asset.size / 1024 / 1024).toFixed(2)} MB` : undefined,
        }));
        setAttachments([...attachments, ...newAttachments]);
      }
    } catch (error) {
      console.log('Error picking document:', error);
      Alert.alert('Error', 'Failed to pick document');
    }
    setShowAttachmentOptions(false);
  };

  const pickAudioFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        copyToCacheDirectory: true,
        multiple: true,
      });

      if (!result.canceled && result.assets) {
        const newAttachments: Attachment[] = result.assets.map((asset, index) => ({
          id: `audio-${Date.now()}-${index}`,
          type: 'audio',
          uri: asset.uri,
          name: asset.name || `Audio ${attachments.length + index + 1}`,
          size: asset.size ? `${(asset.size / 1024 / 1024).toFixed(2)} MB` : undefined,
        }));
        setAttachments([...attachments, ...newAttachments]);
      }
    } catch (error) {
      console.log('Error picking audio:', error);
      Alert.alert('Error', 'Failed to pick audio file');
    }
    setShowAttachmentOptions(false);
  };

  const startRecording = () => {
    setIsRecording(true);
    Alert.alert('Recording', 'Voice recording started (simulation)');
    setTimeout(() => {
      setIsRecording(false);
      const newAttachment: Attachment = {
        id: `voice-${Date.now()}`,
        type: 'audio',
        uri: 'voice-recording',
        name: `Voice message ${attachments.length + 1}`,
        size: '0.5 MB',
      };
      setAttachments([...attachments, newAttachment]);
    }, 2000);
    setShowAttachmentOptions(false);
  };

  const removeAttachment = (id: string) => {
    setAttachments(attachments.filter(a => a.id !== id));
  };

  const handleSendMessage = () => {
    if (selectedContacts.length === 0) {
      Alert.alert('Select Recipients', 'Please select at least one recipient');
      return;
    }
    if (!messageText.trim() && attachments.length === 0) {
      Alert.alert('Empty Message', 'Please enter a message or add an attachment');
      return;
    }

    console.log('Sending message to:', selectedContacts.map(c => c.name));
    console.log('Message:', messageText);
    console.log('Attachments:', attachments);

    Alert.alert('Message Sent', 'Your message has been sent successfully', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  const handleCall = (type: 'audio' | 'video') => {
    if (selectedContacts.length === 0) {
      Alert.alert('Select Recipients', 'Please select at least one recipient to call');
      return;
    }
    Alert.alert(
      `${type === 'video' ? 'Video' : 'Audio'} Call`,
      `Starting ${type} call with ${selectedContacts.map(c => c.name).join(', ')}`
    );
  };

  const getAttachmentIcon = (type: Attachment['type']) => {
    switch (type) {
      case 'image':
        return <ImageIcon size={16} color={Colors.primary} />;
      case 'video':
        return <Video size={16} color={Colors.accent} />;
      case 'audio':
        return <Music size={16} color={Colors.success} />;
      case 'document':
        return <FileText size={16} color={Colors.warning} />;
    }
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
        <Text style={styles.headerTitle}>New Message</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerActionButton}
            onPress={() => handleCall('audio')}
            testID="audio-call-button"
          >
            <Phone size={20} color={Colors.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerActionButton}
            onPress={() => handleCall('video')}
            testID="video-call-button"
          >
            <VideoIcon size={20} color={Colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.recipientSection}>
        <Text style={styles.sectionLabel}>To:</Text>
        <View style={styles.selectedContactsContainer}>
          {selectedContacts.map(contact => (
            <View key={contact.id} style={styles.selectedContactChip}>
              <Image source={{ uri: contact.avatar }} style={styles.chipAvatar} />
              <Text style={styles.chipName} numberOfLines={1}>{contact.name.split(' ')[0]}</Text>
              <TouchableOpacity
                onPress={() => removeSelectedContact(contact.id)}
                style={styles.chipRemove}
              >
                <X size={14} color={Colors.textMuted} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={18} color={Colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search contacts..."
            placeholderTextColor={Colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView style={styles.contactList} showsVerticalScrollIndicator={false}>
        {filteredContacts.map(contact => (
          <TouchableOpacity
            key={contact.id}
            style={styles.contactItem}
            onPress={() => toggleContactSelection(contact)}
            testID={`contact-${contact.id}`}
          >
            <View style={styles.contactAvatarContainer}>
              <Image source={{ uri: contact.avatar }} style={styles.contactAvatar} />
              {contact.online && <View style={styles.onlineIndicator} />}
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>{contact.name}</Text>
              <Text style={styles.contactRole}>{contact.role}</Text>
            </View>
            <View style={[
              styles.checkbox,
              selectedContacts.some(sc => sc.id === contact.id) && styles.checkboxSelected
            ]}>
              {selectedContacts.some(sc => sc.id === contact.id) && (
                <View style={styles.checkboxInner} />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {attachments.length > 0 && (
        <View style={styles.attachmentsPreview}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {attachments.map(attachment => (
              <View key={attachment.id} style={styles.attachmentItem}>
                {attachment.type === 'image' ? (
                  <Image source={{ uri: attachment.uri }} style={styles.attachmentImage} />
                ) : (
                  <View style={styles.attachmentFileIcon}>
                    {getAttachmentIcon(attachment.type)}
                  </View>
                )}
                <Text style={styles.attachmentName} numberOfLines={1}>
                  {attachment.name}
                </Text>
                <TouchableOpacity
                  style={styles.removeAttachment}
                  onPress={() => removeAttachment(attachment.id)}
                >
                  <X size={12} color={Colors.background} />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {showAttachmentOptions && (
        <View style={styles.attachmentOptions}>
          <TouchableOpacity style={styles.attachmentOption} onPress={pickImage}>
            <View style={[styles.attachmentOptionIcon, { backgroundColor: Colors.primary + '20' }]}>
              <ImageIcon size={22} color={Colors.primary} />
            </View>
            <Text style={styles.attachmentOptionText}>Image</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.attachmentOption} onPress={pickVideo}>
            <View style={[styles.attachmentOptionIcon, { backgroundColor: Colors.accent + '20' }]}>
              <Video size={22} color={Colors.accent} />
            </View>
            <Text style={styles.attachmentOptionText}>Video</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.attachmentOption} onPress={startRecording}>
            <View style={[styles.attachmentOptionIcon, { backgroundColor: Colors.success + '20' }]}>
              <Mic size={22} color={Colors.success} />
            </View>
            <Text style={styles.attachmentOptionText}>Voice</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.attachmentOption} onPress={pickAudioFile}>
            <View style={[styles.attachmentOptionIcon, { backgroundColor: '#9B59B6' + '20' }]}>
              <Music size={22} color="#9B59B6" />
            </View>
            <Text style={styles.attachmentOptionText}>Audio</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.attachmentOption} onPress={pickDocument}>
            <View style={[styles.attachmentOptionIcon, { backgroundColor: Colors.warning + '20' }]}>
              <FileText size={22} color={Colors.warning} />
            </View>
            <Text style={styles.attachmentOptionText}>Document</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={[styles.inputContainer, { paddingBottom: insets.bottom + 12 }]}>
        <TouchableOpacity
          style={[styles.attachButton, showAttachmentOptions && styles.attachButtonActive]}
          onPress={() => setShowAttachmentOptions(!showAttachmentOptions)}
          testID="attach-button"
        >
          <Paperclip size={22} color={showAttachmentOptions ? Colors.primary : Colors.textSecondary} />
        </TouchableOpacity>
        <View style={styles.textInputContainer}>
          <TextInput
            style={styles.messageInput}
            placeholder="Type your message..."
            placeholderTextColor={Colors.textMuted}
            value={messageText}
            onChangeText={setMessageText}
            multiline
            maxLength={2000}
          />
        </View>
        <TouchableOpacity
          style={[
            styles.sendButton,
            (messageText.trim() || attachments.length > 0) && styles.sendButtonActive
          ]}
          onPress={handleSendMessage}
          testID="send-button"
        >
          <Send size={20} color={
            (messageText.trim() || attachments.length > 0) 
              ? Colors.background 
              : Colors.textMuted
          } />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recipientSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    minHeight: 56,
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
    marginRight: 12,
    marginTop: 8,
  },
  selectedContactsContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectedContactChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary + '20',
    borderRadius: 20,
    paddingVertical: 6,
    paddingLeft: 6,
    paddingRight: 10,
    gap: 6,
  },
  chipAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  chipName: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.primary,
    maxWidth: 80,
  },
  chipRemove: {
    marginLeft: 2,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  contactList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  contactAvatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  contactAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.success,
    borderWidth: 2,
    borderColor: Colors.card,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 2,
  },
  contactRole: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  checkboxInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.background,
  },
  attachmentsPreview: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  attachmentItem: {
    width: 80,
    marginRight: 12,
    alignItems: 'center',
    position: 'relative',
  },
  attachmentImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: Colors.card,
  },
  attachmentFileIcon: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  attachmentName: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 4,
    textAlign: 'center',
    width: 70,
  },
  removeAttachment: {
    position: 'absolute',
    top: -4,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  attachmentOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: Colors.card,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  attachmentOption: {
    alignItems: 'center',
    gap: 6,
  },
  attachmentOptionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  attachmentOptionText: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: Colors.textSecondary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: Colors.backgroundSecondary,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 10,
  },
  attachButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  attachButtonActive: {
    backgroundColor: Colors.primary + '20',
  },
  textInputContainer: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    maxHeight: 120,
  },
  messageInput: {
    fontSize: 15,
    color: Colors.text,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonActive: {
    backgroundColor: Colors.primary,
  },
});
