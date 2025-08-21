import React from "react";
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
      console.log("signed in with clerk")
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
        router.replace("/");
      }
    } catch (err) {
      Alert.alert("Error", JSON.stringify({err}));
    }
  };

  const [showPassword, setShowPassword] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(false);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-gray-900"
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: contentInsets.top,
          paddingBottom: contentInsets.bottom + 24,
          paddingLeft: contentInsets.left,
          paddingRight: contentInsets.right,
        }}
        showsVerticalScrollIndicator={false}
        className="flex-1"
      >
        <SafeAreaView className="bg-gray-900">
          <StatusBar barStyle="light-content" backgroundColor="#111827" />
        </SafeAreaView>

        {/* Back */}
        <View className="flex-row items-center px-2 py-2">
          <TouchableOpacity onPress={() => router.back()} className="px-4 py-2">
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View className="flex-1 px-6">
          {/* Title */}
          <View className="mt-2 mb-8">
            <Text className="text-3xl font-extrabold text-white">Welcome Back! 👋</Text>
            <Text className="text-base text-gray-400 mt-3 leading-6">
              Sign in to access your goals, habits, and progress.
            </Text>
          </View>

          {/* Form */}
          <Form {...form}>
            {/* Email */}
            <View className="mb-5">
              <Text className="text-white text-base font-semibold mb-2">Email</Text>
              <FormField
                control={form.control}
                name="emailAddress"
                render={({ field }) => (
                  <View className="bg-gray-800 rounded-xl px-4 py-4 flex-row items-center">
                    <Ionicons name="mail-outline" size={20} color="#9CA3AF" />
                    <TextInput
                      className="flex-1 text-white text-base ml-3"
                      placeholder="Email"
                      placeholderTextColor="#9CA3AF"
                      value={field.value}
                      onChangeText={field.onChange}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoComplete="email"
                    />
                  </View>
                )}
              />
            </View>

            {/* Password */}
            <View className="mb-4">
              <Text className="text-white text-base font-semibold mb-2">Password</Text>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <View className="dark:bg-gray-800 bg-gray-200 rounded-xl px-4 py-4 flex-row items-center">
                    <Ionicons name="lock-closed-outline" size={20} color={isDark ? "#9CA3AF" : "#000"} />
                    <TextInput
                      className="flex-1 text-white text-base ml-3"
                      placeholder="Password"
                      placeholderTextColor="#9CA3AF"
                      value={field.value}
                      onChangeText={field.onChange}
                      secureTextEntry={!showPassword}
                      autoComplete="password"
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                      <Ionicons
                        name={showPassword ? "eye-outline" : "eye-off-outline"}
                        size={20}
                        color="#9CA3AF"
                      />
                    </TouchableOpacity>
                  </View>
                )}
              />
            </View>

            {/* Remember / Forgot */}
            <View className="flex-row items-center justify-between mb-6">
              <TouchableOpacity
                className="flex-row items-center"
                onPress={() => setRememberMe(!rememberMe)}
              >
                <View
                  className={`w-5 h-5 rounded border-2 mr-3 items-center justify-center ${
                    rememberMe ? "bg-orange-500 border-orange-500" : "border-gray-500"
                  }`}
                >
                  {rememberMe && <Ionicons name="checkmark" size={12} color="white" />}
                </View>
                <Text className="text-gray-300 text-base">Remember me</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => router.push("/forgot-password")}>
                <Text className="text-gray-200 text-base font-semibold">Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            {/* Divider */}
            <View className="flex-row items-center mb-6">
              <View className="flex-1 h-px bg-gray-700" />
              <Text className="text-gray-400 text-sm mx-4">or</Text>
              <View className="flex-1 h-px bg-gray-700" />
            </View>

            {/* Social */}
            <View className="gap-4 mb-4">
              <Button
                variant="outline"
                onPress={onGoogleSignIn}
                className="h-14 rounded-2xl bg-transparent border border-gray-700"
              >
                <View className="flex-row items-center">
                  <Ionicons name="logo-google" size={20} color="#4285F4" />
                  <Text className="ml-2 text-gray-200 font-semibold">Continue with Google</Text>
                </View>
              </Button>
            </View>

            {/* Primary Sign In */}
            <Button
              onPress={form.handleSubmit(onSubmit)}
              disabled={form.formState.isSubmitting}
              className="w-full h-14 rounded-full bg-[#FF7A33] mt-2"
            >
              <Text className="text-white text-center text-base font-semibold">
                {form.formState.isSubmitting ? "Signing In..." : "Sign in"}
              </Text>
            </Button>

            {/* Sign up link */}
            <View className="flex-row justify-center items-center mt-6">
              <Text className="text-gray-400 text-base">Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push("/sign-up")}>
                <Text className="text-orange-500 text-base">Sign up</Text>
              </TouchableOpacity>
            </View>
          </Form>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignInScreen;
