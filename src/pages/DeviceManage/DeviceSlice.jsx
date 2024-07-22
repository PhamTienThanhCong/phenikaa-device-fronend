import { createSlice } from "@reduxjs/toolkit";
import { getDeviceList } from "./DeviceApi";
const initialState = {
  device: [],
  isDevice: false
};

export const deviceSlice = createSlice({
  name: "device",
  initialState,
  reducers: {
    setDevice: (state, action) => {
      state.users = [...action.payload];
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getDeviceList.fulfilled, (state, action) => {
      state.device = [...action.payload];
      state.isDevice = true;
    });
  }
});

export const { setDevice } = deviceSlice.actions;
export default deviceSlice.reducer;
