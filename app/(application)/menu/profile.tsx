import React, { useState } from "react";
import {
  View,
  Alert,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useColorScheme } from "@/lib/useColorScheme";

const ProfileScreen = () => {
  const { signOut, isLoaded } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const [isSigningOut, setIsSigningOut] = useState(false);

  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };

  const handleSignOut = async () => {
    if (!isLoaded) return;
    
    setIsSigningOut(true);
    try {
      await signOut();
      router.replace("/sign-in");
    } catch (err: any) {
      Alert.alert("Error", err.errors?.[0]?.message || "Failed to sign out");
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleChangePassword = () => {
    Alert.alert(
      "Change Password",
      "A password reset email will be sent to your email address.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Send Email",
          onPress: () => router.push("/forgot-password"),
        },
      ]
    );
  };

  const handleUpgrade = () => {
    Alert.alert(
      "Upgrade Account",
      "Upgrade to premium for advanced features and unlimited access.",
      [
        {
          text: "Not Now",
          style: "cancel",
        },
        {
          text: "Upgrade",
          onPress: () => console.log("Navigate to upgrade screen"),
        },
      ]
    );
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        paddingTop: contentInsets.top + 20,
        paddingBottom: contentInsets.bottom + 20,
        paddingLeft: contentInsets.left,
        paddingRight: contentInsets.right,
      }}
      className={`flex-1 ${isDark ? "bg-gray-900" : "bg-white"}`}
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-1 px-6">
        {/* Header with Avatar */}
        <View className="items-center mb-8">
          <View className="w-32 h-32 bg-blue-500 rounded-full items-center justify-center mb-6 border-4 border-blue-400">
            {user?.imageUrl ? (
              <Image
                source={{ uri: user.imageUrl }}
                className="w-full h-full rounded-full"
              />
            ) : (
              <Ionicons name="person" size={48} color="white" />
            )}
          </View>
          <Text
            className={`text-3xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
          >
            {user?.firstName} {user?.lastName}
          </Text>
          <Text
            className={`text-lg ${isDark ? "text-gray-300" : "text-gray-600"}`}
          >
            {user?.primaryEmailAddress?.emailAddress}
          </Text>
        </View>

        {/* Account Actions */}
        <View className="space-y-6 mb-8">
          {/* Change Password Button */}
          <TouchableOpacity
            onPress={handleChangePassword}
            className={`flex-row items-center p-5 rounded-xl ${isDark ? "bg-gray-800" : "bg-gray-100"}`}
          >
            <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-4">
              <Ionicons name="key-outline" size={20} color="#3b82f6" />
            </View>
            <View className="flex-1">
              <Text
                className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
              >
                Change Password
              </Text>
              <Text className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                Update your account password
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={isDark ? "#9ca3af" : "#6b7280"}
            />
          </TouchableOpacity>

          {/* Upgrade Button */}
          <TouchableOpacity
            onPress={handleUpgrade}
            className={`flex-row items-center p-5 rounded-xl ${isDark ? "bg-gray-800" : "bg-gray-100"}`}
          >
            <View className="w-10 h-10 bg-purple-100 rounded-full items-center justify-center mr-4">
              <Ionicons name="diamond-outline" size={20} color="#a855f7" />
            </View>
            <View className="flex-1">
              <Text
                className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
              >
                Upgrade Account
              </Text>
              <Text className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                Get access to premium features
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={isDark ? "#9ca3af" : "#6b7280"}
            />
          </TouchableOpacity>
        </View>

        {/* Sign Out Button */}
        <Button
          onPress={handleSignOut}
          disabled={isSigningOut}
          variant={isDark ? "secondary" : "outline"}
          className="w-full mb-6"
        >
          {isSigningOut ? (
            <>
              <Ionicons name="log-out-outline" size={20} className="mr-2" />
              <Text className="text-base font-semibold">Signing Out...</Text>
            </>
          ) : (
            <>
              <Ionicons name="log-out-outline" size={20} className="mr-2" />
              <Text className="text-base font-semibold">Sign Out</Text>
            </>
          )}
        </Button>

        {/* App Version */}
        <View className="mt-auto pt-6 items-center">
          <Text className={`text-sm ${isDark ? "text-gray-500" : "text-gray-400"}`}>
            App Version 1.0.0
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;