import { createSlice } from "@reduxjs/toolkit";
import { getCustomer } from "./CustomerAPI";
import { getUser } from "./CustomerAPI";

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
  }
});

export const { setCustomer } = customerSlice.actions;
export const { setUser } = customerSlice.actions;
export const { setCreateUser } = customerSlice.actions;
export const { setUpdateUser } = customerSlice.actions;
export const { clearError } = customerSlice.actions;
export default customerSlice.reducer;
