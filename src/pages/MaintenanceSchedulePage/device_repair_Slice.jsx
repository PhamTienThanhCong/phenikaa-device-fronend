import { createSlice } from "@reduxjs/toolkit";
import { getAllDeviceRepair, getAllMaintenance, getAllDevice, getAllUser } from "./device_repair_Api";

const initialState = {
  maintenanceList: [],
  isGetAll: false,
  deviceCategoryList: [],
  isGetAllMaintenance: false,
  deviceList: [],
  isGetAllDevice: false,
  userList: [],
  isGetAllUser: false
};

export const device_repair_Slice = createSlice({
  name: "device_repair",
  initialState,
  reducers: {
    setMaintenance: (state, action) => {
      // state.users = [...action.payload];
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getAllDeviceRepair.fulfilled, (state, action) => {
      state.maintenanceList = [...action.payload];
      state.isGetAll = true;
    });
    builder.addCase(getAllMaintenance.fulfilled, (state, action) => {
      state.deviceCategoryList = [...action.payload];
      state.isGetAllDeviceCategory = true;
    });
    builder.addCase(getAllDevice.fulfilled, (state, action) => {
      state.deviceList = [...action.payload];
      state.isGetAllDevice = true;
    });
    builder.addCase(getAllUser.fulfilled, (state, action) => {
      state.userList = [...action.payload];
      state.isGetAllUser = true;
    });
  }
  //  trường hợp tạo loại thiết bị
});

export const { setMaintenance } = device_repair_Slice.actions;
export default device_repair_Slice.reducer;
