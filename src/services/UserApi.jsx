// services/UserApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://6821ee72b342dce8004c6739.mockapi.io/' }),
    endpoints: (builder) => ({
        getUsers: builder.query({
            query: () => 'User',
        }),
        deleteuser: builder.mutation({
            query: (id) => ({
                url: `User/${id}`,
                method: 'DELETE',
            }),
        }),
    }),
})

export const { useGetUsersQuery, useDeleteuserMutation } = userApi;