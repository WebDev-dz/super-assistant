import type { Attachment } from '@/lib/types';
import { LoaderIcon } from 'lucide-react-native';
import { Image, View } from 'react-native';

export const PreviewAttachment = ({
  attachment,
  isUploading = false,
}: {
  attachment: Attachment;
  isUploading?: boolean;
}) => {
  const { name, url, contentType } = attachment;

  return (
    <View data-testid="input-attachment-preview" className="flex flex-col gap-2">
      <View className="w-20 h-16 aspect-video bg-muted rounded-md relative flex flex-col items-center justify-center">
        {contentType ? (
          contentType.startsWith('image') ? (
            // NOTE: it is recommended to use next/image for images
            // eslint-disable-next-line @next/next/no-img-element
            <Image
              key={url}
              src={url}
              alt={name ?? 'An image attachment'}
              className="rounded-md size-full object-cover"
            />
          ) : (
            <View className="" />
          )
        ) : (
          <View className="" />
        )}

        {isUploading && (
          <View
            data-testid="input-attachment-loader"
            className="animate-spin absolute text-zinc-500"
          >
            <LoaderIcon />
          </View>
        )}
      </View>
      <View className="text-xs text-zinc-500 max-w-16 truncate">{name}</View>
    </View>
  );
};
