import { createSlice } from "@reduxjs/toolkit";
import { getCamera } from "./cameraApi";

const initialState = {
  listCamera: [],
  isGetAll: false
};

export const cameraSlice = createSlice({
  name: "camera",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    //  trường hợp tạo loại thiết bị
    builder.addCase(getCamera.fulfilled, (state, action) => {
      state.listCamera = [...action.payload];
      state.isGetAll = true;
    });
  }
});

export const { clearError } = cameraSlice.actions;
export default cameraSlice.reducer;
