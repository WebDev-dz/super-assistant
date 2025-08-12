import { MilestoneSchema } from "@/lib/validations";
import { TouchableOpacity, View, Text, Pressable } from "react-native";
import z from "zod";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button, buttonTextVariants } from "@/components/ui/button";











export const MileStoneCard = ({
    milestone,
    onPress,
    onLongPress,
    onDelete,
    onEdit,
    onComplete,
    onArchive,
}: {
    milestone: z.infer<typeof MilestoneSchema>;
    onPress: (milestone: z.infer<typeof MilestoneSchema>) => void;
    onLongPress?: (milestone: z.infer<typeof MilestoneSchema>) => void;
    onDelete?: (milestone: z.infer<typeof MilestoneSchema>) => void;
    onEdit?: (milestone: z.infer<typeof MilestoneSchema>) => void;
    onComplete?: (milestone: z.infer<typeof MilestoneSchema>) => void;
    onArchive?: (milestone: z.infer<typeof MilestoneSchema>) => void;
}) => {
    return (
        <Card>
            <Pressable
                onPress={() => onPress(milestone)}
                onLongPress={() => onLongPress?.(milestone)}


            >
                <CardHeader className="flex-row items-center justify-between">
                    <Text className="text-lg font-semibold">{milestone.title}</Text>
                    <Text className={`text-sm ${milestone.status === 'completed' ? 'text-green-500' : 'text-gray-500'}`}>
                        {milestone.status}
                    </Text>
                </CardHeader>
                <CardContent>
                    <Text className="text-card-foreground mt-1">{milestone.description}</Text>
                    <Text className="text-muted-foreground mt-2">Due: {new Date(milestone.deadline).toLocaleDateString()}</Text>
                </CardContent>
            </Pressable>
            <CardFooter className="flex-row justify-between items-center mt-2">
                <Button onPress={() => onEdit?.(milestone)}>
                    <Text className={buttonTextVariants({ variant: "ghost" })}>Edit</Text>
                </Button>
                <Button onPress={() => onComplete?.(milestone)}>
                    <Text className="text-green-500">Complete</Text>
                </Button>
            </CardFooter>
        </Card>
    );
}