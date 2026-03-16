import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MapPin, Clock, ArrowUpRight } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { ResearchProject } from '@/mocks/research';

interface ProjectCardProps {
  project: ResearchProject;
  variant?: 'default' | 'compact';
  onPress?: () => void;
}

export default function ProjectCard({ project, variant = 'default', onPress }: ProjectCardProps) {
  const fundingProgress = (project.fundingRaised / project.fundingGoal) * 100;

  if (variant === 'compact') {
    return (
      <TouchableOpacity style={styles.compactCard} onPress={onPress} activeOpacity={0.8}>
        <Image source={{ uri: project.imageUrl }} style={styles.compactImage} />
        <View style={styles.compactOverlay} />
        <View style={styles.compactContent}>
          <Text style={styles.compactTitle} numberOfLines={2}>{project.title}</Text>
          <View style={styles.compactMeta}>
            <MapPin size={12} color={Colors.primary} />
            <Text style={styles.compactLocation}>{project.location}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.arrowButton}>
          <ArrowUpRight size={16} color={Colors.background} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <Image source={{ uri: project.imageUrl }} style={styles.image} />
      <View style={styles.imageOverlay} />
      <View style={styles.categoryBadge}>
        <Text style={styles.categoryText}>{project.category}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>{project.title}</Text>
        <Text style={styles.institution}>{project.institution}</Text>
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <MapPin size={14} color={Colors.textSecondary} />
            <Text style={styles.metaText}>{project.location}</Text>
          </View>
          <View style={styles.metaItem}>
            <Clock size={14} color={Colors.textSecondary} />
            <Text style={styles.metaText}>{project.daysLeft} days left</Text>
          </View>
        </View>
        <View style={styles.progressSection}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${Math.min(fundingProgress, 100)}%` }]} />
          </View>
          <View style={styles.progressMeta}>
            <Text style={styles.fundingAmount}>
              ${project.fundingRaised.toLocaleString()}
              <Text style={styles.fundingGoal}> / ${project.fundingGoal.toLocaleString()}</Text>
            </Text>
            <Text style={styles.progressPercent}>{Math.round(fundingProgress)}%</Text>
          </View>
        </View>
        <View style={styles.researcherRow}>
          <Image source={{ uri: project.researcher.avatar }} style={styles.avatar} />
          <Text style={styles.researcherName}>{project.researcher.name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  image: {
    width: '100%',
    height: 180,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    height: 180,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  categoryBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: Colors.background,
    textTransform: 'capitalize',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 4,
    lineHeight: 24,
  },
  institution: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
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
  progressSection: {
    marginBottom: 14,
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  progressMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  fundingAmount: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  fundingGoal: {
    fontWeight: '400' as const,
    color: Colors.textMuted,
  },
  progressPercent: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  researcherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  researcherName: {
    fontSize: 13,
    color: Colors.text,
    fontWeight: '500' as const,
  },
  compactCard: {
    width: 200,
    height: 240,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 12,
    backgroundColor: Colors.card,
  },
  compactImage: {
    width: '100%',
    height: '100%',
  },
  compactOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  compactContent: {
    position: 'absolute',
    bottom: 16,
    left: 14,
    right: 14,
  },
  compactTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 6,
    lineHeight: 20,
  },
  compactMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  compactLocation: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  arrowButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
