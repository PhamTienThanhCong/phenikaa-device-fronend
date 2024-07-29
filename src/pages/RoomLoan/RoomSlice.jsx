import { createSlice } from "@reduxjs/toolkit";
import { addRoom, getRoomList } from "./RoomApi";
const initialState = {
  roomList: [],
  isGetRoom: false
};

export const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    setDevice: (state, action) => {
      // state.users = [...action.payload];
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getRoomList.fulfilled, (state, action) => {
      state.roomList = [...action.payload];
      state.isGetRoom = true;
    });
    builder.addCase(addRoom.fulfilled, (state, action) => {
      state.roomList = [...state.roomList, action.payload];
    });
  }
  //  trường hợp tạo loại thiết bị
});

export const { setDevice } = roomSlice.actions;
export default roomSlice.reducer;
