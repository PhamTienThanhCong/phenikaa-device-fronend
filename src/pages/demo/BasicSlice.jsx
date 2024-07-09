import { createSlice } from '@reduxjs/toolkit';
import { getAllDemo } from './BasicApi';

const initialState = {
  users: [],
  isGetUser: false
};

export const demoSlice = createSlice({
  name: 'demo',
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = [...action.payload];
    },
    setIsGetUser: (state, action) => {
      state.isGetUser = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getAllDemo.fulfilled, (state, action) => {
      state.users = [...action.payload.data];
      state.isGetUser = true;
    });
    builder.addCase(getAllDemo.rejected, (state) => {
      // xu ly lo
      state.users = [];
      state.isGetUser = false;
    });
  }
});

export const { setUsers, setIsGetUser } = demoSlice.actions;
export default demoSlice.reducer;
