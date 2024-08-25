import { createSlice } from "@reduxjs/toolkit";
import { getDeviceCategoryList } from "./EquipmantManagementApi";
import { createDeviceCategory, getDeviceList } from "./EquipmantManagementApi";
const initialState = {
  deviceCategory: [],
  isDeviceCategory: false,
  deviceList: [],
  isDeviceList: false
};

export const deviceCategorySlice = createSlice({
  name: "deviceCategory",
  initialState,
  reducers: {
    setDevice: (state, action) => {
      state.users = [...action.payload];
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getDeviceCategoryList.fulfilled, (state, action) => {
      state.deviceCategory = [...action.payload];
      state.isDeviceCategory = true;
    });

    builder.addCase(getDeviceList.fulfilled, (state, action) => {
      state.deviceList = [...action.payload];
      state.isDeviceList = true;
    });
  }
  //  trường hợp tạo loại thiết bị
});

export const { setDevice } = deviceCategorySlice.actions;
export default deviceCategorySlice.reducer;
