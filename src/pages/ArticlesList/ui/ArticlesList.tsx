import { useEffect, useRef } from "react";
import "./ArticlesList.scss";
import PostCard from "../../../entities/Post/ui/PostCard/PostCard";
import { Pagination } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../shared/store/store";
import { useSearchParams } from "react-router-dom";
import { useGetArticlesQuery } from "../../../entities/Post";
import { setCurrentPage } from "../../../entities/Post/model/postsSlice";

const ArticlesList = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [searchParams, setSearchParams] = useSearchParams();
  const pageFromUrl = parseInt(searchParams.get("page") || "1", 10);

  const limit = 5;

  const { data, error, isLoading } = useGetArticlesQuery({
    page: pageFromUrl,
    limit,
  });

  useEffect(() => {
    dispatch(setCurrentPage(pageFromUrl));
    console.log("Current page synced with URL:", pageFromUrl);
  }, [pageFromUrl, dispatch]);

  const prevDataRef = useRef<typeof data>(undefined);
  const prevUserRef = useRef<typeof user>(undefined);

  console.log(
    "ArticlesList rendering, pageFromUrl:",
    pageFromUrl,
    "data:",
    data
  );
  console.log("Current user profile:", user);

  useEffect(() => {
    if (data && prevDataRef.current) {
      console.log("Articles data updated, checking for changes...");
      data.articles.forEach((currentArticle) => {
        const prevArticle = prevDataRef.current?.articles.find(
          (a) => a.slug === currentArticle.slug
        );
        if (prevArticle) {
          if (prevArticle.title !== currentArticle.title) {
            console.log(
              `Article title changed for slug: ${currentArticle.slug}`,
              `from: "${prevArticle.title}" to: "${currentArticle.title}"`
            );
          }
          if (prevArticle.description !== currentArticle.description) {
            console.log(
              `Article description changed for slug: ${currentArticle.slug}`,
              `from: "${prevArticle.description}" to: "${currentArticle.description}"`
            );
          }
        }
      });
    }
    prevDataRef.current = data;
  }, [data]);

  useEffect(() => {
    if (user && prevUserRef.current) {
      console.log("User profile updated, checking for changes...");
      if (prevUserRef.current.username !== user.username) {
        console.log(
          "Username changed:",
          `from: "${prevUserRef.current.username}" to: "${user.username}"`
        );
      }
      if (prevUserRef.current.email !== user.email) {
        console.log(
          "Email changed:",
          `from: "${prevUserRef.current.email}" to: "${user.email}"`
        );
      }
      if (prevUserRef.current.image !== user.image) {
        console.log(
          "User image changed:",
          `from: "${prevUserRef.current.image}" to: "${user.image}"`
        );
      }
    }
    prevUserRef.current = user;
  }, [user]);

  const handlePageChange = (page: number) => {
    console.log("Pagination changed to page:", page);
    setSearchParams({ page: page.toString() });
  };

  const handleFavoriteToggleCallback = () => {
    console.log("Favorite toggled for page:", pageFromUrl);
  };

  if (isLoading) {
    console.log("ArticlesList is loading...");
    return <div>Loading...</div>;
  }
  if (error) {
    console.log("ArticlesList error:", error);
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
      />
    </section>
  );
};

export default ArticlesList;
