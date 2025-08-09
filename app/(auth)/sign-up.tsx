// app/(auth)/sign-up.tsx
import React from 'react';
import {
  View,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
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
    .string()
    .min(1, { message: 'Email address is required.' })
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
const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [verificationCode, setVerificationCode] = React.useState('');

  const form = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      emailAddress: '',
      password: '',
      confirmPassword: '',
    },
  });

  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };

  async function onSubmit(values: z.infer<typeof signUpFormSchema>) {
    if (!isLoaded) return;

    try {
        // console.log({values})
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
        router.replace('/');
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
        router.replace('/');
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
        className="flex-1 bg-white"
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
              <Text className="text-3xl font-bold text-gray-900 mb-2">
                Check Your Email
              </Text>
              <Text className="text-gray-600 text-center text-base">
                We've sent a verification code to your email address. Enter the code below to complete your registration.
              </Text>
            </View>

            {/* Verification Input */}
            <View className="space-y-6 mb-8">
              <View>
                <Text className="text-gray-700 text-sm font-medium mb-2">
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
              <Text className="text-gray-600 text-base">
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
      className="flex-1 bg-white"
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
              <Ionicons name="person-add-outline" size={32} color="white" />
            </View>
            <Text className="text-3xl font-bold text-gray-900 mb-2">
              Create Account
            </Text>
            <Text className="text-gray-600 text-center text-base">
              Join Super Assistant and start managing your goals and todos with AI
            </Text>
          </View>

          {/* Social Sign Up Buttons */}
          <View className="flex-row space-x-4 mb-8">
            {/* Google Sign Up */}
            <Button
              variant="outline"
              onPress={onGoogleSignUp}
              className="flex-1 flex-row items-center justify-center py-4"
            >
              <View className="flex-row items-center">
                <Ionicons name="logo-google" size={20} color="#4285F4" />
                <Text className="ml-2 text-gray-700 font-medium">Google</Text>
              </View>
            </Button>

            {/* Apple Sign Up (iOS only) */}
            {Platform.OS === 'ios' && (
              <Button
                variant="outline"
                onPress={onAppleSignUp}
                className="flex-1 flex-row items-center justify-center py-4 bg-black border-black"
              >
                <View className="flex-row items-center">
                  <Ionicons name="logo-apple" size={20} color="white" />
                  <Text className="ml-2 text-white font-medium">Apple</Text>
                </View>
              </Button>
            )}
          </View>

          {/* Divider */}
          <View className="flex-row items-center mb-8">
            <View className="flex-1 h-px bg-gray-200" />
            <Text className="px-4 text-gray-500 text-sm">Or create with email</Text>
            <View className="flex-1 h-px bg-gray-200" />
          </View>

          {/* Sign Up Form */}
          <Form {...form}>
            <View className="space-y-6 mb-8">
              {/* Name Fields */}
              <View className="flex-row space-x-4">
                <View className="flex-1">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormInput
                        label="First Name"
                        placeholder="John"
                        description="Your first name"
                        autoCapitalize="words"
                        autoComplete="given-name"
                        {...field}
                      />
                    )}
                  />
                </View>
                <View className="flex-1">
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormInput
                        label="Last Name"
                        placeholder="Doe"
                        description="Your last name"
                        autoCapitalize="words"
                        autoComplete="family-name"
                        {...field}
                      />
                    )}
                  />
                </View>
              </View>

              {/* Email Field */}
              <FormField
                control={form.control}
                name="emailAddress"
                render={({ field }) => (
                  <FormInput
                    label="Email Address"
                    placeholder="john.doe@example.com"
                    description="Your email address"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    {...field}
                  />
                )}
              />

              {/* Password Fields */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormInput
                    label="Password"
                    placeholder="Create a strong password"
                    description="At least 8 characters with uppercase, lowercase, and number"
                    secureTextEntry
                    autoComplete="new-password"
                    
                    {...field}
                  />
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormInput
                    label="Confirm Password"
                    placeholder="Confirm your password"
                    description="Re-enter your password"
                    secureTextEntry
                    autoComplete="new-password"
                    {...field}
                  />
                )}
              />
            </View>

            {/* Sign Up Button */}
            <Button
              onPress={form.handleSubmit(onSubmit)}
              disabled={form.formState.isSubmitting}
              className="w-full mb-6"
            >
              <Text className="text-white text-center text-base font-semibold">
                {form.formState.isSubmitting ? 'Creating Account...' : 'Create Account'}
              </Text>
            </Button>
          </Form>

          {/* Terms and Privacy */}
          <View className="mb-6">
            <Text className="text-gray-500 text-sm text-center">
              By creating an account, you agree to our{' '}
              <Text className="text-blue-500">Terms of Service</Text> and{' '}
              <Text className="text-blue-500">Privacy Policy</Text>
            </Text>
          </View>

          {/* Form Actions */}
          <View className="mb-6">
            <Button
              variant="ghost"
              onPress={() => form.clearErrors()}
              className="mb-2"
            >
              <Text>Clear errors</Text>
            </Button>
            <Button
              variant="ghost"
              onPress={() => form.reset()}
            >
              <Text>Clear form</Text>
            </Button>
          </View>

          {/* Sign In Link */}
          <View className="flex-row justify-center items-center mt-auto">
            <Text className="text-gray-600 text-base">
              Already have an account? 
            </Text>
            <TouchableOpacity 
              onPress={() => router.push('/(auth)/sign-in')}
              className="ml-1"
            >
              <Text className="text-blue-500 text-base font-semibold">
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignUpScreen;