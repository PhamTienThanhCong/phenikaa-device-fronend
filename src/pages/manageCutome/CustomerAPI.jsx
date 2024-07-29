import SendRequest from "@/utils/sendRequest";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const createUser = createAsyncThunk("customer/create-user", async (payload, thunkAPI) => {
  const url = "/user";
  let res = await SendRequest(url, payload, thunkAPI, "POST");
  return res;
});

export const getCustomer = createAsyncThunk("customer/get-customer", async (payload, thunkAPI) => {
  const url = "/customer";
  let res = await SendRequest(url, payload, thunkAPI, "GET");
  return res;
});

export const getUser = createAsyncThunk("customer/get-user", async (payload, thunkAPI) => {
  const url = "/user";
  let res = await SendRequest(url, payload, thunkAPI, "GET");
  return res;
});
