import React from "react";
import {
  View,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useSignIn } from "@clerk/clerk-expo";
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

// Form validation schema
const forgotPasswordSchema = z.object({
  emailAddress: z
    
    .email({ message: "Please enter a valid email address." }),
});

const ForgotPasswordScreen = () => {
  const { isLoaded, signIn } = useSignIn();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      emailAddress: "",
    },
  });

  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };

  async function onSubmit(values: z.infer<typeof forgotPasswordSchema>) {
    if (!isLoaded) return;

    try {
      // Create a password reset request
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: values.emailAddress,
      });

      Alert.alert(
        "Check your email",
        "A password reset code has been sent to your email address.",
        [
          {
            text: "OK",
            onPress: () => router.push({
              pathname: "/reset-password",
              params: { email: values.emailAddress }
            }),
          },
        ]
      );
    } catch (err: any) {
      Alert.alert(
        "Error",
        err.errors?.[0]?.message || "An error occurred while sending the reset email."
      );
    }
  }

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
              <Ionicons name="lock-closed" size={32} color="white" />
            </View>
            <Text
              className={`text-3xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
            >
              Reset Password
            </Text>
            <Text
              className={`text-center text-base ${isDark ? "text-gray-300" : "text-gray-600"}`}
            >
              Enter your email address to receive a password reset code
            </Text>
          </View>

          {/* Forgot Password Form */}
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
            </View>

            {/* Submit Button */}
            <Button
              onPress={form.handleSubmit(onSubmit)}
              disabled={form.formState.isSubmitting}
              className="w-full mb-6"
            >
              <Text className="text-white text-center text-base font-semibold">
                {form.formState.isSubmitting ? "Sending..." : "Send Reset Code"}
              </Text>
            </Button>
          </Form>

          {/* Back to Sign In Link */}
          <View className="flex-row justify-center items-center mt-auto">
            <TouchableOpacity
              onPress={() => router.push("/sign-in")}
              className="ml-1"
            >
              <Text className="text-blue-500 text-base font-semibold">
                Back to Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ForgotPasswordScreen;