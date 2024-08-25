import SendRequest from "@/utils/sendRequest";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getDeviceList = createAsyncThunk("device/get-device", async (payload, thunkAPI) => {
  const url = "/device";
  let res = await SendRequest(url, payload, thunkAPI, "GET");
  return res;
});

export const getBookingDeviceList = createAsyncThunk("device/get-booking-device", async (payload, thunkAPI) => {
  const url = "/device-borrowing";
  let res = await SendRequest(url, payload, thunkAPI, "GET");
  return res;
});

export const borrowDevice = createAsyncThunk("device/borrow-device", async (payload, thunkAPI) => {
  const url = "/device-borrowing";
  let res = await SendRequest(url, payload, thunkAPI, "POST");
  return res;
});

// export const returnDevice = createAsyncThunk("device/return-device", async (payload, thunkAPI) => {
//   const url = `/device-borrowing/${payload.id}/return`;
//   let res = await SendRequest(url, payload, thunkAPI, "POST");
//   return res;
// });

// API PUT
export const updateDevice = createAsyncThunk("device/update-device", async (payload, thunkAPI) => {
  const url = `/device-borrowing/${payload.device_borrowing_id}`;
  let res = await SendRequest(url, payload, thunkAPI, "PUT");
  return res;
});

// curl -X 'GET' \
//   'https://sos-vanthuc-backend-bl1m.onrender.com/api/device-borrowing/65' \
//   -H 'accept: application/json'

export const deviceBorrowingDetail = createAsyncThunk("device/device-borrowing-detail", async (payload, thunkAPI) => {
  const url = `/device-borrowing/${payload.id}`;
  let res = await SendRequest(url, payload, thunkAPI, "GET");
  return res;
});
