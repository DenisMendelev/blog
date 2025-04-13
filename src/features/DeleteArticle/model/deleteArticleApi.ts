import { createApi } from "@reduxjs/toolkit/query/react";
import { baseApi } from "../../../shared/api/blogApi";
import { postApi } from "../../../entities/Post/model/postApi";

export const deleteArticleApi = createApi({
  reducerPath: "deleteArticleApi",
  baseQuery: baseApi,
  tagTypes: ["Articles"],
  endpoints: (builder) => ({
    deleteArticle: builder.mutation<void, { slug: string; page?: number }>({
      query: ({ slug }) => ({
        url: `/articles/${slug}`,
        method: "DELETE",
      }),
      async onQueryStarted({ slug, page = 1 }, { dispatch, queryFulfilled }) {
        const limit = 5;

        const patchResult = dispatch(
          postApi.util.updateQueryData(
            "getArticles",
            { page, limit },
            (draft) => {
              const index = draft.articles.findIndex((a) => a.slug === slug);
              if (index !== -1) {
                draft.articles.splice(index, 1);
                draft.articlesCount -= 1;
              }
            }
          )
        );

        try {
          await queryFulfilled;
        } catch (err) {
          patchResult.undo();
          console.error("Error deleting article:", err);
        }
        dispatch(postApi.util.invalidateTags(["Articles"]));
      },
      invalidatesTags: ["Articles"],
    }),
  }),
});

export const { useDeleteArticleMutation } = deleteArticleApi;
