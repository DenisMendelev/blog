import { createApi } from "@reduxjs/toolkit/query/react";
import { baseApi } from "../../../shared/api/blogApi";
import { User } from "../../../entities/User/index";
import { postApi } from "../../../entities/Post/model/postApi";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseApi,
  endpoints: (builder) => ({
    loginUser: builder.mutation<
      { user: User },
      { email: string; password: string }
    >({
      query: (credentials) => ({
        url: "/users/login",
        method: "POST",
        body: { user: credentials },
      }),
    }),
    registerUser: builder.mutation<
      { user: User },
      { username: string; email: string; password: string }
    >({
      query: (userData) => ({
        url: "/users",
        method: "POST",
        body: { user: userData },
      }),
    }),
    updateUser: builder.mutation<
      { user: User },
      { username: string; email: string; password?: string; image?: string }
    >({
      query: (userData) => ({
        url: "/user",
        method: "PUT",
        body: { user: userData },
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch({ type: "auth/updateUser", payload: data.user });
          dispatch(postApi.util.invalidateTags(["Articles"]));
        } catch (err) {
          console.error("Error in updateUser onQueryStarted:", err);
        }
      },
    }),
  }),
});

export const {
  useLoginUserMutation,
  useRegisterUserMutation,
  useUpdateUserMutation,
} = authApi;
