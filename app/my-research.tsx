import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Switch,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  BookOpen,
  Plus,
  FileText,
  Clock,
  Edit3,
  CheckCircle2,
  AlertCircle,
  DollarSign,
  Users2,
  Download,
  Trash2,
  X,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { userResearch, UserResearch, ResearchPricingType, ResearchCoAuthor } from '@/mocks/userProfile';

export default function MyResearchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [researchPapers, setResearchPapers] = useState<UserResearch[]>(userResearch);
  const [showResearchUploadModal, setShowResearchUploadModal] = useState(false);
  const [showCoAuthorModal, setShowCoAuthorModal] = useState(false);

  const [researchForm, setResearchForm] = useState({
    title: '',
    abstract: '',
    pricingType: 'free' as ResearchPricingType,
    price: '',
    tags: '',
    focusArea: '',
    coAuthors: [] as ResearchCoAuthor[],
    hasWaivers: false,
  });

  const [coAuthorForm, setCoAuthorForm] = useState({
    name: '',
    walletAddress: '',
    splitPercentage: '',
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return Colors.success;
      case 'pending_approval':
        return Colors.accent;
      case 'rejected':
        return Colors.error;
      default:
        return Colors.textMuted;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Published';
      case 'pending_approval':
        return 'Pending Review';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Draft';
    }
  };

  const handleResearchUpload = () => {
    if (!researchForm.title || !researchForm.abstract || !researchForm.focusArea) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (researchForm.pricingType !== 'free' && !researchForm.price) {
      Alert.alert('Error', 'Please set a price for paid research');
      return;
    }

    if (researchForm.pricingType === 'paid_group' && researchForm.coAuthors.length === 0) {
      Alert.alert('Error', 'Group pricing requires at least one co-author');
      return;
    }

    const totalSplit = researchForm.coAuthors.reduce((sum, ca) => sum + ca.splitPercentage, 0);
    if (researchForm.pricingType === 'paid_group' && totalSplit >= 100) {
      Alert.alert('Error', 'Co-author splits cannot exceed 100%');
      return;
    }

    const newResearch: UserResearch = {
      id: `ur${Date.now()}`,
      title: researchForm.title,
      abstract: researchForm.abstract,
      documentUrl: '#',
      documentName: 'uploaded_research.pdf',
      documentSize: '5.0 MB',
      uploadedAt: new Date().toISOString(),
      status: 'pending_approval',
      pricingType: researchForm.pricingType,
      price: researchForm.pricingType !== 'free' ? parseFloat(researchForm.price) : undefined,
      currency: researchForm.pricingType !== 'free' ? 'USDC' : undefined,
      coAuthors: researchForm.pricingType === 'paid_group' ? researchForm.coAuthors : undefined,
      tags: researchForm.tags.split(',').map(t => t.trim()).filter(Boolean),
      focusArea: researchForm.focusArea,
    };

    setResearchPapers([newResearch, ...researchPapers]);
    setShowResearchUploadModal(false);
    setResearchForm({
      title: '',
      abstract: '',
      pricingType: 'free',
      price: '',
      tags: '',
      focusArea: '',
      coAuthors: [],
      hasWaivers: false,
    });
    Alert.alert('Success', 'Research submitted for approval. It will appear on the Research Page once approved.');
  };

  const addCoAuthor = () => {
    if (!coAuthorForm.name || !coAuthorForm.walletAddress || !coAuthorForm.splitPercentage) {
      Alert.alert('Error', 'Please fill in all co-author fields');
      return;
    }

    const newCoAuthor: ResearchCoAuthor = {
      id: `ca${Date.now()}`,
      name: coAuthorForm.name,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      splitPercentage: parseFloat(coAuthorForm.splitPercentage),
      walletAddress: coAuthorForm.walletAddress,
    };

    setResearchForm({
      ...researchForm,
      coAuthors: [...researchForm.coAuthors, newCoAuthor],
    });
    setShowCoAuthorModal(false);
    setCoAuthorForm({ name: '', walletAddress: '', splitPercentage: '' });
  };

  const removeCoAuthor = (id: string) => {
    setResearchForm({
      ...researchForm,
      coAuthors: researchForm.coAuthors.filter(ca => ca.id !== id),
    });
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
        <Text style={styles.headerTitle}>My Research</Text>
        <TouchableOpacity 
          style={styles.uploadHeaderButton}
          onPress={() => setShowResearchUploadModal(true)}
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
          Upload research documents with flexible pricing. Approved research will appear on the Research Page.
        </Text>

        {researchPapers.length === 0 ? (
          <View style={styles.emptyState}>
            <BookOpen size={48} color={Colors.textMuted} />
            <Text style={styles.emptyStateText}>No research uploaded</Text>
            <Text style={styles.emptyStateSubtext}>Share your research with the community</Text>
            <TouchableOpacity 
              style={styles.emptyStateButton}
              onPress={() => setShowResearchUploadModal(true)}
            >
              <Plus size={18} color={Colors.background} />
              <Text style={styles.emptyStateButtonText}>Upload</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.researchList}>
            {researchPapers.map((paper) => (
              <View key={paper.id} style={styles.researchCard}>
                <View style={styles.researchCardHeader}>
                  <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(paper.status)}20` }]}>
                    {paper.status === 'approved' && <CheckCircle2 size={12} color={getStatusColor(paper.status)} />}
                    {paper.status === 'pending_approval' && <Clock size={12} color={getStatusColor(paper.status)} />}
                    {paper.status === 'rejected' && <AlertCircle size={12} color={getStatusColor(paper.status)} />}
                    {paper.status === 'draft' && <Edit3 size={12} color={getStatusColor(paper.status)} />}
                    <Text style={[styles.statusText, { color: getStatusColor(paper.status) }]}>
                      {getStatusLabel(paper.status)}
                    </Text>
                  </View>
                  <View style={styles.pricingBadge}>
                    {paper.pricingType === 'free' ? (
                      <Text style={styles.freeBadgeText}>Free</Text>
                    ) : (
                      <View style={styles.paidBadge}>
                        <DollarSign size={12} color={Colors.primary} />
                        <Text style={styles.paidBadgeText}>{paper.price} {paper.currency}</Text>
                      </View>
                    )}
                  </View>
                </View>

                <Text style={styles.researchTitle}>{paper.title}</Text>
                <Text style={styles.researchAbstract} numberOfLines={2}>{paper.abstract}</Text>

                <View style={styles.researchMeta}>
                  <Text style={styles.researchFocusArea}>{paper.focusArea}</Text>
                  <Text style={styles.researchDate}>
                    {new Date(paper.uploadedAt).toLocaleDateString()}
                  </Text>
                </View>

                {paper.coAuthors && paper.coAuthors.length > 0 && (
                  <View style={styles.coAuthorsPreview}>
                    <Users2 size={14} color={Colors.textSecondary} />
                    <Text style={styles.coAuthorsText}>
                      {paper.coAuthors.length} co-author{paper.coAuthors.length > 1 ? 's' : ''} • Group Pricing
                    </Text>
                  </View>
                )}

                {paper.status === 'approved' && (
                  <View style={styles.researchStats}>
                    <View style={styles.researchStatItem}>
                      <Download size={14} color={Colors.primary} />
                      <Text style={styles.researchStatValue}>{paper.downloads || 0}</Text>
                      <Text style={styles.researchStatLabel}>Downloads</Text>
                    </View>
                    {paper.totalRevenue !== undefined && paper.totalRevenue > 0 && (
                      <View style={styles.researchStatItem}>
                        <DollarSign size={14} color={Colors.success} />
                        <Text style={[styles.researchStatValue, { color: Colors.success }]}>
                          {paper.totalRevenue}
                        </Text>
                        <Text style={styles.researchStatLabel}>Revenue</Text>
                      </View>
                    )}
                  </View>
                )}

                <View style={styles.researchTags}>
                  {paper.tags.slice(0, 3).map((tag, index) => (
                    <View key={index} style={styles.researchTag}>
                      <Text style={styles.researchTagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <Modal
        visible={showResearchUploadModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowResearchUploadModal(false)}
      >
        <View style={[styles.modalContainer, { paddingTop: insets.top }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowResearchUploadModal(false)}>
              <X size={24} color={Colors.text} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Upload Research</Text>
            <TouchableOpacity onPress={handleResearchUpload}>
              <Text style={styles.modalSaveText}>Submit</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <TouchableOpacity style={styles.uploadArea}>
              <FileText size={32} color={Colors.textMuted} />
              <Text style={styles.uploadAreaText}>Tap to select document</Text>
              <Text style={styles.uploadAreaSubtext}>PDF, DOC, DOCX up to 50MB</Text>
            </TouchableOpacity>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Title *</Text>
              <TextInput
                style={styles.input}
                placeholder="Research paper title"
                placeholderTextColor={Colors.textMuted}
                value={researchForm.title}
                onChangeText={(text) => setResearchForm({ ...researchForm, title: text })}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Abstract *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Brief summary of your research..."
                placeholderTextColor={Colors.textMuted}
                multiline
                numberOfLines={4}
                value={researchForm.abstract}
                onChangeText={(text) => setResearchForm({ ...researchForm, abstract: text })}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Focus Area *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Climate Adaptation, Disease Prevention"
                placeholderTextColor={Colors.textMuted}
                value={researchForm.focusArea}
                onChangeText={(text) => setResearchForm({ ...researchForm, focusArea: text })}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Tags (comma separated)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Climate, Agriculture, Policy"
                placeholderTextColor={Colors.textMuted}
                value={researchForm.tags}
                onChangeText={(text) => setResearchForm({ ...researchForm, tags: text })}
              />
            </View>

            <View style={styles.pricingSection}>
              <Text style={styles.pricingSectionTitle}>Pricing</Text>
              
              <View style={styles.pricingOptions}>
                <TouchableOpacity
                  style={[styles.pricingOption, researchForm.pricingType === 'free' && styles.pricingOptionActive]}
                  onPress={() => setResearchForm({ ...researchForm, pricingType: 'free', price: '', coAuthors: [] })}
                >
                  <View style={styles.pricingOptionHeader}>
                    <View style={[styles.pricingRadio, researchForm.pricingType === 'free' && styles.pricingRadioActive]}>
                      {researchForm.pricingType === 'free' && <View style={styles.pricingRadioInner} />}
                    </View>
                    <Text style={styles.pricingOptionTitle}>Free</Text>
                  </View>
                  <Text style={styles.pricingOptionDesc}>Anyone can download</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.pricingOption, researchForm.pricingType === 'paid_individual' && styles.pricingOptionActive]}
                  onPress={() => setResearchForm({ ...researchForm, pricingType: 'paid_individual', coAuthors: [] })}
                >
                  <View style={styles.pricingOptionHeader}>
                    <View style={[styles.pricingRadio, researchForm.pricingType === 'paid_individual' && styles.pricingRadioActive]}>
                      {researchForm.pricingType === 'paid_individual' && <View style={styles.pricingRadioInner} />}
                    </View>
                    <Text style={styles.pricingOptionTitle}>Paid (Individual)</Text>
                  </View>
                  <Text style={styles.pricingOptionDesc}>You receive 100% of revenue</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.pricingOption, researchForm.pricingType === 'paid_group' && styles.pricingOptionActive]}
                  onPress={() => setResearchForm({ ...researchForm, pricingType: 'paid_group' })}
                >
                  <View style={styles.pricingOptionHeader}>
                    <View style={[styles.pricingRadio, researchForm.pricingType === 'paid_group' && styles.pricingRadioActive]}>
                      {researchForm.pricingType === 'paid_group' && <View style={styles.pricingRadioInner} />}
                    </View>
                    <Text style={styles.pricingOptionTitle}>Paid (Group)</Text>
                  </View>
                  <Text style={styles.pricingOptionDesc}>Split revenue with co-authors on-chain</Text>
                </TouchableOpacity>
              </View>

              {researchForm.pricingType !== 'free' && (
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Price (USDC) *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g., 25"
                    placeholderTextColor={Colors.textMuted}
                    keyboardType="numeric"
                    value={researchForm.price}
                    onChangeText={(text) => setResearchForm({ ...researchForm, price: text })}
                  />
                </View>
              )}

              {researchForm.pricingType === 'paid_group' && (
                <View style={styles.coAuthorsSection}>
                  <View style={styles.coAuthorsSectionHeader}>
                    <Text style={styles.coAuthorsSectionTitle}>Co-Authors & Payment Split</Text>
                    <TouchableOpacity 
                      style={styles.addCoAuthorButton}
                      onPress={() => setShowCoAuthorModal(true)}
                    >
                      <Plus size={16} color={Colors.primary} />
                      <Text style={styles.addCoAuthorText}>Add</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.splitPreview}>
                    <View style={styles.splitPreviewItem}>
                      <Text style={styles.splitPreviewName}>You</Text>
                      <Text style={styles.splitPreviewPercent}>
                        {100 - researchForm.coAuthors.reduce((sum, ca) => sum + ca.splitPercentage, 0)}%
                      </Text>
                    </View>
                    {researchForm.coAuthors.map((ca) => (
                      <View key={ca.id} style={styles.splitPreviewItem}>
                        <Text style={styles.splitPreviewName}>{ca.name}</Text>
                        <View style={styles.splitPreviewRight}>
                          <Text style={styles.splitPreviewPercent}>{ca.splitPercentage}%</Text>
                          <TouchableOpacity onPress={() => removeCoAuthor(ca.id)}>
                            <Trash2 size={14} color={Colors.error} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}
                  </View>

                  <View style={styles.switchRow}>
                    <View style={styles.switchInfo}>
                      <FileText size={20} color={Colors.primary} />
                      <View style={styles.switchTextContainer}>
                        <Text style={styles.switchLabel}>Waiver Uploaded</Text>
                        <Text style={styles.switchSubtext}>Co-author agreements on file</Text>
                      </View>
                    </View>
                    <Switch
                      value={researchForm.hasWaivers}
                      onValueChange={(value) => setResearchForm({ ...researchForm, hasWaivers: value })}
                      trackColor={{ false: Colors.border, true: Colors.primary }}
                      thumbColor={Colors.background}
                    />
                  </View>
                </View>
              )}
            </View>

            <View style={styles.infoBox}>
              <AlertCircle size={16} color={Colors.accent} />
              <Text style={styles.infoBoxText}>
                Research will be reviewed before appearing on the Research Page. On-chain payment splits are executed automatically on each purchase.
              </Text>
            </View>
          </ScrollView>
        </View>
      </Modal>

      <Modal
        visible={showCoAuthorModal}
        animationType="fade"
        transparent
        onRequestClose={() => setShowCoAuthorModal(false)}
      >
        <View style={styles.coAuthorModalOverlay}>
          <View style={styles.coAuthorModalContent}>
            <Text style={styles.coAuthorModalTitle}>Add Co-Author</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Co-author's name"
                placeholderTextColor={Colors.textMuted}
                value={coAuthorForm.name}
                onChangeText={(text) => setCoAuthorForm({ ...coAuthorForm, name: text })}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Wallet Address</Text>
              <TextInput
                style={styles.input}
                placeholder="0x..."
                placeholderTextColor={Colors.textMuted}
                value={coAuthorForm.walletAddress}
                onChangeText={(text) => setCoAuthorForm({ ...coAuthorForm, walletAddress: text })}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Revenue Split (%)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 25"
                placeholderTextColor={Colors.textMuted}
                keyboardType="numeric"
                value={coAuthorForm.splitPercentage}
                onChangeText={(text) => setCoAuthorForm({ ...coAuthorForm, splitPercentage: text })}
              />
            </View>

            <View style={styles.coAuthorModalActions}>
              <TouchableOpacity 
                style={styles.coAuthorModalCancel}
                onPress={() => setShowCoAuthorModal(false)}
              >
                <Text style={styles.coAuthorModalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.coAuthorModalAdd}
                onPress={addCoAuthor}
              >
                <Text style={styles.coAuthorModalAddText}>Add Co-Author</Text>
              </TouchableOpacity>
            </View>
          </View>
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
  researchList: {
    gap: 12,
  },
  researchCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  researchCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600' as const,
  },
  pricingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  freeBadgeText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.success,
  },
  paidBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  paidBadgeText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  researchTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 6,
  },
  researchAbstract: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  researchMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  researchFocusArea: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: Colors.primary,
  },
  researchDate: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  coAuthorsPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  coAuthorsText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  researchStats: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  researchStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  researchStatValue: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  researchStatLabel: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  researchTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  researchTag: {
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  researchTagText: {
    fontSize: 11,
    fontWeight: '500' as const,
    color: Colors.textSecondary,
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
  pricingSection: {
    marginBottom: 20,
  },
  pricingSectionTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 12,
  },
  pricingOptions: {
    gap: 10,
  },
  pricingOption: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pricingOptionActive: {
    borderColor: Colors.primary,
    backgroundColor: `${Colors.primary}10`,
  },
  pricingOptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  pricingRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pricingRadioActive: {
    borderColor: Colors.primary,
  },
  pricingRadioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  pricingOptionTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  pricingOptionDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginLeft: 30,
  },
  coAuthorsSection: {
    marginTop: 16,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    padding: 14,
  },
  coAuthorsSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  coAuthorsSectionTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  addCoAuthorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addCoAuthorText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  splitPreview: {
    gap: 8,
    marginBottom: 12,
  },
  splitPreviewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.card,
    padding: 10,
    borderRadius: 8,
  },
  splitPreviewName: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.text,
  },
  splitPreviewRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  splitPreviewPercent: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.card,
    borderRadius: 10,
    padding: 12,
  },
  switchInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  switchTextContainer: {
    flex: 1,
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  switchSubtext: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 1,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: `${Colors.accent}15`,
    borderRadius: 12,
    padding: 14,
    marginTop: 8,
    marginBottom: 40,
  },
  infoBoxText: {
    flex: 1,
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  coAuthorModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  coAuthorModalContent: {
    backgroundColor: Colors.background,
    borderRadius: 20,
    padding: 20,
  },
  coAuthorModalTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  coAuthorModalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  coAuthorModalCancel: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: Colors.card,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  coAuthorModalCancelText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  coAuthorModalAdd: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
  },
  coAuthorModalAddText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.background,
  },
});
