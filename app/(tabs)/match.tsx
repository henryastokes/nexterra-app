import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { 
  Sparkles, 
  Heart, 
  X, 
  MapPin, 
  Target, 
  DollarSign,
  TrendingUp,
  Upload,
  Settings,
  ChevronRight,
  CheckCircle,
  Globe,
  Users,
  Zap,
  Plus,
  FileText,
  Shield,
  UserPlus,
  Search,
  EyeOff,
  MessageSquare,
  Link,
  Bell,
  Calendar,
  ExternalLink,
  AlertCircle,
  Building2,
  ArrowRight,
} from 'lucide-react-native';
import Header from '@/components/Header';
import Colors from '@/constants/colors';
import { funders } from '@/mocks/funders';
import { 
  matchableProjects, 
  MatchableProject, 
  calculateMatchScore,
  impactCategories,
  getMatchedFundersForProject,
} from '@/mocks/matchableProjects';
import { countries, regions, issueAreas } from '@/mocks/submissions';
import { 
  fundingCalls, 
  FundingCall, 
  getTypeColor, 
  getTypeLabel, 
  getSourceLabel 
} from '@/mocks/fundingCalls';
import { communityUsers, CommunityUser } from '@/mocks/community';
import { 
  sampleTrustProfiles, 
  getVisibilityBoost, 
  getMatchingPriority,
  TrustImpactProfile 
} from '@/mocks/trustImpact';

type ViewMode = 'find_projects' | 'find_funders';

interface FunderPreferences {
  geographyPreferences: string[];
  issuePreferences: string[];
  fundingRangeMin: number;
  fundingRangeMax: number;
  impactPreferences: string[];
}

interface Collaborator {
  id: string;
  name: string;
  avatar: string;
  organization: string;
}

interface ProjectUpload {
  title: string;
  description: string;
  issueAreas: string[];
  countries: string[];
  region: string;
  fundingNeeded: string;
  impactMetrics: string[];
  timeline: string;
  collaborators: Collaborator[];
}

const defaultFunderPreferences: FunderPreferences = {
  geographyPreferences: ['East Africa', 'West Africa', 'Kenya', 'Nigeria'],
  issuePreferences: ['Disease Prevention', 'Climate Mitigation', 'Water Security'],
  fundingRangeMin: 50000,
  fundingRangeMax: 500000,
  impactPreferences: ['Lives Saved', 'Communities Reached', 'Healthcare Access'],
};

