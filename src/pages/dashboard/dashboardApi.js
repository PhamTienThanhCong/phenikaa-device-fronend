import SendRequest from "@/utils/sendRequest";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getDeviceList = createAsyncThunk("deviceCategory/get-device-list", async (payload, thunkAPI) => {
  const url = "/device";
  let res = await SendRequest(url, payload, thunkAPI, "GET");
  return res;
});

export const getRoomList = createAsyncThunk("deviceCategory/get-room-list", async (payload, thunkAPI) => {
  const url = "/room";
  let res = await SendRequest(url, payload, thunkAPI, "GET");
  return res;
});
