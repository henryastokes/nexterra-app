import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  HelpCircle,
  Upload,
  FileText,
  Camera,
  Video,
  Mic,
  X,
  DollarSign,
  MapPin,
  Globe,
  ChevronDown,
  CheckCircle,
  AlertCircle,
  Zap,
  Users,
  Package,
  Lightbulb,
  File,
  Image as ImageIcon,
  Music,
  Film,
  Link2,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { countries, regions, expertiseTypes, resourceTypes, linkedDaos } from '@/mocks/submissions';

type AttachmentType = 'document' | 'photo' | 'video' | 'audio';
type RequestType = 'funding' | 'resources' | 'expertise' | 'collaboration';
type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical';

interface FormAttachment {
  tempId: string;
  id: string;
  type: AttachmentType;
  name: string;
  url: string;
  size: string;
}

const requestTypeConfig = {
  funding: {
    icon: DollarSign,
    label: 'Funding',
    description: 'Request financial support',
    color: Colors.success,
  },
  resources: {
    icon: Package,
    label: 'Resources',
    description: 'Request equipment or materials',
    color: Colors.accent,
  },
  expertise: {
    icon: Lightbulb,
    label: 'Expertise',
    description: 'Seek expert guidance',
    color: Colors.primary,
  },
  collaboration: {
    icon: Users,
    label: 'Collaboration',
    description: 'Find project partners',
    color: Colors.clay,
  },
};

const urgencyConfig: Record<UrgencyLevel, { label: string; color: string }> = {
  low: { label: 'Low', color: Colors.textSecondary },
  medium: { label: 'Medium', color: Colors.accent },
  high: { label: 'High', color: '#FF9800' },
  critical: { label: 'Critical', color: Colors.error },
};

