// chat/new.tsx - New AI chat session
import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useColorScheme } from '@/lib/useColorScheme';
import { Text } from '~/components/ui/text';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { Card } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { Avatar, AvatarFallback } from '~/components/ui/avatar';
import { 
  Bot, 
  Send, 
  Code, 
  BookOpen, 
  Lightbulb, 
  MessageCircle,
  Sparkles
} from 'lucide-react-native';

export default function NewChat() {
  const router = useRouter();
  const { action, topic } = useLocalSearchParams<{ action?: string; topic?: string }>();
  const { colorScheme } = useColorScheme();
  const [message, setMessage] = useState('');

  const promptSuggestions = [
    {
      category: 'Code Help',
      icon: Code,
      prompts: [
        'Help me debug this React Native component',
        'Explain how to use useEffect hook',
        'Best practices for TypeScript in React Native',
        'How to handle navigation between screens',
      ]
    },
    {
      category: 'Learning',
      icon: BookOpen,
      prompts: [
        'Explain the concept of closures in JavaScript',
        'What are the differences between SQL and NoSQL?',
        'How does machine learning work?',
        'Teach me about design patterns',
      ]
    },
    {
      category: 'Creative',
      icon: Lightbulb,
      prompts: [
        'Help me brainstorm app features',
        'Generate creative project ideas',
        'Write a compelling app description',
        'Suggest unique UI/UX concepts',
      ]
    },
  ];

  useEffect(() => {
    // Pre-fill message based on quick action or topic
    if (action === 'help-code') {
      setMessage('I need help with coding. Can you assist me with ');
    } else if (action === 'explain') {
      setMessage('Can you explain ');
    } else if (action === 'brainstorm') {
      setMessage('I want to brainstorm ideas about ');
    } else if (topic) {
      setMessage(`I want to learn about ${topic}. `);
    }
  }, [action, topic]);

  const startChat = (prompt?: string) => {
    const messageToSend = prompt || message;
    if (messageToSend.trim()) {
      // Generate a new chat session ID
      const sessionId = `chat_${Date.now()}`;
      // Navigate to chat session with initial message
      router.push(`/chat/${sessionId}?initialMessage=${encodeURIComponent(messageToSend)}`);
    }
  };

  const renderPromptCategory = (category: any) => {
    const IconComponent = category.icon;
    
    return (
      <View key={category.category} className="mb-6">
        <View className="flex-row items-center mb-3">
          <IconComponent size={18} className="text-primary mr-2" />
          <Text className="font-semibold text-foreground">
            {category.category}
          </Text>
        </View>
        
        <View className="space-y-2">
          {category.prompts.map((prompt: string, index: number) => (
            <TouchableOpacity
              key={index}
              onPress={() => startChat(prompt)}
            >
              <Card className="p-3 bg-card border border-border hover:border-primary/30">
                <Text className="text-sm text-foreground">
                  {prompt}
                </Text>
              </Card>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="p-6 items-center border-b border-border bg-card">
        <Avatar alt="AI Assistant" className="w-16 h-16 mb-4">
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600">
            <Bot size={24} className="text-white" />
          </AvatarFallback>
        </Avatar>
        
        <Text className="text-xl font-bold text-foreground mb-2">
          Start New Chat
        </Text>
        
        <Text className="text-muted-foreground text-center">
          What would you like to talk about today?
        </Text>
      </View>

      {/* Message Input */}
      <View className="p-4 border-b border-border bg-card">
        <View className="flex-row items-end space-x-3">
          <View className="flex-1">
            <Input
              value={message}
              onChangeText={setMessage}
              placeholder="Type your message here..."
              multiline
              className="min-h-[44px] max-h-[120px]"
            />
          </View>
          
          <Button 
            onPress={() => startChat()}
            disabled={!message.trim()}
            size="sm"
            className="p-3"
          >
            <Send size={16} className="text-primary-foreground" />
          </Button>
        </View>
      </View>

            {/* Prompt Suggestions */}
      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
        <Text className="text-lg font-semibold text-foreground mb-4">
          Or try these suggestions:
        </Text>

        {promptSuggestions.map((category, index) => (
          <View key={index}>{renderPromptCategory(category)}</View>
        ))}
      </ScrollView>
    </View>
  );
}
