import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store/store";
import { Post } from "../../entities/Post";
import { User } from "../../entities/User";

const BASE_URL = "https://blog-platform.kata.academy/api";

export const baseApi = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.user?.token;
    if (token) {
      headers.set("Authorization", `Token ${token}`);
    }
    return headers;
  },
});

export const blogApi = createApi({
  reducerPath: "blogApi",
  baseQuery: baseApi,
  tagTypes: ["Articles", "User"],
  endpoints: (builder) => ({
    createArticle: builder.mutation<
      { article: Post },
      {
        article: {
          title: string;
          description: string;
          body: string;
          tagList: string[];
        };
      }
    >({
      query: (body) => ({
        url: "/articles",
        method: "POST",
        body,
      }),
      invalidatesTags: () => [{ type: "Articles", id: "LIST" }],
    }),
    updateArticle: builder.mutation<
      { article: Post },
      {
        slug: string;
        article: {
          title: string;
          description: string;
          body: string;
          tagList: string[];
        };
      }
    >({
      query: ({ slug, article }) => ({
        url: `/articles/${slug}`,
        method: "PUT",
        body: { article },
      }),
      invalidatesTags: (_, __, { slug }) => [
        { type: "Articles", id: slug },
        { type: "Articles", id: "LIST" },
      ],
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
    loginUser: builder.mutation<
      { user: User },
      { email: string; password: string }
    >({
      query: (userData) => ({
        url: "/users/login",
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
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useCreateArticleMutation,
  useUpdateArticleMutation,
  useRegisterUserMutation,
  useLoginUserMutation,
  useUpdateUserMutation,
} = blogApi;
