import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Briefcase,
  Clock,
  MapPin,
  DollarSign,
  Users,
  FileText,
  ChevronDown,
  Check,
  Upload,
  X,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { communityUsers, expertiseOptions } from '@/mocks/community';
import { funders } from '@/mocks/funders';
import { collaborationTypes } from '@/mocks/collaborations';

type CompensationType = 'Paid' | 'Equity' | 'Voluntary' | 'Grant-Funded';
type DurationType = '1-3 months' | '3-6 months' | '6-12 months' | '12+ months';

export default function SubmitCollaborationScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { userId } = useLocalSearchParams<{ userId: string }>();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [selectedExpertise, setSelectedExpertise] = useState<string[]>([]);
  const [showExpertiseDropdown, setShowExpertiseDropdown] = useState(false);
  const [location, setLocation] = useState('');
  const [duration, setDuration] = useState<DurationType | null>(null);
  const [showDurationDropdown, setShowDurationDropdown] = useState(false);
  const [compensation, setCompensation] = useState<CompensationType | null>(null);
  const [showCompensationDropdown, setShowCompensationDropdown] = useState(false);
  const [budget, setBudget] = useState('');
  const [maxCollaborators, setMaxCollaborators] = useState('1');
  const [attachments, setAttachments] = useState<string[]>([]);

  const user = communityUsers.find((u) => u.id === userId) || 
               funders.find((f) => f.id === userId);

  const getUserName = () => user?.name || 'User';
  const getUserAvatar = () => user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400';
  const getAffiliation = () => {
    if (!user) return '';
    if ('affiliation' in user) return user.affiliation;
    if ('organization' in user) return user.organization;
    return '';
  };

  const durationOptions: DurationType[] = ['1-3 months', '3-6 months', '6-12 months', '12+ months'];
  const compensationOptions: CompensationType[] = ['Paid', 'Equity', 'Voluntary', 'Grant-Funded'];

  const toggleExpertise = (exp: string) => {
    setSelectedExpertise((prev) =>
      prev.includes(exp) ? prev.filter((e) => e !== exp) : [...prev, exp]
    );
  };

  const handleAddAttachment = () => {
    const mockFile = `Document_${attachments.length + 1}.pdf`;
    setAttachments((prev) => [...prev, mockFile]);
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert('Required', 'Please enter a title for your collaboration opportunity');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Required', 'Please enter a description');
      return;
    }
    if (!selectedType) {
      Alert.alert('Required', 'Please select a collaboration type');
      return;
    }
    if (selectedExpertise.length === 0) {
      Alert.alert('Required', 'Please select at least one area of expertise');
      return;
    }

    Alert.alert(
      'Collaboration Submitted',
      `Your collaboration opportunity has been sent to ${getUserName()} for review.`,
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ArrowLeft size={22} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Collaborate</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>User not found</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          testID="back-button"
        >
          <ArrowLeft size={22} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Submit Collaboration</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.recipientCard}>
          <Image source={{ uri: getUserAvatar() }} style={styles.recipientAvatar} />
          <View style={styles.recipientInfo}>
            <Text style={styles.recipientLabel}>Collaborating with</Text>
            <Text style={styles.recipientName}>{getUserName()}</Text>
            <Text style={styles.recipientAffiliation}>{getAffiliation()}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Opportunity Details</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Title *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g., Climate Research Partnership"
              placeholderTextColor={Colors.textMuted}
              value={title}
              onChangeText={setTitle}
              testID="title-input"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Description *</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="Describe the collaboration opportunity, goals, and expected outcomes..."
              placeholderTextColor={Colors.textMuted}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              testID="description-input"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Collaboration Type *</Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setShowTypeDropdown(!showTypeDropdown)}
            >
              <Briefcase size={18} color={Colors.textSecondary} />
              <Text style={[styles.dropdownText, !selectedType && styles.dropdownPlaceholder]}>
                {selectedType || 'Select type'}
              </Text>
              <ChevronDown size={18} color={Colors.textSecondary} />
            </TouchableOpacity>
            {showTypeDropdown && (
              <View style={styles.dropdownMenu}>
                {collaborationTypes.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[styles.dropdownItem, selectedType === type && styles.dropdownItemSelected]}
                    onPress={() => {
                      setSelectedType(type);
                      setShowTypeDropdown(false);
                    }}
                  >
                    <Text style={[styles.dropdownItemText, selectedType === type && styles.dropdownItemTextSelected]}>
                      {type}
                    </Text>
                    {selectedType === type && <Check size={16} color={Colors.primary} />}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Required Expertise *</Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setShowExpertiseDropdown(!showExpertiseDropdown)}
            >
              <Users size={18} color={Colors.textSecondary} />
              <Text style={[styles.dropdownText, selectedExpertise.length === 0 && styles.dropdownPlaceholder]}>
                {selectedExpertise.length > 0 ? `${selectedExpertise.length} selected` : 'Select expertise'}
              </Text>
              <ChevronDown size={18} color={Colors.textSecondary} />
            </TouchableOpacity>
            {showExpertiseDropdown && (
              <View style={styles.dropdownMenu}>
                {expertiseOptions.map((exp) => (
                  <TouchableOpacity
                    key={exp}
                    style={[styles.dropdownItem, selectedExpertise.includes(exp) && styles.dropdownItemSelected]}
                    onPress={() => toggleExpertise(exp)}
                  >
                    <Text style={[styles.dropdownItemText, selectedExpertise.includes(exp) && styles.dropdownItemTextSelected]}>
                      {exp}
                    </Text>
                    {selectedExpertise.includes(exp) && <Check size={16} color={Colors.primary} />}
                  </TouchableOpacity>
                ))}
              </View>
            )}
            {selectedExpertise.length > 0 && (
              <View style={styles.selectedTags}>
                {selectedExpertise.map((exp) => (
                  <View key={exp} style={styles.selectedTag}>
                    <Text style={styles.selectedTagText}>{exp}</Text>
                    <TouchableOpacity onPress={() => toggleExpertise(exp)}>
                      <X size={14} color={Colors.textSecondary} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Logistics</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Location</Text>
            <View style={styles.inputWithIcon}>
              <MapPin size={18} color={Colors.textSecondary} />
              <TextInput
                style={styles.inputWithIconText}
                placeholder="e.g., Nairobi, Kenya or Remote"
                placeholderTextColor={Colors.textMuted}
                value={location}
                onChangeText={setLocation}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Duration</Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setShowDurationDropdown(!showDurationDropdown)}
            >
              <Clock size={18} color={Colors.textSecondary} />
              <Text style={[styles.dropdownText, !duration && styles.dropdownPlaceholder]}>
                {duration || 'Select duration'}
              </Text>
              <ChevronDown size={18} color={Colors.textSecondary} />
            </TouchableOpacity>
            {showDurationDropdown && (
              <View style={styles.dropdownMenu}>
                {durationOptions.map((opt) => (
                  <TouchableOpacity
                    key={opt}
                    style={[styles.dropdownItem, duration === opt && styles.dropdownItemSelected]}
                    onPress={() => {
                      setDuration(opt);
                      setShowDurationDropdown(false);
                    }}
                  >
                    <Text style={[styles.dropdownItemText, duration === opt && styles.dropdownItemTextSelected]}>
                      {opt}
                    </Text>
                    {duration === opt && <Check size={16} color={Colors.primary} />}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.inputLabel}>Compensation</Text>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setShowCompensationDropdown(!showCompensationDropdown)}
              >
                <DollarSign size={18} color={Colors.textSecondary} />
                <Text style={[styles.dropdownText, styles.dropdownTextSmall, !compensation && styles.dropdownPlaceholder]}>
                  {compensation || 'Type'}
                </Text>
                <ChevronDown size={16} color={Colors.textSecondary} />
              </TouchableOpacity>
              {showCompensationDropdown && (
                <View style={styles.dropdownMenu}>
                  {compensationOptions.map((opt) => (
                    <TouchableOpacity
                      key={opt}
                      style={[styles.dropdownItem, compensation === opt && styles.dropdownItemSelected]}
                      onPress={() => {
                        setCompensation(opt);
                        setShowCompensationDropdown(false);
                      }}
                    >
                      <Text style={[styles.dropdownItemText, compensation === opt && styles.dropdownItemTextSelected]}>
                        {opt}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.inputLabel}>Budget (optional)</Text>
              <View style={styles.inputWithIcon}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput
                  style={styles.inputWithIconText}
                  placeholder="Amount"
                  placeholderTextColor={Colors.textMuted}
                  value={budget}
                  onChangeText={setBudget}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Team Size Needed</Text>
            <View style={styles.inputWithIcon}>
              <Users size={18} color={Colors.textSecondary} />
              <TextInput
                style={styles.inputWithIconText}
                placeholder="Number of collaborators"
                placeholderTextColor={Colors.textMuted}
                value={maxCollaborators}
                onChangeText={setMaxCollaborators}
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Attachments</Text>
          <Text style={styles.sectionSubtitle}>Add relevant documents, proposals, or reference materials</Text>

          <TouchableOpacity style={styles.uploadButton} onPress={handleAddAttachment}>
            <Upload size={20} color={Colors.primary} />
            <Text style={styles.uploadButtonText}>Add Document</Text>
          </TouchableOpacity>

          {attachments.length > 0 && (
            <View style={styles.attachmentsList}>
              {attachments.map((file, index) => (
                <View key={index} style={styles.attachmentItem}>
                  <FileText size={18} color={Colors.primary} />
                  <Text style={styles.attachmentName}>{file}</Text>
                  <TouchableOpacity onPress={() => handleRemoveAttachment(index)}>
                    <X size={18} color={Colors.textMuted} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          testID="submit-button"
        >
          <Text style={styles.submitButtonText}>Submit Collaboration Request</Text>
        </TouchableOpacity>
      </ScrollView>
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
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  recipientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  recipientAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  recipientInfo: {
    marginLeft: 14,
    flex: 1,
  },
  recipientLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  recipientName: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 2,
  },
  recipientAffiliation: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: Colors.textMuted,
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
  textInput: {
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
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 10,
  },
  dropdownText: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
  },
  dropdownTextSmall: {
    fontSize: 14,
  },
  dropdownPlaceholder: {
    color: Colors.textMuted,
  },
  dropdownMenu: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  dropdownItemSelected: {
    backgroundColor: Colors.primary + '10',
  },
  dropdownItemText: {
    fontSize: 14,
    color: Colors.text,
  },
  dropdownItemTextSelected: {
    color: Colors.primary,
    fontWeight: '600' as const,
  },
  selectedTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  selectedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary + '15',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  selectedTagText: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '500' as const,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 10,
  },
  inputWithIconText: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
    paddingVertical: 14,
  },
  currencySymbol: {
    fontSize: 15,
    color: Colors.textSecondary,
    fontWeight: '600' as const,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary + '10',
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.primary + '30',
    borderStyle: 'dashed',
  },
  uploadButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  attachmentsList: {
    marginTop: 12,
    gap: 8,
  },
  attachmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
    gap: 10,
  },
  attachmentName: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.background,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundText: {
    fontSize: 16,
    color: Colors.textMuted,
  },
});
