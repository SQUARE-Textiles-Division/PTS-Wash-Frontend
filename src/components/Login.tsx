import { useEffect, useRef, useState,useContext } from "react";
import { useNavigate,useLocation,Link, replace } from "react-router-dom";
import logo from '../assets/PTS Wash Logo.png'
import useAuth from "../hooks/useAuth";
import { LOGIN_URL } from "../LoginUrl";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import ROLES from "../Roles";

function Login() {
  const {setAuth}=useAuth()
  const navigate = useNavigate();
  const location=useLocation()
  const from=location.state?.from?.pathname||'/'
  const userRef=useRef<HTMLInputElement>(null);
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");


//   useEffect(()=>{
//     userRef?.current?.focus()
//   },[])
  const handleLogin = async (e:any) => {
    e.preventDefault();

    try{
        const response=await axios.post(LOGIN_URL,
            JSON.stringify({username:userId,password:password}),
            {
                headers:{'Content-Type':'application/json'},
                withCredentials:true
            }
        );
        console.log(JSON.stringify(response?.data))
        const accessToken=response?.data?.access
        const roles=response?.data?.roles
        setAuth({userId,password,accessToken,roles})
        // console.log()
        setUserId('')
        setPassword('')
        console.log(roles)
        navigate(from,{replace:true})
    }
    catch(error){
        console.log(error)
    }
  };

  return (
    <Box
      display="flex"
      flexDirection={"column"}
      justifyContent="center"
      alignItems="center"
      minHeight="50vh"
    //    onMouseDown={(e) => {
    //         // prevents unwanted focus restoration
    //         e.preventDefault();
    //     }}
    >
        <div>
           <img src={logo} style={{
                height:'50%',
                width:'50%',
                objectFit:'contain',
                // border:'none'
                // display:'block'
                // height:100,
                // width:100
           }}></img>
        </div>
      <Card sx={{ width: 400 }}>
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom>
            PTS Wash User Login
          </Typography>

          <Box
            component="form"
            // onSubmit={handleLogin}
            display="flex"
            flexDirection="column"
            gap={2}
          >
            <TextField
              label="User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              fullWidth
              required
              inputRef={userRef}
            />

            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
            />

            <Button
              type="submit"
              onClick={handleLogin}
              variant="contained"
              sx={{
                // position:'fixed',
                width:100,
                left:'35%',
                 backgroundColor: "#485e68",
                '&:hover': {
                    backgroundColor: '#37474f',
                },
              }}
            //   size="large"
            //   fullWidth
            >
              Login
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Login;