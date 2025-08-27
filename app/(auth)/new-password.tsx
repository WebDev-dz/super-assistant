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
import { router, useLocalSearchParams } from 'expo-router';
import useCustomAuth from '@/hooks/auth-provider';

export default function TaskifySecureAccount() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { onVerifyOTP } = useCustomAuth();
  const params = useLocalSearchParams<{ code?: string }>();

  const handleSavePassword = async () => {
    if (!newPassword || newPassword !== confirmPassword) {
      alert('Passwords must match.');
      return;
    }

    try {
      setSubmitting(true);
      await onVerifyOTP(String(params.code || ''), newPassword);
      router.replace('/');
    } catch (err: any) {
      alert(err?.errors?.[0]?.message || 'Failed to reset password');
    } finally {
      setSubmitting(false);
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
            <Text className="text-black text-3xl font-bold">Secure Your Account </Text>
            <Text className="text-yellow-500 text-3xl ml-2">🔒</Text>
          </View>
          <Text className="text-gray-600 text-base mt-4 leading-6">
            Choose a new password for your Taskify{`\n`}account. Make sure it's secure and memorable.
          </Text>
        </View>

        {/* New Password Input */}
        <View className="mb-6">
          <Text className="text-black text-base font-medium mb-3">New Password</Text>
          <View className="bg-gray-100 rounded-lg px-4 py-4 flex-row items-center">
            <Ionicons name="lock-closed-outline" size={20} color="#6B7280" />
            <TextInput
              className="flex-1 text-black text-base ml-3"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showNewPassword}
              placeholder="••••••••••••"
              placeholderTextColor="#000000"
            />
            <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
              <Ionicons name={showNewPassword ? 'eye-outline' : 'eye-off-outline'} size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Confirm New Password Input */}
        <View className="mb-8">
          <Text className="text-black text-base font-medium mb-3">Confirm New Password</Text>
          <View className="bg-gray-100 rounded-lg px-4 py-4 flex-row items-center">
            <Ionicons name="lock-closed-outline" size={20} color="#6B7280" />
            <TextInput
              className="flex-1 text-black text-base ml-3"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              placeholder="••••••••••••"
              placeholderTextColor="#000000"
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Ionicons name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'} size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Spacer to push button to bottom */}
        <View className="flex-1" />

        {/* Save New Password Button */}
        <TouchableOpacity
          className={`rounded-xl py-4 items-center justify-center mb-8 ${
            newPassword && newPassword === confirmPassword ? 'bg-orange-500' : 'bg-gray-300'
          }`}
          onPress={handleSavePassword}
          disabled={!newPassword || newPassword !== confirmPassword || submitting}
        >
          <Text className="text-white text-base font-semibold">{submitting ? 'Saving...' : 'Save New Password'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}