import { Box, Button, patch, Popper, TextField } from "@mui/material";
import { Modal, Typography,  Menu, MenuItem } from "@mui/material";
import React from "react";
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { delData, getData, patchData } from "./genericApiService";
import type RejectionReason from "../TypeAnnotations/RejectionReason";
import type BatchBundle from "../TypeAnnotations/BatchBundle";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { WhiskerRejectReasons } from "./RejectionReasons/WhiskerRejectReasons"
import { tbCellColor, tbRowColor } from "./Colors/Colors";
import { ip } from "../ip";



const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    // backgroundColor: theme.palette.common.black,
    backgroundColor: tbCellColor,
    color: tbRowColor,
    lineHeight:0.5
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

export default function QCEditDel() {
  const [rows, setRows] = React.useState<any[]>([]);
  const [popperActive,setPopperActive]=React.useState<boolean>(false)
  // const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const batchRef = React.useRef<HTMLInputElement>(null);
  const [batchNum, setBatchNum] = React.useState<number>(0);
  const [deletePop, setDeletePop] = React.useState<boolean>(false);
  const [deleteId, setDeleteId] = React.useState<number>(0);
  const rejectReasons=WhiskerRejectReasons;
  const [reason,setReason]=React.useState<string>("");
  const [reasonDisplay,setReasonDisplay]=React.useState<string>("");
  const [popanchorEl, setPopAnchorEl] = React.useState<null | HTMLElement>(null);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedRow, setSelectedRow] = React.useState<any>(null);
  const [deleteStage,setDeleteStage]=React.useState<string>("")
  const [deleteError,setDeleteError]=React.useState<string>("")
  // React.useEffect(() => {
  //   if (popperActive && containerRef.current) {
  //     setPopAnchorEl(containerRef.current);
  //   } else {
  //     setPopAnchorEl(null); // 👈 clear when closed
  //   }
  // }, [popperActive]);

  const menuOpen = Boolean(anchorEl);
  let batchIdNum: number = 0;

  const fetchData = (batchcode: string) => {
    if (!batchcode) {
        console.warn("No Batchcode entered");
        return;
    }
    const str = batchcode
    const index = str.indexOf("B");      // find position of ":"
    let batchId = str.substring(index + 1);
    batchIdNum = parseInt(batchId, 10);
    setBatchNum(batchIdNum)
    getData<RejectionReason[]>(
      "productions/rejections/",
      ip,
      {},
      { batch: batchIdNum },
      (rejectedData:RejectionReason[]) => {
        const tempRows: any[] = [];
        // console.log("Rejection Reasons:", rejectedData);
        if (rejectedData.length === 0) {
            if (containerRef.current) {
              setPopAnchorEl(containerRef.current);
            }
            setPopperActive(true);
            setRows([])
            return;
        }
        else{
          setPopperActive(false);
        }
        for(let i=0;i<rejectedData.length;i++){
          const obj={
            "id":rejectedData[i].id,
            "individual_barcode":rejectedData[i].individual_barcode,
            "mpo":rejectedData[i].details.mpo,
            'marker':rejectedData[i].details.marker,
            'size':rejectedData[i].details.size,
            'color':rejectedData[i].details.color,
            'shade':rejectedData[i].details.shade,
            "rejected_at":rejectedData[i].stage,
            "reason":rejectedData[i].reason,
          }
          tempRows.push(obj);
        }
        setRows(tempRows);
      },
      (error) => {
        console.error("Error fetching rejection reasons:", error.response?.data);
      }

    )
    // getData<>("/api/batch", { batchcode });
  }
   const handleDelete=(id:number,stage:string)=>{
      delData<RejectionReason>(
        `productions/rejections/${id}/`,
        ip,
        {},
        {stage: stage},
        (data) => {
          console.log("Rejection deleted:", data);
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
    const handleEdit = (id: number, reason: string) => {
      patchData<RejectionReason>(
        `productions/rejections/${id}/`,
        ip,
        { reason },
        (data) => {
          setRows(prev =>
            prev.map(row =>
              row.id === id ? { ...row, reason: data.reason } : row
            )
          );
        }
      );
    };

  return (
   <div style={
            {
                display:'flex',
                flexDirection:'column',
                alignItems:'center',
                // gap:'20px',
                marginLeft:'100px'
            }
            }>
              <Box
                sx={{
                // minHeight: '20vh',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'center',
                // pt: 2,
                // width:250
                }}
            >
              <TextField
                      style={{position:'fixed',top:80}}
                      inputRef={batchRef}
                      label="Scan Batch QRCode Here"
                      // fullWidth
                      autoFocus
                      onChange={()=>{
                        const batchcode = batchRef.current?.value.trim() || "";
                        if(batchcode.length>=14){
                            fetchData(batchcode);
                            batchRef.current!.value = "";
                                // barcodeRef.current!.value = ""}
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
                          "& .MuiInputBase-root": {
                              height: 30, // total height
                          },
                      }}
                />
                <div ref={containerRef} style={{ display: "inline-block",position:'fixed',top:180,left:800 }}>
                  {/* Anchor Area */}
                </div>

                <Popper open={popperActive} anchorEl={popanchorEl} placement="top">
                  <Box sx={{ p: 1,  color: '#e0c055',fontWeight:'bold' ,position:'fixed',top:10 ,width:280}}>
                    No rejections for this batch
                  </Box>
                </Popper>
            </Box>

            <TableContainer
                component={Paper}
                elevation={0}
                sx={{
                  // maxHeight: 200,          // vertical scrollbar
                  maxHeight: 400,   
                  overflowX: "auto",       // horizontal scrollbar
                  overflowY: "auto",
                  border:'none',
                  marginLeft:"50px",
                  position:'fixed',
                  top:140,
                  maxWidth: 1000,
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
                            <StyledTableCell align="center">Individual Barcode</StyledTableCell>
                            <StyledTableCell align="center">Marker No</StyledTableCell>
                            <StyledTableCell align="center">Size</StyledTableCell>
                            <StyledTableCell align="center">Shade</StyledTableCell>
                            <StyledTableCell align="center">Color</StyledTableCell>
                            <StyledTableCell align="center">Rejected At</StyledTableCell>
                            <StyledTableCell align="center">Reason</StyledTableCell>
                            <StyledTableCell align="center">Edit</StyledTableCell>
                            <StyledTableCell align="center">Delete</StyledTableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {rows.map((row) => (
                            
                            <StyledTableRow key={row.id}>
                              <StyledTableCell>{row.mpo}</StyledTableCell>
                              <StyledTableCell align="center">{row.individual_barcode}</StyledTableCell>
                              <StyledTableCell align="center">{row.marker}</StyledTableCell>
                              <StyledTableCell align="center">{row.size}</StyledTableCell>
                              <StyledTableCell align="center">{row.shade}</StyledTableCell>
                              <StyledTableCell align="center">{row.color}</StyledTableCell>
                              <StyledTableCell align="center"><b>{row.rejected_at.toUpperCase()}</b></StyledTableCell>
                              <StyledTableCell align="center"><b style={{color:"red"}}>{row.reason.toUpperCase()}</b></StyledTableCell>
                              <StyledTableCell align="center"><Button sx={{
                                backgroundColor: '#485e68',
                                color: 'white',
                                height:15
                              }}
                              onClick={(e) => {
                                setAnchorEl(e.currentTarget);
                                setSelectedRow(row); // store full row or row.id
                              }}
                              >Edit</Button></StyledTableCell>
                              <StyledTableCell align="center">
                                <DeleteForeverIcon
                                  sx={{
                                        
                                        fontSize:20
                                      }}
                                    color='error' 
                                    fontSize='medium'
                                    onClick={()=>{
                                      console.log("Delete clicked for id:", row.id);
                                      setDeletePop(true);
                                      setDeleteId(row.id);
                                      setDeleteStage(row.rejected_at);
                                    }}
                                  >
                                </DeleteForeverIcon>
                              </StyledTableCell>
                            </StyledTableRow>
                          ))}
                        </TableBody>
                      </Table>
              </TableContainer>
              <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                  >
                    {rejectReasons.map((item) => (
                      <MenuItem
                        key={item.actual}
                        onClick={() => {
                          handleEdit(selectedRow.id, item.actual);
                          setAnchorEl(null);
                        }}
                      >
                        {item.display}
                      </MenuItem>
                    ))}
                  </Menu>
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
                      // bgcolor: "rgba(148, 131, 131, 0.5)", // dark overlay
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
                            onClick={()=>handleDelete(deleteId,deleteStage)}>Delete</Button>
                         <Button sx={{ mt: 2 ,background:'green',color:'white'}} onClick={() => {setDeletePop(false);setDeleteId(0);}}>Cancel</Button>
                    </div>
                    
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
    </div>
  );
}