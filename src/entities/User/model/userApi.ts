import { createApi } from "@reduxjs/toolkit/query/react";
import { baseApi } from "../../../shared/api/blogApi";
import { User } from "./types";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: baseApi,
  endpoints: (builder) => ({
    updateUser: builder.mutation<
      { user: User },
      { username: string; email: string; password?: string; image?: string }
    >({
      query: (userData) => ({
        url: "/user",
        method: "PUT",
        body: { user: userData },
      }),
    }),
  }),
});

export const { useUpdateUserMutation } = userApi;
