import axios from "../api/axios";
import useAuth from "./useAuth";


const useLogOut=()=>{
    const {auth,setAuth}=useAuth()
    // const accessToken=auth.accessToken
    const logout= async ()=>{
        
        try{
            const response= await axios.post('/auth/jwt/logout/ ',
            {},
            {
                withCredentials:true,
                 headers: {
                    Authorization: `JWT ${auth?.accessToken}`,
                },
            })
            setAuth({})
        }
        catch (err){
            console.error(err)
        }
    }
    return logout
}

export default useLogOut