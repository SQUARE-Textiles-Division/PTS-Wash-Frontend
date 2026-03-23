import {Box,FormControl,InputLabel,MenuItem,Paper,Select,Table,TableBody,TableContainer,TableHead,TableRow,TextField}   from "@mui/material";
import { Modal, Typography, Button } from "@mui/material";

import { getData,patchData,postData} from "../genericApiService";
import { useRef,useState } from "react";
import DoneAllIcon from '@mui/icons-material/DoneAll';
// import ReceivedBundles from "./ReceivedBundles";
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { red } from "@mui/material/colors";
import { ip } from "../../ip";
import { styled } from '@mui/material/styles';
import { tbCellColor, tbRowColor } from "../Colors/Colors";
import type { ProcessFirstWash } from "../../TypeAnnotations/ProcessFirstWash";

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

export default function UnloadFinish(){    
    const [showPopup, setShowPopup] = useState(false);
    const [processError,setProcessError]=useState("");
    const[showErrorPopup,setShowErrorPopup]=useState(false);
    const batchqrcoderef=useRef<HTMLInputElement>(null);
    const [batchdetails,setBatchDetails]=useState<any[]>([])
    const [batchNumber,setBatchNumber]=useState(0)
    const [totQty,setTotQty]=useState(0)

    const fetchData = (batchcode: string) => {
        if (!batchcode) {
            console.warn("No Barcode entered");
            return;
        }
        const str=batchcode
        const index = str.indexOf("W1");      // find position of ":"
        let batchId = str.substring(index + 2);
        const batchIdNum = parseInt(batchId, 10);
        // console.log(batchIdNum)
        const tempBatchDetail:any=[]
        // let getId=0
        getData<ProcessFirstWash[]>(
            `wet-process/first-wash-processes/`,
            ip,
            {},
            {
                batch:batchIdNum
            },
            (res:ProcessFirstWash[])=>{
                // getId=res[0].id
                console.log(res)
                console.log(res[0].id)
                patchData<ProcessFirstWash>(
                    `wet-process/first-wash-processes/${res[0].id}/`,
                    ip,
                    {
                        state:'process_finish'
                    },
                    (result:ProcessFirstWash)=>{
                        console.log(result)
                        const shade=result.batch_for_first_wash.shade
                        const sourceBatches=result.batch_for_first_wash.source_batches
                        const batchNumber=result.batch_for_first_wash.id
                        // let batchQR=`W8220${batchDry[i].updated_at}B${String(batchDry[i].id).padStart(10, '0')}`
                        for(const batchObj of sourceBatches){
                            const allocquantity=batchObj.quantity
                            for(const batchBundle of batchObj.batch.batch_bundles){
                                if(batchBundle.received.shade==shade){
                                    tempBatchDetail.push({
                                        'Shade':shade,
                                        'MPO':batchBundle.received.mpo,
                                        'SO':batchBundle.received.so,
                                        'Style':batchBundle.received.style,
                                        'Color':batchBundle.received.color,
                                        'Size':batchBundle.received.size,
                                        'Buyer':batchBundle.received.buyer,
                                        'Quantity':allocquantity,
                                        'Machine':result.machine.machine_number
                                        // 'BatchNumber':batchNumber,
                                        // 'BatchQRCode':
                                        // {row.MPO}-${row.Buyer}-${row.Style}-${row.Color}-${row.Shade}-${row.Size}-${row.BatchQRCode}-${row.BatchNumber}-${row.Quantity}
                                    })
                                    break;
                                }
                            }
                        }
                        const sourceBundles=result.batch_for_first_wash.source_bundles

                        const bundleMap = new Map();

                        for (const bundleObj of sourceBundles) {
                                const allocquantity = bundleObj.quantity;

                                if (bundleObj.bundle.shade == shade) {

                                    const key = `${shade}|${bundleObj.bundle.mpo}|${bundleObj.bundle.so}|${bundleObj.bundle.style}|${bundleObj.bundle.color}|${bundleObj.bundle.size}|${bundleObj.bundle.buyer}|${result.machine.machine_number}`;

                                    if (!bundleMap.has(key)) {
                                        bundleMap.set(key, allocquantity);
                                    } else {
                                        bundleMap.set(key, bundleMap.get(key) + allocquantity);
                                    }
                                }
                            }
                        for (const [key, value] of bundleMap) {

                            const parts = key.split("|");
                            console.log(parts)
                            tempBatchDetail.push({
                                Shade: parts[0],
                                MPO: parts[1],
                                SO: parts[2],
                                Style: parts[3],
                                Color: parts[4],
                                Size: parts[5],
                                Buyer: parts[6],
                                Machine: parts[7],
                                // BatchNumber: parts[7],
                                Quantity: value
                            });
                        }
                        setBatchDetails(tempBatchDetail)
                        setBatchNumber(batchNumber)
                        setTotQty(result.batch_for_first_wash.total_quantity)
                    },
                    (error:any)=>{
                        console.log(error.response.data)
                        let msg=error.response.data[0]
                        // if

                        setProcessError(msg)   
                    }
                )
            },
            (error:any)=>{
                    console.log(error.response.data)
            }

        )
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
                            onChange={(e) => setMachine(e.target.value as string)}
                            >
                           
                            {machineList.map((machine) => (
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
                    if(batchcode.length==25){
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
                        <StyledTableCell align="center">MPO</StyledTableCell>
                        <StyledTableCell align="center">Buyer</StyledTableCell>
                        <StyledTableCell align="center">Style</StyledTableCell>
                        <StyledTableCell align="center">Sales Order</StyledTableCell>
                        <StyledTableCell align="center">Color</StyledTableCell>
                        
                        <StyledTableCell align="center">Size</StyledTableCell>
                        {/* <StyledTableCell>BundleBarcode</StyledTableCell> */}
                        {/* <StyledTableCell>BatchQRCode</StyledTableCell> */}
                        {/* <StyledTableCell align="center">BatchNumber</StyledTableCell> */}
                        <StyledTableCell align="center">Shade</StyledTableCell>
                        <StyledTableCell align="center">Machine No</StyledTableCell>
                        <StyledTableCell align="center">Total Quantity</StyledTableCell>
                
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {batchdetails
                            .map((row) => (
                                <StyledTableRow
                                key={`${row.MPO}-${row.Buyer}-${row.Style}-${row.Color}-${row.Shade}-${row.Size}-${row.BatchQRCode}-${row.BatchNumber}-${row.Quantity}`}
                                >
                                <StyledTableCell align="center">{row.MPO}</StyledTableCell>
                                <StyledTableCell align="center">{row.Buyer}</StyledTableCell>
                                <StyledTableCell align="center">{row.Style}</StyledTableCell>
                                <StyledTableCell align="center">{row.SO}</StyledTableCell>
                                <StyledTableCell align="center">{row.Color}</StyledTableCell>
                                <StyledTableCell align="center">{row.Size}</StyledTableCell>
                                {/* <StyledTableCell align="center">{row.BatchQRCode}</StyledTableCell> */}
                                {/* <StyledTableCell align="center">{row.BatchNumber}</StyledTableCell> */}
                                <StyledTableCell align="center">{row.Shade}</StyledTableCell>   
                                <StyledTableCell align="center">{row.Machine}</StyledTableCell> 
                                <StyledTableCell align="center">{row.Quantity}</StyledTableCell>
                                </StyledTableRow>
                            ))}
                        <TableRow>
                            <TableCell colSpan={6} sx={{ textAlign: "end", fontWeight: "bold",color:tbCellColor }}>
                                Batch (First Wash) - {batchNumber}
                            </TableCell>
                            <TableCell colSpan={7} sx={{ textAlign: "end", fontWeight: "bold",color:tbCellColor  }}  >Grand Total  = {totQty}</TableCell>
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
                        <Typography variant="h6">Select Machine First</Typography>
                        <Typography>You have to select machine at first
                        </Typography>
                        <Button sx={{ mt: 2 }} onClick={() => setShowErrorPopup(false)}>Close</Button>
                        </Box>
                    </Box>
                </Modal>

                
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
