import SendRequest from "@/utils/sendRequest";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAllMaintaince = createAsyncThunk("/maintenance/getall", async (payload, thunkAPI) => {
  const url = "/maintenance";
  let res = await SendRequest(url, payload, thunkAPI, "GET");
  return res;
});

// create
export const createMaintaince = createAsyncThunk("/maintenance/create", async (payload, thunkAPI) => {
  const url = "/maintenance";
  let res = await SendRequest(url, payload, thunkAPI, "POST");
  return res;
});
// update
export const updateMaintaince = createAsyncThunk("/maintenance/update", async (payload, thunkAPI) => {
  const url = `/maintenance/${payload.service_id}`;
  let res = await SendRequest(url, payload, thunkAPI, "PUT");
  return res;
});

// delete
export const deleteMaintaince = createAsyncThunk("/maintenance/delete", async (payload, thunkAPI) => {
  const url = `/maintenance/${payload.service_id}`;
  let res = await SendRequest(url, payload, thunkAPI, "DELETE");
  return res;
});
