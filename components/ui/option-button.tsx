import { Ionicons } from "@expo/vector-icons";
import { Pressable, View, Text } from "react-native";

export type OptionButtonProps = {
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
  isDark: boolean;
  disabled?: boolean | { guest: boolean; user: boolean; pro: boolean };
  optionKey: string; // Unique identifier for the option
  handleOptionPress?: (optionKey: string) => void;
  role: "guest" | "user" | "pro";
};
export function getRoleValue <T>(value: T | { guest: T; user: T; pro: T }, role: "guest" | "user" | "pro"): T {
    if (typeof value === 'object' && value !== null && 'guest' in value) {
      return value[role];
    }
    return value as T;
  };
export function OptionButton({
    icon,
    title,
    subtitle,
    onPress,
    isDark,
    disabled = false,
    optionKey,
    handleOptionPress,
    role
  }: OptionButtonProps) {
    // Helper function to get role-specific value
    
  
    // Extract role-specific values
    const currentIcon = getRoleValue(icon, role);
    const currentTitle = getRoleValue(title, role);
    const currentSubtitle = getRoleValue(subtitle ,role);
    const currentDisabled = getRoleValue(disabled, role);
    const currentOnPress = getRoleValue(onPress, role);
  
    // Determine if this is a pro feature
    const isPro = role === 'pro' || (
      typeof title === 'object' && 'pro' in title && 
      typeof icon === 'object' && 'pro' in icon
    );
  
    const handlePress = () => {
      if (!currentDisabled && currentOnPress) {
        currentOnPress(optionKey);
        handleOptionPress?.(optionKey);
      }
    };
  
    return (
      <Pressable
        onPress={currentDisabled ? undefined : handlePress}
        className={`flex-row items-center p-4 rounded-xl min-h-[60px] ${
          isDark ? 'bg-neutral-800' : 'bg-gray-100'
        } ${currentDisabled ? 'opacity-50' : 'active:opacity-70'}`}
        android_ripple={
          currentDisabled 
            ? undefined 
            : { color: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }
        }
      >
        <View className="w-10">
          <Ionicons
            name={currentIcon as any}
            size={24}
            color={
              currentDisabled 
                ? (isDark ? '#4D4D4F' : '#C6C6C8') 
                : '#007AFF'
            }
          />
        </View>
        
        <View className="flex-1 ml-3">
          <View className="flex-row items-center gap-2">
            <Text className={`text-base font-medium ${
              currentDisabled
                ? (isDark ? 'text-gray-600' : 'text-gray-400')
                : (isDark ? 'text-white' : 'text-black')
            }`}>
              {currentTitle}
            </Text>
            {isPro && (
              <View className="bg-orange-500 px-1.5 py-0.5 rounded">
                <Text className="text-white text-xs font-semibold">PRO</Text>
              </View>
            )}
          </View>
          
          <Text className={`text-sm mt-0.5 ${
            currentDisabled
              ? (isDark ? 'text-gray-600' : 'text-gray-400')
              : (isDark ? 'text-gray-400' : 'text-gray-600')
          }`}>
            {currentSubtitle}
          </Text>
        </View>
        
        <Ionicons
          name="chevron-forward"
          size={16}
          color={
            currentDisabled 
              ? (isDark ? '#4D4D4F' : '#C6C6C8') 
              : (isDark ? '#8E8E93' : '#C6C6C8')
          }
        />
      </Pressable>
    );
  }