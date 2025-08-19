import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';
import { cn } from '@/lib/utils';
import { ChatMessage } from '@/lib/types';
import { UseChatHelpers } from '@ai-sdk/react';

export interface FilePickerProps {
  onFileSelect?: (result: DocumentPicker.DocumentPickerResult) => void;
  onError?: (error: Error) => void;
  multiple?: boolean;
  accept?: string[];
  className?: string;
  maxSize?: number; // in bytes
  label?: string;
  description?: string;
  icon?: React.ReactNode;
  renderPicker?: (props: {status: UseChatHelpers<ChatMessage>['status'], handleFilePick: () => void }) => React.ReactNode,
  status: UseChatHelpers<ChatMessage>['status'];
}

export interface PickedFile {
  uri: string;
  name: string;
  size?: number;
  mimeType: string;
}

export function FilePicker({
  onFileSelect,
  onError,
  multiple = false,
  accept,
  className,
  renderPicker,
  status, 
  maxSize,
  label = 'Select File',
  description = 'Click or drag and drop files',
  icon,
}: FilePickerProps) {
  const [files, setFiles] = useState<PickedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleFilePick = useCallback(async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: accept || '*/*',
        multiple,
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      const pickedFiles = multiple ? result.assets : [result.assets[0]];
      const processedFiles: PickedFile[] = pickedFiles.map(file => ({
        uri: file.uri,
        name: file.name,
        size: file.size,
        mimeType: file.mimeType || 'application/octet-stream',
      }));

      // Check file size if maxSize is specified
      if (maxSize) {
        const oversizedFiles = processedFiles.filter(file => file?.size || 0 > maxSize);
        if (oversizedFiles.length > 0) {
          throw new Error(`File(s) exceed maximum size of ${maxSize / (1024 * 1024)}MB`);
        }
      }

      setFiles(prev => (multiple ? [...prev, ...processedFiles] : processedFiles));
      onFileSelect?.(result);
    } catch (error) {
      console.error('Error picking file:', error);
      onError?.(error instanceof Error ? error : new Error('Failed to pick file'));
    }
  }, [multiple, accept, maxSize, onFileSelect, onError]);

  const removeFile = useCallback((index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const droppedFiles = Array.from(e.dataTransfer.files);
      if (!droppedFiles.length) return;

      try {
        // Convert dropped files to PickedFile format
        const processedFiles: PickedFile[] = droppedFiles.map(file => ({
          uri: URL.createObjectURL(file),
          name: file.name,
          size: file.size,
          mimeType: file.type || 'application/octet-stream',
        }));

        if (maxSize) {
          const oversizedFiles = processedFiles.filter(file => (file.size ||0 ) > maxSize);
          if (oversizedFiles.length > 0) {
            throw new Error(`File(s) exceed maximum size of ${maxSize / (1024 * 1024)}MB`);
          }
        }

        setFiles(prev => (multiple ? [...prev, ...processedFiles] : [processedFiles[0]]));
        onFileSelect?.({
          
          canceled: false,
          assets: processedFiles.map(file => ({
            ...file,
            uri: file.uri,
          })),
        });
      } catch (error) {
        console.error('Error handling dropped files:', error);
        onError?.(error instanceof Error ? error : new Error('Failed to process dropped files'));
      }
    },
    [multiple, maxSize, onFileSelect, onError]
  );

  return (
    <View className={cn('w-full', className)}>
      {renderPicker ? renderPicker({status, handleFilePick}) :<TouchableOpacity
        onPress={handleFilePick}
        className={cn(
          'border-2 border-dashed rounded-lg p-6',
          'items-center justify-center',
          isDragging ? 'border-primary bg-primary/5' : 'border-border',
          Platform.select({
            web: 'cursor-pointer hover:border-primary/50 transition-colors',
            default: '',
          })
        )}
        // @ts-ignore - web only props
        onDragEnter={Platform.OS === 'web' ? handleDragEnter : undefined}
        onDragLeave={Platform.OS === 'web' ? handleDragLeave : undefined}
        onDragOver={Platform.OS === 'web' ? handleDragEnter : undefined}
        onDrop={Platform.OS === 'web' ? handleDrop : undefined}
      >
        {icon || <Ionicons name="cloud-upload-outline" size={32} color="#6b7280" />}
        <Text className="mt-4 font-medium text-foreground">{label}</Text>
        <Text className="mt-1 text-sm text-muted-foreground">{description}</Text>
        {accept && (
          <Text className="mt-2 text-xs text-muted-foreground">
            Allowed types: {accept.join(', ')}
          </Text>
        )}
      </TouchableOpacity>}  

      {files.length > 0 && (
        <View className="mt-4 space-y-2">
          {files.map((file, index) => (
            <View
              key={`${file.name}-${index}`}
              className="flex-row items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <View className="flex-row items-center flex-1">
                <Ionicons name="document-outline" size={20} color="#6b7280" />
                <View className="ml-2 flex-1">
                  <Text className="text-sm font-medium text-foreground" numberOfLines={1}>
                    {file.name}
                  </Text>
                  <Text className="text-xs text-muted-foreground">
                    {((file.size || 0) / (1024 * 1024)).toFixed(2)} MB
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => removeFile(index)}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700"
              >
                <Ionicons name="close" size={16} color="#6b7280" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
