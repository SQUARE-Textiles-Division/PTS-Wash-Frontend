import { useEffect, useState } from "react"
import type BatchInstance from "../../TypeAnnotations/BatchInstance"
import { QRCodeCanvas } from "qrcode.react";
// import { Typography ,Paper,Box,Button} from "@mui/material";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import type BatchStage from "../../TypeAnnotations/BatchStage"
import { getData, getDataAsync, postData } from "../genericApiService"
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { tbCellColor,tbRowColor } from '../Colors/Colors'
import NumberSpinner from "../NumberSpinner";
import Checkbox from '@mui/material/Checkbox';
import { ip } from "../../ip";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import type RejectionReason from "../../TypeAnnotations/RejectionReason";
import type FirstWashBatch from "../../TypeAnnotations/FirstWashBatch";
// import type FirstWashBatchCreate from "../../TypeAnnotations/FirstWashBatchCreate";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import type FetchFirstWash from "../../TypeAnnotations/FetchFirstWash";
import type RewashBatchCreate from "../../TypeAnnotations/RewashBatchCreate";
import type RewashBatchCreateResult from "../../TypeAnnotations/RewashBatchCreateResult";


    // interface StoreMeta {
    //   mpo: string[];
    //   buyer: string[];
    //   style: string[];
    //   so: string[];
    //   color: string[];
    //   size: string[];
    //   shade: string;
    //   quantity: number;
    // }


    interface RewashBatch{
        content_type:string,
        object_id:number,
        buyer:string,
        color:string,
        shade:string,
        quantity:number
    }
    const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        // backgroundColor: theme.palette.common.black,
        // backgroundColor: '#485e68',
        backgroundColor: tbCellColor,
        color: "white",
        lineHeight: 1.2,             // reduce text height
        fontSize: 15,
         
    },
    [`&.${tableCellClasses.body}`]: {
         lineHeight: 1.0,   
        fontSize: 13,
        padding: "1px 2px", 
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
    
    export default function Rewash(){
        const [batchCard,setBatchCard]=useState(false)
        const [rewashBatchList,setRewashBatchList]=useState<RewashBatch[]>([])
        const [qrData, setQrData] = useState<any | null>(null);
        const printRef = useRef<HTMLDivElement>(null);
        const [errorLog,setErrorLog]=useState<string>('')
        const [shadeList,setShadeList]=useState<string[]>([])
        const [shade,setShade]=useState<string>("")
        const [filter, setFilter] = useState({
            buyer: "",
            color: "",
            shade: "",
        });



        const handlePrint = useReactToPrint({
            contentRef: printRef,
        });
        const [selectedRows, setSelectedRows] = useState<
            {   content_type:string,
                object_id:number,
                buyer:string,
                color:string,
                shade:string,
                quantity:number }[]
            >([]);
        
        const [shadeWarn,setShadeWarn]=useState(false)
        
        const fetchPrimary=()=>{

                getData<FetchFirstWash[]>(
                    `wet-process/wash-logs/rewashing/`,
                    ip,
                    {},
                    {},
                    (result2:FetchFirstWash[])=>{
                        let tempBatch:RewashBatch[]=[]
                        // let batchDryFinal:BatchDryItem[]=[]
                        for(let i=0;i<result2.length;i++){
                            tempBatch.push(
                                {
                                    content_type:result2[i].content_type,
                                    object_id:result2[i].object_id,
                                    buyer:result2[i].batch_details.buyer,
                                    color:result2[i].batch_details.color,
                                    shade:result2[i].batch_details.shade,
                                    quantity:result2[i].remaining_rewash_quantity

                                }
                            )
                        }
                        // let shadeSet = new Set();

                        tempBatch.sort((a, b) => {
                            // Compare Shade first
                                if (a.shade < b.shade) return -1;
                                if (a.shade > b.shade) return 1;

                                return 0; // Shade and Size are equal
                        })

                        setRewashBatchList(tempBatch)

                    }
                )
        }
        useEffect(() => {
            fetchPrimary();
        }, [batchCard]);



        const handleRowSelect = (row: any, checked: boolean) => {
            if (checked) {
                // Add row to state with initial Quantity = 0
                setSelectedRows(prev => [
                ...prev,
                { content_type:row.content_type,object_id:row.object_id, shade: row.shade,  buyer:row.buyer,  color:row.color, quantity: 0 },
                ]);
            }
            else {
                // Remove row from state
                setSelectedRows(prev =>
                prev.filter(item => item.object_id!=row.object_id && item.buyer!=row.buyer && item.color!=row.color && item.shade!=row.shade)
                );
            }
        };
        const handleQuantityChange = (row: any, value: number) => {
            console.log(value)
            // console.log('Quantity changed for BatchNumber:', row.BatchNumber, 'New Quantity:', value);
            setSelectedRows(prev => {
                const exists = prev.find(item => item.buyer==row.buyer  && item.color==row.color && item.shade==row.shade);
                if (exists) {
                    console.log(exists)
                    return prev.map(item =>
                        item.object_id==row.object_id && item.buyer==row.buyer &&  item.color==row.color &&  item.shade==row.shade
                        ? { ...item, quantity: value }
                        : item
                    )
                } 
                else {
                // Automatically add row if it doesn’t exist
                    return [...prev, {  content_type:row.content_type,object_id:row.object_id, shade: row.shade,  buyer:row.buyer,  color:row.color, quantity: value  }];
                }
            });
        };
        // console.log('Selected Rows:', selectedRows);
        const handleCreateBatch=()=>{
            console.log(selectedRows)
            // Logic to create batch with selectedRows data
        selectedRows.sort((a,b)=>{
                if(a.shade<b.shade)
                    return -1
                if(a.shade>b.shade)
                    return 1
                return 0
        })
        const prevShade=selectedRows[0].shade
        const prevBuyer=selectedRows[0].buyer
        const prevColor=selectedRows[0].color
        // console.log(prevShade,' ',prevBuyer,' ',prevColor)
        for(let i=1;i<selectedRows.length;i++){
                // console.log(selectedRows[i].Buyer,' ',selectedRows[i].Shade,' ',selectedRows[i].Color,' ',selectedRows[i].Quantity)
                if(selectedRows[i].shade!=prevShade || selectedRows[i].buyer!=prevBuyer || selectedRows[i].color!=prevColor){
                    setShadeWarn(true)
                    setSelectedRows([])
                    
                    return;
                }
                
        }
        let  payload:RewashBatchCreate={
            buyer:"",
            color: "",
            shade:"",
            source_batches:[]
        }
        //    const batchQtyList=[]
        payload.shade=selectedRows[0].shade
        payload.buyer=selectedRows[0].buyer
        payload.color=selectedRows[0].color
        
        //    const preShade=payload.shade
        //    const prevBatch={batch:selectedRows[0].BatchNumber,quantity:selectedRows[0].Quantity}
        for(let i=0;i<selectedRows.length;i++){
                payload.source_batches.push({content_type: selectedRows[i].content_type,object_id: selectedRows[i].object_id,quantity: selectedRows[i].quantity})
        }

        console.log('Payload for First Wash Batch Creation:', payload)
        let storeMeta:any={ mpo: [] as string[],
                buyer: [] as string[],
                color: [] as string[],
                // size: [] as string[],
                shade: '',
                quantity: 0}
        let buyerSet=new Set() as Set<string>
        let colorSet=new Set() as Set<string>
        // let sizeSet=new Set()  as Set<string>
        for(let i=0;i<selectedRows.length;i++){
                const row=selectedRows[i]
                if(row){
                    // mpoSet.add(row.MPO)
                    buyerSet.add(row.buyer)
                    // styleSet.add(row.Style)
                    // soSet.add(row.SO)
                    colorSet.add(row.color)
                    // sizeSet.add(row.Size)
                }
            }
            
            storeMeta.buyer=Array.from(buyerSet)
       
            storeMeta.color=Array.from(colorSet)
            // storeMeta.size=Array.from(sizeSet)
            storeMeta.shade=payload.shade
        
        postData<RewashBatchCreateResult>(
            `wet-process/rewash-batches/`,
            ip,
            payload,
            (result:RewashBatchCreateResult)=>{
                setBatchCard(prev => !prev)
                const qrInfo={
                    id:result.id,
                    buyer:"",
                    style:"",
                    so:"",
                    shade:"",
                    quantity:0,
                    date:"",
                    // size:"",
                    color:""
                }
                let date=result.created_at.slice(0, 10).replace(/-/g, "");
                qrInfo.date=date
                qrInfo.buyer=storeMeta.buyer.join(", ")
                qrInfo.color=storeMeta.color.join(", ")
                // qrInfo.size=storeMeta.size.join(", ")
                qrInfo.shade=storeMeta.shade
                qrInfo.quantity=0
                for(const obj of result.source_batches){
                    qrInfo.quantity+=obj.quantity
                }

                // qrInfo.quantity=result.total_quantity
                
                setQrData(qrInfo)

                setSelectedRows([]) 
                // console.log(payload.batch_source)
                console.log('Batch created successfully:', result) 

            },
            (error: any)=>{
                console.log('Error creating batch:', error.response.data)
            }
            )
        }






        


        return <>
            {/* <Box sx={{ width: 150,margin: '2px auto',position:'static' }}>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Shade</InputLabel>
                    <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    // value={age}
                    label="Shade"
                    onChange={(e) => setShade(e.target.value as string)}
                    >
                    <MenuItem key="" value=""><b>Select All</b></MenuItem>
                    {shadeList.map((shade) => (
                        <MenuItem key={shade} value={shade}>{shade}</MenuItem>
                    ))}
                    </Select>
                </FormControl>
            </Box> */}
        <TableContainer
            component={Paper}
            elevation={0}
            sx={{
            maxHeight: 300,          // vertical scrollbar
            overflowX: "auto",       // horizontal scrollbar
            overflowY: "auto",
            marginLeft:'220px',
            // marginRight:'100px',
            maxWidth: 1000,
            border:"none",
            // mt:2,
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
            
                // my: 1,
            }}
            >
                
            <TableHead>
            <TableRow >

               <StyledTableCell align="center">Batch Number </StyledTableCell>
               <StyledTableCell align="center">Batch Type</StyledTableCell>
                
               <StyledTableCell align="center"
                >
                    <TextField
                        
                        sx={{
                            background:'white',
                            "& .MuiOutlinedInput-root": {
                            "&.Mui-focused fieldset": {
                                // borderColor: "#485e68",  
                                //       // Outline color on focus
                                borderColor:'white'
                            },
                            },
                            "& .MuiInputLabel-root": {
                            "&.Mui-focused": {
                                color: "black",
                                fontWeight:'bold'               // Label/text color on focus
                            },
                            },
                            // width: 100,
                            fontWeight:'bold',
                            // height:'30px',
                            // textEmphasisColor:'white'
                        }}
                        autoFocus
                        size="small"
                        label="Buyer"
                         onChange={(e) => {
                            const value = e.target.value;
                            setFilter((prev) => ({ ...prev, ["buyer"]: value }));
                        }}
                    ></TextField> 
                </StyledTableCell>
  

                <StyledTableCell align="center"
                >
                    <TextField
                        
                        sx={{
                            background:'white',
                            "& .MuiOutlinedInput-root": {
                            "&.Mui-focused fieldset": {
                                // borderColor: "#485e68",  
                                //       // Outline color on focus
                                borderColor:'white'
                            },
                            },
                            "& .MuiInputLabel-root": {
                            "&.Mui-focused": {
                                color: "black",
                                fontWeight:'bold'               // Label/text color on focus
                            },
                            },
                            // width: 100,
                            fontWeight:'bold',
                            // height:'30px',
                            // textEmphasisColor:'white'
                        }}
                        autoFocus
                        size="small"
                        label="Color"
                        onChange={(e) => {
                            const value = e.target.value;
                            setFilter((prev) => ({ ...prev, ["color"]: value }));
                        }}
                    ></TextField> 
                </StyledTableCell>
                
                {/* <StyledTableCell align="center">Size</StyledTableCell> */}
                {/* <StyledTableCell>BundleBarcode</StyledTableCell> */}
                {/* <StyledTableCell>BatchQRCode</StyledTableCell>
                <StyledTableCell align="center">BatchNumber</StyledTableCell> */}
                <StyledTableCell align="center"
                >
                    <TextField
                        
                        sx={{
                            background:'white',
                            "& .MuiOutlinedInput-root": {
                            "&.Mui-focused fieldset": {
                                // borderColor: "#485e68",  
                                //       // Outline color on focus
                                borderColor:'white'
                            },
                            },
                            "& .MuiInputLabel-root": {
                            "&.Mui-focused": {
                                color: "black",
                                fontWeight:'bold'               // Label/text color on focus
                            },
                            },
                            // width: 100,
                            fontWeight:'bold',
                            // height:'30px',
                            // textEmphasisColor:'white'
                        }}
                        autoFocus
                        size="small"
                        label="Shade"
                        onChange={(e) => {
                            const value = e.target.value;
                            setFilter((prev) => ({ ...prev, ["shade"]: value }));
                        }}
                    ></TextField> 
                </StyledTableCell>
                <StyledTableCell align="center">Total Quantity</StyledTableCell>
                <StyledTableCell align="center">Choose Quantity</StyledTableCell>
                <StyledTableCell align="center">Select </StyledTableCell>
        
            </TableRow>
            </TableHead>
            <TableBody sx={{
                // lineHeight:2
                // height:'20px'
            }}>
            {rewashBatchList
                    .filter(row => row.quantity > 0).filter(row =>
                            Object.entries(filter).every(([key, value]) =>
                                value === "" || row[key as keyof typeof row]
                                ?.toString()
                                .toLowerCase()
                                .includes(value.toLowerCase())
                            )
                        )
                    .map((row) => (
                        <StyledTableRow  sx={{
                            //  height:'2px'
                        }}
                        key={`${row.content_type}-${row.object_id}-${row.buyer}-${row.color}-${row.shade}`}
                        >
                        <StyledTableCell align="center">{row.object_id}</StyledTableCell>
                        <StyledTableCell align="center">{row.content_type=='batchforfirstwash'?'FIRST WASH':'REWASH'}</StyledTableCell>
                        <StyledTableCell align="center">{row.buyer}</StyledTableCell>
                        <StyledTableCell align="center">{row.color}</StyledTableCell>
                        <StyledTableCell align="center">{row.shade}</StyledTableCell>   
                        <StyledTableCell align="center">{row.quantity}</StyledTableCell>
                        <StyledTableCell align="center">
                            <NumberSpinner
                            size="small"
                            min={0}
                            max={row?.quantity ?? 0}
                            disabled={!selectedRows.some(item => item.content_type==row.content_type && item.object_id==row.object_id && item.buyer==row.buyer && item.color==row.color && item.shade==row.shade)}
                            // value={selectedRows.quantity ?? 0} 
                            onValueChange={(value) => handleQuantityChange(row, value ?? 0)}
                            />
                        </StyledTableCell>  
                        <StyledTableCell>
                            <Checkbox 
                            checked={selectedRows.some(item => item.content_type==row.content_type && item.object_id==row.object_id && item.buyer==row.buyer && item.color==row.color && item.shade==row.shade)}
                            onChange={(e, checked) => handleRowSelect(row, checked)}
                            slotProps={{ input: { 'aria-label': 'select-row' } }}
                            />
                        </StyledTableCell>
                        </StyledTableRow>
                    ))}
            </TableBody>
        </Table>
        </TableContainer>
        <Button variant="contained"  onClick={handleCreateBatch} sx={{mt:2,position:'relative', background:tbCellColor}}>Create Batch</Button>

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
                                {`RW8220${qrData.date}W1${String(qrData.id).padStart(10, '0')}`}
                            </Typography>
                            <Typography variant="body2">
                                <b>Total Quantity:</b> {qrData.quantity}
                            </Typography>
                                
                            <Typography variant="body2">
                                <b>Buyer</b> {qrData.buyer}
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
        
        <Modal open={shadeWarn} onClose={() => setShadeWarn(false)}>
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
                <Typography variant="h6">Selected rows must have the same Shade, Buyer & Color</Typography>
                {/* <Typography>Already batches are allocated according to this plan */}
                {/* </Typography> */}
                <Button sx={{ mt: 2 }} onClick={() => setShadeWarn(false)}>Close</Button>
                </Box>
            </Box>
        </Modal>
        <Modal open={errorLog!=''} onClose={() => setErrorLog('')}>
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
                <Typography variant="h6">{errorLog}</Typography>
                {/* <Typography>Already batches are allocated according to this plan */}
                {/* </Typography> */}
                <Button sx={{ mt: 2 }} onClick={() => setErrorLog('')}>Close</Button>
                </Box>
            </Box>
        </Modal>
        </>
    }