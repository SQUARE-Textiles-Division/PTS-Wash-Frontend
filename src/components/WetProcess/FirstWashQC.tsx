import { Box, Button, Checkbox, FormControl, InputLabel, MenuItem, Modal, Paper, Select, styled, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow, TextField, Typography, type SelectChangeEvent } from "@mui/material";
import {  useRef, useState } from "react";
// import { getData, patchData, postData } from "../genericApiService";
// import { washlog } from "../../endpoints";
import { ip } from "../../ip";
import { tbCellColor, tbRowColor } from "../Colors/Colors";
import DoneAllIcon from '@mui/icons-material/DoneAll';
import React from "react";
// import { WhiskerRejectReasons } from "../RejectionReasons/WhiskerRejectReasons";
import {WetRejectReasons} from "../RejectionReasons/WetRejectReasons"
// import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
// import type FirstWashRejection from "../../TypeAnnotations/WetWashRejection";
// import type BundleInfo from "../../TypeAnnotations/BundleInfo";
import NumberSpinner from "../NumberSpinner";
// import type FetchFirstWash from "../../TypeAnnotations/WetProcessBatchMeta";
// import type WetProcessBatchMeta from "../../TypeAnnotations/WetProcessBatchMeta";
import type WetProcessBatch from "../../TypeAnnotations/WetProcessBatch";
// import type WetWashRejection from "../../TypeAnnotations/WetWashRejection";
import type IndividualInfo from "../../TypeAnnotations/IndividualInfo";


// import {
// //   Box,
//   Card,
//   CardContent,
//   Grid,
// //   Typography,
// } from "@mui/material";


import type WetProcessStage from "../../TypeAnnotations/WetProcessStage";
import type CompletedQc from "../../TypeAnnotations/CompletedQc";
import { StageDispMap } from "../../StageDispMap";
import { useApiService } from "../genericApiService";
// import NumberField from './components/NumberField';

const StyledTableCell = styled(TableCell)(({  }) => ({
  [`&.${tableCellClasses.head}`]: {
    // backgroundColor: theme.palette.common.black,
    // backgroundColor: '#485e68',
    backgroundColor: tbCellColor,
     lineHeight: 0.2 , 
     fontSize: 14,
    color: "white",
  },
  [`&.${tableCellClasses.body}`]: {
     lineHeight: 1,  
    fontSize: 14,
    padding: '0px 6px',
    // lineHeight: 0.8, 
  },
}));

