 import  { axiosPrivate } from "../api/axios";
 import { useEffect } from "react";
 import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";
 

const useAxiosPrivate=()=>{
    const refresh=useRefreshToken()
    const {auth}=useAuth()


    useEffect(()=>{
        const requestIntercept=axiosPrivate.interceptors.request.use(
            config=>{
                // console.log("REQUEST TOKEN:", auth?.accessToken);
                console.log("SENDING TOKEN:", auth?.accessToken);
                if(!config.headers.Authorization){
                    
                    config.headers.Authorization=`Bearer ${auth?.accessToken}`
                }
                return config
            },(error)=>Promise.reject(error)
        )
        const responseIntercept=axiosPrivate.interceptors.response.use(
            response=>response,
            async (error)=>{
                const prevRequest=error?.config
                console.log("STATUS:", error?.response?.status);
                if(error?.response?.status === 401 && !prevRequest?.sent){
                    console.log("REFRESHING TOKEN");

                    prevRequest.sent=true
                    const newAccessToken= await refresh()
                    console.log("NEW TOKEN:", newAccessToken);

                    prevRequest.headers.Authorization=`JWT ${newAccessToken}`
                    
                    return axiosPrivate(prevRequest)
                }
                return Promise.reject(error)
            }
        )
        return()=>{
            axiosPrivate.interceptors.request.eject(requestIntercept)
            axiosPrivate.interceptors.response.eject(responseIntercept)
        }
    },[auth,refresh])
    return axiosPrivate
}

export default useAxiosPrivate