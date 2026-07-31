import { baseApi } from '@core/api';

import type { ApiResponse } from '@core/api';

export interface MediaUploadResponse {
  _id: string;
  url: string;
}

export const mediaApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadMedia: builder.mutation<ApiResponse<MediaUploadResponse>, FormData>({
      query: (formData) => ({
        url: '/media/upload',
        method: 'POST',
        body: formData,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useUploadMediaMutation } = mediaApi;
