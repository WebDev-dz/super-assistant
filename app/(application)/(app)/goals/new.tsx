import React, { useState, type ComponentType } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import {
  ChevronLeft,
  Camera,
  Edit3,
  Calendar,
  Bell,
  Info,
  Plus,
  Image,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';

// Using shared Input/Textarea instead of local input field

// Small pill button (Category / Due date / Reminder)
type PillButtonProps = {
  icon: ComponentType<{ size?: number; color?: string }> | null;
  label: string;
  onPress: () => void;
  active?: boolean;
};

const PillButton = ({ icon: Icon, label, onPress, active = false }: PillButtonProps) => (
  <TouchableOpacity
    onPress={onPress}
    className={`flex-row items-center rounded-full px-3 py-2 mr-2 mb-2 border ${
      active ? 'bg-gray-100 border-gray-300' : 'bg-white border-gray-200'
    }`}
  >
    {Icon ? <Icon size={16} color="#6B7280" /> : null}
    <Text className="ml-2 text-sm text-gray-700">{label}</Text>
  </TouchableOpacity>
);

// Button usage will replace the previous AddCard component

export default function NewGoalScreen() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [dueDate, setDueDate] = useState<string | null>(null);
  const [reminder, setReminder] = useState<string | null>(null);
  const [note, setNote] = useState('');

  const onPickImage = () => Alert.alert('Image', 'Image picker would open here');
  const onEditTitle = () => Alert.alert('Edit', 'Inline title edit');
  const onSelectCategory = () => Alert.alert('Category', 'Open category selector');
  const onSelectDueDate = () => setDueDate(dueDate ? null : 'No due date');
  const onSetReminder = () => setReminder(reminder ? null : 'Set reminder');
  const onAddHabit = () => Alert.alert('Habit', 'Add Habit flow');
  const onAddTask = () => Alert.alert('Task', 'Add Task flow');

  const onCreate = () => {
    if (!title.trim()) {
      Alert.alert('Missing title', 'Please add a goal title');
      return;
    }
    const payload = { title, category, dueDate, reminder, note };
    console.log('Create Goal:', payload);
    Alert.alert('Success', 'Goal created!');
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4">
        <TouchableOpacity onPress={() => router.back()} className="p-2 rounded-full">
          <ChevronLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-gray-900">Self-made Goals</Text>
        <View className="w-6" />
      </View>

      <View className="flex-1">
        <View className="px-6">
          {/* Image placeholder */}
          <View className="items-center mt-4 mb-6">
            <View className="w-28 h-28 rounded-2xl bg-gray-200 items-center justify-center">
              <Image size={36} color="#9CA3AF" />
            </View>
            <TouchableOpacity
              onPress={onPickImage}
              className="w-10 h-10 rounded-full bg-orange-500 items-center justify-center -mt-5 self-end mr-8 shadow"
              activeOpacity={0.9}
            >
              <Camera size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Title */}
          <View className="mb-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-gray-400 text-xl font-semibold">Add a Goals Title</Text>
              <TouchableOpacity onPress={onEditTitle} className="p-2">
                <Edit3 size={18} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Controls: Category / No due date / Set reminder */}
          <View className="flex-row flex-wrap mb-4">
            <PillButton icon={null} label={category || 'Category'} onPress={onSelectCategory} />
            <PillButton icon={Calendar} label={dueDate || 'No due date'} onPress={onSelectDueDate} />
            <PillButton icon={Bell} label={reminder || 'Set reminder'} onPress={onSetReminder} />
          </View>

          {/* Title input (editable) */}
          <Input
            value={title}
            onChangeText={setTitle}
            placeholder="Add a Goals Title"
            appearance="soft"
            largePlaceholder
            className="text-lg"
          />

          {/* Habit Section */}
          <View className="mb-6">
            <View className="flex-row items-center mb-3">
              <Text className="text-gray-900 font-semibold text-base">Habit (0)</Text>
              <Info size={14} color="#9CA3AF" className="ml-2" />
            </View>
            <Button
              variant="outline"
              className="rounded-2xl py-4 border-orange-200 bg-orange-50"
              leftIcon={Plus}
              iconColor="#EA580C"
              onPress={onAddHabit}
            >
              <Text className="text-orange-700 font-medium">Add Habit</Text>
            </Button>
          </View>

          {/* Task Section */}
          <View className="mb-6">
            <View className="flex-row items-center mb-3">
              <Text className="text-gray-900 dark:text-white font-semibold text-base">Task (0)</Text>
              <Info size={14} color="#9CA3AF" className="ml-2" />
            </View>
            <Button
              variant="outline"
              className="rounded-2xl py-4 border-orange-200 bg-orange-50"
              leftIcon={Plus}
              iconColor="#EA580C"
              onPress={onAddTask}
            >
              <Text className="text-orange-700 font-medium">Add Task</Text>
            </Button>
          </View>

          {/* Note Section */}
          <View className="mb-6">
            <Text className="text-gray-900 dark:text-white font-semibold text-base mb-2">Note</Text>
            <Textarea
              value={note}
              onChangeText={setNote}
              placeholder="Add your note..."
              numberOfLines={6}
              appearance="soft"
              largePlaceholder
            />
          </View>
        </View>
      </View>

      {/* Bottom Button */}
      <View className="px-6 pb-8 pt-2">
        <TouchableOpacity
          onPress={onCreate}
          className="bg-orange-600 rounded-full py-4 items-center justify-center"
          activeOpacity={0.85}
        >
          <Text className="text-white text-base font-semibold">Create Goals</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}


