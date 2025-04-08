// src/store/slices/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  _id: string;
  email: string;
  displayName: string;
  photo?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token"),
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
      localStorage.setItem("token", action.payload);
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    },
  },
});

export const { setUser, setToken, setLoading, logout } = authSlice.actions;

export default authSlice.reducer;
