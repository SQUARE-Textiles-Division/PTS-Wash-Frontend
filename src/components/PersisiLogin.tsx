import { useEffect ,useState} from "react";
import { Outlet } from "react-router-dom";
import useRefreshToken from "../hooks/useRefreshToken";
import useAuth from "../hooks/useAuth";

const PersistLogin = () => {
    const [isloading, setIsLoading] = useState(true);
    const refresh=useRefreshToken()
    const {auth}=useAuth()

    useEffect(() => {
        const verifyRefreshToken = async () => {
            try {
                await refresh();
            }
            catch(err){
                console.error(err)
            } 
            finally {
                setIsLoading(false);
            }
        };

       !auth?.accessToken? verifyRefreshToken():setIsLoading(false)
    }, []);
    useEffect(()=>{
        console.log(`isLoading : ${isloading}`)
        console.log(`aT: ${JSON.stringify(auth?.accessToken)}`)
    },[isloading])
    return (
        <>
            {isloading
                ?<p>Loading ... </p>
                :<Outlet/>            
            }
        </>
    )

};
export default PersistLogin