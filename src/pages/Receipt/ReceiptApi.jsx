import SendRequest from "@/utils/sendRequest";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getRoomBookingReceipt = createAsyncThunk("receipt/room-booking", async (payload, thunkAPI) => {
  const url = `/room-booking/${payload.id}`;
  let res = await SendRequest(url, payload, thunkAPI, "GET");
  return res;
});
