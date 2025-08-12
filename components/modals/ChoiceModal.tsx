import { FloatingActionButton } from "@/components/ui/floating-action-button";
import { useColorScheme } from "@/lib/useColorScheme";
import { Text, View } from "react-native";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useCallback } from "react";
import { BottomSheetView } from "../deprecated-ui/bottom-sheet";
import { getRoleValue, OptionButton } from "@/components/ui/option-button";
import { useModalManager } from "@/hooks/useModalManager";
import { id } from "@instantdb/react-native";
import { defaultGoal, defaultMilestone, defaultTask } from "@/lib/constants";

export type OptionButtonConfig = {
  icon: string | { guest: string; user: string; pro: string };
  title: string | { guest: string; user: string; pro: string };
  subtitle: string | { guest: string; user: string; pro: string };
  onPress:
    | ((option: string) => Promise<void>)
    | {
        guest: (option: string) => Promise<void>;
        user: (option: string) => Promise<void>;
        pro: (option: string) => Promise<void>;
      };
  disabled?: boolean | { guest: boolean; user: boolean; pro: boolean };
  isDark: boolean;
  role: "guest" | "user" | "pro";
  optionKey: string; // Unique identifier for the option
};

interface ChoiceModalProps {
  // Modal configuration
  title?: string | { guest: string; user: string; pro: string };
  description?: string | { guest: string; user: string; pro: string };
  snapPoints?: string[];
  
  // Options configuration
  options: OptionButtonConfig[];
  
  // Optional FAB configuration
  showFAB?: boolean;
  fabIcon?: string;
  
  // Modal control (for external control)
  isOpen?: boolean;
  onClose?: () => void;
  role: "guest" | "user" | "pro";
  // Callbacks
  onOptionSelected?: (optionKey: string, role: "guest" | "user" | "pro") => void;
}

export function ChoiceModal({
  title = "Create New",
  description = "What would you like to add?",
  snapPoints = ["25%", "40%"],
  options,
  showFAB = true,
  fabIcon = "add",
  role,
  isOpen,
  onClose,
  onOptionSelected,
}: ChoiceModalProps) {
  const { colorScheme } = useColorScheme();
  const { user } = useUser();
  const { isSignedIn } = useAuth();
  const bottomSheetModalRef = React.useRef<BottomSheetModal>(null);
  
  const isDark = colorScheme === "dark";
  const isProUser =
    user?.publicMetadata?.subscription === "pro" ||
    user?.publicMetadata?.isPro === true;
  
  // Determine user role
  const getUserRole = (): "guest" | "user" | "pro" => {
    if (!isSignedIn) return "guest";
    if (isProUser) return "pro";
    return "user";
  };
  
  const currentRole = getUserRole();



  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleDismissModal = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
    onClose?.();
  }, [onClose]);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        onPress={handleDismissModal}
      />
    ),
    [handleDismissModal]
  );

  const handleOptionPress = useCallback(async (optionKey: string) => {
    bottomSheetModalRef.current?.dismiss();
    onOptionSelected?.(optionKey, currentRole);
  }, [currentRole, onOptionSelected]);

  // External control effect
  React.useEffect(() => {
    if (isOpen === true) {
      bottomSheetModalRef.current?.present();
    } else if (isOpen === false) {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [isOpen]);

  const currentTitle = getRoleValue(title, role);
  const currentDescription = getRoleValue(description, role);

  return (
    <>
      {showFAB && <FloatingActionButton onPress={handlePresentModalPress} />}

      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={1}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        backgroundStyle={{
          backgroundColor: isDark ? "#2C2C2E" : "#FFFFFF",
        }}
        handleIndicatorStyle={{
          backgroundColor: isDark ? "#8E8E93" : "#C6C6C8",
        }}
        onDismiss={onClose}
      >
        <BottomSheetView className="flex-1 px-5 pt-2">
          <Text
            className={`text-2xl font-semibold mb-1 ${
              isDark ? "text-white" : "text-black"
            }`}
          >
            {currentTitle}
          </Text>
          <Text
            className={`text-base mb-6 ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {currentDescription}
          </Text>

          <View className="gap-3">
            {options.map((option) => (
              <OptionButton
                key={option.optionKey}
                optionKey={option.optionKey}
                icon={option.icon}
                title={option.title}
                subtitle={option.subtitle}
                onPress={option.onPress}
                isDark={isDark}
                handleOptionPress={handleOptionPress}
                disabled={option.disabled}
                role={currentRole}
              />
            ))}
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
}
