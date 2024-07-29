import { createSlice } from "@reduxjs/toolkit";
import { getDeviceList } from "./DeviceApi";
import { createDeviceCategory } from "./DeviceApi";
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
    builder.addCase(createDeviceCategory.fulfilled, (state, action) => {
      state.device = [...action.payload];
      state.isDevice = true;
    });
  }
  //  trường hợp tạo loại thiết bị
});

export const { setDevice } = deviceSlice.actions;
export default deviceSlice.reducer;
