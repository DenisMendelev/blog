import { createApi } from "@reduxjs/toolkit/query/react";
import { baseApi } from "../../../shared/api/blogApi";
import { Post } from "./types";

export const postApi = createApi({
  reducerPath: "postApi",
  baseQuery: baseApi,
  tagTypes: ["Articles"],
  endpoints: (builder) => ({
    getArticles: builder.query<
      { articles: Post[]; articlesCount: number },
      { page: number; limit: number }
    >({
      query: ({ page, limit }) => {
        const offset = (page - 1) * limit;
        return `/articles?limit=${limit}&offset=${offset}`;
      },
      providesTags: ["Articles"],
    }),
    getArticleBySlug: builder.query<Post, string>({
      query: (slug) => `/articles/${slug}`,
      transformResponse: (response: { article: Post }) => response.article,
      providesTags: (_, __, slug) => [{ type: "Articles", id: slug }],
    }),
    deleteArticle: builder.mutation<void, string>({
      query: (slug) => ({
        url: `/articles/${slug}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, slug) => [
        { type: "Articles", id: slug },
        "Articles",
      ],
    }),
  }),
});

export const {
  useGetArticlesQuery,
  useGetArticleBySlugQuery,
  useDeleteArticleMutation,
} = postApi;
