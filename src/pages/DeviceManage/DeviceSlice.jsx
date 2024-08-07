import { createSlice } from "@reduxjs/toolkit";
import { getDeviceList, getBookingDeviceList, borrowDevice, returnDevice } from "./DeviceApi";
const initialState = {
  device: [],
  isDevice: false,
  deviceBooking: [],
  isDeviceBooking: false,
  error: null
};

export const deviceSlice = createSlice({
  name: "device",
  initialState,
  reducers: {
    setDevice: (state, action) => {
      state.users = [...action.payload];
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getDeviceList.fulfilled, (state, action) => {
      state.device = [...action.payload];
      state.isDevice = true;
    });
    builder.addCase(getBookingDeviceList.fulfilled, (state, action) => {
      state.deviceBooking = [...action.payload];
      state.isDeviceBooking = true;
    });
    builder.addCase(borrowDevice.fulfilled, (state, action) => {
      state.deviceBooking = [...state.deviceBooking, action.payload];
    });
    builder.addCase(borrowDevice.rejected, (state, action) => {
      state.error = action.meta.response.data.detail;  // Xử lý lỗi
    });
    builder.addCase(returnDevice.rejected, (state, action) => {
      state.error = action.meta.response.data.detail;  // Xử lý lỗi
    });
    builder.addCase(returnDevice.fulfilled, (state, action) => {
      state.deviceBooking = state.deviceBooking.map((item) => {
        if (item.id === action.payload.id) {
          return action.payload;
        }
        return item;
      });
    });



  }
});

export const { setDevice, clearError } = deviceSlice.actions;
export default deviceSlice.reducer;
