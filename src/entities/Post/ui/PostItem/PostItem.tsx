import { Tag } from "antd";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { Post } from "../../model/types";
import "./PostItem.scss";

interface PostItemProps {
  post: Post;
  isFavorited: boolean;
  isFavoriteLoading: boolean;
  onFavoriteToggle: () => void;
  isUserAuthenticated: boolean;
}

const PostItem = ({
  post,
  isFavorited,
  isFavoriteLoading,
  onFavoriteToggle,
  isUserAuthenticated,
}: PostItemProps) => {
  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isUserAuthenticated && !isFavoriteLoading) {
      onFavoriteToggle();
    }
  };

  return (
    <div className="post-item" key={`${post.slug}-${post.description}`}>
      <div className="post-header">
        <div className="post-title">
          <div className="post-likes">
            <h2>{post.title}</h2>
            <span className="likes">
              <span
                onClick={handleLikeClick}
                className={`like-button ${isFavorited ? "favorited" : ""}`}
                style={{
                  cursor:
                    isUserAuthenticated && !isFavoriteLoading
                      ? "pointer"
                      : "not-allowed",
                }}
              >
                {isFavorited ? (
                  <HeartFilled style={{ color: "#ff4d4f" }} />
                ) : (
                  <HeartOutlined />
                )}
              </span>
              <span className="likes-count">{post.favoritesCount}</span>
            </span>
          </div>
          <div className="post-tag">
            {post.tagList.map((tag, index) => (
              <Tag key={index}>{tag}</Tag>
            ))}
          </div>
        </div>
        <div className="post-author">
          <div className="author-info">
            <p className="author-name">{post.author.username}</p>
            <p className="author-date">
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>
          <img
            src={
              post.author.image ||
              "https://api.realworld.io/images/smiley-cyrus.jpg"
            }
            alt="Author Avatar"
            className="avatar"
          />
        </div>
      </div>
      <p className="post-excerpt">{post.description}</p>
    </div>
  );
};

export default PostItem;
