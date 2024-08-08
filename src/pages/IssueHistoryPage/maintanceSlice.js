import { createSlice } from "@reduxjs/toolkit";
import { getAllMaintaince, createMaintaince } from "./maintainceAPI";

const initialState = {
  maintenanceList: [],
  isGetAll: false,
  create: [],
  isCreate: false,

  error: null,
  success: null
};

export const maintenanceSlice = createSlice({
  name: "maintenance",
  initialState,
  reducers: {
    setMaintenance: (state, action) => {
      // state.users = [...action.payload];
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getAllMaintaince.fulfilled, (state, action) => {
      state.maintenanceList = [...action.payload];
      state.isGetAll = true;
    });
    builder.addCase(createMaintaince.fulfilled, (state, action) => {
      console.log("action.payload", action);

      state.create = [...state.create, action.payload];
    });
    builder.addCase(createMaintaince.rejected, (state, action) => {
      state.error = action.meta.response.data.detail || "Lỗi không xác định";
    });
  }
});

export const { setMaintenance } = maintenanceSlice.actions;
export const { clearError } = maintenanceSlice.actions;
export default maintenanceSlice.reducer;
