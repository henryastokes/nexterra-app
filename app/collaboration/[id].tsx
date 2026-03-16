import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Users,
  Briefcase,
  Clock,
  DollarSign,
  CheckCircle,
  Link2,
  MessageCircle,
  Send,
  X,
  FileText,
  ChevronDown,
  ChevronUp,
  Globe,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { collaborations, Collaboration } from '@/mocks/collaborations';

export default function CollaborationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState('');
  const [directMessage, setDirectMessage] = useState('');
  const [expandedSection, setExpandedSection] = useState<string | null>('requirements');
  const [hasApplied, setHasApplied] = useState(false);
  
  const modalAnim = useRef(new Animated.Value(0)).current;

  const collaboration = collaborations.find((c) => c.id === id);

  if (!collaboration) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Collaboration not found</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const getStatusColor = (status: Collaboration['status']) => {
    switch (status) {
      case 'Open':
        return Colors.success;
      case 'In Progress':
        return Colors.warning;
      case 'Filled':
        return Colors.textMuted;
      default:
        return Colors.textMuted;
    }
  };

  const getTypeColor = (type: Collaboration['type']) => {
    switch (type) {
      case 'Research':
        return '#6B8AFF';
      case 'Field Work':
        return Colors.primary;
      case 'Technical':
        return '#FF6B9D';
      case 'Policy':
        return Colors.accent;
      case 'Community':
        return '#8B6BFF';
      default:
        return Colors.textMuted;
    }
  };

  const openModal = (type: 'apply' | 'message') => {
    if (type === 'apply') {
      setShowApplyModal(true);
    } else {
      setShowMessageModal(true);
    }
    Animated.spring(modalAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 65,
      friction: 10,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(modalAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setShowApplyModal(false);
      setShowMessageModal(false);
    });
  };

  const handleApply = () => {
    if (!applicationMessage.trim()) {
      Alert.alert('Error', 'Please include a message with your application');
      return;
    }
    setHasApplied(true);
    closeModal();
    setApplicationMessage('');
    Alert.alert(
      'Application Submitted',
      'Your application has been sent to the project lead. You will be notified when they respond.',
      [{ text: 'OK' }]
    );
  };

  const handleSendMessage = () => {
    if (!directMessage.trim()) {
      Alert.alert('Error', 'Please enter a message');
      return;
    }
    closeModal();
    setDirectMessage('');
    Alert.alert(
      'Message Sent',
      `Your message has been sent to ${collaboration.postedBy.name}.`,
      [{ text: 'OK' }]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const CollapsibleSection = ({
    title,
    sectionKey,
    children,
  }: {
    title: string;
    sectionKey: string;
    children: React.ReactNode;
  }) => {
    const isExpanded = expandedSection === sectionKey;
    return (
      <View style={styles.collapsibleSection}>
        <TouchableOpacity
          style={styles.collapsibleHeader}
          onPress={() => setExpandedSection(isExpanded ? null : sectionKey)}
        >
          <Text style={styles.collapsibleTitle}>{title}</Text>
          {isExpanded ? (
            <ChevronUp size={20} color={Colors.textSecondary} />
          ) : (
            <ChevronDown size={20} color={Colors.textSecondary} />
          )}
        </TouchableOpacity>
        {isExpanded && <View style={styles.collapsibleContent}>{children}</View>}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          Opportunity
        </Text>
        <View style={styles.headerButton} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.topSection}>
            <View style={styles.orgRow}>
              <Image source={{ uri: collaboration.organizationLogo }} style={styles.orgLogo} />
              <View style={styles.orgInfo}>
                <Text style={styles.orgName}>{collaboration.organization}</Text>
                <View style={styles.locationRow}>
                  <MapPin size={14} color={Colors.textMuted} />
                  <Text style={styles.locationText}>{collaboration.location}</Text>
                </View>
              </View>
            </View>

            <View style={styles.badgesRow}>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(collaboration.status) + '20' },
                ]}
              >
                <View
                  style={[styles.statusDot, { backgroundColor: getStatusColor(collaboration.status) }]}
                />
                <Text style={[styles.statusText, { color: getStatusColor(collaboration.status) }]}>
                  {collaboration.status}
                </Text>
              </View>
              <View
                style={[
                  styles.typeBadge,
                  { backgroundColor: getTypeColor(collaboration.type) + '20' },
                ]}
              >
                <Briefcase size={14} color={getTypeColor(collaboration.type)} />
                <Text style={[styles.typeText, { color: getTypeColor(collaboration.type) }]}>
                  {collaboration.type}
                </Text>
              </View>
            </View>

            <Text style={styles.title}>{collaboration.title}</Text>

            <View style={styles.metaGrid}>
              <View style={styles.metaItem}>
                <Clock size={18} color={Colors.primary} />
                <View>
                  <Text style={styles.metaLabel}>Duration</Text>
                  <Text style={styles.metaValue}>{collaboration.timeline.duration}</Text>
                </View>
              </View>
              <View style={styles.metaItem}>
                <Calendar size={18} color={Colors.primary} />
                <View>
                  <Text style={styles.metaLabel}>Start Date</Text>
                  <Text style={styles.metaValue}>{formatDate(collaboration.timeline.startDate)}</Text>
                </View>
              </View>
              <View style={styles.metaItem}>
                <Users size={18} color={Colors.primary} />
                <View>
                  <Text style={styles.metaLabel}>Applicants</Text>
                  <Text style={styles.metaValue}>
                    {collaboration.applicants}/{collaboration.maxCollaborators}
                  </Text>
                </View>
              </View>
              <View style={styles.metaItem}>
                <DollarSign size={18} color={Colors.primary} />
                <View>
                  <Text style={styles.metaLabel}>Compensation</Text>
                  <Text style={styles.metaValue}>{collaboration.compensation.type}</Text>
                </View>
              </View>
            </View>

            {collaboration.compensation.amount && (
              <View style={styles.compensationCard}>
                <DollarSign size={20} color={Colors.success} />
                <Text style={styles.compensationText}>{collaboration.compensation.amount}</Text>
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{collaboration.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Required Expertise</Text>
            <View style={styles.expertiseGrid}>
              {collaboration.expertise.map((exp) => (
                <View key={exp} style={styles.expertiseBadge}>
                  <Text style={styles.expertiseText}>{exp}</Text>
                </View>
              ))}
            </View>
          </View>

          <CollapsibleSection title="Requirements" sectionKey="requirements">
            {collaboration.requirements.map((req, index) => (
              <View key={index} style={styles.listItem}>
                <CheckCircle size={16} color={Colors.primary} />
                <Text style={styles.listItemText}>{req}</Text>
              </View>
            ))}
          </CollapsibleSection>

          <CollapsibleSection title="Responsibilities" sectionKey="responsibilities">
            {collaboration.responsibilities.map((resp, index) => (
              <View key={index} style={styles.listItem}>
                <View style={styles.bulletDot} />
                <Text style={styles.listItemText}>{resp}</Text>
              </View>
            ))}
          </CollapsibleSection>

          {(collaboration.linkedProposal || collaboration.linkedDAO) && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Linked Initiatives</Text>
              <View style={styles.linkedItems}>
                {collaboration.linkedProposal && (
                  <TouchableOpacity style={styles.linkedItem}>
                    <FileText size={18} color={Colors.accent} />
                    <View style={styles.linkedInfo}>
                      <Text style={styles.linkedLabel}>Proposal</Text>
                      <Text style={styles.linkedTitle}>{collaboration.linkedProposal.title}</Text>
                    </View>
                    <Link2 size={16} color={Colors.textMuted} />
                  </TouchableOpacity>
                )}
                {collaboration.linkedDAO && (
                  <TouchableOpacity style={styles.linkedItem}>
                    <Globe size={18} color={Colors.primary} />
                    <View style={styles.linkedInfo}>
                      <Text style={styles.linkedLabel}>DAO</Text>
                      <Text style={styles.linkedTitle}>{collaboration.linkedDAO.name}</Text>
                    </View>
                    <Link2 size={16} color={Colors.textMuted} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Posted By</Text>
            <TouchableOpacity
              style={styles.postedByCard}
              onPress={() => router.push(`/user/${collaboration.postedBy.id}`)}
            >
              <Image source={{ uri: collaboration.postedBy.avatar }} style={styles.posterAvatar} />
              <View style={styles.posterInfo}>
                <Text style={styles.posterName}>{collaboration.postedBy.name}</Text>
                <Text style={styles.posterRole}>{collaboration.postedBy.role}</Text>
              </View>
              <Text style={styles.postedDate}>Posted {formatDate(collaboration.postedDate)}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tagsSection}>
            <Text style={styles.sectionTitle}>Tags</Text>
            <View style={styles.tagsRow}>
              {collaboration.tags.map((tag) => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.bottomSpacing} />
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.messageButton}
          onPress={() => openModal('message')}
        >
          <MessageCircle size={20} color={Colors.text} />
          <Text style={styles.messageButtonText}>Message</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.applyButton,
            (collaboration.status === 'Filled' || hasApplied) && styles.applyButtonDisabled,
          ]}
          onPress={() => openModal('apply')}
          disabled={collaboration.status === 'Filled' || hasApplied}
        >
          {hasApplied ? (
            <>
              <CheckCircle size={20} color={Colors.background} />
              <Text style={styles.applyButtonText}>Applied</Text>
            </>
          ) : (
            <Text style={styles.applyButtonText}>
              {collaboration.status === 'Filled' ? 'Position Filled' : 'Apply to Collaborate'}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {(showApplyModal || showMessageModal) && (
        <Animated.View
          style={[
            styles.modalOverlay,
            {
              opacity: modalAnim,
            },
          ]}
        >
          <TouchableOpacity style={styles.modalBackdrop} onPress={closeModal} activeOpacity={1} />
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
          >
            <Animated.View
              style={[
                styles.modalContent,
                {
                  transform: [
                    {
                      translateY: modalAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [300, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {showApplyModal ? 'Apply to Collaborate' : 'Send Message'}
                </Text>
                <TouchableOpacity onPress={closeModal}>
                  <X size={24} color={Colors.text} />
                </TouchableOpacity>
              </View>

              {showApplyModal ? (
                <>
                  <Text style={styles.modalSubtitle}>
                    Your application will be sent to {collaboration.postedBy.name}
                  </Text>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Introduce yourself and explain why you're a good fit for this opportunity..."
                    placeholderTextColor={Colors.textMuted}
                    value={applicationMessage}
                    onChangeText={setApplicationMessage}
                    multiline
                    numberOfLines={6}
                    textAlignVertical="top"
                  />
                  <TouchableOpacity style={styles.submitButton} onPress={handleApply}>
                    <Send size={18} color={Colors.background} />
                    <Text style={styles.submitButtonText}>Submit Application</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <View style={styles.modalRecipient}>
                    <Image
                      source={{ uri: collaboration.postedBy.avatar }}
                      style={styles.modalRecipientAvatar}
                    />
                    <View>
                      <Text style={styles.modalRecipientName}>{collaboration.postedBy.name}</Text>
                      <Text style={styles.modalRecipientRole}>{collaboration.postedBy.role}</Text>
                    </View>
                  </View>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Type your message..."
                    placeholderTextColor={Colors.textMuted}
                    value={directMessage}
                    onChangeText={setDirectMessage}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                  <TouchableOpacity style={styles.submitButton} onPress={handleSendMessage}>
                    <Send size={18} color={Colors.background} />
                    <Text style={styles.submitButtonText}>Send Message</Text>
                  </TouchableOpacity>
                </>
              )}
            </Animated.View>
          </KeyboardAvoidingView>
        </Animated.View>
      )}
    </SafeAreaView>
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.text,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: Colors.text,
    marginBottom: 16,
  },
  backButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: Colors.primary,
    borderRadius: 8,
  },
  backButtonText: {
    color: Colors.background,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  topSection: {
    marginBottom: 24,
  },
  orgRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  orgLogo: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: Colors.cardElevated,
  },
  orgInfo: {
    marginLeft: 12,
    flex: 1,
  },
  orgName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  typeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    lineHeight: 30,
    marginBottom: 20,
  },
  metaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 10,
    width: '48%',
  },
  metaLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  metaValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  compensationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.success + '15',
    padding: 14,
    borderRadius: 12,
    gap: 10,
  },
  compensationText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.success,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  expertiseGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  expertiseBadge: {
    backgroundColor: Colors.card,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  expertiseText: {
    fontSize: 13,
    color: Colors.text,
    fontWeight: '500',
  },
  collapsibleSection: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    marginBottom: 12,
    overflow: 'hidden',
  },
  collapsibleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  collapsibleTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  collapsibleContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 10,
  },
  listItemText: {
    flex: 1,
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
    marginTop: 7,
  },
  linkedItems: {
    gap: 10,
  },
  linkedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    padding: 14,
    borderRadius: 12,
    gap: 12,
  },
  linkedInfo: {
    flex: 1,
  },
  linkedLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  linkedTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  postedByCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    padding: 14,
    borderRadius: 12,
  },
  posterAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.cardElevated,
  },
  posterInfo: {
    flex: 1,
    marginLeft: 12,
  },
  posterName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  posterRole: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  postedDate: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  tagsSection: {
    marginBottom: 24,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: Colors.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  tagText: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  bottomSpacing: {
    height: 100,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 32,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 12,
  },
  messageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.card,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  messageButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  applyButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  applyButtonDisabled: {
    backgroundColor: Colors.textMuted,
  },
  applyButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.background,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    flex: 1,
  },
  keyboardView: {
    width: '100%',
  },
  modalContent: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  modalSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  modalRecipient: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardElevated,
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  modalRecipientAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  modalRecipientName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  modalRecipientRole: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  modalInput: {
    backgroundColor: Colors.cardElevated,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: Colors.text,
    minHeight: 120,
    marginBottom: 16,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.background,
  },
});
