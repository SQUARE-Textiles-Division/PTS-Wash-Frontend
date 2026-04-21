import {Box,TextField}   from "@mui/material";
import { Modal, Typography, Button } from "@mui/material";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import type { SelectChangeEvent } from '@mui/material/Select';
import { WhiskerRejectReasons } from "../RejectionReasons/WhiskerRejectReasons";
import React, { useState } from "react";
import type RejectionReason from "../../TypeAnnotations/RejectionReason";
import { delData, getData, postData } from "../genericApiService";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { tbCellColor, tbRowColor } from "../Colors/Colors";
import { ip } from "../../ip";
import type BatchBundles from "../../TypeAnnotations/BatchInstance";
import type BatchStageHistory from "../../TypeAnnotations/BatchStageHistory";

interface IndividualMeta{
  id:number,
  mpo:string,
  individual_barcode:string,
  marker:string,
  shade:string,
  color:string,
  rejected_at:string,
  size:string,
  reason:string

}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    // backgroundColor: theme.palette.common.black,
    backgroundColor: tbCellColor,
    color: tbRowColor,
    lineHeight:0.5
    // fontSize:12
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    lineHeight:0.1,
    padding: '1.5px',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));
export default function TagQC() {
  const individualBarcodeRef = React.useRef<HTMLInputElement>(null);
  const rejectReasons=WhiskerRejectReasons;
   const [rows, setRows] = React.useState<IndividualMeta[]>([]);
  const [rejectField,setRejectField]=React.useState<boolean>(false);
  const [reason,setReason]=React.useState<string>("");
  const [rejectPop,setRejectPop]=useState<boolean>(false)
  const [invbarcode,setinvbarcode]=React.useState<string>("");
  const [reasonDisplay,setReasonDisplay]=React.useState<string>("");
  const [rejectError,setRejectError]=React.useState<string>("");
  const [deletePop, setDeletePop] = React.useState<boolean>(false);
  const [deleteId, setDeleteId] = React.useState<number>(0);
  const [deleteError,setDeleteError]=React.useState<string>("")
  const [delbarcode,setDelBarCode]=React.useState<string>("")
  // const [del]

  const handleDelete=(id:number)=>{
    delData<RejectionReason>(
      `productions/rejections/${id}/`,
      ip,
      {},
      {stage: "Tag"},
      (data) => {
        console.log("Rejection deleted:", data);
        const delObj=rows.filter((row)=>row.id==id)
        setDelBarCode(delObj[0].individual_barcode)
        setinvbarcode("")
        // delObj.individual_barcode
        const updatedRows = rows.filter((row) => row.id !== id);
        setRows(updatedRows);
        setDeletePop(false);
        setDeleteId(0)
      },
       (error:any)=>{
        console.log('Err',error.response.data[0])
        setDeleteError(error.response.data[0])
      }
    )
  }
  return (
    <Box
      sx={{
        // minHeight: "20vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        top: 0,
        marginLeft:-50
        // left: -100,
        // pt: 2,
        // width: '100%',
      }}
    >
      {/* Barcode Input */}
      <TextField

        label="Scan Individual Barcode Here"
        // fullWidth
        style={{position:'fixed',top:80}}
        inputRef={individualBarcodeRef}
        onChange={() => {
          const inv = individualBarcodeRef.current?.value.trim() || "";
          if (inv.length == 16) {
            setinvbarcode(inv);
            setDelBarCode("")
            setRejectField(true);
            individualBarcodeRef.current!.value = "";
          }
        }}
        autoFocus
        sx={{
          "& .MuiOutlinedInput-root": {
            "&.Mui-focused fieldset": {
              borderColor: "#485e68",
            },
          },
          "& .MuiInputLabel-root": {
            "&.Mui-focused": {
              color: "#485e68",
            },
            "& .MuiInputBase-root": {
                  height: 30, // total height
              },
          },
          // width: '250px',  // Adjust width as needed
          // mb: 2,  // Space below the input
          // marginRight:'80%'

          
        }}
      />

      {/* Reject Reason Dropdown */}
      {rejectField && (
        <Box sx={{  position:'fixed' ,gap:2, display:'flex', flexDirection:'row', alignItems:'flex-start',justifyContent:'center',top:80,left:500 }}>
          {/* <Typography variant="h6" gutterBottom>
            Reject Reasons
          </Typography> */}

          <FormControl sx={{ 
                          // overflowY: 'auto',
                           width: 150 ,
                            "& .MuiInputBase-root": 
                            {height: 40 }}}>
            <InputLabel id="reject-reason-label">Reject Reason</InputLabel>
            <Select
              labelId="reject-reason-label"
              id="reject-reason"
              value={reason}
              label="Reject Reason"
              onChange={(e: SelectChangeEvent) => {const selectedActual = e.target.value;
                  setReason(selectedActual);

                  // Find the display name
                  const selectedItem = rejectReasons.find((item) => item.actual === selectedActual);
                  setReasonDisplay(selectedItem?.display || "");
                }}
            >
              {rejectReasons.map((item) => (
                <MenuItem key={item.actual} value={item.actual} >
                  {item.display}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Save Button */}
          <Button
            variant="contained"
            color="primary"
            // sx={{ mt: 2 }}
            disabled={!reason} // prevent opening modal if no reason
            onClick={() => setRejectPop(true)}
          >
            Save
          </Button>
          {invbarcode &&
            (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap:5,
                    }}
                >
                    <DoneAllIcon style={{ color: "green", fontSize: 18 }} />
                    <p style={{ margin: 0,fontWeight:'bold',fontSize:18 }}>Scanned, Individual Barcode {invbarcode}</p>
                </div>
              )
          }
          {delbarcode &&
            (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap:5,
                    }}
                >
                    <DoneAllIcon style={{ color: "red", fontSize: 18 }} />
                    <p style={{ margin: 0,fontWeight:'bold',fontSize:18 }}>Deleted, Individual Barcode {delbarcode}</p>
                </div>
              )
          }
          
        </Box>
      )}
       <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            maxHeight: 400,          // vertical scrollbar
            overflowX: "auto",       // horizontal scrollbar
            overflowY: "auto",
            border:'none',
            position:'fixed',
            top:140,
            maxWidth: 1000,
            // marginLeft:"50px"
            
          }}
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
                      <StyledTableCell>MPO</StyledTableCell>
                      <StyledTableCell align="center">Invidual Barcode</StyledTableCell>
                      <StyledTableCell align="center">Marker No</StyledTableCell>
                      <StyledTableCell align="center">Size</StyledTableCell>
                      <StyledTableCell align="center">Shade</StyledTableCell>
                      <StyledTableCell align="center">Color</StyledTableCell>
                      <StyledTableCell align="center">Rejected At</StyledTableCell>
                      <StyledTableCell align="center">Reason</StyledTableCell>
                      <StyledTableCell align="center">Delete</StyledTableCell>
                    </TableRow>
                  </TableHead>
                          <TableBody>
                          {rows.map((row) => (
                            <StyledTableRow key={row.id} >
                              <StyledTableCell>{row.mpo}</StyledTableCell>
                              <StyledTableCell align="center">{row.individual_barcode}</StyledTableCell>
                              <StyledTableCell align="center">{row.marker}</StyledTableCell>
                              <StyledTableCell align="center">{row.size}</StyledTableCell>
                              <StyledTableCell align="center">{row.shade}</StyledTableCell>
                              <StyledTableCell align="center">{row.color}</StyledTableCell>
                              <StyledTableCell align="center"><b>{row.rejected_at.toUpperCase()}</b></StyledTableCell>
                              <StyledTableCell align="center"><b style={{color:"red"}}>{row.reason.toUpperCase()}</b></StyledTableCell>
                              <StyledTableCell align="center">
                                <DeleteForeverIcon
                                    color='error' 
                                    sx={{
                                      
                                      fontSize:20
                                    }}
                                 
                                    onClick={()=>{
                                      console.log("Delete clicked for id:", row.id);
                                      setDeletePop(true);
                                      setDeleteId(row.id);
                                    }}
                                  >
                                </DeleteForeverIcon>
                              </StyledTableCell>
                            </StyledTableRow>
                          ))}
                      </TableBody>
              </Table>
        </TableContainer>
      {/* Modal */}
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
                            bgcolor: "#ffffe0", // light red background for error
                                
                            border:'3px solid #e6db55', // light red background for error
                            p: 4,
                            borderRadius: 2,
                            color: "black", // red text for error
                            width: 400,
                        }}
                      >
                      <Typography variant="h4">Are you Sure?</Typography>
                      
                    {/* <Typography>Already batches are allocated according to this plan */}
                    {/* </Typography> */}
                    <div style={{
                      display:'flex',
                      justifyContent:'space-between'
                    }}>
                        <Button sx={{ mt: 2 ,background:'red',color:'white'}}
                            onClick={()=>handleDelete(deleteId)}>Delete</Button>
                         <Button sx={{ mt: 2 ,background:'green',color:'white'}} onClick={() => {setDeletePop(false);setDeleteId(0);}}>Cancel</Button>
                    </div>
                    
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
                                
              border:'3px solid #e6db55',
              p: 4,
              borderRadius: 2,
              color: "black",
              width: 400,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Typography variant="h4">Are you sure?</Typography>
            <Typography variant="h6">
              You want to reject this piece for{" "}
              <b>{reasonDisplay?.toUpperCase() || ""}</b> 
              <br></br>in Tag Stage
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
              <Button sx={{ background: "blue", color: "white" }} onClick={() => {
                // const bundleBarcode='8220'+invbarcode.substring(0, 12)+'001';
                // getData<BatchBundles[]>(
                //   `productions/batch-bundles/`,
                //   ip,
                //   {},
                //   {},
                //   (data: BatchBundles[]) => {
                //       if(data.length > 0){
                //           const batchbundleInfo = data.find(bundle => bundle.received.bundle_barcode === bundleBarcode);
                //           const batchCheckId=batchbundleInfo?.batch_id
                //           if(batchCheckId){
                //             getData<BatchStageHistory[]>(
                //               `productions/batch-stage-history/`,
                //               ip,
                //               {},
                //               {batch:batchCheckId},
                //               (historyData: BatchStageHistory[]) => {
                //                 const brushStage = historyData.find(stage => stage.stage === "Tag");
                //                 if(brushStage?.closed_by!=null){
                //                     setRejectError("This piece cannot be rejected as Tag stage is already closed for this batch.");
                //                     setRejectPop(false);
                //                     setReason("");
                //                     setReasonDisplay("");
                //                     return
                //                 }
                //                 postData<RejectionReason>(
                //                     "productions/rejections/",
                //                     ip,
                //                     {
                //                       individual_barcode: invbarcode,
                //                       stage: "Tag",
                //                       reason: reason,
                //                     },
                //                     (data) => {
                //                       console.log("Rejection recorded:", data);

                //                       setRejectPop(false);
                //                       setReason("");
                //                       setReasonDisplay("");

                //                       getData<RejectionReason[]>(
                //                         "productions/rejections/",
                //                         ip,
                //                         {},
                //                         { batch: data.batch },
                //                         (rejectedData: RejectionReason[]) => {

                //                           const tempRows = rejectedData
                //                             .filter(item => item.id === data.id) // keep only current rejection
                //                             .map(item => ({
                //                               id: item.id,
                //                               individual_barcode: item.individual_barcode,
                //                               mpo: item.details?.mpo,
                //                               marker: item.details?.marker,
                //                               size: item.details?.size,
                //                               color: item.details?.color,
                //                               shade: item.details?.shade,
                //                               rejected_at: item.stage,
                //                               reason: item.reason,
                //                             }));

                //                           setRows(prevRows => [...tempRows, ...prevRows]);
                //                         }
                //                       );
                //                     },
                //                     (error: any) => {
                //                       console.error("Error recording rejection:", error);

                //                       const errorMsg =
                //                         error?.response?.data?.individual_barcode?.[0] ||
                //                         error?.response?.data?.[0] ||
                //                         "Something went wrong";

                //                       setRejectError(errorMsg);
                //                       setReason("");
                //                       setReasonDisplay("");
                //                       setRejectPop(false);
                //                     }
                                    
                //                 )
                //               }
                //             )
                //           }
                //       }
                //   }
                // )
                postData<RejectionReason>(
                  "productions/rejections/",
                  ip,
                  {
                    individual_barcode: invbarcode,
                    stage: "Tag",
                    reason: reason,
                  },
                  (data) => {
                    console.log("Rejection recorded:", data);

                    setRejectPop(false);
                    setReason("");
                    setReasonDisplay("");

                    getData<RejectionReason[]>(
                      "productions/rejections/",
                      ip,
                      {},
                      { batch: data.batch },
                      (rejectedData: RejectionReason[]) => {

                        const tempRows = rejectedData
                          .filter(item => item.id === data.id) // keep only current rejection
                          .map(item => ({
                            id: item.id,
                            individual_barcode: item.individual_barcode,
                            mpo: item.details?.mpo,
                            marker: item.details?.marker,
                            size: item.details?.size,
                            color: item.details?.color,
                            shade: item.details?.shade,
                            rejected_at: item.stage,
                            reason: item.reason,
                          }));

                         setRows(prevRows => [...tempRows, ...prevRows]);
                      }
                    );
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
    </Box>
  );
};