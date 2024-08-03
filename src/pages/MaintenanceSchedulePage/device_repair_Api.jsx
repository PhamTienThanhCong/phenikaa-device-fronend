import SendRequest from "@/utils/sendRequest";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAllDeviceRepair = createAsyncThunk("/maintenance/getal", async (payload, thunkAPI) => {
  const url = "/device-repair";
  let res = await SendRequest(url, payload, thunkAPI, "GET");
  return res;
});

export const getAllMaintenance = createAsyncThunk("/maintenance/device-category", async (payload, thunkAPI) => {
  const url = "/maintenance";
  let res = await SendRequest(url, payload, thunkAPI, "GET");
  return res;
});

export const getAllDevice = createAsyncThunk("/maintenance/device", async (payload, thunkAPI) => {
  const url = "/device";
  let res = await SendRequest(url, payload, thunkAPI, "GET");
  return res;
});

export const getAllUser = createAsyncThunk("/maintenance/user", async (payload, thunkAPI) => {
  const url = "/user";
  let res = await SendRequest(url, payload, thunkAPI, "GET");
  return res;
});

export const createDeviceRepair = createAsyncThunk("/maintenance/create", async (payload, thunkAPI) => {
  const url = "/device-repair";
  let res = await SendRequest(url, payload, thunkAPI, "POST");
  return res;
});
export const putDeviceRepair = createAsyncThunk("/maintenance/update", async (payload, thunkAPI) => {
  const url = `/device-repair/${payload.device_repair_id}`;
  let res = await SendRequest(url, payload, thunkAPI, "PUT");
  return res;
});
