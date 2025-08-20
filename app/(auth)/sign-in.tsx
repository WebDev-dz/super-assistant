import React from "react";
import {
  View,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useSignIn, useOAuth, useAuth, useSSO } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as z from "zod";
import { Button } from "~/components/ui/button";
import { Form, FormField, FormInput, FormItem } from "~/components/ui/form";
import { Text } from "~/components/ui/text";
import { useColorScheme } from "@/lib/useColorScheme";
import db from "@/db";

// Form validation schema
const signInFormSchema = z.object({
  emailAddress: z
    .string()
    .min(1, { message: "Email address is required." })
    .email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    .min(1, { message: "Password is required." })
    .min(6, { message: "Password must be at least 6 characters." }),
});

const SignInScreen = () => {
  const { signIn, setActive, isLoaded } = useSignIn();
  const { getToken, signOut } = useAuth();
  const { startSSOFlow: googleAuth } = useSSO();
  //   const { startOAuthFlow: appleAuth } = useOAuth({ strategy: 'oauth_apple' });
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const form = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      emailAddress: "",
      password: "",
    },
  });

  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };

  async function onSubmit(values: z.infer<typeof signInFormSchema>) {
    if (!isLoaded) return;

    try {
      const completeSignIn = await signIn.create({
        identifier: values.emailAddress,
        password: values.password,
      });

      const idToken = await getToken();
      if (completeSignIn.status === "complete" && idToken) {
        await setActive({ session: completeSignIn.createdSessionId });
        db.auth.signInWithIdToken({
          idToken,
          clientName: "clerk",
        });
        router.replace("/");
        form.reset();
      } else {
        console.log(JSON.stringify(completeSignIn, null, 2));
      }
    } catch (err: any) {
      Alert.alert(
        "Sign In Error",
        err.errors?.[0]?.message || "An error occurred during sign in."
      );
    }
  }

  const onGoogleSignIn = async () => {
    try {
      const { createdSessionId, setActive } = await googleAuth({
        strategy: "oauth_google",
        // redirectUrl: "/",
      });

      if (createdSessionId) {
        setActive?.({ session: createdSessionId });
        router.replace("/(tabs)");
      }
    } catch (err) {
      Alert.alert("Error", "Google sign-in failed");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className={`flex-1 ${isDark ? "bg-gray-900" : "bg-white"}`}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: contentInsets.top + 20,
          paddingBottom: contentInsets.bottom + 20,
          paddingLeft: contentInsets.left,
          paddingRight: contentInsets.right,
          height: "100%",
        }}
        showsVerticalScrollIndicator={false}
        className="flex-1"
      >
        <View className="flex-1 px-6 justify-center h-full">
          {/* Header */}
          <View className="items-center my-12">
            <View className="w-20 h-20 bg-blue-500 rounded-full items-center justify-center mb-4">
              <Ionicons name="checkmark-done" size={32} color="white" />
            </View>
            <Text
              className={`text-3xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
            >
              Welcome Back
            </Text>
            <Text
              className={`text-center text-base ${isDark ? "text-gray-300" : "text-gray-600"}`}
            >
              Sign in to continue managing your goals and todos with AI
              assistance
            </Text>
          </View>

          {/* Sign In Form */}
          <Form {...form}>
            <View className="space-y-6 mb-8">
              {/* Email Field */}
              <FormField
                control={form.control}
                name="emailAddress"
                render={({ field }) => (
                  <FormInput
                    label="Email Address"
                    placeholder="Enter your email"
                    description="Your registered email address"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    {...field}
                  />
                )}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormInput
                    label="Password"
                    placeholder="Enter your password"
                    description="Your account password"
                    secureTextEntry
                    autoComplete="password"
                    {...field}
                  />
                )}
              />

              {/* Forgot Password Link */}
              <TouchableOpacity
                onPress={() => router.push("/forgot-password")}
                className="self-end"
              >
                <Text className="text-blue-500 text-sm font-medium">
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            </View>

            {/* Sign In Button */}
            <Button
              onPress={form.handleSubmit(onSubmit)}
              disabled={form.formState.isSubmitting}
              className="w-full mb-6"
            >
              <Text className="text-white text-center text-base font-semibold">
                {form.formState.isSubmitting ? "Signing In..." : "Sign In"}
              </Text>
            </Button>
          </Form>

          {/* Divider */}
          <View className="flex-row items-center mb-6">
            <View
              className={`flex-1 h-px ${isDark ? "bg-gray-700" : "bg-gray-200"}`}
            />
            <Text
              className={`px-4 text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
            >
              Or continue with
            </Text>
            <View
              className={`flex-1 h-px ${isDark ? "bg-gray-700" : "bg-gray-200"}`}
            />
          </View>

          {/* Social Sign In Buttons */}
          <View className="flex-row space-x-4 mb-8">
            {/* Google Sign In */}
            <Button
              variant="outline"
              onPress={onGoogleSignIn}
              className="flex-1 flex-row items-center justify-center py-4"
            >
              <View className="flex-row items-center">
                <Ionicons name="logo-google" size={20} color="#4285F4" />
                <Text className="ml-2 text-gray-700 font-medium">Google</Text>
              </View>
            </Button>
          </View>

          {/* Sign Up Link */}
          <View className="flex-row justify-center items-center mt-auto">
            <Text
              className={`text-base ${isDark ? "text-gray-300" : "text-gray-600"}`}
            >
              Don't have an account?
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/sign-up")}
              className="ml-1"
            >
              <Text className="text-blue-500 text-base font-semibold">
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignInScreen;
