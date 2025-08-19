import React from 'react';
import { View, ScrollView, Linking, Alert } from 'react-native';
import { Text } from '~/components/ui/text';
import { Button, buttonTextVariants } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { useColorScheme } from '@/lib/useColorScheme';
import { Ionicons } from '@expo/vector-icons';

export default function DonateScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const donationOptions = [
    {
      amount: '$5',
      description: 'Buy me a coffee',
      icon: 'cafe-outline' as keyof typeof Ionicons.glyphMap,
      color: '#8B4513',
    },
    {
      amount: '$15',
      description: 'Support development',
      icon: 'code-outline' as keyof typeof Ionicons.glyphMap,
      color: '#4A90E2',
    },
    {
      amount: '$30',
      description: 'Sponsor a feature',
      icon: 'star-outline' as keyof typeof Ionicons.glyphMap,
      color: '#F5A623',
    },
    {
      amount: 'Custom',
      description: 'Choose your amount',
      icon: 'heart-outline' as keyof typeof Ionicons.glyphMap,
      color: '#FF6B6B',
    },
  ];

  const handleDonate = async (amount: string) => {
    // This is a placeholder - in a real app, you'd integrate with a payment processor
    Alert.alert(
      'Thank You!',
      `Thank you for considering a ${amount} donation! This feature would typically integrate with payment processors like Stripe, PayPal, or similar services.`,
      [
        {
          text: 'Learn More',
          onPress: () => Linking.openURL('https://stripe.com/docs/payments'),
        },
        { text: 'OK', style: 'default' },
      ]
    );
  };

  const handleContactSupport = () => {
    Alert.alert(
      'Contact Developer',
      'Would you like to get in touch with the developer?',
      [
        {
          text: 'Email',
          onPress: () => Linking.openURL('mailto:developer@superassistant.app'),
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  return (
    <View className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      <ScrollView className="flex-1 p-4">
        <View className="items-center mb-6">
          <View className="w-20 h-20 bg-red-500 rounded-full items-center justify-center mb-4">
            <Ionicons name="heart" size={40} color="white" />
          </View>
          <Text className={`text-2xl font-bold text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Support Super Assistant
          </Text>
          <Text className={`text-base text-center mt-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Help keep this app free and improving
          </Text>
        </View>

        <Card className="rounded-xl mb-6">
          <CardHeader>
            <CardTitle className={isDark ? 'text-white' : 'text-gray-900'}>
              Why Donate?
            </CardTitle>
          </CardHeader>
          <CardContent className="gap-3">
            <Text className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Super Assistant is developed and maintained by independent developers who are passionate 
              about creating tools that help people be more productive and organized.
            </Text>
            <Text className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Your donations help us:
            </Text>
            <View className="ml-4 gap-2">
              <Text className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                • Keep the app free for everyone
              </Text>
              <Text className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                • Add new features and improvements
              </Text>
              <Text className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                • Maintain server infrastructure
              </Text>
              <Text className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                • Provide ongoing support
              </Text>
            </View>
          </CardContent>
        </Card>

        <Card className="rounded-xl mb-6">
          <CardHeader>
            <CardTitle className={isDark ? 'text-white' : 'text-gray-900'}>
              Choose Your Support Level
            </CardTitle>
          </CardHeader>
          <CardContent className="gap-3">
            {donationOptions.map((option, index) => (
              <View key={index} className="flex-row items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                <View 
                  className="w-12 h-12 rounded-full items-center justify-center mr-4"
                  style={{ backgroundColor: option.color }}
                >
                  <Ionicons name={option.icon} size={24} color="white" />
                </View>
                <View className="flex-1">
                  <Text className={`font-semibold text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {option.amount}
                  </Text>
                  <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {option.description}
                  </Text>
                </View>
                <Button 
                  variant="outline" 
                  size="sm"
                  onPress={() => handleDonate(option.amount)}
                >
                  <Text className={buttonTextVariants({ variant: 'outline', size: 'sm' })}>
                    Donate
                  </Text>
                </Button>
              </View>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-xl mb-6">
          <CardHeader>
            <CardTitle className={isDark ? 'text-white' : 'text-gray-900'}>
              Other Ways to Support
            </CardTitle>
          </CardHeader>
          <CardContent className="gap-4">
            <View className="gap-2">
              <Text className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Share the App
              </Text>
              <Text className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Tell your friends and colleagues about Super Assistant
              </Text>
            </View>
            
            <View className="gap-2">
              <Text className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Leave a Review
              </Text>
              <Text className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Rate and review the app in the App Store or Google Play
              </Text>
            </View>

            <View className="gap-2">
              <Text className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Provide Feedback
              </Text>
              <Text className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Share your ideas for new features and improvements
              </Text>
            </View>
          </CardContent>
        </Card>

        <Card className="rounded-xl mb-6">
          <CardHeader>
            <CardTitle className={isDark ? 'text-white' : 'text-gray-900'}>
              Questions?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Text className={`text-sm leading-relaxed mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Have questions about donations or want to discuss sponsorship opportunities? 
              We'd love to hear from you!
            </Text>
            <Button onPress={handleContactSupport}>
              <Text className={buttonTextVariants({})}>
                Contact Developer
              </Text>
            </Button>
          </CardContent>
        </Card>

        <View className="items-center py-6">
          <Text className={`text-sm text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Every contribution, no matter how small,{'\n'}
            makes a difference. Thank you! ❤️
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
