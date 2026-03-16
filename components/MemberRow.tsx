import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Colors from '@/constants/colors';
import { DAOMember } from '@/mocks/research';

interface MemberRowProps {
  member: DAOMember;
  showRank?: boolean;
}

export default function MemberRow({ member, showRank = true }: MemberRowProps) {
  const getRankStyle = (rank: number) => {
    if (rank === 1) return styles.rankGold;
    if (rank === 2) return styles.rankSilver;
    if (rank === 3) return styles.rankBronze;
    return styles.rankDefault;
  };

  return (
    <View style={styles.container}>
      {showRank && (
        <View style={[styles.rankBadge, getRankStyle(member.rank)]}>
          <Text style={styles.rankText}>{member.rank.toString().padStart(2, '0')}</Text>
        </View>
      )}
      <Image source={{ uri: member.avatar }} style={styles.avatar} />
      <View style={styles.info}>
        <Text style={styles.name}>{member.name}</Text>
        <Text style={styles.contributions}>${member.contributions.toLocaleString()} contributed</Text>
      </View>
      <View style={styles.votingPower}>
        <Text style={styles.powerValue}>{member.votingPower.toLocaleString()}</Text>
        <Text style={styles.powerLabel}>VP</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    padding: 14,
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  rankBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rankGold: {
    backgroundColor: '#D4A853',
  },
  rankSilver: {
    backgroundColor: '#A8B5AD',
  },
  rankBronze: {
    backgroundColor: '#A67C52',
  },
  rankDefault: {
    backgroundColor: Colors.backgroundSecondary,
  },
  rankText: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: Colors.background,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 2,
  },
  contributions: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  votingPower: {
    alignItems: 'flex-end',
  },
  powerValue: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  powerLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: '500' as const,
  },
});
