import { createSlice } from "@reduxjs/toolkit";
import { getErrorReportsList, getAllCustomer } from "./errorReportsApi";

const initialState = {
  notify: [],
  isnotify: false,
  users: [],
  isUser: false
};

export const notifySlice = createSlice({
  name: "notify",
  initialState,
  reducers: {
    setnotify: (state, action) => {
      state.users = [...action.payload];
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getErrorReportsList.fulfilled, (state, action) => {
      state.notify = [...action.payload];
      state.isnotify = true;
    });
    builder.addCase(getAllCustomer.fulfilled, (state, action) => {
      state.users = [...action.payload];
      state.isUser = true;
    });
  }
  //  trường hợp tạo loại thiết bị
});

export const { setnotify } = notifySlice.actions;
export default notifySlice.reducer;
