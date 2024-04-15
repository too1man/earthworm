import type { AxiosInstance, AxiosResponse } from "axios";
import axios from "axios";
import { isProd } from "~/utils/env";
import { checkHaveToken, getToken } from "~/utils/token";

export const http: AxiosInstance = axios.create({
  baseURL: isProd()
    ? "https://earthworm.cuixueshe.com/api"
    : `http://${location.hostname}:3001`,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

http.interceptors.request.use((config) => {
  if (checkHaveToken()) config.headers.Authorization = `Bearer ${getToken()}`;

  return config;
});

http.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error) => {
    const { message } = error.response.data;
    httpStatusErrorHandler?.(message, error.response.status);
    return Promise.reject(error);
  }
);

type HttpStatusErrorHandler = (message: string, statusCode: number) => void;
let httpStatusErrorHandler: HttpStatusErrorHandler;
export function injectHttpStatusErrorHandler(handler: HttpStatusErrorHandler) {
  httpStatusErrorHandler = handler;
}
