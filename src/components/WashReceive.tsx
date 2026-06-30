import {Box,TextField}   from "@mui/material";
import { Modal, Typography, Button } from "@mui/material";
import type BundleInfo from "../TypeAnnotations/BundleInfo";
// import { getData,postData} from "./genericApiService";
// import { axiosPrivate } from "../api/axios";
import {  useRef,useState } from "react";
import DoneAllIcon from '@mui/icons-material/DoneAll';
// import ReceivedBundles from "./ReceivedBundles";
// import { red } from "@mui/material/colors";
import { ip, ptsip } from "../ip";
import success from '../assets/success.mp3'
import type IndividualInfo from "../TypeAnnotations/IndividualInfo";
import { useApiService } from "./genericApiService";
// import useAuth from "../hooks/useAuth";

interface Props {
    items: IndividualInfo[];
    setItems: React.Dispatch<React.SetStateAction<IndividualInfo[]>>;
}

export default function WashReceive({items, setItems}: Props){
    const {getData}=useApiService()
    const {postData}=useApiService()
    // const audioRef = useRef<HTMLAudioElement | null>(null);
    // const [successAlarm,setSuccessAlarm]=useState<boolean>(false)
    const successAudio = new Audio(success);
    // const [alarmTrigger, setAlarmTrigger] = useState(0);
    const setAlarm = () => {
        successAudio.currentTime = 0; // restart if already playing
        successAudio.play();
    };
    // const {setAuth}=useAuth()
    // const playSuccess = () => {
    // setAlarmTrigger(prev => prev + 1);
    // };
    const [showPopup, setShowPopup] = useState(false);
    const [sewingError,setSewingError]=useState(false);
    const [saveBarcode,setSaveBarcode]=useState("")
    const[showErrorPopup,setShowErrorPopup]=useState(false);
    const [networkError,setNetworkError]=useState("")
    const barcodeRef=useRef<HTMLInputElement>(null);
    // const [data,setData]=useState<BundleInfo|null>(null);
    // const [secondData,setSecondData]=useState<any>(null);
    // const[item,setItemss]=useState<BundleInfo[]>([...items]);
   
    const fetchData = (barcode: string) => {
        if (!barcode) {
            console.warn("No Barcode entered");
            return;
        }
        

        let bundleBarcode = `8220`+barcode.slice(0,12)+`001`;
        let individualBarcode = barcode
        barcode = bundleBarcode;
        // --- First API call (washing scan) ---
        getData<BundleInfo>(
            `washing/${barcode}/`,
            ptsip,
            {}, // body, if needed
            {},
            (result1:BundleInfo) => {
                // setData(result1);
                // console.log("First API result:", result1);

                // --- Build payload for second API ---
                const payload = {
                    mpo: result1.mpo,
                    marker:result1.marker,
                    buyer:result1.buyer,
                    style:result1.style,
                    so:result1.so,
                    // bundle_no: result1.bundle_no,
                    // bundle_barcode: result1.bundle_barcode,
                    individual_barcode: individualBarcode,
                    size: result1.size,
                    shade: result1.shade,
                    color: result1.color,
                    // quantity: result1.quantity,
                };
                // console.log("Payload sent to second API:", payload);

                // --- Second API call ---
                postData(
                    // `productions/received-bundles/`,
                    `common/garment-units/`,
                    ip,
                    payload,
                    (result2:IndividualInfo) => {
                        // setSecondData(result2);
                        setItems([
                                result2,
                                ...items,
                            ]);
                        if (result2) {
                            setShowPopup(true);
                            setSaveBarcode(result2.individual_barcode)
                            setAlarm();
                            // setSuccessAlarm(true)
                            // result2.bundle_barcode
                        }
                        console.log("Second API result:", result2);
                    },
                    (error:any) => {
                        if (error instanceof Error && error.message === "Network Error") {
                            console.log("Network Error");
                            setNetworkError("Network Error")
                            
                        }
                        setShowErrorPopup(true);
                        console.error("Error in second API:", error.response.data);
                    }
                );
            },
            (error:any) => {
                if (error instanceof Error && error.message === "Network Error") {
                    console.log("Network Error");
                    setNetworkError("Network Error")
                    setShowErrorPopup(true);
                }
                            
                else{
                    setSewingError(true)
                }       
                
                console.error("Error in first API:", error);
            }
        );
    };

    // {showPopup && (()=>
    //     useEffect(() => {
    //             if (showPopup) {
    //                 setSuccessAlarm(false);
    //             }
    //             }, [showPopup]))
    // }

    return (
            <Box
                sx={{
                minHeight: '20vh',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'center',
                pt: 2,
                width:250
                }}
            >
                {items.length>0 &&(
                    <p style={{
                        position:'fixed',
                        top:80,
                        left:400
                    }}><b>TOTAL - {items.length}</b></p>
                )}
                {showPopup && (
                    // setSuccessAlarm(null)
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 5,
                                position:'fixed',
                                top:80,
                                right:80
                                // marginTop:'150px'
                            }}
                        >
                            <DoneAllIcon style={{ color: "green", fontSize: 18 }} />
                            <p style={{ fontSize:18,fontWeight:'bold' }}>Successfully Received {saveBarcode}</p>
                        </div>

                    )
                }
                <TextField
                style={{position:'fixed',top:80}}
                inputRef={barcodeRef}
                label="Scan Barcode Here"
                // fullWidth
                autoFocus
                onChange={() => {
                    
                    const barcode = barcodeRef.current?.value.trim() || "";
                    if(barcode.length==16
                        // 19
                    ){
                        fetchData(barcode);
                        barcodeRef.current!.value = "";
                    }
                    else{
                        setShowPopup(false);
                    }
                }}
                   sx={{
                        "& .MuiOutlinedInput-root": {
                        "&.Mui-focused fieldset": {
                            borderColor: "#485e68",         // Outline color on focus
                        },
                        },
                        "& .MuiInputLabel-root": {
                        "&.Mui-focused": {
                            color: "#485e68",               // Label/text color on focus
                        },
                        },
                        "& .MuiInputBase-root": {
                            height: 40, // total height
                        },
                    }}
                />
                
                
                {/* <Button
                    onClick={() =>
                        setAuth(prev => ({
                        ...prev,
                        accessToken: "invalid_token"
                        }))
                    }
                    >
                    Force Expire Token
                    </Button> */}
                                    

                
            <Modal open={showErrorPopup} onClose={() => setShowPopup(false)}>
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
                        {networkError!="" &&(
                            <Typography variant="h6">{networkError}</Typography>
                        )}
                       {networkError==""&&(
                        <>
                            {/* <Typography variant="h6">Bundle Duplicated!!!</Typography>
                                <Typography>This Bundle is already Received 
                            </Typography> */}
                            <Typography variant="h6">Piece Duplicated!!!</Typography>
                                <Typography>This Piece is already Received 
                            </Typography>
                        </>
                             
                        )}
                        <Button sx={{ mt: 2 }} onClick={() => setShowErrorPopup(false)}>Close</Button>
                        </Box>
                    </Box>
                </Modal>

                <Modal open={sewingError} onClose={() => setSewingError(false)}>
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
                        <Typography variant="h6">Sewing Not Completed/Invalid Barcode!!!</Typography>
                        <Typography>You can not receive this piece before sewing is completed.
                        </Typography>
                        <Button sx={{ mt: 2 }} onClick={() => setSewingError(false)}>Close</Button>
                        </Box>
                    </Box>
                </Modal>
            </Box>
        
    );
}