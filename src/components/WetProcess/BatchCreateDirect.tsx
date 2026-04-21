import {Box,TextField}   from "@mui/material";
import { Modal, Typography, Button ,Paper} from "@mui/material";
import type BundleInfo from "../../TypeAnnotations/BundleInfo";
import type BatchBundle from "../../TypeAnnotations/BatchBundle";
import { getData, postData} from "../genericApiService";
import { useEffect, useRef,useState } from "react";
import DoneAllIcon from '@mui/icons-material/DoneAll';
import alarmSound from "../../assets/alarm.mp3";
import { ip, ptsip } from "../../ip";
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
import type FirstWashBatch from "../../TypeAnnotations/WetProcessBatch";
import type WetProcessBatch from "../../TypeAnnotations/WetProcessBatch";

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
    lineHeight:0.5
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    lineHeight:0.9,
    padding: '4px 6px',
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
    const [saveBarcode,setSaveBarcode]=useState("")
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

    useEffect(() => {
        if (items?.length > 0) {
            setQrData(null);
        }
    }, [items]);
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
                            if(items[i].shade!=result2.shade || items[i].buyer!=result2.buyer || items[i].color!=result2.color){
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
                            setSaveBarcode(result2.bundle_barcode)
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
                // pt: 5,
                width: 1100
                }}
            >
                <TextField
                style={{position:'fixed',top:80}}
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
                         "& .MuiInputBase-root": {
                            height: 40, // total height
                        },
                        // width: 300,
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
                            <p style={{ fontSize:16,fontWeight:'bold'}}>Successfully Received {saveBarcode}</p>
                        </div>

                    )
                }
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        marginLeft:'550px'}}>
                                   
                {items.length>0 && (
                    <div
                    style={{
                        display:'flex',
                        flexDirection:'column',
                        // marginLeft:'20px',
                        // marginRight:'180px',
                        gap:'10px',
                    }}
                    >
                        <Button variant="contained"
                        sx={{
                            mt:20,
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
                                "buyer":items[0].buyer,
                                "color":items[0].color,
                                "stage":"first_wash",
                                "type":"normal_wash",
                                "sources_input":[] as any
                            }
                            for(let i=0;i<items.length;i++){
                                payload.sources_input.push({
                                    "type":"bundle",
                                    "id":items[i].id,
                                    "quantity":items[i].quantity
                                })
                            }
                            postData<WetProcessBatch>(
                                'wet-process/batches/',
                                ip,
                                payload,
                                (data) => {
                                    let date=data.created_at.slice(0, 10).replace(/-/g, "");
                                    const sourceBundles=data.sources
                                    let mpoSet=new Set<string>();
                                    let colorSet=new Set<string>();
                                    let buyerSet=new Set<string>();
                                    let styleSet=new Set<string>();
                                    let soSet=new Set<string>();
                                    // let sizeSet=new Set<string>();
                                    for(let i=0;i<sourceBundles.length;i++){
                                        let bundle=sourceBundles[i].source;
                                        mpoSet.add(bundle.mpo);
                                        colorSet.add(data.color);
                                        buyerSet.add(data.buyer);
                                        styleSet.add(bundle.style);
                                        soSet.add(bundle.so);
                                        // sizeSet.add(data.);
                                    }
                                    
                                    const qrPayload = {
                                        id: data.id,
                                        shade:data.shade,
                                        mpo: Array.from(mpoSet).join(", "),
                                        color: Array.from(colorSet).join(", "),
                                        // size: Array.from(sizeSet).join(", "),
                                        buyer: Array.from(buyerSet).join(", "),
                                        style: Array.from(styleSet).join(", "),
                                        so: Array.from(soSet).join(", "),
                                        total_items: data.total_quantity,
                                        date: date.substring(2,4)
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
                    maxHeight: 250,          // vertical scrollbar
                    overflowX: "auto",       // horizontal scrollbar
                    overflowY: "auto",
                    maxWidth: 1150,
                    border:'none',
                    marginLeft:'80px',
                    position:'fixed',
                    top:125
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
                                        value={`W822${qrData.date}W1${String(qrData.id).padStart(7, '0')}`}
                                        size={200}
                                        level="H"
                                        />
                
                                        <Box sx={{ textAlign: "left" }}>
                                        <Typography variant="body2" sx={{
                                            textAlign: "center",
                                            fontSize: 12,
                                            mb: 2
                                        }}>
                                            {`W822${qrData.date}W1${String(qrData.id).padStart(7, '0')}`}
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
                                        {/* <Typography variant="body2">
                                            <b>Size:</b> {qrData.size}
                                        </Typography> */}
                                        <Typography variant="body2">
                                            <b>Color:</b> {qrData.color}
                                        </Typography>
                                        
                                        </Box>
                                    </Paper>)}
                            {qrData && (
                                <Button
                                    variant="outlined"
                                    sx={{ mt: 2 ,marginRight:"450px"}}
                                    onClick={handlePrint}
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
                        <Typography variant="h6">Same Shade,Buyer & Color Must be Entered</Typography>
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