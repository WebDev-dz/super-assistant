import React, { useEffect } from "react";
import { View, Alert } from "react-native";
import { Text } from "~/components/ui/text";
import { Button, buttonTextVariants } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import {
  BottomSheet,
  BottomSheetCloseTrigger,
  BottomSheetContent,
  BottomSheetHeader,
  BottomSheetView,
  useBottomSheet,
} from "~/components/deprecated-ui/bottom-sheet";
import { useColorScheme } from "@/lib/useColorScheme";
import { useHandlers } from "@/hooks/data-provider";
import { Ionicons } from "@expo/vector-icons";
import type { Task } from "@/lib/types";
import TodoForm from "../forms/TodoForm";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { CreateTaskSchema } from "@/lib/validations";
import { defaultTask } from "@/lib/constants";
import { safeParse } from "zod";
import { getPriorityColor } from "@/lib/utils";

interface TodoDetailsModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (task: Task) => Promise<void>;
  milestoneMap: Record<string, string>;
}

export default function TodoDetailsModal({
  task,
  isOpen,
  onClose,
  onEdit,
  milestoneMap,
}: TodoDetailsModalProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const {
    updateTask,
    deleteTask,
    createTask,
    state: { milestones },
  } = useHandlers();
  const { ref, open, close } = useBottomSheet();

  const form = useForm({
    // @ts-ignore
    resolver: zodResolver(CreateTaskSchema),
    // @ts-ignore
    defaultValues: task ?? defaultTask
  });

  React.useEffect(() => {
    if (isOpen && task) {
      open();
    } else {
      close();
    }
  }, [isOpen, task, open, close]);

  useEffect(() => {
    console.log({...safeParse(CreateTaskSchema, task)});
  }, [task]);

  
  

  const handleToggleComplete = async () => {
    try {
      await updateTask({
        id: task?.id!,
        completed: !task?.completed!,
        updatedAt: Date.now(),
      });
    } catch {
      Alert.alert("Error", "Failed to update task");
    }
  };
  
  const handleDelete = () => {
    Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteTask(task?.id!);
            onClose();
          } catch {
            Alert.alert("Error", "Failed to delete task");
          }
        },
      },
    ]);
  };

 
  
  if (!task) return null;
  return (
    <BottomSheet>
      <BottomSheetContent
        ref={ref}
        snapPoints={["60%", "90%"]}
        enablePanDownToClose={true}
        onDismiss={onClose}
      >
        <BottomSheetHeader>
          <Text
            className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
          >
            Task Details
          </Text>
          <BottomSheetCloseTrigger />
        </BottomSheetHeader>

        <BottomSheetScrollView  className="gap-4">
          {/* Task Header */}
          

          {/* Additional Details */}
          <Card className={isDark ? "bg-gray-800" : "bg-white"}>
           
            <CardContent className="gap-3 mt-6">
              <TodoForm
                form={form}
                milestoneOptions={milestones.map((m) => ({
                  value: m.id,
                  label: m.title,
                }))}
                submitLabel="Save Changes"
                onSubmit={async (values) => {
                  await createTask({
                    id: task.id,
                    title: values.title,
                    description: values.description,
                    priority: values.priority as any,
                    milestoneId: (values.milestoneId ?? "") as any,
                    updatedAt: Date.now(),
                  });
                  // setEditOpen(false);
                }}
              />

              {task.milestoneId && (
                <View className="flex-row items-center gap-2">
                  <Ionicons
                    name="flag-outline"
                    size={16}
                    color={isDark ? "#9CA3AF" : "#6B7280"}
                  />
                  <Text
                    className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}
                  >
                    Milestone: {milestoneMap[task.milestoneId] || "Unknown"}
                  </Text>
                </View>
              )}

              <View className="flex-row items-center gap-2">
                <Ionicons
                  name="time-outline"
                  size={16}
                  color={isDark ? "#9CA3AF" : "#6B7280"}
                />
                <Text
                  className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}
                >
                  Created: {new Date(task.createdAt).toLocaleDateString()}
                </Text>
              </View>

              {task.updatedAt && task.updatedAt !== task.createdAt && (
                <View className="flex-row items-center gap-2">
                  <Ionicons
                    name="refresh-outline"
                    size={16}
                    color={isDark ? "#9CA3AF" : "#6B7280"}
                  />
                  <Text
                    className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}
                  >
                    Updated: {new Date(task.updatedAt).toLocaleDateString()}
                  </Text>
                </View>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          {/*                 
          <View className="flex-row gap-3 pt-4">
            <Button
              variant="outline"
              onPress={() => onEdit(task).then(() => onClose())}
              className="flex-1"
            >
              <Text className={buttonTextVariants({ variant: "outline" })}>
                Edit
              </Text>
            </Button>

            <Button
              variant="outline"
              onPress={handleToggleComplete}
              className="flex-1"
            >
              <Text className={buttonTextVariants({ variant: "outline" })}>
                {task.completed ? "Mark Incomplete" : "Mark Complete"}
              </Text>
            </Button>

            <Button
              variant="destructive"
              onPress={handleDelete}
              className="flex-1"
            >
              <Text className={buttonTextVariants({ variant: "destructive" })}>
                Delete
              </Text>
            </Button>
          </View>
          */}
        </BottomSheetScrollView>
      </BottomSheetContent>
    </BottomSheet>
  );
}
