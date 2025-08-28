import db from "@/db";
import {
  useAuth as useClerkAuth,
  useSignIn,
  useSignUp,
  useSSO,
} from "@clerk/clerk-expo";
import { router } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";
import Toast from "react-native-toast-message";
import z from "zod";

type OAuthProvider = "google" | "github" | "facebook" | "twitter";

const useCustomAuth = () => {
  const clerkAuth = useClerkAuth();
  const { signIn, setActive, isLoaded: isSignInLoaded } = useSignIn();
  const { signUp, isLoaded: isSignUpLoaded } = useSignUp();
  const { startSSOFlow } = useSSO();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>()

  const onSignOut = async () => {
    db.auth.signOut().then(async() => {
      // Then sign out of Clerk to clear the Clerk session.
      await clerkAuth.signOut();
    });
  
  };

  const onSignIn = async (email: string, password: string) => {
    if (!isSignInLoaded) {
      Alert.alert("Error", "Auth not ready. Please try again.");
      return;
    }
    try {
      const result = await signIn?.create({
        identifier: email,
        password,
      });

      if (result?.status === "complete") {
        await setActive?.({ session: result.createdSessionId });
        const idToken = await clerkAuth.getToken?.();
        if (idToken) {
          await db.auth.signInWithIdToken({ idToken, clientName: "clerk" });
        }
        router.replace("/");
      }

      return result;
    } catch (err: any) {
      Alert.alert(
        "Sign In Error",
        err?.errors?.[0]?.message || "An error occurred during sign in."
      );
    }
  };

  const onForgotPassword = async (email: string) => {
    if (!isSignInLoaded || !email) return;
    try {
      setLoading(true);
      // Bind identifier to signIn resource
      await signIn?.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });

      router.push({ pathname: "/(auth)/enter-otp", params: { email } });
    } catch (err: any) {
      alert(err?.errors?.[0]?.message || "Failed to send reset code");
    } finally {
      setLoading(false);
    }
  };

  const onSignUp = async (email: string, password: string) => {
    if (!isSignUpLoaded) {
      Alert.alert("Error", "Auth not ready. Please try again.");
      return;
    }
    try {
      const result = await signUp?.create({
        emailAddress: email,
        password,
      });

      if (result?.status === "complete") {
        await setActive?.({ session: result.createdSessionId });
        const idToken = await clerkAuth.getToken?.();
        if (idToken) {
          await db.auth.signInWithIdToken({ idToken, clientName: "clerk" });
        }
        router.replace("/");
      }

      return result;
    } catch (err: any) {
      Alert.alert(
        "Sign Up Error",
        err?.errors?.[0]?.message || "An error occurred during sign up."
      );
    }
  };

  const onVerifyOTP = async (codeString: string) => {
    if (!isSignInLoaded || codeString.length < 6) return;
    try {
      const attempt = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: codeString,
      });

      router.push({
        pathname: "/(auth)/new-password",
        params: { code: codeString },
      });

      // If Clerk returns complete (rare in this flow), route to root
    } catch (err: any) {
      alert(err?.errors?.[0]?.message || "Invalid verification code");
    }
  };

  const onResetPassword = async (otp: string, newPassword: string) => {
    if (!isSignInLoaded || otp.length < 6) return;
    try {
      const attempt = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: otp,
        password: newPassword
      });

      if (attempt.status == "complete") {
        Toast.show({"text1": "Success", "text2": "Password Updated Successfully"})
        router.push("/(application)/(app)")
      }
      if (attempt.status == "needs_new_password" ) {

      }
      if (attempt.status == "needs_first_factor") {

      }
      if (attempt.status == "needs_second_factor") {

      }
      // If Clerk returns complete (rare in this flow), route to root
    } catch (err: any) {
      alert(err?.errors?.[0]?.message || "Invalid verification code");
    }
     
  }

  const onAuthFlow = async (strategy: `oauth_${OAuthProvider}`) => {
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: strategy,
        // redirectUrl: "/",
      });

      if (createdSessionId) {
        setActive?.({ session: createdSessionId });
        const idToken = await clerkAuth.getToken?.();
        if (idToken) {
          await db.auth.signInWithIdToken({ idToken, clientName: "clerk" });
        }
        router.replace("/");
      }
    } catch (err) {
      Alert.alert("Error", JSON.stringify({ err }));
    }
  };

  return {
    onSignOut,
    onSignIn,
    onSignUp,
    onAuthFlow,
    onVerifyOTP,
    onForgotPassword,
    onResetPassword,
    isLoading: loading,
    isSignInLoaded,
    isSignUpLoaded,
  };
};

export default useCustomAuth;
