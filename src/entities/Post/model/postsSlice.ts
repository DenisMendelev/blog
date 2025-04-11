import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Post } from "./types";

interface PostsState {
  currentPage: number;
  articles: { [slug: string]: Post };
}

const initialState: PostsState = {
  currentPage: 1,
  articles: {},
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    updateArticle: (state, action: PayloadAction<Post>) => {
      state.articles[action.payload.slug] = action.payload;
    },
  },
});

export const { setCurrentPage, updateArticle } = postsSlice.actions;
export default postsSlice.reducer;
