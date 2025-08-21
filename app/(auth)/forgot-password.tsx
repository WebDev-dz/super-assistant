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
import { useSignIn } from '@clerk/clerk-expo';

export default function TaskifyForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { isLoaded, signIn } = useSignIn();

  const handleSendOTP = async () => {
    if (!isLoaded || !email) return;
    try {
      setLoading(true);
      // Bind identifier to signIn resource
      await signIn.create({ identifier: email });

      // Extract the emailAddressId for the reset code factor
      const firstFactor: any = signIn.supportedFirstFactors?.find(
        (f: any) => f.strategy === 'reset_password_email_code'
      );
      const emailAddressId: string | undefined = firstFactor?.emailAddressId;

      await signIn.prepareFirstFactor({
        strategy: 'reset_password_email_code',
        // @ts-expect-error: Clerk types require emailAddressId; we obtain it from supportedFirstFactors
        emailAddressId,
      });

      router.push({ pathname: '/(auth)/enter-otp', params: { email } });
    } catch (err: any) {
      alert(err?.errors?.[0]?.message || 'Failed to send reset code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
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