import SendRequest from "@/utils/sendRequest";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const createUser = createAsyncThunk("customer/create-user", async (payload, thunkAPI) => {
  const url = "/user";
  let res = await SendRequest(url, payload, thunkAPI, "POST");
  return res;
});

export const getCustomer = createAsyncThunk("customer/get-customer?limit=100&offset=0", async (payload, thunkAPI) => {
  const url = "/customer";
  let res = await SendRequest(url, payload, thunkAPI, "GET");
  return res;
});

export const getUser = createAsyncThunk("customer/get-user", async (payload, thunkAPI) => {
  const url = "/user";
  let res = await SendRequest(url, payload, thunkAPI, "GET");
  return res;
});
export const deleteUser = createAsyncThunk("customer/delete-user", async (payload, thunkAPI) => {
  const url = `/user/${payload.user_id}`;
  let res = await SendRequest(url, payload, thunkAPI, "DELETE");
  return res;
});
export const editUser = createAsyncThunk("customer/edit-user", async (payload, thunkAPI) => {
  const url = `/user/${payload.user_id}`;
  let res = await SendRequest(url, payload, thunkAPI, "PUT");
  return res;
});
