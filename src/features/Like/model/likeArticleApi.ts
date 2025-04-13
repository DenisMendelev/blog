import { createApi } from "@reduxjs/toolkit/query/react";
import { baseApi } from "../../../shared/api/blogApi";
import { Post } from "../../../entities/Post";
import { postApi } from "../../../entities/Post/model/postApi";

export const likeArticleApi = createApi({
  reducerPath: "likeArticleApi",
  baseQuery: baseApi,
  tagTypes: ["Articles"],
  endpoints: (builder) => ({
    favoriteArticle: builder.mutation<
      Post,
      { slug: string; currentPage?: number }
    >({
      query: ({ slug }) => ({
        url: `/articles/${slug}/favorite`,
        method: "POST",
      }),
      transformResponse: (response: { article: Post }) => response.article,
      async onQueryStarted(
        { slug, currentPage = 1 },
        { dispatch, queryFulfilled }
      ) {
        const limit = 5;
        const patchResult = dispatch(
          postApi.util.updateQueryData(
            "getArticles",
            { page: currentPage, limit },
            (draft) => {
              const articleIndex = draft.articles.findIndex(
                (a) => a.slug === slug
              );
              if (articleIndex !== -1) {
                draft.articles[articleIndex] = {
                  ...draft.articles[articleIndex],
                  favorited: true,
                  favoritesCount:
                    draft.articles[articleIndex].favoritesCount + 1,
                };
              }
            }
          )
        );

        try {
          const { data } = await queryFulfilled;
          dispatch(
            postApi.util.updateQueryData(
              "getArticles",
              { page: currentPage, limit },
              (draft) => {
                const articleIndex = draft.articles.findIndex(
                  (a) => a.slug === slug
                );
                if (articleIndex !== -1) {
                  draft.articles[articleIndex] = data;
                }
              }
            )
          );
        } catch (err) {
          patchResult.undo();
          console.error("Error favoriting article:", err);
        }
      },
      invalidatesTags: (_, __, { slug }) => [
        { type: "Articles", id: slug },
        "Articles",
      ],
    }),
    unfavoriteArticle: builder.mutation<
      Post,
      { slug: string; currentPage?: number }
    >({
      query: ({ slug }) => ({
        url: `/articles/${slug}/favorite`,
        method: "DELETE",
      }),
      transformResponse: (response: { article: Post }) => response.article,
      async onQueryStarted(
        { slug, currentPage = 1 },
        { dispatch, queryFulfilled }
      ) {
        const limit = 5;
        const patchResult = dispatch(
          postApi.util.updateQueryData(
            "getArticles",
            { page: currentPage, limit },
            (draft) => {
              const articleIndex = draft.articles.findIndex(
                (a) => a.slug === slug
              );
              if (articleIndex !== -1) {
                draft.articles[articleIndex] = {
                  ...draft.articles[articleIndex],
                  favorited: false,
                  favoritesCount:
                    draft.articles[articleIndex].favoritesCount - 1,
                };
              }
            }
          )
        );

        try {
          const { data } = await queryFulfilled;
          dispatch(
            postApi.util.updateQueryData(
              "getArticles",
              { page: currentPage, limit },
              (draft) => {
                const articleIndex = draft.articles.findIndex(
                  (a) => a.slug === slug
                );
                if (articleIndex !== -1) {
                  draft.articles[articleIndex] = data;
                }
              }
            )
          );
        } catch (err) {
          patchResult.undo();
          console.error("Error unfavoriting article:", err);
        }
      },
      invalidatesTags: (_, __, { slug }) => [
        { type: "Articles", id: slug },
        "Articles",
      ],
    }),
  }),
});

export const { useFavoriteArticleMutation, useUnfavoriteArticleMutation } =
  likeArticleApi;
