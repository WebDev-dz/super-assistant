import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { useSignIn, SignedIn } from '@clerk/clerk-expo';

export default function TaskifyEnterOTP() {
  const params = useLocalSearchParams<{ email?: string }>();
  const [otpCode, setOtpCode] = useState<string[]>(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(60);
  const { isLoaded, signIn } = useSignIn();

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleNumberPress = (number: string) => {
    const newOtp = [...otpCode];
    const nextEmptyIndex = newOtp.findIndex((digit) => digit === '');

    if (nextEmptyIndex !== -1) {
      newOtp[nextEmptyIndex] = number;
      setOtpCode(newOtp);
    }
  };

  const handleBackspace = () => {
    const newOtp = [...otpCode];
    const lastFilledIndex = newOtp
      .map((digit, index) => (digit !== '' ? index : -1))
      .filter((index) => index !== -1)
      .pop();

    if (lastFilledIndex !== undefined) {
      newOtp[lastFilledIndex] = '';
      setOtpCode(newOtp);
    }
  };

  const codeString = otpCode.join('');

  const onVerify = async () => {
    if (!isLoaded || codeString.length < 6) return;
    try {
      const attempt = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code: codeString,
      });

      if (attempt?.status === 'needs_new_password') {
        router.push({ pathname: '/(auth)/new-password', params: { code: codeString } });
        return;
      }

      // If Clerk returns complete (rare in this flow), route to root
      if (attempt?.status === 'complete') {
        router.replace('/');
      }
    } catch (err: any) {
      alert(err?.errors?.[0]?.message || 'Invalid verification code');
    }
  };

  const onResend = async () => {
    if (!isLoaded || resendTimer > 0) return;
    try {
      const factor: any = signIn.supportedFirstFactors?.find(
        (f: any) => f.strategy === 'reset_password_email_code'
      );
      const emailAddressId: string | undefined = factor?.emailAddressId;

      await signIn.prepareFirstFactor({
        strategy: 'reset_password_email_code',
        // @ts-expect-error: Clerk types require emailAddressId
        emailAddressId,
      });
      setResendTimer(60);
    } catch (err: any) {
      alert(err?.errors?.[0]?.message || 'Failed to resend code');
    }
  };

  const NumberButton = ({ number, onPress }: { number: string; onPress: (n: string) => void }) => (
    <TouchableOpacity className="w-20 h-20 items-center justify-center" onPress={() => onPress(number)}>
      <Text className="text-black text-2xl font-medium">{number}</Text>
    </TouchableOpacity>
  );

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
          {otpCode.map((digit, index) => (
            <View
              key={index}
              className={`w-16 h-16 rounded-xl border-2 items-center justify-center ${
                digit !== '' ? 'border-gray-300 bg-gray-100' : 'border-gray-200 bg-white'
              }`}
            >
              <Text className="text-black text-xl font-semibold">{digit}</Text>
            </View>
          ))}
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

        {/* Number Pad */}
        <View className="items-center pb-8">
          <View className="space-y-4">
            {/* Row 1 */}
            <View className="flex-row space-x-8">
              <NumberButton number="1" onPress={handleNumberPress} />
              <NumberButton number="2" onPress={handleNumberPress} />
              <NumberButton number="3" onPress={handleNumberPress} />
            </View>
            {/* Row 2 */}
            <View className="flex-row space-x-8">
              <NumberButton number="4" onPress={handleNumberPress} />
              <NumberButton number="5" onPress={handleNumberPress} />
              <NumberButton number="6" onPress={handleNumberPress} />
            </View>
            {/* Row 3 */}
            <View className="flex-row space-x-8">
              <NumberButton number="7" onPress={handleNumberPress} />
              <NumberButton number="8" onPress={handleNumberPress} />
              <NumberButton number="9" onPress={handleNumberPress} />
            </View>
            {/* Row 4 */}
            <View className="flex-row space-x-8">
              <TouchableOpacity className="w-20 h-20 items-center justify-center">
                <Text className="text-black text-2xl font-medium">*</Text>
              </TouchableOpacity>
              <NumberButton number="0" onPress={handleNumberPress} />
              <TouchableOpacity className="w-20 h-20 items-center justify-center" onPress={handleBackspace}>
                <Ionicons name="backspace-outline" size={24} color="#000000" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Verify Button */}
        <View className="px-6 mb-8">
          <TouchableOpacity
            className={`rounded-xl py-4 items-center justify-center ${codeString.length < 6 ? 'bg-gray-300' : 'bg-orange-500'}`}
            onPress={onVerify}
            disabled={codeString.length < 6}
          >
            <Text className="text-white text-base font-semibold">Verify</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}