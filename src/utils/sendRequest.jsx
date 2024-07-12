import axios from "axios";
import { trackPromise } from "react-promise-tracker";

const SendRequest = async (url, payload, thunkAPI, method = "post") => {
  // const BASE_URL = import.meta.env.VITE_API_URL_API;
  const BASE_URL = "https://reqres.in/api";
  const instance = axios.create({
    baseURL: BASE_URL,
    timeout: 30000,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    }
  });

  try {
    const dataPayload = { ...payload };
    const requestConfig = {
      method,
      url,
      [method.toLowerCase() === "get" ? "params" : "data"]: dataPayload
    };

    let response = await trackPromise(instance(requestConfig));
    if (response.data) {
      return response.data;
    } else {
      return response;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // showAlert(error.response?.data?.message, 'danger');
      }
      return thunkAPI.rejectWithValue(undefined, error);
    }
    return thunkAPI.rejectWithValue(undefined, error);
  }
};

export default SendRequest;
