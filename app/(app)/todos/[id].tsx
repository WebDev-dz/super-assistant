import React, { useMemo, useState } from 'react';
import { View, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Text } from '~/components/ui/text';
import { Button, buttonTextVariants } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Checkbox } from '~/components/ui/checkbox';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import { useHandlers } from '@/hooks/data-provider';
import { useColorScheme } from '@/lib/useColorScheme';
import TodoForm, { TodoFormSchema } from '@/components/TodoForm';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Task } from '@/lib/types';

type FormValues = {
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  milestoneId?: string;
};

export default function TodoDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const taskId = params.id ?? '';
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const { state, isLoading, error, updateTask, deleteTask } = useHandlers();
  const tasks = state.tasks ?? [];
  const milestones = state.milestones ?? [];

  const task: Task | undefined = useMemo(() => tasks.find((t) => t.id === taskId), [tasks, taskId]);

  const milestoneMap = useMemo(() => {
    const map: Record<string, string> = {};
    milestones.forEach((m) => { map[m.id] = m.title; });
    return map;
  }, [milestones]);

  const [editOpen, setEditOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(TodoFormSchema),
    defaultValues: task ? {
      title: task.title,
      description: task.description ?? '',
      priority: task.priority,
      milestoneId: task.milestoneId ?? undefined,
    } : { title: '', description: '', priority: 'low', milestoneId: undefined },
    values: task ? {
      title: task.title,
      description: task.description ?? '',
      priority: task.priority,
      milestoneId: task.milestoneId ?? undefined,
    } : undefined,
  });

  async function handleToggleComplete() {
    if (!task) return;
    try {
      await updateTask({ id: task.id, completed: !task.completed, updatedAt: Date.now() });
    } catch {
      Alert.alert('Error', 'Failed to update task');
    }
  }

  function handleDelete() {
    if (!task) return;
    Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteTask(task.id);
            router.back();
          } catch {
            Alert.alert('Error', 'Failed to delete task');
          }
        },
      },
    ]);
  }

  if (isLoading) {
    return (
      <View className={`flex-1 items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
        <ActivityIndicator />
        <Text className="mt-2 text-muted-foreground">Loading...</Text>
      </View>
    );
  }

  if (error || !task) {
    return (
      <View className={`flex-1 items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
        <Text className={isDark ? 'text-gray-300' : 'text-gray-700'}>Task not found</Text>
      </View>
    );
  }

  return (
    <ScrollView className={isDark ? 'bg-gray-900' : 'bg-white'} contentContainerStyle={{ padding: 16 }}>
      <Card className={isDark ? 'bg-gray-800' : 'bg-white'}>
        <CardHeader className="gap-3">
          <View className="flex-row items-center justify-between">
            <CardTitle className={isDark ? 'text-white' : 'text-gray-900'}>{task.title}</CardTitle>
            <Checkbox checked={task.completed} onCheckedChange={handleToggleComplete} />
          </View>
          <View className="flex-row items-center gap-2">
            <Text className="text-xs text-muted-foreground">Priority:</Text>
            <Text className="text-xs font-semibold capitalize">{task.priority}</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Text className="text-xs text-muted-foreground">Milestone:</Text>
            <Text className="text-xs">{task.milestoneId ? milestoneMap[task.milestoneId] : 'Unassigned'}</Text>
          </View>
        </CardHeader>
        <CardContent className="gap-3">
          {task.description ? (
            <Text className={isDark ? 'text-gray-300' : 'text-gray-700'}>{task.description}</Text>
          ) : (
            <Text className="text-muted-foreground">No description</Text>
          )}
          {task.dueDate && (
            <Text className={isDark ? 'text-gray-400' : 'text-gray-500'}>
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </Text>
          )}
        </CardContent>
      </Card>

      <View className="flex-row gap-3 mt-4">
        <Button onPress={() => setEditOpen(true)}>
          <Text className={buttonTextVariants({})}>Edit</Text>
        </Button>
        <Button variant="outline" onPress={handleToggleComplete}>
          <Text className={buttonTextVariants({ variant: 'outline' })}>{task.completed ? 'Mark Incomplete' : 'Mark Complete'}</Text>
        </Button>
        <Button variant="destructive" onPress={handleDelete}>
          <Text className={buttonTextVariants({ variant: 'destructive' })}>Delete</Text>
        </Button>
      </View>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>Update task details</DialogDescription>
          </DialogHeader>
          <TodoForm
            form={form}
            milestoneOptions={milestones.map((m) => ({ value: m.id, label: m.title }))}
            submitLabel="Save Changes"
            onSubmit={async (values) => {
              try {
                await updateTask({
                  id: task.id,
                  title: values.title,
                  description: values.description,
                  priority: values.priority as any,
                  milestoneId: (values.milestoneId ?? '') as any,
                  updatedAt: Date.now(),
                });
                setEditOpen(false);
              } catch {
                Alert.alert('Error', 'Failed to update task');
              }
            }}
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">
                <Text className={buttonTextVariants({ variant: 'ghost' })}>Cancel</Text>
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ScrollView>
  );
}


