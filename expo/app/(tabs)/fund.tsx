import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { 
  Wallet, 
  TrendingUp, 
  Target, 
  ChevronRight, 
  Filter,
  CreditCard,
  Building2,
  Smartphone,
  X,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  FileText,
  HelpCircle,
  ThumbsUp,
  Shield,
} from 'lucide-react-native';
import Header from '@/components/Header';
import Colors from '@/constants/colors';
import { fundingItems, FundingItem, getFundingProgress } from '@/mocks/submissions';
import { silentTokenConversion, nxtTokenService } from '@/services/nxtToken';


type FilterType = 'all' | 'proposal' | 'ask';
type PaymentMethod = 'card' | 'bank' | 'mobile';

export default function FundScreen() {

  const [filterType, setFilterType] = useState<FilterType>('all');
  const [selectedProject, setSelectedProject] = useState<FundingItem | null>(null);
  const [showFundingModal, setShowFundingModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [fundingAmount, setFundingAmount] = useState('');

  const filteredProjects = useMemo(() => {
    if (filterType === 'all') return fundingItems;
    return fundingItems.filter(item => item.type === filterType);
  }, [filterType]);

  const amounts = [50, 100, 250, 500];

  const totalFundingNeeded = fundingItems.reduce((acc, p) => acc + p.fundingGoal, 0);
  const totalFundingRaised = fundingItems.reduce((acc, p) => acc + p.fundingRaised, 0);
  const proposalCount = fundingItems.filter(p => p.type === 'proposal').length;
  const askCount = fundingItems.filter(p => p.type === 'ask').length;

  const handleFundProject = (project: FundingItem) => {
    setSelectedProject(project);
    setFundingAmount('');
    setShowFundingModal(true);
  };

  const handleSubmitFunding = () => {
    const amount = parseFloat(fundingAmount);
    if (!amount || amount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid funding amount.');
      return;
    }

    const conversion = silentTokenConversion(amount);
    console.log('[Fund] Token conversion processed silently:', conversion.processed);

    const paymentMethodLabel = 
      paymentMethod === 'card' ? 'Credit Card' :
      paymentMethod === 'bank' ? 'Bank Account' : 'Mobile Money';

    const governanceCredits = nxtTokenService.getGovernanceCreditsFromFiat(amount);

    Alert.alert(
      'Contribution Confirmed',
      `Your contribution of ${conversion.fiat} via ${paymentMethodLabel} has been submitted for "${selectedProject?.title}".\n\nYou will receive ${nxtTokenService.formatGovernanceCredits(governanceCredits.amount)} Governance Credits for participating in this project's governance.\n\nTransaction will be recorded on blockchain.`,
      [{ text: 'OK', onPress: () => setShowFundingModal(false) }]
    );
  };

  const renderFilterTabs = () => (
    <View style={styles.filterContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
        {[
          { key: 'all', label: 'All', count: fundingItems.length },
          { key: 'proposal', label: 'Proposals', count: proposalCount },
          { key: 'ask', label: 'Asks', count: askCount },
        ].map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterTab,
              filterType === filter.key && styles.filterTabActive,
            ]}
            onPress={() => setFilterType(filter.key as FilterType)}
            activeOpacity={0.7}
          >
            {filter.key === 'proposal' ? (
              <FileText size={14} color={filterType === filter.key ? Colors.background : Colors.textSecondary} />
            ) : filter.key === 'ask' ? (
              <HelpCircle size={14} color={filterType === filter.key ? Colors.background : Colors.textSecondary} />
            ) : (
              <Filter size={14} color={filterType === filter.key ? Colors.background : Colors.textSecondary} />
            )}
            <Text style={[
              styles.filterTabText,
              filterType === filter.key && styles.filterTabTextActive,
            ]}>
              {filter.label}
            </Text>
            <View style={[
              styles.filterBadge,
              filterType === filter.key && styles.filterBadgeActive,
            ]}>
              <Text style={[
                styles.filterBadgeText,
                filterType === filter.key && styles.filterBadgeTextActive,
              ]}>
                {filter.count}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderProjectCard = (project: FundingItem) => {
    const progress = getFundingProgress(project.fundingRaised, project.fundingGoal);
    const isUrgent = project.daysRemaining <= 7;

    return (
      <TouchableOpacity
        key={project.id}
        style={styles.projectCard}
        activeOpacity={0.8}
        onPress={() => handleFundProject(project)}
      >
        {project.imageUrl && (
          <Image source={{ uri: project.imageUrl }} style={styles.projectImage} />
        )}
        <View style={styles.projectContent}>
          <View style={styles.projectHeader}>
            <View style={styles.projectBadges}>
              <View style={[
                styles.typeBadge,
                project.type === 'proposal' ? styles.proposalBadge : styles.askBadge,
              ]}>
                {project.type === 'proposal' ? (
                  <FileText size={10} color={Colors.primary} />
                ) : (
                  <HelpCircle size={10} color={Colors.accent} />
                )}
                <Text style={[
                  styles.typeBadgeText,
                  project.type === 'ask' && styles.askBadgeText,
                ]}>
                  {project.type === 'proposal' ? 'Proposal' : 'Ask'}
                </Text>
              </View>
              <View style={styles.voteBadge}>
                <ThumbsUp size={10} color={Colors.success} />
                <Text style={styles.voteBadgeText}>{project.votePercentage}% vote</Text>
              </View>
            </View>
            <View style={[styles.daysLeftBadge, isUrgent && styles.daysLeftUrgent]}>
              <Clock size={12} color={isUrgent ? '#FF6B6B' : Colors.accent} />
              <Text style={[styles.daysLeftText, isUrgent && styles.daysLeftTextUrgent]}>
                {project.daysRemaining}d left
              </Text>
            </View>
          </View>

          <Text style={styles.projectTitle} numberOfLines={2}>
            {project.title}
          </Text>

          <Text style={styles.projectDescription} numberOfLines={2}>
            {project.description}
          </Text>

          <View style={styles.projectMeta}>
            <Image
              source={{ uri: project.submittedBy.avatar }}
              style={styles.projectAvatar}
            />
            <View style={styles.projectMetaText}>
              <Text style={styles.projectResearcher} numberOfLines={1}>
                {project.submittedBy.name}
              </Text>
              <Text style={styles.projectLocation}>
                {project.country} • {project.issueArea}
              </Text>
            </View>
          </View>

          {project.linkedDaoName && (
            <View style={styles.daoLink}>
              <Users size={12} color={Colors.primary} />
              <Text style={styles.daoLinkText}>{project.linkedDaoName}</Text>
            </View>
          )}

          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[styles.progressFill, { width: `${Math.min(progress, 100)}%` }]}
              />
            </View>
            <View style={styles.progressStats}>
              <Text style={styles.progressAmount}>
                ${project.fundingRaised.toLocaleString()}
              </Text>
              <Text style={styles.progressGoal}>
                of ${project.fundingGoal.toLocaleString()} ({Math.round(progress)}%)
              </Text>
            </View>
          </View>

          <View style={styles.fundingInfo}>
            <View style={styles.fundingInfoItem}>
              <AlertCircle size={14} color={Colors.textMuted} />
              <Text style={styles.fundingInfoText}>
                30-day window • Moves to DAO after deadline
              </Text>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.fundButton} 
            activeOpacity={0.8}
            onPress={() => handleFundProject(project)}
          >
            <Text style={styles.fundButtonText}>Fund This {project.type === 'proposal' ? 'Proposal' : 'Ask'}</Text>
            <ChevronRight size={18} color={Colors.background} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFundingModal = () => (
    <Modal
      visible={showFundingModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowFundingModal(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Fund Project</Text>
          <TouchableOpacity onPress={() => setShowFundingModal(false)}>
            <X size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
          {selectedProject && (
            <>
              <View style={styles.modalProjectInfo}>
                <Text style={styles.modalProjectTitle}>{selectedProject.title}</Text>
                <View style={styles.modalProjectMeta}>
                  <View style={[
                    styles.typeBadge,
                    selectedProject.type === 'proposal' ? styles.proposalBadge : styles.askBadge,
                  ]}>
                    <Text style={[
                      styles.typeBadgeText,
                      selectedProject.type === 'ask' && styles.askBadgeText,
                    ]}>
                      {selectedProject.type === 'proposal' ? 'Proposal' : 'Ask'}
                    </Text>
                  </View>
                  <Text style={styles.modalProjectBy}>by {selectedProject.submittedBy.name}</Text>
                </View>
                <View style={styles.modalProgressInfo}>
                  <Text style={styles.modalProgressText}>
                    ${selectedProject.fundingRaised.toLocaleString()} raised of ${selectedProject.fundingGoal.toLocaleString()}
                  </Text>
                  <View style={styles.modalProgressBar}>
                    <View 
                      style={[
                        styles.modalProgressFill, 
                        { width: `${getFundingProgress(selectedProject.fundingRaised, selectedProject.fundingGoal)}%` }
                      ]} 
                    />
                  </View>
                </View>
              </View>

              <View style={styles.timelineNotice}>
                <Clock size={18} color={Colors.accent} />
                <View style={styles.timelineNoticeContent}>
                  <Text style={styles.timelineNoticeTitle}>30-Day Funding Window</Text>
                  <Text style={styles.timelineNoticeText}>
                    {selectedProject.daysRemaining} days remaining. After the deadline, this project will move to the DAO regardless of the amount raised.
                  </Text>
                </View>
              </View>

              <Text style={styles.sectionLabel}>Select Amount</Text>
              <View style={styles.modalAmountsGrid}>
                {amounts.map((amount) => (
                  <TouchableOpacity
                    key={amount}
                    style={[
                      styles.modalAmountButton,
                      fundingAmount === amount.toString() && styles.modalAmountButtonSelected,
                    ]}
                    onPress={() => setFundingAmount(amount.toString())}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.modalAmountText,
                        fundingAmount === amount.toString() && styles.modalAmountTextSelected,
                      ]}
                    >
                      ${amount}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.customAmountContainer}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput
                  style={styles.customAmountInput}
                  placeholder="Custom amount"
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="numeric"
                  value={fundingAmount}
                  onChangeText={setFundingAmount}
                />
              </View>

              <Text style={styles.sectionLabel}>Payment Method</Text>
              <View style={styles.paymentMethods}>
                <TouchableOpacity
                  style={[
                    styles.paymentMethod,
                    paymentMethod === 'card' && styles.paymentMethodSelected,
                  ]}
                  onPress={() => setPaymentMethod('card')}
                  activeOpacity={0.7}
                >
                  <View style={[
                    styles.paymentMethodIcon,
                    paymentMethod === 'card' && styles.paymentMethodIconSelected,
                  ]}>
                    <CreditCard size={24} color={paymentMethod === 'card' ? Colors.primary : Colors.textSecondary} />
                  </View>
                  <Text style={[
                    styles.paymentMethodLabel,
                    paymentMethod === 'card' && styles.paymentMethodLabelSelected,
                  ]}>
                    Credit Card
                  </Text>
                  {paymentMethod === 'card' && (
                    <CheckCircle size={18} color={Colors.primary} style={styles.paymentCheck} />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.paymentMethod,
                    paymentMethod === 'bank' && styles.paymentMethodSelected,
                  ]}
                  onPress={() => setPaymentMethod('bank')}
                  activeOpacity={0.7}
                >
                  <View style={[
                    styles.paymentMethodIcon,
                    paymentMethod === 'bank' && styles.paymentMethodIconSelected,
                  ]}>
                    <Building2 size={24} color={paymentMethod === 'bank' ? Colors.primary : Colors.textSecondary} />
                  </View>
                  <Text style={[
                    styles.paymentMethodLabel,
                    paymentMethod === 'bank' && styles.paymentMethodLabelSelected,
                  ]}>
                    Bank Account
                  </Text>
                  {paymentMethod === 'bank' && (
                    <CheckCircle size={18} color={Colors.primary} style={styles.paymentCheck} />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.paymentMethod,
                    paymentMethod === 'mobile' && styles.paymentMethodSelected,
                  ]}
                  onPress={() => setPaymentMethod('mobile')}
                  activeOpacity={0.7}
                >
                  <View style={[
                    styles.paymentMethodIcon,
                    paymentMethod === 'mobile' && styles.paymentMethodIconSelected,
                  ]}>
                    <Smartphone size={24} color={paymentMethod === 'mobile' ? Colors.primary : Colors.textSecondary} />
                  </View>
                  <Text style={[
                    styles.paymentMethodLabel,
                    paymentMethod === 'mobile' && styles.paymentMethodLabelSelected,
                  ]}>
                    Mobile Money
                  </Text>
                  {paymentMethod === 'mobile' && (
                    <CheckCircle size={18} color={Colors.primary} style={styles.paymentCheck} />
                  )}
                </TouchableOpacity>
              </View>

              <View style={styles.blockchainNotice}>
                <CheckCircle size={16} color={Colors.success} />
                <Text style={styles.blockchainNoticeText}>
                  All transactions are recorded on blockchain for transparency
                </Text>
              </View>

              <View style={styles.governanceNotice}>
                <Shield size={16} color={Colors.primary} />
                <Text style={styles.governanceNoticeText}>
                  Contributors receive Governance Credits for project participation. Credits enable governance, access, and coordination—not equity or investment.
                </Text>
              </View>
            </>
          )}
        </ScrollView>

        <View style={styles.modalFooter}>
          <TouchableOpacity
            style={[
              styles.submitFundingButton,
              (!fundingAmount || parseFloat(fundingAmount) <= 0) && styles.submitFundingButtonDisabled,
            ]}
            onPress={handleSubmitFunding}
            activeOpacity={0.8}
            disabled={!fundingAmount || parseFloat(fundingAmount) <= 0}
          >
            <Text style={styles.submitFundingButtonText}>
              {fundingAmount && parseFloat(fundingAmount) > 0 
                ? `Contribute $${parseFloat(fundingAmount).toLocaleString()}`
                : 'Enter Amount to Continue'
              }
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.heroSection}>
          <Text style={styles.greeting}>Fund Projects</Text>
          <Text style={styles.heroSubtitle}>
            Support voted proposals and asks with 25% or 50% community support
          </Text>
        </View>

        <View style={styles.walletCard}>
          <View style={styles.walletHeader}>
            <View style={styles.walletIconContainer}>
              <Wallet size={24} color={Colors.primary} />
            </View>
            <View>
              <Text style={styles.walletLabel}>Total Raised</Text>
              <Text style={styles.walletAmount}>${totalFundingRaised.toLocaleString()}</Text>
            </View>
          </View>
          <View style={styles.walletStats}>
            <View style={styles.walletStat}>
              <TrendingUp size={16} color={Colors.success} />
              <Text style={styles.walletStatText}>
                {Math.round((totalFundingRaised / totalFundingNeeded) * 100)}% of goal
              </Text>
            </View>
            <View style={styles.walletStat}>
              <Target size={16} color={Colors.accent} />
              <Text style={styles.walletStatText}>{fundingItems.length} active</Text>
            </View>
          </View>
          <View style={styles.walletDivider} />
          <View style={styles.walletFooter}>
            <View style={styles.walletFooterItem}>
              <FileText size={14} color={Colors.primary} />
              <Text style={styles.walletFooterText}>{proposalCount} Proposals</Text>
            </View>
            <View style={styles.walletFooterItem}>
              <HelpCircle size={14} color={Colors.accent} />
              <Text style={styles.walletFooterText}>{askCount} Asks</Text>
            </View>
          </View>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <AlertCircle size={18} color={Colors.accent} />
            <Text style={styles.infoTitle}>How Funding Works</Text>
          </View>
          <View style={styles.infoContent}>
            <View style={styles.infoItem}>
              <View style={styles.infoBullet}>
                <Text style={styles.infoBulletText}>1</Text>
              </View>
              <Text style={styles.infoText}>Projects with 25% or 50% vote support enter funding</Text>
            </View>
            <View style={styles.infoItem}>
              <View style={styles.infoBullet}>
                <Text style={styles.infoBulletText}>2</Text>
              </View>
              <Text style={styles.infoText}>30-day window to reach 100% funding goal</Text>
            </View>
            <View style={styles.infoItem}>
              <View style={styles.infoBullet}>
                <Text style={styles.infoBulletText}>3</Text>
              </View>
              <Text style={styles.infoText}>After 30 days, project moves to DAO regardless of amount raised</Text>
            </View>
          </View>
        </View>

        {renderFilterTabs()}

        <Text style={styles.sectionTitle}>
          {filterType === 'all' ? 'All Projects' : filterType === 'proposal' ? 'Proposals' : 'Asks'} Seeking Funding
        </Text>

        {filteredProjects.length === 0 ? (
          <View style={styles.emptyState}>
            <Target size={48} color={Colors.textMuted} />
            <Text style={styles.emptyStateText}>No {filterType === 'all' ? 'projects' : filterType + 's'} seeking funding</Text>
          </View>
        ) : (
          filteredProjects.map(renderProjectCard)
        )}
      </ScrollView>

      {renderFundingModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  heroSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  walletCard: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: Colors.cardElevated,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  walletHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16,
  },
  walletIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  walletLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  walletAmount: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  walletStats: {
    flexDirection: 'row',
    gap: 20,
  },
  walletStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  walletStatText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
  },
  walletDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 16,
  },
  walletFooter: {
    flexDirection: 'row',
    gap: 24,
  },
  walletFooterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  walletFooterText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
  },
  infoCard: {
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  infoContent: {
    gap: 10,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoBullet: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoBulletText: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  filterContainer: {
    marginTop: 20,
  },
  filterScroll: {
    paddingHorizontal: 20,
    gap: 10,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterTabActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.textSecondary,
  },
  filterTabTextActive: {
    color: Colors.background,
  },
  filterBadge: {
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  filterBadgeActive: {
    backgroundColor: Colors.background + '30',
  },
  filterBadgeText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  filterBadgeTextActive: {
    color: Colors.background,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 16,
  },
  projectCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: Colors.card,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  projectImage: {
    width: '100%',
    height: 140,
  },
  projectContent: {
    padding: 16,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  projectBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  proposalBadge: {
    backgroundColor: Colors.primary + '15',
  },
  askBadge: {
    backgroundColor: Colors.golden + '15',
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: Colors.primary,
    textTransform: 'capitalize',
  },
  askBadgeText: {
    color: Colors.golden,
  },
  voteBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.success + '15',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  voteBadgeText: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: Colors.success,
  },
  daysLeftBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  daysLeftUrgent: {},
  daysLeftText: {
    fontSize: 12,
    color: Colors.accent,
    fontWeight: '500' as const,
  },
  daysLeftTextUrgent: {
    color: '#FF6B6B',
  },
  projectTitle: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 6,
    lineHeight: 22,
  },
  projectDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 12,
  },
  projectMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  projectAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  projectMetaText: {
    flex: 1,
  },
  projectResearcher: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  projectLocation: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 1,
  },
  daoLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primary + '10',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  daoLinkText: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: Colors.primary,
  },
  progressContainer: {
    marginBottom: 10,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  progressStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
  },
  progressAmount: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  progressGoal: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  fundingInfo: {
    marginBottom: 14,
  },
  fundingInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  fundingInfoText: {
    fontSize: 12,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
  fundButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 14,
    gap: 4,
  },
  fundButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.background,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateText: {
    fontSize: 15,
    color: Colors.textMuted,
    marginTop: 12,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  modalProjectInfo: {
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalProjectTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  modalProjectMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  modalProjectBy: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  modalProgressInfo: {
    marginTop: 4,
  },
  modalProgressText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500' as const,
    marginBottom: 8,
  },
  modalProgressBar: {
    height: 6,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 3,
    overflow: 'hidden',
  },
  modalProgressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  timelineNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.accent + '10',
    padding: 14,
    borderRadius: 12,
    marginTop: 16,
    gap: 12,
  },
  timelineNoticeContent: {
    flex: 1,
  },
  timelineNoticeTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  timelineNoticeText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginTop: 20,
    marginBottom: 12,
  },
  modalAmountsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  modalAmountButton: {
    flex: 1,
    backgroundColor: Colors.card,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  modalAmountButtonSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  modalAmountText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  modalAmountTextSelected: {
    color: Colors.background,
  },
  customAmountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    backgroundColor: Colors.card,
    borderRadius: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.textMuted,
    marginRight: 4,
  },
  customAmountInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.text,
  },
  paymentMethods: {
    gap: 12,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  paymentMethodSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '08',
  },
  paymentMethodIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  paymentMethodIconSelected: {
    backgroundColor: Colors.primary + '15',
  },
  paymentMethodLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500' as const,
    color: Colors.text,
  },
  paymentMethodLabelSelected: {
    color: Colors.primary,
  },
  paymentCheck: {
    marginLeft: 8,
  },
  blockchainNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 20,
    padding: 12,
    backgroundColor: Colors.success + '10',
    borderRadius: 10,
  },
  blockchainNoticeText: {
    flex: 1,
    fontSize: 13,
    color: Colors.success,
    fontWeight: '500' as const,
  },
  governanceNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 12,
    padding: 12,
    backgroundColor: Colors.primary + '10',
    borderRadius: 10,
  },
  governanceNoticeText: {
    flex: 1,
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  submitFundingButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  submitFundingButtonDisabled: {
    backgroundColor: Colors.textMuted,
  },
  submitFundingButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.background,
  },
});
