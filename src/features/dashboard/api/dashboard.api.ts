import { baseApi } from '@core/api';

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardData: builder.query<{ id: string; name: string }, void>({
      query: () => '/dashboard',
      providesTags: ['Detail'],
    }),
  }),
});

export const { useGetDashboardDataQuery } = dashboardApi;
