import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import {
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
  Clock,
  MapPin,
  DollarSign,
  Users,
  FileText,
  Image as ImageIcon,
  Video,
  Mic,
  Download,
  CheckCircle,
  AlertTriangle,
  Link2,
  Calendar,
  Shield,
  ExternalLink,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import {
  votingProposals,
  votingAsks,
  getDaysRemaining,
  calculateVotingDeadline,
  linkedDaos,
  ProposalSubmission,
  AskSubmission,
  SubmissionAttachment,
} from '@/mocks/submissions';

type VoteChoice = 'yes' | 'no' | null;
type FundingPreference = 25 | 50 | 100 | null;

export default function VoteDetailScreen() {
  const { id, type } = useLocalSearchParams<{ id: string; type: string }>();
  const router = useRouter();
  
  const [voteChoice, setVoteChoice] = useState<VoteChoice>(null);
  const [fundingPreference, setFundingPreference] = useState<FundingPreference>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);

  const item = useMemo(() => {
    if (type === 'proposal') {
      return votingProposals.find((p) => p.id === id);
    }
    return votingAsks.find((a) => a.id === id);
  }, [id, type]);

  const isProposal = type === 'proposal';
  const proposal = isProposal ? (item as ProposalSubmission) : null;
  const ask = !isProposal ? (item as AskSubmission) : null;

  if (!item) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Item not found</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const daysLeft = getDaysRemaining(item.submittedAt);
  const deadline = new Date(calculateVotingDeadline(item.submittedAt));
  const daoName = item.linkedDao ? linkedDaos.find((d) => d.id === item.linkedDao)?.name : null;

  const getAttachmentIcon = (type: string) => {
    switch (type) {
      case 'document':
        return <FileText size={18} color={Colors.primary} />;
      case 'photo':
        return <ImageIcon size={18} color={Colors.success} />;
      case 'video':
        return <Video size={18} color={Colors.accent} />;
      case 'audio':
        return <Mic size={18} color={Colors.warning} />;
      default:
        return <FileText size={18} color={Colors.textMuted} />;
    }
  };

  const getUrgencyColor = (urgency?: string) => {
    switch (urgency) {
      case 'critical':
        return Colors.error;
      case 'high':
        return Colors.warning;
      case 'medium':
        return Colors.accent;
      default:
        return Colors.textMuted;
    }
  };

  const generateTransactionHash = () => {
    const chars = '0123456789abcdef';
    let hash = '0x';
    for (let i = 0; i < 64; i++) {
      hash += chars[Math.floor(Math.random() * chars.length)];
    }
    return hash;
  };

  const handleSubmitVote = async () => {
    if (!voteChoice) {
      Alert.alert('Vote Required', 'Please select Yes or No to cast your vote.');
      return;
    }

    if (voteChoice === 'yes' && !fundingPreference) {
      Alert.alert('Funding Preference Required', 'Please select your funding preference (25%, 50%, or 100%).');
      return;
    }

    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const hash = generateTransactionHash();
    setTransactionHash(hash);
    setHasVoted(true);
    setIsSubmitting(false);

    console.log('Vote submitted:', {
      itemId: id,
      itemType: type,
      vote: voteChoice,
      fundingPreference: voteChoice === 'yes' ? fundingPreference : null,
      transactionHash: hash,
      timestamp: new Date().toISOString(),
    });

    Alert.alert(
      'Vote Recorded on Blockchain',
      `Your vote has been successfully recorded.\n\nTransaction: ${hash.slice(0, 18)}...`,
      [{ text: 'OK' }]
    );
  };

  const renderAttachment = (attachment: SubmissionAttachment) => (
    <TouchableOpacity key={attachment.id} style={styles.attachmentItem} activeOpacity={0.7}>
      <View style={styles.attachmentIcon}>{getAttachmentIcon(attachment.type)}</View>
      <View style={styles.attachmentInfo}>
        <Text style={styles.attachmentName} numberOfLines={1}>
          {attachment.name}
        </Text>
        <Text style={styles.attachmentSize}>{attachment.size}</Text>
      </View>
      <Download size={18} color={Colors.textMuted} />
    </TouchableOpacity>
  );

  const renderVoteButton = (choice: VoteChoice, label: string, icon: React.ReactNode) => (
    <TouchableOpacity
      style={[
        styles.voteOptionButton,
        choice === 'yes' ? styles.voteYesButton : styles.voteNoButton,
        voteChoice === choice && styles.voteOptionSelected,
        hasVoted && styles.voteOptionDisabled,
      ]}
      onPress={() => !hasVoted && setVoteChoice(choice)}
      activeOpacity={hasVoted ? 1 : 0.7}
      disabled={hasVoted}
    >
      {icon}
      <Text
        style={[
          styles.voteOptionText,
          choice === 'yes' ? styles.voteYesText : styles.voteNoText,
          voteChoice === choice && styles.voteOptionTextSelected,
        ]}
      >
        {label}
      </Text>
      {voteChoice === choice && !hasVoted && (
        <CheckCircle size={18} color={choice === 'yes' ? Colors.success : Colors.error} />
      )}
    </TouchableOpacity>
  );

  const renderFundingOption = (percentage: FundingPreference) => (
    <TouchableOpacity
      key={percentage}
      style={[
        styles.fundingOption,
        fundingPreference === percentage && styles.fundingOptionSelected,
        (hasVoted || voteChoice !== 'yes') && styles.fundingOptionDisabled,
      ]}
      onPress={() => !hasVoted && voteChoice === 'yes' && setFundingPreference(percentage)}
      activeOpacity={hasVoted || voteChoice !== 'yes' ? 1 : 0.7}
      disabled={hasVoted || voteChoice !== 'yes'}
    >
      <Text
        style={[
          styles.fundingOptionText,
          fundingPreference === percentage && styles.fundingOptionTextSelected,
        ]}
      >
        {percentage}%
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBack} onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <View style={[styles.typeBadge, isProposal ? styles.proposalBadge : styles.askBadge]}>
            <Text style={styles.typeBadgeText}>{isProposal ? 'Proposal' : 'Ask'}</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.timeIndicator}>
            <Clock size={14} color={Colors.accent} />
            <Text style={styles.timeText}>{daysLeft}d left</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.title}>{item.title}</Text>

        <View style={styles.submitterSection}>
          <Image source={{ uri: item.submittedBy.avatar }} style={styles.submitterAvatar} />
          <View style={styles.submitterInfo}>
            <Text style={styles.submitterName}>{item.submittedBy.name}</Text>
            <Text style={styles.submittedDate}>
              Submitted {new Date(item.submittedAt).toLocaleDateString()}
            </Text>
          </View>
        </View>

        <View style={styles.metaGrid}>
          {item.country && (
            <View style={styles.metaCard}>
              <MapPin size={16} color={Colors.primary} />
              <Text style={styles.metaLabel}>Location</Text>
              <Text style={styles.metaValue}>
                {item.country}
                {item.region ? `, ${item.region}` : ''}
              </Text>
            </View>
          )}

          {(proposal?.budget || ask?.targetAmount) && (
            <View style={styles.metaCard}>
              <DollarSign size={16} color={Colors.primary} />
              <Text style={styles.metaLabel}>{isProposal ? 'Budget' : 'Target'}</Text>
              <Text style={styles.metaValue}>
                {(proposal?.budget || ask?.targetAmount)?.toLocaleString()}{' '}
                {proposal?.currency || ask?.currency || 'USDC'}
              </Text>
            </View>
          )}

          {proposal?.issueArea && (
            <View style={styles.metaCard}>
              <AlertTriangle size={16} color={Colors.accent} />
              <Text style={styles.metaLabel}>Issue Area</Text>
              <Text style={styles.metaValue}>{proposal.issueArea}</Text>
            </View>
          )}

          {ask?.urgency && (
            <View style={styles.metaCard}>
              <AlertTriangle size={16} color={getUrgencyColor(ask.urgency)} />
              <Text style={styles.metaLabel}>Urgency</Text>
              <Text style={[styles.metaValue, { color: getUrgencyColor(ask.urgency) }]}>
                {ask.urgency.charAt(0).toUpperCase() + ask.urgency.slice(1)}
              </Text>
            </View>
          )}

          {ask?.requestType && (
            <View style={styles.metaCard}>
              <Link2 size={16} color={Colors.primary} />
              <Text style={styles.metaLabel}>Request Type</Text>
              <Text style={styles.metaValue}>
                {ask.requestType.charAt(0).toUpperCase() + ask.requestType.slice(1)}
              </Text>
            </View>
          )}

          <View style={styles.metaCard}>
            <Calendar size={16} color={Colors.warning} />
            <Text style={styles.metaLabel}>Voting Ends</Text>
            <Text style={styles.metaValue}>{deadline.toLocaleDateString()}</Text>
          </View>
        </View>

        {daoName && (
          <View style={styles.daoSection}>
            <Users size={16} color={Colors.primary} />
            <Text style={styles.daoLabel}>Linked to</Text>
            <Text style={styles.daoName}>{daoName}</Text>
          </View>
        )}

        {proposal?.timeline && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Timeline</Text>
            <View style={styles.timelineCard}>
              <View style={styles.timelineRow}>
                <Text style={styles.timelineLabel}>Start Date</Text>
                <Text style={styles.timelineValue}>
                  {new Date(proposal.timeline.startDate).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.timelineRow}>
                <Text style={styles.timelineLabel}>End Date</Text>
                <Text style={styles.timelineValue}>
                  {new Date(proposal.timeline.endDate).toLocaleDateString()}
                </Text>
              </View>
              {proposal.timeline.milestones && (
                <View style={styles.milestonesContainer}>
                  <Text style={styles.milestonesTitle}>Milestones</Text>
                  {proposal.timeline.milestones.map((milestone, index) => (
                    <View key={index} style={styles.milestoneItem}>
                      <View style={styles.milestoneDot} />
                      <Text style={styles.milestoneText}>{milestone}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>

        {ask?.expertiseNeeded && ask.expertiseNeeded.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Expertise Needed</Text>
            <View style={styles.tagsContainer}>
              {ask.expertiseNeeded.map((expertise, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{expertise}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {ask?.resourcesNeeded && ask.resourcesNeeded.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Resources Needed</Text>
            <View style={styles.tagsContainer}>
              {ask.resourcesNeeded.map((resource, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{resource}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {item.attachments && item.attachments.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Attachments ({item.attachments.length})</Text>
            <View style={styles.attachmentsList}>
              {item.attachments.map(renderAttachment)}
            </View>
          </View>
        )}

        {isProposal && proposal?.votesFor !== undefined && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Current Votes</Text>
            <View style={styles.votesDisplay}>
              <View style={styles.voteBar}>
                <View
                  style={[
                    styles.voteBarFill,
                    {
                      width: `${
                        ((proposal.votesFor || 0) /
                          ((proposal.votesFor || 0) + (proposal.votesAgainst || 1))) *
                        100
                      }%`,
                    },
                  ]}
                />
              </View>
              <View style={styles.voteNumbers}>
                <View style={styles.voteNumberItem}>
                  <ThumbsUp size={16} color={Colors.success} />
                  <Text style={styles.voteNumber}>{proposal.votesFor?.toLocaleString()}</Text>
                  <Text style={styles.voteLabel}>Yes</Text>
                </View>
                <View style={styles.voteNumberItem}>
                  <ThumbsDown size={16} color={Colors.error} />
                  <Text style={styles.voteNumber}>{proposal.votesAgainst?.toLocaleString()}</Text>
                  <Text style={styles.voteLabel}>No</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        <View style={styles.votingSection}>
          <View style={styles.votingSectionHeader}>
            <Shield size={20} color={Colors.primary} />
            <Text style={styles.votingSectionTitle}>Cast Your Vote</Text>
          </View>
          <Text style={styles.votingNote}>
            All votes are recorded on the blockchain for transparency.
          </Text>

          {hasVoted && transactionHash && (
            <View style={styles.transactionInfo}>
              <CheckCircle size={18} color={Colors.success} />
              <View style={styles.transactionDetails}>
                <Text style={styles.transactionLabel}>Vote Recorded</Text>
                <TouchableOpacity style={styles.transactionHashContainer}>
                  <Text style={styles.transactionHash} numberOfLines={1}>
                    {transactionHash}
                  </Text>
                  <ExternalLink size={14} color={Colors.primary} />
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View style={styles.voteOptionsRow}>
            {renderVoteButton(
              'yes',
              'Yes',
              <ThumbsUp size={20} color={voteChoice === 'yes' ? Colors.success : Colors.textMuted} />
            )}
            {renderVoteButton(
              'no',
              'No',
              <ThumbsDown size={20} color={voteChoice === 'no' ? Colors.error : Colors.textMuted} />
            )}
          </View>

          {voteChoice === 'yes' && (
            <View style={styles.fundingSection}>
              <Text style={styles.fundingTitle}>Funding Preference</Text>
              <Text style={styles.fundingSubtitle}>
                What percentage of the requested amount do you support?
              </Text>
              <View style={styles.fundingOptions}>
                {renderFundingOption(25)}
                {renderFundingOption(50)}
                {renderFundingOption(100)}
              </View>
            </View>
          )}

          {!hasVoted && (
            <TouchableOpacity
              style={[
                styles.submitButton,
                (!voteChoice || (voteChoice === 'yes' && !fundingPreference)) &&
                  styles.submitButtonDisabled,
                isSubmitting && styles.submitButtonLoading,
              ]}
              onPress={handleSubmitVote}
              disabled={!voteChoice || (voteChoice === 'yes' && !fundingPreference) || isSubmitting}
              activeOpacity={0.8}
            >
              <Text style={styles.submitButtonText}>
                {isSubmitting ? 'Recording on Blockchain...' : 'Submit Vote'}
              </Text>
            </TouchableOpacity>
          )}

          {hasVoted && (
            <View style={styles.votedConfirmation}>
              <CheckCircle size={24} color={Colors.success} />
              <Text style={styles.votedText}>
                You voted {voteChoice === 'yes' ? 'Yes' : 'No'}
                {voteChoice === 'yes' && fundingPreference && ` (${fundingPreference}% funding)`}
              </Text>
            </View>
          )}
        </View>
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
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerBack: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerRight: {
    width: 80,
    alignItems: 'flex-end',
  },
  typeBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 10,
  },
  proposalBadge: {
    backgroundColor: Colors.primary,
  },
  askBadge: {
    backgroundColor: Colors.golden,
  },
  typeBadgeText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: Colors.background,
    textTransform: 'uppercase',
  },
  timeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.card,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.accent,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.text,
    paddingHorizontal: 20,
    paddingTop: 20,
    lineHeight: 32,
  },
  submitterSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 12,
  },
  submitterAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  submitterInfo: {
    flex: 1,
  },
  submitterName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  submittedDate: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  metaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 10,
  },
  metaCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 12,
    minWidth: '47%',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  metaLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 6,
    textTransform: 'uppercase',
  },
  metaValue: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
    marginTop: 2,
  },
  daoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: Colors.backgroundSecondary,
    padding: 14,
    borderRadius: 12,
    gap: 8,
  },
  daoLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  daoName: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.primary,
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  timelineCard: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  timelineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  timelineLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  timelineValue: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  milestonesContainer: {
    paddingTop: 12,
  },
  milestonesTitle: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.textMuted,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  milestoneItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    gap: 10,
  },
  milestoneDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  milestoneText: {
    fontSize: 14,
    color: Colors.text,
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
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tagText: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '500' as const,
  },
  attachmentsList: {
    gap: 10,
  },
  attachmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  attachmentIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: Colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  attachmentInfo: {
    flex: 1,
    marginLeft: 12,
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
  votesDisplay: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  voteBar: {
    height: 10,
    backgroundColor: Colors.error,
    borderRadius: 5,
    overflow: 'hidden',
  },
  voteBarFill: {
    height: '100%',
    backgroundColor: Colors.success,
    borderRadius: 5,
  },
  voteNumbers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  voteNumberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  voteNumber: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  voteLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  votingSection: {
    marginHorizontal: 20,
    marginTop: 30,
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  votingSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  votingSectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  votingNote: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 20,
  },
  transactionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundSecondary,
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
    gap: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionLabel: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.success,
  },
  transactionHashContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  transactionHash: {
    fontSize: 11,
    color: Colors.textMuted,
    fontFamily: 'monospace',
    flex: 1,
  },
  voteOptionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  voteOptionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 14,
    gap: 10,
    borderWidth: 2,
  },
  voteYesButton: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderColor: Colors.border,
  },
  voteNoButton: {
    backgroundColor: 'rgba(239, 83, 80, 0.1)',
    borderColor: Colors.border,
  },
  voteOptionSelected: {
    borderColor: Colors.primary,
  },
  voteOptionDisabled: {
    opacity: 0.6,
  },
  voteOptionText: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  voteYesText: {
    color: Colors.textSecondary,
  },
  voteNoText: {
    color: Colors.textSecondary,
  },
  voteOptionTextSelected: {
    color: Colors.text,
  },
  fundingSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  fundingTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  fundingSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 14,
  },
  fundingOptions: {
    flexDirection: 'row',
    gap: 10,
  },
  fundingOption: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  fundingOptionSelected: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(200, 232, 75, 0.1)',
  },
  fundingOptionDisabled: {
    opacity: 0.5,
  },
  fundingOptionText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.textSecondary,
  },
  fundingOptionTextSelected: {
    color: Colors.primary,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: Colors.textMuted,
    opacity: 0.5,
  },
  submitButtonLoading: {
    backgroundColor: Colors.primaryDim,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.background,
  },
  votedConfirmation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: 14,
  },
  votedText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.success,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: Colors.textSecondary,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  backButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.background,
  },
});
