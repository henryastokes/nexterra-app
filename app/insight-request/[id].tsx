import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  FileText,
  DollarSign,
  Clock,
  Calendar,
  Building2,
  GraduationCap,
  CheckCircle,
  XCircle,
  Send,
  Briefcase,
  Eye,
  MapPin,
  Target,
  ClipboardList,
  Award,
  ArrowRight,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { insightRequests, insightRequestTypes, Bid } from '@/mocks/insightRequests';

const requestTypeColors: Record<string, string> = {
  white_paper: Colors.primary,
  feasibility_study: Colors.accent,
  landscape_review: Colors.golden,
};

const requestStatusColors: Record<string, string> = {
  open: Colors.success,
  bidding: Colors.warning,
  in_progress: Colors.primary,
  completed: Colors.textMuted,
  approved: Colors.accent,
};

const requesterTypeIcons: Record<string, React.ComponentType<{ size: number; color: string }>> = {
  funder: DollarSign,
  company: Building2,
  institution: GraduationCap,
};

export default function InsightRequestDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  useRouter();
  const insets = useSafeAreaInsets();
  
  const [showBidForm, setShowBidForm] = useState(false);
  const [bidBudget, setBidBudget] = useState('');
  const [bidTimeline, setBidTimeline] = useState('');
  const [bidProposal, setBidProposal] = useState('');

  const request = useMemo(() => {
    return insightRequests.find(r => r.id === id);
  }, [id]);

  const typeInfo = useMemo(() => {
    return insightRequestTypes.find(t => t.id === request?.type);
  }, [request?.type]);

  const handleSubmitBid = useCallback(() => {
    if (!bidBudget || !bidTimeline || !bidProposal) {
      Alert.alert('Missing Information', 'Please fill in all bid details.');
      return;
    }

    Alert.alert(
      'Bid Submitted',
      'Your bid has been submitted successfully. The requester will review and respond within 5 business days.',
      [{ text: 'OK', onPress: () => setShowBidForm(false) }]
    );

    setBidBudget('');
    setBidTimeline('');
    setBidProposal('');
  }, [bidBudget, bidTimeline, bidProposal]);

  const renderBidCard = useCallback((bid: Bid) => {
    const statusColor = bid.status === 'accepted' ? Colors.success : 
                        bid.status === 'rejected' ? Colors.error : Colors.warning;
    
    return (
      <View key={bid.id} style={styles.bidCard}>
        <View style={styles.bidHeader}>
          <View style={styles.bidTeam}>
            <Image source={{ uri: bid.teamAvatar }} style={styles.teamAvatar} />
            <View>
              <Text style={styles.teamName}>{bid.teamName}</Text>
              <Text style={styles.teamMembers}>{bid.teamMembers} team members</Text>
            </View>
          </View>
          <View style={[styles.bidStatusBadge, { backgroundColor: statusColor + '20' }]}>
            {bid.status === 'accepted' && <CheckCircle size={12} color={statusColor} />}
            {bid.status === 'rejected' && <XCircle size={12} color={statusColor} />}
            <Text style={[styles.bidStatusText, { color: statusColor }]}>
              {bid.status.toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.bidDetails}>
          <View style={styles.bidDetailItem}>
            <DollarSign size={14} color={Colors.golden} />
            <Text style={styles.bidDetailLabel}>Budget:</Text>
            <Text style={styles.bidDetailValue}>${bid.proposedBudget.toLocaleString()}</Text>
          </View>
          <View style={styles.bidDetailItem}>
            <Clock size={14} color={Colors.accent} />
            <Text style={styles.bidDetailLabel}>Timeline:</Text>
            <Text style={styles.bidDetailValue}>{bid.proposedTimeline}</Text>
          </View>
        </View>

        <Text style={styles.bidProposalLabel}>Proposal</Text>
        <Text style={styles.bidProposalText}>{bid.proposal}</Text>

        <View style={styles.bidExperience}>
          <Text style={styles.experienceLabel}>Team Experience</Text>
          <View style={styles.experienceTags}>
            {bid.experience.map((exp, index) => (
              <View key={index} style={styles.experienceTag}>
                <Award size={10} color={Colors.primary} />
                <Text style={styles.experienceText}>{exp}</Text>
              </View>
            ))}
          </View>
        </View>

        <Text style={styles.bidDate}>
          Submitted {new Date(bid.submittedAt).toLocaleDateString()}
        </Text>
      </View>
    );
  }, []);

  if (!request) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Not Found' }} />
        <View style={styles.emptyState}>
          <ClipboardList size={48} color={Colors.textMuted} />
          <Text style={styles.emptyTitle}>Request not found</Text>
        </View>
      </View>
    );
  }

  const RequesterIcon = requesterTypeIcons[request.requester.type] || Building2;
  const typeColor = requestTypeColors[request.type] || Colors.primary;
  const statusColor = requestStatusColors[request.status] || Colors.textMuted;
  const canBid = request.status === 'open' || request.status === 'bidding';

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Stack.Screen
        options={{
          title: 'Insight Request',
          headerStyle: { backgroundColor: Colors.background },
          headerTintColor: Colors.text,
          headerTitleStyle: { fontWeight: '600' as const },
        }}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerSection}>
          <View style={styles.badgesRow}>
            <View style={[styles.typeBadge, { backgroundColor: typeColor + '20' }]}>
              <FileText size={12} color={typeColor} />
              <Text style={[styles.typeText, { color: typeColor }]}>{typeInfo?.label}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
              <Text style={[styles.statusText, { color: statusColor }]}>
                {request.status.replace('_', ' ').toUpperCase()}
              </Text>
            </View>
          </View>

          <Text style={styles.title}>{request.title}</Text>

          <View style={styles.requesterCard}>
            <Image source={{ uri: request.requester.avatar }} style={styles.requesterAvatar} />
            <View style={styles.requesterInfo}>
              <Text style={styles.requesterName}>{request.requester.name}</Text>
              <View style={styles.requesterTypeRow}>
                <RequesterIcon size={12} color={Colors.textMuted} />
                <Text style={styles.requesterType}>{request.requester.organization}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <DollarSign size={20} color={Colors.golden} />
            <Text style={styles.statValue}>
              ${request.budget.min.toLocaleString()} - ${request.budget.max.toLocaleString()}
            </Text>
            <Text style={styles.statLabel}>Budget Range</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Clock size={20} color={Colors.accent} />
            <Text style={styles.statValue}>{request.timeline}</Text>
            <Text style={styles.statLabel}>Timeline</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Calendar size={20} color={Colors.error} />
            <Text style={styles.statValue}>{new Date(request.deadline).toLocaleDateString()}</Text>
            <Text style={styles.statLabel}>Deadline</Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Briefcase size={14} color={Colors.textMuted} />
            <Text style={styles.metaText}>{request.bids.length} bids</Text>
          </View>
          <View style={styles.metaItem}>
            <Eye size={14} color={Colors.textMuted} />
            <Text style={styles.metaText}>{request.views} views</Text>
          </View>
          {request.region && (
            <View style={styles.metaItem}>
              <MapPin size={14} color={Colors.textMuted} />
              <Text style={styles.metaText}>{request.region}</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{request.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Scope of Work</Text>
          {request.scope.map((item, index) => (
            <View key={index} style={styles.listItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.listItemText}>{item}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Deliverables</Text>
          {request.deliverables.map((item, index) => (
            <View key={index} style={styles.listItem}>
              <Target size={14} color={Colors.accent} />
              <Text style={styles.listItemText}>{item}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Requirements</Text>
          {request.requirements.map((item, index) => (
            <View key={index} style={styles.listItem}>
              <CheckCircle size={14} color={Colors.success} />
              <Text style={styles.listItemText}>{item}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tags</Text>
          <View style={styles.tagsContainer}>
            {request.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        {request.linkedDaos && request.linkedDaos.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Linked DAOs</Text>
            <Text style={styles.linkedDaosText}>
              This request is linked to {request.linkedDaos.length} DAO(s). 
              Successful completion may result in automatic Sub-DAO creation.
            </Text>
            <View style={styles.subDaoNote}>
              <ArrowRight size={16} color={Colors.primary} />
              <Text style={styles.subDaoNoteText}>
                Approved projects automatically become Sub-DAOs with milestone-based funding
              </Text>
            </View>
          </View>
        )}

        {request.bids.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Current Bids ({request.bids.length})</Text>
            {request.bids.map(renderBidCard)}
          </View>
        )}

        {showBidForm && canBid && (
          <View style={styles.bidFormSection}>
            <Text style={styles.sectionTitle}>Submit Your Bid</Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Proposed Budget (USD)</Text>
              <View style={styles.inputWrapper}>
                <DollarSign size={18} color={Colors.textMuted} />
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g., 25000"
                  placeholderTextColor={Colors.textMuted}
                  value={bidBudget}
                  onChangeText={setBidBudget}
                  keyboardType="numeric"
                  testID="bid-budget-input"
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Proposed Timeline</Text>
              <View style={styles.inputWrapper}>
                <Clock size={18} color={Colors.textMuted} />
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g., 8 weeks"
                  placeholderTextColor={Colors.textMuted}
                  value={bidTimeline}
                  onChangeText={setBidTimeline}
                  testID="bid-timeline-input"
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Your Proposal</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Describe your approach, team qualifications, and why you're the right fit for this project..."
                placeholderTextColor={Colors.textMuted}
                value={bidProposal}
                onChangeText={setBidProposal}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                testID="bid-proposal-input"
              />
            </View>

            <View style={styles.bidFormActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowBidForm(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitBidButton}
                onPress={handleSubmitBid}
                testID="submit-bid-button"
              >
                <Send size={16} color={Colors.background} />
                <Text style={styles.submitBidButtonText}>Submit Bid</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {canBid && !showBidForm && (
        <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
          <View style={styles.bottomInfo}>
            <Text style={styles.bottomInfoLabel}>Budget Range</Text>
            <Text style={styles.bottomInfoValue}>
              ${request.budget.min.toLocaleString()} - ${request.budget.max.toLocaleString()}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.bidButton}
            onPress={() => setShowBidForm(true)}
            testID="place-bid-button"
          >
            <Briefcase size={18} color={Colors.background} />
            <Text style={styles.bidButtonText}>Place Bid</Text>
          </TouchableOpacity>
        </View>
      )}
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
  headerSection: {
    marginBottom: 20,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700' as const,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.text,
    lineHeight: 30,
    marginBottom: 16,
  },
  requesterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.card,
    padding: 14,
    borderRadius: 12,
  },
  requesterAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  requesterInfo: {
    flex: 1,
  },
  requesterName: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  requesterTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  requesterType: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.border,
    marginHorizontal: 8,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 24,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 10,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
    marginTop: 6,
  },
  listItemText: {
    flex: 1,
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  linkedDaosText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  subDaoNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.primary + '15',
    padding: 12,
    borderRadius: 10,
  },
  subDaoNoteText: {
    flex: 1,
    fontSize: 13,
    color: Colors.primary,
    lineHeight: 18,
  },
  bidCard: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  bidHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  bidTeam: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  teamAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  teamName: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  teamMembers: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  bidStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  bidStatusText: {
    fontSize: 10,
    fontWeight: '600' as const,
  },
  bidDetails: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 14,
  },
  bidDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bidDetailLabel: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  bidDetailValue: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  bidProposalLabel: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.textMuted,
    marginBottom: 6,
  },
  bidProposalText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 14,
  },
  bidExperience: {
    marginBottom: 10,
  },
  experienceLabel: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.textMuted,
    marginBottom: 8,
  },
  experienceTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  experienceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.card,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  experienceText: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  bidDate: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  bidFormSection: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    marginTop: 8,
  },
  formGroup: {
    marginBottom: 18,
  },
  formLabel: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 10,
    paddingHorizontal: 14,
    gap: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
    paddingVertical: 14,
  },
  textArea: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    color: Colors.text,
    minHeight: 120,
  },
  bidFormActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  submitBidButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
  },
  submitBidButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.background,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.card,
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  bottomInfo: {
    flex: 1,
  },
  bottomInfoLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  bottomInfoValue: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  bidButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  bidButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.background,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text,
  },
});
