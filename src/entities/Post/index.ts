export { default as PostCard } from "./ui/PostCard/PostCard";
export { default as PostItem } from "./ui/PostItem/PostItem";
export type { Post } from "./model/types";
export {
  useGetArticlesQuery,
  useGetArticleBySlugQuery,
  postApi,
} from "./model/postApi";
export { setCurrentPage, updateArticle } from "./model/postsSlice";
