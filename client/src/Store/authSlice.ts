import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { type IAuth } from "@/Interface/auth";
import { login, logout, signup, verify } from "@/api/auth";
import { clearTasks } from "./taskSlice";
import { toast } from "sonner";

const initialState: IAuth = localStorage.getItem("taskman_auth")
  ? JSON.parse(localStorage.getItem("taskman_auth") as string)
  : {
      isAuthenticated: false,
      username: null,
      id: null,
      iat: null,
      exp: null,
    };

export const signupUser = createAsyncThunk(
  "auth/signup",
  async (payload: { username: string; password: string }) => {
    return await signup(payload.username, payload.password);
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (payload: { username: string; password: string }) => {
    return await login(payload.username, payload.password);
  }
);

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  return await logout();
});

export const verifyUser = createAsyncThunk("auth/verify", async () => {
  return await verify();
});

export const authSlice = createSlice({
  name: "/auth",
  initialState,
  reducers: {
    clearUser: (state) => {
      state.isAuthenticated = false;
      state.username = null;
      state.id = null;
      state.iat = null;
      state.exp = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(signupUser.rejected, (_state, action) => {
      toast.error(action.error.message || "Signup failed. Please try again.");
    });
    builder.addCase(loginUser.rejected, (_state, action) => {
      toast.error(action.error.message || "Login failed. Please try again.");
    });
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.isAuthenticated = false;
      state.username = null;
      state.id = null;
      state.iat = null;
      state.exp = null;
      localStorage.removeItem("taskman_auth");
      localStorage.removeItem("taskman_tasks");
      toast.success("Logged out successfully");
    });
    builder.addCase(logoutUser.rejected, (state) => {
      state.isAuthenticated = false;
      state.username = null;
      state.id = null;
      state.iat = null;
      state.exp = null;
      localStorage.removeItem("taskman_auth");
      localStorage.removeItem("taskman_tasks");
      toast.error("Logout failed");
    });
    builder.addCase(verifyUser.fulfilled, (state, action) => {
      const userData = action.payload.data.data.user;
      state.isAuthenticated = true;
      state.username = userData.username;
      state.id = userData.id;
      state.iat = userData.iat;
      state.exp = userData.exp;
      localStorage.setItem("taskman_auth", JSON.stringify(state));
    });
    builder.addCase(verifyUser.rejected, (state) => {
      state.isAuthenticated = false;
      state.username = "";
      state.exp = null;
      state.iat = null;
      clearTasks();
      localStorage.removeItem("taskman_auth");
      localStorage.removeItem("taskman_tasks");
    });
  },
});

export const { clearUser } = authSlice.actions;
export default authSlice.reducer;
