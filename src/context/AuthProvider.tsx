import { createContext,useEffect,useState } from "react";
export  interface AuthState {
  userId: string;
  password:string,
  accessToken: string;
  roles: string[];
}

interface AuthContextType {
  auth: AuthState | null;
  setAuth: React.Dispatch<React.SetStateAction<AuthState | null>>;
}


export const AuthContext = createContext<any>({});

export const AuthProvider=({children}:{ children: React.ReactNode })=>{
    
     const [auth, setAuth] = useState<any>({});
     const [isLoading, setIsLoading] = useState(true);
     useEffect(() => {
        console.log("AUTH CHANGED:", auth);
    }, [auth]);
    return(
        <AuthContext.Provider value={{auth,setAuth,isLoading}}>
            {children}
        </AuthContext.Provider>

    )
}


export default AuthContext