import React from "react";
import { View, Image, ImageSourcePropType } from "react-native";
import { Text } from "./text";

type EmptyStateProps = {
  title: string;
  description?: string;
  /** Optional illustration or any React node (e.g., Lottie, custom component) */
  illustration?: React.ReactNode | { source: ImageSourcePropType; size?: number };
  /** Extra content below description (e.g., actions) */
  children?: React.ReactNode;
  className?: string;
};

export function EmptyState({
  title,
  description,
  illustration,
  children,
  className,
}: EmptyStateProps) {
  const renderIllustration = () => {
    if (!illustration) return null;
    if (React.isValidElement(illustration)) return illustration;
    const img = illustration as { source: ImageSourcePropType; size?: number };
    const size = img.size ?? 112; // 28 * 4
    return (
      <Image
        source={img.source}
        style={{ width: size, height: size, resizeMode: "contain", opacity: 0.95 }}
      />
    );
  };

  return (
    <View className={`items-center justify-center px-6 ${className ?? ""}`}>
      <View className="mb-5 opacity-90">{renderIllustration()}</View>
      <Text className="text-xl font-semibold text-foreground/90 mb-2 text-center">
        {title}
      </Text>
      {description ? (
        <Text className="text-center text-muted-foreground mb-4">
          {description}
        </Text>
      ) : null}
      {children}
    </View>
  );
}

export default EmptyState;



