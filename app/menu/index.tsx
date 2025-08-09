// app/menu/index.tsx
import React from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '~/components/ui/text';
import { useColorScheme } from '@/lib/useColorScheme';
import db from '@/db';

interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress: () => void;
  showArrow?: boolean;
  color?: string;
}

const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  showArrow = true,
  color,
}) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row items-center py-4 px-4 border-b ${
        isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
      }`}
    >
      <View className={`w-10 h-10 rounded-full items-center justify-center mr-4 ${
        color ? '' : isDark ? 'bg-gray-700' : 'bg-gray-100'
      }`} style={{ backgroundColor: color }}>
        <Ionicons 
          name={icon} 
          size={20} 
          color={color ? 'white' : isDark ? '#FFFFFF' : '#374151'} 
        />
      </View>
      
      <View className="flex-1">
        <Text className={`font-semibold text-base ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          {title}
        </Text>
        {subtitle && (
          <Text className={`text-sm mt-1 ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {subtitle}
          </Text>
        )}
      </View>
      
      {showArrow && (
        <Ionicons 
          name="chevron-forward" 
          size={20} 
          color={isDark ? '#9CA3AF' : '#6B7280'} 
        />
      )}
    </TouchableOpacity>
  );
};

export default function MenuScreen() {
  const { isSignedIn, signOut } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleSignOut = async () => {
    try {
      await signOut();
      db.auth.signOut()
      router.push('/(auth)/sign-in');
    } catch (error) {
      Alert.alert('Error', 'Failed to sign out. Please try again.');
    }
  };

  const menuSections = [
    {
      title: 'Account',
      items: isSignedIn
        ? [
            {
              icon: 'person-outline' as const,
              title: 'Profile',
              subtitle: user?.emailAddresses[0]?.emailAddress || 'Manage your profile',
              onPress: () => router.push('(menu)/profile'),
            },
            // {
            //   icon: 'settings-outline' as const,
            //   title: 'Settings',
            //   subtitle: 'App preferences and configuration',
            //   onPress: () => router.push('/(menu)/settings'),
            // },
          ]
        : [
            {
              icon: 'log-in-outline' as const,
              title: 'Sign In',
              subtitle: 'Access your account',
              onPress: () => router.push('/(auth)/sign-in'),
              color: '#007AFF',
            },
            {
              icon: 'person-add-outline' as const,
              title: 'Sign Up',
              subtitle: 'Create a new account',
              onPress: () => router.push('/(auth)/sign-up'),
              color: '#34C759',
            },
          ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: 'help-circle-outline' as const,
          title: 'Help & Support',
          subtitle: 'Get help and contact support',
          onPress: () => router.push('/menu/help'),
        },
        {
          icon: 'information-circle-outline' as const,
          title: 'About',
          subtitle: 'App version and information',
          onPress: () => router.push('/menu/about'),
        },
      ],
    },
  ];

  if (isSignedIn) {
    menuSections[0].items.push({
      icon: 'log-out-outline' as const,
      title: 'Sign Out',
      subtitle: 'Sign out of your account',
      onPress: handleSignOut,
      showArrow: false,
      color: '#FF3B30',
    });
  }

  return (
    <ScrollView
      className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      {/* Header */}
      <View className={`px-6 py-8 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <View className="flex-row items-center">
          <View className="w-16 h-16 bg-blue-500 rounded-full items-center justify-center mr-4">
            <Ionicons name="checkmark-done" size={28} color="white" />
          </View>
          <View className="flex-1">
            <Text className={`text-2xl font-bold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Super Assistant
            </Text>
            <Text className={`text-base mt-1 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {isSignedIn ? `Welcome back, ${user?.firstName || 'User'}!` : 'AI-powered goals & todos'}
            </Text>
          </View>
        </View>
      </View>

      {/* Menu Sections */}
      {menuSections.map((section, sectionIndex) => (
        <View key={sectionIndex} className="mt-6">
          <Text className={`px-6 py-2 text-sm font-medium uppercase tracking-wide ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {section.title}
          </Text>
          <View className={`mx-4 rounded-xl overflow-hidden ${
            isDark ? 'bg-gray-800' : 'bg-white'
          }`}>
            {section.items.map((item, itemIndex) => (
              <MenuItem
                key={itemIndex}
                icon={item.icon}
                title={item.title}
                subtitle={item.subtitle}
                onPress={item.onPress}
                // showArrow={item.showArrow}
                color={item.color}
              />
            ))}
          </View>
        </View>
      ))}

      {/* App Info */}
      <View className="px-6 py-8 items-center">
        <Text className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          Super Assistant v1.0.0
        </Text>
        <Text className={`text-xs mt-1 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
          Made with ❤️ for productivity
        </Text>
      </View>
    </ScrollView>
  );
}