import { createSlice } from "@reduxjs/toolkit";
import { getAllMaintaince } from "./maintainceAPI";

const initialState = {
  maintenanceList: [],
  isGetAll: false
};

export const maintenanceSlice = createSlice({
  name: "maintenance",
  initialState,
  reducers: {
    setMaintenance: (state, action) => {
      // state.users = [...action.payload];
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getAllMaintaince.fulfilled, (state, action) => {
      state.maintenanceList = [...action.payload];
      state.isGetAll = true;
    });
  }
});

export const { setMaintenance } = maintenanceSlice.actions;
export default maintenanceSlice.reducer;
