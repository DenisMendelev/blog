import { createApi } from "@reduxjs/toolkit/query/react";
import { baseApi } from "../../../shared/api/blogApi";
import { Post } from "../../../entities/Post/model/types";
import { postApi } from "../../../entities/Post/model/postApi";
import { RootState } from "../../../shared/store/store";

export const createArticleApi = createApi({
  reducerPath: "createArticleApi",
  baseQuery: baseApi,
  tagTypes: ["Articles"],
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
      query: (articleData) => ({
        url: "/articles",
        method: "POST",
        body: articleData,
      }),
      async onQueryStarted(
        articleData,
        { dispatch, queryFulfilled, getState }
      ) {
        const limit = 5;
        const page = 1;
        const state = getState() as RootState;
        const currentUser = state.auth.user;

        const patchResult = dispatch(
          postApi.util.updateQueryData(
            "getArticles",
            { page, limit },
            (draft) => {
              const newArticle: Post = {
                slug: `${articleData.article.title
                  .toLowerCase()
                  .replace(/\s+/g, "-")}-${Date.now()}`,
                title: articleData.article.title,
                description: articleData.article.description,
                body: articleData.article.body,
                tagList: articleData.article.tagList,
                createdAt: new Date().toISOString(),
                favorited: false,
                favoritesCount: 0,
                author: {
                  username: currentUser?.username || "unknown",
                  image: currentUser?.image || "",
                },
              };
              draft.articles.unshift(newArticle);
              draft.articlesCount += 1;
            }
          )
        );

        try {
          const { data } = await queryFulfilled;
          dispatch(
            postApi.util.updateQueryData(
              "getArticles",
              { page, limit },
              (draft) => {
                const index = draft.articles.findIndex(
                  (a) => a.slug === data.article.slug
                );
                if (index !== -1) {
                  draft.articles[index] = data.article;
                } else {
                  draft.articles.unshift(data.article);
                  draft.articlesCount += 1;
                }
              }
            )
          );
        } catch (err) {
          patchResult.undo();
          console.error("Error creating article:", err);
        }

        dispatch(postApi.util.invalidateTags(["Articles"]));
      },
      invalidatesTags: ["Articles"],
    }),
  }),
});

export const { useCreateArticleMutation } = createArticleApi;
