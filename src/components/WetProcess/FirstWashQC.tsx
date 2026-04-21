import { Box, Button, FormControl, InputLabel, MenuItem, Modal, Paper, Select, styled, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow, TextField, Typography, type SelectChangeEvent } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { getData, patchData, postData } from "../genericApiService";
import { washlog } from "../../endpoints";
import { ip } from "../../ip";
import { tbCellColor, tbRowColor } from "../Colors/Colors";
import DoneAllIcon from '@mui/icons-material/DoneAll';
import React from "react";
import { WhiskerRejectReasons } from "../RejectionReasons/WhiskerRejectReasons";
// import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
// import type FirstWashRejection from "../../TypeAnnotations/WetWashRejection";
import type BundleInfo from "../../TypeAnnotations/BundleInfo";
import NumberSpinner from "../NumberSpinner";
// import type FetchFirstWash from "../../TypeAnnotations/WetProcessBatchMeta";
import type WetProcessBatchMeta from "../../TypeAnnotations/WetProcessBatchMeta";
import type WetWashRejection from "../../TypeAnnotations/WetWashRejection";
// import NumberField from './components/NumberField';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    // backgroundColor: theme.palette.common.black,
    // backgroundColor: '#485e68',
    backgroundColor: tbCellColor,
     lineHeight: 0.2 , 
     fontSize: 14,
    color: "white",
  },
  [`&.${tableCellClasses.body}`]: {
     lineHeight: 0.4,  
    fontSize: 14,
    padding: '0px 6px',
    // lineHeight: 0.8, 
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


// {
//         "id": 1,
//         "content_type": "batchforfirstwash",
//         "object_id": 21,
//         "batch_details": {
//             "buyer": "GLORIA JEA",
//             "color": "MEDIUM LIGHT ICE",
//             "shade": "D"
//         },
//         "total_quantity": 48,
//         "rejections": 3,
//         "rewash_quantity": 0,
//         "remaining_rewash_quantity": 0,
//         "status": null
//     }
type RejPayload={
    individual_barcode:string,
    reason:string
}
type FetchBatchMeta={
    id:number,
    buyer:string,
    shade:string,
    color:string,
    rej_qty:number ,
    ok_qty:number,
    total_rewash:number
}
type FetchBatchDetails={
    id:number,
    mpo:string,
    style:string,
    so:string,
    quantity:number,
    rewash_quantity:number,
    add:boolean
}
export default function FirstWashQC(){
    const individualBarcodeRef = React.useRef<HTMLInputElement>(null);
    const [invbarcode,setinvbarcode]=React.useState<string>("");
    const batchqrcoderef=useRef<HTMLInputElement>(null);
    const [fetchedBatch,setfetchedBatch]=useState<FetchBatchMeta|null>(null)
    const [fetchedBatchDetails, setFetchedBatchDetails] = useState<FetchBatchDetails[]>([]);
    const [reason,setReason]=React.useState<string>("");
    const rejectReasons=WhiskerRejectReasons;
    // const [addOnBatch,setAddOnBatch]=useState<{id:number,add:boolean}>()
    const [reasonDisplay,setReasonDisplay]=React.useState<string>("");
    const [rejectPop,setRejectPop]=useState<boolean>(false)
    const [rows, setRows] = useState<any[]>([]);
    const [deleteError,setDeleteError]=React.useState<string>("")
    const [deletePop, setDeletePop] = React.useState<boolean>(false);
    const [rejectError,setRejectError]=React.useState<string>("");
    const [rejectField,setRejectField]=React.useState<boolean>(false);
    const [deleteId, setDeleteId] = React.useState<number>(0);
    // const [batchtype,setBatchType]=useState<string>("")
    const [batchId,setBatchId]=useState<number>(0)
    const [rejectDone,setRejectDone]=useState<boolean>(false)
    const [batchqr,setBatchQR]=useState<string>("")
    const [indivScanned,setIndivScanned]=useState<boolean>(false)
    const [addOn,setAddOn]=useState<boolean>(false)
    const [rewashQty, setRewashQty] = useState<number>(0);
    const [updateDone,setUpdateDone]=useState<boolean>(false)
    const [shade,setShade]=useState<string>("")
    const [diffPop,setDiffPop]=useState<boolean>(false)
    const [activeId, setActiveId] = useState<number|null>(null);


    useEffect(()=>{
        fetchData(batchqr)
    },[rejectDone,updateDone])

    useEffect(() => {
        if (indivScanned) {
            fetchRejectedBundle();
        }
    }, [indivScanned,invbarcode]);

    const fetchRejectedBundle = () => {
        let tempStr=invbarcode.slice(0, 12);
        let rejectedBundle=`8220${tempStr}001`
        
        getData<BundleInfo[]>(
            `productions/received-bundles/`,
            ip,
            {},
            {},
            (bundles: BundleInfo[]) => {

                let tempRows: any[] = [];
                let returnEarly=false
                for (const obj of bundles) {
                    if (obj.bundle_barcode == rejectedBundle) {
                        if(obj.shade!=shade)
                        {
                            returnEarly=true
                            setDiffPop(true)
                            break
                        }

                        tempRows.push({
                            id: obj.id,
                            individual_barcode: invbarcode,
                            mpo: obj.mpo,
                            color: obj.color,
                            buyer: obj.buyer,
                            shade: obj.shade,
                            size: obj.size,
                            style: obj.style,
                            so: obj.so,
                            rejected_at: 'first wash',
                            reason: reason,
                            // saved:false
                        });
                    }
                }
                if(returnEarly)
                        return

                setRows(prevRows => [...tempRows, ...prevRows]);
            }
        );
    };

    const fetchData=(batchcode:string)=>{
         if (!batchcode) {
            console.warn("No Barcode entered");
            return;
        }
        let firstWash=false
        let reWash=false
        // First API call (washing scan) ---
        const str=batchcode
        setBatchQR(batchcode)
        if(str.length==16 && str[0]=='R')
            reWash=true
        else if(str.length==15)
            firstWash=true
        const index = str.indexOf("W1");      // find position of ":"
        let batchId = str.substring(index + 2);
        const batchIdNum = parseInt(batchId, 10);
        // const contentType=firstWash?'batchforfirstwash':'batchforrewash'
        // setBatchType(contentType)
        getData<WetProcessBatchMeta[]>(
            washlog,
            ip,
            {},
            {
                batch:batchIdNum
            },
            (log:WetProcessBatchMeta[])=>{
                let rewashQty=0
                for(const obj of log){
                    rewashQty+=obj.rewash_quantity
                }
                setfetchedBatch(
                    {
                        'id':log[0].batch.id,
                        'buyer':log[0].batch.buyer,
                        'shade':log[0].batch.shade,
                        'color':log[0].batch.color,
                        'rej_qty':log[0].batch.rejection_count,
                        'ok_qty':log[0].batch.total_quantity-(rewashQty+log[0].batch.rejection_count),
                        'total_rewash':rewashQty
                    }
                )
                const details=[]

                for(const obj of log){
                    details.push({
                        id:obj.source.id,
                        mpo:obj.source.mpo,
                        style:obj.source.style,
                        so:obj.source.so,
                        quantity:obj.quantity,
                        rewash_quantity:obj.rewash_quantity,  
                        add:false,
                    })
                }
                

                setFetchedBatchDetails(details)
                setBatchId(batchIdNum)
                setIndivScanned(false)
                setShade(log[0].batch.shade)
                
            },
            (error:any)=>{
                console.log(error)
            }
            
        )

    }
     const handleRowReasonChange = (rowInvBar: string, newReason: string) => {
            setRows((prevRows) =>
                prevRows.map((row) =>
                    row.individual_barcode === rowInvBar ? { ...row, reason: newReason } : row,
                ),
            )
            console.log(rows)
            
    }
    return <>
                <TextField
                
                style={{outline:"red",
                    marginLeft:'160px',
                    position:"fixed",
                    display:'flex',
                    
                    // height:20,
                    top:80,
                    alignItems:"flex-start",
                }}
                inputRef={batchqrcoderef}
                label="Scan BatchQRCode Here"
                
                autoFocus
                 onChange={() => {
                    // setfetchedBatch(null)
                    setRejectField(false)
                    setRejectDone(false)
                    setRows([])
                    const batchcode = batchqrcoderef.current?.value.trim() || "";
                    if(batchcode.length>=15){
                        fetchData(batchcode);
                        batchqrcoderef.current!.value = "";
                    }
                    else{
                        // setShowPopup(false);
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
                        "& .MuiInputBase-root": {
                            height: 40, // total height
                        },
                    }}
                />
                

               
                

                

                
               {fetchedBatch!=null && ( 
                
            <div style={{display:'flex',flexDirection:'column',gap:3,position:'fixed',top:130}}>

                    <div style={{marginLeft:'160px'}}>
                        <p><span style={{color:tbCellColor,fontWeight:"bold"}}>Buyer</span> - 
                        <span style={{fontWeight:'bold'}}>{fetchedBatch.buyer} </span> - 
                        <span style={{color:tbCellColor,fontWeight:"bold"}}>Color</span> - 
                        <span style={{fontWeight:'bold'}}>{fetchedBatch.color} </span> - 
                        <span style={{color:tbCellColor,fontWeight:"bold"}}>Shade</span> - 
                        <span style={{fontWeight:'bold'}}>{fetchedBatch.shade} </span> - 
                        <span style={{color:tbCellColor,fontWeight:"bold"}}>Ok Quantity</span> - 
                        <span style={{fontWeight:'bold'}}>{fetchedBatch.ok_qty} </span> - 
                        <span style={{color:tbCellColor,fontWeight:"bold"}}>Total Rewash</span> - 
                        <span style={{fontWeight:'bold'}}>{fetchedBatch.total_rewash} </span> - 
                        <span style={{color:tbCellColor,fontWeight:"bold"}}>Rejected Quantity</span> - 
                        <span style={{fontWeight:'bold'}}>{fetchedBatch.rej_qty} </span> </p>
                    </div>
                    {/* <TableContainer
                            component={Paper}
                            sx={{
                            // maxHeight: 300,          // vertical scrollbar
                            overflowX: "auto",       // horizontal scrollbar
                            overflowY: "auto",
                            maxWidth: 1000,
                            border:'none',
                            marginLeft:'135px',
                            // marginTop:'20px',
                            height:'110px'
                            // marginLeft:'100px',
                            }}
                        >
                            <Table
                            stickyHeader
                            sx={{
                                '& .MuiTableCell-root':{
                                    borderBottom:'none'
                                },
                                // height:'110px'
                            }}
                            // sx={{ minWidth: 800 }}   // force horizontal scroll if screen is smaller
                            aria-label="customized table"
                            >
                            <TableHead>
                                <TableRow>
                                <StyledTableCell align="center">Buyer</StyledTableCell>
                                <StyledTableCell align="center">Shade</StyledTableCell>
                                <StyledTableCell align="center">Color</StyledTableCell>
                                <StyledTableCell align="center">Ok Quantity</StyledTableCell>
                                <StyledTableCell align="center">Total Rejected</StyledTableCell>
                            
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                <StyledTableRow >
                                    <StyledTableCell align="center">{fetchedBatch?.buyer}</StyledTableCell>
                                    <StyledTableCell align="center">{fetchedBatch?.shade}</StyledTableCell>
                                    <StyledTableCell align="center">{fetchedBatch?.color}</StyledTableCell>
                                    <StyledTableCell align="center">{fetchedBatch?.ok_qty}</StyledTableCell>
                                    <StyledTableCell align="center">{fetchedBatch?.rej_qty}</StyledTableCell>
                                </StyledTableRow>
                            </TableBody>
                            </Table>
                        </TableContainer> */}

                            <TableContainer
                            component={Paper}
                            sx={{
                            maxHeight: 220,          // vertical scrollbar
                            overflowX: "auto",       // horizontal scrollbar
                            overflowY: "auto",
                            maxWidth: 800,
                            border:'none',
                            marginLeft:'150px',
                            position:'relative'
                            // marginTop:'20px',
                            // height:'110px'
                            // marginLeft:'100px',
                            }}
                        >
                        <Table
                        stickyHeader
                        sx={{
                            '& .MuiTableCell-root':{
                                borderBottom:'none'
                            },
                            // height:'110px'
                        }}
                        // sx={{ minWidth: 800 }}   // force horizontal scroll if screen is smaller
                        aria-label="customized table"
                        >
                        <TableHead>
                            <TableRow>
                            <StyledTableCell align="center">MPO</StyledTableCell>
                            <StyledTableCell align="center">Style</StyledTableCell>
                            <StyledTableCell align="center">Sales Order</StyledTableCell>
                                <StyledTableCell align="center">Original Quantity</StyledTableCell>
                            
                            <StyledTableCell align="center">Rewash</StyledTableCell>
                            <StyledTableCell align="center">Add Rewash</StyledTableCell>
                        
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {fetchedBatchDetails.map((batch)=>(
                            <StyledTableRow key={batch.id}>
                                <StyledTableCell align="center">{batch?.mpo}</StyledTableCell>
                                <StyledTableCell align="center">{batch?.style}</StyledTableCell>
                                <StyledTableCell align="center">{batch?.so}</StyledTableCell>
                                <StyledTableCell align="center"> {batch?.quantity}</StyledTableCell>
                                
                               
                                {/* <StyledTableCell align="center">{fetchedBatchDetails?.rejected_quantity}</StyledTableCell>/ */}
                                <StyledTableCell align="center">{batch?.rewash_quantity}</StyledTableCell>

                                <StyledTableCell align="center">
                                    {
                                        activeId==batch.id &&
                                        (
                                        
                                            <Box
                                                sx={{
                                                    display:'flex',
                                                     gap:2 ,
                                                    position:'relative',
                                                    height:'22px',
                                                   marginTop:0
                                                }}
                                            >
                                                <NumberSpinner
                                                    size="small"
                                                    min={1}
                                                    customSize={5}
                                                    max={batch? (batch.quantity - batch.rewash_quantity):0}
                                                    // style={{ marginTop: "-10px" }}  
                                                    // disabled
                                                    // style={{
                                                    //     right:0,
                                                    //     position:'fixed'
                                                    // }}
                                                    onValueChange={(value) => setRewashQty(value ?? 0)}
                                                    disableDecrement
                                                />
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    sx={{
                                                        height:'15px',
                                                        alignItems:'center',
                                                        justifyContent:'center',
                                                        // mt:1.5,
                                                        position:'relative'
                                                    }}
                                                    onClick={()=>{
                                                        // console.log(fetchedBatch.id)
                                                        // console.log(batch.id,' ',batch.rewash_quantity)
                                                        patchData<WetProcessBatchMeta>(
                                                            `wet-process/batch-sources/${batch?.id}/`,
                                                            ip,
                                                            {
                                                                rewash_quantity: (batch?.rewash_quantity ?? 0) + rewashQty
                                                            },
                                                            (update:WetProcessBatchMeta)=>{
                                                                // console.log(update.id)
                                                                // console.log(batch?.rewash_quantity?? 0 + rewashQty)
                                                                // console.log(rewashQty)
                                                                console.log(update)
                                                                // setAddOn(false)
                                                                batch.add=false
                                                                setActiveId(null);
                                                                // for(const obg
                                                                // setRewashQty()
                                                                setUpdateDone(prev => !prev)
                                                            }
                                                        )
                                                        // setAddOn(false)
                                                    }}
                                                // disabled={!reason}
                                                // onClick={() => {setRejectPop(true)
                                                //     setIndivScanned(false)}
                                                // }
                                                >
                                                    Save
                                                </Button>
                                            </Box>
                                            
                                        )
                                    }
                                    {activeId!=batch.id &&
                                        (
                                            <Button
                                            sx={{
                                                background:tbCellColor,
                                                color:'white',
                                                height:'15px',
                                                marginTop:0
                                            }}
                                            onClick={()=>{setActiveId(batch.id)}}
                                            >
                                                Add +
                                            </Button>
                                        )
                                    }
                                
                                
                                </StyledTableCell>
                            </StyledTableRow>
                            ))}
 
                        </TableBody>
                        </Table>
                    </TableContainer>
                </div>
                )}


            {fetchedBatch && (
                <>
                    <Box
                    sx={{
                        display: "flex",
                        position:'relative',
                        // top:'60px',
                        flexDirection: "row",
                        alignItems: "center", // vertically center all items
                        gap: 2, // space between items
                        mt: 30,
                        ml: "150px", // adjust margin as needed
                        // height:'20px'
                    }}
                    // style={{
                    //     position:'fixed'
                    // }}
                    >
                    <FormControl sx={{ width: 150 ,"& .MuiInputBase-root": {
                                    height: 40, // total height
                                    },}}>
                        <InputLabel id="reject-reason-label">Reject Reason</InputLabel>
                        <Select
                            labelId="reject-reason-label"
                            id="reject-reason"
                            value={reason}
                            onChange={(e: SelectChangeEvent) => {
                            const selectedActual = e.target.value;
                            setReason(selectedActual);

                            const selectedItem = rejectReasons.find(
                                (item) => item.actual === selectedActual
                            );
                            setReasonDisplay(selectedItem?.display || "");
                            }}
                        >
                            {rejectReasons.map((item) => (
                            <MenuItem key={item.actual} value={item.actual}>
                                {item.display.toUpperCase()}
                            </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {/* Individual Barcode Input */}
                    
                    {reason!="" &&(<TextField
                        label="Scan Individual Barcode Here"
                        inputRef={individualBarcodeRef}
                        onChange={() => {
                        const inv = individualBarcodeRef.current?.value.trim() || "";
                        if (inv.length === 16) {
                            setinvbarcode(inv);
                            setRejectField(true);
                            setIndivScanned(true)
                            individualBarcodeRef.current!.value = "";
                        }
                        }}
                        sx={{ width: 150,"& .MuiInputBase-root": {
                            height: 40, // total height
                        }, }}
                    />)}

                    {/* Reject Reason Select */}
                    {/* {rejectField && ( */}

                    {/* )} */}
                    {indivScanned
                        &&(
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap:5,
                                }}
                            >
                                <DoneAllIcon style={{ color: "green", fontSize: 18 }} />
                                <p style={{ margin: 0,color:'green',fontWeight:'bold',fontSize:18 }}>Scanned, Individual Barcode {rows[rows.length - 1]?.individual_barcode}</p>
                            </div>
                        )
                    }
                    {/* Save Button */}
                   
                    </Box>

                    {/* Table below */}
                    <Box sx={{ ml:'40px' }}>
                    <TableContainer component={Paper} sx={{ maxHeight: 180, overflow: "auto",marginLeft:"105px",position:'relative',top:'10px'}}>
                        <Table stickyHeader aria-label="customized table">
                        <TableHead>
                            <TableRow>
                            <StyledTableCell align="center">Individual Barcode</StyledTableCell>
                            <StyledTableCell align="center">Buyer</StyledTableCell>
                            <StyledTableCell align="center">Sales Order</StyledTableCell>
                            <StyledTableCell align="center">Style</StyledTableCell>
                            <StyledTableCell align="center">Shade</StyledTableCell>
                            <StyledTableCell align="center">Color</StyledTableCell>
                            <StyledTableCell align="center">Size</StyledTableCell>
                            <StyledTableCell align="center">Rejected At</StyledTableCell>
                            <StyledTableCell align="center">Reason</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                            <StyledTableRow key={row.id}>
                                <StyledTableCell align="center">{row.individual_barcode}</StyledTableCell>
                                <StyledTableCell align="center">{row.buyer}</StyledTableCell>
                                <StyledTableCell align="center">{row.so}</StyledTableCell>
                                <StyledTableCell align="center">{row.style}</StyledTableCell>
                                <StyledTableCell align="center">{row.shade}</StyledTableCell>
                                <StyledTableCell align="center">{row.color}</StyledTableCell>
                                <StyledTableCell align="center">{row.size}</StyledTableCell>
                                <StyledTableCell align="center">
                                <b>{row.rejected_at.toUpperCase()}</b>
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                <b style={{ color: "red" }}>
                                     <FormControl sx={{ width: 150 ,height:'22px',marginTop:-1}} size="small">
    
                                            <Select
                                                labelId="reject-reason-label"
                                                id={`reject-reason-${row.individual_barcode}`}
                                                value={row.reason}
                                                onChange={(e) => handleRowReasonChange(row.individual_barcode, e.target.value as string)}
                                                style={{height:'22px'}}
                                                // setReason(selectedActual);

                                                // const selectedItem = rejectReasons.find(
                                                //     (item) => item.actual === selectedActual
                                                // );
                                                // setReasonDisplay(selectedItem?.display || "");
                                                // }}
                                            >
                                                {rejectReasons.map((item) => (
                                                <MenuItem key={item.actual} value={item.actual}>
                                                    {item.display.toUpperCase()}
                                                </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    {/* {reason.toUpperCase()} */}
                                </b>
                                </StyledTableCell>
                            </StyledTableRow>
                            ))}
                        </TableBody>
                        </Table>
                    </TableContainer>
                     {indivScanned && (
                        <Button
                        variant="contained"
                        color="primary"
                        disabled={!reason}
                        onClick={() => {
                            console.log(rows)
                            setRejectPop(true)
                            setIndivScanned(false)}
                        }
                        sx={{
                            position:'relative',
                            top:50
                        }}
                        >
                        Save
                        </Button>
                    )}
                    </Box>
                </>
                )}
{/*                 
                        <Modal open={deletePop && deleteId !== 0} onClose={() => {setDeletePop(false);setDeleteId(0);}}>
                                <Box
                                    sx={{
                                    position: "fixed",
                                    top: 0,
                                    left: 0,
                                    width: "100vw",
                                    height: "100vh",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    bgcolor: "rgba(148, 131, 131, 0.5)", // dark overlay
                                    }}
                                >
                                    <Box
                                        sx={{
                                            bgcolor: "#fea116", // light red background for error
                                            p: 4,
                                            borderRadius: 2,
                                            color: "black", // red text for error
                                            width: 400,
                                        }}
                                    >
                                    <Typography variant="h4">Are you Sure?</Typography>
                                    
                                    {/* <Typography>Already batches are allocated according to this plan */}
                                    {/* </Typography> */}
                                    {/* <div style={{
                                    display:'flex',
                                    justifyContent:'space-between'
                                    }}>
                                        <Button sx={{ mt: 2 ,background:'red',color:'white'}}
                                            onClick={()=>handleDelete(deleteId)}>Delete</Button>
                                        <Button sx={{ mt: 2 ,background:'green',color:'white'}} onClick={() => {setDeletePop(false);setDeleteId(0);}}>Cancel</Button>
                                    </div>
                                    
                                    </Box>
                                </Box>
                        </Modal> */} 
                    <Modal open={rejectPop} onClose={() => setRejectPop(false)}>
                        <Box
                        sx={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            width: "100vw",
                            height: "100vh",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: "rgba(148, 131, 131, 0.5)", // dark overlay
                        }}
                        >
                        <Box
                            sx={{
                                bgcolor: "#ffffe0", // light red background for error
                                
                                border:'3px solid #e6db55',// light red background for error
                                p: 4,
                                borderRadius: 2,
                                color: "#9c9999", // red text for error
                                width: 400,
                            }}
                        >
                            <Typography variant="h4">Are you sure?</Typography>
                            <Typography variant="h6">
                            You want to reject {rows.length > 1 ? `${rows.length} these` : `${rows.length} this`} {rows.length > 1 ? `${rows.length} pieces` : `${rows.length} piece`}
                            {/* <b>{reasonDisplay?.toUpperCase() || ""}</b>  */}
                            <br></br>in First Wash Stage
                            </Typography>

                            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                            <Button sx={{ background: "blue", color: "white" }} onClick={() => {
                                console.log(rows)
                                let payload_rejs:RejPayload[]=[]
                                for(const row of rows){

                                    // if(!row.saved){
                                        payload_rejs.push({
                                             individual_barcode:row.individual_barcode,
                                             reason:row.reason
                                        })
                                    // }
                                }
                                if(payload_rejs.length>0){
                                        postData<WetWashRejection[]>(
                                        "wet-process/rejections/",
                                        ip,
                                        {                  
                                            batch: batchId,
                                            rejections:payload_rejs
                                        },
                                        (data:WetWashRejection[]) => {
                                            console.log("Rejection recorded:", data);
                                            // rows.saved=true
                                            setRejectPop(false);
                                            setReason("");
                                            setReasonDisplay("");
                                            setRejectDone(prev => !prev);
                                            setRows([])
                                            // setRows(prev =>
                                            //     prev.filter(item => item.individual_barcode !== row.individual_barcode)
                                            // );
                                            // setRows((prev)=>)
                                            // setBatchId(0);
                                            // setfetchedBatch(null)
                                    

                                        },
                                        (error: any) => {
                                            console.error("Error recording rejection:", error);

                                            const errorMsg =
                                            error?.response?.data?.individual_barcode?.[0] ||
                                            error?.response?.data?.[0] ||
                                            "Something went wrong";

                                            setRejectError(errorMsg);
                                            setReason("");
                                            setReasonDisplay("");
                                            setRejectPop(false);
                                        }
                                    
                                    )
                                }
                            }}>
                                Yes
                            </Button>
                            <Button sx={{ background: "red", color: "white" }} onClick={() => {setRejectPop(false);setReasonDisplay("");setReason("");}}>
                                Exit
                            </Button>
                            </Box>
                        </Box>
                        </Box>
                    </Modal>
                    <Modal open={rejectError!=""} onClose={() => setRejectError("")}>
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
                                <Typography variant="h6">{rejectError}</Typography>
                                {/* <Typography>Already batches are allocated according to this plan */}
                                {/* </Typography> */}
                                <Button sx={{ mt: 2 }} onClick={() => setRejectError("")}>Close</Button>
                                </Box>
                            </Box>
                        </Modal>


                        <Modal open={deleteError!=""} onClose={() => setDeleteError("")}>
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
                                <Typography variant="h6">{deleteError}</Typography>
                                {/* <Typography>Already batches are allocated according to this plan */}
                                {/* </Typography> */}
                                <Button sx={{ mt: 2 }} onClick={() => {setDeleteError("");setDeletePop(false);setDeleteId(0);}}>Close</Button>
                                </Box>
                            </Box>
                            </Modal>


                            <Modal open={diffPop} onClose={() => setDiffPop(false)}>
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
                                <Typography variant="h6">Wrong Piece</Typography>
                                <Typography>You have Scanned an Individual Piece which doesn't have <b>{shade}</b> shade.. 
                                </Typography>
                                <Button sx={{ mt: 2 }} onClick={() => {setDiffPop(false)}}>Close</Button>
                                </Box>
                            </Box>
                            </Modal>
                            <Modal open={rejectDone} onClose={() => setRejectDone(false)}>
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
                                          bgcolor: "rgba(0, 0, 0, 0.07)", // dark overlay
                                          }}
                                      >
                                          <Box
                                          sx={{
                                              bgcolor: "white", // light red background for error
                                              p: 4,
                                              borderRadius: 2,
                                              color: "green", // red text for error
                                              width: 400,
                                          }}
                                          >
                                          <Typography variant="h6">Sucessfully Saved</Typography>
                                          {/* <Typography>Already batches are allocated according to this plan */}
                                          {/* </Typography> */}
                                          <Button sx={{ mt: 2 }} onClick={() => setRejectDone(false)}>Close</Button>
                                          </Box>
                                      </Box>
                                  </Modal>
            </>
}