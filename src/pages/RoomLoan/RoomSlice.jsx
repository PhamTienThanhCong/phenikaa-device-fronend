import { createSlice } from "@reduxjs/toolkit";
import { addRoom, getRoomList, getRoomBookingList, addRoomBooking } from "./RoomApi";
const initialState = {
  roomList: [],
  isGetRoom: false,
  roomBooking: [],
  isRoomBooking: false,
  error: null
};

export const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    setDevice: (state, action) => {
      // state.users = [...action.payload];
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getRoomList.fulfilled, (state, action) => {
      state.roomList = [...action.payload];
      state.isGetRoom = true;
    });
    builder.addCase(getRoomList.rejected, (state, action) => {
      state.error = action.meta.response.data.detail; // Xử lý lỗi
    });
    builder.addCase(addRoom.fulfilled, (state, action) => {
      state.roomList = [...state.roomList, action.payload];
    });
    builder.addCase(addRoom.rejected, (state, action) => {
      state.error = action.meta.response.data.detail; // Xử lý lỗi
    });
    builder.addCase(getRoomBookingList.fulfilled, (state, action) => {
      state.roomBooking = [...action.payload];
      state.isRoomBooking = true;
    });
    builder.addCase(getRoomBookingList.rejected, (state, action) => {
      state.error = action.meta.response.data.detail; // Xử lý lỗi
    });

    builder.addCase(addRoomBooking.rejected, (state, action) => {
      state.error = action.meta.response.data.detail; // Xử lý lỗi
    });
  }
  //  trường hợp tạo loại thiết bị
});

export const { setDevice, clearError } = roomSlice.actions;
export default roomSlice.reducer;
