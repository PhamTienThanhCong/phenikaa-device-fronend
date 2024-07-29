import SendRequest from "@/utils/sendRequest";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getDeviceList = createAsyncThunk("device/get-device", async (payload, thunkAPI) => {
  const url = "/device-category";
  let res = await SendRequest(url, payload, thunkAPI, "GET");
  return res;
});

export const createDeviceCategory = createAsyncThunk("device/create-device-category", async (payload, thunkAPI) => {
  const url = "/device-category/";
  let res = await SendRequest(url, payload, thunkAPI, "POST");
  return res;
});
