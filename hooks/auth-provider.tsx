import db from "@/db";
import { useAuth as useClerkAuth, useSignIn, useSignUp, useSSO } from "@clerk/clerk-expo";
import { router } from "expo-router";
import { Alert } from "react-native";



type OAuthProvider = "google" | "github" | "facebook" | "twitter" 


const useCustomAuth = () => {
    const clerkAuth = useClerkAuth();
    const { signIn, setActive, isLoaded: isSignInLoaded } = useSignIn()
    const { signUp, isLoaded: isSignUpLoaded } = useSignUp()
    const { startSSOFlow } = useSSO();

    const onSignOut = async () => {
        await clerkAuth.signOut();
        db.auth.signOut({
            invalidateToken: true,
        })
    }

    const onSignIn = async (email: string, password: string) => {
        if (!isSignInLoaded) {
            Alert.alert("Error", "Auth not ready. Please try again.");
            return;
        }
        try {
            const result = await signIn?.create({
                identifier: email,
                password,
            })

            if (result?.status === "complete") {
                await setActive?.({ session: result.createdSessionId })
                const idToken = await clerkAuth.getToken?.();
                if (idToken) {
                    await db.auth.signInWithIdToken({ idToken, clientName: "clerk" });
                }
                router.replace("/");
            }

            return result;
        } catch (err: any) {
            Alert.alert("Sign In Error", err?.errors?.[0]?.message || "An error occurred during sign in.");
        }
    }

    const onSignUp = async (email: string, password: string) => {
        if (!isSignUpLoaded) {
            Alert.alert("Error", "Auth not ready. Please try again.");
            return;
        }
        try {
            const result = await signUp?.create({
                emailAddress: email,
                password,
            })

            if (result?.status === "complete") {
                await setActive?.({ session: result.createdSessionId })
                const idToken = await clerkAuth.getToken?.();
                if (idToken) {
                    await db.auth.signInWithIdToken({ idToken, clientName: "clerk" });
                }
                router.replace("/");
            }

            return result;
        } catch (err: any) {
            Alert.alert("Sign Up Error", err?.errors?.[0]?.message || "An error occurred during sign up.");
        }
    }

    const onVerifyOTP = async (codeString: string, newPassword?: string) => {
        if (!isSignInLoaded || codeString.length < 6) return;
        try {
          const attempt = await signIn.attemptFirstFactor({
            strategy: 'reset_password_email_code',
            code: codeString,
            ...(newPassword && { password: newPassword }),
          });
    
          if (attempt?.status === 'needs_new_password' && !newPassword) {
            router.push({ pathname: '/(auth)/new-password', params: { code: codeString } });
            return;
          }
    
          if (attempt?.status === 'complete') {
            if (attempt.createdSessionId) {
              await setActive?.({ session: attempt.createdSessionId });
              const idToken = await clerkAuth.getToken?.();
              if (idToken) {
                await db.auth.signInWithIdToken({ idToken, clientName: "clerk" });
              }
            }
            router.replace('/');
          }
        } catch (err: any) {
          alert(err?.errors?.[0]?.message || 'Invalid verification code');
        }
      };

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

    const onForgotPassword = async (email: string) => {
        if (!isSignInLoaded) {
            Alert.alert("Error", "Auth not ready. Please try again.");
            return;
        }
        try {
            const result = await signIn?.create({
                identifier: email,
                strategy: "reset_password_email_code",
            });

            console.log({result})

            if (result?.status === "needs_new_password") {
                router.push("/(auth)/enter-otp");
                return result;
            }
            
        } catch (err: any) {
            Alert.alert(
                "Password Reset Error", 
                err?.errors?.[0]?.message || "An error occurred while trying to reset password."
            );
        }
    };

    return {
        onSignOut,
        onSignIn,
        onSignUp,
        onAuthFlow,
        onVerifyOTP,
        onForgotPassword,
    }
}

export default useCustomAuth;



