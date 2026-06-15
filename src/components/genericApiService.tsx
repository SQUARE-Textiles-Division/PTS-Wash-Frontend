// apiService.js
// import axios from "axios";
import type { AxiosResponse, AxiosError } from "axios";
import axios from "axios";
import useAxiosPrivate from "../hooks/useAxiosPrivate";



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
export const useApiService = () => {
    const axiosPrivate = useAxiosPrivate();

    const getData = <T = any>(
    endpoint: string,
    hostAddress: string,
    data: Object = {},
    params?: QueryParams,
    onSuccess?: SuccessCallback<T>,
    onError?: ErrorCallback
    ): void => {
        axiosPrivate
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



    const postData = <T = any>(
        endpoint: string,
        hostAddress:string,
        payload: Record<string, any>,
        onSuccess?: SuccessCallback<T>,
        onError?: ErrorCallback
    ): void => {
        axiosPrivate
            .post<T>(`${hostAddress}/${endpoint}`, payload)
            .then((response: AxiosResponse<T>) => {
                if (onSuccess) onSuccess(response.data);
            })
            .catch((error: AxiosError) => {
                console.error(`Error fetching ${endpoint}:`, error);
                if (onError) onError(error);
            });
    };


    const delData = <T = any>(
        endpoint: string,
        hostAddress: string,
        data: Object = {},
        params?: QueryParams,
        onSuccess?: SuccessCallback<T>,
        onError?: ErrorCallback
    ): void => {
        axiosPrivate
            .delete<T>(`${hostAddress}/${endpoint}`, { data, params })
            .then((response: AxiosResponse<T>) => {
                if (onSuccess) onSuccess(response.data);
            })
            .catch((error: AxiosError) => {
                console.error(`Error fetching ${endpoint}:`, error);
                if (onError) onError(error);
            });
    };


    const patchData = <T = any>(
        endpoint: string,
        hostAddress:string,
        payload: Record<string, any>,
        onSuccess?: SuccessCallback<T>,
        onError?: ErrorCallback
    ): void => {
        axiosPrivate
            .patch<T>(`${hostAddress}/${endpoint}`, payload)
            .then((response: AxiosResponse<T>) => {
                if (onSuccess) onSuccess(response.data);
            })
            .catch((error: AxiosError) => {
                console.error(`Error fetching ${endpoint}:`, error);
                if (onError) onError(error);
            });
    };

    const getDataAsync = async <T = any>(
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
    return{
        getData,
        postData,
        patchData,
        delData,
        getDataAsync
   
    }
}
