import { createApi } from "@reduxjs/toolkit/query/react";
import { baseApi } from "../../../shared/api/blogApi";
import { Post } from "../../../entities/Post/model/types";
import { postApi } from "../../../entities/Post/model/postApi";

export const editArticleApi = createApi({
  reducerPath: "editArticleApi",
  baseQuery: baseApi,
  tagTypes: ["Articles"],
  endpoints: (builder) => ({
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
        currentPage?: number;
      }
    >({
      query: ({ slug, article }) => ({
        url: `/articles/${slug}`,
        method: "PUT",
        body: { article },
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(postApi.util.invalidateTags(["Articles"]));
        } catch (err) {
          console.error("Error updating article:", err);
        }
      },
      invalidatesTags: (_, __, { slug }) => [
        { type: "Articles", id: slug },
        "Articles",
      ],
    }),
  }),
});

export const { useUpdateArticleMutation } = editArticleApi;
