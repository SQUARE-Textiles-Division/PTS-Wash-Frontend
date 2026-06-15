import {Box,FormControl,InputLabel,MenuItem,Paper,Select,Table,TableBody,TableContainer,TableHead,TableRow,TextField}   from "@mui/material";
import { Modal, Typography, Button } from "@mui/material";

// import { getData,postData} from "../genericApiService";
import { useEffect, useRef,useState } from "react";
import DoneAllIcon from '@mui/icons-material/DoneAll';
// import ReceivedBundles from "./ReceivedBundles";
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { red } from "@mui/material/colors";
import { ip } from "../../ip";
import { styled } from '@mui/material/styles';
import { tbCellColor, tbRowColor } from "../Colors/Colors";
import type { Machine } from "../../TypeAnnotations/Machine";
import type { ProcessFirstWash } from "../../TypeAnnotations/ProcessFirstWash";
import { all } from "axios";
import NumberSpinner from "../NumberSpinner";
import type StageEndpoint from "../../TypeAnnotations/StageEndpoint";
import type WetProcessBatch from "../../TypeAnnotations/WetProcessBatch";
import { StageMap } from "../../StageMap";
import { StageDispMap } from "../../StageDispMap";
import type WetProcessStage from "../../TypeAnnotations/WetProcessStage";
import { useApiService } from "../genericApiService";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    // backgroundColor: theme.palette.common.black,
    // backgroundColor: '#485e68',
    backgroundColor: tbCellColor,
    color: "white",
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


// interface Machine {
//   machine_number: number;
//   SAP: string;
//   added_at: string;
// }



