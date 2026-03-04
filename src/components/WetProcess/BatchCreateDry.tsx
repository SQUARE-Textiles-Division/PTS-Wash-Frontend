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
import { Box, Button, Modal, Typography } from "@mui/material";
import type RejectionReason from "../../TypeAnnotations/RejectionReason";
import type FirstWashBatch from "../../TypeAnnotations/FirstWashBatch";
import type FirstWashBatchCreate from "../../TypeAnnotations/FirstWashBatchCreate";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

// import type RejectionReason from "../../TypeAnnotations/RejectionReason";
// import type RejectionReason from "../../TypeAnnotations/RejectionReason";
interface RejectItem {
 BundleBarcode: string;
  quantity: number;
}
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

interface FirstWashSourceBatch {
   shade:string,
    batch_source:{
        batch:number,quantity:number
    }[],
}
interface BatchDryItem {
  BundleBarcode: string;
  BatchQRCode: string;
  BatchNumber: number;
  MPO: string;
  Size: string;
  Color: string;
  Shade:string,
  Buyer:string,
  Style:string,
  SO:string,
  Quantity: number;
}
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
export default function BatchCreateDry(){
    const [batchCard,setBatchCard]=useState(false)
    const [dryBatchList,setDryBatchList]=useState<BatchDryItem[]>([])
    const [qrData, setQrData] = useState<any | null>(null);
    const printRef = useRef<HTMLDivElement>(null);
    const [errorLog,setErrorLog]=useState<string>('')
    const [shadeList,setShadeList]=useState<string[]>([])
    const [shade,setShade]=useState<string>("")
    const handlePrint = useReactToPrint({
        contentRef: printRef,
    });
    const [selectedRows, setSelectedRows] = useState<
        { BatchNumber: number; MPO:string,Buyer:string,Style:string,SO:string,Size:string,Color:string,Shade: string; Quantity: number }[]
        >([]);
    
    const [shadeWarn,setShadeWarn]=useState(false)
    
    const fetchPrimary=()=>{

            getData<BatchInstance[]>(
                `productions/batches/`,
                ip,
                {},
                {
                    search:'closed'
                },
                (result2:BatchInstance[])=>{
                    let batchDry=[]
                    let tempBatch:BatchDryItem[]=[]
                    let batchDryFinal:BatchDryItem[]=[]
                    for(let i=0;i<result2.length;i++){
                        batchDry.push(result2[i])
                    }
                    // let shadeSet = new Set();

                    for (let i = 0; i < batchDry.length; i++) {
                        let received = batchDry[i].batch_bundles;
                        if (!received) continue; // skip if undefined
                        let batchQR=`W8220${batchDry[i].updated_at}B${String(batchDry[i].id).padStart(10, '0')}`
                        for (let j = 0; j < received.length; j++) {
                            const recBundle = received[j]?.received; // optional chaining
                            tempBatch.push({'BundleBarcode':recBundle.bundle_barcode,'BatchQRCode':batchQR,'BatchNumber':batchDry[i].id,'MPO':batchDry[i].mpo,'Buyer':recBundle.buyer,'Style':recBundle.style,'SO':recBundle.so,'Shade':recBundle.shade,'Color':batchDry[i].color,'Size':batchDry[i].size,'Quantity':recBundle.quantity})
                            // if (recBundle.shade) shadeSet.add(recBundle.shade);
                        }
                    }
                    tempBatch.sort((a, b) => {
                        // Compare Shade first
                            if (a.Size < b.Size) return -1;
                            if (a.Size > b.Size) return 1;
                            if (a.Shade < b.Shade) return -1;
                            if (a.Shade > b.Shade) return 1;

                            // If Shade is equal, compare Size
                            

                            return 0; // Shade and Size are equal
                    });
                    // const batchDryFinal: typeof tempBatch = [];
                    async function processBatches() {
                        try {
                            if (tempBatch.length === 0) return; // avoid empty firstFetch

                            const result3 = await getDataAsync<RejectionReason[]>(`productions/rejections/`,ip);

                            const rejectMap = new Map<string, number>();
                            for (const rej of result3) {
                            const bundleBarcode = `8220${rej.individual_barcode.slice(0, -4)}001`;
                            rejectMap.set(bundleBarcode, (rejectMap.get(bundleBarcode) || 0) + 1);
                            }

                            // Safely update quantities
                            const tempBatchCopy = tempBatch.map(batch => ({
                            ...batch,
                            Quantity: Math.max(batch.Quantity - (rejectMap.get(batch.BundleBarcode) || 0), 0)
                            }));

                            // Merge by Size & Shade
                            // const batchDryFinal: typeof tempBatch = [];
                            let firstFetch = tempBatchCopy[0];
                            let prev = firstFetch.Quantity;

                            for (let i = 1; i < tempBatchCopy.length; i++) {
                            if (tempBatchCopy[i].Size === firstFetch.Size && tempBatchCopy[i].Shade === firstFetch.Shade) {
                                prev += tempBatchCopy[i].Quantity;
                            } else {
                                batchDryFinal.push({
                                ...firstFetch,
                                Quantity: prev
                                });
                                firstFetch = tempBatchCopy[i];
                                prev = firstFetch.Quantity;
                            }
                            }

                            batchDryFinal.push({
                            ...firstFetch,
                            Quantity: prev
                            });

                            // console.log("Final merged batches:", batchDryFinal);

                            // ✅ Update your table state in React
                            
                            async function applyFirstWashAdjustment(batchDryFinal: BatchDryItem[]) {
                                try {
                                    const result = await getDataAsync<FirstWashBatch[]>(
                                    `wet-process/first-wash-batches/`,
                                    ip
                                    );

                                    // 1️⃣ Build First Wash Map
                                    const firstWashMap = new Map<string, number>();

                                    for (const res of result) {
                                        for (const sourceBatch of res.source_batches) {
                                            const key = `${res.shade}-${sourceBatch.batch}`;
                                            const existing = firstWashMap.get(key) || 0;

                                            firstWashMap.set(
                                                key,
                                                existing + sourceBatch.quantity
                                            );
                                        }
                                    }

                                    // 2️⃣ Subtract first wash quantities from batchDryFinal
                                    const updatedBatches = batchDryFinal.map(batch => {
                                        const key = `${batch.Shade}-${batch.BatchNumber}`;

                                        if (firstWashMap.has(key)) {
                                            const firstWashQty = firstWashMap.get(key) || 0;

                                            return {
                                            ...batch,
                                            Quantity: Math.max(batch.Quantity - firstWashQty, 0)
                                            };
                                        }

                                        return batch;
                                    });

                                    console.log("After First Wash Adjustment:", updatedBatches);
                                    let shadeSet=new Set<string>()
                                    for(const batch of updatedBatches){
                                        if(batch.Quantity>0)
                                            shadeSet.add(batch.Shade)
                                    }
                                    setShadeList(Array.from(shadeSet))
                                    
                                    // ✅ If using React state:
                                    setDryBatchList(updatedBatches);

                                } 
                                catch (error) {
                                    console.error("Error fetching First Wash Batches:", error);
                                }
                            }

                            applyFirstWashAdjustment(batchDryFinal);
                            // setDryBatchList(batchDryFinal);

                        } catch (error) {
                            console.error("Failed to process batches:", error);
                        }
                    }

                    //         // Call the async function
                    processBatches();
                    

                    
                    // let rejectBundleSet=new Set()
                    // getData<RejectionReason[]>(
                    //     `productions/rejections/`,
                    //     ip,
                    //     {},
                    //     {},
                    //     (result3:RejectionReason[])=>{
                    //         result3.sort((a:RejectionReason,b:RejectionReason)=>{
                    //             if(a.individual_barcode<b.individual_barcode)
                    //                 return -1;
                    //             if(a.individual_barcode>b.individual_barcode)
                    //                 return 1;
                    //             return 0;
                    //         })
                            
                    //         for(const rej of result3){
                    //             // console.log(rej.)
                    //             // console.log(rej.details)
                    //             rejectBundleSet.add({"BundleBarcode":"8220"+rej.individual_barcode.substring(0,rej.individual_barcode.length-4)+"001","quantity":0})
                    //         }
                    //         for(const rej of rejectBundleSet as Set<RejectItem>){
                    //             for(const obj of result3){
                    //                 if("8220"+obj.individual_barcode.substring(0,obj.individual_barcode.length-4)+"001"==rej.BundleBarcode){
                    //                     rej.quantity++
                    //                 }
                    //             }
                    //         }
                    //         for(const rej of rejectBundleSet as Set<RejectItem>){
                    //             console.log(rej)
                    //             for(let i=0;i<tempBatch.length;i++){
                    //                 if(tempBatch[i].BundleBarcode==rej.BundleBarcode){
                    //                     console.log('Before:',tempBatch[i].Quantity,' Reject Quantity:',rej.quantity)
                    //                     tempBatch[i].Quantity-=rej.quantity
                    //                     break;
                    //                 }
                    //             }
                    //         }
                    //     }
                    // )
                    
                    
                    // // for(const obj of tempBatch){
                    // //     console.log(obj.BundleBarcode,' ',obj.BatchQRCode,' ',obj.BatchNumber,' ',obj.MPO,' ',obj.Size,' ',obj.Shade,' ',obj.Color,' ',obj.Quantity)
                    // // }
                    // // Traverse the Set
                    // let firstFetch=tempBatch[0]
                    // let prev=firstFetch.Quantity
                    // for(let i=1;i<tempBatch.length;i++){
                    //     if(tempBatch[i].Size==firstFetch.Size && tempBatch[i].Shade==firstFetch.Shade){
                    //         prev+=tempBatch[i].Quantity
                    //     }
                    //     else{
                    //         batchDryFinal.push({"BundleBarcode":firstFetch.BundleBarcode,"BatchQRCode":firstFetch.BatchQRCode,"BatchNumber":firstFetch.BatchNumber,"MPO":firstFetch.MPO,"Buyer":firstFetch.Buyer,"Style":firstFetch.Style,"Quantity":prev,"Color":firstFetch.Color,"Size":firstFetch.Size,"Shade":firstFetch.Shade})
                    //         prev=tempBatch[i].Quantity
                    //         firstFetch=tempBatch[i]
                    //     }
                    // }
                    
                    // batchDryFinal.push({"BundleBarcode":firstFetch.BundleBarcode,"BatchQRCode":firstFetch.BatchQRCode,"BatchNumber":firstFetch.BatchNumber,"MPO":firstFetch.MPO,"Buyer":firstFetch.Buyer,"Style":firstFetch.Style,"Quantity":prev,"Color":firstFetch.Color,"Size":firstFetch.Size,"Shade":firstFetch.Shade})
                    
                    
                    // // for (const shade of shadeSet) {
                    // //     console.log('Shade:', shade);
                    // // }
                    
                    // // for(const obj of batchDryFinal){
                    // //     console.log(obj.BatchQRCode,' ',obj.BatchNumber,' ',obj.MPO,' ',obj.Size,' ',obj.Shade,' ',obj.Color,' ',obj.Quantity)
                    // // }
                    // //    for()
                    //  batchDryFinal.sort((a, b) => {
                    //     // 
                    //         if (a.Shade < b.Shade) return -1;
                    //         if (a.Shade > b.Shade) return 1;

                    //         // If Shade is equal, compare Size
                            

                    //         return 0; // Shade and Size are equal
                    // });
                    // setDryBatchList(batchDryFinal)
                    
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
            { BatchNumber: row.BatchNumber, Shade: row.Shade, MPO:row.MPO, Buyer:row.Buyer, Style:row.Style, SO:row.SO, Size:row.Size, Color:row.Color, Quantity: 0 },
            ]);
        }
        else {
            // Remove row from state
            setSelectedRows(prev =>
            prev.filter(item => item.BatchNumber !== row.BatchNumber)
            );
        }
    };
    const handleQuantityChange = (row: any, value: number) => {
        // console.log('Quantity changed for BatchNumber:', row.BatchNumber, 'New Quantity:', value);
        setSelectedRows(prev => {
            const exists = prev.find(item => item.BatchNumber === row.BatchNumber && item.Shade==row.Shade);
            if (exists) {
            return prev.map(item =>
                item.BatchNumber === row.BatchNumber && item.Shade==row.Shade
                ? { ...item, Quantity: value }
                : item
            );
            } else {
            // Automatically add row if it doesn’t exist
            return [...prev, { BatchNumber: row.BatchNumber, Shade: row.Shade,MPO:row.MPO,Buyer:row.Buyer,Style:row.Style,SO:row.SO,Size:row.Size,Color:row.Color, Quantity: value }];
            }
        });
    };
    // console.log('Selected Rows:', selectedRows);
    const handleCreateBatch=()=>{
        // Logic to create batch with selectedRows data
       selectedRows.sort((a,b)=>{
            if(a.Shade<b.Shade)
                return -1
            if(a.Shade>b.Shade)
                return 1
            return 0
       })
       const prevShade=selectedRows[0].Shade

       for(let i=1;i<selectedRows.length;i++){
            console.log(selectedRows[i].BatchNumber,' ',selectedRows[i].Shade,' ',selectedRows[i].Quantity)
            if(selectedRows[i].Shade!=prevShade){
                setShadeWarn(true)
                setSelectedRows([])
                
                return;
            }
            
       }
       let  payload:FirstWashSourceBatch={
        shade:"",
        batch_source:[]
       }
    //    const batchQtyList=[]
       payload.shade=selectedRows[0].Shade
    //    const preShade=payload.shade
    //    const prevBatch={batch:selectedRows[0].BatchNumber,quantity:selectedRows[0].Quantity}
       for(let i=0;i<selectedRows.length;i++){
            payload.batch_source.push({batch:selectedRows[i].BatchNumber,quantity:selectedRows[i].Quantity})
       }

       console.log('Payload for First Wash Batch Creation:', payload)
       let storeMeta:any={ mpo: [] as string[],
            buyer: [] as string[],
            style: [] as string[],
            so: [] as string[],
            color: [] as string[],
            size: [] as string[],
            shade: '',
            quantity: 0}
       let mpoSet=new Set() as Set<string>
       let buyerSet=new Set() as Set<string>
       let styleSet=new Set() as Set<string>
       let soSet=new Set() as Set<string>
       let colorSet=new Set() as Set<string>
       let sizeSet=new Set()  as Set<string>
       for(let i=0;i<selectedRows.length;i++){
            const row=selectedRows[i]
            if(row){
                mpoSet.add(row.MPO)
                buyerSet.add(row.Buyer)
                styleSet.add(row.Style)
                soSet.add(row.SO)
                colorSet.add(row.Color)
                sizeSet.add(row.Size)
            }
        }
        storeMeta.mpo=Array.from(mpoSet)
        storeMeta.buyer=Array.from(buyerSet)
        storeMeta.style=Array.from(styleSet)
        storeMeta.so=Array.from(soSet)
        storeMeta.color=Array.from(colorSet)
        storeMeta.size=Array.from(sizeSet)
        storeMeta.shade=payload.shade
       
       postData<FirstWashBatchCreate>(
        `wet-process/first-wash-batches/`,
        ip,
        payload,
        (result:FirstWashBatchCreate)=>{
            setBatchCard(true)
            const qrInfo={
                id:result.id,
                mpo:"",
                buyer:"",
                style:"",
                so:"",
                shade:"",
                quantity:0,
                date:"",
                size:"",
                color:""
            }
            let date=result.created_at.slice(0, 10).replace(/-/g, "");
            qrInfo.date=date
            qrInfo.mpo=storeMeta.mpo.join(", ")
            qrInfo.buyer=storeMeta.buyer.join(", ")
            qrInfo.style=storeMeta.style.join(", ")
            qrInfo.so=storeMeta.so.join(", ")
            qrInfo.color=storeMeta.color.join(", ")
            qrInfo.size=storeMeta.size.join(", ")
            qrInfo.shade=storeMeta.shade
            qrInfo.quantity=result.total_quantity
            
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
        <Box sx={{ width: 150, margin: '20px auto' }}>
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
        </Box>
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
           mt:10,
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
            <StyledTableCell align="center">Choose Quantity</StyledTableCell>
            <StyledTableCell align="center">Select </StyledTableCell>
    
          </TableRow>
        </TableHead>
        <TableBody>
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
                            {`W8220${qrData.date}W1${String(qrData.id).padStart(10, '0')}`}
                        </Typography>
                        <Typography variant="body2">
                            <b>Total Quantity:</b> {qrData.quantity}
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
            <Typography variant="h6">Selected rows must have the same shade</Typography>
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