import { createContext,useState } from "react";
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
    return(
        <AuthContext.Provider value={{auth,setAuth}}>
            {children}
        </AuthContext.Provider>

    )
}


export default AuthContext