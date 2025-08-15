import { MilestoneSchema } from "@/lib/validations";
import { View, Text, Pressable } from "react-native";
import z from "zod";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button, buttonTextVariants } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const getStatusStyle = (status: z.infer<typeof MilestoneSchema>['status']) => {
  switch (status) {
    case 'completed':
      return 'bg-green-500/20 border border-green-500/30';
    case 'in_progress':
      return 'bg-blue-500/20 border border-blue-500/30';
    case 'on_hold':
      return 'bg-yellow-500/20 border border-yellow-500/30';
    case 'cancelled':
      return 'bg-red-500/20 border border-red-500/30';
    default:
      return 'bg-gray-500/20 border border-gray-500/30';
  }
};

const getStatusTextStyle = (status: z.infer<typeof MilestoneSchema>['status']) => {
  switch (status) {
    case 'completed':
      return 'text-green-600 dark:text-green-400';
    case 'in_progress':
      return 'text-blue-600 dark:text-blue-400';
    case 'on_hold':
      return 'text-yellow-600 dark:text-yellow-400';
    case 'cancelled':
      return 'text-red-600 dark:text-red-400';
    default:
      return 'text-gray-600 dark:text-gray-400';
  }
};

const getPriorityStyle = (priority: z.infer<typeof MilestoneSchema>['priority']) => {
  switch (priority) {
    case 'urgent':
      return 'bg-red-500/20 border border-red-500/30';
    case 'high':
      return 'bg-orange-500/20 border border-orange-500/30';
    case 'medium':
      return 'bg-yellow-500/20 border border-yellow-500/30';
    case 'low':
      return 'bg-green-500/20 border border-green-500/30';
  }
};

const getPriorityTextStyle = (priority: z.infer<typeof MilestoneSchema>['priority']) => {
  switch (priority) {
    case 'urgent':
      return 'text-red-600 dark:text-red-400';
    case 'high':
      return 'text-orange-600 dark:text-orange-400';
    case 'medium':
      return 'text-yellow-600 dark:text-yellow-400';
    case 'low':
      return 'text-green-600 dark:text-green-400';
  }
};

export const MileStoneCard = ({
    milestone,
    onPress,
    onLongPress,
    onDelete,
    onEdit,
    onComplete,
    onArchive,
    compact = false,
    showActions = true,
}: {
    milestone: z.infer<typeof MilestoneSchema>;
    onPress: (milestone: z.infer<typeof MilestoneSchema>) => void;
    onLongPress?: (milestone: z.infer<typeof MilestoneSchema>) => void;
    onDelete?: (milestone: z.infer<typeof MilestoneSchema>) => void;
    onEdit?: (milestone: z.infer<typeof MilestoneSchema>) => void;
    onComplete?: (milestone: z.infer<typeof MilestoneSchema>) => void;
    onArchive?: (milestone: z.infer<typeof MilestoneSchema>) => void;
    compact?: boolean;
    showActions?: boolean;
}) => {
    return (
        <Card>
            <Pressable
                onPress={() => onPress(milestone)}
                onLongPress={() => onLongPress?.(milestone)}
                className="p-4"
            >
                <View className="flex-row justify-between items-start mb-2">
                    <Text className="text-lg font-semibold text-foreground flex-1 mr-2">
                        {milestone.title}
                    </Text>
                    
                    <View className="flex-row gap-2">
                        <View className={`rounded-full px-2 py-1 ${getStatusStyle(milestone.status)}`}>
                            <Text className={`text-xs font-medium ${getStatusTextStyle(milestone.status)}`}>
                                {milestone.status.replace('_', ' ')}
                            </Text>
                        </View>
                        
                        <View className={`rounded-full px-2 py-1 ${getPriorityStyle(milestone.priority)}`}>
                            <Text className={`text-xs font-medium ${getPriorityTextStyle(milestone.priority)}`}>
                                {milestone.priority}
                            </Text>
                        </View>
                    </View>
                </View>

                {!compact && milestone.description && (
                    <Text className="text-muted-foreground mb-3" numberOfLines={2}>
                        {milestone.description}
                    </Text>
                )}

                <View className="mb-3">
                    <Progress value={milestone.percentage} />
                    <Text className="text-xs text-muted-foreground mt-1">
                        {milestone.percentage}% Complete
                    </Text>
                </View>

                <View className="flex-row justify-between items-center">
                    <Text className="text-sm text-muted-foreground">
                        Due: {new Date(milestone.deadline).toLocaleDateString()}
                    </Text>
                    {!compact && milestone.estimatedHours && (
                        <Text className="text-sm text-muted-foreground">
                            {milestone.actualHours ?? 0}/{milestone.estimatedHours}h
                        </Text>
                    )}
                </View>
            </Pressable>
            {showActions && (
                <CardFooter className="flex-row justify-between items-center mt-2 p-4">
                    <Button variant="ghost" onPress={() => onEdit?.(milestone)}>
                        <Text className={buttonTextVariants({ variant: "ghost" })}>Edit</Text>
                    </Button>
                    <Button variant="ghost" onPress={() => onDelete?.(milestone)}>
                        <Text className={buttonTextVariants({ variant: "ghost", className: "text-red-500" })}>Delete</Text>
                    </Button>
                    <Button variant="ghost" onPress={() => onComplete?.(milestone)}>
                        <Text className={buttonTextVariants({ variant: "ghost", className: "text-green-500" })}>Complete</Text>
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
}