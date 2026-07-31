import React, { useEffect, useRef } from 'react';

import { Image, Pressable, Text, View } from 'react-native';

import { Image as ImagePlus } from 'iconsax-react-nativejs';
import { Controller, useFormContext } from 'react-hook-form';

import { PRIMARY_COLOR } from '@core/theme';
import { useUploadMediaMutation } from '@shared/api/media.api';

import type { MediaUploadResponse } from '@shared/api/media.api';

interface FormImageUploaderProps {
  name: string;
  files?: Array<{ uri: string; name?: string; type?: string }>;
  onPress?: () => void;
  maxFiles?: number;
}

export function FormImageUploader({
  name,
  files = [],
  onPress,
  maxFiles = 5,
}: FormImageUploaderProps): React.JSX.Element {
  const { control } = useFormContext();
  const [uploadMedia, { isLoading }] = useUploadMediaMutation();
  const onChangeRef = useRef<(value: MediaUploadResponse[]) => void>(() => {});
  const imagesRef = useRef<MediaUploadResponse[]>([]);
  const uploadedFileUrisRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const uploadFiles = async () => {
      const pendingFiles = files.filter((file) => !uploadedFileUrisRef.current.has(file.uri));

      if (pendingFiles.length === 0) {
        return;
      }

      const uploaded: MediaUploadResponse[] = [];

      for (const file of pendingFiles) {
        try {
          const formData = new FormData();
          formData.append('file', {
            uri: file.uri,
            name: file.name || 'image.jpg',
            type: file.type || 'image/jpeg',
          } as unknown as Blob);

          const result = await uploadMedia(formData).unwrap();
          uploaded.push(result.data);
          uploadedFileUrisRef.current.add(file.uri);
        } catch (error) {
          console.error('Upload failed:', error);
        }
      }

      if (uploaded.length > 0) {
        onChangeRef.current([...imagesRef.current, ...uploaded]);
      }
    };

    uploadFiles();
  }, [files, uploadMedia]);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => {
        const images = Array.isArray(value) ? (value as MediaUploadResponse[]) : [];

        onChangeRef.current = onChange;
        imagesRef.current = images;

        return (
          <View>
            <Pressable
              onPress={onPress}
              disabled={isLoading || images.length >= maxFiles}
              className='items-center justify-center rounded-xl border border-dashed border-pink-300 bg-pink-50/30 px-6 py-8'
            >
              <ImagePlus size={32} color={PRIMARY_COLOR} />

              <Text className='mt-3 text-lg font-semibold text-primary-600'>
                {isLoading ? 'Uploading...' : 'Add Images'}
              </Text>

              <Text className='mt-1 text-center text-sm text-gray-600'>
                {isLoading ? 'Please wait...' : `Upload up to ${maxFiles} images`}
              </Text>

              <Text className='text-center text-sm text-gray-500'>JPG, PNG (Max 5MB each)</Text>
            </Pressable>

            {images.length > 0 && (
              <View className='mt-4 flex-row flex-wrap gap-3'>
                {images.map((item) => (
                  <View
                    key={item._id}
                    className='relative h-24 w-24 overflow-hidden rounded-lg border border-gray-200'
                  >
                    <Image
                      source={{ uri: item.url }}
                      className='h-full w-full'
                      resizeMode='cover'
                    />
                  </View>
                ))}
              </View>
            )}
          </View>
        );
      }}
    />
  );
}
