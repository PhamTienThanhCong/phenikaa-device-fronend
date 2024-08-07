import SendRequest from "@/utils/sendRequest";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const createFeedback = createAsyncThunk("feedback/create-notify", async (payload, thunkAPI) => {
  const url = `/notify`;
  let res = await SendRequest(url, payload, thunkAPI, "POST");
  return res;
});

export const getInfoUserFeedback = createAsyncThunk("feedback/get-info-user", async (payload, thunkAPI) => {
  const url = `/customer/${payload.id}`;
  let res = await SendRequest(url, payload, thunkAPI, "GET");
  return res;
});
