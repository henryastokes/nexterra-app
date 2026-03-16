import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Linking,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import {
  ArrowLeft,
  Building2,
  Users,
  Wallet,
  Shield,
  Vote,
  Clock,
  CheckCircle,
  CircleDot,
  ExternalLink,
  Copy,
  FileText,
  TrendingUp,
  TrendingDown,
  Lock,
  Building,
  Smartphone,
  ChevronRight,
  AlertCircle,
  Hash,
  ArrowUpRight,
  ArrowDownLeft,
  Activity,
  PauseCircle,
  AlertTriangle,
  Settings,
  Globe,
  CreditCard,
  Zap,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { daos, getDAOProgress, BlockchainTransaction, DisbursementSchedule, DAOReport } from '@/mocks/daos';
import { createDAOContractService } from '@/services/daoContract';
import { sampleTrustProfiles, calculateGovernanceWeight } from '@/mocks/trustImpact';

type TabType = 'overview' | 'governance' | 'ledger' | 'reports' | 'disburse' | 'contract';

export default function DAODetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'bank' | 'mobile' | 'wallet'>('wallet');

  const dao = useMemo(() => daos.find(d => d.id === id), [id]);

  const contractService = useMemo(() => {
    if (!dao) return null;
    const service = createDAOContractService(dao.id, {
      chainId: dao.chainId,
      chainName: dao.chainName,
      currency: dao.currency,
      jurisdiction: 'kenya',
    });
    
    dao.disbursementSchedule.forEach((milestone, index) => {
      service.disbursementManager.registerMilestone({
        id: milestone.id,
        title: milestone.milestone,
        description: `Milestone ${index + 1}`,
        amount: milestone.amount,
        percentage: (milestone.amount / dao.capitalRaised) * 100,
        scheduledDate: milestone.scheduledDate,
        conditions: milestone.conditions.map((c, i) => ({
          id: `cond-${milestone.id}-${i}`,
          description: c,
          type: 'deliverable' as const,
          isMet: milestone.status === 'released',
        })),
        reportingRequirements: [],
        status: milestone.status === 'released' ? 'released' : milestone.status === 'pending' ? 'pending' : 'locked',
      });
    });

    service.auditTrail.recordFundsDeposited({
      amount: dao.capitalRaised,
      currency: dao.currency,
      fromAddress: '0x1234...5678',
      actor: 'Funding Pool',
      transactionHash: dao.transactions[0]?.transactionHash || '0x...',
    });

    dao.transactions.filter(tx => tx.type === 'disbursement').forEach(tx => {
      service.auditTrail.recordFundsDisbursed({
        milestoneId: 'ms-1',
        milestoneName: tx.description,
        amount: tx.amount || 0,
        currency: dao.currency,
        toAddress: tx.to || '',
        actor: 'DAO Treasury',
        actorAddress: dao.smartContractAddress,
        transactionHash: tx.transactionHash,
      });
    });

    return service;
  }, [dao]);

  if (!dao) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'DAO Not Found' }} />
        <View style={styles.notFound}>
          <AlertCircle size={48} color={Colors.textSecondary} />
          <Text style={styles.notFoundText}>DAO not found</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const progress = getDAOProgress(dao);

  const copyToClipboard = (text: string) => {
    Alert.alert('Copied', 'Address copied to clipboard');
  };

  const openExplorer = (hash: string) => {
    const url = `https://polygonscan.com/tx/${hash}`;
    Linking.openURL(url);
  };

  const handleDisburse = () => {
    Alert.alert(
      'Disbursement Request',
      `Your disbursement request via ${selectedPaymentMethod === 'bank' ? 'Bank Transfer' : selectedPaymentMethod === 'mobile' ? 'Mobile Money' : 'Wallet'} has been submitted for approval.`,
      [{ text: 'OK' }]
    );
  };

  const renderTransactionIcon = (type: BlockchainTransaction['type']) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownLeft size={18} color={Colors.success} />;
      case 'disbursement':
        return <ArrowUpRight size={18} color={Colors.accent} />;
      case 'vote':
        return <Vote size={18} color={Colors.primary} />;
      case 'proposal':
        return <FileText size={18} color={Colors.clay} />;
      default:
        return <Shield size={18} color={Colors.textSecondary} />;
    }
  };

  const renderMilestoneStatus = (status: DisbursementSchedule['status']) => {
    switch (status) {
      case 'released':
        return (
          <View style={[styles.milestoneStatus, styles.releasedStatus]}>
            <CheckCircle size={12} color={Colors.success} />
            <Text style={styles.releasedStatusText}>Released</Text>
          </View>
        );
      case 'pending':
        return (
          <View style={[styles.milestoneStatus, styles.pendingStatus]}>
            <Clock size={12} color={Colors.accent} />
            <Text style={styles.pendingStatusText}>Pending</Text>
          </View>
        );
      case 'locked':
        return (
          <View style={[styles.milestoneStatus, styles.lockedStatus]}>
            <Lock size={12} color={Colors.textSecondary} />
            <Text style={styles.lockedStatusText}>Locked</Text>
          </View>
        );
    }
  };

  const renderReportBadge = (type: DAOReport['type']) => {
    const configs = {
      progress: { bg: 'rgba(200, 232, 75, 0.15)', color: Colors.primary, label: 'Progress' },
      financial: { bg: 'rgba(212, 168, 83, 0.15)', color: Colors.accent, label: 'Financial' },
      impact: { bg: 'rgba(76, 175, 80, 0.15)', color: Colors.success, label: 'Impact' },
      audit: { bg: 'rgba(166, 124, 82, 0.15)', color: Colors.clay, label: 'Audit' },
    };
    const config = configs[type];
    return (
      <View style={[styles.reportBadge, { backgroundColor: config.bg }]}>
        <Text style={[styles.reportBadgeText, { color: config.color }]}>{config.label}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: '',
          headerTransparent: true,
          headerLeft: () => (
            <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
              <ArrowLeft size={24} color={Colors.text} />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Image source={{ uri: dao.imageUrl }} style={styles.heroImage} />
        
        <View style={styles.mainContent}>
          <View style={styles.tagsRow}>
            <View style={[styles.typeTag, dao.type === 'proposal' ? styles.proposalTag : styles.askTag]}>
              <Text style={[styles.typeTagText, dao.type === 'proposal' ? styles.proposalTagText : styles.askTagText]}>
                {dao.type === 'proposal' ? 'Proposal' : 'Ask'}
              </Text>
            </View>
            <View style={[styles.statusTag, dao.status === 'active' ? styles.activeTag : styles.completedTag]}>
              {dao.status === 'active' ? (
                <CircleDot size={10} color={Colors.success} />
              ) : (
                <CheckCircle size={10} color={Colors.primary} />
              )}
              <Text style={[styles.statusTagText, dao.status === 'active' ? styles.activeTagText : styles.completedTagText]}>
                {dao.status.charAt(0).toUpperCase() + dao.status.slice(1)}
              </Text>
            </View>
          </View>

          <Text style={styles.daoName}>{dao.name}</Text>
          <Text style={styles.daoDescription}>{dao.description}</Text>

          <View style={styles.quickStats}>
            <View style={styles.quickStat}>
              <Building2 size={16} color={Colors.primary} />
              <Text style={styles.quickStatValue}>{dao.governance.structure}</Text>
              <Text style={styles.quickStatLabel}>Governance</Text>
            </View>
            <View style={styles.quickStatDivider} />
            <View style={styles.quickStat}>
              <Users size={16} color={Colors.primary} />
              <Text style={styles.quickStatValue}>{dao.votingRights.memberCount}</Text>
              <Text style={styles.quickStatLabel}>Members</Text>
            </View>
            <View style={styles.quickStatDivider} />
            <View style={styles.quickStat}>
              <Wallet size={16} color={Colors.primary} />
              <Text style={styles.quickStatValue}>${(dao.capitalRaised / 1000).toFixed(0)}K</Text>
              <Text style={styles.quickStatLabel}>Raised</Text>
            </View>
          </View>

          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Disbursement Progress</Text>
              <Text style={styles.progressPercent}>{progress.toFixed(0)}%</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
            </View>
            <View style={styles.progressDetails}>
              <View style={styles.progressDetail}>
                <Text style={styles.progressDetailLabel}>Disbursed</Text>
                <Text style={styles.progressDetailValue}>${dao.totalDisbursed.toLocaleString()}</Text>
              </View>
              <View style={styles.progressDetail}>
                <Text style={styles.progressDetailLabel}>Remaining</Text>
                <Text style={styles.progressDetailValue}>${(dao.capitalRaised - dao.totalDisbursed).toLocaleString()}</Text>
              </View>
              <View style={styles.progressDetail}>
                <Text style={styles.progressDetailLabel}>Target</Text>
                <Text style={styles.progressDetailValue}>${dao.capitalRaiseTarget.toLocaleString()}</Text>
              </View>
            </View>
          </View>

          <View style={styles.tabsContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
              {(['overview', 'governance', 'ledger', 'reports', 'disburse', 'contract'] as TabType[]).map((tab) => (
                <TouchableOpacity
                  key={tab}
                  style={[styles.tab, activeTab === tab && styles.tabActive]}
                  onPress={() => setActiveTab(tab)}
                >
                  <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {activeTab === 'overview' && (
            <View style={styles.tabContent}>
              <View style={styles.contractCard}>
                <View style={styles.contractHeader}>
                  <Shield size={20} color={Colors.primary} />
                  <Text style={styles.contractTitle}>Smart Contract</Text>
                </View>
                <View style={styles.contractInfo}>
                  <Text style={styles.contractLabel}>Contract Address</Text>
                  <View style={styles.addressRow}>
                    <Text style={styles.contractAddress} numberOfLines={1}>
                      {dao.smartContractAddress}
                    </Text>
                    <TouchableOpacity onPress={() => copyToClipboard(dao.smartContractAddress)}>
                      <Copy size={16} color={Colors.primary} />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.contractMeta}>
                  <View style={styles.contractMetaItem}>
                    <Text style={styles.contractMetaLabel}>Chain</Text>
                    <Text style={styles.contractMetaValue}>{dao.chainName}</Text>
                  </View>
                  <View style={styles.contractMetaItem}>
                    <Text style={styles.contractMetaLabel}>Chain ID</Text>
                    <Text style={styles.contractMetaValue}>{dao.chainId}</Text>
                  </View>
                </View>
              </View>

              <Text style={styles.sectionTitle}>Disbursement Schedule</Text>
              {dao.disbursementSchedule.map((milestone, index) => (
                <View key={milestone.id} style={styles.milestoneCard}>
                  <View style={styles.milestoneHeader}>
                    <View style={styles.milestoneIndex}>
                      <Text style={styles.milestoneIndexText}>{index + 1}</Text>
                    </View>
                    <View style={styles.milestoneInfo}>
                      <Text style={styles.milestoneName}>{milestone.milestone}</Text>
                      <Text style={styles.milestoneDate}>
                        {new Date(milestone.scheduledDate).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </Text>
                    </View>
                    {renderMilestoneStatus(milestone.status)}
                  </View>
                  <View style={styles.milestoneAmount}>
                    <Text style={styles.milestoneAmountValue}>${milestone.amount.toLocaleString()}</Text>
                    <Text style={styles.milestoneAmountLabel}>{dao.currency}</Text>
                  </View>
                  <View style={styles.milestoneConditions}>
                    <Text style={styles.conditionsLabel}>Conditions:</Text>
                    {milestone.conditions.map((condition, i) => (
                      <View key={i} style={styles.conditionRow}>
                        <View style={styles.conditionDot} />
                        <Text style={styles.conditionText}>{condition}</Text>
                      </View>
                    ))}
                  </View>
                  {milestone.transactionHash && (
                    <TouchableOpacity 
                      style={styles.txHashRow}
                      onPress={() => openExplorer(milestone.transactionHash!)}
                    >
                      <Hash size={12} color={Colors.primary} />
                      <Text style={styles.txHashText}>{milestone.transactionHash.slice(0, 20)}...</Text>
                      <ExternalLink size={12} color={Colors.primary} />
                    </TouchableOpacity>
                  )}
                </View>
              ))}

              <Text style={styles.sectionTitle}>Team</Text>
              <View style={styles.teamSection}>
                <TouchableOpacity 
                  style={styles.leaderCard}
                  onPress={() => router.push(`/user/${dao.leader.id}`)}
                  activeOpacity={0.7}
                >
                  <Image source={{ uri: dao.leader.avatar }} style={styles.leaderAvatar} />
                  <View style={styles.leaderInfo}>
                    <Text style={styles.leaderName}>{dao.leader.name}</Text>
                    <Text style={styles.leaderRole}>{dao.leader.role}</Text>
                  </View>
                  <View style={styles.leaderBadge}>
                    <Text style={styles.leaderBadgeText}>Lead</Text>
                  </View>
                </TouchableOpacity>
                {dao.teamMembers.map((member) => (
                  <TouchableOpacity 
                    key={member.id} 
                    style={styles.memberCard}
                    onPress={() => router.push(`/user/${member.id}`)}
                    activeOpacity={0.7}
                  >
                    <Image source={{ uri: member.avatar }} style={styles.memberAvatar} />
                    <View style={styles.memberInfo}>
                      <Text style={styles.memberName}>{member.name}</Text>
                      <Text style={styles.memberRole}>{member.role}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {activeTab === 'governance' && (
            <View style={styles.tabContent}>
              <View style={styles.governanceCard}>
                <View style={styles.governanceHeader}>
                  <Building2 size={24} color={Colors.primary} />
                  <View>
                    <Text style={styles.governanceType}>
                      {dao.governance.structure.charAt(0).toUpperCase() + dao.governance.structure.slice(1)} Voting
                    </Text>
                    <Text style={styles.governanceSubtitle}>Governance Model</Text>
                  </View>
                </View>
                <Text style={styles.governanceDescription}>{dao.governance.description}</Text>
                
                <View style={styles.governanceParams}>
                  <View style={styles.governanceParam}>
                    <Text style={styles.paramValue}>{dao.governance.quorumRequired}%</Text>
                    <Text style={styles.paramLabel}>Quorum Required</Text>
                  </View>
                  <View style={styles.governanceParam}>
                    <Text style={styles.paramValue}>{dao.governance.proposalThreshold}</Text>
                    <Text style={styles.paramLabel}>Proposal Threshold</Text>
                  </View>
                  <View style={styles.governanceParam}>
                    <Text style={styles.paramValue}>{dao.governance.votingPeriod}d</Text>
                    <Text style={styles.paramLabel}>Voting Period</Text>
                  </View>
                  <View style={styles.governanceParam}>
                    <Text style={styles.paramValue}>{dao.governance.executionDelay}d</Text>
                    <Text style={styles.paramLabel}>Execution Delay</Text>
                  </View>
                </View>
              </View>

              <Text style={styles.sectionTitle}>Voting Rights Distribution</Text>
              <View style={styles.votingRightsCard}>
                <View style={styles.votingRightsSummary}>
                  <View style={styles.votingRightsStat}>
                    <Text style={styles.votingRightsValue}>{dao.votingRights.totalVotingPower.toLocaleString()}</Text>
                    <Text style={styles.votingRightsLabel}>Total Voting Power</Text>
                  </View>
                  <View style={styles.votingRightsStat}>
                    <Text style={styles.votingRightsValue}>{dao.votingRights.memberCount}</Text>
                    <Text style={styles.votingRightsLabel}>Members</Text>
                  </View>
                </View>

                <View style={styles.trustWeightingInfo}>
                  <View style={styles.trustWeightingHeader}>
                    <Zap size={16} color={Colors.golden} />
                    <Text style={styles.trustWeightingTitle}>Trust-Weighted Voting</Text>
                  </View>
                  <Text style={styles.trustWeightingDesc}>
                    Voting power is adjusted by credibility and impact scores using non-linear (√) scaling for fair representation.
                  </Text>
                </View>

                <Text style={styles.topHoldersTitle}>Top Voting Power Holders</Text>
                {dao.votingRights.topHolders.map((holder, index) => {
                  const trustProfile = sampleTrustProfiles[index % sampleTrustProfiles.length];
                  const govWeight = calculateGovernanceWeight(trustProfile.credibilityScore, trustProfile.impactScore);
                  const effectivePower = Math.round(holder.votingPower * govWeight.effectiveVotingPower);
                  
                  return (
                    <View key={holder.address} style={styles.holderRow}>
                      <Text style={styles.holderRank}>#{index + 1}</Text>
                      <Image source={{ uri: holder.avatar }} style={styles.holderAvatar} />
                      <View style={styles.holderInfo}>
                        <Text style={styles.holderName}>{holder.name}</Text>
                        <Text style={styles.holderAddress}>{holder.address}</Text>
                        <View style={styles.holderTrustScores}>
                          <View style={styles.holderTrustItem}>
                            <Shield size={10} color={Colors.primary} />
                            <Text style={styles.holderTrustText}>{trustProfile.credibilityScore}</Text>
                          </View>
                          <View style={styles.holderTrustItem}>
                            <Globe size={10} color={Colors.accent} />
                            <Text style={styles.holderTrustText}>{trustProfile.impactScore}</Text>
                          </View>
                          <View style={styles.holderMultiplier}>
                            <Text style={styles.holderMultiplierText}>{govWeight.effectiveVotingPower}x</Text>
                          </View>
                        </View>
                      </View>
                      <View style={styles.holderPower}>
                        <Text style={styles.holderPowerValue}>{effectivePower.toLocaleString()}</Text>
                        <Text style={styles.holderPowerPercent}>{holder.percentage}%</Text>
                        <Text style={styles.holderBasePower}>Base: {holder.votingPower.toLocaleString()}</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {activeTab === 'ledger' && (
            <View style={styles.tabContent}>
              <View style={styles.ledgerHeader}>
                <Text style={styles.sectionTitle}>Blockchain Ledger</Text>
                <View style={styles.chainInfo}>
                  <Text style={styles.chainInfoText}>{dao.chainName}</Text>
                </View>
              </View>
              <Text style={styles.ledgerSubtitle}>All transactions are recorded on-chain for full transparency</Text>

              {dao.transactions.map((tx) => (
                <TouchableOpacity 
                  key={tx.id} 
                  style={styles.transactionCard}
                  onPress={() => openExplorer(tx.transactionHash)}
                  activeOpacity={0.7}
                >
                  <View style={styles.txIconContainer}>
                    {renderTransactionIcon(tx.type)}
                  </View>
                  <View style={styles.txInfo}>
                    <Text style={styles.txDescription}>{tx.description}</Text>
                    <View style={styles.txMeta}>
                      <Text style={styles.txFrom}>{tx.from}</Text>
                      {tx.to && <Text style={styles.txTo}>→ {tx.to}</Text>}
                    </View>
                    <View style={styles.txFooter}>
                      <Text style={styles.txDate}>
                        {new Date(tx.timestamp).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </Text>
                      <Text style={styles.txBlock}>Block #{tx.blockNumber}</Text>
                    </View>
                  </View>
                  <View style={styles.txRight}>
                    {tx.amount && (
                      <Text style={[styles.txAmount, tx.type === 'deposit' ? styles.txAmountPositive : styles.txAmountNegative]}>
                        {tx.type === 'deposit' ? '+' : '-'}${tx.amount.toLocaleString()}
                      </Text>
                    )}
                    <View style={[styles.txStatus, tx.status === 'confirmed' ? styles.txConfirmed : styles.txPending]}>
                      <Text style={[styles.txStatusText, tx.status === 'confirmed' ? styles.txConfirmedText : styles.txPendingText]}>
                        {tx.status}
                      </Text>
                    </View>
                    <ExternalLink size={14} color={Colors.textSecondary} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {activeTab === 'reports' && (
            <View style={styles.tabContent}>
              <Text style={styles.sectionTitle}>Reports & Updates</Text>
              <Text style={styles.reportsSubtitle}>Data, metrics, and progress updates</Text>

              {dao.reports.map((report) => (
                <View key={report.id} style={styles.reportCard}>
                  <View style={styles.reportHeader}>
                    {renderReportBadge(report.type)}
                    <Text style={styles.reportDate}>
                      {new Date(report.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </Text>
                  </View>
                  <Text style={styles.reportTitle}>{report.title}</Text>
                  <Text style={styles.reportSummary}>{report.summary}</Text>
                  
                  <View style={styles.metricsGrid}>
                    {report.metrics.map((metric, index) => (
                      <View key={index} style={styles.metricCard}>
                        <Text style={styles.metricValue}>{metric.value}</Text>
                        <Text style={styles.metricLabel}>{metric.label}</Text>
                        {metric.change !== undefined && (
                          <View style={[styles.metricChange, metric.change >= 0 ? styles.metricPositive : styles.metricNegative]}>
                            {metric.change >= 0 ? (
                              <TrendingUp size={12} color={Colors.success} />
                            ) : (
                              <TrendingDown size={12} color="#EF4444" />
                            )}
                            <Text style={[styles.metricChangeText, metric.change >= 0 ? styles.metricPositiveText : styles.metricNegativeText]}>
                              {metric.change >= 0 ? '+' : ''}{metric.change}%
                            </Text>
                          </View>
                        )}
                      </View>
                    ))}
                  </View>

                  {report.attachmentUrl && (
                    <TouchableOpacity style={styles.downloadReport}>
                      <FileText size={16} color={Colors.primary} />
                      <Text style={styles.downloadReportText}>Download Full Report</Text>
                      <ChevronRight size={16} color={Colors.primary} />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>
          )}

          {activeTab === 'disburse' && (
            <View style={styles.tabContent}>
              <Text style={styles.sectionTitle}>Disburse Funds</Text>
              <Text style={styles.disburseSubtitle}>Request fund disbursement to your wallet, bank, or mobile money</Text>

              <View style={styles.availableFunds}>
                <Text style={styles.availableFundsLabel}>Available for Disbursement</Text>
                <Text style={styles.availableFundsValue}>
                  ${(dao.capitalRaised - dao.totalDisbursed).toLocaleString()}
                </Text>
                <Text style={styles.availableFundsCurrency}>{dao.currency}</Text>
              </View>

              <Text style={styles.paymentMethodTitle}>Select Payment Method</Text>

              <TouchableOpacity
                style={[styles.paymentMethod, selectedPaymentMethod === 'wallet' && styles.paymentMethodActive]}
                onPress={() => setSelectedPaymentMethod('wallet')}
              >
                <View style={[styles.paymentIcon, { backgroundColor: 'rgba(200, 232, 75, 0.15)' }]}>
                  <Wallet size={24} color={Colors.primary} />
                </View>
                <View style={styles.paymentInfo}>
                  <Text style={styles.paymentName}>Crypto Wallet</Text>
                  <Text style={styles.paymentDescription}>Direct to your connected wallet address</Text>
                </View>
                <View style={[styles.paymentRadio, selectedPaymentMethod === 'wallet' && styles.paymentRadioActive]}>
                  {selectedPaymentMethod === 'wallet' && <View style={styles.paymentRadioInner} />}
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.paymentMethod, selectedPaymentMethod === 'bank' && styles.paymentMethodActive]}
                onPress={() => setSelectedPaymentMethod('bank')}
              >
                <View style={[styles.paymentIcon, { backgroundColor: 'rgba(212, 168, 83, 0.15)' }]}>
                  <Building size={24} color={Colors.accent} />
                </View>
                <View style={styles.paymentInfo}>
                  <Text style={styles.paymentName}>Bank Transfer</Text>
                  <Text style={styles.paymentDescription}>Wire transfer to your bank account (2-5 days)</Text>
                </View>
                <View style={[styles.paymentRadio, selectedPaymentMethod === 'bank' && styles.paymentRadioActive]}>
                  {selectedPaymentMethod === 'bank' && <View style={styles.paymentRadioInner} />}
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.paymentMethod, selectedPaymentMethod === 'mobile' && styles.paymentMethodActive]}
                onPress={() => setSelectedPaymentMethod('mobile')}
              >
                <View style={[styles.paymentIcon, { backgroundColor: 'rgba(76, 175, 80, 0.15)' }]}>
                  <Smartphone size={24} color={Colors.success} />
                </View>
                <View style={styles.paymentInfo}>
                  <Text style={styles.paymentName}>Mobile Money</Text>
                  <Text style={styles.paymentDescription}>M-Pesa, MTN MoMo, Airtel Money, etc.</Text>
                </View>
                <View style={[styles.paymentRadio, selectedPaymentMethod === 'mobile' && styles.paymentRadioActive]}>
                  {selectedPaymentMethod === 'mobile' && <View style={styles.paymentRadioInner} />}
                </View>
              </TouchableOpacity>

              <View style={styles.disburseNote}>
                <AlertCircle size={16} color={Colors.textSecondary} />
                <Text style={styles.disburseNoteText}>
                  Disbursements require DAO approval and are subject to milestone conditions being met.
                </Text>
              </View>

              <TouchableOpacity style={styles.disburseButton} onPress={handleDisburse} activeOpacity={0.8}>
                <Text style={styles.disburseButtonText}>Request Disbursement</Text>
                <ChevronRight size={18} color={Colors.background} />
              </TouchableOpacity>
            </View>
          )}

          {activeTab === 'contract' && contractService && (
            <View style={styles.tabContent}>
              <View style={styles.contractStatusCard}>
                <View style={styles.contractStatusHeader}>
                  <View style={styles.contractStatusIcon}>
                    {contractService.getContractStatus().status === 'active' ? (
                      <CheckCircle size={24} color={Colors.success} />
                    ) : contractService.getContractStatus().status === 'paused' ? (
                      <PauseCircle size={24} color={Colors.accent} />
                    ) : (
                      <AlertTriangle size={24} color="#EF4444" />
                    )}
                  </View>
                  <View style={styles.contractStatusInfo}>
                    <Text style={styles.contractStatusTitle}>Contract Status</Text>
                    <Text style={[
                      styles.contractStatusValue,
                      contractService.getContractStatus().status === 'active' && styles.statusActive,
                      contractService.getContractStatus().status === 'paused' && styles.statusPaused,
                    ]}>
                      {contractService.getContractStatus().status.charAt(0).toUpperCase() + contractService.getContractStatus().status.slice(1)}
                    </Text>
                  </View>
                  <View style={styles.versionBadge}>
                    <Text style={styles.versionText}>v{contractService.getMetadata().version}</Text>
                  </View>
                </View>
                {contractService.getContractStatus().pauseReason && (
                  <View style={styles.pauseReasonBox}>
                    <AlertTriangle size={14} color={Colors.accent} />
                    <Text style={styles.pauseReasonText}>{contractService.getContractStatus().pauseReason}</Text>
                  </View>
                )}
              </View>

              <Text style={styles.sectionTitle}>Contract Metadata</Text>
              <View style={styles.metadataCard}>
                <View style={styles.metadataRow}>
                  <Text style={styles.metadataLabel}>Contract Address</Text>
                  <View style={styles.metadataValueRow}>
                    <Text style={styles.metadataAddress}>{contractService.getMetadata().contractAddress.slice(0, 20)}...</Text>
                    <TouchableOpacity onPress={() => copyToClipboard(contractService.getMetadata().contractAddress)}>
                      <Copy size={14} color={Colors.primary} />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.metadataRow}>
                  <Text style={styles.metadataLabel}>Implementation</Text>
                  <Text style={styles.metadataValue}>{contractService.getMetadata().implementationAddress?.slice(0, 16)}...</Text>
                </View>
                <View style={styles.metadataRow}>
                  <Text style={styles.metadataLabel}>Deployed</Text>
                  <Text style={styles.metadataValue}>
                    {new Date(contractService.getMetadata().deployedAt).toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.metadataRow}>
                  <Text style={styles.metadataLabel}>Chain</Text>
                  <Text style={styles.metadataValue}>{contractService.getMetadata().chainName} ({contractService.getMetadata().chainId})</Text>
                </View>
                <View style={[styles.metadataRow, { borderBottomWidth: 0 }]}>
                  <Text style={styles.metadataLabel}>Upgradeable</Text>
                  <View style={styles.upgradeBadge}>
                    <CheckCircle size={12} color={Colors.success} />
                    <Text style={styles.upgradeText}>Yes (Proxy)</Text>
                  </View>
                </View>
              </View>

              <Text style={styles.sectionTitle}>Compliance Status</Text>
              <View style={styles.complianceCard}>
                <View style={styles.complianceRow}>
                  <View style={styles.complianceItem}>
                    <View style={[
                      styles.complianceIndicator,
                      contractService.getComplianceStatus().reporting.isCompliant 
                        ? styles.complianceGreen 
                        : styles.complianceRed
                    ]} />
                    <Text style={styles.complianceLabel}>Reporting</Text>
                    <Text style={styles.complianceValue}>
                      {contractService.getComplianceStatus().reporting.complianceRate.toFixed(0)}%
                    </Text>
                  </View>
                  <View style={styles.complianceItem}>
                    <View style={[
                      styles.complianceIndicator,
                      contractService.getComplianceStatus().milestones.percentComplete > 0 
                        ? styles.complianceGreen 
                        : styles.complianceYellow
                    ]} />
                    <Text style={styles.complianceLabel}>Milestones</Text>
                    <Text style={styles.complianceValue}>
                      {contractService.getComplianceStatus().milestones.released}/{contractService.getComplianceStatus().milestones.total}
                    </Text>
                  </View>
                  <View style={styles.complianceItem}>
                    <View style={[styles.complianceIndicator, styles.complianceGreen]} />
                    <Text style={styles.complianceLabel}>KYC</Text>
                    <Text style={styles.complianceValue}>Verified</Text>
                  </View>
                </View>
              </View>

              <Text style={styles.sectionTitle}>Contract Settings</Text>
              <View style={styles.settingsCard}>
                <View style={styles.settingRow}>
                  <Settings size={16} color={Colors.textSecondary} />
                  <Text style={styles.settingLabel}>Voting Period</Text>
                  <Text style={styles.settingValue}>{contractService.getSettings().votingPeriodDays} days</Text>
                </View>
                <View style={styles.settingRow}>
                  <Settings size={16} color={Colors.textSecondary} />
                  <Text style={styles.settingLabel}>Quorum Required</Text>
                  <Text style={styles.settingValue}>{contractService.getSettings().quorumPercentage}%</Text>
                </View>
                <View style={styles.settingRow}>
                  <Settings size={16} color={Colors.textSecondary} />
                  <Text style={styles.settingLabel}>Execution Delay</Text>
                  <Text style={styles.settingValue}>{contractService.getSettings().executionDelayDays} days</Text>
                </View>
                <View style={styles.settingRow}>
                  <Settings size={16} color={Colors.textSecondary} />
                  <Text style={styles.settingLabel}>Required Approvals</Text>
                  <Text style={styles.settingValue}>{contractService.getSettings().requiredApprovals}</Text>
                </View>
                <View style={styles.settingRow}>
                  <AlertTriangle size={16} color={Colors.accent} />
                  <Text style={styles.settingLabel}>Auto-Pause on Missed Reports</Text>
                  <Text style={styles.settingValue}>
                    {contractService.getSettings().autoPauseOnMissedReports ? 'Enabled' : 'Disabled'}
                  </Text>
                </View>
              </View>

              <Text style={styles.sectionTitle}>Payment Rails</Text>
              <View style={styles.paymentRailsCard}>
                <View style={styles.railHeader}>
                  <Globe size={18} color={Colors.primary} />
                  <Text style={styles.railTitle}>Supported Payment Methods</Text>
                </View>
                <View style={styles.railsGrid}>
                  <View style={styles.railItem}>
                    <Wallet size={20} color={Colors.primary} />
                    <Text style={styles.railName}>Crypto</Text>
                  </View>
                  <View style={styles.railItem}>
                    <Building size={20} color={Colors.accent} />
                    <Text style={styles.railName}>Bank</Text>
                  </View>
                  <View style={styles.railItem}>
                    <Smartphone size={20} color={Colors.success} />
                    <Text style={styles.railName}>M-Pesa</Text>
                  </View>
                  <View style={styles.railItem}>
                    <CreditCard size={20} color={Colors.clay} />
                    <Text style={styles.railName}>MTN MoMo</Text>
                  </View>
                </View>
                <View style={styles.jurisdictionInfo}>
                  <Text style={styles.jurisdictionLabel}>Jurisdiction: </Text>
                  <Text style={styles.jurisdictionValue}>
                    {contractService.getComplianceStatus().regulatory.jurisdiction.charAt(0).toUpperCase() + 
                     contractService.getComplianceStatus().regulatory.jurisdiction.slice(1)}
                  </Text>
                </View>
              </View>

              <Text style={styles.sectionTitle}>Audit Trail</Text>
              <Text style={styles.auditSubtitle}>Public record of all contract actions</Text>
              {contractService.auditTrail.getRecentEvents(5).map((event) => (
                <View key={event.id} style={styles.auditEventCard}>
                  <View style={styles.auditEventIcon}>
                    {event.type === 'funds_deposited' && <ArrowDownLeft size={16} color={Colors.success} />}
                    {event.type === 'funds_disbursed' && <ArrowUpRight size={16} color={Colors.accent} />}
                    {event.type === 'proposal_created' && <FileText size={16} color={Colors.primary} />}
                    {event.type === 'vote_cast' && <Vote size={16} color={Colors.primary} />}
                    {event.type === 'milestone_released' && <CheckCircle size={16} color={Colors.success} />}
                    {event.type === 'contract_paused' && <PauseCircle size={16} color={Colors.accent} />}
                    {event.type === 'role_changed' && <Users size={16} color={Colors.clay} />}
                    {!['funds_deposited', 'funds_disbursed', 'proposal_created', 'vote_cast', 'milestone_released', 'contract_paused', 'role_changed'].includes(event.type) && 
                      <Activity size={16} color={Colors.textSecondary} />}
                  </View>
                  <View style={styles.auditEventContent}>
                    <Text style={styles.auditEventDescription}>{event.description}</Text>
                    <View style={styles.auditEventMeta}>
                      <Text style={styles.auditEventActor}>{event.actor}</Text>
                      <Text style={styles.auditEventTime}>
                        {new Date(event.timestamp).toLocaleString()}
                      </Text>
                    </View>
                  </View>
                  {event.transactionHash && (
                    <TouchableOpacity onPress={() => openExplorer(event.transactionHash!)}>
                      <ExternalLink size={14} color={Colors.primary} />
                    </TouchableOpacity>
                  )}
                </View>
              ))}

              <View style={styles.auditHashCard}>
                <Hash size={16} color={Colors.primary} />
                <View style={styles.auditHashInfo}>
                  <Text style={styles.auditHashLabel}>Verification Hash</Text>
                  <Text style={styles.auditHashValue}>{contractService.auditTrail.getVerificationHash().slice(0, 32)}...</Text>
                </View>
              </View>
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
  headerButton: {
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
  heroImage: {
    width: '100%',
    height: 220,
    backgroundColor: Colors.cardElevated,
  },
  mainContent: {
    padding: 20,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  notFoundText: {
    fontSize: 18,
    color: Colors.textSecondary,
    marginTop: 16,
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  backButtonText: {
    color: Colors.background,
    fontWeight: '600' as const,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  typeTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  proposalTag: {
    backgroundColor: 'rgba(200, 232, 75, 0.15)',
  },
  askTag: {
    backgroundColor: 'rgba(212, 168, 83, 0.15)',
  },
  typeTagText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  proposalTagText: {
    color: Colors.primary,
  },
  askTagText: {
    color: Colors.golden,
  },
  statusTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  activeTag: {
    backgroundColor: 'rgba(76, 175, 80, 0.15)',
  },
  completedTag: {
    backgroundColor: 'rgba(200, 232, 75, 0.15)',
  },
  statusTagText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  activeTagText: {
    color: Colors.success,
  },
  completedTagText: {
    color: Colors.primary,
  },
  daoName: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  daoDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 20,
  },
  quickStats: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quickStat: {
    flex: 1,
    alignItems: 'center',
  },
  quickStatDivider: {
    width: 1,
    backgroundColor: Colors.border,
  },
  quickStatValue: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
    marginTop: 6,
    textTransform: 'capitalize',
  },
  quickStatLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  progressCard: {
    backgroundColor: Colors.cardElevated,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  progressPercent: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: Colors.card,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  progressDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  progressDetail: {
    alignItems: 'center',
  },
  progressDetailLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  progressDetailValue: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
    marginTop: 2,
  },
  tabsContainer: {
    marginBottom: 20,
  },
  tabsScroll: {
    gap: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tabActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: Colors.background,
  },
  tabContent: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 16,
  },
  contractCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  contractHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  contractTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  contractInfo: {
    marginBottom: 16,
  },
  contractLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.cardElevated,
    padding: 12,
    borderRadius: 10,
  },
  contractAddress: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'monospace',
    color: Colors.text,
  },
  contractMeta: {
    flexDirection: 'row',
    gap: 20,
  },
  contractMetaItem: {},
  contractMetaLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  contractMetaValue: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  milestoneCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  milestoneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  milestoneIndex: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  milestoneIndexText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: Colors.background,
  },
  milestoneInfo: {
    flex: 1,
  },
  milestoneName: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  milestoneDate: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  milestoneStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  releasedStatus: {
    backgroundColor: 'rgba(76, 175, 80, 0.15)',
  },
  releasedStatusText: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: Colors.success,
  },
  pendingStatus: {
    backgroundColor: 'rgba(212, 168, 83, 0.15)',
  },
  pendingStatusText: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: Colors.accent,
  },
  lockedStatus: {
    backgroundColor: Colors.cardElevated,
  },
  lockedStatusText: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  milestoneAmount: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginBottom: 12,
  },
  milestoneAmountValue: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  milestoneAmountLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  milestoneConditions: {
    marginBottom: 12,
  },
  conditionsLabel: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  conditionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  conditionDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary,
  },
  conditionText: {
    fontSize: 12,
    color: Colors.text,
  },
  txHashRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.cardElevated,
    padding: 8,
    borderRadius: 8,
  },
  txHashText: {
    flex: 1,
    fontSize: 11,
    fontFamily: 'monospace',
    color: Colors.primary,
  },
  teamSection: {
    gap: 12,
  },
  leaderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardElevated,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  leaderAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  leaderInfo: {
    flex: 1,
  },
  leaderName: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  leaderRole: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  leaderBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  leaderBadgeText: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: Colors.background,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  memberRole: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  governanceCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  governanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  governanceType: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  governanceSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  governanceDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 20,
  },
  governanceParams: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  governanceParam: {
    width: '47%',
    backgroundColor: Colors.cardElevated,
    borderRadius: 12,
    padding: 14,
  },
  paramValue: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  paramLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  votingRightsCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  votingRightsSummary: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  votingRightsStat: {
    flex: 1,
    alignItems: 'center',
  },
  votingRightsValue: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  votingRightsLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  topHoldersTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 12,
  },
  holderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  holderRank: {
    width: 30,
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  holderAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  holderInfo: {
    flex: 1,
  },
  holderName: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  holderAddress: {
    fontSize: 11,
    fontFamily: 'monospace',
    color: Colors.textSecondary,
  },
  holderPower: {
    alignItems: 'flex-end',
  },
  holderPowerValue: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  holderPowerPercent: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: '600' as const,
  },
  ledgerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chainInfo: {
    backgroundColor: Colors.cardElevated,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  chainInfoText: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  ledgerSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  transactionCard: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  txIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.cardElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  txInfo: {
    flex: 1,
  },
  txDescription: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  txMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 6,
  },
  txFrom: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  txTo: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  txFooter: {
    flexDirection: 'row',
    gap: 12,
  },
  txDate: {
    fontSize: 10,
    color: Colors.textSecondary,
  },
  txBlock: {
    fontSize: 10,
    color: Colors.textSecondary,
  },
  txRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  txAmount: {
    fontSize: 14,
    fontWeight: '700' as const,
  },
  txAmountPositive: {
    color: Colors.success,
  },
  txAmountNegative: {
    color: Colors.accent,
  },
  txStatus: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  txConfirmed: {
    backgroundColor: 'rgba(76, 175, 80, 0.15)',
  },
  txPending: {
    backgroundColor: 'rgba(212, 168, 83, 0.15)',
  },
  txStatusText: {
    fontSize: 10,
    fontWeight: '600' as const,
  },
  txConfirmedText: {
    color: Colors.success,
  },
  txPendingText: {
    color: Colors.accent,
  },
  reportsSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: -12,
    marginBottom: 16,
  },
  reportCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  reportBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  reportBadgeText: {
    fontSize: 11,
    fontWeight: '600' as const,
  },
  reportDate: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  reportSummary: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 12,
  },
  metricCard: {
    width: '31%',
    backgroundColor: Colors.cardElevated,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  metricLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
    textAlign: 'center' as const,
    marginTop: 2,
  },
  metricChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 4,
  },
  metricPositive: {},
  metricNegative: {},
  metricChangeText: {
    fontSize: 10,
    fontWeight: '600' as const,
  },
  metricPositiveText: {
    color: Colors.success,
  },
  metricNegativeText: {
    color: '#EF4444',
  },
  downloadReport: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  downloadReportText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500' as const,
    color: Colors.primary,
  },
  disburseSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: -12,
    marginBottom: 20,
  },
  availableFunds: {
    backgroundColor: Colors.cardElevated,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  availableFundsLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  availableFundsValue: {
    fontSize: 36,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  availableFundsCurrency: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  paymentMethodTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 16,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  paymentMethodActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.cardElevated,
  },
  paymentIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentName: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 2,
  },
  paymentDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  paymentRadio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentRadioActive: {
    borderColor: Colors.primary,
  },
  paymentRadioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
  },
  disburseNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: Colors.cardElevated,
    padding: 14,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 20,
  },
  disburseNoteText: {
    flex: 1,
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  disburseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 14,
    gap: 6,
  },
  disburseButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.background,
  },
  contractStatusCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  contractStatusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  contractStatusIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.cardElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contractStatusInfo: {
    flex: 1,
  },
  contractStatusTitle: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  contractStatusValue: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  statusActive: {
    color: Colors.success,
  },
  statusPaused: {
    color: Colors.accent,
  },
  versionBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  versionText: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: Colors.background,
  },
  pauseReasonBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    padding: 10,
    backgroundColor: 'rgba(212, 168, 83, 0.15)',
    borderRadius: 10,
  },
  pauseReasonText: {
    flex: 1,
    fontSize: 12,
    color: Colors.accent,
  },
  metadataCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  metadataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  metadataLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  metadataValue: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: Colors.text,
  },
  metadataValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metadataAddress: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: Colors.text,
  },
  upgradeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  upgradeText: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: Colors.success,
  },
  complianceCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  complianceRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  complianceItem: {
    alignItems: 'center',
    gap: 6,
  },
  complianceIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  complianceGreen: {
    backgroundColor: Colors.success,
  },
  complianceYellow: {
    backgroundColor: Colors.accent,
  },
  complianceRed: {
    backgroundColor: '#EF4444',
  },
  complianceLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  complianceValue: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  settingsCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
  },
  settingLabel: {
    flex: 1,
    fontSize: 13,
    color: Colors.text,
  },
  settingValue: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  paymentRailsCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  railHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  railTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  railsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  railItem: {
    alignItems: 'center',
    gap: 6,
  },
  railName: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  jurisdictionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  jurisdictionLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  jurisdictionValue: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  auditSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: -12,
    marginBottom: 16,
  },
  auditEventCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 10,
  },
  auditEventIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: Colors.cardElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  auditEventContent: {
    flex: 1,
  },
  auditEventDescription: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  auditEventMeta: {
    flexDirection: 'row',
    gap: 8,
  },
  auditEventActor: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  auditEventTime: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  auditHashCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.cardElevated,
    borderRadius: 12,
    padding: 14,
    marginTop: 8,
  },
  auditHashInfo: {
    flex: 1,
  },
  auditHashLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  auditHashValue: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: Colors.primary,
  },
  trustWeightingInfo: {
    backgroundColor: Colors.golden + '15',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.golden + '30',
  },
  trustWeightingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  trustWeightingTitle: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.golden,
  },
  trustWeightingDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  holderTrustScores: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  holderTrustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  holderTrustText: {
    fontSize: 10,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  holderMultiplier: {
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  holderMultiplierText: {
    fontSize: 10,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  holderBasePower: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 2,
  },
});
