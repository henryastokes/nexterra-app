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
  FileText,
  Upload,
  Camera,
  Mic,
  X,
  Calendar,
  DollarSign,
  MapPin,
  Globe,
  Target,
  ChevronDown,
  CheckCircle,
  AlertCircle,
  Plus,
  File,
  Image as ImageIcon,
  Music,
  Link2,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { issueAreas, countries, regions, linkedDaos, SubmissionAttachment } from '@/mocks/submissions';

type AttachmentType = 'document' | 'photo' | 'audio';

interface FormAttachment extends SubmissionAttachment {
  tempId: string;
}

export default function SubmitProposalScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [form, setForm] = useState({
    title: '',
    description: '',
    issueArea: '',
    country: '',
    region: '',
    budget: '',
    currency: 'USDC',
    startDate: '',
    endDate: '',
    milestones: [''],
    linkedDao: '',
  });

  const [attachments, setAttachments] = useState<FormAttachment[]>([]);
  const [showIssueAreaPicker, setShowIssueAreaPicker] = useState(false);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [showRegionPicker, setShowRegionPicker] = useState(false);
  const [showDaoPicker, setShowDaoPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddAttachment = (type: AttachmentType) => {
    const mockAttachment: FormAttachment = {
      tempId: `temp-${Date.now()}`,
      id: `att-${Date.now()}`,
      type,
      name: type === 'document' ? 'Document.pdf' : type === 'photo' ? 'Photo.jpg' : 'Recording.mp3',
      url: '#',
      size: type === 'document' ? '2.1 MB' : type === 'photo' ? '1.5 MB' : '3.2 MB',
    };
    setAttachments([...attachments, mockAttachment]);
  };

  const handleRemoveAttachment = (tempId: string) => {
    setAttachments(attachments.filter(a => a.tempId !== tempId));
  };

  const handleAddMilestone = () => {
    setForm({ ...form, milestones: [...form.milestones, ''] });
  };

  const handleUpdateMilestone = (index: number, value: string) => {
    const updated = [...form.milestones];
    updated[index] = value;
    setForm({ ...form, milestones: updated });
  };

  const handleRemoveMilestone = (index: number) => {
    if (form.milestones.length > 1) {
      const updated = form.milestones.filter((_, i) => i !== index);
      setForm({ ...form, milestones: updated });
    }
  };

  const validateForm = () => {
    if (!form.title.trim()) {
      Alert.alert('Validation Error', 'Please enter a proposal title');
      return false;
    }
    if (!form.description.trim()) {
      Alert.alert('Validation Error', 'Please enter a proposal description');
      return false;
    }
    if (!form.issueArea) {
      Alert.alert('Validation Error', 'Please select an issue area');
      return false;
    }
    if (!form.country) {
      Alert.alert('Validation Error', 'Please select a country');
      return false;
    }
    if (!form.budget) {
      Alert.alert('Validation Error', 'Please enter a budget');
      return false;
    }
    if (!form.startDate || !form.endDate) {
      Alert.alert('Validation Error', 'Please enter timeline dates');
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
      'Proposal Submitted',
      'Your proposal has been submitted for admin review. You will be notified once it is approved and moves to voting.',
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  const getAttachmentIcon = (type: AttachmentType) => {
    switch (type) {
      case 'document':
        return <File size={18} color={Colors.primary} />;
      case 'photo':
        return <ImageIcon size={18} color={Colors.accent} />;
      case 'audio':
        return <Music size={18} color={Colors.clay} />;
    }
  };

  const renderPicker = (
    visible: boolean,
    onClose: () => void,
    options: string[] | { id: string; name: string }[],
    selected: string,
    onSelect: (value: string) => void,
    title: string
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
              const isSelected = selected === value;

              return (
                <TouchableOpacity
                  key={index}
                  style={[styles.pickerOption, isSelected && styles.pickerOptionSelected]}
                  onPress={() => {
                    onSelect(value);
                    onClose();
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
        <Text style={styles.headerTitle}>Submit Proposal</Text>
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
            <FileText size={28} color={Colors.primary} />
          </View>
          <Text style={styles.heroTitle}>Create Your Proposal</Text>
          <Text style={styles.heroSubtitle}>
            Submit detailed proposals for climate and health initiatives. After admin approval, your proposal will appear in the Vote section.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Proposal Title *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter a clear, descriptive title"
              placeholderTextColor={Colors.textMuted}
              value={form.title}
              onChangeText={(text) => setForm({ ...form, title: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe your proposal in detail. Include objectives, methodology, and expected outcomes..."
              placeholderTextColor={Colors.textMuted}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              value={form.description}
              onChangeText={(text) => setForm({ ...form, description: text })}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Classification</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Issue Area *</Text>
            <TouchableOpacity
              style={styles.selectInput}
              onPress={() => setShowIssueAreaPicker(true)}
            >
              <Target size={18} color={Colors.textSecondary} />
              <Text style={[styles.selectText, !form.issueArea && styles.selectPlaceholder]}>
                {form.issueArea || 'Select issue area'}
              </Text>
              <ChevronDown size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.inputLabel}>Country *</Text>
              <TouchableOpacity
                style={styles.selectInput}
                onPress={() => setShowCountryPicker(true)}
              >
                <MapPin size={18} color={Colors.textSecondary} />
                <Text style={[styles.selectText, !form.country && styles.selectPlaceholder]} numberOfLines={1}>
                  {form.country || 'Select country'}
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
                  {form.region || 'Select region'}
                </Text>
                <ChevronDown size={18} color={Colors.textMuted} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Budget & Timeline</Text>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.flex2]}>
              <Text style={styles.inputLabel}>Budget *</Text>
              <View style={styles.budgetInputContainer}>
                <DollarSign size={18} color={Colors.textSecondary} />
                <TextInput
                  style={styles.budgetInput}
                  placeholder="0.00"
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="numeric"
                  value={form.budget}
                  onChangeText={(text) => setForm({ ...form, budget: text })}
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

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.inputLabel}>Start Date *</Text>
              <View style={styles.dateInputContainer}>
                <Calendar size={18} color={Colors.textSecondary} />
                <TextInput
                  style={styles.dateInput}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={Colors.textMuted}
                  value={form.startDate}
                  onChangeText={(text) => setForm({ ...form, startDate: text })}
                />
              </View>
            </View>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.inputLabel}>End Date *</Text>
              <View style={styles.dateInputContainer}>
                <Calendar size={18} color={Colors.textSecondary} />
                <TextInput
                  style={styles.dateInput}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={Colors.textMuted}
                  value={form.endDate}
                  onChangeText={(text) => setForm({ ...form, endDate: text })}
                />
              </View>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.milestonesHeader}>
              <Text style={styles.inputLabel}>Milestones</Text>
              <TouchableOpacity style={styles.addMilestoneButton} onPress={handleAddMilestone}>
                <Plus size={16} color={Colors.primary} />
                <Text style={styles.addMilestoneText}>Add</Text>
              </TouchableOpacity>
            </View>
            {form.milestones.map((milestone, index) => (
              <View key={index} style={styles.milestoneRow}>
                <View style={styles.milestoneNumber}>
                  <Text style={styles.milestoneNumberText}>{index + 1}</Text>
                </View>
                <TextInput
                  style={styles.milestoneInput}
                  placeholder={`Milestone ${index + 1}`}
                  placeholderTextColor={Colors.textMuted}
                  value={milestone}
                  onChangeText={(text) => handleUpdateMilestone(index, text)}
                />
                {form.milestones.length > 1 && (
                  <TouchableOpacity
                    style={styles.removeMilestoneButton}
                    onPress={() => handleRemoveMilestone(index)}
                  >
                    <X size={16} color={Colors.error} />
                  </TouchableOpacity>
                )}
              </View>
            ))}
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
          <Text style={styles.sectionSubtitle}>Upload supporting documents, photos, or audio recordings</Text>

          <View style={styles.uploadButtons}>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => handleAddAttachment('document')}
            >
              <View style={[styles.uploadButtonIcon, { backgroundColor: `${Colors.primary}15` }]}>
                <FileText size={22} color={Colors.primary} />
              </View>
              <Text style={styles.uploadButtonText}>Document</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => handleAddAttachment('photo')}
            >
              <View style={[styles.uploadButtonIcon, { backgroundColor: `${Colors.accent}15` }]}>
                <Camera size={22} color={Colors.accent} />
              </View>
              <Text style={styles.uploadButtonText}>Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => handleAddAttachment('audio')}
            >
              <View style={[styles.uploadButtonIcon, { backgroundColor: `${Colors.clay}15` }]}>
                <Mic size={22} color={Colors.clay} />
              </View>
              <Text style={styles.uploadButtonText}>Audio</Text>
            </TouchableOpacity>
          </View>

          {attachments.length > 0 && (
            <View style={styles.attachmentsList}>
              {attachments.map((attachment) => (
                <View key={attachment.tempId} style={styles.attachmentItem}>
                  {getAttachmentIcon(attachment.type as AttachmentType)}
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
            Your proposal will be reviewed by admins before appearing in the Vote section. Ensure all information is accurate and complete.
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
              <Text style={styles.submitButtonText}>Submit for Review</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>

      {renderPicker(
        showIssueAreaPicker,
        () => setShowIssueAreaPicker(false),
        issueAreas,
        form.issueArea,
        (value) => setForm({ ...form, issueArea: value }),
        'Select Issue Area'
      )}

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
    backgroundColor: `${Colors.primary}15`,
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
    backgroundColor: Colors.primary,
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
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 8,
  },
  dateInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: Colors.text,
  },
  milestonesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addMilestoneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addMilestoneText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  milestoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  milestoneNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  milestoneNumberText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: Colors.background,
  },
  milestoneInput: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  removeMilestoneButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: `${Colors.error}15`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  uploadButton: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  uploadButtonIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  uploadButtonText: {
    fontSize: 12,
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
    backgroundColor: Colors.primary,
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
});