export default function MatchScreen() {
  const [viewMode, setViewMode] = useState<ViewMode>('find_projects');
  const [preferences, setPreferences] = useState<FunderPreferences>(defaultFunderPreferences);
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [likedProjects, setLikedProjects] = useState<string[]>([]);
  const [likedFunders, setLikedFunders] = useState<string[]>([]);
  const [selectedProject, setSelectedProject] = useState<MatchableProject | null>(null);
  const [projectUpload, setProjectUpload] = useState<ProjectUpload>({
    title: '',
    description: '',
    issueAreas: [],
    countries: [],
    region: '',
    fundingNeeded: '',
    impactMetrics: [],
    timeline: '1 year',
    collaborators: [],
  });
  const [userProjects, setUserProjects] = useState<MatchableProject[]>([]);
  const [countrySearchText, setCountrySearchText] = useState('');
  const [showCountrySuggestions, setShowCountrySuggestions] = useState(false);
  const [showCollaboratorModal, setShowCollaboratorModal] = useState(false);
  const [collaboratorSearch, setCollaboratorSearch] = useState('');
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [connectionMessage, setConnectionMessage] = useState('');
  const [selectedFunderForConnection, setSelectedFunderForConnection] = useState<typeof funders[0] | null>(null);
  const [anonymousFunderMode, setAnonymousFunderMode] = useState(false);
  const [selectedFundingCall, setSelectedFundingCall] = useState<FundingCall | null>(null);
  const [showFundingCallModal, setShowFundingCallModal] = useState(false);
  const [showConvertToDAOModal, setShowConvertToDAOModal] = useState(false);
  const [daoProposalTitle, setDaoProposalTitle] = useState('');
  const [daoProposalDescription, setDaoProposalDescription] = useState('');

  const getProjectTrustProfile = (projectId: string): TrustImpactProfile | undefined => {
    const index = matchableProjects.findIndex(p => p.id === projectId);
    return sampleTrustProfiles[index % sampleTrustProfiles.length];
  };

  const matchedProjects = useMemo(() => {
    return matchableProjects
      .map((project) => {
        const baseScore = calculateMatchScore(project, preferences);
        const trustProfile = getProjectTrustProfile(project.id);
        const visibilityBoost = trustProfile 
          ? getVisibilityBoost(trustProfile.credibilityScore, trustProfile.impactScore) 
          : 1;
        const matchingPriority = trustProfile 
          ? getMatchingPriority(trustProfile.credibilityScore, trustProfile.impactScore) 
          : 50;
        
        return {
          project,
          matchScore: baseScore,
          boostedScore: Math.min(Math.round(baseScore * visibilityBoost), 100),
          trustProfile,
          matchingPriority,
        };
      })
      .sort((a, b) => {
        if (b.boostedScore !== a.boostedScore) return b.boostedScore - a.boostedScore;
        return b.matchingPriority - a.matchingPriority;
      });
  }, [preferences]);

  const funderMatches = useMemo(() => {
    if (!selectedProject) return [];
    const funderData = funders.map((f) => ({
      id: f.id,
      name: f.name,
      avatar: f.avatar,
      organization: f.organization,
      focusAreas: f.focusAreas,
      country: f.country,
      totalFunded: f.totalFunded,
    }));
    return getMatchedFundersForProject(selectedProject, funderData);
  }, [selectedProject]);

  const handleLikeProject = (projectId: string) => {
    if (likedProjects.includes(projectId)) {
      setLikedProjects(likedProjects.filter((id) => id !== projectId));
    } else {
      setLikedProjects([...likedProjects, projectId]);
    }
  };

  const handleLikeFunder = (funderId: string) => {
    if (likedFunders.includes(funderId)) {
      setLikedFunders(likedFunders.filter((id) => id !== funderId));
    } else {
      const funder = funders.find(f => f.id === funderId);
      if (funder && selectedProject) {
        setSelectedFunderForConnection(funder);
        setConnectionMessage(`Hi ${funder.name},\n\nI'd like to connect with you regarding my project "${selectedProject.title}".\n\nThis project focuses on ${selectedProject.issueArea} in ${selectedProject.country} and we're seeking ${(selectedProject.fundingNeeded / 1000).toFixed(0)}K in funding.\n\nI believe there's strong alignment with your focus areas and would love to discuss potential collaboration.`);
        setShowConnectionModal(true);
      } else {
        setLikedFunders([...likedFunders, funderId]);
      }
    }
  };

  const handleSendConnection = () => {
    if (selectedFunderForConnection) {
      setLikedFunders([...likedFunders, selectedFunderForConnection.id]);
      setShowConnectionModal(false);
      setSelectedFunderForConnection(null);
      setConnectionMessage('');
      Alert.alert(
        'Connection Request Sent',
        `Your message and project details have been sent to ${selectedFunderForConnection.name}. They can view your project instantly.`
      );
    }
  };

  const handleUploadProject = () => {
    if (!projectUpload.title || !projectUpload.description || projectUpload.issueAreas.length === 0) {
      Alert.alert('Missing Information', 'Please fill in all required fields including at least one issue area.');
      return;
    }

    if (projectUpload.countries.length === 0) {
      Alert.alert('Missing Information', 'Please add at least one country.');
      return;
    }

    const newProject: MatchableProject = {
      id: `user_project_${Date.now()}`,
      title: projectUpload.title,
      description: projectUpload.description,
      issueArea: projectUpload.issueAreas[0],
      country: projectUpload.countries.join(', '),
      region: projectUpload.region || 'Multi-region',
      fundingNeeded: parseInt(projectUpload.fundingNeeded) || 100000,
      fundingMin: Math.floor((parseInt(projectUpload.fundingNeeded) || 100000) * 0.5),
      fundingMax: Math.floor((parseInt(projectUpload.fundingNeeded) || 100000) * 1.2),
      currency: 'USDC',
      impactMetrics: projectUpload.impactMetrics.length > 0 
        ? projectUpload.impactMetrics 
        : ['Communities Reached'],
      timeline: projectUpload.timeline,
      imageUrl: 'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=800',
      submittedBy: {
        id: 'current_user',
        name: 'You',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
        organization: 'Your Organization',
      },
      tags: projectUpload.issueAreas.map(area => area.toLowerCase()),
      status: 'seeking_funding',
      createdAt: new Date().toISOString(),
    };

    setUserProjects([...userProjects, newProject]);
    setSelectedProject(newProject);
    setShowUploadModal(false);
    setProjectUpload({
      title: '',
      description: '',
      issueAreas: [],
      countries: [],
      region: '',
      fundingNeeded: '',
      impactMetrics: [],
      timeline: '1 year',
      collaborators: [],
    });
    setCountrySearchText('');
    setViewMode('find_funders');
    
    Alert.alert(
      'Project Uploaded',
      'Your project has been submitted for matching. We found potential funders for you!'
    );
  };

  const filteredCountries = useMemo(() => {
    if (!countrySearchText.trim()) return countries;
    const search = countrySearchText.toLowerCase();
    return countries.filter(c => c.toLowerCase().includes(search));
  }, [countrySearchText]);

  const addCustomCountry = useCallback(() => {
    const trimmed = countrySearchText.trim();
    if (trimmed && !projectUpload.countries.includes(trimmed)) {
      setProjectUpload(prev => ({
        ...prev,
        countries: [...prev.countries, trimmed],
      }));
      setCountrySearchText('');
      setShowCountrySuggestions(false);
    }
  }, [countrySearchText, projectUpload.countries]);

  const removeCountry = useCallback((country: string) => {
    setProjectUpload(prev => ({
      ...prev,
      countries: prev.countries.filter(c => c !== country),
    }));
  }, []);

  const addCollaborator = useCallback((user: CommunityUser) => {
    const collaborator: Collaborator = {
      id: user.id,
      name: user.name,
      avatar: user.avatar,
      organization: user.affiliation,
    };
    if (!projectUpload.collaborators.find(c => c.id === user.id)) {
      setProjectUpload(prev => ({
        ...prev,
        collaborators: [...prev.collaborators, collaborator],
      }));
    }
  }, [projectUpload.collaborators]);

  const removeCollaborator = useCallback((id: string) => {
    setProjectUpload(prev => ({
      ...prev,
      collaborators: prev.collaborators.filter(c => c.id !== id),
    }));
  }, []);

  const filteredCollaborators = useMemo(() => {
    if (!collaboratorSearch.trim()) return communityUsers.slice(0, 10);
    const search = collaboratorSearch.toLowerCase();
    return communityUsers.filter(u => 
      u.name.toLowerCase().includes(search) || 
      u.affiliation.toLowerCase().includes(search)
    );
  }, [collaboratorSearch]);

  const handleViewFundingCall = (call: FundingCall) => {
    setSelectedFundingCall(call);
    setShowFundingCallModal(true);
  };

  const handleConvertToDAO = () => {
    if (selectedFundingCall) {
      setDaoProposalTitle(`Sub-DAO: ${selectedFundingCall.title}`);
      setDaoProposalDescription(`This Sub-DAO is created to respond to the ${getTypeLabel(selectedFundingCall.type)} from ${selectedFundingCall.organization}.\n\nObjective: ${selectedFundingCall.description}\n\nBudget Range: ${(selectedFundingCall.budgetMin / 1000).toFixed(0)}K - ${(selectedFundingCall.budgetMax / 1000).toFixed(0)}K\n\nDeadline: ${new Date(selectedFundingCall.deadline).toLocaleDateString()}`);
      setShowFundingCallModal(false);
      setShowConvertToDAOModal(true);
    }
  };

  const handleSubmitDAOProposal = () => {
    Alert.alert(
      'Sub-DAO Proposal Created',
      'Your proposal has been submitted for review. Team members can now bid on this opportunity.',
      [{ text: 'OK', onPress: () => {
        setShowConvertToDAOModal(false);
        setSelectedFundingCall(null);
        setDaoProposalTitle('');
        setDaoProposalDescription('');
      }}]
    );
  };

  const getDaysUntilDeadline = (deadline: string): number => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const togglePreference = (
    category: 'geographyPreferences' | 'issuePreferences' | 'impactPreferences',
    value: string
  ) => {
    setPreferences((prev) => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter((v) => v !== value)
        : [...prev[category], value],
    }));
  };

  const getMatchColor = (score: number) => {
    if (score >= 80) return '#10B981';
    if (score >= 60) return '#F59E0B';
    return '#6B7280';
  };

  const renderProjectCard = (
    project: MatchableProject,
    matchScore: number,
    isCompact = false,
    trustProfile?: TrustImpactProfile
  ) => (
    <TouchableOpacity
      key={project.id}
      style={[styles.projectCard, isCompact && styles.projectCardCompact]}
      activeOpacity={0.8}
      onPress={() => {
        setSelectedProject(project);
      }}
    >
      <Image source={{ uri: project.imageUrl }} style={styles.projectImage} />
      <View style={styles.projectOverlay} />
      
      <View style={styles.matchBadge}>
        <Sparkles size={12} color="#fff" />
        <Text style={styles.matchBadgeText}>{matchScore}% Match</Text>
      </View>

      {trustProfile && (
        <View style={styles.trustBadgeRow}>
          <View style={styles.trustBadgeItem}>
            <Shield size={10} color={Colors.primary} />
            <Text style={styles.trustBadgeText}>{trustProfile.credibilityScore}</Text>
          </View>
          <View style={styles.trustBadgeItem}>
            <Globe size={10} color={Colors.accent} />
            <Text style={styles.trustBadgeText}>{trustProfile.impactScore}</Text>
          </View>
        </View>
      )}

      <View style={styles.projectContent}>
        <View style={styles.projectTags}>
          <View style={[styles.issueTag, { backgroundColor: getMatchColor(matchScore) + '20' }]}>
            <Text style={[styles.issueTagText, { color: getMatchColor(matchScore) }]}>
              {project.issueArea}
            </Text>
          </View>
        </View>

        <Text style={styles.projectTitle} numberOfLines={2}>{project.title}</Text>
        
        <View style={styles.projectMeta}>
          <View style={styles.metaItem}>
            <MapPin size={12} color={Colors.textSecondary} />
            <Text style={styles.metaText}>{project.country}</Text>
          </View>
          <View style={styles.metaItem}>
            <DollarSign size={12} color={Colors.textSecondary} />
            <Text style={styles.metaText}>
              ${(project.fundingNeeded / 1000).toFixed(0)}K
            </Text>
          </View>
        </View>

        <View style={styles.projectFooter}>
          <View style={styles.submitterRow}>
            <Image
              source={{ uri: project.submittedBy.avatar }}
              style={styles.submitterAvatar}
            />
            <Text style={styles.submitterName} numberOfLines={1}>
              {project.submittedBy.name}
            </Text>
          </View>
          
          <TouchableOpacity
            style={[
              styles.likeButton,
              likedProjects.includes(project.id) && styles.likeButtonActive,
            ]}
            onPress={(e) => {
              e.stopPropagation();
              handleLikeProject(project.id);
            }}
          >
            <Heart
              size={18}
              color={likedProjects.includes(project.id) ? '#fff' : Colors.primary}
              fill={likedProjects.includes(project.id) ? '#fff' : 'none'}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderFunderCard = (
    funder: typeof funders[0],
    matchScore: number,
    matchReasons: string[]
  ) => (
    <View key={funder.id} style={styles.funderCard}>
      <View style={styles.funderHeader}>
        <Image source={{ uri: funder.avatar }} style={styles.funderAvatar} />
        <View style={styles.funderInfo}>
          <Text style={styles.funderName}>{funder.name}</Text>
          <Text style={styles.funderOrg}>{funder.organization}</Text>
        </View>
        <View style={[styles.funderMatchBadge, { backgroundColor: getMatchColor(matchScore) }]}>
          <Text style={styles.funderMatchText}>{matchScore}%</Text>
        </View>
      </View>

      <View style={styles.matchReasons}>
        {matchReasons.map((reason, idx) => (
          <View key={idx} style={styles.reasonTag}>
            <CheckCircle size={12} color={Colors.primary} />
            <Text style={styles.reasonText}>{reason}</Text>
          </View>
        ))}
      </View>

      <View style={styles.funderStats}>
        <View style={styles.funderStat}>
          <Text style={styles.funderStatValue}>
            ${(funder.totalFunded / 1000000).toFixed(1)}M
          </Text>
          <Text style={styles.funderStatLabel}>Total Funded</Text>
        </View>
        <View style={styles.funderStatDivider} />
        <View style={styles.funderStat}>
          <Text style={styles.funderStatValue}>{funder.projectsFunded}</Text>
          <Text style={styles.funderStatLabel}>Projects</Text>
        </View>
        <View style={styles.funderStatDivider} />
        <View style={styles.funderStat}>
          <Text style={styles.funderStatValue}>{funder.focusAreas.length}</Text>
          <Text style={styles.funderStatLabel}>Focus Areas</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.connectButton,
          likedFunders.includes(funder.id) && styles.connectButtonActive,
        ]}
        onPress={() => handleLikeFunder(funder.id)}
      >
        {likedFunders.includes(funder.id) ? (
          <>
            <CheckCircle size={18} color="#fff" />
            <Text style={styles.connectButtonTextActive}>Request Sent</Text>
          </>
        ) : (
          <>
            <Zap size={18} color={Colors.primary} />
            <Text style={styles.connectButtonText}>Connect</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );

  const renderPreferencesModal = () => (
    <Modal
      visible={showPreferencesModal}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Matching Preferences</Text>
          <TouchableOpacity onPress={() => setShowPreferencesModal(false)}>
            <X size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
          <View style={styles.prefSection}>
            <View style={styles.prefSectionHeader}>
              <Globe size={20} color={Colors.primary} />
              <Text style={styles.prefSectionTitle}>Geography Focus</Text>
            </View>
            <View style={styles.chipContainer}>
              {[...regions, ...countries.slice(0, 8)].map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.chip,
                    preferences.geographyPreferences.includes(item) && styles.chipActive,
                  ]}
                  onPress={() => togglePreference('geographyPreferences', item)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      preferences.geographyPreferences.includes(item) && styles.chipTextActive,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.prefSection}>
            <View style={styles.prefSectionHeader}>
              <Target size={20} color={Colors.primary} />
              <Text style={styles.prefSectionTitle}>Issue Areas</Text>
            </View>
            <View style={styles.chipContainer}>
              {issueAreas.map((area) => (
                <TouchableOpacity
                  key={area}
                  style={[
                    styles.chip,
                    preferences.issuePreferences.includes(area) && styles.chipActive,
                  ]}
                  onPress={() => togglePreference('issuePreferences', area)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      preferences.issuePreferences.includes(area) && styles.chipTextActive,
                    ]}
                  >
                    {area}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.prefSection}>
            <View style={styles.prefSectionHeader}>
              <DollarSign size={20} color={Colors.primary} />
              <Text style={styles.prefSectionTitle}>Funding Range</Text>
            </View>
            <View style={styles.fundingRangeRow}>
              <View style={styles.fundingInput}>
                <Text style={styles.fundingLabel}>Min</Text>
                <TextInput
                  style={styles.fundingTextInput}
                  value={preferences.fundingRangeMin.toString()}
                  onChangeText={(text) =>
                    setPreferences((prev) => ({
                      ...prev,
                      fundingRangeMin: parseInt(text) || 0,
                    }))
                  }
                  keyboardType="numeric"
                  placeholder="50000"
                  placeholderTextColor={Colors.textMuted}
                />
              </View>
              <Text style={styles.fundingDash}>—</Text>
              <View style={styles.fundingInput}>
                <Text style={styles.fundingLabel}>Max</Text>
                <TextInput
                  style={styles.fundingTextInput}
                  value={preferences.fundingRangeMax.toString()}
                  onChangeText={(text) =>
                    setPreferences((prev) => ({
                      ...prev,
                      fundingRangeMax: parseInt(text) || 0,
                    }))
                  }
                  keyboardType="numeric"
                  placeholder="500000"
                  placeholderTextColor={Colors.textMuted}
                />
              </View>
            </View>
          </View>

          <View style={styles.prefSection}>
            <View style={styles.prefSectionHeader}>
              <TrendingUp size={20} color={Colors.primary} />
              <Text style={styles.prefSectionTitle}>Impact Preferences</Text>
            </View>
            <View style={styles.chipContainer}>
              {impactCategories.map((impact) => (
                <TouchableOpacity
                  key={impact}
                  style={[
                    styles.chip,
                    preferences.impactPreferences.includes(impact) && styles.chipActive,
                  ]}
                  onPress={() => togglePreference('impactPreferences', impact)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      preferences.impactPreferences.includes(impact) && styles.chipTextActive,
                    ]}
                  >
                    {impact}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        <View style={styles.modalFooter}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => setShowPreferencesModal(false)}
          >
            <Text style={styles.saveButtonText}>Save Preferences</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderUploadModal = () => (
    <Modal
      visible={showUploadModal}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Upload Project for Matching</Text>
          <TouchableOpacity onPress={() => setShowUploadModal(false)}>
            <X size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
          <View style={styles.uploadSection}>
            <Text style={styles.inputLabel}>Project Title *</Text>
            <TextInput
              style={styles.textInput}
              value={projectUpload.title}
              onChangeText={(text) =>
                setProjectUpload((prev) => ({ ...prev, title: text }))
              }
              placeholder="Enter project title"
              placeholderTextColor={Colors.textMuted}
            />
          </View>

          <View style={styles.uploadSection}>
            <Text style={styles.inputLabel}>Description *</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={projectUpload.description}
              onChangeText={(text) =>
                setProjectUpload((prev) => ({ ...prev, description: text }))
              }
              placeholder="Describe your project and its goals"
              placeholderTextColor={Colors.textMuted}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.uploadSection}>
            <Text style={styles.inputLabel}>Issue Areas * (Select multiple)</Text>
            <View style={styles.chipContainer}>
              {issueAreas.map((area) => (
                <TouchableOpacity
                  key={area}
                  style={[
                    styles.chip,
                    projectUpload.issueAreas.includes(area) && styles.chipActive,
                  ]}
                  onPress={() =>
                    setProjectUpload((prev) => ({
                      ...prev,
                      issueAreas: prev.issueAreas.includes(area)
                        ? prev.issueAreas.filter(a => a !== area)
                        : [...prev.issueAreas, area],
                    }))
                  }
                >
                  <Text
                    style={[
                      styles.chipText,
                      projectUpload.issueAreas.includes(area) && styles.chipTextActive,
                    ]}
                  >
                    {area}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.uploadSection}>
            <Text style={styles.inputLabel}>Countries * (Add multiple)</Text>
            {projectUpload.countries.length > 0 && (
              <View style={styles.selectedCountriesRow}>
                {projectUpload.countries.map((country) => (
                  <View key={country} style={styles.selectedCountryChip}>
                    <Text style={styles.selectedCountryText}>{country}</Text>
                    <TouchableOpacity onPress={() => removeCountry(country)}>
                      <X size={14} color="#fff" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
            <View style={styles.countryInputContainer}>
              <Search size={18} color={Colors.textMuted} />
              <TextInput
                style={styles.countryInput}
                value={countrySearchText}
                onChangeText={(text) => {
                  setCountrySearchText(text);
                  setShowCountrySuggestions(true);
                }}
                placeholder="Type country name..."
                placeholderTextColor={Colors.textMuted}
                onFocus={() => setShowCountrySuggestions(true)}
              />
              {countrySearchText.trim() && (
                <TouchableOpacity style={styles.addCustomCountryBtn} onPress={addCustomCountry}>
                  <Plus size={16} color={Colors.primary} />
                  <Text style={styles.addCustomCountryText}>Add</Text>
                </TouchableOpacity>
              )}
            </View>
            {showCountrySuggestions && filteredCountries.length > 0 && (
              <View style={styles.countrySuggestions}>
                {filteredCountries.slice(0, 6).map((country) => (
                  <TouchableOpacity
                    key={country}
                    style={styles.countrySuggestionItem}
                    onPress={() => {
                      if (!projectUpload.countries.includes(country)) {
                        setProjectUpload(prev => ({
                          ...prev,
                          countries: [...prev.countries, country],
                        }));
                      }
                      setCountrySearchText('');
                      setShowCountrySuggestions(false);
                    }}
                  >
                    <MapPin size={14} color={Colors.textSecondary} />
                    <Text style={styles.countrySuggestionText}>{country}</Text>
                    {projectUpload.countries.includes(country) && (
                      <CheckCircle size={14} color={Colors.primary} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={styles.uploadSection}>
            <Text style={styles.inputLabel}>Collaborators</Text>
            {projectUpload.collaborators.length > 0 && (
              <View style={styles.collaboratorsRow}>
                {projectUpload.collaborators.map((collab) => (
                  <View key={collab.id} style={styles.collaboratorChip}>
                    <Image source={{ uri: collab.avatar }} style={styles.collaboratorAvatar} />
                    <Text style={styles.collaboratorName} numberOfLines={1}>{collab.name}</Text>
                    <TouchableOpacity onPress={() => removeCollaborator(collab.id)}>
                      <X size={14} color={Colors.textSecondary} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
            <TouchableOpacity 
              style={styles.addCollaboratorBtn}
              onPress={() => setShowCollaboratorModal(true)}
            >
              <UserPlus size={18} color={Colors.primary} />
              <Text style={styles.addCollaboratorText}>Add Collaborator from Network</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.uploadSection}>
            <Text style={styles.inputLabel}>Funding Needed (USDC)</Text>
            <TextInput
              style={styles.textInput}
              value={projectUpload.fundingNeeded}
              onChangeText={(text) =>
                setProjectUpload((prev) => ({ ...prev, fundingNeeded: text }))
              }
              placeholder="e.g., 150000"
              placeholderTextColor={Colors.textMuted}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.uploadSection}>
            <Text style={styles.inputLabel}>Expected Impact</Text>
            <View style={styles.chipContainer}>
              {impactCategories.slice(0, 6).map((impact) => (
                <TouchableOpacity
                  key={impact}
                  style={[
                    styles.chip,
                    projectUpload.impactMetrics.includes(impact) && styles.chipActive,
                  ]}
                  onPress={() =>
                    setProjectUpload((prev) => ({
                      ...prev,
                      impactMetrics: prev.impactMetrics.includes(impact)
                        ? prev.impactMetrics.filter((i) => i !== impact)
                        : [...prev.impactMetrics, impact],
                    }))
                  }
                >
                  <Text
                    style={[
                      styles.chipText,
                      projectUpload.impactMetrics.includes(impact) && styles.chipTextActive,
                    ]}
                  >
                    {impact}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.uploadSection}>
            <Text style={styles.inputLabel}>Timeline</Text>
            <View style={styles.timelineOptions}>
              {['6 months', '1 year', '2 years', '3+ years'].map((timeline) => (
                <TouchableOpacity
                  key={timeline}
                  style={[
                    styles.timelineOption,
                    projectUpload.timeline === timeline && styles.timelineOptionActive,
                  ]}
                  onPress={() =>
                    setProjectUpload((prev) => ({ ...prev, timeline }))
                  }
                >
                  <Text
                    style={[
                      styles.timelineOptionText,
                      projectUpload.timeline === timeline && styles.timelineOptionTextActive,
                    ]}
                  >
                    {timeline}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity style={styles.attachmentButton}>
            <FileText size={20} color={Colors.primary} />
            <Text style={styles.attachmentButtonText}>Add Supporting Documents</Text>
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.modalFooter}>
          <TouchableOpacity style={styles.saveButton} onPress={handleUploadProject}>
            <Sparkles size={20} color="#fff" />
            <Text style={styles.saveButtonText}>Find Matching Funders</Text>
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
          <View style={styles.aiTag}>
            <Sparkles size={14} color={Colors.primary} />
            <Text style={styles.aiTagText}>AI-Powered Matching</Text>
          </View>
          <Text style={styles.greeting}>Smart Funding Match</Text>
          <Text style={styles.heroSubtitle}>
            Connect projects with aligned funders based on geography, focus, and impact
          </Text>
        </View>

        <View style={styles.modeToggle}>
          <TouchableOpacity
            style={[
              styles.modeButton,
              viewMode === 'find_projects' && styles.modeButtonActive,
            ]}
            onPress={() => {
              setViewMode('find_projects');
              setSelectedProject(null);
            }}
          >
            <Target size={18} color={viewMode === 'find_projects' ? '#fff' : Colors.textSecondary} />
            <Text
              style={[
                styles.modeButtonText,
                viewMode === 'find_projects' && styles.modeButtonTextActive,
              ]}
            >
              Find Projects
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.modeButton,
              viewMode === 'find_funders' && styles.modeButtonActive,
            ]}
            onPress={() => setViewMode('find_funders')}
          >
            <Users size={18} color={viewMode === 'find_funders' ? '#fff' : Colors.textSecondary} />
            <Text
              style={[
                styles.modeButtonText,
                viewMode === 'find_funders' && styles.modeButtonTextActive,
              ]}
            >
              Find Funders
            </Text>
          </TouchableOpacity>
        </View>

        {viewMode === 'find_funders' && (
          <TouchableOpacity
            style={styles.anonymousModeToggle}
            onPress={() => setAnonymousFunderMode(!anonymousFunderMode)}
          >
            <EyeOff size={18} color={anonymousFunderMode ? Colors.primary : Colors.textSecondary} />
            <Text style={[styles.anonymousModeText, anonymousFunderMode && styles.anonymousModeTextActive]}>
              Anonymous Mode {anonymousFunderMode ? 'ON' : 'OFF'}
            </Text>
            <View style={[styles.anonymousModeSwitch, anonymousFunderMode && styles.anonymousModeSwitchActive]}>
              <View style={[styles.anonymousModeSwitchKnob, anonymousFunderMode && styles.anonymousModeSwitchKnobActive]} />
            </View>
          </TouchableOpacity>
        )}

        {anonymousFunderMode && viewMode === 'find_funders' && (
          <View style={styles.anonymousModeInfoBox}>
            <Shield size={16} color={Colors.primary} />
            <Text style={styles.anonymousModeInfoText}>
              Your profile is hidden from funders. Impact and governance participation are still logged. Only admins can see your identity for compliance.
            </Text>
          </View>
        )}

        {viewMode === 'find_projects' && (
          <>
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.preferencesButton}
                onPress={() => setShowPreferencesModal(true)}
              >
                <Settings size={18} color={Colors.primary} />
                <Text style={styles.preferencesButtonText}>Preferences</Text>
              </TouchableOpacity>
              <View style={styles.matchCount}>
                <Text style={styles.matchCountValue}>{matchedProjects.length}</Text>
                <Text style={styles.matchCountLabel}>Matches</Text>
              </View>
            </View>

            <View style={styles.criteriaPreview}>
              <Text style={styles.criteriaLabel}>Matching on:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {preferences.issuePreferences.slice(0, 3).map((pref) => (
                  <View key={pref} style={styles.criteriaChip}>
                    <Text style={styles.criteriaChipText}>{pref}</Text>
                  </View>
                ))}
                {preferences.geographyPreferences.slice(0, 2).map((pref) => (
                  <View key={pref} style={styles.criteriaChip}>
                    <MapPin size={10} color={Colors.primary} />
                    <Text style={styles.criteriaChipText}>{pref}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>

            <Text style={styles.sectionTitle}>Top Matches for You</Text>
            
            {matchedProjects.slice(0, 3).map(({ project, boostedScore, trustProfile }) => (
              renderProjectCard(project, boostedScore, false, trustProfile)
            ))}

            {matchedProjects.length > 3 && (
              <>
                <Text style={styles.sectionTitle}>More Matches</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.horizontalScroll}
                >
                  {matchedProjects.slice(3).map(({ project, boostedScore, trustProfile }) => (
                    <View key={project.id} style={styles.compactCardWrapper}>
                      {renderProjectCard(project, boostedScore, true, trustProfile)}
                    </View>
                  ))}
                </ScrollView>
              </>
            )}

            {likedProjects.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>
                  Your Interests ({likedProjects.length})
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.horizontalScroll}
                >
                  {likedProjects.map((id) => {
                    const match = matchedProjects.find((m) => m.project.id === id);
                    if (!match) return null;
                    return (
                      <View key={id} style={styles.likedCard}>
                        <Image
                          source={{ uri: match.project.imageUrl }}
                          style={styles.likedImage}
                        />
                        <View style={styles.likedOverlay} />
                        <View style={styles.likedContent}>
                          <Text style={styles.likedTitle} numberOfLines={2}>
                            {match.project.title}
                          </Text>
                          <View style={styles.likedBadge}>
                            <Heart size={12} color="#fff" fill="#fff" />
                            <Text style={styles.likedBadgeText}>Interested</Text>
                          </View>
                        </View>
                        {match.trustProfile && (
                          <View style={styles.likedTrustBadge}>
                            <Shield size={10} color="#fff" />
                            <Text style={styles.likedTrustText}>{match.trustProfile.credibilityScore}</Text>
                          </View>
                        )}
                      </View>
                    );
                  })}
                </ScrollView>
              </>
            )}
          </>
        )}

        {viewMode === 'find_funders' && (
          <>
            <TouchableOpacity
              style={styles.uploadProjectButton}
              onPress={() => setShowUploadModal(true)}
            >
              <Plus size={20} color="#fff" />
              <Text style={styles.uploadProjectButtonText}>Upload New Project</Text>
            </TouchableOpacity>

            {!selectedProject && userProjects.length === 0 && (
              <View style={styles.emptyState}>
                <Upload size={48} color={Colors.textMuted} />
                <Text style={styles.emptyStateTitle}>No Project Selected</Text>
                <Text style={styles.emptyStateText}>
                  Upload a project or select one from &quot;Find Projects&quot; to see matching funders
                </Text>
              </View>
            )}

            {userProjects.length > 0 && !selectedProject && (
              <>
                <Text style={styles.sectionTitle}>Your Projects</Text>
                {userProjects.map((project) => (
                  <TouchableOpacity
                    key={project.id}
                    style={styles.userProjectCard}
                    onPress={() => setSelectedProject(project)}
                  >
                    <View style={styles.userProjectInfo}>
                      <Text style={styles.userProjectTitle}>{project.title}</Text>
                      <Text style={styles.userProjectMeta}>
                        {project.issueArea} · ${(project.fundingNeeded / 1000).toFixed(0)}K needed
                      </Text>
                    </View>
                    <ChevronRight size={20} color={Colors.textSecondary} />
                  </TouchableOpacity>
                ))}
              </>
            )}

            {selectedProject && (
              <>
                <View style={styles.selectedProjectCard}>
                  <View style={styles.selectedProjectHeader}>
                    <Text style={styles.selectedProjectLabel}>Finding funders for:</Text>
                    <TouchableOpacity onPress={() => setSelectedProject(null)}>
                      <X size={20} color={Colors.textSecondary} />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.selectedProjectTitle}>{selectedProject.title}</Text>
                  <View style={styles.selectedProjectMeta}>
                    <View style={styles.metaItem}>
                      <MapPin size={14} color={Colors.primary} />
                      <Text style={styles.metaTextPrimary}>{selectedProject.country}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Target size={14} color={Colors.primary} />
                      <Text style={styles.metaTextPrimary}>{selectedProject.issueArea}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <DollarSign size={14} color={Colors.primary} />
                      <Text style={styles.metaTextPrimary}>
                        ${(selectedProject.fundingNeeded / 1000).toFixed(0)}K
                      </Text>
                    </View>
                  </View>
                </View>

                <Text style={styles.sectionTitle}>
                  Recommended Funders ({funderMatches.length})
                </Text>

                {funderMatches.slice(0, 6).map(({ funder, matchScore, matchReasons }) => {
                  const fullFunder = funders.find((f) => f.id === funder.id);
                  if (!fullFunder) return null;
                  return renderFunderCard(fullFunder, matchScore, matchReasons);
                })}
              </>
            )}
          </>
        )}

        <View style={styles.fundingCallsSection}>
          <View style={styles.fundingCallsHeader}>
            <View style={styles.fundingCallsTitleRow}>
              <Bell size={20} color={Colors.golden} />
              <Text style={styles.fundingCallsTitle}>Funding Calls & Solicitations</Text>
            </View>
            <Text style={styles.fundingCallsSubtitle}>
              Active opportunities from CEPI, governments, and multilateral organizations
            </Text>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.fundingCallsScroll}
          >
            {fundingCalls.map((call) => {
              const daysLeft = getDaysUntilDeadline(call.deadline);
              const isUrgent = daysLeft <= 30 || call.isUrgent;
              return (
                <TouchableOpacity
                  key={call.id}
                  style={styles.fundingCallCard}
                  activeOpacity={0.8}
                  onPress={() => handleViewFundingCall(call)}
                >
                  <View style={styles.fundingCallTopRow}>
                    <View style={[styles.fundingCallTypeBadge, { backgroundColor: getTypeColor(call.type) + '20' }]}>
                      <Text style={[styles.fundingCallTypeText, { color: getTypeColor(call.type) }]}>
                        {getTypeLabel(call.type)}
                      </Text>
                    </View>
                    {isUrgent && (
                      <View style={styles.urgentBadge}>
                        <AlertCircle size={10} color="#fff" />
                        <Text style={styles.urgentBadgeText}>Urgent</Text>
                      </View>
                    )}
                  </View>

                  <Text style={styles.fundingCallTitle} numberOfLines={2}>{call.title}</Text>
                  
                  <View style={styles.fundingCallOrgRow}>
                    <Building2 size={12} color={Colors.textSecondary} />
                    <Text style={styles.fundingCallOrgText}>{call.organization}</Text>
                  </View>

                  <View style={styles.fundingCallTags}>
                    {call.issueAreas.slice(0, 2).map((area, idx) => (
                      <View key={idx} style={styles.fundingCallTag}>
                        <Text style={styles.fundingCallTagText}>{area}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.fundingCallMeta}>
                    <View style={styles.fundingCallMetaItem}>
                      <DollarSign size={12} color={Colors.primary} />
                      <Text style={styles.fundingCallMetaText}>
                        ${(call.budgetMin / 1000).toFixed(0)}K - ${(call.budgetMax / 1000000).toFixed(1)}M
                      </Text>
                    </View>
                    <View style={styles.fundingCallMetaItem}>
                      <Calendar size={12} color={daysLeft <= 14 ? '#DC2626' : Colors.textSecondary} />
                      <Text style={[
                        styles.fundingCallMetaText,
                        daysLeft <= 14 && styles.fundingCallDeadlineUrgent
                      ]}>
                        {daysLeft} days left
                      </Text>
                    </View>
                  </View>

                  <View style={styles.fundingCallCountries}>
                    <MapPin size={11} color={Colors.textMuted} />
                    <Text style={styles.fundingCallCountriesText} numberOfLines={1}>
                      {call.countries.slice(0, 3).join(', ')}
                    </Text>
                  </View>

                  <View style={styles.fundingCallSourceRow}>
                    <Text style={styles.fundingCallSourceText}>
                      via {getSourceLabel(call.source)}
                    </Text>
                    <ArrowRight size={14} color={Colors.primary} />
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.tipsCard}>
          <Sparkles size={20} color={Colors.primary} />
          <View style={styles.tipsContent}>
            <Text style={styles.tipsTitle}>AI Matching Tips</Text>
            <Text style={styles.tipsText}>
              {viewMode === 'find_projects'
                ? 'Set your preferences to see projects that align with your funding criteria. The more specific, the better the matches.'
                : 'Upload detailed project information to get matched with funders who share your vision and geographic focus.'}
            </Text>
          </View>
        </View>
      </ScrollView>

      {renderPreferencesModal()}
      {renderUploadModal()}

      <Modal
        visible={showCollaboratorModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Collaborators</Text>
            <TouchableOpacity onPress={() => setShowCollaboratorModal(false)}>
              <X size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.collaboratorSearchContainer}>
            <Search size={18} color={Colors.textMuted} />
            <TextInput
              style={styles.collaboratorSearchInput}
              value={collaboratorSearch}
              onChangeText={setCollaboratorSearch}
              placeholder="Search by name or organization..."
              placeholderTextColor={Colors.textMuted}
            />
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {filteredCollaborators.map((user) => {
              const isAdded = projectUpload.collaborators.some(c => c.id === user.id);
              return (
                <TouchableOpacity
                  key={user.id}
                  style={[styles.collaboratorListItem, isAdded && styles.collaboratorListItemAdded]}
                  onPress={() => !isAdded && addCollaborator(user)}
                  disabled={isAdded}
                >
                  <Image source={{ uri: user.avatar }} style={styles.collaboratorListAvatar} />
                  <View style={styles.collaboratorListInfo}>
                    <Text style={styles.collaboratorListName}>{user.name}</Text>
                    <Text style={styles.collaboratorListOrg}>{user.affiliation}</Text>
                    <View style={styles.collaboratorExpertise}>
                      {user.expertise.slice(0, 2).map((exp) => (
                        <Text key={exp} style={styles.collaboratorExpertiseText}>{exp}</Text>
                      ))}
                    </View>
                  </View>
                  {isAdded ? (
                    <CheckCircle size={22} color={Colors.primary} />
                  ) : (
                    <Plus size={22} color={Colors.primary} />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => setShowCollaboratorModal(false)}
            >
              <Text style={styles.saveButtonText}>Done ({projectUpload.collaborators.length} selected)</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showConnectionModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Connect with Funder</Text>
            <TouchableOpacity onPress={() => {
              setShowConnectionModal(false);
              setSelectedFunderForConnection(null);
              setConnectionMessage('');
            }}>
              <X size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {selectedFunderForConnection && (
              <View style={styles.connectionFunderCard}>
                <Image source={{ uri: selectedFunderForConnection.avatar }} style={styles.connectionFunderAvatar} />
                <View style={styles.connectionFunderInfo}>
                  <Text style={styles.connectionFunderName}>{selectedFunderForConnection.name}</Text>
                  <Text style={styles.connectionFunderOrg}>{selectedFunderForConnection.organization}</Text>
                </View>
              </View>
            )}

            {selectedProject && (
              <View style={styles.linkedProjectCard}>
                <View style={styles.linkedProjectHeader}>
                  <Link size={16} color={Colors.primary} />
                  <Text style={styles.linkedProjectLabel}>Auto-linked Project</Text>
                </View>
                <Text style={styles.linkedProjectTitle}>{selectedProject.title}</Text>
                <View style={styles.linkedProjectMeta}>
                  <Text style={styles.linkedProjectMetaText}>{selectedProject.issueArea}</Text>
                  <Text style={styles.linkedProjectMetaText}>•</Text>
                  <Text style={styles.linkedProjectMetaText}>{selectedProject.country}</Text>
                  <Text style={styles.linkedProjectMetaText}>•</Text>
                  <Text style={styles.linkedProjectMetaText}>${(selectedProject.fundingNeeded / 1000).toFixed(0)}K</Text>
                </View>
              </View>
            )}

            <View style={styles.uploadSection}>
              <Text style={styles.inputLabel}>
                <MessageSquare size={14} color={Colors.text} /> Your Message
              </Text>
              <TextInput
                style={[styles.textInput, styles.connectionMessageInput]}
                value={connectionMessage}
                onChangeText={setConnectionMessage}
                multiline
                numberOfLines={8}
                textAlignVertical="top"
                placeholder="Write a personalized message..."
                placeholderTextColor={Colors.textMuted}
              />
            </View>

            <View style={styles.connectionInfoBox}>
              <CheckCircle size={16} color={Colors.primary} />
              <Text style={styles.connectionInfoText}>
                The funder will be able to view your project details instantly after receiving this request.
              </Text>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSendConnection}>
              <Zap size={20} color="#fff" />
              <Text style={styles.saveButtonText}>Send Connection Request</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showFundingCallModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Funding Opportunity</Text>
            <TouchableOpacity onPress={() => {
              setShowFundingCallModal(false);
              setSelectedFundingCall(null);
            }}>
              <X size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>

          {selectedFundingCall && (
            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              <View style={styles.fundingCallDetailHeader}>
                <View style={[styles.fundingCallTypeBadgeLarge, { backgroundColor: getTypeColor(selectedFundingCall.type) + '20' }]}>
                  <Text style={[styles.fundingCallTypeLargeText, { color: getTypeColor(selectedFundingCall.type) }]}>
                    {getTypeLabel(selectedFundingCall.type)}
                  </Text>
                </View>
                {selectedFundingCall.isUrgent && (
                  <View style={styles.urgentBadgeLarge}>
                    <AlertCircle size={12} color="#fff" />
                    <Text style={styles.urgentBadgeLargeText}>Urgent</Text>
                  </View>
                )}
              </View>

              <Text style={styles.fundingCallDetailTitle}>{selectedFundingCall.title}</Text>
              
              <View style={styles.fundingCallDetailOrg}>
                <Building2 size={16} color={Colors.primary} />
                <Text style={styles.fundingCallDetailOrgText}>{selectedFundingCall.organization}</Text>
              </View>

              <View style={styles.fundingCallDetailStats}>
                <View style={styles.fundingCallDetailStat}>
                  <DollarSign size={18} color={Colors.primary} />
                  <View>
                    <Text style={styles.fundingCallDetailStatValue}>
                      ${(selectedFundingCall.budgetMin / 1000).toFixed(0)}K - ${(selectedFundingCall.budgetMax / 1000000).toFixed(1)}M
                    </Text>
                    <Text style={styles.fundingCallDetailStatLabel}>Budget Range ({selectedFundingCall.currency})</Text>
                  </View>
                </View>
                <View style={styles.fundingCallDetailStatDivider} />
                <View style={styles.fundingCallDetailStat}>
                  <Calendar size={18} color={getDaysUntilDeadline(selectedFundingCall.deadline) <= 14 ? '#DC2626' : Colors.primary} />
                  <View>
                    <Text style={[
                      styles.fundingCallDetailStatValue,
                      getDaysUntilDeadline(selectedFundingCall.deadline) <= 14 && { color: '#DC2626' }
                    ]}>
                      {new Date(selectedFundingCall.deadline).toLocaleDateString()}
                    </Text>
                    <Text style={styles.fundingCallDetailStatLabel}>
                      {getDaysUntilDeadline(selectedFundingCall.deadline)} days remaining
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.fundingCallDetailSection}>
                <Text style={styles.fundingCallDetailSectionTitle}>Description</Text>
                <Text style={styles.fundingCallDetailDescription}>{selectedFundingCall.description}</Text>
              </View>

              <View style={styles.fundingCallDetailSection}>
                <Text style={styles.fundingCallDetailSectionTitle}>Countries / Regions</Text>
                <View style={styles.fundingCallDetailChips}>
                  {selectedFundingCall.countries.map((country, idx) => (
                    <View key={idx} style={styles.fundingCallDetailChip}>
                      <MapPin size={12} color={Colors.primary} />
                      <Text style={styles.fundingCallDetailChipText}>{country}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.fundingCallDetailSection}>
                <Text style={styles.fundingCallDetailSectionTitle}>Issue Areas</Text>
                <View style={styles.fundingCallDetailChips}>
                  {selectedFundingCall.issueAreas.map((area, idx) => (
                    <View key={idx} style={styles.fundingCallDetailChip}>
                      <Target size={12} color={Colors.accent} />
                      <Text style={styles.fundingCallDetailChipText}>{area}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.fundingCallDetailSection}>
                <Text style={styles.fundingCallDetailSectionTitle}>Eligibility</Text>
                {selectedFundingCall.eligibility.map((item, idx) => (
                  <View key={idx} style={styles.fundingCallDetailListItem}>
                    <CheckCircle size={14} color={Colors.primary} />
                    <Text style={styles.fundingCallDetailListText}>{item}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.fundingCallDetailSection}>
                <Text style={styles.fundingCallDetailSectionTitle}>Requirements</Text>
                {selectedFundingCall.requirements.map((item, idx) => (
                  <View key={idx} style={styles.fundingCallDetailListItem}>
                    <FileText size={14} color={Colors.textSecondary} />
                    <Text style={styles.fundingCallDetailListText}>{item}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.fundingCallDetailSourceBox}>
                <Text style={styles.fundingCallDetailSourceLabel}>Source</Text>
                <Text style={styles.fundingCallDetailSourceValue}>{getSourceLabel(selectedFundingCall.source)}</Text>
                <Text style={styles.fundingCallDetailPostedDate}>Posted: {new Date(selectedFundingCall.postedDate).toLocaleDateString()}</Text>
              </View>

              <TouchableOpacity style={styles.externalLinkButton}>
                <ExternalLink size={18} color={Colors.primary} />
                <Text style={styles.externalLinkButtonText}>View Original Posting</Text>
              </TouchableOpacity>
            </ScrollView>
          )}

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.convertToDAOButton} onPress={handleConvertToDAO}>
              <Zap size={20} color="#fff" />
              <Text style={styles.convertToDAOButtonText}>Convert to Sub-DAO Proposal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showConvertToDAOModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Create Sub-DAO Proposal</Text>
            <TouchableOpacity onPress={() => {
              setShowConvertToDAOModal(false);
              setSelectedFundingCall(null);
              setDaoProposalTitle('');
              setDaoProposalDescription('');
            }}>
              <X size={24} color={Colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={styles.convertDAOInfoBox}>
              <Zap size={18} color={Colors.golden} />
              <Text style={styles.convertDAOInfoText}>
                Creating a Sub-DAO allows teams to bid on this funding opportunity with fixed scope, budget, and timeline.
              </Text>
            </View>

            <View style={styles.uploadSection}>
              <Text style={styles.inputLabel}>Proposal Title</Text>
              <TextInput
                style={styles.textInput}
                value={daoProposalTitle}
                onChangeText={setDaoProposalTitle}
                placeholder="Enter proposal title"
                placeholderTextColor={Colors.textMuted}
              />
            </View>

            <View style={styles.uploadSection}>
              <Text style={styles.inputLabel}>Proposal Description</Text>
              <TextInput
                style={[styles.textInput, styles.daoDescriptionInput]}
                value={daoProposalDescription}
                onChangeText={setDaoProposalDescription}
                placeholder="Describe the proposal objectives and approach"
                placeholderTextColor={Colors.textMuted}
                multiline
                textAlignVertical="top"
              />
            </View>

            {selectedFundingCall && (
              <View style={styles.daoLinkedCallCard}>
                <View style={styles.daoLinkedCallHeader}>
                  <Link size={14} color={Colors.primary} />
                  <Text style={styles.daoLinkedCallLabel}>Linked Funding Call</Text>
                </View>
                <Text style={styles.daoLinkedCallTitle}>{selectedFundingCall.title}</Text>
                <View style={styles.daoLinkedCallMeta}>
                  <Text style={styles.daoLinkedCallMetaText}>{selectedFundingCall.organization}</Text>
                  <Text style={styles.daoLinkedCallMetaText}>•</Text>
                  <Text style={styles.daoLinkedCallMetaText}>
                    ${(selectedFundingCall.budgetMin / 1000).toFixed(0)}K - ${(selectedFundingCall.budgetMax / 1000000).toFixed(1)}M
                  </Text>
                </View>
              </View>
            )}

            <View style={styles.daoWorkflowSteps}>
              <Text style={styles.daoWorkflowTitle}>What happens next:</Text>
              <View style={styles.daoWorkflowStep}>
                <View style={styles.daoWorkflowStepNumber}>
                  <Text style={styles.daoWorkflowStepNumberText}>1</Text>
                </View>
                <Text style={styles.daoWorkflowStepText}>Teams can submit bids with their approach and budget</Text>
              </View>
              <View style={styles.daoWorkflowStep}>
                <View style={styles.daoWorkflowStepNumber}>
                  <Text style={styles.daoWorkflowStepNumberText}>2</Text>
                </View>
                <Text style={styles.daoWorkflowStepText}>Community reviews and votes on best proposal</Text>
              </View>
              <View style={styles.daoWorkflowStep}>
                <View style={styles.daoWorkflowStepNumber}>
                  <Text style={styles.daoWorkflowStepNumberText}>3</Text>
                </View>
                <Text style={styles.daoWorkflowStepText}>Winning team forms Sub-DAO with escrow funding</Text>
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSubmitDAOProposal}>
              <CheckCircle size={20} color="#fff" />
              <Text style={styles.saveButtonText}>Create Sub-DAO Proposal</Text>
            </TouchableOpacity>
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
  aiTag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: Colors.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  aiTagText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.primary,
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
    lineHeight: 22,
  },
  modeToggle: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  modeButtonActive: {
    backgroundColor: Colors.primary,
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  modeButtonTextActive: {
    color: '#fff',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 20,
  },
  preferencesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  preferencesButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  matchCount: {
    alignItems: 'center',
  },
  matchCountValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  matchCountLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  criteriaPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 16,
    gap: 8,
  },
  criteriaLabel: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  criteriaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary + '15',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    gap: 4,
  },
  criteriaChipText: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: '500' as const,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 12,
  },
  projectCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  projectCardCompact: {
    width: 280,
    marginHorizontal: 0,
  },
  projectImage: {
    width: '100%',
    height: 160,
  },
  projectOverlay: {
    ...StyleSheet.absoluteFillObject,
    height: 160,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  matchBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  matchBadgeText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: '#fff',
  },
  projectContent: {
    padding: 16,
  },
  projectTags: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  issueTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  issueTagText: {
    fontSize: 11,
    fontWeight: '600' as const,
  },
  projectTitle: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 10,
    lineHeight: 22,
  },
  projectMeta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  metaTextPrimary: {
    fontSize: 13,
    color: Colors.text,
    fontWeight: '500' as const,
  },
  projectFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  submitterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  submitterAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  submitterName: {
    fontSize: 13,
    color: Colors.textSecondary,
    flex: 1,
  },
  likeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  likeButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  horizontalScroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  compactCardWrapper: {
    marginRight: 12,
  },
  likedCard: {
    width: 160,
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 12,
  },
  likedImage: {
    width: '100%',
    height: '100%',
  },
  likedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  likedContent: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
  },
  likedTitle: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: '#fff',
    marginBottom: 8,
  },
  likedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  likedBadgeText: {
    fontSize: 10,
    fontWeight: '600' as const,
    color: '#fff',
  },
  uploadProjectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  uploadProjectButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#fff',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  userProjectCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  userProjectInfo: {
    flex: 1,
  },
  userProjectTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  userProjectMeta: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  selectedProjectCard: {
    backgroundColor: Colors.primary + '10',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primary + '30',
  },
  selectedProjectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  selectedProjectLabel: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500' as const,
  },
  selectedProjectTitle: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 12,
  },
  selectedProjectMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  funderCard: {
    backgroundColor: Colors.card,
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  funderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  funderAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  funderInfo: {
    flex: 1,
  },
  funderName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  funderOrg: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  funderMatchBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  funderMatchText: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: '#fff',
  },
  matchReasons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  reasonTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary + '10',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  reasonText: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: '500' as const,
  },
  funderStats: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  funderStat: {
    flex: 1,
    alignItems: 'center',
  },
  funderStatValue: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  funderStatLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  funderStatDivider: {
    width: 1,
    backgroundColor: Colors.border,
    marginVertical: 4,
  },
  connectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary + '15',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  connectButtonActive: {
    backgroundColor: Colors.primary,
  },
  connectButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  connectButtonTextActive: {
    color: '#fff',
  },
  tipsCard: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 24,
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    gap: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tipsContent: {
    flex: 1,
  },
  tipsTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  tipsText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
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
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingBottom: 16,
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
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  prefSection: {
    marginTop: 24,
  },
  prefSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  prefSectionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  chipTextActive: {
    color: '#fff',
    fontWeight: '500' as const,
  },
  fundingRangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  fundingInput: {
    flex: 1,
  },
  fundingLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  fundingTextInput: {
    backgroundColor: Colors.card,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  fundingDash: {
    fontSize: 18,
    color: Colors.textMuted,
    marginTop: 20,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#fff',
  },
  uploadSection: {
    marginTop: 20,
  },
  uploadRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  uploadHalf: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: Colors.card,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  selectContainer: {
    flexDirection: 'row',
  },
  selectOption: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 8,
  },
  selectOptionActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  selectOptionText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  selectOptionTextActive: {
    color: '#fff',
    fontWeight: '500' as const,
  },
  timelineOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  timelineOption: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  timelineOptionActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  timelineOptionText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  timelineOptionTextActive: {
    color: '#fff',
    fontWeight: '500' as const,
  },
  attachmentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.card,
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  attachmentButtonText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.primary,
  },
  trustBadgeRow: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    gap: 6,
  },
  trustBadgeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trustBadgeText: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: '#fff',
  },
  likedTrustBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
  },
  likedTrustText: {
    fontSize: 10,
    fontWeight: '700' as const,
    color: '#fff',
  },
  selectedCountriesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  selectedCountryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  selectedCountryText: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: '#fff',
  },
  countryInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  countryInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontSize: 15,
    color: Colors.text,
  },
  addCustomCountryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary + '15',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  addCustomCountryText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  countrySuggestions: {
    marginTop: 8,
    backgroundColor: Colors.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  countrySuggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  countrySuggestionText: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
  },
  collaboratorsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  collaboratorChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  collaboratorAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  collaboratorName: {
    fontSize: 13,
    color: Colors.text,
    maxWidth: 100,
  },
  addCollaboratorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.card,
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
  },
  addCollaboratorText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.primary,
  },
  collaboratorSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    marginHorizontal: 20,
    marginTop: 16,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  collaboratorSearchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    fontSize: 15,
    color: Colors.text,
  },
  collaboratorListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  collaboratorListItemAdded: {
    opacity: 0.6,
  },
  collaboratorListAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  collaboratorListInfo: {
    flex: 1,
  },
  collaboratorListName: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  collaboratorListOrg: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  collaboratorExpertise: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 6,
  },
  collaboratorExpertiseText: {
    fontSize: 11,
    color: Colors.primary,
    backgroundColor: Colors.primary + '15',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  connectionFunderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  connectionFunderAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 14,
  },
  connectionFunderInfo: {
    flex: 1,
  },
  connectionFunderName: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  connectionFunderOrg: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  linkedProjectCard: {
    backgroundColor: Colors.primary + '10',
    padding: 14,
    borderRadius: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: Colors.primary + '30',
  },
  linkedProjectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  linkedProjectLabel: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  linkedProjectTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 6,
  },
  linkedProjectMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  linkedProjectMetaText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  connectionMessageInput: {
    height: 180,
    textAlignVertical: 'top',
  },
  connectionInfoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.primary + '10',
    padding: 14,
    borderRadius: 10,
    marginTop: 16,
    gap: 10,
  },
  connectionInfoText: {
    flex: 1,
    fontSize: 13,
    color: Colors.text,
    lineHeight: 19,
  },
  anonymousModeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: Colors.card,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 10,
  },
  anonymousModeText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.textSecondary,
  },
  anonymousModeTextActive: {
    color: Colors.primary,
  },
  anonymousModeSwitch: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.border,
    padding: 2,
  },
  anonymousModeSwitchActive: {
    backgroundColor: Colors.primary,
  },
  anonymousModeSwitchKnob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  anonymousModeSwitchKnobActive: {
    marginLeft: 20,
  },
  anonymousModeInfoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginHorizontal: 20,
    marginTop: 12,
    backgroundColor: Colors.primary + '10',
    padding: 12,
    borderRadius: 10,
    gap: 10,
  },
  anonymousModeInfoText: {
    flex: 1,
    fontSize: 12,
    color: Colors.text,
    lineHeight: 18,
  },
  fundingCallsSection: {
    marginTop: 28,
    marginBottom: 8,
  },
  fundingCallsHeader: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  fundingCallsTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  fundingCallsTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  fundingCallsSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  fundingCallsScroll: {
    paddingHorizontal: 20,
    gap: 14,
  },
  fundingCallCard: {
    width: 290,
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  fundingCallTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  fundingCallTypeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  fundingCallTypeText: {
    fontSize: 11,
    fontWeight: '600' as const,
  },
  urgentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DC2626',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  urgentBadgeText: {
    fontSize: 10,
    fontWeight: '600' as const,
    color: '#fff',
  },
  fundingCallTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 8,
    lineHeight: 20,
  },
  fundingCallOrgRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  fundingCallOrgText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
  },
  fundingCallTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  fundingCallTag: {
    backgroundColor: Colors.primary + '15',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  fundingCallTagText: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: '500' as const,
  },
  fundingCallMeta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 10,
  },
  fundingCallMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  fundingCallMetaText: {
    fontSize: 12,
    color: Colors.text,
    fontWeight: '500' as const,
  },
  fundingCallDeadlineUrgent: {
    color: '#DC2626',
    fontWeight: '600' as const,
  },
  fundingCallCountries: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 12,
  },
  fundingCallCountriesText: {
    fontSize: 11,
    color: Colors.textMuted,
    flex: 1,
  },
  fundingCallSourceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  fundingCallSourceText: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  fundingCallDetailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 20,
    marginBottom: 16,
  },
  fundingCallTypeBadgeLarge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 10,
  },
  fundingCallTypeLargeText: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
  urgentBadgeLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DC2626',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 6,
  },
  urgentBadgeLargeText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: '#fff',
  },
  fundingCallDetailTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.text,
    lineHeight: 28,
    marginBottom: 12,
  },
  fundingCallDetailOrg: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  fundingCallDetailOrgText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  fundingCallDetailStats: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  fundingCallDetailStat: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  fundingCallDetailStatDivider: {
    width: 1,
    backgroundColor: Colors.border,
    marginHorizontal: 12,
  },
  fundingCallDetailStatValue: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  fundingCallDetailStatLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  fundingCallDetailSection: {
    marginBottom: 24,
  },
  fundingCallDetailSectionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 12,
  },
  fundingCallDetailDescription: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 23,
  },
  fundingCallDetailChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  fundingCallDetailChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  fundingCallDetailChipText: {
    fontSize: 13,
    color: Colors.text,
  },
  fundingCallDetailListItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 10,
  },
  fundingCallDetailListText: {
    flex: 1,
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  fundingCallDetailSourceBox: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  fundingCallDetailSourceLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  fundingCallDetailSourceValue: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  fundingCallDetailPostedDate: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 6,
  },
  externalLinkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.card,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
    marginBottom: 20,
  },
  externalLinkButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  convertToDAOButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.golden,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  convertToDAOButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#fff',
  },
  convertDAOInfoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.golden + '15',
    padding: 14,
    borderRadius: 12,
    marginTop: 20,
    gap: 12,
  },
  convertDAOInfoText: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  daoDescriptionInput: {
    height: 160,
    textAlignVertical: 'top',
  },
  daoLinkedCallCard: {
    backgroundColor: Colors.primary + '10',
    padding: 14,
    borderRadius: 12,
    marginTop: 20,
    borderWidth: 1,
    borderColor: Colors.primary + '30',
  },
  daoLinkedCallHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  daoLinkedCallLabel: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  daoLinkedCallTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 6,
  },
  daoLinkedCallMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  daoLinkedCallMetaText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  daoWorkflowSteps: {
    marginTop: 24,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  daoWorkflowTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 16,
  },
  daoWorkflowStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 14,
  },
  daoWorkflowStepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  daoWorkflowStepNumberText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: '#fff',
  },
  daoWorkflowStepText: {
    flex: 1,
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
  },
});
