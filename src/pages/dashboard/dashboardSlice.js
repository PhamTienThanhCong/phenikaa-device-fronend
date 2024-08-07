import { createSlice } from "@reduxjs/toolkit";
import { getDeviceList, getRoomList } from "./dashboardApi";

const initialState = {
  deviceList: [],
  isGetAll: false,
  roomList: [],
  isGetRoom: false
};

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setDashboard: (state, action) => {
      // state.users = [...action.payload];
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getDeviceList.fulfilled, (state, action) => {
      state.deviceList = [...action.payload];
      state.isGetAll = true;
    });
    builder.addCase(getRoomList.fulfilled, (state, action) => {
      state.roomList = [...action.payload];
      state.isGetRoom = true;
    });
  }
});

export const { setDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer;
