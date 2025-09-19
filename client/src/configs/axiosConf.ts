import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

import { AuthService } from '~/apis/index.ts';
import { STORAGE_KEYS } from '~/constants/appConstants.ts';
import { apiURL } from './appConf.ts';

const configs: AxiosRequestConfig = {
  baseURL: apiURL,
};

const axiosInstance = axios.create(configs);

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (!config.headers.Authorization) {
      const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (res: AxiosResponse) => res,
  async (e) => {
    const err = e as AxiosError;
    const status = err.response?.status || null;

    // Unauthorized
    if (status === 401) {
      try {
        const {
          data: { accessToken },
        } = await AuthService.refresh();

        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

        return await axiosInstance(configs);
      } catch (error) {
        return Promise.reject(error as AxiosError);
      }
    }

    // Forbidden
    if (status === 403 && err.response?.data) {
      return Promise.reject(err.response.data);
    }

    return Promise.reject(err);
  }
);

export default axiosInstance;
