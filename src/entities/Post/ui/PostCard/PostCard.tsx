import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../../shared/store/store";
import { Post } from "../../model/types";
import { useLikeArticle } from "../../../../features/Like";
import PostItem from "../PostItem/PostItem";
import "./PostCard.scss";

interface PostCardProps {
  post: Post;
  page?: number;
  onFavoriteToggle?: () => void;
}

const PostCard = ({ post, page, onFavoriteToggle }: PostCardProps) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { handleFavoriteToggle, isFavoriteLoading } = useLikeArticle(
    post.slug,
    page
  );

  const handleToggle = async () => {
    await handleFavoriteToggle(post.favorited);
    if (onFavoriteToggle) {
      onFavoriteToggle();
    }
  };

  return (
    <article
      className="post"
      key={`${post.slug}-${post.description}-${post.title}`}
    >
      <Link to={`/articles/${post.slug}`}>
        <PostItem
          post={post}
          isFavorited={post.favorited}
          isFavoriteLoading={isFavoriteLoading}
          onFavoriteToggle={handleToggle}
          isUserAuthenticated={!!user}
        />
      </Link>
    </article>
  );
};

export default PostCard;
