import SendRequest from "@/utils/sendRequest";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getErrorReportsList = createAsyncThunk("errorReports/get-notify", async (payload, thunkAPI) => {
  const url = "/notify";
  let res = await SendRequest(url, payload, thunkAPI, "GET");
  return res;
});

export const markAsRead = createAsyncThunk("errorReports/mark-as-read", async (payload, thunkAPI) => {
  const url = `/notify/${payload.notify_id}/readd`;
  let res = await SendRequest(url, payload, thunkAPI, "PUT");
  return res;
});

// get all customer

export const getAllCustomer = createAsyncThunk("errorReports/get-all-customer", async (payload, thunkAPI) => {
  const url = "/customer/?limit=1000&offset=0";
  let res = await SendRequest(url, payload, thunkAPI, "GET");
  return res;
});
// create report
export const createReport = createAsyncThunk("errorReports/create-report", async (payload, thunkAPI) => {
  const url = "/notify";
  let res = await SendRequest(url, payload, thunkAPI, "POST");
  return res;
});
