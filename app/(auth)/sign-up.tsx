// app/(auth)/sign-up.tsx
import React from 'react';
import {
  View,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
} from 'react-native';
import { useSignUp, useOAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as z from 'zod';
import { Button } from '~/components/ui/button';
import {
  Form,
  FormField,
  FormInput,
} from '~/components/ui/form';
import { Text } from '~/components/ui/text';
import { useColorScheme } from '@/lib/useColorScheme';
import db from '@/db';
import { Input } from '@/components/ui/input';

// Form validation schema
const signUpFormSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: 'First name is required.' })
    .min(2, { message: 'First name must be at least 2 characters.' }),
  lastName: z
    .string()
    .min(1, { message: 'Last name is required.' })
    .min(2, { message: 'Last name must be at least 2 characters.' }),
  emailAddress: z
    .email({ message: 'Please enter a valid email address.' }),
  password: z
    .string()
    .min(1, { message: 'Password is required.' })
    .min(8, { message: 'Password must be at least 8 characters.' })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
      message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number.',
    }),
  confirmPassword: z
    .string()
    .min(1, { message: 'Please confirm your password.' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const SignUpScreen = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const { startOAuthFlow: googleAuth } = useOAuth({ strategy: 'oauth_google' });
  const { startOAuthFlow: appleAuth } = useOAuth({ strategy: 'oauth_apple' });
  const [showPassword, setShowPassword] = React.useState(false);
  const [agreeToTerms, setAgreeToTerms] = React.useState(false);

  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [verificationCode, setVerificationCode] = React.useState('');

  const form = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      emailAddress: '',
      password: '',
    },
  });

  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };

  async function onSubmit(values: z.infer<typeof signUpFormSchema>) {
    console.log({ values })
    if (!isLoaded) return;

    try {
      // console.log({values})
      console.log({ values })
      await signUp.create({
        // firstName: values.firstName,
        // lastName: values.lastName,
        emailAddress: values.emailAddress,
        password: values.password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
    } catch (err: any) {
      Alert.alert('Sign Up Error', JSON.stringify(err) || 'An error occurred during sign up.');
    }
  }

  const onVerifyPress = async () => {
    if (!isLoaded) return;

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      if (completeSignUp.status === 'complete') {

        await setActive({ session: completeSignUp.createdSessionId });

        router.push('/');
      } else {
        console.log(JSON.stringify(completeSignUp, null, 2));
      }
    } catch (err: any) {
      Alert.alert('Verification Error', err.errors?.[0]?.message || 'Invalid verification code.');
    }
  };

  const onGoogleSignUp = async () => {
    try {
      const { createdSessionId, setActive } = await googleAuth();

      if (createdSessionId && setActive) {
        setActive({ session: createdSessionId });
        router.push('/');
      }
    } catch (err) {
      Alert.alert('Error', 'Google sign-up failed');
    }
  };

  const onAppleSignUp = async () => {
    try {
      const { createdSessionId, setActive } = await appleAuth();

      if (createdSessionId && setActive) {
        setActive({ session: createdSessionId });
        router.push('/');
      }
    } catch (err) {
      Alert.alert('Error', 'Apple sign-up failed');
    }
  };

  // Verification Form
  if (pendingVerification) {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-white'}`}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingTop: contentInsets.top + 20,
            paddingBottom: contentInsets.bottom + 20,
            paddingLeft: contentInsets.left,
            paddingRight: contentInsets.right,
          }}
          showsVerticalScrollIndicator={false}
          className="flex-1"
        >
          <View className="flex-1 px-6">
            {/* Header */}
            <View className="items-center mb-12">
              <View className="w-20 h-20 bg-green-500 rounded-full items-center justify-center mb-4">
                <Ionicons name="mail-outline" size={32} color="white" />
              </View>
              <Text className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Check Your Email
              </Text>
              <Text className={`text-center text-base ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                We've sent a verification code to your email address. Enter the code below to complete your registration.
              </Text>
            </View>

            {/* Verification Input */}
            <View className="space-y-6 mb-8">
              <View>
                <Text className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Verification Code
                </Text>
                <View className="relative">
                  <Input
                    placeholder="Enter verification code"
                    value={verificationCode}
                    onChangeText={setVerificationCode}
                    keyboardType="number-pad"
                    autoComplete="one-time-code"
                    maxLength={6}
                    className="text-center text-2xl tracking-widest"
                  />
                </View>
              </View>
            </View>

            {/* Verify Button */}
            <Button
              onPress={onVerifyPress}
              disabled={!verificationCode || verificationCode.length < 6}
              className="w-full mb-6"
            >
              <Text className="text-white text-center text-base font-semibold">
                Verify Email
              </Text>
            </Button>

            {/* Resend Code */}
            <View className="flex-row justify-center items-center">
              <Text className={`text-base ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Didn't receive the code?
              </Text>
              <TouchableOpacity
                onPress={() => {
                  // Implement resend logic
                  Alert.alert('Resend', 'Verification code resent to your email.');
                }}
                className="ml-1"
              >
                <Text className="text-blue-500 text-base font-semibold">
                  Resend
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-white'}`}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: contentInsets.top,
          paddingBottom: contentInsets.bottom + 20,
        }}
        showsVerticalScrollIndicator={false}
        className="flex-1"
      >
        <SafeAreaView className="bg-gray-900">
          <StatusBar barStyle="light-content" backgroundColor="#111827" />
        </SafeAreaView>

        {/* Header */}
        <View className="flex-row items-center px-6 py-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View className="flex-1 px-6">
          {/* Title */}
          <View className="mt-8 mb-12">
            <View className="flex-row items-center">
              <Text className="text-white text-3xl font-bold">Join Taskify Today</Text>
              <Text className="text-yellow-400 text-3xl ml-2">✨</Text>
            </View>
            <Text className="text-gray-400 text-base mt-3 leading-5">
              Create your account and unlock a world of productivity.
            </Text>
          </View>

          {/* Email Input */}
          <Form {...form}>
            <View className="mb-6">
              <Text className="text-white text-base font-medium mb-3">Email</Text>
              <FormField
                control={form.control}
                name="emailAddress"
                render={({ field }) => (


                  <Input
                    className="flex-1 text-base ml-3"
                    placeholder="Email"
                    placeholderTextColor="#9CA3AF"
                    value={field.value}
                    onChangeText={field.onChange}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    leftIcon={() => (<Ionicons name="mail-outline" size={20} color="#9CA3AF" />)}
                  />

                )}
              />
            </View>

            {/* Password Input */}
            <View className="mb-6">
              <Text className="text-white text-base font-medium mb-3">Password</Text>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <View className="bg-gray-800 rounded-lg px-4 py-4 flex-row items-center">
                    <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" />
                    <TextInput
                      className="flex-1 text-white text-base ml-3"
                      placeholder="Password"
                      placeholderTextColor="#9CA3AF"
                      value={field.value}
                      onChangeText={field.onChange}
                      secureTextEntry={!showPassword}
                      autoComplete="new-password"
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                      <Ionicons
                        name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                        size={20}
                        color="#9CA3AF"
                      />
                    </TouchableOpacity>
                  </View>
                )}
              />
            </View>

            {/* Terms and Conditions */}
            <TouchableOpacity
              className="flex-row items-center mb-6"
              onPress={() => setAgreeToTerms(!agreeToTerms)}
            >
              <View
                className={`w-5 h-5 rounded border-2 mr-3 items-center justify-center ${agreeToTerms ? 'bg-orange-500 border-orange-500' : 'border-gray-500'
                  }`}
              >
                {agreeToTerms && <Ionicons name="checkmark" size={12} color="white" />}
              </View>
              <Text className="text-gray-300 text-base">
                I agree to Taskify <Text className="text-orange-500">Terms & Conditions</Text>.
              </Text>
            </TouchableOpacity>

            {/* Sign In Link */}
            <View className="flex-row justify-center mb-8">
              <Text className="text-gray-400 text-base">Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/sign-in')}>
                <Text className="text-orange-500 text-base">Sign in</Text>
              </TouchableOpacity>
            </View>

            {/* Divider */}
            <View className="flex-row items-center mb-8">
              <View className="flex-1 h-px bg-gray-700" />
              <Text className="text-gray-400 text-base mx-4">or</Text>
              <View className="flex-1 h-px bg-gray-700" />
            </View>

            {/* Social Sign Up Buttons */}
            <View className="gap-4 mb-8">
              <TouchableOpacity
                className="bg-gray-800 rounded-xl py-4 flex-row items-center justify-center"
                onPress={onGoogleSignUp}
              >
                <Text className="text-4xl mr-3">G</Text>
                <Text className="text-white text-base font-medium">Continue with Google</Text>
              </TouchableOpacity>

              {Platform.OS === 'ios' && (
                <TouchableOpacity
                  className="bg-gray-800 rounded-xl py-4 flex-row items-center justify-center"
                  onPress={onAppleSignUp}
                >
                  <Ionicons name="logo-apple" size={20} color="white" />
                  <Text className="text-white text-base font-medium ml-3">Continue with Apple</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity
              className={`rounded-xl py-4 items-center justify-center ${agreeToTerms ? 'bg-orange-500' : 'bg-gray-700'}`}
              disabled={!agreeToTerms || form.formState.isSubmitting}
              onPress={form.handleSubmit(onSubmit, console.error)}
            >
              <Text className="text-white text-base font-semibold">
                {form.formState.isSubmitting ? 'Creating Account...' : 'Sign up'}
              </Text>
            </TouchableOpacity>
          </Form>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignUpScreen;