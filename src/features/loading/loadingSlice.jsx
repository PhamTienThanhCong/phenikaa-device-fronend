import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: false,
  timer: 1000
};

const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    toggle(state, action) {
      state.value = action.payload;
    },
    startBusy(state, action) {
      state.value = true;
      if (action.payload > -1) {
        state.timer = action.payload;
      }
    },
    endBusy(state) {
      state.value = false;
      state.timer = 500;
    }
  }
});

export const { toggle, startBusy, endBusy } = loadingSlice.actions;
export default loadingSlice.reducer;
