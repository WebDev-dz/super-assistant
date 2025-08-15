// chat/_layout.tsx
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { useColorScheme } from '@/lib/useColorScheme';
import { View, TouchableOpacity } from 'react-native';
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
  Menu 
} from 'lucide-react-native';

// Custom Drawer Content Component
function CustomDrawerContent(props: any) {
  const router = useRouter();
  const pathname = usePathname();
  const { colorScheme } = useColorScheme();
  
  const isDark = colorScheme === 'dark';
  
  // Sample chat rooms - replace with your actual data
  const chatRooms = [
    { 
      id: '1', 
      name: 'General Chat', 
      icon: MessageCircle, 
      unreadCount: 3,
      lastActive: '2 min ago',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    { 
      id: '2', 
      name: 'Team Discussion', 
      icon: Users, 
      unreadCount: 0,
      lastActive: '1 hour ago',
      avatar: null
    },
    { 
      id: '3', 
      name: 'Project Alpha', 
      icon: Briefcase, 
      unreadCount: 7,
      lastActive: '5 min ago',
      avatar: null
    },
    { 
      id: '4', 
      name: 'Random', 
      icon: Dice6, 
      unreadCount: 1,
      lastActive: '30 min ago',
      avatar: null
    },
  ];

  const renderChatRoom = (room: any) => {
    const IconComponent = room.icon;
    const isActive = pathname === `/chat/${room.id}`;
    
    return (
      <TouchableOpacity
        key={room.id}
        onPress={() => router.push(`/chat/${room.id}`)}
        className={`mx-3 mb-2 p-3 rounded-lg flex-row items-center ${
          isActive 
            ? 'bg-primary/10 border border-primary/20' 
            : 'hover:bg-muted/50'
        }`}
      >
        <Avatar alt={room.name} className="w-10 h-10 mr-3">
          {room.avatar && <AvatarImage source={{ uri: room.avatar }} />}
          <AvatarFallback>
            <IconComponent 
              size={20} 
              className={isDark ? "text-white" : "text-black"}
            />
          </AvatarFallback>
        </Avatar>
        
        <View className="flex-1">
          <View className="flex-row items-center justify-between">
            <Text className={`font-medium ${isActive ? 'text-primary' : ''}`}>
              {room.name}
            </Text>
            {room.unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2 px-2 py-1 min-w-[20px] h-5">
                <Text className="text-xs text-white font-semibold">
                  {room.unreadCount}
                </Text>
              </Badge>
            )}
          </View>
          <Text className="text-xs text-muted-foreground mt-1">
            {room.lastActive}
          </Text>
        </View>
      </TouchableOpacity>
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
          {chatRooms.length} active conversations
        </Text>
      </View>

      {/* Chat Rooms List */}
      <DrawerContentScrollView 
        {...props} 
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        <View className="py-4">
          {chatRooms.map(renderChatRoom)}
        </View>
        
        <Separator className="mx-3 my-4" />
        
        {/* Actions */}
        <View className="px-3 pb-4">
          <Button
            variant="outline"
            onPress={() => router.push('/chat/new')}
            className="flex-row items-center justify-center mb-3"
          >
            <Plus size={16} className="text-foreground mr-2" />
            <Text className="font-medium">New Chat</Text>
          </Button>
          
          <Button
            variant="ghost"
            onPress={() => router.push('/chat/settings')}
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
        {/* Default chat screen */}
        <Drawer.Screen 
          name="index" 
          options={{ 
            drawerLabel: 'Chat Home',
            title: 'Chats',
            headerTitle: 'Chats',
          }} 
        />
        
        {/* Dynamic chat room routes */}
        <Drawer.Screen 
          name="[id]" 
          options={{ 
            drawerItemStyle: { display: 'none' },
            title: 'Chat Room',
            headerTitle: 'Chat',
          }} 
        />
        
        {/* New chat screen */}
        <Drawer.Screen 
          name="new" 
          options={{ 
            drawerItemStyle: { display: 'none' },
            title: 'New Chat',
            headerTitle: 'New Chat',
          }} 
        />
        
        {/* Settings screen */}
        <Drawer.Screen 
          name="settings" 
          options={{ 
            drawerItemStyle: { display: 'none' },
            title: 'Chat Settings',
            headerTitle: 'Settings',
          }} 
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}