export default function SubmitAskScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [form, setForm] = useState({
    title: '',
    description: '',
    requestType: '' as RequestType | '',
    urgency: 'medium' as UrgencyLevel,
    targetAmount: '',
    currency: 'USDC',
    expertiseNeeded: [] as string[],
    resourcesNeeded: [] as string[],
    country: '',
    region: '',
    linkedDao: '',
  });

  const [attachments, setAttachments] = useState<FormAttachment[]>([]);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [showRegionPicker, setShowRegionPicker] = useState(false);
  const [showExpertisePicker, setShowExpertisePicker] = useState(false);
  const [showResourcesPicker, setShowResourcesPicker] = useState(false);
  const [showDaoPicker, setShowDaoPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddAttachment = (type: AttachmentType) => {
    const names = {
      document: 'Document.pdf',
      photo: 'Photo.jpg',
      video: 'Video.mp4',
      audio: 'Recording.mp3',
    };
    const sizes = {
      document: '2.1 MB',
      photo: '1.5 MB',
      video: '24.8 MB',
      audio: '3.2 MB',
    };

    const mockAttachment: FormAttachment = {
      tempId: `temp-${Date.now()}`,
      id: `att-${Date.now()}`,
      type,
      name: names[type],
      url: '#',
      size: sizes[type],
    };
    setAttachments([...attachments, mockAttachment]);
  };

  const handleRemoveAttachment = (tempId: string) => {
    setAttachments(attachments.filter(a => a.tempId !== tempId));
  };

  const toggleExpertise = (expertise: string) => {
    if (form.expertiseNeeded.includes(expertise)) {
      setForm({
        ...form,
        expertiseNeeded: form.expertiseNeeded.filter(e => e !== expertise),
      });
    } else {
      setForm({
        ...form,
        expertiseNeeded: [...form.expertiseNeeded, expertise],
      });
    }
  };

  const toggleResource = (resource: string) => {
    if (form.resourcesNeeded.includes(resource)) {
      setForm({
        ...form,
        resourcesNeeded: form.resourcesNeeded.filter(r => r !== resource),
      });
    } else {
      setForm({
        ...form,
        resourcesNeeded: [...form.resourcesNeeded, resource],
      });
    }
  };

  const validateForm = () => {
    if (!form.title.trim()) {
      Alert.alert('Validation Error', 'Please enter a title for your ask');
      return false;
    }
    if (!form.description.trim()) {
      Alert.alert('Validation Error', 'Please describe what you need');
      return false;
    }
    if (!form.requestType) {
      Alert.alert('Validation Error', 'Please select a request type');
      return false;
    }
    if (form.requestType === 'funding' && !form.targetAmount) {
      Alert.alert('Validation Error', 'Please enter the funding amount needed');
      return false;
    }
    if (form.requestType === 'expertise' && form.expertiseNeeded.length === 0) {
      Alert.alert('Validation Error', 'Please select the expertise types needed');
      return false;
    }
    if (form.requestType === 'resources' && form.resourcesNeeded.length === 0) {
      Alert.alert('Validation Error', 'Please select the resources needed');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    Alert.alert(
      'Ask Submitted',
      'Your ask has been submitted for admin review. Once approved, it will appear in the Vote section where the community can respond.',
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  const getAttachmentIcon = (type: AttachmentType) => {
    switch (type) {
      case 'document':
        return <File size={18} color={Colors.primary} />;
      case 'photo':
        return <ImageIcon size={18} color={Colors.accent} />;
      case 'video':
        return <Film size={18} color={Colors.success} />;
      case 'audio':
        return <Music size={18} color={Colors.clay} />;
    }
  };

  const renderPicker = (
    visible: boolean,
    onClose: () => void,
    options: string[] | { id: string; name: string }[],
    selected: string | string[],
    onSelect: (value: string) => void,
    title: string,
    multiSelect = false
  ) => {
    if (!visible) return null;

    return (
      <View style={styles.pickerOverlay}>
        <TouchableOpacity style={styles.pickerBackdrop} onPress={onClose} />
        <View style={[styles.pickerContainer, { paddingBottom: insets.bottom + 16 }]}>
          <View style={styles.pickerHeader}>
            <Text style={styles.pickerTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.pickerScroll} showsVerticalScrollIndicator={false}>
            {options.map((option, index) => {
              const value = typeof option === 'string' ? option : option.id;
              const label = typeof option === 'string' ? option : option.name;
              const isSelected = multiSelect
                ? (selected as string[]).includes(value)
                : selected === value;

              return (
                <TouchableOpacity
                  key={index}
                  style={[styles.pickerOption, isSelected && styles.pickerOptionSelected]}
                  onPress={() => {
                    onSelect(value);
                    if (!multiSelect) onClose();
                  }}
                >
                  <Text style={[styles.pickerOptionText, isSelected && styles.pickerOptionTextSelected]}>
                    {label}
                  </Text>
                  {isSelected && <CheckCircle size={20} color={Colors.primary} />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          {multiSelect && (
            <TouchableOpacity style={styles.pickerDoneButton} onPress={onClose}>
              <Text style={styles.pickerDoneText}>Done</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={22} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Submit Ask</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <HelpCircle size={28} color={Colors.accent} />
          </View>
          <Text style={styles.heroTitle}>Request Support</Text>
          <Text style={styles.heroSubtitle}>
            Submit requests for funding, resources, expertise, or collaboration. After admin approval, your ask will be visible to the community.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What do you need?</Text>

          <View style={styles.requestTypeGrid}>
            {(Object.entries(requestTypeConfig) as [RequestType, typeof requestTypeConfig.funding][]).map(([type, config]) => {
              const isSelected = form.requestType === type;
              const IconComponent = config.icon;
              return (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.requestTypeCard,
                    isSelected && { borderColor: config.color, backgroundColor: `${config.color}10` },
                  ]}
                  onPress={() => setForm({ ...form, requestType: type })}
                >
                  <View style={[styles.requestTypeIcon, { backgroundColor: `${config.color}20` }]}>
                    <IconComponent size={24} color={config.color} />
                  </View>
                  <Text style={[styles.requestTypeLabel, isSelected && { color: config.color }]}>
                    {config.label}
                  </Text>
                  <Text style={styles.requestTypeDesc}>{config.description}</Text>
                  {isSelected && (
                    <View style={[styles.selectedBadge, { backgroundColor: config.color }]}>
                      <CheckCircle size={12} color={Colors.background} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Title *</Text>
            <TextInput
              style={styles.input}
              placeholder="Brief title for your request"
              placeholderTextColor={Colors.textMuted}
              value={form.title}
              onChangeText={(text) => setForm({ ...form, title: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe what you need and why. Be specific about requirements and how support will be used..."
              placeholderTextColor={Colors.textMuted}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              value={form.description}
              onChangeText={(text) => setForm({ ...form, description: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Urgency Level</Text>
            <View style={styles.urgencyRow}>
              {(Object.entries(urgencyConfig) as [UrgencyLevel, { label: string; color: string }][]).map(([level, config]) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.urgencyOption,
                    form.urgency === level && { borderColor: config.color, backgroundColor: `${config.color}15` },
                  ]}
                  onPress={() => setForm({ ...form, urgency: level })}
                >
                  <Zap
                    size={14}
                    color={form.urgency === level ? config.color : Colors.textMuted}
                  />
                  <Text
                    style={[
                      styles.urgencyText,
                      form.urgency === level && { color: config.color, fontWeight: '600' as const },
                    ]}
                  >
                    {config.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {form.requestType === 'funding' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Funding Details</Text>
            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.flex2]}>
                <Text style={styles.inputLabel}>Amount Needed *</Text>
                <View style={styles.budgetInputContainer}>
                  <DollarSign size={18} color={Colors.textSecondary} />
                  <TextInput
                    style={styles.budgetInput}
                    placeholder="0.00"
                    placeholderTextColor={Colors.textMuted}
                    keyboardType="numeric"
                    value={form.targetAmount}
                    onChangeText={(text) => setForm({ ...form, targetAmount: text })}
                  />
                </View>
              </View>
              <View style={[styles.inputGroup, styles.flex1]}>
                <Text style={styles.inputLabel}>Currency</Text>
                <View style={styles.currencyBadge}>
                  <Text style={styles.currencyText}>USDC</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {form.requestType === 'expertise' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Expertise Needed</Text>
            <TouchableOpacity
              style={styles.selectInput}
              onPress={() => setShowExpertisePicker(true)}
            >
              <Lightbulb size={18} color={Colors.textSecondary} />
              <Text style={[styles.selectText, form.expertiseNeeded.length === 0 && styles.selectPlaceholder]}>
                {form.expertiseNeeded.length > 0
                  ? `${form.expertiseNeeded.length} selected`
                  : 'Select expertise types'}
              </Text>
              <ChevronDown size={18} color={Colors.textMuted} />
            </TouchableOpacity>
            {form.expertiseNeeded.length > 0 && (
              <View style={styles.selectedTags}>
                {form.expertiseNeeded.map((exp) => (
                  <View key={exp} style={styles.selectedTag}>
                    <Text style={styles.selectedTagText}>{exp}</Text>
                    <TouchableOpacity onPress={() => toggleExpertise(exp)}>
                      <X size={14} color={Colors.primary} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {form.requestType === 'resources' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Resources Needed</Text>
            <TouchableOpacity
              style={styles.selectInput}
              onPress={() => setShowResourcesPicker(true)}
            >
              <Package size={18} color={Colors.textSecondary} />
              <Text style={[styles.selectText, form.resourcesNeeded.length === 0 && styles.selectPlaceholder]}>
                {form.resourcesNeeded.length > 0
                  ? `${form.resourcesNeeded.length} selected`
                  : 'Select resource types'}
              </Text>
              <ChevronDown size={18} color={Colors.textMuted} />
            </TouchableOpacity>
            {form.resourcesNeeded.length > 0 && (
              <View style={styles.selectedTags}>
                {form.resourcesNeeded.map((res) => (
                  <View key={res} style={styles.selectedTag}>
                    <Text style={styles.selectedTagText}>{res}</Text>
                    <TouchableOpacity onPress={() => toggleResource(res)}>
                      <X size={14} color={Colors.primary} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location (Optional)</Text>
          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.inputLabel}>Country</Text>
              <TouchableOpacity
                style={styles.selectInput}
                onPress={() => setShowCountryPicker(true)}
              >
                <MapPin size={18} color={Colors.textSecondary} />
                <Text style={[styles.selectText, !form.country && styles.selectPlaceholder]} numberOfLines={1}>
                  {form.country || 'Select'}
                </Text>
                <ChevronDown size={18} color={Colors.textMuted} />
              </TouchableOpacity>
            </View>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.inputLabel}>Region</Text>
              <TouchableOpacity
                style={styles.selectInput}
                onPress={() => setShowRegionPicker(true)}
              >
                <Globe size={18} color={Colors.textSecondary} />
                <Text style={[styles.selectText, !form.region && styles.selectPlaceholder]} numberOfLines={1}>
                  {form.region || 'Select'}
                </Text>
                <ChevronDown size={18} color={Colors.textMuted} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Link to DAO (Optional)</Text>
          <TouchableOpacity
            style={styles.selectInput}
            onPress={() => setShowDaoPicker(true)}
          >
            <Link2 size={18} color={Colors.textSecondary} />
            <Text style={[styles.selectText, !form.linkedDao && styles.selectPlaceholder]}>
              {form.linkedDao
                ? linkedDaos.find(d => d.id === form.linkedDao)?.name
                : 'Select a DAO to link'}
            </Text>
            <ChevronDown size={18} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Attachments</Text>
          <Text style={styles.sectionSubtitle}>Upload documents, photos, videos, or audio to support your request</Text>

          <View style={styles.uploadButtons}>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => handleAddAttachment('document')}
            >
              <View style={[styles.uploadButtonIcon, { backgroundColor: `${Colors.primary}15` }]}>
                <FileText size={20} color={Colors.primary} />
              </View>
              <Text style={styles.uploadButtonText}>Doc</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => handleAddAttachment('photo')}
            >
              <View style={[styles.uploadButtonIcon, { backgroundColor: `${Colors.accent}15` }]}>
                <Camera size={20} color={Colors.accent} />
              </View>
              <Text style={styles.uploadButtonText}>Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => handleAddAttachment('video')}
            >
              <View style={[styles.uploadButtonIcon, { backgroundColor: `${Colors.success}15` }]}>
                <Video size={20} color={Colors.success} />
              </View>
              <Text style={styles.uploadButtonText}>Video</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => handleAddAttachment('audio')}
            >
              <View style={[styles.uploadButtonIcon, { backgroundColor: `${Colors.clay}15` }]}>
                <Mic size={20} color={Colors.clay} />
              </View>
              <Text style={styles.uploadButtonText}>Audio</Text>
            </TouchableOpacity>
          </View>

          {attachments.length > 0 && (
            <View style={styles.attachmentsList}>
              {attachments.map((attachment) => (
                <View key={attachment.tempId} style={styles.attachmentItem}>
                  {getAttachmentIcon(attachment.type)}
                  <View style={styles.attachmentInfo}>
                    <Text style={styles.attachmentName} numberOfLines={1}>{attachment.name}</Text>
                    <Text style={styles.attachmentSize}>{attachment.size}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.attachmentRemove}
                    onPress={() => handleRemoveAttachment(attachment.tempId)}
                  >
                    <X size={16} color={Colors.error} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.infoBox}>
          <AlertCircle size={18} color={Colors.accent} />
          <Text style={styles.infoBoxText}>
            Your ask will be reviewed by admins before appearing in the Vote section. Community members and funders can then respond to your request.
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
          activeOpacity={0.8}
        >
          {isSubmitting ? (
            <Text style={styles.submitButtonText}>Submitting...</Text>
          ) : (
            <>
              <Upload size={20} color={Colors.background} />
              <Text style={styles.submitButtonText}>Submit Ask</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>

      {renderPicker(
        showCountryPicker,
        () => setShowCountryPicker(false),
        countries,
        form.country,
        (value) => setForm({ ...form, country: value }),
        'Select Country'
      )}

      {renderPicker(
        showRegionPicker,
        () => setShowRegionPicker(false),
        regions,
        form.region,
        (value) => setForm({ ...form, region: value }),
        'Select Region'
      )}

      {renderPicker(
        showExpertisePicker,
        () => setShowExpertisePicker(false),
        expertiseTypes,
        form.expertiseNeeded,
        toggleExpertise,
        'Select Expertise',
        true
      )}

      {renderPicker(
        showResourcesPicker,
        () => setShowResourcesPicker(false),
        resourceTypes,
        form.resourcesNeeded,
        toggleResource,
        'Select Resources',
        true
      )}

      {renderPicker(
        showDaoPicker,
        () => setShowDaoPicker(false),
        linkedDaos,
        form.linkedDao,
        (value) => setForm({ ...form, linkedDao: value }),
        'Link to DAO'
      )}
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
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  heroCard: {
    backgroundColor: Colors.cardElevated,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  heroIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: `${Colors.accent}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: -8,
    marginBottom: 16,
  },
  requestTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  requestTypeCard: {
    width: '47%',
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: Colors.border,
    position: 'relative',
  },
  requestTypeIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  requestTypeLabel: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  requestTypeDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  selectedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
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
    minHeight: 120,
    paddingTop: 14,
  },
  urgencyRow: {
    flexDirection: 'row',
    gap: 10,
  },
  urgencyOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.card,
    borderRadius: 10,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  urgencyText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  selectInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 10,
  },
  selectText: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
  },
  selectPlaceholder: {
    color: Colors.textMuted,
  },
  selectedTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  selectedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: `${Colors.primary}15`,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  selectedTagText: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '500' as const,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  flex1: {
    flex: 1,
  },
  flex2: {
    flex: 2,
  },
  budgetInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 8,
  },
  budgetInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: Colors.text,
  },
  currencyBadge: {
    backgroundColor: Colors.accent,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currencyText: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.background,
  },
  uploadButtons: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  uploadButton: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  uploadButtonIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  uploadButtonText: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  attachmentsList: {
    gap: 10,
  },
  attachmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  attachmentInfo: {
    flex: 1,
  },
  attachmentName: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.text,
  },
  attachmentSize: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  attachmentRemove: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: `${Colors.error}15`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: `${Colors.accent}10`,
    borderRadius: 12,
    padding: 16,
    gap: 12,
    marginBottom: 24,
  },
  infoBoxText: {
    flex: 1,
    fontSize: 13,
    color: Colors.accent,
    lineHeight: 18,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.accent,
    borderRadius: 14,
    paddingVertical: 16,
    gap: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.background,
  },
  pickerOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  pickerBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  pickerContainer: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 8,
    maxHeight: '60%',
  },
  pickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  pickerScroll: {
    paddingHorizontal: 20,
  },
  pickerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  pickerOptionSelected: {
    backgroundColor: `${Colors.primary}10`,
    marginHorizontal: -20,
    paddingHorizontal: 20,
    borderBottomColor: `${Colors.primary}20`,
  },
  pickerOptionText: {
    fontSize: 15,
    color: Colors.text,
  },
  pickerOptionTextSelected: {
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  pickerDoneButton: {
    marginHorizontal: 20,
    marginTop: 12,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  pickerDoneText: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.background,
  },
});
