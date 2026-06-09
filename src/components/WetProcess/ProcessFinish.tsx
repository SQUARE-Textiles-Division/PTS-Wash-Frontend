import {Box,FormControl,InputLabel,MenuItem,Paper,Select,Table,TableBody,TableContainer,TableHead,TableRow,TextField}   from "@mui/material";
import { Modal, Typography, Button } from "@mui/material";

import { getData,patchData,postData} from "../genericApiService";
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
import type StageEndpoint from "../../TypeAnnotations/StageEndpoint";
import type WetProcessBatch from "../../TypeAnnotations/WetProcessBatch";
import { StageDispMap } from "../../StageDispMap";
import { StageMap } from "../../StageMap";
import type WetProcessStage from "../../TypeAnnotations/WetProcessStage";

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



export default function ProcessFinish({stage}:WetProcessStage) {    
    const [showPopup, setShowPopup] = useState(false);
    const [processError,setProcessError]=useState("");

    const[showErrorPopup,setShowErrorPopup]=useState(false);
    const batchqrcoderef=useRef<HTMLInputElement>(null);
    const [batchdetails,setBatchDetails]=useState<any[]>([])
    const [batchNumber,setBatchNumber]=useState(0)
    const [totQty,setTotQty]=useState(0)

//    console.log(machineList)
    const fetchData = (batchcode: string )=> {
        if (!batchcode) {
            console.warn("No Barcode entered");
            return;
        }
        // First API call (washing scan) ---
        // const str=batchcode
        // const index = str.indexOf("W1");      // find position of ":"
        // let batchId = str.substring(index + 2);
        // const batchIdNum = parseInt(batchId, 10);
        const batchIdNum =batchcode 
        // console.log(batchIdNum)
        const tempBatchDetail:any=[]

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
                 getData<ProcessFirstWash[]>(
                `wet-process/wash-processes`,
                ip,
                {},
                {
                    batch:batchIdNum,
                    // type:'oven'
                },
                (res:ProcessFirstWash[])=>{
                    // getId=res[0].id
                    console.log(res)
                    if(res.length===0){
                        setProcessError("Batch Stages Already Completed or Loading Finish Not Completed")
                        return;
                    }
                    console.log(res[0].id)
                    patchData<ProcessFirstWash>(
                        `wet-process/wash-processes/${res[0].id}/`,
                        ip,
                        {
                            action:'process_finish'
                        },
                    (result:ProcessFirstWash)=>{
                            console.log(result)
                            tempBatchDetail.push(
                                {
                                    'Shade':result.batch.shade,
                                    'Color':result.batch.color,
                                    'Buyer':result.batch.buyer,
                                    'BatchQRCode':result.batch.id,
                                    'Quantity':result.batch.total_quantity,
                                    'Machine':result.machine.machine_number
                                }
                            )
            
                            setBatchDetails(tempBatchDetail)
                            setBatchNumber(batchNumber)
                            setTotQty(result.batch.total_quantity)
                        },
                        (error:any)=>{
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
                },
                (error:any)=>{
                        // console.log(error.response.data)
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
                        setProcessError(msg)
                    }

            )
                // if()
            }
        );
          
       
        
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
                {/* <Box sx={{ width: 150}}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Machine</InputLabel>
                            <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            // value={age}
                            label="Shade"
                            onChange={(e) => setMachine(e.target.value as number)}
                            >
                           
                            {machines.map((machine) => (
                                <MenuItem key={machine} value={machine}>{machine}</MenuItem>
                            ))}
                            </Select>
                        </FormControl>
                    </Box> */}
                <TextField
                style={{outline:"red",
                    width:250,
                    marginTop:20,
                }}
                inputRef={batchqrcoderef}
                label="Scan BatchQRCode Here"
                
                autoFocus
                onChange={() => {
                    const batchcode = batchqrcoderef.current?.value.trim() || "";
                    if(batchcode.length>=15){
                        fetchData(batchcode);
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
                      marginLeft:'200px',
                      maxWidth: 1200,
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
                           
                            <TableCell colSpan={9} sx={{ textAlign: "end", fontWeight: "bold",color:tbCellColor  }}  >Grand Total  = {totQty}</TableCell>
                        </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>   
                
                   
                
            
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
