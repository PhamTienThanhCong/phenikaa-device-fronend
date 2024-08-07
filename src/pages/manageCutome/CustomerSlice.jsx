import { createSlice } from "@reduxjs/toolkit";
import { getCustomer } from "./CustomerAPI";
import { getUser, createUser, editUser } from "./CustomerAPI";

const initialState = {
  customer: [],
  isCustomer: false,
  users: [],
  isUser: false,
  createUser: [],
  isCreateUser: false,
  updateUser: [],
  isUpdateCreateUser: false,
  error: null
};

export const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    setCustomer: (state, action) => {
      state.users = [...action.payload];
    },
    setUser: (state, action) => {
      state.users = [...action.payload];
    },
    setCreateUser: (state, action) => {
      state.createUser = [...action.payload];
    },
    setUpdateUser: (state, action) => {
      state.updateUser = [...action.payload];
    },

    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getCustomer.fulfilled, (state, action) => {
      state.customer = [...action.payload];
      state.isCustomer = true;
    });
    builder.addCase(getUser.fulfilled, (state, action) => {
      state.users = [...action.payload];
      state.isUser = true;
    });
    builder.addCase(createUser.fulfilled, (state, action) => {
      state.createUser = [...action.payload];
      state.isCreateUser = true;
    });
    builder.addCase(editUser.fulfilled, (state, action) => {
      state.updateUser = [...action.payload];
      state.isUpdateCreateUser = true;
    });
    builder.addCase(createUser.rejected, (state, action) => {
      state.error = action.meta.respone.data.detail | "Lỗi không xác định";
    });
    builder.addCase(editUser.rejected, (state, action) => {
      state.error = action.meta.respone.data.detail | "Lỗi không xác định";
    });
  }
});

export const { setCustomer } = customerSlice.actions;
export const { setUser } = customerSlice.actions;
export const { setCreateUser } = customerSlice.actions;
export const { setUpdateUser } = customerSlice.actions;
export const { clearError } = customerSlice.actions;
export default customerSlice.reducer;
