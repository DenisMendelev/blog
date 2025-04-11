import { useDispatch } from "react-redux";
import { setUser, logout } from "./authSlice";
import {
  useLoginUserMutation,
  useRegisterUserMutation,
  useUpdateUserMutation,
} from "./authApi";
import { useNavigate } from "react-router-dom";

const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginUser] = useLoginUserMutation();
  const [registerUser] = useRegisterUserMutation();
  const [updateUser] = useUpdateUserMutation();

  const handleLogin = async (email: string, password: string) => {
    const response = await loginUser({ email, password }).unwrap();
    dispatch(setUser(response.user));
    navigate("/articles");
  };

  const handleRegister = async (
    username: string,
    email: string,
    password: string
  ) => {
    const response = await registerUser({ username, email, password }).unwrap();
    dispatch(setUser(response.user));
    navigate("/articles");
  };

  const handleUpdateUser = async (userData: {
    username: string;
    email: string;
    password?: string;
    image?: string;
  }) => {
    const response = await updateUser(userData).unwrap();
    const updatedUser = {
      ...response.user,
      image: response.user.image || userData.image || "",
    };
    dispatch(setUser(updatedUser));
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/articles");
  };

  return { handleLogin, handleRegister, handleUpdateUser, handleLogout };
};

export { useAuth };
