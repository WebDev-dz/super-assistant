import React from 'react';
import { View, ScrollView } from 'react-native';
import { Text } from '~/components/ui/text';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { useColorScheme } from '@/lib/useColorScheme';

export default function AboutScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      <ScrollView className="flex-1 p-4">
        <Text className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          About Super Assistant
        </Text>
        
        <View className="gap-4">
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle className={isDark ? 'text-white' : 'text-gray-900'}>
                Version
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Text className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Super Assistant v1.0.0
              </Text>
            </CardContent>
          </Card>

          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle className={isDark ? 'text-white' : 'text-gray-900'}>
                About This App
              </CardTitle>
            </CardHeader>
            <CardContent className="gap-3">
              <Text className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Super Assistant is a comprehensive productivity app designed to help you organize 
                your life through goal setting, milestone tracking, and task management.
              </Text>
              <Text className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Built with React Native and Expo, this app provides a seamless experience across 
                platforms while keeping your data synchronized in real-time.
              </Text>
            </CardContent>
          </Card>

          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle className={isDark ? 'text-white' : 'text-gray-900'}>
                Key Features
              </CardTitle>
            </CardHeader>
            <CardContent className="gap-2">
              <Text className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                • Goal setting and progress tracking
              </Text>
              <Text className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                • Milestone management
              </Text>
              <Text className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                • Task organization with priorities
              </Text>
              <Text className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                • Real-time data synchronization
              </Text>
              <Text className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                • Dark/Light mode support
              </Text>
              <Text className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                • Cross-platform compatibility
              </Text>
            </CardContent>
          </Card>

          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle className={isDark ? 'text-white' : 'text-gray-900'}>
                Built With
              </CardTitle>
            </CardHeader>
            <CardContent className="gap-2">
              <Text className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                • React Native & Expo
              </Text>
              <Text className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                • TypeScript
              </Text>
              <Text className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                • NativeWind (Tailwind CSS)
              </Text>
              <Text className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                • InstantDB for real-time data
              </Text>
              <Text className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                • React Hook Form & Zod validation
              </Text>
            </CardContent>
          </Card>

          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle className={isDark ? 'text-white' : 'text-gray-900'}>
                Privacy & Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Text className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Your data is stored securely and synchronized in real-time across your devices. 
                We respect your privacy and don't share your personal information with third parties.
              </Text>
            </CardContent>
          </Card>

          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle className={isDark ? 'text-white' : 'text-gray-900'}>
                Acknowledgments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Text className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Special thanks to the open-source community and the developers of the libraries 
                and tools that made this app possible.
              </Text>
            </CardContent>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}
