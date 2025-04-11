export { useAuth } from "./model/hooks";
export {
  updateUser,
  setUser,
  logout,
  default as authReducer,
} from "./model/authSlice";

export {
  authApi,
  useLoginUserMutation,
  useRegisterUserMutation,
  useUpdateUserMutation,
} from "./model/authApi";
