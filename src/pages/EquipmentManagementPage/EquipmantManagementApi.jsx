import SendRequest from "@/utils/sendRequest";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getDeviceCategoryList = createAsyncThunk(
  "deviceCategory/get-device-category-list",
  async (payload, thunkAPI) => {
    const url = "/device-category";
    let res = await SendRequest(url, payload, thunkAPI, "GET");
    return res;
  }
);

export const createDeviceCategory = createAsyncThunk(
  "deviceCategory/create-device-category",
  async (payload, thunkAPI) => {
    const url = "/device-category/";
    let res = await SendRequest(url, payload, thunkAPI, "POST");
    return res;
  }
);

export const updateDeviceCategory = createAsyncThunk(
  "deviceCategory/create-device-category",
  async (payload, thunkAPI) => {
    const url = `/device-category/${payload.category_id}`;
    let res = await SendRequest(url, payload, thunkAPI, "PUT");
    return res;
  }
);

export const deleteDeviceCategory = createAsyncThunk(
  "deviceCategory/delete-device-category",
  async (payload, thunkAPI) => {
    const url = `/device-category/${payload.category_id}`;
    let res = await SendRequest(url, payload, thunkAPI, "DELETE");
    return res;
  }
);

// api get list device
export const getDeviceList = createAsyncThunk("deviceCategory/get-device-list", async (payload, thunkAPI) => {
  const url = "/device";
  let res = await SendRequest(url, payload, thunkAPI, "GET");
  return res;
});

//create device
export const createDevice = createAsyncThunk("deviceCategory/create-device", async (payload, thunkAPI) => {
  const url = "/device";
  let res = await SendRequest(url, payload, thunkAPI, "POST");
  return res;
});

//update device
export const updateDevice = createAsyncThunk("deviceCategory/update-device", async (payload, thunkAPI) => {
  const url = `/device/${payload.device_id}`;
  let res = await SendRequest(url, payload, thunkAPI, "PUT");
  return res;
});

//delete device
export const deleteDevice = createAsyncThunk("deviceCategory/delete-device", async (payload, thunkAPI) => {
  const url = `/device/${payload.device_id}`;
  let res = await SendRequest(url, payload, thunkAPI, "DELETE");
  return res;
});
