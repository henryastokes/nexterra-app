import React, { useState } from 'react';
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
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Camera,
  Video,
  Plus,
  Upload,
  MapPinned,
  Clock,
  Link2,
  Eye,
  Heart,
  Play,
  X,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { userFieldPosts, UserFieldPost } from '@/mocks/userProfile';

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

export default function OnTheGroundScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [fieldPosts, setFieldPosts] = useState<UserFieldPost[]>(userFieldPosts);
  const [showFieldUploadModal, setShowFieldUploadModal] = useState(false);
  const [fieldForm, setFieldForm] = useState({
    title: '',
    description: '',
    type: 'photo' as 'photo' | 'video',
    enableGeoTag: true,
    linkType: '' as '' | 'proposal' | 'dao',
    linkId: '',
  });

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
        <Text style={styles.headerTitle}>On the Ground</Text>
        <TouchableOpacity 
          style={styles.uploadHeaderButton}
          onPress={() => setShowFieldUploadModal(true)}
        >
          <Plus size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.sectionDescription}>
          Share photos and videos of your real-world work. Posts can be geo-tagged and linked to proposals or DAOs.
        </Text>

        {fieldPosts.length === 0 ? (
          <View style={styles.emptyState}>
            <Camera size={48} color={Colors.textMuted} />
            <Text style={styles.emptyStateText}>No field posts yet</Text>
            <Text style={styles.emptyStateSubtext}>Upload photos and videos of your work</Text>
            <TouchableOpacity 
              style={styles.emptyStateButton}
              onPress={() => setShowFieldUploadModal(true)}
            >
              <Plus size={18} color={Colors.background} />
              <Text style={styles.emptyStateButtonText}>Upload</Text>
            </TouchableOpacity>
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
      </ScrollView>

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
  uploadHeaderButton: {
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
    padding: 16,
    paddingBottom: 40,
  },
  sectionDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text,
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 6,
  },
  emptyStateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    marginTop: 20,
  },
  emptyStateButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.background,
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
  uploadTypeSelector: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  uploadTypeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  uploadTypeOptionActive: {
    borderColor: Colors.primary,
    backgroundColor: `${Colors.primary}10`,
  },
  uploadTypeText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.textMuted,
  },
  uploadTypeTextActive: {
    color: Colors.primary,
  },
  uploadArea: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: Colors.border,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: Colors.card,
  },
  uploadAreaText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
    marginTop: 12,
  },
  uploadAreaSubtext: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 4,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
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
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  switchInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  switchTextContainer: {
    flex: 1,
  },
  switchLabel: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  switchSubtext: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 2,
  },
  linkTypeSelector: {
    flexDirection: 'row',
    gap: 12,
  },
  linkTypeOption: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: Colors.card,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  linkTypeOptionActive: {
    borderColor: Colors.primary,
    backgroundColor: `${Colors.primary}10`,
  },
  linkTypeText: {
    fontSize: 14,
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
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.card,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  optionChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  optionChipText: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: Colors.textSecondary,
  },
  optionChipTextActive: {
    color: Colors.background,
  },
});
