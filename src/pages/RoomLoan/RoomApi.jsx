import SendRequest from "@/utils/sendRequest";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getRoomList = createAsyncThunk("room/get-all-room", async (payload, thunkAPI) => {
  const url = "/room";
  let res = await SendRequest(url, payload, thunkAPI, "GET");
  return res;
});

export const addRoom = createAsyncThunk("room/add", async (payload, thunkAPI) => {
  const url = "/room";
  let res = await SendRequest(url, payload, thunkAPI, "POST");
  return res;
});

export const editRoom = createAsyncThunk("room/edit", async (payload, thunkAPI) => {
  const url = `/room/${payload.room_id}`;
  let res = await SendRequest(url, payload, thunkAPI, "PUT");
  return res;
});

export const deleteRoom = createAsyncThunk("room/delete", async (payload, thunkAPI) => {
  const url = `/room/${payload.room_id}`;
  let res = await SendRequest(url, payload, thunkAPI, "DELETE");
  return res;
});


export const getRoomBookingList = createAsyncThunk("room-booking/get", async (payload, thunkAPI) => {
  const url = "/room-booking";
  let res = await SendRequest(url, payload, thunkAPI, "GET");
  return res;
});

export const addRoomBooking = createAsyncThunk("room-booking/add", async (payload, thunkAPI) => {
  const url = "/room-booking";
  let res = await SendRequest(url, payload, thunkAPI, "POST");
  return res;
});

export const editRoomBooking = createAsyncThunk("room-booking/edit", async (payload, thunkAPI) => {
  const url = `/room-booking/${payload.room_id}`;
  let res = await SendRequest(url, payload, thunkAPI, "PUT");
  return res;
});

export const deleteRoomBooking = createAsyncThunk("room-booking/delete", async (payload, thunkAPI) => {
  const url = `/room-booking/${payload.room_id}`;
  let res = await SendRequest(url, payload, thunkAPI, "DELETE");
  return res;
});

export const getRoomBookingDetail = createAsyncThunk("room-booking/get-detail", async (payload, thunkAPI) => {
  const url = `/room-booking/${payload.room_booking_id}`;
  let res = await SendRequest(url, payload, thunkAPI, "GET");
  return res;
})

