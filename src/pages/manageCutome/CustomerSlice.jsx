import { createSlice } from "@reduxjs/toolkit";
import { getCustomer } from "./CustomerAPI";
import { getUser, createUser } from "./CustomerAPI";

const initialState = {
  customer: [],
  isCustomer: false,
  users: [],
  isUser: false,
  createUser: [],
  isCreateUser: false
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
  }
});

export const { setCustomer } = customerSlice.actions;
export const { setUser } = customerSlice.actions;
export const { setCreateUser } = customerSlice.actions;
export default customerSlice.reducer;
