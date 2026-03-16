import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Modal } from 'react-native';
import {
  Award,
  CheckCircle,
  ThumbsUp,
  Target,
  Microscope,
  X,
  ChevronDown,
  ChevronUp,
  Star,
  Plus,
} from 'lucide-react-native';
import Colors from '@/constants/colors';

interface Endorsement {
  id: string;
  endorserId: string;
  endorserName: string;
  endorserAvatar: string;
  endorserCredibility: number;
  endorserRole: string;
  endorsedAt: string;
  endorsementType: 'quality' | 'accuracy' | 'insight' | 'methodology' | 'verification';
  comment?: string;
}

interface PeerEndorsementProps {
  endorsements: Endorsement[];
  onAddEndorsement?: (type: string, comment: string) => void;
  credibilityImpact?: number;
  compact?: boolean;
}

const getEndorsementIcon = (type: string) => {
  switch (type) {
    case 'quality':
      return <Award size={14} color="#4CAF50" />;
    case 'accuracy':
      return <CheckCircle size={14} color={Colors.primary} />;
    case 'insight':
      return <ThumbsUp size={14} color={Colors.accent} />;
    case 'methodology':
      return <Microscope size={14} color="#9C27B0" />;
    case 'verification':
      return <Target size={14} color="#FF9800" />;
    default:
      return <Award size={14} color={Colors.textMuted} />;
  }
};

const getEndorsementColor = (type: string) => {
  switch (type) {
    case 'quality':
      return '#4CAF50';
    case 'accuracy':
      return Colors.primary;
    case 'insight':
      return Colors.accent;
    case 'methodology':
      return '#9C27B0';
    case 'verification':
      return '#FF9800';
    default:
      return Colors.textMuted;
  }
};

const endorsementTypes = [
  { id: 'quality', label: 'Quality', description: 'High-quality contribution' },
  { id: 'accuracy', label: 'Accuracy', description: 'Verified accurate information' },
  { id: 'insight', label: 'Insight', description: 'Valuable insights provided' },
  { id: 'methodology', label: 'Methodology', description: 'Sound methodology' },
  { id: 'verification', label: 'Verification', description: 'Field verified' },
];

