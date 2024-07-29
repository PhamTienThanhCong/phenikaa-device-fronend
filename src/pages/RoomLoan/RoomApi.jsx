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
