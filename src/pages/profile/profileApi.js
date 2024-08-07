import SendRequest from "@/utils/sendRequest";
import { createAsyncThunk } from "@reduxjs/toolkit";

// api get
export const getProfile = createAsyncThunk("/profile/get", async (payload, thunkAPI) => {
  const url = "/auth/me";
  let res = await SendRequest(url, payload, thunkAPI, "GET");
  return res;
});
