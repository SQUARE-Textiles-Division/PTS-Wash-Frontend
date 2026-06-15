import axios from "../api/axios";
import type { AuthState } from "../context/AuthProvider";
import useAuth from "./useAuth";


const useRefreshToken=()=>{
    const {setAuth}=useAuth()
    const refresh=async()=>{
        const response=await axios.get('/auth/jwt/refresh/',{
            withCredentials:true
        })
        setAuth((prev: AuthState | null) => {
            if (!prev) return prev;
            // console.log(data?.accessToken)
            return {...prev,accessToken:response.data.access}
        })
        return response.data.access
    }
    return refresh
}
export default useRefreshToken