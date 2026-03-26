import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Lightbulb, User, Globe } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Colors from '@/constants/colors';
import { WEBSITE_URL } from '@/constants/website';
import * as WebBrowser from 'expo-web-browser';

interface HeaderProps {
  showIcons?: boolean;
}

export default function Header({ showIcons = true }: HeaderProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const openWebsite = async () => {
    try {
      await WebBrowser.openBrowserAsync(WEBSITE_URL, {
        toolbarColor: Colors.background,
        controlsColor: Colors.primary,
      });
    } catch (error) {
      console.log('Error opening website:', error);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <View style={styles.content}>
        {showIcons ? (
          <View style={styles.leftIcons}>
            <TouchableOpacity 
              style={styles.iconButton} 
              testID="insights-button"
              onPress={() => router.push('/insights')}
            >
              <Lightbulb size={22} color={Colors.text} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.globeButton} 
              testID="website-button"
              onPress={openWebsite}
            >
              <Globe size={20} color={Colors.primary} />
            </TouchableOpacity>
          </View>
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
    width: 72,
  },
  leftIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  globeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: `${Colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: `${Colors.primary}30`,
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
