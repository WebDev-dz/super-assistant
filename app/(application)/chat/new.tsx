// chat/new.tsx - New AI chat session
import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, ScrollView, Pressable, Dimensions, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
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
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHandlers } from '@/hooks/data-provider';
import { id } from '@instantdb/react-native';
import db from '@/db';

export default function NewChat() {
  const router = useRouter();
  const { action, topic } = useLocalSearchParams<{ action?: string; topic?: string }>();
  const { colorScheme } = useColorScheme();
  const [message, setMessage] = useState('');
  const { createChat } = useHandlers()
  const { isLoading, user, error } = db.useAuth();
  const promptSuggestions = [
    {
      category: 'Code Help',
      icon: Code,
      prompts: [
        'Help me debug this React Native component',
        'Explain how to use useEffect hook',
       
      ]
    },
    {
      category: 'Learning',
      icon: BookOpen,
      prompts: [
        'Explain the concept of closures in JavaScript',
        'What are the differences between SQL and NoSQL?',
        
      ]
    },
    {
      category: 'Creative',
      icon: Lightbulb,
      prompts: [
        'Help me brainstorm app features',
        'Generate creative project ideas',
       
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

  useEffect(() => {
    // Handle authentication states
    if (!isLoading && (error || !user)) {
      router.replace('/sign-in'); // Redirect to sign-in page if error or no user
    }
  }, [isLoading, error, user, router]);

  const startChat = (prompt?: string) => {
    const messageToSend = prompt || message;
    if (messageToSend.trim() && user) { // Ensure user exists before creating chat
      // Generate a new chat session ID
      const sessionId = `chat_${Date.now()}`;
      // Navigate to chat session with initial message
      createChat({
        id: id(),
        title: messageToSend,
        userId: user.id,
      })
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
              className='mb-2'
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

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-4 text-foreground">Loading...</Text>
      </SafeAreaView>
    );
  }

  if (error || !user) {
    // This should be handled by the useEffect redirect, but as a fallback
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <Text className="text-red-500 mb-4">Authentication error. Redirecting to sign in...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className='flex-1' style={{ height: Dimensions.get("screen").height }} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20} // Adjust offset as needed
      >
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
              <Send color={"white"} size={16} className="text-primary-foreground" />
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}