const StyledTableRow = styled(TableRow)(({  }) => ({
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
    // individual_barcode:string,
    // reason:string
    garment_unit:string,
    rejection_reason:string
}
type FetchBatchMeta={
    id:string,
    buyer:string,
    shade:string,
    color:string,
    qty:number,
    rej_qty:number ,
    ok_qty:number,
    total_rewash:number
}
type FetchBatchDetails={
    id: number,
    mpo : string,
    style: string,
    so: string,
    quantity: number,
    rewash_quantity: number,
    rejection_quantity: number
    // add:boolean
}
export default function FirstWashQC({stage}:WetProcessStage){
    const {getData,postData,patchData}=useApiService()
    const [batchComplete,setBatchComplete]=useState<boolean>(false)
    const [qcCompletePop,setQcCompletePop]=useState<boolean>(false)
    const individualBarcodeRef = React.useRef<HTMLInputElement>(null);
    // const [invbarcode,setinvbarcode]=React.useState<string>("");
    const batchqrcoderef=useRef<HTMLInputElement>(null);
    const [fetchedBatch,setfetchedBatch]=useState<FetchBatchMeta|null>(null)
    const [fetchedBatchDetails, setFetchedBatchDetails] = useState<FetchBatchDetails[]>([]);
    const [reason,setReason]=React.useState<string>("");
    const rejectReasons=WetRejectReasons;
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
    const [batchId,setBatchId]=useState<string>("")
    const [rejectDone,setRejectDone]=useState<boolean>(false)
    const [batchqr,setBatchQR]=useState<string>("")
    const [indivScanned,setIndivScanned]=useState<boolean>(false)
    // const [addOn,setAddOn]=useState<boolean>(false)
    // const [rewashQty, setRewashQty] = useState<number>(0);
    // const [updateDone,setUpdateDone]=useState<boolean>(false)
    const [shade,setShade]=useState<string>("")
    const [diffPop,setDiffPop]=useState<boolean>(false)
    // const [activeId, setActiveId] = useState<number|null>(null);
    const [selectedSources, setSelectedSources] = useState<{batch_source:number, rewash_quantity:number}[]>([]);
    const [filter, setFilter] = useState({
        MPO: "",
        Style: "",
        SO: "",
    });

    const [addRewashError,setAddRewashError]=useState<string>("")
    const [chosenQty, setChosenQty] = useState<Record<number, number|null>>({});

    console.log(filter,deleteId,deletePop,rejectField,reasonDisplay)
    // useEffect(()=>{
    //     fetchData(batchqr)
    // },[rejectDone,updateDone])

    // useEffect(() => {
    //     if (indivScanned) {
    //         fetchRejectedBundle();
    //     }
    // }, [indivScanned,invbarcode]);




    // const fetchPieceData=(barcode:string)=>{
    const fetchPieceDetails=(inv:string)=>{
        getData<IndividualInfo>(
            `common/garment-units/${inv}`,
            ip,
            {},
            {},
            (data: IndividualInfo) => {
                let tempRows: any[] = [];

                tempRows.push({
                    individual_barcode: data.individual_barcode,
                    mpo: data.mpo,
                    color: data.color,
                    buyer: data.buyer,
                    shade: data.shade,
                    size: data.size,
                    style: data.style,
                    so: data.so,
                    rejected_at: stage,
                    reason: reason,
                    // saved:false
                });
                setRows(prevRows => {
                    const filteredTemp = tempRows.filter(temp =>
                        !prevRows.some(prev => prev.individual_barcode === temp.individual_barcode)
                    );

                    return [...filteredTemp, ...prevRows];
                });
                setIndivScanned(true)
            },
            (error:any)=>{
                console.log(error)
                setRejectError("Invalid Barcode. Please scan a valid individual barcode.")
                // setRejectPop(true)
                setIndivScanned(false)
            }
        )

    }



    // const fetchRejectedBundle = () => {
    //     let tempStr=invbarcode.slice(0, 12);
    //     let rejectedBundle=`8220${tempStr}001`
        
    //     getData<BundleInfo[]>(
    //         `productions/received-bundles/`,
    //         ip,
    //         {},
    //         {},
    //         (bundles: BundleInfo[]) => {

    //             let tempRows: any[] = [];
    //             let returnEarly=false
    //             for (const obj of bundles) {
    //                 if (obj.bundle_barcode == rejectedBundle) {
    //                     if(obj.shade!=shade)
    //                     {
    //                         returnEarly=true
    //                         setDiffPop(true)
    //                         break
    //                     }

    //                     tempRows.push({
    //                         id: obj.id,
    //                         individual_barcode: invbarcode,
    //                         mpo: obj.mpo,
    //                         color: obj.color,
    //                         buyer: obj.buyer,
    //                         shade: obj.shade,
    //                         size: obj.size,
    //                         style: obj.style,
    //                         so: obj.so,
    //                         rejected_at: stage,
    //                         reason: reason,
    //                         // saved:false
    //                     });
    //                 }
    //             }
    //             if(returnEarly)
    //                     return

    //             setRows(prevRows => [...tempRows, ...prevRows]);
    //         }
    //     );
    // };

    const fetchData=(batchcode:string)=>{
         if (!batchcode) {
            console.warn("No Barcode entered");
            return;
        }
        // let firstWash=false
        // let reWash=false
        // First API call (washing scan) ---
        // const str=batchcode
        setBatchQR(batchcode)
        // if(str.length==16 && str[0]=='R')
        //     reWash=true
        // else if(str.length==15)
        //     firstWash=true
        // const index = str.indexOf("W1");      // find position of ":"
        // let batchId = str.substring(index + 2);
        // const batchIdNum = parseInt(batchId, 10);
        const batchIdNum = batchcode

        getData<WetProcessBatch>(
            `wet-process/batches/${batchIdNum}`,
            ip,
            {},
            {},
            (batchData: WetProcessBatch) => {  
                if(batchData.stage!=stage){
                    setRejectError(`Batch is currently in ${StageDispMap[batchData.stage]} stage. Please scan a batch in ${StageDispMap[stage]} stage.`)
                    return
                } 
                else if(batchData.status=="completed"){
                    setRejectError("You have already completed QC for this Batch.")
                    return
                }
                setfetchedBatch(
                    {
                        'id':batchData.id,
                        'buyer':batchData.buyer,
                        'shade':batchData.shade,
                        'color':batchData.color,
                        'qty':batchData.total_quantity,
                        'rej_qty':batchData.total_rejection_quantity,
                        'ok_qty':batchData.total_quantity-(batchData.total_rewash_quantity+batchData.total_rejection_quantity),
                        'total_rewash':batchData.total_rewash_quantity
                    }
                )
                const details=[]

                for(const obj of batchData.sources){ 
                    
                    details.push({
                        'id':obj.id,
                        'mpo':obj.mpo,
                        'style':obj.style,
                        'so':obj.so,
                        'quantity':obj.quantity,
                        'rewash_quantity':obj.rewash_quantity,  
                        'rejection_quantity':obj.rejection_quantity,
                        // 'add':false
                    })
                    console.log(obj)
                }
                setFetchedBatchDetails(details)
                setBatchId(batchIdNum)
                setIndivScanned(false)
                setShade(batchData.shade)
            }
        )
        // const contentType=firstWash?'batchforfirstwash':'batchforrewash'
        // setBatchType(contentType)
        // getData<WetProcessBatchMeta[]>(
        //     washlog,
        //     ip,
        //     {},
        //     {
        //         batch:batchIdNum
        //     },
        //     (log:WetProcessBatchMeta[])=>{
        //         let rewashQty=0
        //         for(const obj of log){
        //             rewashQty+=obj.rewash_quantity
        //         }
        //         setfetchedBatch(
        //             {
        //                 'id':log[0].batch.id,
        //                 'buyer':log[0].batch.buyer,
        //                 'shade':log[0].batch.shade,
        //                 'color':log[0].batch.color,
        //                 'rej_qty':log[0].batch.rejection_count,
        //                 'ok_qty':log[0].batch.total_quantity-(rewashQty+log[0].batch.rejection_count),
        //                 'total_rewash':rewashQty
        //             }
        //         )
        //         const details=[]

        //         for(const obj of log){
        //             details.push({
        //                 id:obj.source.id,
        //                 mpo:obj.source.mpo,
        //                 style:obj.source.style,
        //                 so:obj.source.so,
        //                 quantity:obj.quantity,
        //                 rewash_quantity:obj.rewash_quantity,  
        //                 add:false,
        //             })
        //         }
                

        //         setFetchedBatchDetails(details)
        //         setBatchId(batchIdNum)
        //         setIndivScanned(false)
        //         setShade(log[0].batch.shade)
                
        //     },
        //     (error:any)=>{
        //         console.log(error)
        //     }
            
        // )

    }
     const handleRowSelect = (row: any, checked: boolean) => {
            if (checked) {
                // Add row to state with initial Quantity = 0
                setSelectedSources(prev => [
                ...prev,
                { batch_source: row.id, rewash_quantity: 0 },
                ]);
            }
            else {
                const key =row.id;
                setChosenQty(prev => ({
                    ...prev,
                    [key]: null
                }));
                // Remove row from state
                setSelectedSources(prev =>
                    prev.filter(item => item.batch_source !== row.id)
                );
            }
    };
    const handleQuantityChange = (row: any, value: number) => {
            console.log(value)
            const key =row.id;

            setChosenQty(prev => ({
                ...prev,
                [key]: value
            }));
            // console.log('Quantity changed for BatchNumber:', row.BatchNumber, 'New Quantity:', value);
            setSelectedSources(prev => {
                const exists = prev.find(item => item.batch_source === row.id);
                if (exists) {
                    console.log(exists)
                    return prev.map(item =>
                        item.batch_source === row.id
                        ? { ...item, rewash_quantity: value }
                        : item
                    );
                } 
                else {
                // Automatically add row if it doesn’t exist
                    return [...prev, { batch_source: row.id, rewash_quantity: value }];
                }
            });
        };
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
                    // marginLeft:'160px',
                    position:"fixed",
                    display:'flex',
                    
                    // height:20,
                    top:80,
                    left:250,
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
                <Button 
                onClick={() => setQcCompletePop(true)} 
                sx={{ backgroundColor: "green", color: "white" ,position:'fixed',top:80,left:1000}}>QC Complete</Button>
            )}

                
            {fetchedBatch!=null && ( 
                
            <div style={{display:'flex',flexDirection:'column',gap:3,position:'fixed',top:130,left:100}}>
                

                    <div style={{marginLeft:'160px'}}>
                        
                        <p>
                         <span style={{color:tbCellColor,fontWeight:"bold"}}>BatchQRCode</span> -
                          <span style={{fontWeight:"bold"}}>{fetchedBatch.id}</span> -  
                        <span style={{color:tbCellColor,fontWeight:"bold"}}>Buyer</span> - 
                        <span style={{fontWeight:'bold'}}>{fetchedBatch.buyer} </span> - 
                        <span style={{color:tbCellColor,fontWeight:"bold"}}>Color</span> - 
                        <span style={{fontWeight:'bold'}}>{fetchedBatch.color} </span> - 
                        <span style={{color:tbCellColor,fontWeight:"bold"}}>Shade</span> -
                        <span style={{fontWeight:'bold'}}>{fetchedBatch.shade} </span> 
                        </p>
                        <p>
                        
                        <span style={{color:tbCellColor,fontWeight:"bold"}}>Total Quantity</span> - 
                        <span style={{fontWeight:'bold'}}>{fetchedBatch.qty} </span> - 
                        <span style={{color:tbCellColor,fontWeight:"bold"}}>Total Rewash</span> - 
                        <span style={{fontWeight:'bold'}}>{fetchedBatch.total_rewash} </span> - 
                        <span style={{color:tbCellColor,fontWeight:"bold"}}>Rejected Quantity</span> - 
                        <span style={{fontWeight:'bold'}}>{fetchedBatch.rej_qty} </span> -
                        <span style={{color:tbCellColor,fontWeight:"bold"}}>Ok Quantity</span> - 
                        <span style={{fontWeight:'bold'}}>{fetchedBatch.ok_qty} </span> 
                        </p>
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
                                maxHeight: 120,          // vertical scrollbar
                                overflowX: "auto",       // horizontal scrollbar
                                overflowY: "auto",
                                maxWidth: 1000,
                                border:'none',
                                marginLeft:'150px',
                                position:'fixed',
                                top:200,
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
                            <StyledTableCell align="center"> 
                                <TextField
                                            
                                            sx={{
                                                background:'white',
                                                "& .MuiOutlinedInput-root": {
                                                    "&.Mui-focused fieldset": {
                                                        // borderColor: "#485e68",  
                                                        //       // Outline color on focus
                                                        borderColor:'white'
                                                    },
                                                    // "& input": {
                                                    //     textAlign: "center", // center input text
                                                    //     padding: "0 8px",
                                                    // },
                                                // height:'100%'
                                                // width:'5px'
                                                },
                                                "& .MuiInputLabel-root": {
                                                    "&.Mui-focused": {
                                                        color: "black",
                                                        fontWeight:'bold'               // Label/text color on focus
                                                    },
                                                    textAlign: "center",
                                                    // top:'50%'
                                                },
                                                // width: 100,
                                                fontWeight:'bold',
                                                "& .MuiInputBase-root": {
                                                    height: 20, // total height
                                                    width:'80px'
                                                },
                                                "& .MuiFormLabel-root":{
                                                    lineHeight:1,
                                                    fontSize:12,
                                                    left:10,
                                                    top:-5,
                                                    fontWeight:'bold'
                                                    // textAlign:'center'
                                                }
                                                // width:'5px'
                                                // fontSize:
                                                // height:'30px',
                                                // textEmphasisColor:'white'
                                            }}
                                            autoFocus
                                            size="small"
                                            label="MPO"
                                        
                                            
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setFilter((prev) => ({ ...prev, ["MPO"]: value }));
                                            }}
                                        >

                                </TextField>
                            </StyledTableCell>
                            <StyledTableCell align="center">
                                <TextField
                                                    
                                    sx={{
                                        background:'white',
                                        "& .MuiOutlinedInput-root": {
                                            "&.Mui-focused fieldset": {
                                                // borderColor: "#485e68",  
                                                //       // Outline color on focus
                                                borderColor:'white'
                                            },
                                            //  height:'100%'
                                        },
                                        "& .MuiInputLabel-root": {
                                            "&.Mui-focused": {
                                                color: "black",
                                                fontWeight:'bold'               // Label/text color on focus
                                            },
                                            //  textAlign: "center",
                                            
                                        },
                                        // width: 100,
                                        fontWeight:'bold',
                                            "& .MuiInputBase-root": {
                                                height: 20, // total height
                                                width:'80px'
                                            //  width:0
                                        },
                                        "& .MuiFormLabel-root":{
                                            lineHeight:1,
                                            fontSize:12,
                                            left:10,
                                            top:-5,
                                                fontWeight:'bold'
                                            // textAlign:'center'
                                        }
                                        // textEmphasisColor:'white'
                                    }}
                                    autoFocus
                                    size="small"
                                    label="Style"
                                        onChange={(e) => {
                                        const value = e.target.value;
                                        setFilter((prev) => ({ ...prev, ["Style"]: value }));
                                    }}
                                    
                                >
                                </TextField> 
                            </StyledTableCell>
                       
                            <StyledTableCell align="center">
                                <TextField
                                                        
                                    sx={{
                                        // alignItems:'center',
                                        background:'white',
                                        "& .MuiOutlinedInput-root": {
                                            "&.Mui-focused fieldset": {
                                                // borderColor: "#485e68",  
                                                //       // Outline color on focus
                                                borderColor:'white'
                                            },
                                            //  height:'100%'
                                        },
                                        "& .MuiInputLabel-root": {
                                        "&.Mui-focused": {
                                            color: "black",
                                            fontWeight:'bold'               // Label/text color on focus
                                        },
                                        },
                                        // width: 100,
                                        fontWeight:'bold',
                                        "& .MuiInputBase-root": {
                                                height: 20, // total height
                                                width:'120px'
                                        },
                                        "& .MuiFormLabel-root":{
                                            lineHeight:1,
                                            fontSize:12,
                                            left:10,
                                            top:-5,
                                            fontWeight:'bold'
                                            // textAlign:'center'
                                        }
                                        // textEmphasisColor:'white'
                                    }}
                                    autoFocus
                                    size="small"
                                    label="Sales Order"
                                        onChange={(e) => {
                                        const value = e.target.value;
                                        setFilter((prev) => ({ ...prev, ["SO"]: value }));
                                    }}
                                >
                                    </TextField> 
                            </StyledTableCell>
                            <StyledTableCell align="center">Original Quantity</StyledTableCell>
                            <StyledTableCell align="center">Rejected</StyledTableCell>
                            <StyledTableCell align="center">Rewash</StyledTableCell>
                            <StyledTableCell align="center">Add Rewash</StyledTableCell>
                            <StyledTableCell align="center">Select</StyledTableCell>
                        
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {fetchedBatchDetails
                            // filter(batch => batch.quantity-(batch.rewash_quantity +batch.rejection_quantity) > 0)
                            .map((batch)=>
                            {
                                const isDisabled =!(batch.quantity-(batch.rewash_quantity +batch.rejection_quantity) > 0);
                                const key =batch.id;

                                const actualValue =chosenQty[key] ??null; 
                                const displayValue = isDisabled ? null : actualValue;
                            return(
                            <StyledTableRow key={batch.id}>
                                <StyledTableCell align="center">{batch?.mpo}</StyledTableCell>
                                <StyledTableCell align="center">{batch?.style}</StyledTableCell>
                                <StyledTableCell align="center">{batch?.so}</StyledTableCell>
                                <StyledTableCell align="center"> {batch?.quantity}</StyledTableCell>
                                
                               
                                {/* <StyledTableCell align="center">{fetchedBatchDetails?.rejected_quantity}</StyledTableCell>/ */}
                                <StyledTableCell align="center">{batch?.rejection_quantity }</StyledTableCell>
                                <StyledTableCell align="center">{batch?.rewash_quantity}</StyledTableCell>
                                 <StyledTableCell align="center">
                                    <NumberSpinner
                                    size="small"
                                    min={1}
                                    max={batch?.quantity-(batch?.rewash_quantity+batch?.rejection_quantity)}
                                    customSize={15} // new prop
                                    disabled={isDisabled}
                                    value={displayValue}
                                    onValueChange={(value) =>{console.log(batch?.quantity); handleQuantityChange(batch, value ?? 0)}}
                                    />
                                </StyledTableCell>  
                                <StyledTableCell align="center">
                                            <Checkbox 
                                            checked={selectedSources.some(item => item.batch_source === batch.id)}
                                            disabled={isDisabled}
                                            onChange={(_, checked) => handleRowSelect(batch, checked)}
                                            slotProps={{ input: { 'aria-label': 'select-row' } }}
                                            sx={{
                                                height:10
                                            }}
                                            />
                                </StyledTableCell>
                                {/* <StyledTableCell align="center">
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
                                                        // patchData<WetProcessBatchMeta>(
                                                        //     `wet-process/batch-sources/${batch?.id}/`,
                                                        //     ip,
                                                        //     {
                                                        //         rewash_quantity: (batch?.rewash_quantity ?? 0) + rewashQty
                                                        //     },
                                                        //     (update:WetProcessBatchMeta)=>{
                                                        //         // console.log(update.id)
                                                        //         // console.log(batch?.rewash_quantity?? 0 + rewashQty)
                                                        //         // console.log(rewashQty)
                                                        //         console.log(update)
                                                        //         // setAddOn(false)
                                                        //         batch.add=false
                                                        //         setActiveId(null);
                                                        //         // for(const obg
                                                        //         // setRewashQty()
                                                        //         setUpdateDone(prev => !prev)
                                                        //     }
                                                        // )
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
                                
                                
                                </StyledTableCell> */}
                            </StyledTableRow>)
                            })}
 
                        </TableBody>
                        </Table>
                    </TableContainer>
                    <Button variant="contained" sx={{ 
                        
                        color:'white',
                        position:'fixed',
                        left:250,
                        top:350   
                    }} 
                    onClick={()=>{
                        patchData<WetProcessBatch>(
                            `wet-process/batches/${batchId}/rewash/`,
                            ip,
                            {
                                sources: selectedSources
                            },
                            (updatedBatch:WetProcessBatch)=>{
                                console.log(updatedBatch)
                                setSelectedSources([]);
                                setChosenQty({})
                                setfetchedBatch((prev)=>prev ? {...prev, ok_qty: updatedBatch.total_quantity-(updatedBatch.total_rewash_quantity+updatedBatch.total_rejection_quantity),rej_qty: updatedBatch.total_rejection_quantity,total_rewash: updatedBatch.total_rewash_quantity} : null)
                                const details=[]
                                for(const obj of updatedBatch.sources){ 
                    
                                    details.push({
                                            'id':obj.id,
                                            'mpo':obj.mpo,
                                            'style':obj.style,
                                            'so':obj.so,
                                            'quantity':obj.quantity,
                                            'rewash_quantity':obj.rewash_quantity,  
                                            'rejection_quantity':obj.rejection_quantity,
                                            // 'add':false
                                    })
                                }
                                setFetchedBatchDetails(details)

                                // setFetchedBatch(prev => prev ? {...prev, ok_qty: 
                            },
                            (error:any)=>{
                                 let msg=""
                                if (error instanceof Error && error.message === "Network Error") {
                                    console.log("Network Error");
                                    msg="Network Error"
                                            
                                }
                                
                                else if(error.response.data){
                                    Object.entries(error.response.data).forEach(([_, value]) => {
                                        if (Array.isArray(value)) {
                                            msg += value[0];
                                        } else {
                                            msg += value;
                                        }
                                    });
                                    
                                }

                                // if

                                setAddRewashError(msg)   
                            }


                        )
                        // for(const [key,value] of Object.entries(chosenQty)){
                        //     console.log(key,' ',value)
                        // }
                        // console.log(Object.values(chosenQty).some(val => val === null|| val === undefined))
                    }}
                    disabled={selectedSources.length===0 || selectedSources[0].rewash_quantity === 0 || Object.values(chosenQty).some(val => val === null)}>
                        +Add Rewash
                    </Button>
                </div>
                )}


            {fetchedBatch && (
                <>
                    <Box
                    sx={{
                        display: "flex",
                        position:'fixed',
                        // top:'60px',
                        marginLeft:'-5px',
                        flexDirection: "row",
                        alignItems: "center", // vertically center all items
                        gap: 2, // space between items
                        // mt: 30,
                        top: 400,
                        left:250

                        // ml: "150px", // adjust margin as needed
                        // height:'20px'
                    }}
                    // style={{
                    //     position:'fixed'
                    // }}
                    >
                    <FormControl sx={{ width: 150 ,"& .MuiInputBase-root": {
                                    height: 40, // total height
                                    },}}>
                        <InputLabel id="reject-reason-label">Rejection Reason</InputLabel>
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
                            // setinvbarcode(inv);
                            fetchPieceDetails(inv);
                            setRejectField(true);
                            // setIndivScanned(true)
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
                    <Box sx={{
                        // position:'relative',
                        marginLeft:'-5px',
                    }}>
                    <TableContainer component={Paper} sx={{ maxHeight: 150, overflow: "auto",position:'fixed',top:450,left:245,width:1000 }}>
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
                            <StyledTableRow key={row.individual_barcode}>
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
                                     <FormControl sx={{ width: 150 ,height:'15px',marginTop:0.9}} size="small">
    
                                            <Select
                                                labelId="reject-reason-label"
                                                id={`reject-reason-${row.individual_barcode}`}
                                                value={row.reason}
                                                onChange={(e) => handleRowReasonChange(row.individual_barcode, e.target.value as string)}
                                                style={{height:'10px'}}
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
                            position:'fixed',
                            top:600
                        }}
                        >
                        Save
                        </Button>
                    )}
                    </Box>
                </>
                )}

                    <Modal open={qcCompletePop} onClose={() => setQcCompletePop(false)}>
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
                            You want to complete QC for {fetchedBatch?.ok_qty} OK pieces, {fetchedBatch?.rej_qty} Rejected pieces and {fetchedBatch?.total_rewash} Rewash pieces.
                            {/* <b>{reasonDisplay?.toUpperCase() || ""}</b>  */}
                            <br></br>in This Stage
                            </Typography>

                            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                                 <Button sx={{ background: "blue", color: "white" }} onClick={() => {
                                    patchData<CompletedQc>(
                                        `wet-process/batches/${batchqr}/`,
                                        ip,
                                        {
                                             status: "completed"
                                        },
                                        (qcRes:CompletedQc)=>{
                                            console.log("QC Completed:", qcRes);
                                            setQcCompletePop(false);
                                            setBatchComplete(true);
                                            setfetchedBatch(null);
                                            setBatchId("");
                                            setBatchQR("");
                                            setFetchedBatchDetails([]);
                                            setRows([]);
                                            
                                        },
                                        (error: any) => {
                                            console.error("Error completing QC:", error.response.data);
                                            setQcCompletePop(false);
                                             let msg=""
                                            if (error instanceof Error && error.message === "Network Error") {
                                                console.log("Network Error");
                                                msg="Network Error"
                                                        
                                            }
                                            
                                            else if(error.response.data){
                                                Object.entries(error.response.data).forEach(([_, value]) => {
                                                    if (Array.isArray(value)) {
                                                        msg += value[0];
                                                    } else {
                                                        msg += value;
                                                    }
                                                });
                                            }   
                                            setRejectError(msg);
                                        }
                                            // setBatchId("");
                                            // setBatchQR("");
                                            // setfetchedBatch(null)
                                        
                                    )
                                // console.log(rows)
                                 }}>
                                    Yes
                                 </Button>
                                <Button sx={{ background: "red", color: "white" }} onClick={() => {setQcCompletePop(false)}}>
                                    Exit
                                </Button>
                            </Box>
                           </Box> 
                             
                        </Box>
                    </Modal>
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
                            <br></br>in This Stage
                            </Typography>

                            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                            <Button sx={{ background: "blue", color: "white" }} onClick={() => {
                                // console.log(rows)
                                let payload_rejs:RejPayload[]=[]
                                for(const row of rows){

                                    // if(!row.saved){
                                        payload_rejs.push({
                                             garment_unit:row.individual_barcode,
                                             rejection_reason:row.reason
                                        })
                                    // }
                                }
                                if(payload_rejs.length>0){
                                        console.log(payload_rejs)
                                        postData<WetProcessBatch>(
                                            `wet-process/batches/${batchqr}/rejections/`,
                                            ip,
                                            {
                                                sources:payload_rejs
                                            },
                                            (rejRes:WetProcessBatch)=>{
                                                console.log("Rejection recorded:", rejRes);
                                                setRejectPop(false);
                                                setReason("");
                                                setReasonDisplay("");
                                                setRejectDone(prev => !prev);
                                                setfetchedBatch((prev)=>prev ? {...prev, ok_qty: rejRes.total_quantity-(rejRes.total_rewash_quantity+rejRes.total_rejection_quantity),rej_qty: rejRes.total_rejection_quantity,total_rewash: rejRes.total_rewash_quantity} : null)
                                                const details=[]
                                                for(const obj of rejRes.sources){ 
                                    
                                                    details.push({
                                                            'id':obj.id,
                                                            'mpo':obj.mpo,
                                                            'style':obj.style,
                                                            'so':obj.so,
                                                            'quantity':obj.quantity,
                                                            'rewash_quantity':obj.rewash_quantity,  
                                                            'rejection_quantity':obj.rejection_quantity,
                                                            // 'add':false
                                                    })
                                                }
                                                setFetchedBatchDetails(details)
                                                setRows([])
                                                // setBatchId("");
                                                // setBatchQR("");
                                                // setfetchedBatch(null)
                                        },
                                        (error: any) => {
                                            // setRejectDone(false)
                                            setRejectDone(false)
                                            console.error("Error recording rejection:", error.response.data);
                                             setRejectPop(false);
                                            setReason("");
                                            setReasonDisplay("");
                                            // setRejectDone(prev => !prev);
                                            setRows([])
                                            // const errorMsg =
                                            // error?.response?.data?.individual_barcode?.[0] ||
                                            // error?.response?.data?.[0] ||
                                            // "Wrong Piece Scanned. Please check the barcode and try again.";
                                             let msg=""
                                            if (error instanceof Error && error.message === "Network Error") {
                                                console.log("Network Error");
                                                msg="Network Error"
                                                        
                                            }
                                            
                                            else if(error.response.data){
                                                Object.entries(error.response.data).forEach(([_, value]) => {
                                                    if (Array.isArray(value)) {
                                                        msg += value[0];
                                                    } else {
                                                        msg += value;
                                                    }
                                                });
                                                
                                            }

                                            
                                            setRejectError(msg);
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
                            <Modal open={batchComplete} onClose={() => setBatchComplete(false)}>
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
                                          <Typography variant="h6">Batch QC Completed</Typography>
                                          {/* <Typography>Already batches are allocated according to this plan */}
                                          {/* </Typography> */}
                                          <Button sx={{ mt: 2 }} onClick={() => setBatchComplete(false)}>Close</Button>
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
                      <Modal open={addRewashError!=""} onClose={() => setAddRewashError("")}>
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
                                <Typography variant="h6">{addRewashError}</Typography>
                                {/* <Typography>Already batches are allocated according to this plan */}
                                {/* </Typography> */}
                                <Button sx={{ mt: 2 }} onClick={() => setAddRewashError("")}>Close</Button>
                                </Box>
                            </Box>
                        </Modal>
            </>
}