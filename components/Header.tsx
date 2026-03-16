import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Lightbulb, User } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Colors from '@/constants/colors';

interface HeaderProps {
  showIcons?: boolean;
}

export default function Header({ showIcons = true }: HeaderProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <View style={styles.content}>
        {showIcons ? (
          <TouchableOpacity 
            style={styles.iconButton} 
            testID="insights-button"
            onPress={() => router.push('/insights')}
          >
            <Lightbulb size={22} color={Colors.text} />
          </TouchableOpacity>
        ) : (
          <View style={styles.iconPlaceholder} />
        )}
        <View style={styles.titleContainer}>
          <Image 
            source={{ uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/3xl9gdhjief4cc4o07z88' }}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.subtitle}>Rebuilding science funding one DAO at a time</Text>
        </View>
        {showIcons ? (
          <TouchableOpacity 
            style={styles.iconButton} 
            testID="profile-button"
            onPress={() => router.push('/profile')}
          >
            <User size={22} color={Colors.text} />
          </TouchableOpacity>
        ) : (
          <View style={styles.iconPlaceholder} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconPlaceholder: {
    width: 36,
  },
  titleContainer: {
    alignItems: 'center',
    flex: 1,
  },
  logo: {
    width: 240,
    height: 80,
  },
  subtitle: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
    letterSpacing: 0.3,
    textAlign: 'center',
  },

  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
