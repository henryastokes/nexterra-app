import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  FileText,
  DollarSign,
  Clock,
  Calendar,
  Tag,
  MapPin,
  CheckCircle,
  Send,
  Building2,
  GraduationCap,
  Briefcase,
  Target,
  Plus,
  X,
  Info,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { InsightRequestType, insightRequestTypes } from '@/mocks/insightRequests';

type RequesterType = 'funder' | 'company' | 'institution';

const requesterTypes: { id: RequesterType; label: string; icon: React.ComponentType<{ size: number; color: string }> }[] = [
  { id: 'funder', label: 'Funder', icon: DollarSign },
  { id: 'company', label: 'Company', icon: Building2 },
  { id: 'institution', label: 'Institution', icon: GraduationCap },
];

const requestTypeColors: Record<string, string> = {
  white_paper: Colors.primary,
  feasibility_study: Colors.accent,
  landscape_review: Colors.golden,
};

export default function SubmitInsightRequestScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [requesterType, setRequesterType] = useState<RequesterType>('funder');
  const [requestType, setRequestType] = useState<InsightRequestType>('white_paper');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [organization, setOrganization] = useState('');
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [timeline, setTimeline] = useState('');
  const [deadline, setDeadline] = useState('');
  const [region, setRegion] = useState('');
  const [scopeItems, setScopeItems] = useState<string[]>(['']);
  const [deliverables, setDeliverables] = useState<string[]>(['']);
  const [requirements, setRequirements] = useState<string[]>(['']);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const addScopeItem = useCallback(() => {
    setScopeItems(prev => [...prev, '']);
  }, []);

  const updateScopeItem = useCallback((index: number, value: string) => {
    setScopeItems(prev => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  }, []);

  const removeScopeItem = useCallback((index: number) => {
    if (scopeItems.length > 1) {
      setScopeItems(prev => prev.filter((_, i) => i !== index));
    }
  }, [scopeItems.length]);

  const addDeliverable = useCallback(() => {
    setDeliverables(prev => [...prev, '']);
  }, []);

  const updateDeliverable = useCallback((index: number, value: string) => {
    setDeliverables(prev => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  }, []);

  const removeDeliverable = useCallback((index: number) => {
    if (deliverables.length > 1) {
      setDeliverables(prev => prev.filter((_, i) => i !== index));
    }
  }, [deliverables.length]);

  const addRequirement = useCallback(() => {
    setRequirements(prev => [...prev, '']);
  }, []);

  const updateRequirement = useCallback((index: number, value: string) => {
    setRequirements(prev => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  }, []);

  const removeRequirement = useCallback((index: number) => {
    if (requirements.length > 1) {
      setRequirements(prev => prev.filter((_, i) => i !== index));
    }
  }, [requirements.length]);

  const addTag = useCallback(() => {
    const trimmed = tagInput.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed)) {
      setTags(prev => [...prev, trimmed]);
      setTagInput('');
    }
  }, [tagInput, tags]);

  const removeTag = useCallback((tag: string) => {
    setTags(prev => prev.filter(t => t !== tag));
  }, []);

  const handleSubmit = useCallback(() => {
    if (!title.trim()) {
      Alert.alert('Missing Information', 'Please enter a title for your request.');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Missing Information', 'Please provide a description.');
      return;
    }
    if (!organization.trim()) {
      Alert.alert('Missing Information', 'Please enter your organization name.');
      return;
    }
    if (!budgetMin || !budgetMax) {
      Alert.alert('Missing Information', 'Please specify a budget range.');
      return;
    }
    if (!timeline.trim()) {
      Alert.alert('Missing Information', 'Please specify a timeline.');
      return;
    }
    if (!deadline.trim()) {
      Alert.alert('Missing Information', 'Please specify a submission deadline.');
      return;
    }

    const filteredScope = scopeItems.filter(s => s.trim());
    const filteredDeliverables = deliverables.filter(d => d.trim());
    
    if (filteredScope.length === 0) {
      Alert.alert('Missing Information', 'Please add at least one scope item.');
      return;
    }
    if (filteredDeliverables.length === 0) {
      Alert.alert('Missing Information', 'Please add at least one deliverable.');
      return;
    }

    Alert.alert(
      'Request Submitted',
      'Your insight request has been posted successfully. Teams can now view and submit bids. When a bid is approved, it will automatically become a Sub-DAO with milestone-based funding.',
      [{ text: 'View Request', onPress: () => router.back() }]
    );
  }, [title, description, organization, budgetMin, budgetMax, timeline, deadline, scopeItems, deliverables, router]);

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Stack.Screen
        options={{
          title: 'Post Insight Request',
          headerStyle: { backgroundColor: Colors.background },
          headerTintColor: Colors.text,
          headerTitleStyle: { fontWeight: '600' as const },
        }}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.infoCard}>
          <Info size={20} color={Colors.primary} />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>How it works</Text>
            <Text style={styles.infoText}>
              Post your request for white papers, feasibility studies, or landscape reviews. 
              Teams will bid on your project. Once approved, the winning team automatically 
              becomes a Sub-DAO with milestone-based disbursement.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Role</Text>
          <View style={styles.typeSelector}>
            {requesterTypes.map((type) => {
              const IconComponent = type.icon;
              const isSelected = requesterType === type.id;
              return (
                <TouchableOpacity
                  key={type.id}
                  style={[styles.typeOption, isSelected && styles.typeOptionSelected]}
                  onPress={() => setRequesterType(type.id)}
                  testID={`requester-type-${type.id}`}
                >
                  <IconComponent 
                    size={20} 
                    color={isSelected ? Colors.background : Colors.textSecondary} 
                  />
                  <Text style={[styles.typeOptionText, isSelected && styles.typeOptionTextSelected]}>
                    {type.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Request Type</Text>
          <View style={styles.requestTypeSelector}>
            {insightRequestTypes.map((type) => {
              const isSelected = requestType === type.id;
              const typeColor = requestTypeColors[type.id];
              return (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.requestTypeOption, 
                    isSelected && { backgroundColor: typeColor + '20', borderColor: typeColor }
                  ]}
                  onPress={() => setRequestType(type.id)}
                  testID={`request-type-${type.id}`}
                >
                  <FileText 
                    size={18} 
                    color={isSelected ? typeColor : Colors.textMuted} 
                  />
                  <View style={styles.requestTypeInfo}>
                    <Text style={[styles.requestTypeLabel, isSelected && { color: typeColor }]}>
                      {type.label}
                    </Text>
                    <Text style={styles.requestTypeDesc}>{type.description}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Organization</Text>
          <View style={styles.inputWrapper}>
            <Building2 size={18} color={Colors.textMuted} />
            <TextInput
              style={styles.textInput}
              placeholder="Your organization name"
              placeholderTextColor={Colors.textMuted}
              value={organization}
              onChangeText={setOrganization}
              testID="organization-input"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Request Title</Text>
          <TextInput
            style={styles.titleInput}
            placeholder="e.g., Climate-Smart Agriculture Technologies Review"
            placeholderTextColor={Colors.textMuted}
            value={title}
            onChangeText={setTitle}
            testID="title-input"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Describe what you're looking for, the context, and why this research is needed..."
            placeholderTextColor={Colors.textMuted}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            testID="description-input"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Budget Range (USD)</Text>
          <View style={styles.budgetRow}>
            <View style={[styles.inputWrapper, styles.budgetInput]}>
              <DollarSign size={18} color={Colors.textMuted} />
              <TextInput
                style={styles.textInput}
                placeholder="Min"
                placeholderTextColor={Colors.textMuted}
                value={budgetMin}
                onChangeText={setBudgetMin}
                keyboardType="numeric"
                testID="budget-min-input"
              />
            </View>
            <Text style={styles.budgetSeparator}>to</Text>
            <View style={[styles.inputWrapper, styles.budgetInput]}>
              <DollarSign size={18} color={Colors.textMuted} />
              <TextInput
                style={styles.textInput}
                placeholder="Max"
                placeholderTextColor={Colors.textMuted}
                value={budgetMax}
                onChangeText={setBudgetMax}
                keyboardType="numeric"
                testID="budget-max-input"
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Timeline & Deadline</Text>
          <View style={styles.inputWrapper}>
            <Clock size={18} color={Colors.textMuted} />
            <TextInput
              style={styles.textInput}
              placeholder="Expected timeline (e.g., 8-10 weeks)"
              placeholderTextColor={Colors.textMuted}
              value={timeline}
              onChangeText={setTimeline}
              testID="timeline-input"
            />
          </View>
          <View style={[styles.inputWrapper, { marginTop: 12 }]}>
            <Calendar size={18} color={Colors.textMuted} />
            <TextInput
              style={styles.textInput}
              placeholder="Submission deadline (e.g., 2026-03-15)"
              placeholderTextColor={Colors.textMuted}
              value={deadline}
              onChangeText={setDeadline}
              testID="deadline-input"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Region Focus (Optional)</Text>
          <View style={styles.inputWrapper}>
            <MapPin size={18} color={Colors.textMuted} />
            <TextInput
              style={styles.textInput}
              placeholder="e.g., East Africa, Sub-Saharan Africa"
              placeholderTextColor={Colors.textMuted}
              value={region}
              onChangeText={setRegion}
              testID="region-input"
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Scope of Work</Text>
            <TouchableOpacity style={styles.addButton} onPress={addScopeItem}>
              <Plus size={16} color={Colors.primary} />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
          {scopeItems.map((item, index) => (
            <View key={index} style={styles.listItemRow}>
              <View style={[styles.inputWrapper, styles.listInput]}>
                <Briefcase size={16} color={Colors.textMuted} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Scope item..."
                  placeholderTextColor={Colors.textMuted}
                  value={item}
                  onChangeText={(value) => updateScopeItem(index, value)}
                />
              </View>
              {scopeItems.length > 1 && (
                <TouchableOpacity 
                  style={styles.removeButton}
                  onPress={() => removeScopeItem(index)}
                >
                  <X size={18} color={Colors.error} />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Deliverables</Text>
            <TouchableOpacity style={styles.addButton} onPress={addDeliverable}>
              <Plus size={16} color={Colors.primary} />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
          {deliverables.map((item, index) => (
            <View key={index} style={styles.listItemRow}>
              <View style={[styles.inputWrapper, styles.listInput]}>
                <Target size={16} color={Colors.textMuted} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Deliverable..."
                  placeholderTextColor={Colors.textMuted}
                  value={item}
                  onChangeText={(value) => updateDeliverable(index, value)}
                />
              </View>
              {deliverables.length > 1 && (
                <TouchableOpacity 
                  style={styles.removeButton}
                  onPress={() => removeDeliverable(index)}
                >
                  <X size={18} color={Colors.error} />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Requirements</Text>
            <TouchableOpacity style={styles.addButton} onPress={addRequirement}>
              <Plus size={16} color={Colors.primary} />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
          {requirements.map((item, index) => (
            <View key={index} style={styles.listItemRow}>
              <View style={[styles.inputWrapper, styles.listInput]}>
                <CheckCircle size={16} color={Colors.textMuted} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Requirement..."
                  placeholderTextColor={Colors.textMuted}
                  value={item}
                  onChangeText={(value) => updateRequirement(index, value)}
                />
              </View>
              {requirements.length > 1 && (
                <TouchableOpacity 
                  style={styles.removeButton}
                  onPress={() => removeRequirement(index)}
                >
                  <X size={18} color={Colors.error} />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tags</Text>
          <View style={styles.tagInputRow}>
            <View style={[styles.inputWrapper, styles.tagInputWrapper]}>
              <Tag size={18} color={Colors.textMuted} />
              <TextInput
                style={styles.textInput}
                placeholder="Add tags..."
                placeholderTextColor={Colors.textMuted}
                value={tagInput}
                onChangeText={setTagInput}
                onSubmitEditing={addTag}
                testID="tag-input"
              />
            </View>
            <TouchableOpacity style={styles.addTagButton} onPress={addTag}>
              <Plus size={18} color={Colors.background} />
            </TouchableOpacity>
          </View>
          {tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {tags.map((tag) => (
                <View key={tag} style={styles.tagChip}>
                  <Text style={styles.tagChipText}>{tag}</Text>
                  <TouchableOpacity onPress={() => removeTag(tag)}>
                    <X size={14} color={Colors.textSecondary} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.subDaoNote}>
          <CheckCircle size={20} color={Colors.accent} />
          <Text style={styles.subDaoNoteText}>
            When you approve a bid, it automatically becomes a Sub-DAO with fixed scope, 
            budget, and timeline. Payments are disbursed based on milestone completion.
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          testID="submit-request-button"
        >
          <Send size={18} color={Colors.background} />
          <Text style={styles.submitButtonText}>Post Insight Request</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: Colors.primary + '15',
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.primary,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 12,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 10,
  },
  typeOption: {
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
  typeOptionSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  typeOptionText: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: Colors.textSecondary,
  },
  typeOptionTextSelected: {
    color: Colors.background,
  },
  requestTypeSelector: {
    gap: 10,
  },
  requestTypeOption: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: Colors.card,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  requestTypeInfo: {
    flex: 1,
  },
  requestTypeLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 2,
  },
  requestTypeDesc: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    paddingHorizontal: 14,
    gap: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
    paddingVertical: 14,
  },
  titleInput: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: Colors.text,
  },
  textArea: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: Colors.text,
    minHeight: 120,
  },
  budgetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  budgetInput: {
    flex: 1,
  },
  budgetSeparator: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addButtonText: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: Colors.primary,
  },
  listItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  listInput: {
    flex: 1,
  },
  removeButton: {
    padding: 8,
  },
  tagInputRow: {
    flexDirection: 'row',
    gap: 10,
  },
  tagInputWrapper: {
    flex: 1,
  },
  addTagButton: {
    backgroundColor: Colors.primary,
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  tagChipText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  subDaoNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: Colors.accent + '15',
    padding: 16,
    borderRadius: 14,
    marginTop: 8,
  },
  subDaoNoteText: {
    flex: 1,
    fontSize: 13,
    color: Colors.accent,
    lineHeight: 19,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.card,
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 14,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.background,
  },
});
