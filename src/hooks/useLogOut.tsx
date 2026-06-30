// import axios from "../api/axios";
import useAxiosPrivate from "./useAxiosPrivate";
import useAuth from "./useAuth";
// import useRefreshToken from "./useRefreshToken";


const useLogOut=()=>{
    const {setAuth}=useAuth()
    const axiosPrivate=useAxiosPrivate()
    // const accessToken=auth.accessToken
    // if(auth?.accessToken){
    //     accessToken=auth?.accessToken
    // }
    // else{
    //     const refresh=useRefreshToken()
    //     const newAccessToken=async ()=>{
    //         await refresh()
    //     }
    //     accessToken=newAccessToken
    // }
    const logout= async ()=>{
        
        try{
            await axiosPrivate.post('/auth/jwt/logout/ ',
            {},
            {
                withCredentials:true,
                //  headers: {
                //     Authorization: `JWT ${accessToken}`,
                // },
            })
            // console.log(auth)
            setAuth({})
        }
        catch (err){
            console.error(err)
        }
    }
    return logout
}

export default useLogOut