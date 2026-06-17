import axios from "../api/axios";
import type { AuthState } from "../context/AuthProvider";

import useAuth from "./useAuth";


const useRefreshToken=()=>{
    const {setAuth}=useAuth()

    // const prevRole=auth?.roles
    // console.log('Set PrevRole',prevRole)
    const refresh=async()=>{
        const response=await axios.post(`/auth/jwt/refresh/`,
        {},
        {
            withCredentials:true
        })
        console.log("Refresh response:", response.data);

        setAuth((prev: AuthState | null) => {
            if (!prev) return prev;
            // console.log(data?.accessToken)
            console.log('Previous',prev)
            return {
                userId:response.data.user,
                roles:response.data.roles,
                accessToken:response.data.access
            }
        })
        console.log(response.data.access)
        // console.log(auth)
        return response.data.access
    }
    return refresh
}
export default useRefreshToken