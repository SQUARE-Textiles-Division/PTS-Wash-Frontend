import {Box,FormControl,InputLabel,MenuItem,Paper,Select,Table,TableBody,TableContainer,TableHead,TableRow,TextField}   from "@mui/material";
import { Modal, Typography, Button } from "@mui/material";

import { getData,postData} from "../genericApiService";
import { useRef,useState } from "react";
import DoneAllIcon from '@mui/icons-material/DoneAll';
// import ReceivedBundles from "./ReceivedBundles";
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { red } from "@mui/material/colors";
import { ip } from "../../ip";
import { styled } from '@mui/material/styles';
import { tbCellColor, tbRowColor } from "../Colors/Colors";

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

export default function HydroIn(){    
    const [showPopup, setShowPopup] = useState(false);
    const [sewingError,setSewingError]=useState(false);
    const[showErrorPopup,setShowErrorPopup]=useState(false);
    const batchqrcoderef=useRef<HTMLInputElement>(null);
   const [machine,setMachine]=useState("");
   const machineList=["Machine 1","Machine 2","Machine 3"];
    
    const fetchData = (batchcode: string) => {
        if (!batchcode) {
            console.warn("No Barcode entered");
            return;
        }

        // --- First API call (washing scan) ---
        // getData<BundleInfo>(
        //     `washing/${barcode}/`,
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
                <Box sx={{ width: 150}}>
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
                    if(machine=="")
                    {
                        setShowErrorPopup(true)
                        batchqrcoderef.current!.value = "";
                        return
                    }
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
                        <StyledTableCell>BatchQRCode</StyledTableCell>
                        <StyledTableCell align="center">BatchNumber</StyledTableCell>
                        <StyledTableCell align="center">Shade</StyledTableCell>
                        <StyledTableCell align="center">Total Quantity</StyledTableCell>
                
                      </TableRow>
                    </TableHead>
                    {/* <TableBody>
                      {dryBatchList
                            .filter(row => row.Quantity > 0 && (shade === "" || row.Shade === shade))
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
                                <StyledTableCell align="center">{row.BatchQRCode}</StyledTableCell>
                                <StyledTableCell align="center">{row.BatchNumber}</StyledTableCell>
                                <StyledTableCell align="center">{row.Shade}</StyledTableCell>   
                                <StyledTableCell align="center">{row.Quantity}</StyledTableCell>
                                <StyledTableCell align="center">
                                    <NumberSpinner
                                    size="small"
                                    min={0}
                                    max={row?.Quantity ?? 0}
                                    disabled={!selectedRows.some(item => item.BatchNumber === row.BatchNumber && item.Shade === row.Shade)}
                                    onValueChange={(value) => handleQuantityChange(row, value ?? 0)}
                                    />
                                </StyledTableCell>  
                                <StyledTableCell>
                                    <Checkbox
                                    checked={selectedRows.some(item => item.BatchNumber === row.BatchNumber && item.Shade === row.Shade)}
                                    onChange={(e, checked) => handleRowSelect(row, checked)}
                                    slotProps={{ input: { 'aria-label': 'select-row' } }}
                                    />
                                </StyledTableCell>
                                </StyledTableRow>
                            ))}
                    </TableBody> */}
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

                {/* <Modal open={sewingError} onClose={() => setSewingError(false)}>
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
                </Modal> */}
            </Box>
        
    );
}
