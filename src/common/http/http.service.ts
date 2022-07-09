import { Injectable } from '@nestjs/common';
import {
  AxiosPromise,
  AxiosRequestConfig,
  AxiosResponse,
  default as axios,
} from 'axios';

@Injectable()
export class HttpService {
  get<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T> {
    return axios.get(url, config);
  }

  post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return axios.post(url, data, config);
  }

  put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return axios.put(url, data, config);
  }

  /**
   * We can define other methods as per our needs
   */
}
