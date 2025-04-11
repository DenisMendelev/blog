import { Routes, Route } from "react-router-dom";
import Header from "../shared/ui/Header/Header";
import ArticlesList from "../pages/ArticlesList";
import ArticlePage from "../pages/ArticlePage";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import EditProfile from "../pages/EditProfile";
import CreateArticle from "../pages/CreateArticle";
import EditArticle from "../pages/EditArticle";
import "./styles/index.scss";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<ArticlesList />} />
        <Route path="/articles" element={<ArticlesList />} />
        <Route path="/articles/:slug" element={<ArticlePage />} />
        <Route path="/articles/:slug/edit" element={<EditArticle />} />
        <Route path="/new-article" element={<CreateArticle />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/profile" element={<EditProfile />} />
      </Routes>
    </>
  );
}

export default App;
