
import * as React from 'react';
import { View } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    Form,
    FormField,
    FormFilePicker,
    FormTextarea,
} from '~/components/ui/form';
import equal from 'fast-deep-equal';

import { Button, buttonTextVariants } from '~/components/ui/button';
import { CreateMessageSchema } from '@/lib/validations';
import { Text } from '../ui/text';
import type { Attachment, ChatMessage } from '@/lib/types';
import * as DocumentPicker from 'expo-document-picker';
import { UseChatHelpers } from '@ai-sdk/react';
import { memo } from 'react';
import { ArrowUpIcon, PaperclipIcon, StopCircle } from 'lucide-react-native';

export type MessageFormValues = z.infer<typeof CreateMessageSchema>;

interface MessageFormProps {
    chatId: string;
    userId: string;
    onSubmit: (values: MessageFormValues) => void;
    isSubmitting?: boolean;
    stop: () => void;
    status: UseChatHelpers<ChatMessage>['status'];

    initialValue: MessageFormValues
}

export function PureMessageForm({
    chatId,
    userId,
    onSubmit,
    isSubmitting,
    status,
    stop,
    initialValue
}: MessageFormProps) {
    const form = useForm({
        resolver: zodResolver(CreateMessageSchema),
        defaultValues: initialValue || {
            chatId,
            userId,
            content: '',
            attachments: [],
            isAI: false,
        },
    });

    const handleSubmit = async (values: MessageFormValues) => {
        try {
            await onSubmit(values);
            form.reset(); // Reset form after successful submission
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    return (
        <View className="flex-row items-center max-h-[144px] mx-2  rounded-xl">
            <Form {...form}>

                <FormField
                    control={form.control}
                    name="attachments"
                    render={({ field }) => {
                        const fieldValue = field.value as unknown as Array<{
                            type: string;
                            url: string;
                            name: string;
                            size?: number;
                        }>;

                        return (
                            <FormFilePicker
                                onBlur={field.onBlur}
                                name={field.name}
                                value={[] as DocumentPicker.DocumentPickerResult[]}
                                onChange={field.onChange}
                                renderPicker={(props) => <AttachmentsButton {...props} />}
                                status={status}
                                onFileSelect={(result) => {
                                    if (!result.canceled && result.assets) {
                                        const newAttachments = result.assets.map((asset) => ({
                                            type: asset.mimeType?.split('/')[0] || 'file',
                                            url: asset.uri,
                                            name: asset.name || 'Unknown',
                                            size: asset.size,
                                        }));
                                        const currentAttachments = fieldValue || [];
                                        field.onChange([...currentAttachments, ...newAttachments]);
                                    }
                                }}
                            />
                        );
                    }}
                />
                <View className='flex-1 max-h-[144px]'>
                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormTextarea
                                className='border-none border-0'
                                placeholder="Type your message here..."

                                {...field}
                            />
                        )}
                    />
                </View>


                {/* {(form.watch('attachments') || []).length > 0 && (
                    <View className="space-y-2">
                        <Text className="text-sm font-medium">Selected Attachments:</Text>
                        {(form.watch('attachments') || []).map((attachment, index) => (
                            <View key={index} className="flex-row justify-between items-center bg-secondary p-2 rounded">
                                <Text className="text-sm">{attachment.name}</Text>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onPress={() => {
                                        const attachments = [...(form.getValues('attachments') || [])];
                                        attachments.splice(index, 1);
                                        form.setValue('attachments', attachments);
                                    }}
                                >
                                    Remove
                                </Button>
                            </View>
                        ))}
                    </View>
                )} */}




                {status !== 'streaming' ? <SendButton
                    submitForm={form.handleSubmit(handleSubmit)}
                    disabled={isSubmitting || false}
                /> : <StopButton stop={stop} />}

            </Form>
        </View>
    );
}


export const MessageForm = memo(
    PureMessageForm,
    (prevProps, nextProps) => {
        if (prevProps.status !== nextProps.status) return false;
        if (prevProps.isSubmitting !== nextProps.isSubmitting) return false;
        if (!equal(prevProps.initialValue, nextProps.initialValue)) return false;
        return true;
    },
);

function PureAttachmentsButton({
    handleFilePick,
    status,
}: {
    handleFilePick: () => void;
    status: UseChatHelpers<ChatMessage>['status'];
}) {
    return (
        <Button
            data-testid="attachments-button"
            className="rounded-md rounded-bl-lg p-[7px] h-fit dark:border-zinc-700 hover:dark:bg-zinc-900 hover:bg-zinc-200"
            onPress={handleFilePick}
            disabled={status !== 'ready'}
            variant="ghost"
        >
            <PaperclipIcon size={14} />
        </Button>
    );
}

const AttachmentsButton = memo(PureAttachmentsButton);

function PureStopButton({
    stop,
}: {
    stop: () => void;
    // setMessages: UseChatHelpers<ChatMessage>['setMessages'];
}) {
    return (
        <Button
            onPress={stop}
            variant="destructive"
            className="px-3"
        >
            <StopCircle size={14} />
        </Button>
    );
}

const StopButton = memo(PureStopButton);

function PureSendButton({
    submitForm,
    disabled
}: {
    submitForm: () => void;
    disabled: boolean
}) {
    return (
        <Button
            onPress={submitForm}
            disabled={disabled}
            className="mr-2"
        >
            <ArrowUpIcon color={"white"} size={18} />
        </Button>

    );
}

const SendButton = memo(PureSendButton, (prevProps, nextProps) => {
    if (prevProps.disabled !== nextProps.disabled)
        return false;

    return true;
});
