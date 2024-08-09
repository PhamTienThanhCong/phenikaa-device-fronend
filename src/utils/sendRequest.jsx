import { notification } from "antd";
import axios from "axios";
import { trackPromise } from "react-promise-tracker";

function refactorURL(url) {
  // Xóa dấu / ở cuối URL hoặc dấu / trước dấu ?
  return url.replace(/\/(\?|$)/, "$1");
}

const SendRequest = async (url, payload, thunkAPI, method = "post") => {
  const BASE_URL = import.meta.env.VITE_API_URL_API;
  // const BASE_URL = "https://reqres.in/api";
  url = refactorURL(url);
  const token = localStorage.getItem("token") || "";
  const instance = axios.create({
    baseURL: BASE_URL,
    timeout: 30000,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`
    }
  });

  const makeRequest = async (retry = false) => {
    try {
      const dataPayload = { ...payload, retry: retry };
      const requestConfig = {
        method,
        url,
        [method.toLowerCase() === "get" ? "params" : "data"]: dataPayload
      };

      let response = await trackPromise(instance(requestConfig));
      if (response) {
        let successMessage = "";
        if (method.toLocaleLowerCase() === "post") {
          successMessage = "Dữ liệu đã được gửi và tạo thành công.";
        } else if (method.toLocaleLowerCase() === "put") {
          successMessage = "Dữ liệu đã được cập nhật thành công.";
        } else if (method.toLocaleLowerCase() === "delete") {
          successMessage = "Dữ liệu đã được xóa thành công.";
        }
        if (successMessage) {
          notification.success({
            message: "Thành công",
            description: successMessage
          });
        }
      }
      if (response.data) {
        return response.data;
      } else {
        return response;
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 500 && !retry) {
          // Gọi lại API một lần nữa
          return makeRequest(true);
        } else {
          if (error.response.status !== 403) {
            // showAlert(error.response?.data?.message, 'danger');
            // return thunkAPI.rejectWithValue(undefined, error);
            let errorMessage = "Có lỗi xảy ra khi lấy dữ liệu. Vui lòng thử lại.";
            if (method.toLocaleLowerCase() === "post") {
              errorMessage = "Có lỗi xảy ra khi gửi, tạo dữ liệu. Vui lòng thử lại.";
            } else if (method.toLocaleLowerCase() === "put") {
              errorMessage = "Có lỗi xảy ra khi cập nhật dữ liệu. Vui lòng thử lại.";
            } else if (method.toLocaleLowerCase() === "delete") {
              errorMessage = "Có lỗi xảy ra khi xóa dữ liệu. Vui lòng thử lại.";
            }
            notification.error({
              message: "Lỗi",
              description: errorMessage
            });
          }
        }
      }
      return thunkAPI.rejectWithValue(undefined, error);
    }
  };

  return makeRequest();
};

export default SendRequest;