export default function PeerEndorsement({
  endorsements,
  onAddEndorsement,
  credibilityImpact,
  compact = false,
}: PeerEndorsementProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [endorsementComment, setEndorsementComment] = useState('');

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return `${Math.floor(diffDays / 7)}w ago`;
  };

  const handleSubmitEndorsement = () => {
    if (selectedType && onAddEndorsement) {
      onAddEndorsement(selectedType, endorsementComment);
      setShowAddModal(false);
      setSelectedType(null);
      setEndorsementComment('');
    }
  };

  const groupedEndorsements = endorsements.reduce((acc, endorsement) => {
    if (!acc[endorsement.endorsementType]) {
      acc[endorsement.endorsementType] = [];
    }
    acc[endorsement.endorsementType].push(endorsement);
    return acc;
  }, {} as Record<string, Endorsement[]>);

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <View style={styles.compactHeader}>
          <View style={styles.endorsementPills}>
            {Object.entries(groupedEndorsements).slice(0, 3).map(([type, items]) => (
              <View key={type} style={[styles.endorsementPill, { backgroundColor: getEndorsementColor(type) + '20' }]}>
                {getEndorsementIcon(type)}
                <Text style={[styles.endorsementPillText, { color: getEndorsementColor(type) }]}>
                  {items.length}
                </Text>
              </View>
            ))}
          </View>
          {endorsements.length > 0 && (
            <Text style={styles.compactCount}>
              {endorsements.length} endorsement{endorsements.length !== 1 ? 's' : ''}
            </Text>
          )}
        </View>
        {credibilityImpact !== undefined && credibilityImpact > 0 && (
          <View style={styles.credibilityImpactBadge}>
            <Star size={10} color={Colors.accent} />
            <Text style={styles.credibilityImpactText}>+{credibilityImpact} credibility</Text>
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.7}
      >
        <View style={styles.headerLeft}>
          <View style={styles.headerIcon}>
            <Award size={18} color={Colors.primary} />
          </View>
          <View>
            <Text style={styles.headerTitle}>Peer Endorsements</Text>
            <Text style={styles.headerSubtitle}>
              {endorsements.length} endorsement{endorsements.length !== 1 ? 's' : ''} from verified experts
            </Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          {credibilityImpact !== undefined && credibilityImpact > 0 && (
            <View style={styles.impactBadge}>
              <Star size={12} color={Colors.accent} />
              <Text style={styles.impactText}>+{credibilityImpact}</Text>
            </View>
          )}
          {isExpanded ? (
            <ChevronUp size={18} color={Colors.textMuted} />
          ) : (
            <ChevronDown size={18} color={Colors.textMuted} />
          )}
        </View>
      </TouchableOpacity>

      {!isExpanded && endorsements.length > 0 && (
        <View style={styles.previewRow}>
          <View style={styles.avatarStack}>
            {endorsements.slice(0, 3).map((endorsement, index) => (
              <Image
                key={endorsement.id}
                source={{ uri: endorsement.endorserAvatar }}
                style={[styles.stackedAvatar, { zIndex: 3 - index, marginLeft: index > 0 ? -10 : 0 }]}
              />
            ))}
          </View>
          <View style={styles.typeIcons}>
            {Object.keys(groupedEndorsements).map((type) => (
              <View key={type} style={[styles.typeIconWrapper, { backgroundColor: getEndorsementColor(type) + '20' }]}>
                {getEndorsementIcon(type)}
              </View>
            ))}
          </View>
        </View>
      )}

      {isExpanded && (
        <View style={styles.expandedContent}>
          <View style={styles.typeSummary}>
            {Object.entries(groupedEndorsements).map(([type, items]) => (
              <View key={type} style={styles.typeSummaryItem}>
                <View style={[styles.typeBadge, { backgroundColor: getEndorsementColor(type) + '20' }]}>
                  {getEndorsementIcon(type)}
                  <Text style={[styles.typeBadgeText, { color: getEndorsementColor(type) }]}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                  <View style={[styles.typeCount, { backgroundColor: getEndorsementColor(type) }]}>
                    <Text style={styles.typeCountText}>{items.length}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.endorsementsList}>
            {endorsements.map((endorsement) => (
              <View key={endorsement.id} style={styles.endorsementCard}>
                <View style={styles.endorsementHeader}>
                  <Image source={{ uri: endorsement.endorserAvatar }} style={styles.endorserAvatar} />
                  <View style={styles.endorserInfo}>
                    <Text style={styles.endorserName}>{endorsement.endorserName}</Text>
                    <View style={styles.endorserMeta}>
                      <Star size={10} color={Colors.accent} />
                      <Text style={styles.endorserScore}>{endorsement.endorserCredibility}</Text>
                      <Text style={styles.endorserRole}>· {endorsement.endorserRole}</Text>
                    </View>
                  </View>
                  <View style={[styles.endorsementTypeBadge, { backgroundColor: getEndorsementColor(endorsement.endorsementType) + '20' }]}>
                    {getEndorsementIcon(endorsement.endorsementType)}
                  </View>
                </View>
                {endorsement.comment && (
                  <Text style={styles.endorsementComment}>&ldquo;{endorsement.comment}&rdquo;</Text>
                )}
                <Text style={styles.endorsementTime}>{formatTimeAgo(endorsement.endorsedAt)}</Text>
              </View>
            ))}
          </View>

          {onAddEndorsement && (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowAddModal(true)}
            >
              <Plus size={16} color={Colors.primary} />
              <Text style={styles.addButtonText}>Add Endorsement</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <X size={24} color={Colors.text} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add Endorsement</Text>
            <TouchableOpacity
              style={[styles.submitButton, !selectedType && styles.submitButtonDisabled]}
              onPress={handleSubmitEndorsement}
              disabled={!selectedType}
            >
              <Text style={[styles.submitButtonText, !selectedType && styles.submitButtonTextDisabled]}>
                Submit
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <Text style={styles.modalSectionTitle}>Endorsement Type</Text>
            <View style={styles.typeOptions}>
              {endorsementTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.typeOption,
                    selectedType === type.id && styles.typeOptionSelected,
                    selectedType === type.id && { borderColor: getEndorsementColor(type.id) },
                  ]}
                  onPress={() => setSelectedType(type.id)}
                >
                  <View style={[styles.typeOptionIcon, { backgroundColor: getEndorsementColor(type.id) + '20' }]}>
                    {getEndorsementIcon(type.id)}
                  </View>
                  <View style={styles.typeOptionInfo}>
                    <Text style={styles.typeOptionLabel}>{type.label}</Text>
                    <Text style={styles.typeOptionDesc}>{type.description}</Text>
                  </View>
                  {selectedType === type.id && (
                    <CheckCircle size={18} color={getEndorsementColor(type.id)} />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.modalSectionTitle}>Comment (Optional)</Text>
            <TextInput
              style={styles.commentInput}
              placeholder="Add a brief comment about your endorsement..."
              placeholderTextColor={Colors.textMuted}
              value={endorsementComment}
              onChangeText={setEndorsementComment}
              multiline
              maxLength={200}
            />

            <View style={styles.impactNote}>
              <Star size={14} color={Colors.accent} />
              <Text style={styles.impactNoteText}>
                Your endorsement will contribute to the author&apos;s credibility score based on your own credibility level.
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  compactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  endorsementPills: {
    flexDirection: 'row',
    gap: 4,
  },
  endorsementPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
  },
  endorsementPillText: {
    fontSize: 10,
    fontWeight: '700' as const,
  },
  compactCount: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  credibilityImpactBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.accent + '20',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  credibilityImpactText: {
    fontSize: 10,
    fontWeight: '600' as const,
    color: Colors.accent,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  headerIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  impactBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.accent + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  impactText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: Colors.accent,
  },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  avatarStack: {
    flexDirection: 'row',
  },
  stackedAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.card,
  },
  typeIcons: {
    flexDirection: 'row',
    gap: 6,
  },
  typeIconWrapper: {
    width: 26,
    height: 26,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  expandedContent: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  typeSummary: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  typeSummaryItem: {},
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
  },
  typeBadgeText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  typeCount: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeCountText: {
    fontSize: 10,
    fontWeight: '700' as const,
    color: Colors.background,
  },
  endorsementsList: {
    gap: 10,
  },
  endorsementCard: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    padding: 12,
  },
  endorsementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  endorserAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  endorserInfo: {
    flex: 1,
  },
  endorserName: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  endorserMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  endorserScore: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: Colors.accent,
  },
  endorserRole: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  endorsementTypeBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  endorsementComment: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    marginTop: 10,
    lineHeight: 18,
  },
  endorsementTime: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.primary + '15',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 14,
  },
  addButtonText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.primary,
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
    fontSize: 17,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  submitButtonDisabled: {
    backgroundColor: Colors.backgroundSecondary,
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.background,
  },
  submitButtonTextDisabled: {
    color: Colors.textMuted,
  },
  modalContent: {
    padding: 16,
  },
  modalSectionTitle: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 12,
    marginTop: 8,
  },
  typeOptions: {
    gap: 10,
  },
  typeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.card,
    padding: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  typeOptionSelected: {
    backgroundColor: Colors.cardElevated,
    borderWidth: 2,
  },
  typeOptionIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeOptionInfo: {
    flex: 1,
  },
  typeOptionLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  typeOptionDesc: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  commentInput: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    color: Colors.text,
    minHeight: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  impactNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: Colors.accent + '15',
    padding: 12,
    borderRadius: 10,
    marginTop: 16,
  },
  impactNoteText: {
    flex: 1,
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});
