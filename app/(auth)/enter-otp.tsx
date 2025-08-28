import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import useCustomAuth from '@/hooks/auth-provider';
import OtpInput from '@/components/ui/otp-input';
import OTPTextView from '@/components/ui/otp-input';
import Clipboard from 'expo-clipboard';

export default function TaskifyEnterOTP() {
  const params = useLocalSearchParams<{ email?: string }>();
  const [resendTimer, setResendTimer] = useState(60);
  const { onForgotPassword, onVerifyOTP } = useCustomAuth();
  const [otpInput, setOtpInput] = useState<string>('');

  const input = useRef<OTPTextView>(null);

  const clear = () => input.current?.clear();

  const updateOtpText = () => input.current?.setValue(otpInput);

  const showTextAlert = () => otpInput && Alert.alert(otpInput);

  const handleCellTextChange = async (text: string, i: number) => {
    if (i === 0) {
      const clippedText = await Clipboard.getStringAsync();
      if (clippedText.slice(0, 1) === text) {
        input.current?.setValue(clippedText, true);
      }
    }
  };

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);






  const onVerify = async () => {
    if (otpInput.length < 6) {
      alert('Please enter a complete 6-digit code');
      return;
    }
    try {
      await onVerifyOTP(otpInput);
    } catch (err) {
      console.error(err);
    }
  };

  const onResend = async () => {
    if (resendTimer > 0) return;
    try {
      if (!params.email) {
        alert('Email address is missing');
        return;
      }
      await onForgotPassword(params.email);
      setResendTimer(60);
    } catch (err) {
      console.error(err);
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
            <Text className="text-black text-3xl font-bold">Enter OTP Code </Text>
            <Text className="text-yellow-500 text-3xl ml-2">🔐</Text>
          </View>
          <Text className="text-gray-600 text-base mt-4 leading-6">
            We've sent an OTP code to your email. Please{'\n'}
            enter the code below to continue.
          </Text>
        </View>

        {/* OTP Input Fields */}
        <View className="flex-row justify-center space-x-4 mb-8">
          <OtpInput
            ref={input}
            // containerStyle={styles.textInputContainer}
            handleTextChange={setOtpInput}
            handleCellTextChange={handleCellTextChange}
            inputCount={6}
            keyboardType="numeric"
          />
        </View>

        {/* Resend Timer */}
        <View className="items-center mb-2">
          <Text className="text-gray-600 text-base">
            You can resend the code in{' '}
            <Text className="text-orange-500 font-medium">{resendTimer}</Text> seconds
          </Text>
        </View>

        {/* Resend Button */}
        <View className="items-center mb-12">
          <TouchableOpacity disabled={resendTimer > 0} onPress={onResend}>
            <Text className={`text-base ${resendTimer > 0 ? 'text-gray-400' : 'text-orange-500'}`}>Resend code</Text>
          </TouchableOpacity>
        </View>

        {/* Spacer */}
        <View className="flex-1" />



        {/* Verify Button */}
        <View className="px-6 mb-8">
          <TouchableOpacity
            className={`rounded-xl py-4 items-center justify-center ${otpInput.length < 6 ? 'bg-gray-300' : 'bg-orange-500'}`}
            onPress={onVerify}
            disabled={otpInput.length < 6}
          >
            <Text className="text-white text-base font-semibold">Verify</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}