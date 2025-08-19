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
  BottomSheetFooter,
  BottomSheetHeader,
  BottomSheetView,
  BottomSheetScrollView,
  useBottomSheet,
} from "~/components/deprecated-ui/bottom-sheet";
import { useColorScheme } from "@/lib/useColorScheme";
import { useHandlers } from "@/hooks/data-provider";
import { Ionicons } from "@expo/vector-icons";
import type { Todo } from "@/lib/types";
import TodoForm from "../forms/TodoForm";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateTaskSchema } from "@/lib/validations";
import { defaultTask } from "@/lib/constants";
import { safeParse } from "zod";
import { getPriorityColor } from "@/lib/utils";
import { id, UpdateParams } from "@instantdb/react-native";
import { AppSchema } from "@/instant.schema";
import { useSharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface TodoDetailsModalProps {
  task: Todo | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (task: Todo) => Promise<void>;
  onCreate?: (task: Todo) => Promise<void>;
  mode: 'create' | 'update';
  milestoneMap: Record<string, string>;
  milestoneId?: string; // Required when creating a new task for a specific milestone
}

export default function TodoDetailsModal({
  task,
  isOpen,
  onClose,
  onEdit,
  onCreate,
  mode,
  milestoneMap,
  milestoneId
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
  const insets = useSafeAreaInsets();

  const animatedFooterPosition = useSharedValue(0); // Initialize shared value for footer position
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
    console.log({ ...safeParse(CreateTaskSchema, task) });
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

  const handleSubmit = async (values: Todo) => {
    try {
      if (mode === 'create') {
        const taskData = {
          ...values,
          id: id(),
          dueDate: new Date(values.dueDate || ""),
          createdAt: new Date(),
          updatedAt: new Date(),
          completed: false,
          hasAlarm: false,
          milestoneId: milestoneId || '',
        };

        const result = await createTask(taskData);
        if (result) {
          onCreate?.(result);
          onClose();
        }
      } else if (task) {
        const updatedData = {
          ...values,
          id: task.id,
          updatedAt: new Date().toISOString(),
        };

        await updateTask(updatedData as UpdateParams<AppSchema, "tasks">);
        await onEdit?.(task);
        onClose();
      }
    } catch (error) {
      Alert.alert(
        'Error',
        mode === 'create' ? 'Failed to create task' : 'Failed to update task'
      );
    }
  };

  if (!task) return null;




  return (
    <BottomSheet>
      <BottomSheetContent
        ref={ref}
        snapPoints={["70%"]}
        enablePanDownToClose={true}
        onDismiss={onClose}
        // enableDynamicSizing={true}

      >
        <BottomSheetHeader>
          <Text
            className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
          >
            {mode === 'create' ? 'Create Task' : 'Task Details'}
          </Text>
          <BottomSheetCloseTrigger />
        </BottomSheetHeader>

        <BottomSheetScrollView className="gap-4 flex-1">
          <Card className={isDark ? "bg-gray-800" : "bg-white"}>
            <CardContent className="gap-3 mt-6">
              <TodoForm
                form={form}
                milestoneOptions={milestones.map((m) => ({
                  value: m.id,
                  label: m.title,
                }))}
                submitLabel="Save Changes"
                onSubmit={handleSubmit}
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
            </CardContent>
          </Card>

        </BottomSheetScrollView>

      </BottomSheetContent>
    </BottomSheet>
  );
}