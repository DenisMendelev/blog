import { combineReducers, configureStore } from "@reduxjs/toolkit";
import postsReducer from "../../entities/Post/model/postsSlice";
import authReducer from "../../features/Auth/model/authSlice";
import { authApi } from "../../features/Auth/model/authApi";
import { postApi } from "../../entities/Post/model/postApi";
import { likeArticleApi } from "../../features/Like/model/likeArticleApi";
import { blogApi } from "../api/blogApi";
import { deleteArticleApi } from "../../features/DeleteArticle/model/deleteArticleApi";
import { createArticleApi } from "../../features/CreateArticle/model/createArticleApi";
import { editArticleApi } from "../../features/EditArticle/model/editArticleApi";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { AnyAction } from "redux";

const rootReducer = combineReducers({
  posts: postsReducer,
  auth: authReducer,
  [postApi.reducerPath]: postApi.reducer,
  [likeArticleApi.reducerPath]: likeArticleApi.reducer,
  [blogApi.reducerPath]: blogApi.reducer,
  [deleteArticleApi.reducerPath]: deleteArticleApi.reducer,
  [createArticleApi.reducerPath]: createArticleApi.reducer,
  [editArticleApi.reducerPath]: editArticleApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
});

export const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        postApi.middleware,
        likeArticleApi.middleware,
        blogApi.middleware,
        deleteArticleApi.middleware,
        createArticleApi.middleware,
        editArticleApi.middleware,
        authApi.middleware
      ),
  });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>;
