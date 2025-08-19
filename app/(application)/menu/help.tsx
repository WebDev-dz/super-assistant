import React from 'react';
import { View, ScrollView } from 'react-native';
import { Text } from '~/components/ui/text';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { useColorScheme } from '@/lib/useColorScheme';

export default function HelpScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const helpSections = [
    {
      title: 'Getting Started',
      content: [
        'Welcome to Super Assistant! This app helps you manage your goals, milestones, and tasks in one place.',
        'Start by creating a goal from the home screen, then break it down into milestones and tasks.',
      ],
    },
    {
      title: 'Goals',
      content: [
        'Goals are your main objectives. You can set priorities, deadlines, and track progress.',
        'Each goal can have multiple milestones to help break down the work.',
        'Use the goals section to view, edit, and manage all your goals.',
      ],
    },
    {
      title: 'Milestones',
      content: [
        'Milestones are key checkpoints within your goals.',
        'They help you track progress and stay motivated by celebrating smaller wins.',
        'Each milestone can contain multiple tasks.',
      ],
    },
    {
      title: 'Tasks (Todos)',
      content: [
        'Tasks are the individual action items you need to complete.',
        'You can set priorities, assign them to milestones, and set due dates.',
        'Use the search and filter features to find specific tasks quickly.',
      ],
    },
    {
      title: 'Tips & Tricks',
      content: [
        'Use the overview dashboard to get a quick summary of all your work.',
        'Set realistic deadlines and priorities to stay organized.',
        'Regularly review and update your goals to keep them relevant.',
        'Break large goals into smaller, manageable milestones and tasks.',
      ],
    },
  ];

  return (
    <View className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      <ScrollView className="flex-1 p-4">
        <Text className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Help & Guide
        </Text>
        
        <View className="gap-4">
          {helpSections.map((section, index) => (
            <Card key={index} className="rounded-xl">
              <CardHeader>
                <CardTitle className={isDark ? 'text-white' : 'text-gray-900'}>
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="gap-3">
                {section.content.map((paragraph, pIndex) => (
                  <Text 
                    key={pIndex} 
                    className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
                  >
                    {paragraph}
                  </Text>
                ))}
              </CardContent>
            </Card>
          ))}
        </View>

        <Card className="rounded-xl mt-6">
          <CardHeader>
            <CardTitle className={isDark ? 'text-white' : 'text-gray-900'}>
              Need More Help?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Text className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              If you need additional assistance or have feedback, you can reach out through the app's 
              settings or visit our support documentation.
            </Text>
          </CardContent>
        </Card>
      </ScrollView>
    </View>
  );
}
