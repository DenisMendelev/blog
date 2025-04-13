import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../shared/store/store";
import { useGetArticleBySlugQuery } from "../../../entities/Post";
import { useDeleteArticleMutation } from "../../../features/DeleteArticle";
import { useLikeArticle } from "../../../features/Like";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { Tag, Button, Popconfirm, Spin } from "antd";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { useEffect } from "react";
import "./ArticlePage.scss";

const ArticlePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const { user } = useSelector((state: RootState) => state.auth);

  const {
    data: article,
    isLoading,
    error,
    refetch,
  } = useGetArticleBySlugQuery(slug || "", {
    skip: !slug,
    refetchOnMountOrArgChange: true,
  });

  const [deleteArticle, { isLoading: isDeleting, isSuccess }] =
    useDeleteArticleMutation();
  const { handleFavoriteToggle, isFavoriteLoading } = useLikeArticle(
    slug || "",
    currentPage
  );

  useEffect(() => {
    if (isSuccess) {
      navigate(`/articles?page=${currentPage}`, { replace: true });
    }
  }, [isSuccess, navigate, currentPage]);

  const onFavoriteToggle = async () => {
    if (!user) {
      navigate("/sign-in");
      return;
    }
    await handleFavoriteToggle(article?.favorited || false);
    refetch();
  };

  const handleDelete = async () => {
    if (!slug) {
      return;
    }
    try {
      await deleteArticle({ slug, page: currentPage }).unwrap();
    } catch (err) {
      console.error("Failed to delete article:", err);
    }
  };

  if (isLoading)
    return (
      <div className="loader-container">
        <Spin size="large" />
      </div>
    );
  if (error) return <div>Error: {error.toString()}</div>;
  if (!article) return null;

  const isAuthor = user?.username === article.author.username;

  return (
    <div className="article-page-container">
      <div className="article-page">
        <div className="article-header">
          <div className="article-title">
            <div className="title-likes">
              <h1>{article.title}</h1>
              <span className="likes">
                <span
                  onClick={onFavoriteToggle}
                  className={`like-button ${
                    article.favorited ? "favorited" : ""
                  }`}
                  style={{
                    cursor:
                      user && !isFavoriteLoading ? "pointer" : "not-allowed",
                  }}
                >
                  {article.favorited ? (
                    <HeartFilled style={{ color: "#ff4d4f" }} />
                  ) : (
                    <HeartOutlined />
                  )}
                </span>
                <span className="likes-count">{article.favoritesCount}</span>
              </span>
            </div>
            <div className="article-tags">
              {article.tagList.map((tag, index) => (
                <Tag key={index}>{tag}</Tag>
              ))}
            </div>
          </div>
          <div className="article-author">
            <div className="author-info">
              <p className="author-name">{article.author.username}</p>
              <p className="author-date">
                {new Date(article.createdAt).toLocaleDateString()}
              </p>
            </div>
            <img
              src={
                article.author.image ||
                "https://api.realworld.io/images/smiley-cyrus.jpg"
              }
              alt="Author Avatar"
              className="avatar"
            />
          </div>
        </div>
        <div className="article-description">
          <p>{article.description}</p>
          {isAuthor && (
            <div className="article-actions">
              <Popconfirm
                title="Delete the article"
                description="Are you sure to delete this article?"
                onConfirm={handleDelete}
                okText="Yes"
                cancelText="No"
                placement="top"
                okButtonProps={{ danger: true }}
              >
                <Button className="button-delete" danger disabled={isDeleting}>
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button>
              </Popconfirm>
              <Link to={`/articles/${slug}/edit`}>
                <Button className="button-edit" style={{ marginLeft: "10px" }}>
                  Edit
                </Button>
              </Link>
            </div>
          )}
        </div>
        <div className="article-body">
          <ReactMarkdown>{article.body}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default ArticlePage;
