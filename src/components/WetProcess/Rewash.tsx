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
import type FirstWashBatch from "../../TypeAnnotations/WetProcessBatch";
// import type FirstWashBatchCreate from "../../TypeAnnotations/FirstWashBatchCreate";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import type FetchFirstWash from "../../TypeAnnotations/WetProcessBatchMeta";
import type RewashBatchCreate from "../../TypeAnnotations/RewashBatchCreate";
import type RewashBatchCreateResult from "../../TypeAnnotations/RewashBatchCreateResult";
import type BatchSourceEntry from "../../TypeAnnotations/SourceBatch";
import type WetProcessBatchMeta from "../../TypeAnnotations/WetProcessBatchMeta";
import type WetProcessBatch from "../../TypeAnnotations/WetProcessBatch";


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
        mpo:string,
        style:string,
        so:string,
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
        lineHeight: 0.2 ,             // reduce text height
        // fontSize: 14,
         
    },
    [`&.${tableCellClasses.body}`]: {
         lineHeight: 0.1,   
        fontSize: 14,
        padding: "0px", 
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
            mpo:"",
            style:"",
            so:""
        });
        const [chosenQty, setChosenQty] = useState<Record<string, number|null>>({});


        const handlePrint = useReactToPrint({
            contentRef: printRef,
        });
        const [selectedRows, setSelectedRows] = useState<
        {       mpo: string,
                style: string,
                so: string,
                buyer: string,
                color: string,
                shade: string,
                quantity: any }[]
            >([]);
        
        const [shadeWarn,setShadeWarn]=useState(false)
        
        const fetchAggregateData=()=>{
                getData<WetProcessBatch[]>(
                    `wet-process/batches`,
                    ip,
                    {},
                    {stage:'first_wash'},
                    (result:WetProcessBatch[])=>{
                        let shadeSet = new Set<string>();
                        // let rewashList=[]
                        const mpoMetaMap = new Map();
                        const mpoQtyMap= new Map();
                        const rewashmpoQtyMap=new Map();
                        for(let i=0;i<result.length;i++){
                                for (const source of result[i].sources) {
                                const mapKey = `${source.mpo}-${result[i].color}-${result[i].shade}`;
                                const value = `${source.mpo}-${source.style}-${source.so}-${result[i].buyer}-${result[i].color}-${result[i].shade}`;

                                mpoMetaMap.set(mapKey, mpoMetaMap.get(mapKey) || value);

                                mpoQtyMap.set(
                                    mapKey,
                                    (mpoQtyMap.get(mapKey) || 0) + source.rewash_quantity
                                );

                                if (result[i].type === "rewash") {
                                    rewashmpoQtyMap.set(
                                        mapKey,
                                        (rewashmpoQtyMap.get(mapKey) || 0) + source.quantity
                                    );
                                }
                            }
                        }
                        
                        let newRewashList=[]
                        for(const [key,val] of mpoMetaMap){
                           const quantity =
                            (mpoQtyMap.get(key) || 0) -
                            (rewashmpoQtyMap.get(key) || 0);
                            const [mpo, style, so, buyer, color, shade] = val.split("-");
                            newRewashList.push({
                                mpo,
                                style,
                                so,
                                buyer,
                                color,
                                shade,
                                quantity
                            })
                        }
                        setRewashBatchList(newRewashList)
                    },
                    (error:any)=>{
                        console.log('Error fetching batches:', error.response.data)
                        console.log(error.response.data)
                        let msg=""
                        Object.entries(error.response.data).forEach(([key, value]:any) => {
                            msg+=value[0]
                        });
                        setErrorLog(msg)
                    }
                )
        }



        const fetchPrimary=()=>{

                getData<WetProcessBatchMeta[]>(
                    `wet-process/batch-sources/`,
                    ip,
                    {},
                    {stage:'first_wash'},
                    (result2:WetProcessBatchMeta[])=>{
                        let tempBatch:RewashBatch[]=[]
                        const BatchMetaMap = new Map();
                        const RewashtMap = new Map();
                        for(let i=0;i<result2.length;i++){
                            const key=`${result2[i].source.mpo}-${result2[i].source.style}-${result2[i].source.so}-${result2[i].batch.buyer}-${result2[i].batch.color}-${result2[i].batch.shade}`
                            BatchMetaMap.set(key,(BatchMetaMap.get(key)||0)+result2[i].rewash_quantity)
                            if(result2[i].batch.type=='rewash'){
                                RewashtMap.set(key,(RewashtMap.get(key)||0)+result2[i].quantity)
                            }
                           
                        }
                        for (const [key] of BatchMetaMap) {
                            BatchMetaMap.set(
                                key,
                                (BatchMetaMap.get(key) || 0) - (RewashtMap.get(key) || 0)
                            );
                        }
                        for(const[key,val] of BatchMetaMap){
                            const [mpo, style, so, buyer, color, shade] = key.split("-");
                            tempBatch.push(
                                {
                                    mpo:mpo,
                                    style:style,
                                    so:so,
                                    buyer:buyer,
                                    color:color,
                                    shade:shade,
                                    quantity:val
                                }
                            )
                            // tempBatch.p
                        }
                        const mpocolorshade = new Map<string, number>();

                        for (const obj of tempBatch) {
                            const key = `${obj.mpo}|${obj.color}|${obj.shade}`;
                            mpocolorshade.set(key, (mpocolorshade.get(key) || 0) + obj.quantity);
                        }

                        const tempModifyBatchMap = new Map();
                        for (const obj of tempBatch) {
                                const key = `${obj.mpo}|${obj.color}|${obj.shade}`;
                                const qty = mpocolorshade.get(key);
                                if (qty !== undefined) {
                                tempModifyBatchMap.set(key, {
                                    mpo: obj.mpo,
                                    buyer: obj.buyer,
                                    style: obj.style,
                                    so: obj.so,
                                    color: obj.color,
                                    shade: obj.shade,
                                    quantity: qty,
                                });
                                }
                        }
                        let tempModifyBatchList = [...tempModifyBatchMap.values()];
                        // let batchDryFinal:BatchDryItem[]=[]
                        // for(let i=0;i<result2.length;i++){
                        //     tempBatch.push(
                        //         {
                        //             content_type:result2[i].content_type,
                        //             object_id:result2[i].object_id,
                        //             buyer:result2[i].batch_details.buyer,
                        //             color:result2[i].batch_details.color,
                        //             shade:result2[i].batch_details.shade,
                        //             quantity:result2[i].remaining_rewash_quantity

                        //         }
                        //     )
                        // }
                        // let shadeSet = new Set();

                        tempModifyBatchList.sort((a, b) => {
                            // Compare Shade first
                                if (a.shade < b.shade) return -1;
                                if (a.shade > b.shade) return 1;

                                return 0; // Shade and Size are equal
                        })

                        setRewashBatchList(tempModifyBatchList)

                    }
                )
        }
        useEffect(() => {
            // fetchPrimary();
            fetchAggregateData();
        }, [batchCard]);



        const handleRowSelect = (row: any, checked: boolean) => {
            if (checked) {
                // Add row to state with initial Quantity = 0
                setSelectedRows(prev => [
                ...prev,
                { mpo:row.mpo,style:row.style,so:row.so, shade: row.shade,  buyer:row.buyer,  color:row.color, quantity: null },
                ]);
            }
            else {

                const key=`${row.mpo}-${row.color}-${row.shade}`
                setChosenQty(prev => ({
                    ...prev,
                    [key]: null
                }));
                // Remove row from state
                setSelectedRows(prev =>
                prev.filter(item => item.mpo!=row.mpo || item.style!=row.style || item.so!=row.so || item.buyer!=row.buyer ||item.color!=row.color || item.shade!=row.shade)
                );
            }
        };
        const handleQuantityChange = (row: any, value: number) => {
            console.log(value)
            const key=`${row.mpo}-${row.color}-${row.shade}`
                setChosenQty(prev => ({
                    ...prev,
                    [key]: value
                }));
            // console.log('Quantity changed for BatchNumber:', row.BatchNumber, 'New Quantity:', value);
            setSelectedRows(prev => {
                const exists = prev.find(item => item.mpo==row.mpo   && item.color==row.color && item.shade==row.shade);
                if (exists) {
                    console.log(exists)
                    return prev.map(item =>
                        item.mpo==row.mpo && item.color==row.color && item.shade==row.shade 
                        ? { ...item, quantity: value }
                        : item
                    )
                } 
                else {
                // Automatically add row if it doesn’t exist
                    return [...prev, {  mpo:row.mpo,style:row.style,so:row.so, shade: row.shade,  buyer:row.buyer,  color:row.color, quantity: value  }];
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
        let  payload:BatchSourceEntry={
            shade:"",
            buyer:"",
            color: "",
            stage:"",
            type:"",
            input_type:"aggregate",
            input_sources:[]
        }
        //    const batchQtyList=[]
        payload.shade=selectedRows[0].shade
        payload.buyer=selectedRows[0].buyer
        payload.color=selectedRows[0].color
        payload.stage="first_wash"
        payload.type="rewash"
        //    const preShade=payload.shade
        //    const prevBatch={batch:selectedRows[0].BatchNumber,quantity:selectedRows[0].Quantity}
        for(let i=0;i<selectedRows.length;i++){
                payload.input_sources.push({mpo:selectedRows[i].mpo,style:selectedRows[i].style,so:selectedRows[i].so,quantity:selectedRows[i].quantity})
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
        
        postData<WetProcessBatch>(
            `wet-process/batches/`,
            ip,
            payload,
            (result:WetProcessBatch)=>{
                setBatchCard(prev => !prev)
                console.log(batchCard)
                const qrInfo={
                    id:result.id,
                    buyer:"",
                    style:"",
                    so:"",
                    shade:"",
                    quantity:0,
                    // date:"",
                    // size:"",
                    color:""
                }
                // let date=result.created_at.slice(0, 10).replace(/-/g, "");
                // qrInfo.date=date.substring(2,4)
                qrInfo.buyer=storeMeta.buyer.join(", ")
                qrInfo.color=storeMeta.color.join(", ")
                // qrInfo.size=storeMeta.size.join(", ")
                qrInfo.shade=storeMeta.shade
                qrInfo.quantity=result.total_quantity
                // for(const obj of result.sources){
                //     qrInfo.quantity+=obj.quantity
                // }

                // qrInfo.quantity=result.total_quantity
                
                setQrData(qrInfo)
                for(const row of selectedRows){
                    const key =`${row.mpo}-${row.color}-${row.shade}`
                    setChosenQty(prev => ({
                        ...prev,
                        [key]: null
                    }));
                }
                setSelectedRows([]) 
                // setBatchCard(true)
                // console.log(payload.batch_source)
                console.log('Batch created successfully:', result) 

            },
            (error: any)=>{
                console.log('Error creating batch:', error.response.data)
                // console.log(error.response.data)
                //                 let msg=""
                //                 Object.entries(error.response.data).forEach(([key, value]:any) => {
                //                     msg+=value[0]
                //                 });
                // console.log('Error creating batch:', err.response.data)
                const data = error.response?.data;
                if (typeof data?.shade === 'string') {
                    setErrorLog(data.shade);
                }
                else if (typeof data?.buyer === 'string') {
                    setErrorLog(data.buyer);
                }
                else if (typeof data?.color === 'string') {
                    setErrorLog(data.color);
                }
                else if (typeof data?.type === 'string') {
                    setErrorLog(data.type);
                }
                else if (typeof data?.input_sources?.[0]?.type?.[0] === 'string') {
                    setErrorLog(data.input_sources[0].type[0]);
                }
                else if (typeof data?.input_sources?.[0]?.mpo?.[0] === 'string') {
                    setErrorLog(data.input_sources[0].mpo[0]);
                }
                else if (typeof data?.input_sources?.[0]?.style?.[0] === 'string') {
                    setErrorLog(data.input_sources[0].style[0]);
                }
                else if (typeof data?.input_sources?.[0]?.so?.[0] === 'string') {
                    setErrorLog(data.input_sources[0].so[0]);
                }
                else if (typeof data?.input_sources?.[0]?.quantity?.[0] === 'string') {
                    setErrorLog(data.input_sources[0].quantity[0]);
                }
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
            top:80,
            left:320,
            position:'fixed',
            // position: "fixed",
            // top:85,
            // left: 0,
            right: 0,
            maxHeight: 550,          // vertical scrollbar
            overflowX: "auto",       // horizontal scrollbar
            overflowY: "auto",
            // marginLeft:'250px',
            // marginRight:'70px',
            maxWidth: 1100,
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
                                // height:30
                            },
                            "& .MuiInputBase-root": {
                                 height: 20, // total height
                                 width:'80px'
                                //  width:20
                            },
                            "& .MuiFormLabel-root":{
                                lineHeight:1,
                                fontSize:12,
                                left:10,
                                top:-5,
                                fontWeight:'bold'
                                // textAlign:'center'
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
                        label="MPO"
                         onChange={(e) => {
                            const value = e.target.value;
                            setFilter((prev) => ({ ...prev, ["mp"]: value }));
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
                                // height:30
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
                            "& .MuiFormLabel-root":{
                                lineHeight:1,
                                fontSize:12,
                                left:10,
                                top:-5,
                                fontWeight:'bold'
                                // textAlign:'center'
                            },
                            "& .MuiInputBase-root": {
                                 height: 20, // total height
                                 width:'80px'
                                //  width:20
                            },
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
                                // height:30
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
                            "& .MuiInputBase-root": {
                                 height: 20, // total height
                                 width:'80px'
                                //  width:20
                            },
                            "& .MuiFormLabel-root":{
                                lineHeight:1,
                                fontSize:12,
                                left:10,
                                top:-5,
                                fontWeight:'bold'
                                // textAlign:'center'
                            },
                            // textEmphasisColor:'white'
                        }}
                        autoFocus
                        size="small"
                        label="Style"
                         onChange={(e) => {
                            const value = e.target.value;
                            setFilter((prev) => ({ ...prev, ["style"]: value }));
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
                                // height:30
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
                            "& .MuiInputBase-root": {
                                 height: 20, // total height
                                 width:'120px'
                                //  width:20
                            },
                            "& .MuiFormLabel-root":{
                                lineHeight:1,
                                fontSize:12,
                                left:10,
                                top:-5,
                                fontWeight:'bold'
                                // textAlign:'center'
                            },
                            // textEmphasisColor:'white'
                        }}
                        autoFocus
                        size="small"
                        label="Sales Order"
                         onChange={(e) => {
                            const value = e.target.value;
                            setFilter((prev) => ({ ...prev, ["so"]: value }));
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
                                // height:30
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
                            "& .MuiInputBase-root": {
                                 height: 20, // total height
                                 width:'80px'
                                //  width:20
                            },
                            "& .MuiFormLabel-root":{
                                lineHeight:1,
                                fontSize:12,
                                left:10,
                                top:-5,
                                fontWeight:'bold'
                                // textAlign:'center'
                            },
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
                                // height:30
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
                            "& .MuiInputBase-root": {
                                 height: 20, // total height
                                 width:'80px'
                                //  width:20
                            },
                            "& .MuiFormLabel-root":{
                                lineHeight:1,
                                fontSize:12,
                                left:10,
                                top:-5,
                                fontWeight:'bold'
                                // textAlign:'center'
                            },
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
                    .map((row) => {
                        const isDisabled = !selectedRows.some(
                            item =>
                                
                                item.color === row.color &&
                                item.shade === row.shade &&
                                item.mpo === row.mpo
                                
                        );
                        const key =`${row.mpo}-${row.color}-${row.shade}`;

                        const actualValue =chosenQty[key] ??null; 
                        const displayValue = isDisabled ? null : actualValue;
                        return(
                        <StyledTableRow  sx={{
                            //  height:'2px'
                        }}
                        key={`${row.mpo}-${row.color}-${row.shade}`}
                        >
                        <StyledTableCell align="center">{row.mpo}</StyledTableCell>
                        <StyledTableCell align="center">{row.buyer}</StyledTableCell>
                        <StyledTableCell align="center">{row.style}</StyledTableCell>
                        <StyledTableCell align="center">{row.so}</StyledTableCell>
                        <StyledTableCell align="center">{row.color}</StyledTableCell>
                        <StyledTableCell align="center">{row.shade}</StyledTableCell>   
                        <StyledTableCell align="center">{row.quantity}</StyledTableCell>
                        <StyledTableCell align="center">
                            <NumberSpinner
                            size="small"
                            min={1}
                            max={row?.quantity ?? 1}
                            // disabled={!selectedRows.some(item => item.mpo==row.mpo && item.style==row.style && item.so==row.so && item.buyer==row.buyer && item.color==row.color && item.shade==row.shade)}
                            // value={selectedRows.quantity ?? 0} 
                            customSize={15}
                            disabled={isDisabled}
                            value={displayValue}
                            onValueChange={(value) => handleQuantityChange(row, value ?? 0)}
                            />
                        </StyledTableCell>  
                        <StyledTableCell align="center">
                            <Checkbox 
                            checked={selectedRows.some(item => item.mpo==row.mpo &&  item.color==row.color && item.shade==row.shade)}
                            onChange={(e, checked) => handleRowSelect(row, checked)}
                            slotProps={{ input: { 'aria-label': 'select-row' } }}
                            sx={{
                                height:10
                            }}
                            />
                        </StyledTableCell>
                        </StyledTableRow>)
                    
                    })}
            </TableBody>
        </Table>
        </TableContainer>
        <Button variant="contained"  onClick={handleCreateBatch} sx={{ position:'fixed',top:650,background:tbCellColor}}>Create Batch</Button>

        <div style={{marginLeft:"150px"}}>
            {qrData && (
                        <Paper
                            ref={printRef}
                            elevation={5}
                            sx={{
                            alignContent: "right",
                            mt: 1,
                            px: 2,
                            pt:1,
                            pb:1,
                            // p: 3,
                            position:'fixed',
                            width: 280,
                            textAlign: "center",
                            }}
                        >

                            <QRCodeCanvas
                            // value={`RW822${qrData.date}W1${String(qrData.id).padStart(7, '0')}`}
                            value={qrData.id}
                            size={100}
                            level="H"
                            />

                            <Box sx={{ textAlign: "left" }}>
                            <Typography variant="body2" sx={{
                                textAlign: "center",
                                fontSize: 12,
                                mb: 2
                            }}>
                                {qrData.id}
                                {/* {`RW822${qrData.date}W1${String(qrData.id).padStart(7, '0')}`} */}
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
                
        </div>
        {qrData && (
                    <Button
                        variant="outlined"
                        sx={{ mt: 2 ,marginRight:"450px"}}
                        onClick={handlePrint}
                    >
                        Print QR Code
                    </Button>
                )}
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