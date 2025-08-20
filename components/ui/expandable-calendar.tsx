import * as React from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, useDerivedValue, useSharedValue, withTiming } from 'react-native-reanimated';

type ExpandableCalendarProps = {
  expanded: boolean;
  duration?: number;
  className?: string;
  collapsedClassName?: string;
  expandedClassName?: string;
  collapsedContent: React.ReactNode; // week view
  expandedContent: React.ReactNode; // month view
};

export default function ExpandableCalendarContainer({
  expanded,
  duration = 250,
  className,
  collapsedClassName,
  expandedClassName,
  collapsedContent,
  expandedContent
}: ExpandableCalendarProps) {
  const collapsedHeight = useSharedValue(0);
  const expandedHeight = useSharedValue(0);
  const progress = useSharedValue(expanded ? 1 : 0);

  React.useEffect(() => {
    progress.value = withTiming(expanded ? 1 : 0, { duration });
  }, [expanded, duration]);

  const animatedHeight = useDerivedValue(() => {
    const target = progress.value > 0.5 ? expandedHeight.value : collapsedHeight.value;
    return withTiming(target, { duration });
  });

  const containerStyle = useAnimatedStyle(() => ({
    height: animatedHeight.value,
  }));

  const collapsedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(1 - progress.value, { duration: Math.max(1, Math.floor(duration * 0.6)) }),
  }));

  const expandedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(progress.value, { duration: Math.max(1, Math.floor(duration * 0.6)) }),
  }));

  return (
    <Animated.View style={containerStyle} className={`w-full overflow-hidden ${className ?? ''}`}>
      <Animated.View
        style={collapsedStyle}
        className={`absolute w-full items-center ${collapsedClassName ?? ''}`}
        pointerEvents={expanded ? 'none' : 'auto'}
      >
        <View
          onLayout={(e) => {
            collapsedHeight.value = e.nativeEvent.layout.height;
          }}
          className="w-full"
        >
          {collapsedContent}
        </View>
      </Animated.View>

      <Animated.View
        style={expandedStyle}
        className={`absolute w-full items-center ${expandedClassName ?? ''}`}
        pointerEvents={expanded ? 'auto' : 'none'}
      >
        <View
          onLayout={(e) => {
            expandedHeight.value = e.nativeEvent.layout.height;
          }}
          className="w-full"
        >
          {expandedContent}
        </View>
      </Animated.View>
    </Animated.View>
  );
}


