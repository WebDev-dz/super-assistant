// chat/[id].tsx - Individual AI chat session using Vercel AI SDK
import React, { useState, useRef, useEffect } from 'react';
import { DefaultChatTransport, UIMessage } from 'ai';
import { fetch as expoFetch } from 'expo/fetch';
import {
    View,
    TouchableOpacity,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useColorScheme } from '@/lib/useColorScheme';
import { useChat } from '@ai-sdk/react';
import { Text } from '~/components/ui/text';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { Avatar, AvatarFallback } from '~/components/ui/avatar';
import { Card } from '~/components/ui/card';
import {
    Send,
    Bot,
    User,
    Copy,
    ThumbsUp,
    ThumbsDown,
    MoreVertical,
    Trash2,
    Share
} from 'lucide-react-native';
import { generateAPIUrl } from '@/lib/utils';


export default function ChatSession() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { colorScheme } = useColorScheme();
    const flatListRef = useRef<FlatList>(null);
    const [input, setInput] = useState('');

    const {
        messages,
        status,
        error,
        stop,
        id: chatId,
        setMessages,
        sendMessage,
        regenerate,
        resumeStream,
        addToolResult,
    } = useChat({
        transport: new DefaultChatTransport({
            fetch: expoFetch as unknown as typeof globalThis.fetch,
            api: generateAPIUrl('/api/chat'),
        }),
        onError: error => console.error(error, 'ERROR'),
        onFinish: result => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }
    });

    const [inputHeight, setInputHeight] = useState(40);

    const handleSend = (e?: any) => {
        if (input.trim()) {
            sendMessage({
                text: input,
            });
        }
    };

    const copyMessage = (content: string) => {
        // Implement copy to clipboard
        // Expo.Clipboard.setStringAsync(content);
    };

    const renderMessage = ({ item, index }: { item: UIMessage; index: number }) => {
        const isUser = item.role === 'user';
        const isAssistant = item.role === 'assistant';

        return (
            <View className={`mb-6 ${isUser ? 'items-end' : 'items-start'}`}>
                <View className={`flex-row max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                    <Avatar alt={isUser ? 'You' : 'AI'} className="w-8 h-8 mx-2">
                        <AvatarFallback className={isUser ? 'bg-primary' : 'bg-secondary'}>
                            {isUser ? (
                                <User size={16} className="text-primary-foreground" />
                            ) : (
                                <Bot size={16} className="text-secondary-foreground" />
                            )}
                        </AvatarFallback>
                    </Avatar>

                    <View className="flex-1">
                        <Text className="text-xs text-muted-foreground mb-2 px-1">
                            {isUser ? 'You' : 'AI Assistant'}
                        </Text>

                        <Card className={`p-4 ${isUser
                            ? 'bg-primary border-primary'
                            : 'bg-card border-border'
                            }`}>

                            {item.parts.map((part, partIndex) => (
                                part.type === 'text' && (
                                    <Text key={partIndex} className={`text-sm leading-relaxed whitespace-pre-wrap ${isUser ? 'text-primary-foreground' : 'text-foreground'
                                        }`}>
                                        {part.text}
                                    </Text>)))}

                        </Card>

                        {/* Message Actions */}
                        {isAssistant && (
                            <View className="flex-row items-center mt-2 px-1 space-x-2">
                                <TouchableOpacity
                                    // onPress={() => copyMessage(item.content)}
                                    className="p-1"
                                >
                                    <Copy size={14} className="text-muted-foreground" />
                                </TouchableOpacity>

                                <TouchableOpacity className="p-1">
                                    <ThumbsUp size={14} className="text-muted-foreground" />
                                </TouchableOpacity>

                                <TouchableOpacity className="p-1">
                                    <ThumbsDown size={14} className="text-muted-foreground" />
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </View>
            </View>
        );
    };

    return (
        <KeyboardAvoidingView
            className="flex-1 bg-background"
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            {/* Header */}
            <View className="flex-row items-center justify-between p-4 bg-card border-b border-border">
                <View className="flex-row items-center flex-1">
                    <Avatar alt="AI Assistant" className="w-10 h-10 mr-3">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600">
                            <Bot size={20} className="text-white" />
                        </AvatarFallback>
                    </Avatar>
                    <View className="flex-1">
                        <Text className="font-semibold text-foreground">
                            AI Assistant
                        </Text>
                        <View className="flex-row items-center">
                            <View className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                            <Text className="text-xs text-muted-foreground">
                                {status == "streaming" ? 'Typing...' : 'Online'}
                            </Text>
                        </View>
                    </View>
                </View>

                <View className="flex-row items-center space-x-2">
                    <Button variant="ghost" size="sm" className="p-2">
                        <Share size={16} className="text-muted-foreground" />
                    </Button>
                    <Button variant="ghost" size="sm" className="p-2">
                        <MoreVertical size={16} className="text-muted-foreground" />
                    </Button>
                </View>
            </View>

            {/* Messages */}
            {messages.length === 0 ? (
                <View className="flex-1 items-center justify-center px-8">
                    <Bot size={48} className="text-muted-foreground mb-4" />
                    <Text className="text-lg font-medium text-foreground mb-2 text-center">
                        Start a conversation
                    </Text>
                    <Text className="text-muted-foreground text-center">
                        Ask me anything! I'm here to help with coding, explanations, brainstorming, and more.
                    </Text>
                </View>
            ) : (
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={renderMessage}
                    keyExtractor={(item, index) => `${item.id}-${index}`}
                    contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
                    showsVerticalScrollIndicator={false}
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
                />
            )}

            {/* Loading Indicator */}
            {status == "streaming" && (
                <View className="flex-row items-center px-6 py-2">
                    <ActivityIndicator size="small" className="mr-2" />
                    <Text className="text-sm text-muted-foreground">AI is thinking...</Text>
                </View>
            )}

            {/* Error Message */}
            {error && (
                <View className="mx-4 mb-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <Text className="text-sm text-destructive mb-2">
                        Something went wrong. Please try again.
                    </Text>
                    <Button variant="outline" size="sm" onPress={() => regenerate()}>
                        <Text className="text-sm">Retry</Text>
                    </Button>
                </View>
            )}

            {/* Message Input */}
            <View className="flex-row items-end p-4 bg-card border-t border-border">
                <View className="flex-1 mr-3">
                    <Input
                        value={input}
                        onChangeText={setInput}
                        placeholder="Message AI Assistant..."
                        multiline
                        className="min-h-[44px] max-h-[120px] text-base"
                        onContentSizeChange={(e) => {
                            const height = Math.min(120, Math.max(44, e.nativeEvent.contentSize.height + 12));
                            setInputHeight(height);
                        }}
                        style={{ height: inputHeight }}
                    />
                </View>

                {status === "streaming" ? (
                    <Button
                        onPress={stop}
                        variant="outline"
                        size="sm"
                        className="p-3"
                    >
                        <Text className="text-xs">Stop</Text>
                    </Button>
                ) : (
                    <Button
                        onPress={handleSend}
                        disabled={!input.trim()}
                        size="sm"
                        className="p-3"
                    >
                        <Send size={16} className="text-primary-foreground" />
                    </Button>
                )}
            </View>
        </KeyboardAvoidingView>
    );
}