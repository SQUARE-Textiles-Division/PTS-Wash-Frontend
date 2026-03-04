import {Box,TextField}   from "@mui/material";
import { Modal, Typography, Button ,Paper} from "@mui/material";
import type BundleInfo from "../../TypeAnnotations/BundleInfo";
import type BatchBundle from "../../TypeAnnotations/BatchBundle";
import { getData, postData} from "../genericApiService";
import { useEffect, useRef,useState } from "react";
import DoneAllIcon from '@mui/icons-material/DoneAll';
import alarmSound from "../../assets/alarm.mp3";
import { ip } from "../../ip";
import type BatchBundles from "../../TypeAnnotations/BatchInstance";
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
// import Paper from '@mui/material/Paper';
// import type BundleInfo from '../TypeAnnotations/BundleInfo';
import { tbCellColor,tbRowColor } from '../Colors/Colors';
import { QRCodeCanvas } from "qrcode.react";
import { useReactToPrint } from "react-to-print";
import type FirstWashBatchDirectCreate from "../../TypeAnnotations/FirstWashBatchDirectCreate";

// interface Props {
//     items: BundleInfo[];
//     setItems: React.Dispatch<React.SetStateAction<BundleInfo[]>>;
//     qrData: any | null;
//     setQrData: React.Dispatch<React.SetStateAction<any | null>>;
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    // backgroundColor: theme.palette.common.black,
    backgroundColor: tbCellColor,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: tbRowColor
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));
// }
export default function BatchCreateDirect(){

    const audioRef = useRef<HTMLAudioElement | null>(null);

    // const [qrData, setQrData] = useState<any | null>(null);
    const printRef = useRef<HTMLDivElement>(null);
     const handlePrint = useReactToPrint({
            contentRef: printRef,
        });
    const [planningError,setPlanningError]=useState<string>("")
    const [invalideBundleError,setInvalideBundleError]=useState<string>("")
    const [showPopup, setShowPopup] = useState(false);
    const[showErrorPopup,setShowErrorPopup]=useState(false);
    const [alarm,setAlarm]=useState<boolean>(false);
    const [errorMessage,setErrorMessage]=useState<string>("");  
    const barcodeRef=useRef<HTMLInputElement>(null);
    const [itemId,setItemId]=useState<number[]>([]);
    const [items, setItems] = useState<BundleInfo[]>([]);
    const [qrData, setQrData] = useState<any | null>(null);

    
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
            "http://127.0.0.1:8000",
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
                        let sameShade=true;
                        // setSecondData(result2);
                        for(let i=0;i<items.length;i++){
                            console.log("Checking item:", items[i], "against", result2);
                            if(items[i].id==result2.id){
                                console.log("Duplicate found:", items[i]);
                                // setItems([...items])
                                isDuplicate=true;
                                // break;
                            }
                            if(items[i].shade!=result2.shade){
                                sameShade=false;
                                break;
                            }
                            // else{
                            //     setItemId([...itemId,result2.id]);
                            // }
                        }
                        if(!sameShade){
                            setAlarm(true);
                            return;
                        }
                        if(!isDuplicate && sameShade){
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
                // display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'center',
                pt: 5,
                width: 1100
                }}
            >
                <TextField
                style={{outline:"red",
                    marginLeft:'160px'
                }}
                inputRef={barcodeRef}
                label="Scan Barcode Here"
                
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
                        width: 300,
                    }}
                />
                
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        marginLeft:'550px'}}>
                                    {showPopup && (
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: '5px',
                            }}
                        >
                            <DoneAllIcon style={{ color: "green", fontSize: 18 }} />
                            <h5 style={{ margin: 0 }}>Successfully Received</h5>
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
                    }}
                    >
                        <Button variant="contained"
                        sx={{
                            mt:2,
                            backgroundColor: "#485e68",
                            '&:hover': {
                                backgroundColor: '#37474f',
                            },
                            width: 100,
                        }}
                        onClick={()=>{
                            console.log("Creating batch with item IDs:", itemId);
                            const payload={
                                "shade":items[0].shade,
                                "bundle_source":[] as any
                            }
                            for(let i=0;i<items.length;i++){
                                payload.bundle_source.push({
                                    "bundle":items[i].id,
                                    "quantity":items[i].quantity
                                })
                            }
                            postData<FirstWashBatchDirectCreate>(
                                'wet-process/first-wash-batches/',
                                ip,
                                payload,
                                (data) => {
                                    let date=data.created_at.slice(0, 10).replace(/-/g, "");
                                    const sourceBundles=data.source_bundles
                                    let mpoSet=new Set<string>();
                                    let colorSet=new Set<string>();
                                    let buyerSet=new Set<string>();
                                    let styleSet=new Set<string>();
                                    let soSet=new Set<string>();
                                    let sizeSet=new Set<string>();
                                    for(let i=0;i<sourceBundles.length;i++){
                                        let bundle=sourceBundles[i].bundle;
                                        mpoSet.add(bundle.mpo);
                                        colorSet.add(bundle.color);
                                        buyerSet.add(bundle.buyer);
                                        styleSet.add(bundle.style);
                                        soSet.add(bundle.so);
                                        sizeSet.add(bundle.size);
                                    }
                                    
                                    const qrPayload = {
                                        id: data.id,
                                        shade:data.shade,
                                        mpo: Array.from(mpoSet).join(", "),
                                        color: Array.from(colorSet).join(", "),
                                        size: Array.from(sizeSet).join(", "),
                                        buyer: Array.from(buyerSet).join(", "),
                                        style: Array.from(styleSet).join(", "),
                                        so: Array.from(soSet).join(", "),
                                        total_items: data.total_quantity,
                                        date: date
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
                </div>

                
                <TableContainer
                    component={Paper}
                    sx={{
                    // maxHeight: 300,          // vertical scrollbar
                    overflowX: "auto",       // horizontal scrollbar
                    overflowY: "auto",
                    maxWidth: 1100,
                    border:'none',
                    marginLeft:'115px',
                    marginTop:'20px'
                    // marginLeft:'100px',
                    }}
                >
                    <Table
                    stickyHeader
                    sx={{
                        '& .MuiTableCell-root':{
                            borderBottom:'none'
                        }
                        
                    }}
                    // sx={{ minWidth: 800 }}   // force horizontal scroll if screen is smaller
                    aria-label="customized table"
                    >
                    <TableHead>
                        <TableRow>
                        <StyledTableCell>MPO</StyledTableCell>
                        <StyledTableCell align="center">Buyer</StyledTableCell>
                        <StyledTableCell align="center">Style</StyledTableCell>
                        <StyledTableCell align="center">Sales Order</StyledTableCell>
                        <StyledTableCell align="center">Bundle Barcode</StyledTableCell>
                        <StyledTableCell align="center">Bundle No</StyledTableCell>
                        <StyledTableCell align="center">Marker No</StyledTableCell>
                        <StyledTableCell align="center">Size</StyledTableCell>
                        <StyledTableCell align="center">Shade</StyledTableCell>
                        <StyledTableCell align="center">Color</StyledTableCell>
                        <StyledTableCell align="center">Quantity</StyledTableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {items.map((row) => (
                        <StyledTableRow key={`${row.mpo}-${row.bundle_no}`}>
                            <StyledTableCell>{row.mpo}</StyledTableCell>
                            <StyledTableCell align="center">{row.buyer}</StyledTableCell>
                            <StyledTableCell align="center">{row.style}</StyledTableCell>
                            <StyledTableCell align="center">{row.so}</StyledTableCell>
                            <StyledTableCell align="center">{row.bundle_barcode}</StyledTableCell>
                            <StyledTableCell align="center">{row.bundle_no}</StyledTableCell>
                            <StyledTableCell align="center">{row.marker}</StyledTableCell>
                            <StyledTableCell align="center">{row.size}</StyledTableCell>
                            <StyledTableCell align="center">{row.shade}</StyledTableCell>
                            <StyledTableCell align="center">{row.color}</StyledTableCell>
                            <StyledTableCell align="center">{row.quantity}</StyledTableCell>
                        </StyledTableRow>
                        ))}
                    </TableBody>
                    </Table>
                </TableContainer>
                 <div style={{marginLeft:"500px"}}>
                          {qrData && (
                                    <Paper
                                        ref={printRef}
                                        elevation={5}
                                        sx={{
                                        alignContent: "right",
                                        mt: 3,
                                        px: 2,
                                        pt:1,
                                        pb:1,
                                        // p: 3,
                                        width: 280,
                                        textAlign: "center",
                                        }}
                                    >
                
                                        <QRCodeCanvas
                                        value={`W8220${qrData.date}W100000000${qrData.id}`}
                                        size={200}
                                        level="H"
                                        />
                
                                        <Box sx={{ textAlign: "left" }}>
                                        <Typography variant="body2" sx={{
                                            textAlign: "center",
                                            fontSize: 12,
                                            mb: 2
                                        }}>
                                            {`W8220${qrData.date}W1${String(qrData.id).padStart(10, '0')}`}
                                        </Typography>
                                        <Typography variant="body2">
                                            <b>Total Quantity:</b> {qrData.total_items}
                                        </Typography>
                                            <Typography variant="body2">
                                            <b>MPO</b> {qrData.mpo}
                                        </Typography>
                                        <Typography variant="body2">
                                            <b>Buyer</b> {qrData.buyer}
                                        </Typography>
                                        <Typography variant="body2">
                                            <b>Style:</b> {qrData.style}
                                        </Typography>
                                        <Typography variant="body2">
                                            <b>Sales Order:</b> {qrData.so}
                                        </Typography>
                                        <Typography variant="body2">
                                            <b>Shade:</b> {qrData.shade}
                                        </Typography>
                                        <Typography variant="body2">
                                            <b>Size:</b> {qrData.size}
                                        </Typography>
                                        <Typography variant="body2">
                                            <b>Color:</b> {qrData.color}
                                        </Typography>
                                        
                                        </Box>
                                    </Paper>)}
                            {qrData && (
                                <Button
                                    variant="outlined"
                                    sx={{ mt: 2 ,marginRight:"450px"}}
                                    // onClick={handlePrint}
                                >
                                    Print QR Code
                                </Button>
                            )}
                    </div>

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
                        <Typography variant="h6">Same Shade Must be Entered</Typography>
                        <Typography>You must have to scan bundles with same Shade.
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
                        {/* <Typography>You have to receive this bundle in Production before washing. */}
                        {/* </Typography> */}
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