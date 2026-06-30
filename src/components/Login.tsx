import {  useRef, useState } from "react";
import { useNavigate,useLocation } from "react-router-dom";
import logo from '../assets/PTS Wash Logo.png'
import useAuth from "../hooks/useAuth";
import { LOGIN_URL } from "../LoginUrl";
import {
  Box,
  Button,
  Card,
  CardContent,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
// import ROLES from "../Roles";

function Login() {
  const [errorLog,setErrorLog]=useState("")
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
    catch(error:any){
         let msg=""
            if (error instanceof Error && error.message === "Network Error") {
                console.log("Network Error");
                msg="Network Error"
                        
            }
            
            else if(error.response.data){
                Object.entries(error.response.data).forEach(([_, value]) => {
                    if (Array.isArray(value)) {
                        msg += value[0];
                    } else {
                        msg += value;
                    }
                });
                
            }
            
          setErrorLog(msg)
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
        {/* <div>
           
        </div> */}
      <Card sx={{ width: 400 }}>
        <CardContent>
          {/* <Typography variant="h5" align="center" gutterBottom>
            PTS Wash User Login
          </Typography> */}

          <Box
            component="form"
            // onSubmit={handleLogin}
            display="flex"
            flexDirection="column"
            gap={2}
          >
            <img src={logo} style={{
                paddingTop:20,
                height:'50%',
                width:'50%',
                objectFit:'contain',
                marginLeft:'25%'
                // left:'50%'
                // border:'none'
                // display:'block'
                // height:100,
                // width:100
           }}></img>
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
             <p style={{
              fontSize:12
             }}><i>Dev.. by Software Eng.. Team (ERP)</i></p>
          </Box>
        </CardContent>
      </Card>
      <Modal open={errorLog!=''} onClose={() => setErrorLog('')}>
                <Box
                    sx={{
                    position: "fixed", // ← changed from absolute
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    // bgcolor: "rgba(0,0,0,0.5)", // dark overlay
                    }}
                >
                    <Box
                    sx={{
                        bgcolor: "white", // light red background for error
                        p: 4,
                        borderRadius: 2,
                        color: "red", // red text for error
                        width: 400,
                    }}
                    >
                    <Typography variant="h6">{errorLog}</Typography>
                    {/* <Typography>Already batches are allocated according to this plan */}
                    {/* </Typography> */}
                    <Button sx={{ mt: 2 }} onClick={() => setErrorLog('')}>Close</Button>
                    </Box>
                </Box>
            </Modal>
    </Box>
  );
}

export default Login;