export default function HydroIn({stage}:WetProcessStage) {    
    const {getData,postData}=useApiService()
    const [hourminError,setHourMinError]=useState(false)
    const [showPopup, setShowPopup] = useState(false);
    const [processError,setProcessError]=useState("");
    const [hourError,setHourError]=useState(false)
    const [minError,setMinError]=useState(false)
    const[showErrorPopup,setShowErrorPopup]=useState(false);
    const batchqrcoderef=useRef<HTMLInputElement>(null);
    const [machine,setMachine]=useState(0);
    const [hour,setHour]=useState(0);
    const [min,setMin]=useState(0);
    const [machines, setMachines] = useState<number[]>([]);
    const [batchdetails,setBatchDetails]=useState<any[]>([])
    const [batchNumber,setBatchNumber]=useState(0)
    const [totQty,setTotQty]=useState(0)

    useEffect(() => {
        getData<Machine[]>(
            `wet-process/machines`,
            ip,
            {},
            {},
            (res) => {
                res.filter(item => item.machine_number !== 4);
                setMachines(res.map(m => m.machine_number));
            }
        );
    }, []);
//    console.log(machineList)
    const hours=[]
    const mins=[]
    for(let i=1;i<=12;i++){
        hours.push(i);
    }
    for(let i=1;i<=60;i++){
        mins.push(i);
    }
    const fetchData = (batchcode: string,machine:number) => {
        if (!batchcode) {
            console.warn("No Barcode entered");
            return;
        }
        if(!machine){
            console.warn("No Machine Selected")
        }
        // --- First API call (washing scan) ---
        // const str=batchcode
        // const index = str.indexOf("W1");      // find position of ":"
        // let batchId = str.substring(index + 2);
        const batchIdNum = batchcode
        console.log(batchIdNum)
        const tempBatchDetail:any=[]
        let hourStr=''
        let minStr=''
        if(hour<10){
            let ch=hour+""
            hourStr="0"+ch
            // hourStr='0'w
        }
        else{
            hourStr=hour+""
        }
        if(min<10){
            let ch=min+""
            minStr="0"+ch
            // hourStr='0'w
        }
        else{
            minStr=min+""
        }
        // let ret=false
        getData<WetProcessBatch>(
            `wet-process/batches/${batchIdNum}`,
            ip,
            {},
            {},
            (batchMeta: WetProcessBatch) => {
                // Handle the fetched batch details
                console.log(batchMeta)
                if(batchMeta.stage!=stage){
                    setProcessError(`Batch is currently at ${StageDispMap[batchMeta.stage] } stage`)
                    
                    return
                }
                        postData<ProcessFirstWash>(
                            `wet-process/hydro-processes/`,
                            ip,
                            {
                                batch:batchIdNum,
                                machine:machine,
                                standard_time: `${hourStr}:${minStr}:00`
                            },
                            (result:ProcessFirstWash)=>{
                                console.log(result)
                                // const shade=result.batch.shade
                                // const batchNumber=result.batch.id
                                // let batchQR=`W8220${result.batch.updated_at}B${String(batchDry[i].id).padStart(10, '0')}`
                                tempBatchDetail.push(
                                    {
                                        'Shade':result.batch.shade,
                                        'Color':result.batch.color,
                                        'Buyer':result.batch.buyer,
                                        'BatchQRCode':result.batch.id,
                                        'Quantity':result.batch.total_quantity,
                                        'Machine':result.machine
                                    }
                                )
                                // for(const batchObj of sourceBatches){
                                //     const allocquantity=batchObj.quantity
                                //     for(const batchBundle of batchObj.batch.batch_bundles){
                                //         if(batchBundle.received.shade==shade){
                                //             tempBatchDetail.push({
                                //                 'Shade':shade,
                                //                 'MPO':batchBundle.received.mpo,
                                //                 'SO':batchBundle.received.so,
                                //                 'Style':batchBundle.received.style,
                                //                 'Color':batchBundle.received.color,
                                //                 'Size':batchBundle.received.size,
                                //                 'Buyer':batchBundle.received.buyer,
                                //                 'Quantity':allocquantity,
                                //                 'Machine':result.machine.machine_number
                                //                 // 'BatchNumber':batchNumber,
                                //                 // 'BatchQRCode':
                                //                 // {row.MPO}-${row.Buyer}-${row.Style}-${row.Color}-${row.Shade}-${row.Size}-${row.BatchQRCode}-${row.BatchNumber}-${row.Quantity}
                                //             })
                                //             break;
                                //         }
                                //     }
                                // }
                                // const sourceBundles=result.batch_for_first_wash.source_bundles

                            //     const bundleMap = new Map();

                            //    for (const bundleObj of sourceBundles) {
                            //         const allocquantity = bundleObj.quantity;

                            //         if (bundleObj.bundle.shade == shade) {

                            //             const key = `${shade}|${bundleObj.bundle.mpo}|${bundleObj.bundle.so}|${bundleObj.bundle.style}|${bundleObj.bundle.color}|${bundleObj.bundle.size}|${bundleObj.bundle.buyer}|${result.machine.machine_number}`;

                            //             if (!bundleMap.has(key)) {
                            //                 bundleMap.set(key, allocquantity);
                            //             } else {
                            //                 bundleMap.set(key, bundleMap.get(key) + allocquantity);
                            //             }
                            //         }
                            //     }
                            //     for (const [key, value] of bundleMap) {

                            //         const parts = key.split("|");
                            //         console.log(parts)
                            //         tempBatchDetail.push({
                            //             Shade: parts[0],
                            //             MPO: parts[1],
                            //             SO: parts[2],
                            //             Style: parts[3],
                            //             Color: parts[4],
                            //             Size: parts[5],
                            //             Buyer: parts[6],
                            //             Machine:parts[7],
                            //             // BatchNumber: parts[7],
                            //             Quantity: value
                            //         });
                            //     }
                            
                            setBatchDetails(tempBatchDetail)
                            setBatchNumber(batchNumber)
                            setTotQty(result.batch.total_quantity)
                            },
                            (error:any)=>{
                            //    console.log(error.response.data)
                            //     let msg=""
                            //     Object.entries(error.response.data).forEach(([key, value]:any) => {
                            //         msg+=value[0]
                            //     });
                                let msg=""
                                    if (error instanceof Error && error.message === "Network Error") {
                                        console.log("Network Error");
                                        msg="Network Error"
                                                
                                    }
                                    
                                    else if(error.response.data){
                                        Object.entries(error.response.data).forEach(([key, value]) => {
                                            if (Array.isArray(value)) {
                                                msg += value[0];
                                            } else {
                                                msg += value;
                                            }
                                        });
                                        
                                    }
                                // if

                                setProcessError(msg)   
                            }
                        
                        )
                // if()
            }
        );
        

        // getData<BundleInfo>(
        //     `washing/${barcode}/`
        //     "http://127.0.0.1:8000",
        //     {}, // body, if needed
        //     {},
        //     (result1:BundleInfo) => {
        //         // setData(result1);
        //         // console.log("First API result:", result1);

        //         // --- Build payload for second API ---
        //         const payload = {
        //             mpo: result1.mpo,
        //             marker:result1.marker,
        //             buyer:result1.buyer,
        //             style:result1.style,
        //             so:result1.so,
        //             bundle_no: result1.bundle_no,
        //             bundle_barcode: result1.bundle_barcode,
        //             size: result1.size,
        //             shade: result1.shade,
        //             color: result1.color,
        //             quantity: result1.quantity,
        //         };
                // console.log("Payload sent to second API:", payload);

                // --- Second API call ---
            //     postData(
            //         `productions/received-bundles/`,
            //         ip,
            //         payload,
            //         (result2:BundleInfo) => {
            //             // setSecondData(result2);
            //             setItems([
            //                     result2,
            //                     ...items,
            //                 ]);
            //             if (result2) {
            //                 setShowPopup(true);
            //             }
            //             console.log("Second API result:", result2);
            //         },
            //         (error:any) => {
            //             setShowErrorPopup(true);
            //             console.error("Error in second API:", error.response.data);
            //         }
            //     );
            // },
            // (error) => {
            //     setSewingError(true)
            //     console.error("Error in first API:", error);
            // }
        // );
    };





    return (
            <Box
                sx={{
                minHeight: '20vh',
                display: 'flex',
                // alignItems: 'flex-start',
                alignItems:'center',
                justifyContent: 'center',
                // pt: 2,
                flexDirection: 'column',
                // width:250
                }}
            >
                <Box sx={{width:'50%', display:'flex',gap:3}}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Machine</InputLabel>
                            <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            // value={age}
                            label="Machine"
                            onChange={(e) => setMachine(e.target.value as number)}
                            >
                           
                            {machines.map((machine) => (
                                <MenuItem key={machine} value={machine}>{machine}</MenuItem>
                            ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            {/* <InputLabel id="demo-simple-select-label">Set Hour</InputLabel> */}
                            {/* <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            // value={age}
                            label="Hour"
                            onChange={(e) => setHour(e.target.value as number)}
                            >
                           
                            {hours.map((hour) => (
                                <MenuItem key={hour} value={hour}>{hour}</MenuItem>
                            ))}
                            </Select> */}
                            <Typography variant="body2" >
                                                            Set Hour
                                                        </Typography>
                            
                            <NumberSpinner
                                size="small"
                                min={0}
                                max={24}
                                customSize={20}
                                disabled={false}
                                value={hour}
                                onValueChange={(value:any) => setHour(value ?? 0)}
                            />
                        </FormControl>
                        <FormControl fullWidth>
                            <Typography variant="body2" >
                                            Set Minute
                            </Typography>
                            <NumberSpinner
                                size="small"
                                min={0}
                                max={59}
                                customSize={20}
                                disabled={false}
                                value={min}
                                onValueChange={(value:any) => setMin(value ?? 0)}
                            />
                            {/* <InputLabel id="demo-simple-select-label">Set Minute</InputLabel>
                            <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            // value={age}
                            label="Hour"
                            onChange={(e) => setMin(e.target.value as number)}
                            >
                           
                            {mins.map((min) => (
                                <MenuItem key={min} value={min}>{min}</MenuItem>
                            ))}
                            </Select> */}
                        </FormControl>
                    </Box>
                <TextField
                style={{outline:"red",
                    width:250,
                    marginTop:20,
                }}
                inputRef={batchqrcoderef}
                label="Scan BatchQRCode Here"
                
                autoFocus
                onChange={() => {
                    if(machine==0)
                    {
                        setShowErrorPopup(true)
                        batchqrcoderef.current!.value = "";
                        return
                    }
                    if(hour==0 && min==0){
                        setHourMinError(true)
                        batchqrcoderef.current!.value = "";
                        return
                    }
                    // if(hour==0){
                    //     setHourError(true)
                    //      batchqrcoderef.current!.value = "";
                    //     return
                    // }
                    //  if(min==0){
                    //     setMinError(true)
                    //     batchqrcoderef.current!.value = "";
                    //     return
                    // }
                    const batchcode = batchqrcoderef.current?.value.trim() || "";
                    if(batchcode.length>=15){
                        fetchData(batchcode,machine);
                        batchqrcoderef.current!.value = "";
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
                
                
                {/* {showPopup && (
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
                } */}
           
                     
                   <TableContainer
                    component={Paper}
                    elevation={0}
                    sx={{
                      maxHeight: 300,          // vertical scrollbar
                      overflowX: "auto",       // horizontal scrollbar
                      overflowY: "auto",
                      marginLeft:'250px',
                      marginRight:'10px',
                      maxWidth: 1100,
                      border:"none",
                       mt:3,
                    }}
                  >
                    
                    <Table
                      stickyHeader
                      // force horizontal scroll if screen is smaller
                      aria-label="customized table"
                      sx={{
                        '& .MuiTableCell-root':{
                            borderBottom:'none'
                        },
                       
                        my: 1,
                      }}
                    >
                         
                    <TableHead>
                      <TableRow>
                        {/* <StyledTableCell align="center">MPO</StyledTableCell> */}
                        <StyledTableCell align="center">BatchQRCode</StyledTableCell>
                        <StyledTableCell align="center">Buyer</StyledTableCell>
                        {/* <StyledTableCell align="center">Style</StyledTableCell> */}
                        {/* <StyledTableCell align="center">Sales Order</StyledTableCell> */}
                        <StyledTableCell align="center">Color</StyledTableCell>
                        
                        {/* <StyledTableCell align="center">Size</StyledTableCell> */}
                        {/* <StyledTableCell>BundleBarcode</StyledTableCell> */}
                        {/* <StyledTableCell>BatchQRCode</StyledTableCell> */}
                        
                        <StyledTableCell align="center">Shade</StyledTableCell>
                        <StyledTableCell align="center">Machine No</StyledTableCell>
                        <StyledTableCell align="center">Total Quantity</StyledTableCell>
                
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {batchdetails
                            .map((row) => (
                                <StyledTableRow
                                key={`${row.Buyer}-${row.Color}-${row.Shade}-${row.BatchQRCode}-${row.Quantity}`}
                                >
                                {/* <StyledTableCell align="center">{row.MPO}</StyledTableCell> */}
                                <StyledTableCell align="center">{row.BatchQRCode}</StyledTableCell>
                                <StyledTableCell align="center">{row.Buyer}</StyledTableCell>
                                {/* <StyledTableCell align="center">{row.Style}</StyledTableCell> */}
                                {/* <StyledTableCell align="center">{row.SO}</StyledTableCell> */}
                                <StyledTableCell align="center">{row.Color}</StyledTableCell>
                                {/* <StyledTableCell align="center">{row.Size}</StyledTableCell> */}
                                {/* <StyledTableCell align="center">{row.BatchQRCode}</StyledTableCell> */}
                                
                                <StyledTableCell align="center">{row.Shade}</StyledTableCell>  
                                 <StyledTableCell align="center">{row.Machine}</StyledTableCell>  
                                <StyledTableCell align="center">{row.Quantity}</StyledTableCell>
                                </StyledTableRow>
                            ))}
                        <TableRow>
                                {/* <TableCell colSpan={5} sx={{ textAlign: "center", fontWeight: "bold",color:tbCellColor }}>
                                   Batch (First Wash) - {batchNumber}
                                </TableCell> */}
                                <TableCell colSpan={9} sx={{ textAlign: "end", fontWeight: "bold",color:tbCellColor  }}  >Grand Total  = {totQty}</TableCell>
                        </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>   
                
                   
                
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
                        <Typography variant="h6">Select Machine First</Typography>
                        <Typography>You have to select machine at first
                        </Typography>
                        <Button sx={{ mt: 2 }} onClick={() => setShowErrorPopup(false)}>Close</Button>
                        </Box>
                    </Box>
                </Modal>
                

                 <Modal open={hourminError} onClose={() => setShowPopup(false)}>
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
                        <Typography variant="h6">Set Hour/Minute First</Typography>
            
                        {/* </Typography> */}
                        <Button sx={{ mt: 2 }} onClick={() => setHourMinError(false)}>Close</Button>
                        </Box>
                    </Box>
                </Modal>
                {/* <Modal open={minError} onClose={() => setShowPopup(false)}>
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
                        <Typography variant="h6">Set Minute First</Typography>
            
                        {/* </Typography> */}
                        {/* <Button sx={{ mt: 2 }} onClick={() => setMinError(false)}>Close</Button>
                        </Box>
                    </Box>
                </Modal> */} 
                <Modal open={processError!=""} onClose={() => setProcessError("")}>
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
                        <Typography variant="h6">{processError}!</Typography>
                        {/* <Typography>You can not receive this bundle before sewing is completed. */}
                        {/* </Typography> */}
                        <Button sx={{ mt: 2 }} onClick={() => setProcessError("")}>Close</Button>
                        </Box>
                    </Box>
                </Modal>
            </Box>
        
    );
}



