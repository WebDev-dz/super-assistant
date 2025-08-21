import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { X, Calendar, Clock } from 'lucide-react-native';

// Reusable Input Component
const InputField = ({ label, value, onChangeText, placeholder, multiline = false, numberOfLines = 1 }) => (
  <View className="mb-6">
    <Text className="text-gray-800 text-base font-medium mb-3">
      {label}
    </Text>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#9CA3AF"
      multiline={multiline}
      numberOfLines={numberOfLines}
      className={`bg-gray-50 border border-gray-200 rounded-xl px-4 text-gray-800 text-base ${
        multiline ? 'py-4 min-h-[100px]' : 'py-4'
      }`}
      style={{
        textAlignVertical: multiline ? 'top' : 'center',
      }}
    />
  </View>
);

// Reusable Selection Field Component
const SelectionField = ({ label, value, onPress, icon: Icon, hasValue }) => (
  <View className="mb-6">
    <Text className="text-gray-800 text-base font-medium mb-3">
      {label}
    </Text>
    <TouchableOpacity
      onPress={onPress}
      className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 flex-row items-center justify-between"
    >
      <View className="flex-row items-center">
        <Icon 
          size={20} 
          color={hasValue ? "#374151" : "#9CA3AF"} 
          className="mr-3"
        />
        <Text className={`text-base ${hasValue ? 'text-gray-800' : 'text-gray-400'}`}>
          {value}
        </Text>
      </View>
      {hasValue && (
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            // Handle clear action
            onPress(null);
          }}
          className="p-1"
        >
          <X size={16} color="#9CA3AF" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  </View>
);

// Main Add Task Component
const AddTaskScreen = ({ navigation }) => {
  const [taskTitle, setTaskTitle] = useState('Explore design style on Dribbble');
  const [dueDate, setDueDate] = useState('January 31, 2025');
  const [reminder, setReminder] = useState('21:00 PM');
  const [note, setNote] = useState('Explore style & build my own niche');

  const handleDatePress = () => {
    // In a real app, you would open a date picker here
    Alert.alert('Date Picker', 'Date picker would open here');
  };

  const handleReminderPress = () => {
    // In a real app, you would open a time picker here
    Alert.alert('Time Picker', 'Time picker would open here');
  };

  const handleClearDate = () => {
    setDueDate('');
  };

  const handleClearReminder = () => {
    setReminder('');
  };

  const handleAddTask = () => {
    if (!taskTitle.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }
    
    const taskData = {
      title: taskTitle,
      dueDate: dueDate,
      reminder: reminder,
      note: note,
    };
    
    console.log('Adding task:', taskData);
    Alert.alert('Success', 'Task added successfully!');
    
    // In a real app, you would save the task and navigate back
    // navigation.goBack();
  };

  const handleClose = () => {
    // In a real app, you would navigate back
    Alert.alert('Close', 'Would navigate back');
    // navigation.goBack();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-100">
        <TouchableOpacity onPress={handleClose} className="p-2">
          <X size={24} color="#374151" />
        </TouchableOpacity>
        
        <Text className="text-xl font-semibold text-gray-900">
          Add Task
        </Text>
        
        <View className="w-8" />
      </View>

      {/* Form Content */}
      <View className="flex-1 px-6 pt-8">
        <InputField
          label="Task Title"
          value={taskTitle}
          onChangeText={setTaskTitle}
          placeholder="Enter task title"
        />

        <SelectionField
          label="Task Due Date"
          value={dueDate || 'Select date'}
          onPress={dueDate ? handleClearDate : handleDatePress}
          icon={Calendar}
          hasValue={!!dueDate}
        />

        <SelectionField
          label="Task Reminder"
          value={reminder || 'Set reminder'}
          onPress={reminder ? handleClearReminder : handleReminderPress}
          icon={Clock}
          hasValue={!!reminder}
        />

        <InputField
          label="Note"
          value={note}
          onChangeText={setNote}
          placeholder="Add a note..."
          multiline={true}
          numberOfLines={4}
        />
      </View>

      {/* Add Task Button */}
      <View className="px-6 pb-8 pt-4">
        <TouchableOpacity
          onPress={handleAddTask}
          className="bg-orange-500 rounded-full py-4 items-center justify-center shadow-lg"
          activeOpacity={0.8}
        >
          <Text className="text-white text-lg font-semibold">
            Add Task
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AddTaskScreen;