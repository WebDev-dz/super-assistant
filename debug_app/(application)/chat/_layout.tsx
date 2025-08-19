// chat/_layout.tsx
import React, { useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { useColorScheme } from '@/lib/useColorScheme';
import { View, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { useRouter, usePathname } from 'expo-router';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { Separator } from '~/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Badge } from '~/components/ui/badge';
import { 
  MessageCircle, 
  Users, 
  Briefcase, 
  Dice6, 
  Plus, 
  Home,
  Menu,
  Edit3,
  Trash2,
  Check,
  X,
  MoreVertical
} from 'lucide-react-native';
import db from '@/db';
import { Chat, UIMessage } from '@ai-sdk/react';
import { id, UpdateParams } from '@instantdb/react-native';
import { AppSchema } from '@/instant.schema';
import { CreateCalendarEvent } from '../../../lib/validations';
import { useHandlers } from '@/hooks/data-provider';
import { SafeAreaView } from 'react-native-safe-area-context';

type ChatDb = {
    id: string;
    title: string;
    createdAt: string | number;
    userId: string;
    visibility: string;
    updatedAt?: string | number | undefined;
}


function CustomDrawerContent(props: any) {
  const router = useRouter();
  const pathname = usePathname();
  const { colorScheme } = useColorScheme();
  
  // State for managing rename functionality
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [showActions, setShowActions] = useState<string | null>(null);

  const { createChat, updateChat, deleteChat } = useHandlers();
  
  const isDark = colorScheme === 'dark';
  
  // Sample chat rooms - replace with your actual data
  const chatRooms = db.useQuery({
    chat: { 
      $: { 
        "order": {
          "updatedAt": "desc"
        } 
      } 
    }
  });



  const handleStartEdit = (room: Required<UpdateParams<AppSchema, "chat">>) => {
    setEditingChatId(room.id);
    setEditingName(room.title || '');
    setShowActions(null);
  };

  const handleSaveEdit = () => {
    if (editingChatId && editingName.trim()) {
      updateChat({ id: editingChatId, title: editingName.trim() });
      setEditingChatId(null);
      setEditingName('');
    }
  };

  const handleCancelEdit = () => {
    setEditingChatId(null);
    setEditingName('');
  };

  const handleDelete = (room: Required<UpdateParams<AppSchema, "chat">>) => {
    Alert.alert(
      'Delete Chat',
      `Are you sure you want to delete "${room.title}"? This action cannot be undone.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => setShowActions(null)
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteChat(room.id);
            setShowActions(null);
            // Navigate away if currently viewing the deleted chat
            if (pathname === `/chat/${room.id}`) {
              router.push('/chat');
            }
          }
        }
      ]
    );
  };


  const renderChatRoom = (room: ChatDb) => {
    const isActive = pathname === `/chat/${room.id}`;
    const isEditing = editingChatId === room.id;
    const showActionsForThis = showActions === room.id;
   
    return (
      <View key={room.id} className="mx-3 mb-2">
        <TouchableOpacity
          onPress={() => {
            if (!isEditing) {
              router.push(`/chat/details/${room.id}`);
              setShowActions(null);
            }
          }}
          onLongPress={() => setShowActions(showActionsForThis ? null : room.id)}
          className={`p-3 rounded-lg flex-row items-center ${
            isActive 
              ? 'bg-primary/10 border border-primary/20' 
              : 'hover:bg-muted/50'
          }`}
        >
          <View className="flex-1">
            <View className="flex-row items-center justify-between">
              {isEditing ? (
                <View className="flex-1 flex-row items-center">
                  <TextInput
                    value={editingName}
                    onChangeText={setEditingName}
                    className={`flex-1 px-2 py-1 text-base font-medium border rounded ${
                      isDark 
                        ? 'bg-muted border-border text-foreground' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    autoFocus
                    selectTextOnFocus
                    onSubmitEditing={handleSaveEdit}
                    maxLength={50}
                  />
                  <TouchableOpacity
                    onPress={handleSaveEdit}
                    className="ml-2 p-1 bg-primary rounded"
                  >
                    <Check size={16} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleCancelEdit}
                    className="ml-1 p-1 bg-muted rounded"
                  >
                    <X size={16} className="text-muted-foreground" />
                  </TouchableOpacity>
                </View>
              ) : (
                <>
                  <Text className={`font-medium flex-1 ${isActive ? 'text-primary' : ''}`}>
                    {room.title}
                  </Text>
                  <View className="flex-row items-center">
                    
                    <TouchableOpacity
                      onPress={() => setShowActions(showActionsForThis ? null : room.id)}
                      className="ml-2 p-1"
                    >
                      <MoreVertical size={16} className="text-muted-foreground" />
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
            {!isEditing && (
              <Text className="text-xs text-muted-foreground mt-1">
                { new Date(room?.updatedAt || 0).toLocaleString()}
              </Text>
            )}
          </View>
        </TouchableOpacity>
        
        {/* Action Buttons */}
        {showActionsForThis && !isEditing && (
          <View className="flex-row justify-end mt-2 space-x-2">
            <TouchableOpacity
              onPress={() => handleStartEdit(room as any)}
              className="flex-row items-center px-3 py-2 bg-muted rounded-lg"
            >
              <Edit3 size={14} className="text-muted-foreground mr-1" />
              <Text className="text-sm text-muted-foreground">Rename</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => handleDelete(room as any)}
              className="flex-row items-center px-3 py-2 bg-destructive/10 rounded-lg"
            >
              <Trash2 size={14} className="text-destructive mr-1" />
              <Text className="text-sm text-destructive">Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <View className={`flex-1 ${isDark ? 'bg-background' : 'bg-white'}`}>
      {/* Header */}
      <View className="pt-12 pb-4 px-4 bg-card border-b border-border">
        <Text className="text-2xl font-bold text-foreground mb-2">
          Chat Rooms
        </Text>
        <Text className="text-sm text-muted-foreground">
          {chatRooms?.data?.chat?.length || 0} active conversations
        </Text>
      </View>

      {/* Chat Rooms List */}
      <DrawerContentScrollView 
        {...props} 
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        <View className="py-4">
          {chatRooms?.data?.chat?.map(renderChatRoom) || []}
        </View>
        
        <Separator className="mx-3 my-4" />
        
        {/* Actions */}
        <View className="px-3 pb-4">
          <Button
            variant="outline"
            onPress={() => {
              createChat({
                id: id(),
                title: "New Chat",
                userId: "1",
                
              });
              setShowActions(null);
              setEditingChatId(null);
            }}
            className="flex-row items-center justify-center mb-3"
          >
            <Plus size={16} className="text-foreground mr-2" />
            <Text className="font-medium">New Chat</Text>
          </Button>
          
          <Button
            variant="ghost"
            onPress={() => {
              // router.push('/chat/settings');
              setShowActions(null);
              setEditingChatId(null);
            }}
            className="flex-row items-center justify-center"
          >
            <Text className="text-muted-foreground">Chat Settings</Text>
          </Button>
        </View>
      </DrawerContentScrollView>
    </View>
  );
}

export default function ChatLayout() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    
    <GestureHandlerRootView style={{ flex: 1 }}>
      
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          drawerStyle: {
            backgroundColor: isDark ? '#09090b' : '#ffffff',
            width: 320,
            borderRightWidth: 1,
            borderRightColor: isDark ? '#27272a' : '#e4e4e7',
          },
          headerStyle: {
            backgroundColor: isDark ? '#09090b' : '#ffffff',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: isDark ? '#27272a' : '#e4e4e7',
          },
          headerTintColor: isDark ? '#ffffff' : '#000000',
          headerTitle: 'Chat',
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '600',
          },
          drawerActiveTintColor: '#3b82f6',
          drawerInactiveTintColor: isDark ? '#71717a' : '#52525b',
          headerLeft: () => null, // Remove default back button since drawer handles it
        }}
      >
       
        
        {/* Dynamic chat room routes */}
        <Drawer.Screen 
          name="/details/" 
          options={{ 
            headerShown: false
            
          }} 
        />
        
        {/* New chat screen */}
        <Drawer.Screen 
          name="new" 
          options={{ 
            headerShown: false
            
          }} 
        />
        
        {/* Settings screen */}
        <Drawer.Screen 
          name="settings" 
          options={{ 
            headerShown: false
            
          }}  
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}