import { createSlice } from "@reduxjs/toolkit";
import { getProfile } from "./profileApi";

const initialState = {
  profileList: [],
  isGetAll: false
};

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setprofile: (state, action) => {
      state.profileList = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getProfile.fulfilled, (state, action) => {
      state.profileList = action.payload;
      state.isGetAll = true;
    });
  }
});

export const { setprofile } = profileSlice.actions;
export default profileSlice.reducer;
