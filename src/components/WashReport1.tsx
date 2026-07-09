import { useState } from "react";
import { useApiService } from "./genericApiService";
import { Box, Button, FormControl, InputLabel, MenuItem, Paper, Select, styled, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import { tbCellColor, tbRowColor } from "./Colors/Colors";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { DemoItem } from '@mui/x-date-pickers/internals/demo';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { DryProcess } from "../DryProcessActions";
import type IndividualInOut from "../TypeAnnotations/IndividualInOut";
import { ip } from "../ip";


interface Params {
  garment_unit__mpo?: string;
  stage?: string;
  action?: string;
  scanned_at__gte?:string,
  scanned_at__lte?:string,
}
const StyledTableCell = styled(TableCell)(({  }) => ({
  [`&.${tableCellClasses.head}`]: {
    // backgroundColor: theme.palette.common.black,
    // backgroundColor: '#485e68',
    backgroundColor: tbCellColor,
    lineHeight:0.5,
    color: "white",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    lineHeight:0.6,
    padding: '4px 6px',
    
    // paddingRight:'50px'
  },
}));

const StyledTableRow = styled(TableRow)(({  }) => ({
  // height: '5px', 
  '&:nth-of-type(odd)': {
    backgroundColor: tbRowColor
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));
export default function WashReport1(){
    const [selectedProcess, setSelectedProcess] = useState("");
    const [tracking, setTracking] = useState<{stage: string,action: string;} | null>(null);
    const {getData}=useApiService()
    const [mpo,setMpo]=useState("")
    // const mpoRef = useRef<HTMLInputElement>(null);
    const [rows, setRows] = useState<any[]>([]);


    const [date, setDate] = useState('');




    return(
        <Box sx={{ width: '100%', mx: 'auto' }}>
           <TextField
                label="Enter MPO"
                style={{position:'fixed',top:80,left:300}}
                // inputRef={mpoRef}
                // autoFocus
                onChange={(e)=>{
                    setMpo(e.target.value);
                }}
                sx={{
                  position:'fixed',
                  top:80,
                  left:300,
                  width: 120,
                  // mb: 5,
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": {
                      borderColor: "#485e68",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    "&.Mui-focused": {
                      color: "#485e68",
                    },
                  },
                  
                  "& .MuiInputBase-root": {
                    //   height: 40, // total height
                  },
                }}
              />
         <LocalizationProvider dateAdapter={AdapterDayjs}>

             <DemoItem >
                <DesktopDatePicker
                    sx={{
                        position:'fixed',
                        top:80,
                        width:200,
                        left:435
                    }}
                    value={date ? dayjs(date) : null}
                    onChange={(newDate:any) => {
                        if (newDate && newDate.isValid()) {
                            setDate(newDate.format("YYYY-MM-DD"));
                            // console.log(date)
                        } 
                        else {
                            setDate("");
                        }
                    }}
                    slotProps={{
                    field: { clearable: true },
                    }}
                />
            </DemoItem>

            {/* <DatePicker
                label="Select date"
                  sx={{
                    position:'fixed',
                    top:80,
                    width:150,
                    left:435
                }}
                value={date ? dayjs(date) : null}
                onChange={(newDate) => {
                if (newDate && newDate.isValid()) {
                    setDate(newDate.format("YYYY-MM-DD"));
                    // console.log(date)
                } else {
                    setDate("");
                }
                }}
            /> */}
        </LocalizationProvider>
        

         <FormControl style={{
                            position:'fixed',
                            top:80,
                            left:650,
                            width:'150px'
                }}>
                <InputLabel id="demo-simple-select-label">Process</InputLabel>
                        <Select
                        value={selectedProcess}
                        onChange={(e) => {
                            const display = e.target.value;

                            setSelectedProcess(display);

                            const process = DryProcess.find(
                            (item) => item.Display === display
                            );

                            if (process) {
                                setTracking({
                                    stage: process.stage,
                                    action: process.action,
                                });
                            }
                        }}
                        >
                        {DryProcess.map((dryprocess) => (
                            <MenuItem
                            key={dryprocess.Display}
                            value={dryprocess.Display}
                            >
                            {dryprocess.Display}
                            </MenuItem>
                        ))}
                        </Select>
            </FormControl>
             {rows.length>0 &&(
                    <h5 style={{
                        position:'fixed',
                        top:80,
                        left:850
                    }}><b>TOTAL - {rows.length}</b></h5>
                )}
        <Button variant="contained"
                        sx={{
                            // mt:20,
                            position:'fixed',
                            top:80,
                            left:1050,
                            backgroundColor: "#485e68",
                            '&:hover': {
                                backgroundColor: '#37474f',
                            },
                            width: 150,
                        }}
                disabled={date=="" && mpo=="" || tracking==null}
                onClick={()=>{
                    // setRows([])
                    const param_obj: Params = {};
                    if(mpo!=""){
                        param_obj.garment_unit__mpo=mpo
                    }
                    if(tracking){
                        param_obj.action=tracking.action
                        param_obj.stage=tracking.stage
                    }
                    if(date){
                        param_obj.scanned_at__gte=`${date}T00:00`
                        param_obj.scanned_at__lte=`${date}T23:59`
                    }
                    // console.log(date,' Mpo ',mpo,'Tracking ',tracking)
                    // console.log(date)
                    getData<IndividualInOut[]>(
                       `dry-process/tracking-histories/`,
                        ip,
                        {},
                        param_obj,
                        (reportRes:IndividualInOut[])=>{
                            console.log(reportRes)
                            let resObj=[{
                                mpo:"",
                                marker:"",
                                individual_barcode:"",
                                buyer:"",
                                style:"",
                                so:"",
                                size:"",
                                shade:"",
                                color:"",
                            }]
                            if(reportRes.length==0){
                                setRows([])
                                return
                            }
                            for(const obj of reportRes){
                                const garment=obj.garment_unit
                                resObj.push({
                                mpo: garment.mpo,
                                marker: garment.marker,
                                individual_barcode: garment.individual_barcode,
                                buyer: garment.buyer,
                                style: garment.style,
                                so: garment.so,
                                size: garment.size,
                                shade: garment.shade,
                                color: garment.color,
                                });
                            }
                            setRows(resObj)
                        },
                        (error:any)=>{
                            console.log(error)
                        }
                    )
                }}
                        
                >Get Report</Button>
            <TableContainer
                component={Paper}
                elevation={0}
                sx={{
                maxHeight: 480,          // vertical scrollbar
                overflowX: "auto",       // horizontal scrollbar
                overflowY: "auto",
                // marginLeft:'0px',
                left:225,
                maxWidth: 1000,
                border:"none",
                position:'fixed',
                top:140
                }}
                // sx={{
                //   // maxHeight: 200,          // vertical scrollbar
                //   overflowX: "auto",       // horizontal scrollbar
                //   overflowY: "auto",
                //   border:'none',
                //   maxWidth:1100,
                //   // marginLeft:'200px'

                // }}
            >
                        <Table
                        stickyHeader
                                sx={{ '& .MuiTableCell-root':{
                            borderBottom:'none'
                        } }}   // force horizontal scroll if screen is smaller
                                aria-label="customized table"
                        >
                        <TableHead>
                        <TableRow>
                            {/* <StyledTableCell>BatchQRCode</StyledTableCell> */}
                            <StyledTableCell align="center">Individual Barcode</StyledTableCell>
                            <StyledTableCell align="center">MPO</StyledTableCell>
                            <StyledTableCell align="center">Marker</StyledTableCell>
                            <StyledTableCell align="center">Buyer</StyledTableCell>
                            <StyledTableCell align="center">Style</StyledTableCell>
                            <StyledTableCell align="center">Sales Order</StyledTableCell>
                            <StyledTableCell align="center">Size</StyledTableCell>
                            <StyledTableCell align="center">Shade</StyledTableCell>
                            <StyledTableCell align="center">Color</StyledTableCell>
                            {/* <StyledTableCell align="center">Total Quantity</StyledTableCell> */}
                        </TableRow>
                        </TableHead>
                        {/* <TableBody> */}
                            {/* <StyledTableRow >
                            <StyledTableCell component="th" scope="row">
                                {scanned.BatchQRCode}
                            </StyledTableCell>
                            <StyledTableCell align="center">{scanned.MPO}</StyledTableCell>
                            <StyledTableCell align="center">{scanned.Buyer}</StyledTableCell>
                            <StyledTableCell align="center">{scanned.Style}</StyledTableCell>
                            <StyledTableCell align="center">{scanned.Size}</StyledTableCell>
                            <StyledTableCell align="center">{scanned.Shades}</StyledTableCell>
                            <StyledTableCell align="center">{scanned.Color}</StyledTableCell>
                            {/* <StyledTableCell align="center">{scanned.Total_Quantity-finalrejcnt}</StyledTableCell> */}
                            {/* </StyledTableRow> */} 
                        {/* </TableBody> */}

                        
                        <TableBody
                        style={{
                            position: "relative",
                            // height: rowVirtualizer.getTotalSize()
                        }}
                        >
                        {rows.length === 0 ?(
                                <TableRow>
                                <TableCell colSpan={9} align="center">
                                    No Data Found
                                </TableCell>
                                </TableRow>
                            )
                        :
                        (rows.map((row) => (
                            
                            <StyledTableRow
                                key={row.individual_barcode}
                                style={{
                                // position: "absolute",
                                // top: 0,
                                // transform: `translateY(${virtualRow.start}px)`,
                                // width: "100%",
                                }}
                            >
                                <StyledTableCell align="center">{row.individual_barcode}</StyledTableCell>
                                <StyledTableCell align="center">
                                    {row.mpo}
                                </StyledTableCell>
                                <StyledTableCell align="center">
                                    {row.marker}
                                </StyledTableCell>
                                <StyledTableCell align="center">{row.buyer}</StyledTableCell>
                                <StyledTableCell align="center">{row.style}</StyledTableCell>
                                <StyledTableCell align="center">{row.so}</StyledTableCell>
                                <StyledTableCell align="center">{row.size}</StyledTableCell>
                                <StyledTableCell align="center">{row.shade}</StyledTableCell>
                                <StyledTableCell align="center">{row.color}</StyledTableCell>
                            </StyledTableRow>
                            )))}
                        </TableBody>
                    </Table>
            </TableContainer>
        </Box>
    )
     

}