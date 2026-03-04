// apiService.js
// import axios from "axios";
import type { AxiosResponse, AxiosError } from "axios";
import axios from "axios";
// const API_BASE_URL = "http://127.0.0.1:8000"; // your base URL
// 172.26.2.94:8000/productions/received-bundles/
/**
 * Generic GET request with optional query params
 * @param {string} endpoint - e.g. "master_productions/"
 * @param {object} params - optional query params e.g. { mpo: 1 }
 * @param {function} onSuccess - callback on success
 * @param {function} onError - callback on error
 */
export interface QueryParams {
    [key: string]: any;
}

// Interface for success callback
export interface SuccessCallback<T> {
    (data: T): void;
}

// Interface for error callback
export interface ErrorCallback {
    (error: AxiosError): void;
}
export const getData = <T = any>(
    endpoint: string,
    hostAddress: string,
    data: Object = {},
    params?: QueryParams,
    onSuccess?: SuccessCallback<T>,
    onError?: ErrorCallback
    ): void => {
    axios
        .get<T>(`${hostAddress}/${endpoint}`, {
        data,
        params, 
        })
        .then((response: AxiosResponse<T>) => {
        if (onSuccess) onSuccess(response.data);
        })
        .catch((error: AxiosError) => {
        console.error(`Error fetching ${endpoint}:`, error);
        if (onError) onError(error);
        });
};



export const postData = <T = any>(
    endpoint: string,
    hostAddress:string,
    payload: Record<string, any>,
    onSuccess?: SuccessCallback<T>,
    onError?: ErrorCallback
): void => {
    axios
        .post<T>(`${hostAddress}/${endpoint}`, payload)
        .then((response: AxiosResponse<T>) => {
            if (onSuccess) onSuccess(response.data);
        })
        .catch((error: AxiosError) => {
            console.error(`Error fetching ${endpoint}:`, error);
            if (onError) onError(error);
        });
};


export const delData = <T = any>(
    endpoint: string,
    hostAddress: string,
    data: Object = {},
    params?: QueryParams,
    onSuccess?: SuccessCallback<T>,
    onError?: ErrorCallback
): void => {
    axios
        .delete<T>(`${hostAddress}/${endpoint}`, { data, params })
        .then((response: AxiosResponse<T>) => {
            if (onSuccess) onSuccess(response.data);
        })
        .catch((error: AxiosError) => {
            console.error(`Error fetching ${endpoint}:`, error);
            if (onError) onError(error);
        });
};


export const patchData = <T = any>(
    endpoint: string,
    hostAddress:string,
    payload: Record<string, any>,
    onSuccess?: SuccessCallback<T>,
    onError?: ErrorCallback
): void => {
    axios
        .patch<T>(`${hostAddress}/${endpoint}`, payload)
        .then((response: AxiosResponse<T>) => {
            if (onSuccess) onSuccess(response.data);
        })
        .catch((error: AxiosError) => {
            console.error(`Error fetching ${endpoint}:`, error);
            if (onError) onError(error);
        });
};

export const getDataAsync = async <T = any>(
  endpoint: string,
  hostAddress: string,
  data: Object = {},
  params?: Record<string, any>
): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await axios.get<T>(`${hostAddress}/${endpoint}`, {
      data,
      params,
    });
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error; // Caller can handle the error with try/catch
  }
};