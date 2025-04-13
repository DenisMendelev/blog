import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../shared/store/store";
import {
  useFavoriteArticleMutation,
  useUnfavoriteArticleMutation,
} from "./likeArticleApi";
import { postApi } from "../../../entities/Post/model/postApi";
import { Post } from "../../../entities/Post/model/types";

export const useLikeArticle = (slug: string, page?: number) => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [favoriteArticle, { isLoading: isFavoriting }] =
    useFavoriteArticleMutation();
  const [unfavoriteArticle, { isLoading: isUnfavoriting }] =
    useUnfavoriteArticleMutation();

  const handleFavoriteToggle = async (currentFavorited: boolean) => {
    if (!user) {
      navigate("/sign-in");
      return;
    }

    const mutation = currentFavorited ? unfavoriteArticle : favoriteArticle;
    try {
      const updatedArticle = await mutation({
        slug,
        currentPage: page,
      }).unwrap();

      postApi.util.updateQueryData("getArticleBySlug", slug, (draft: Post) => {
        Object.assign(draft, updatedArticle);
      });

      postApi.util.invalidateTags([{ type: "Articles", id: slug }, "Articles"]);
      return updatedArticle;
    } catch (err) {
      console.error("Favorite toggle error:", err);
      throw err;
    }
  };

  const isFavoriteLoading = isFavoriting || isUnfavoriting;

  return { handleFavoriteToggle, isFavoriteLoading };
};
