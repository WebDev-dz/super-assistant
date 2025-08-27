import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import useCustomAuth from '@/hooks/auth-provider';

export default function TaskifyForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { onForgotPassword } = useCustomAuth();

  const handleSendOTP = async () => {
    if (!email) {
      alert('Please enter your email address');
      return;
    }
    
    try {
      setLoading(true);
      await onForgotPassword(email);
      // Navigation is handled inside onForgotPassword
    } catch (err: any) {
      console.log({err})
      alert(err?.errors?.[0]?.message || 'Failed to send reset code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View className="flex-row items-center px-6 py-4">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View className="flex-1 px-6">
        {/* Title */}
        <View className="mt-8 mb-8">
          <View className="flex-row items-center">
            <Text className="text-black text-3xl font-bold">
              Forgot Your Password? 
            </Text>
            <Text className="text-yellow-500 text-3xl ml-2">🔑</Text>
          </View>
          <Text className="text-gray-600 text-base mt-4 leading-6">
            No worries! Enter your registered email below.{'\n'}
            We'll send you a one-time password (OTP) to{'\n'}
            reset your password.
          </Text>
        </View>

        {/* Email Input */}
        <View className="mb-8">
          <Text className="text-black text-base font-medium mb-3">
            Your Registered Email
          </Text>
          <View className="bg-gray-100 rounded-lg px-4 py-4 flex-row items-center">
            <Ionicons name="mail-outline" size={20} color="#6B7280" />
            <TextInput
              className="flex-1 text-black text-base ml-3"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>
        </View>

        {/* Spacer to push button to bottom */}
        <View className="flex-1" />

        {/* Send OTP Button */}
        <TouchableOpacity 
          className={`rounded-xl py-4 items-center justify-center mb-8 ${email ? 'bg-orange-500' : 'bg-gray-300'}`}
          onPress={handleSendOTP}
          disabled={!email || loading}
        >
          <Text className="text-white text-base font-semibold">
            {loading ? 'Sending...' : 'Send OTP Code'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}