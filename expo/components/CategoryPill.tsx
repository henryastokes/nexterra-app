import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Globe, Cloud, Heart, Leaf, Zap } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface CategoryPillProps {
  id: string;
  label: string;
  icon: string;
  isSelected: boolean;
  onPress: () => void;
}

const iconMap: Record<string, React.ComponentType<{ size: number; color: string }>> = {
  Globe,
  Cloud,
  Heart,
  Leaf,
  Zap,
};

export default function CategoryPill({ label, icon, isSelected, onPress }: CategoryPillProps) {
  const IconComponent = iconMap[icon] || Globe;

  return (
    <TouchableOpacity
      style={[styles.pill, isSelected && styles.pillSelected]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <IconComponent size={14} color={isSelected ? Colors.background : Colors.textSecondary} />
      <Text style={[styles.label, isSelected && styles.labelSelected]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.card,
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pillSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  label: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: Colors.textSecondary,
  },
  labelSelected: {
    color: Colors.background,
  },
});
