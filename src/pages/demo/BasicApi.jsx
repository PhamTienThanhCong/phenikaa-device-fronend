import SendRequest from '@/utils/sendRequest';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const getAllDemo = createAsyncThunk('demo/get-user', async (payload, thunkAPI) => {
  const url = '/users';
  let res = await SendRequest(url, payload, thunkAPI, 'GET');
  return res;
});
