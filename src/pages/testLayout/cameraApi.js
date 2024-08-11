import SendRequest from "@/utils/sendRequest";
import { createAsyncThunk } from "@reduxjs/toolkit";

// api get
export const getCamera = createAsyncThunk("/camera/get", async (payload, thunkAPI) => {
  const url = "/camera";
  let res = await SendRequest(url, payload, thunkAPI, "GET");
  return res;
});

// api post
export const createCamera = createAsyncThunk("/camera/create", async (payload, thunkAPI) => {
  const url = "/camera";
  let res = await SendRequest(url, payload, thunkAPI, "POST");
  return res;
});

// api put
export const updateCamera = createAsyncThunk("/camera/update", async (payload, thunkAPI) => {
  const url = `/camera/${payload.id}`;
  let res = await SendRequest(url, payload, thunkAPI, "PUT");
  return res;
});
export const deleteCamera = createAsyncThunk("/camera/delete", async (payload, thunkAPI) => {
  const url = `/camera/${payload.id}`;
  let res = await SendRequest(url, payload, thunkAPI, "DELETE");
  return res;
});
