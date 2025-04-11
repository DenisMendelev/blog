import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../../entities/User";
interface AuthState {
  user: {
    username: string;
    email: string;
    token: string;
    image?: string;
  } | null;
}

const initialState: AuthState = {
  user: null,
};

const savedUser = localStorage.getItem("user");
if (savedUser) {
  const parsedUser = JSON.parse(savedUser);
  initialState.user = {
    ...parsedUser,
    image: parsedUser.image || "",
  };
}

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    setUser: (
      state,
      action: PayloadAction<{
        username: string;
        email: string;
        token: string;
        image?: string;
      }>
    ) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("user");
    },
  },
});

export const { updateUser, setUser, logout } = authSlice.actions;
export default authSlice.reducer;
