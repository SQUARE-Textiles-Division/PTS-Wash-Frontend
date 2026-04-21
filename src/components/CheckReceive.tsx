import {Box,TextField}   from "@mui/material";
import { Modal, Typography, Button ,Paper} from "@mui/material";
import type BundleInfo from "../TypeAnnotations/BundleInfo";
import type BatchBundle from "../TypeAnnotations/BatchBundle";
import { getData, postData} from "./genericApiService";
import { useEffect, useRef,useState } from "react";
import DoneAllIcon from '@mui/icons-material/DoneAll';
import alarmSound from "../assets/BatchCreationError.mp3";
import { ip, ptsip } from "../ip";
import type BatchBundles from "../TypeAnnotations/BatchInstance";

interface Props {
    items: BundleInfo[];
    setItems: React.Dispatch<React.SetStateAction<BundleInfo[]>>;
    qrData: any | null;
    setQrData: React.Dispatch<React.SetStateAction<any | null>>;
}
export default function CheckReceive({items, setItems,qrData,setQrData}: Props){

    const audioRef = useRef<HTMLAudioElement | null>(null);

    // const [qrData, setQrData] = useState<any | null>(null);
    const printRef = useRef<HTMLDivElement>(null);
    const [barcode,setBarcode]=useState<string>("")
    const [planningError,setPlanningError]=useState<string>("")
    const [invalideBundleError,setInvalideBundleError]=useState<string>("")
    const [showPopup, setShowPopup] = useState(false);
    const[showErrorPopup,setShowErrorPopup]=useState(false);
    const [alarm,setAlarm]=useState<boolean>(false);
    const [errorMessage,setErrorMessage]=useState<string>("");  
    const barcodeRef=useRef<HTMLInputElement>(null);
    const [itemId,setItemId]=useState<number[]>([]);

    
    useEffect(() => {
        if (alarm) {
            audioRef.current = new Audio(alarmSound);
            audioRef.current.loop = true;      // 🔁 continuous alarm
            audioRef.current.volume = 1;        // 🔊 full volume

            audioRef.current.play().catch(() => {
            console.warn("Autoplay blocked");
            });
        } else {
            if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current = null;
            }
    }

    return () => {
        if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        }
    };
    }, [alarm]);


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
                getData<BatchBundle>(
                    `productions/received-bundles/scan`,
                    ip,
                    {},
                    {
                        mpo:result1.mpo,
                        marker:result1.marker?.trim(),
                        bundle_no:result1.bundle_no,
                     },
                    (result2:BatchBundle) => {
                        let isDuplicate = false;
                        let sameMpoSize=true;
                        setBarcode(result2.bundle_barcode)
                        // setSecondData(result2);
                        for(let i=0;i<items.length;i++){
                            console.log("Checking item:", items[i], "against", result2);
                            if(items[i].id==result2.id){
                                console.log("Duplicate found:", items[i]);
                                // setItems([...items])
                                isDuplicate=true;
                                // break;
                            }
                            if(items[i].mpo!=result2.mpo || items[i].size!=result2.size){
                                sameMpoSize=false;
                                break;
                            }
                            // else{
                            //     setItemId([...itemId,result2.id]);
                            // }
                        }
                        if(!sameMpoSize){
                            setAlarm(true);
                            return;
                        }
                        if(!isDuplicate && sameMpoSize){
                            // setItemId([...itemId,result2.id]);
                            setItems([
                                    result2,
                                    ...items,
                                ]); 
                                setItemId([...itemId,result2.id]);
                        }
                        if (result2) {
                            setShowPopup(true);
                        }
                        console.log("Second API result:", result2);
                    },
                    (error:any) => {
                        setShowErrorPopup(true);
                        setErrorMessage(error.response.data)
                        console.error("Error in second API:", error.response.data);
                    }
                );
            },
            (error:any) => {
                console.error("Error in first API:", error.response.data.error);
                setInvalideBundleError(error.response.data.error);
            }
        );
    };



    return (
            <Box
                sx={{
                minHeight: '15vh',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'center',
                pt: 5,
                width: 500
                }}
            >
                <TextField
                style={{position:'fixed',top:80}}
                inputRef={barcodeRef}
                label="Scan Barcode Here"
                // fullWidth
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
                        "& .MuiInputBase-root": {
                            height: 40, // total height
                        },
                    }}
                />
                
                
                {showPopup && (
                        <div
                           style={{
                                display: "flex",
                                alignItems: "center",
                                gap: '5px',
                                position:'fixed',
                                top:80,
                                right:80
                            }}
                        >
                             <DoneAllIcon style={{ color: "green", fontSize: 16 }} />
                            <p style={{ fontSize:16,fontWeight:'bold'}}>Successfully Received {barcode}</p>
                        </div>

                    )
                }
                {items.length>0 && (
                    <div
                    style={{
                        display:'flex',
                        flexDirection:'column',
                        marginLeft:'50px',
                        gap:'10px',
                        // position:'relative',
                        top:500
                    }}
                    >
                        <Button variant="contained"
                        // disabled={qr
                        sx={{
                            mt:2,
                            backgroundColor: "#485e68",
                            '&:hover': {
                                backgroundColor: '#37474f',
                            },
                        }}
                        onClick={()=>{
                            console.log("Creating batch with item IDs:", itemId);
                            postData<any>(
                                'productions/batches/',
                                ip,
                                {
                                    scanned_bundles: itemId, // number[]
                                },
                                (data) => {
                                    console.log("Create batch response:", data);
                                    const batchBundles = data.batch_bundles as BatchBundles[];
                                    const buyer=batchBundles[0].received.buyer
                                    const style=batchBundles[0].received.style
                                    const so=batchBundles[0].received.so
                                    
                                    const qrPayload = {
                                        batch_id: data.id,
                                        mpo: data.mpo,
                                        buyer:buyer,
                                        style:style,
                                        so:so,
                                        size: data.size,
                                        color: data.color,
                                        bundles: data.batch_bundles,
                                        routing: data.planning?.route_steps ?? [],
                                        total_items: data.total_quantity,
                                        yearonly: data.updated_at.substring(2, 4)
                                    };
                                    setQrData(qrPayload);
                                    setItems([]);
                                    setItemId([]);
                                },
                                (error:any) => {
                                    console.log(({"scanned_bundles":itemId}));
                                    setPlanningError(error.response.data);
                                    console.error("Error creating batch:", error.response.data);
                                }
                            );
                        }}                        
                        >Create</Button>
                    </div>
                        

                )}
                

                

            <Modal open={alarm} onClose={() => setAlarm(false)}>
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
                        <Typography variant="h6">Same MPO & Size Must be Entered</Typography>
                        <Typography>You must have to scan bundles with same MPO and Size.
                        </Typography>
                        <Button sx={{ mt: 2 }} onClick={() => setAlarm(false)}>Close</Button>
                        </Box>
                    </Box>
                </Modal>


            <Modal open={planningError!=""} onClose={() => setPlanningError("")}>
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
                        <Typography variant="h6">Planning Not Found</Typography>
                        <Typography>{planningError}
                        </Typography>
                        <Button sx={{ mt: 2 }} onClick={() => setPlanningError("")}>Close</Button>
                        </Box>
                    </Box>
            </Modal>
                            
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
                        <Typography variant="h6">{errorMessage}</Typography>
                        {/* <Typography>You have to receive this bundle in Production before washing.
                        </Typography> */}
                        <Button sx={{ mt: 2 }} onClick={() => setShowErrorPopup(false)}>Close</Button>
                        </Box>
                    </Box>
                </Modal>



                <Modal open={invalideBundleError!=""} onClose={() => setInvalideBundleError("")}>
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
                        <Typography variant="h6">Invalid Bundle</Typography>
                        <Typography>{invalideBundleError}
                        </Typography>
                        <Button sx={{ mt: 2 }} onClick={() => setInvalideBundleError("")}>Close</Button>
                        </Box>
                    </Box>
                </Modal>
            </Box>
        
    );
}