import React from "react";
import { View, GestureResponderEvent, ScrollView } from "react-native";
import { Button } from "../ui/button";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "~/components/ui/text";
import { router } from "expo-router";
import { X } from "@/lib/icons/X";

type Props = {};

const GetStarted = (props: Props) => {
  const onSocialPress = (provider: string) => {
    // Hook up to Clerk SSO providers later if desired
    router.push("/(auth)/sign-in");
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1 bg-white">
      <View className="flex-1 px-6 pt-12 pb-6">
        {/* Logo */}
        <View className="items-center mt-4 mb-8">
          <View className="w-16 h-16 bg-[#FF7A33] rounded-2xl items-center justify-center">
            <Ionicons name="flame" size={28} color="#fff" />
          </View>
        </View>

        {/* Heading */}
        <View className="items-center mb-8">
          <Text className="text-3xl font-extrabold text-[#1A1A1A] mb-2">Let's Get Started!</Text>
          <Text className="text-base text-[#7A7A7A]">Let's dive in into your account</Text>
        </View>

        {/* Social Buttons */}
        <View className="gap-4">
          <Button
            variant="outline"
            onPress={() => onSocialPress("google")}
            className="w-full h-14 rounded-full"
          >
            <View className="flex-row items-center">
              <Ionicons name="logo-google" size={20} color="#4285F4" />
              <Text className="ml-2 text-[#111111] font-semibold">Continue with Google</Text>
            </View>
          </Button>

          <Button
            variant="outline"
            onPress={() => onSocialPress("apple")}
            className="w-full h-14 rounded-full"
          >
            <View className="flex-row items-center">
              <Ionicons name="logo-apple" size={22} color="#111" />
              <Text className="ml-2 text-[#111111] font-semibold">Continue with Apple</Text>
            </View>
          </Button>

          <Button
            variant="outline"
            onPress={() => onSocialPress("facebook")}
            className="w-full h-14 rounded-full"
          >
            <View className="flex-row items-center">
              <Ionicons name="logo-facebook" size={20} color="#1877F2" />
              <Text className="ml-2 text-[#111111] font-semibold">Continue with Facebook</Text>
            </View>
          </Button>

          <Button
            variant="outline"
            onPress={() => onSocialPress("x")}
            className="w-full h-14 rounded-full"
          >
            <View className="flex-row items-center">
              <X size={20} color="#111" />
              <Text className="ml-2 text-[#111111] font-semibold">Continue with X</Text>
            </View>
          </Button>
        </View>

        {/* Primary actions */}
        <View className="mt-8 gap-4">
          <Button onPress={() => router.push("/(auth)/sign-up") } className="w-full h-14 rounded-full bg-[#FF7A33]">
            <Text className="text-white font-semibold">Sign up</Text>
          </Button>
          <Button variant="secondary" onPress={() => router.push("/(auth)/sign-in")} className="w-full h-14 rounded-full bg-[#FFEDE5]">
            <Text className="text-[#FF7A33] font-semibold">Sign in</Text>
          </Button>
        </View>

        {/* Footer links */}
        <View className="mt-8 items-center">
          <View className="flex-row items-center">
            <Text className="text-sm text-[#8B8B8B]">Privacy Policy</Text>
            <Text className="mx-2 text-[#C7C7C7]">·</Text>
            <Text className="text-sm text-[#8B8B8B]">Terms of Service</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default GetStarted;
