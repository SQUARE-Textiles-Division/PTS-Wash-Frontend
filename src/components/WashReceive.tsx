import {Box,TextField}   from "@mui/material";
import { Modal, Typography, Button } from "@mui/material";
import type BundleInfo from "../TypeAnnotations/BundleInfo";
import { getData,postData} from "./genericApiService";
import { useRef,useState } from "react";
import DoneAllIcon from '@mui/icons-material/DoneAll';
import ReceivedBundles from "./ReceivedBundles";
import { red } from "@mui/material/colors";
import { ip, ptsip } from "../ip";


interface Props {
    items: BundleInfo[];
    setItems: React.Dispatch<React.SetStateAction<BundleInfo[]>>;
}
export default function WashReceive({items, setItems}: Props){
    const [showPopup, setShowPopup] = useState(false);
    const [sewingError,setSewingError]=useState(false);
    const[showErrorPopup,setShowErrorPopup]=useState(false);
    const barcodeRef=useRef<HTMLInputElement>(null);
    const [data,setData]=useState<BundleInfo|null>(null);
    const [secondData,setSecondData]=useState<any>(null);
    // const[item,setItemss]=useState<BundleInfo[]>([...items]);
    
    const fetchData = (barcode: string) => {
        if (!barcode) {
            console.warn("No Barcode entered");
            return;
        }

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
                    bundle_no: result1.bundle_no,
                    bundle_barcode: result1.bundle_barcode,
                    size: result1.size,
                    shade: result1.shade,
                    color: result1.color,
                    quantity: result1.quantity,
                };
                // console.log("Payload sent to second API:", payload);

                // --- Second API call ---
                postData(
                    `productions/received-bundles/`,
                    ip,
                    payload,
                    (result2:BundleInfo) => {
                        // setSecondData(result2);
                        setItems([
                                result2,
                                ...items,
                            ]);
                        if (result2) {
                            setShowPopup(true);
                        }
                        console.log("Second API result:", result2);
                    },
                    (error:any) => {
                        setShowErrorPopup(true);
                        console.error("Error in second API:", error.response.data);
                    }
                );
            },
            (error) => {
                setSewingError(true)
                console.error("Error in first API:", error);
            }
        );
    };



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
                <TextField
                style={{outline:"red"}}
                inputRef={barcodeRef}
                label="Scan Barcode Here"
                fullWidth
                autoFocus
                onChange={() => {
                    
                    const barcode = barcodeRef.current?.value.trim() || "";
                    if(barcode.length==19){
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
                    }}
                />
                
                
                {showPopup && (
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0,
                            }}
                        >
                            <DoneAllIcon style={{ color: "green", fontSize: 18 }} />
                            <h5 style={{ margin: 0 }}>Successfully Received</h5>
                        </div>

                    )
                }
                

                
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
                        bgcolor: "rgba(0,0,0,0.5)", // dark overlay
                        }}
                    >
                        <Box
                        sx={{
                            bgcolor: "rgba(202, 29, 29, 0.5)", // light red background for error
                            p: 4,
                            borderRadius: 2,
                            color: "white", // red text for error
                            width: 400,
                        }}
                        >
                        <Typography variant="h6">Bundle Duplicated!!!</Typography>
                        <Typography>This Bundle is already Received 
                        </Typography>
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
                        bgcolor: "rgba(0,0,0,0.5)", // dark overlay
                        }}
                    >
                        <Box
                        sx={{
                            bgcolor: "rgba(202, 29, 29, 0.5)", // light red background for error
                            p: 4,
                            borderRadius: 2,
                            color: "white", // red text for error
                            width: 400,
                        }}
                        >
                        <Typography variant="h6">Sewing Not Completed/Invalid Barcode!!!</Typography>
                        <Typography>You can not receive this bundle before sewing is completed.
                        </Typography>
                        <Button sx={{ mt: 2 }} onClick={() => setSewingError(false)}>Close</Button>
                        </Box>
                    </Box>
                </Modal>
            </Box>
        
    );
}