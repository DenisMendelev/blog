import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Header.scss";
import { Button } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/store";
import { logout } from "../../../features/Auth/model/authSlice";
import defaultAvatar from "../../assets/user_icon.png";
import { useEffect } from "react";

const Header = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentPage } = useSelector((state: RootState) => state.posts);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {}, [user]);

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <header className="header">
      {location.pathname === "/" || location.pathname === "/articles" ? (
        <span>Realworld Blog</span>
      ) : (
        <Link to={`/articles?page=${currentPage}`}>
          <span>Realworld Blog</span>
        </Link>
      )}
      <div className="header__actions">
        {user ? (
          <>
            <Link to="/new-article">
              <Button type="primary" className="create-article">
                Create article
              </Button>
            </Link>
            <div className="user-info" onClick={handleProfileClick}>
              <span className="username">{user.username}</span>
              <img
                key={user.image || "default"}
                src={
                  user.image && user.image !== ""
                    ? `${user.image}?t=${Date.now()}`
                    : defaultAvatar
                }
                alt="User Avatar"
                className="avatar"
              />
            </div>
            <Button type="primary" className="log-out" onClick={handleLogout}>
              Log Out
            </Button>
          </>
        ) : (
          <>
            <Link to="/sign-in">
              <Button>Sign In</Button>
            </Link>
            <Link to="/sign-up">
              <Button>Sign Up</Button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
