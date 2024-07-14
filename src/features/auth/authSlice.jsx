import { createSlice } from "@reduxjs/toolkit";
import { getUserData, loginAction } from "./authApi";

const initialState = {
  currentUser: {},
  isLogin: false,
  rememberPage: "/"
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginOut: (state) => {
      state.users = {};
      state.isLogin = false;
      // remove token in local storage
      localStorage.removeItem("token");
    }
  },
  extraReducers: (builder) => {
    builder.addCase(loginAction.fulfilled, (state, action) => {
      localStorage.setItem("token", action.payload.access_token);
    });
    builder.addCase(getUserData.fulfilled, (state, action) => {
      state.currentUser = action.payload;
      state.isLogin = true;
    });
    builder.addCase(getUserData.rejected, (state) => {
      state.currentUser = {};
      state.isLogin = false;
      // remove token in local storage
      localStorage.removeItem("token");
    });
  }
});

export const { loginOut } = authSlice.actions;
export default authSlice.reducer;
