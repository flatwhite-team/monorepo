import axios, { AxiosResponse, Method } from "axios";

import getEnvVars from "../../environment";

const { apiUrl } = getEnvVars();

axios.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  },
);

interface FetcherParams {
  url: string;
  method?: Method;
  data?: any;
  params?: any;
  config?: { [key: string]: any };
  baseURL?: string;
  headers?: any;
  withCredentials?: boolean;
  loading?: boolean;
}

export const apiClient = async <T>({
  url,
  method = "GET",
  data = null,
  params = null,
  baseURL = apiUrl,
  headers,
  config,
  withCredentials = true,
}: FetcherParams): Promise<T> => {
  const result: AxiosResponse<T> = await axios({
    method,
    url,
    data,
    params,
    baseURL,
    headers,
    withCredentials,
    timeout: 120000,
    ...config,
  });

  return result.data;
};
