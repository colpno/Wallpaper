import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

import axiosInstance from '~/configs/axiosConf.ts';
import { ApiResponse } from '~/types/index.ts';

const request = async <D extends unknown | unknown[] | void = void>(
  options: AxiosRequestConfig
) => {
  type Response = D extends void ? void : ApiResponse<D>;

  const onSuccess = ({ data }: AxiosResponse<Response>) => data;

  const onError = (error: AxiosError<Response>) =>
    Promise.reject({
      message: error.message,
      code: error.code,
      response: error.response,
    });

  return await axiosInstance<Response>(options).then(onSuccess).catch(onError);
};

export default request;
