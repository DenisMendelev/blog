import { useEffect } from "react";
import "./ArticlesList.scss";
import PostCard from "../../../entities/Post/ui/PostCard/PostCard";
import { Pagination, Spin } from "antd";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { useGetArticlesQuery } from "../../../entities/Post";
import { setCurrentPage } from "../../../entities/Post/model/postsSlice";

const ArticlesList = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageFromUrl = parseInt(searchParams.get("page") || "1", 10);

  const limit = 5;

  const { data, error, isLoading } = useGetArticlesQuery({
    page: pageFromUrl,
    limit,
  });

  useEffect(() => {
    dispatch(setCurrentPage(pageFromUrl));
  }, [pageFromUrl, dispatch]);

  const handlePageChange = (page: number) => {
    setSearchParams({ page: page.toString() });
  };

  const handleFavoriteToggleCallback = () => {};

  if (isLoading) {
    return (
      <div className="loader-container">
        <Spin size="large" />
      </div>
    );
  }
  if (error) {
    return <div>Error: {error.toString()}</div>;
  }

  return (
    <section className="posts">
      {data?.articles.length === 0 ? (
        <div>No posts available</div>
      ) : (
        data?.articles.map((post) => (
          <PostCard
            key={post.slug}
            post={post}
            page={pageFromUrl}
            onFavoriteToggle={handleFavoriteToggleCallback}
          />
        ))
      )}
      <Pagination
        current={pageFromUrl}
        total={data?.articlesCount || 0}
        pageSize={limit}
        onChange={handlePageChange}
        showSizeChanger={false}
      />
    </section>
  );
};

export default ArticlesList;
