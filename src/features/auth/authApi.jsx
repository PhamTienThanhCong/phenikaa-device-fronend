import SendRequest from "@/utils/sendRequest";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const loginAction = createAsyncThunk("auth/login", async (payload, thunkAPI) => {
  const url = "/auth/login";
  let res = await SendRequest(url, payload, thunkAPI, "POST");
  return res;
});

export const getUserData = createAsyncThunk("auth/get-me", async (payload, thunkAPI) => {
  const url = "/auth/me";
  let res = await SendRequest(url, payload, thunkAPI, "GET");
  return res;
});
