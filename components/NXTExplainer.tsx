import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {
  Shield,
  ChevronRight,
  X,
  Vote,
  Key,
  Users,
  AlertTriangle,
  CheckCircle,
  Info,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { nxtTokenService } from '@/services/nxtToken';

interface NXTExplainerProps {
  variant?: 'card' | 'inline' | 'modal-trigger';
  showCredits?: boolean;
  creditsAmount?: number;
}

export default function NXTExplainer({ 
  variant = 'card', 
  showCredits = false,
  creditsAmount = 0,
}: NXTExplainerProps) {
  const [showModal, setShowModal] = useState(false);
  const explainer = nxtTokenService.getNXTExplainer();

  const renderInlineExplainer = () => (
    <View style={styles.inlineContainer}>
      <Info size={14} color={Colors.textSecondary} />
      <Text style={styles.inlineText}>
        Credits enable governance, access, and coordination—not equity or investment.
      </Text>
    </View>
  );

  const renderCardExplainer = () => (
    <View style={styles.cardContainer}>
      <View style={styles.cardHeader}>
        <View style={styles.cardIconContainer}>
          <Shield size={20} color={Colors.primary} />
        </View>
        <View style={styles.cardHeaderText}>
          <Text style={styles.cardTitle}>{explainer.title}</Text>
          <Text style={styles.cardSubtitle}>How NexTerra Credits Work</Text>
        </View>
      </View>

      {showCredits && creditsAmount > 0 && (
        <View style={styles.creditsDisplay}>
          <Text style={styles.creditsValue}>
            {nxtTokenService.formatGovernanceCredits(creditsAmount)}
          </Text>
          <Text style={styles.creditsLabel}>Your Governance Credits</Text>
        </View>
      )}

      <Text style={styles.cardDescription}>{explainer.description}</Text>

      <View style={styles.keyPointsContainer}>
        {explainer.keyPoints.map((point, index) => (
          <View key={index} style={styles.keyPoint}>
            <CheckCircle size={14} color={Colors.success} />
            <Text style={styles.keyPointText}>{point}</Text>
          </View>
        ))}
      </View>

      <View style={styles.disclaimerBox}>
        <AlertTriangle size={14} color={Colors.accent} />
        <Text style={styles.disclaimerText}>{explainer.disclaimer}</Text>
      </View>
    </View>
  );

  const renderModalTrigger = () => (
    <>
      <TouchableOpacity 
        style={styles.triggerButton}
        onPress={() => setShowModal(true)}
        activeOpacity={0.7}
      >
        <Shield size={16} color={Colors.primary} />
        <Text style={styles.triggerText}>Learn about Governance Credits</Text>
        <ChevronRight size={16} color={Colors.primary} />
      </TouchableOpacity>

      <Modal
        visible={showModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Governance Credits</Text>
            <TouchableOpacity onPress={() => setShowModal(false)}>
              <X size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <View style={styles.modalHeroIcon}>
              <Shield size={48} color={Colors.primary} />
            </View>

            <Text style={styles.modalHeroTitle}>
              What are Governance Credits?
            </Text>
            <Text style={styles.modalHeroDescription}>
              {explainer.description}
            </Text>

            <View style={styles.featuresGrid}>
              <View style={styles.featureCard}>
                <View style={[styles.featureIcon, { backgroundColor: Colors.primary + '20' }]}>
                  <Vote size={24} color={Colors.primary} />
                </View>
                <Text style={styles.featureTitle}>Governance</Text>
                <Text style={styles.featureDescription}>
                  Participate in DAO voting and proposal decisions
                </Text>
              </View>

              <View style={styles.featureCard}>
                <View style={[styles.featureIcon, { backgroundColor: Colors.accent + '20' }]}>
                  <Key size={24} color={Colors.accent} />
                </View>
                <Text style={styles.featureTitle}>Access</Text>
                <Text style={styles.featureDescription}>
                  Unlock premium features and exclusive content
                </Text>
              </View>

              <View style={styles.featureCard}>
                <View style={[styles.featureIcon, { backgroundColor: Colors.success + '20' }]}>
                  <Users size={24} color={Colors.success} />
                </View>
                <Text style={styles.featureTitle}>Coordination</Text>
                <Text style={styles.featureDescription}>
                  Collaborate effectively within DAOs and projects
                </Text>
              </View>
            </View>

            <View style={styles.modalNotEquitySection}>
              <Text style={styles.notEquityTitle}>Important Notice</Text>
              <View style={styles.notEquityItems}>
                <View style={styles.notEquityItem}>
                  <X size={16} color={Colors.error} />
                  <Text style={styles.notEquityText}>Not equity or ownership</Text>
                </View>
                <View style={styles.notEquityItem}>
                  <X size={16} color={Colors.error} />
                  <Text style={styles.notEquityText}>Not an investment product</Text>
                </View>
                <View style={styles.notEquityItem}>
                  <X size={16} color={Colors.error} />
                  <Text style={styles.notEquityText}>No speculative value</Text>
                </View>
              </View>
            </View>

            <View style={styles.modalDisclaimer}>
              <AlertTriangle size={16} color={Colors.accent} />
              <Text style={styles.modalDisclaimerText}>{explainer.disclaimer}</Text>
            </View>

            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={() => setShowModal(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.modalCloseButtonText}>Got it</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );

  switch (variant) {
    case 'inline':
      return renderInlineExplainer();
    case 'modal-trigger':
      return renderModalTrigger();
    case 'card':
    default:
      return renderCardExplainer();
  }
}

const styles = StyleSheet.create({
  inlineContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 12,
    backgroundColor: Colors.primary + '10',
    borderRadius: 10,
  },
  inlineText: {
    flex: 1,
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  cardContainer: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  cardIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeaderText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  cardSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  creditsDisplay: {
    alignItems: 'center',
    backgroundColor: Colors.primary + '10',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  creditsValue: {
    fontSize: 32,
    fontWeight: '800' as const,
    color: Colors.primary,
  },
  creditsLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: 16,
  },
  keyPointsContainer: {
    gap: 10,
    marginBottom: 16,
  },
  keyPoint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  keyPointText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500' as const,
  },
  disclaimerBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: Colors.accent + '10',
    padding: 14,
    borderRadius: 12,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 11,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  triggerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primary + '10',
    padding: 14,
    borderRadius: 12,
  },
  triggerText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500' as const,
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalHeroIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalHeroTitle: {
    fontSize: 22,
    fontWeight: '800' as const,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  modalHeroDescription: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 28,
  },
  featuresGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  featureCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  featureIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 6,
  },
  featureDescription: {
    fontSize: 11,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
  },
  modalNotEquitySection: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  notEquityTitle: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 12,
  },
  notEquityItems: {
    gap: 10,
  },
  notEquityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  notEquityText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  modalDisclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: Colors.accent + '10',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  modalDisclaimerText: {
    flex: 1,
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  modalCloseButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.background,
  },
});
