import SendRequest from "@/utils/sendRequest";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getDeviceList = createAsyncThunk("device/get-device", async (payload, thunkAPI) => {
  const url = "/device";
  let res = await SendRequest(url, payload, thunkAPI, "GET");
  return res;
});
