import * as React from 'react';
import {Box,Modal,TextField}   from "@mui/material";
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { useState,useRef,useEffect } from 'react';
// import Button from '@mui/material/Button';
import {  Typography, Button} from "@mui/material";
import { getData, postData } from '../genericApiService';
import type BundleInfo from '../../TypeAnnotations/BundleInfo';
import type BatchStage from '../../TypeAnnotations/BatchStage';
import type BatchInstance from '../../TypeAnnotations/BatchInstance';
import type RouteSteps from '../../TypeAnnotations/BatchInstance';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { tbCellColor, tbRowColor } from '../Colors/Colors';
import { ip } from '../../ip';
import type RejectionReason from '../../TypeAnnotations/RejectionReason';
import type BatchStageHistory from '../../TypeAnnotations/BatchStageHistory';
// import { postData } from './genericApiService';
// import Typography from '@mui/material/Typography';


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    // backgroundColor: theme.palette.common.black,
    backgroundColor: tbCellColor,
    color: tbRowColor
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
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

export default function LaserBrushIn() {
  const [stages,setStages]=useState<string[]>([])
  const [activeStep, setActiveStep] = React.useState(0); // step that is currently clickable
  const [completed, setCompleted] = React.useState<boolean[]>(stages.map(() => false)); 
  const [errorLog,setErrorLog]=useState<string>('')
  const [scanned,setScanned]=useState<any>()
  const [finalrejcnt,setFinalRejCnt]=useState<number>(0)
  
  // console.log(completed)
  // cos
useEffect(() => {
    if (stages.length > 0) {
      setCompleted(stages.map(() => false));
      setActiveStep(0);
    }
  }, [stages]);
  const normalizeStage = (s: string) =>
  s.trim().toUpperCase().replace(/\s+/g, " ");

  const markCompletedUntil = (currStage: string, stageList: string[]) => {
    const normalized = normalizeStage(currStage);

    const stageIndex = stageList.findIndex(
      stage => normalizeStage(stage) === normalized
    );

    if (stageIndex === -1) return;

    setCompleted(stageList.map((_, idx) => idx <= stageIndex));
    setActiveStep(
      stageIndex < stageList.length ? stageIndex + 1 : stageIndex
    );
  };
  const batchQRCoderef=useRef<HTMLInputElement>(null);
  const fetchPlan=(batchQRCode:string)=>{
      if (!batchQRCode) {
          console.warn("No BatchQRCode entered");
          return;
      }
        const str = batchQRCode
        const index = str.indexOf("B");      // find position of ":"
        let batchId = str.substring(index + 1);
        const batchIdNum = parseInt(batchId, 10);
        
      getData<BatchInstance>(
              `productions/batches/${batchIdNum}/`,
              ip,
              {},
              {},
              (result1:BatchInstance) => {
                  const routes=result1.planning.route_steps
                  const newStages: string[] = [];
                  const routeData=routes.sort((a:RouteSteps, b:RouteSteps) => a.sequence - b.sequence);
                  for (let i = 0; i < routeData.length; i++) {
                    const stage = routeData[i].stage.toUpperCase();
                    newStages.push(`${stage} IN`);
                    newStages.push(`${stage} CLOSED`);
                  }
                  console.log(batchIdNum)
                  setStages(newStages);
                  const proRes=result1
                  const showRes={
                    // "BatchQRCode":batchQRCode
                    BatchQRCode:batchQRCode,
                    MPO:proRes.mpo,
                    Buyer:proRes.batch_bundles[0].received.buyer,
                    Style:proRes.batch_bundles[0].received.style,
                    Size:proRes.size,
                    Color:proRes.color,
                    Total_Quantity:proRes.total_quantity,
                    Shades:""

                  }
                  let shadeStr=""
                  let shadeStrSet=new Set();
                  for(let i=0;i<proRes.batch_bundles.length;i++){
                      const obj=proRes.batch_bundles[i]
                      if(!shadeStrSet.has(obj.received.shade)){
                        shadeStr+=obj.received.shade
                        shadeStrSet.add(obj.received.shade)
                      }
                         
                  }
                  let tempStr=""
                  for(let i=0;i<shadeStr.length;i++){
                    tempStr+=shadeStr[i]
                    if(i!=shadeStr.length-1){
                        tempStr+=','
                      }
                  }
                  showRes.Shades=tempStr
                  setScanned(showRes)
                  const payload={
                      batch:batchIdNum,
                      current_stage:"Laser Brush",
                      current_status:"in"
                    }
                  
                  postData<BatchStage>(
                      `productions/batch-stages/`,
                       ip,
                      payload,
                      (postresult:BatchStage)=>{
                          const currStage = `${postresult.current_stage} ${postresult.current_status}`;
                                markCompletedUntil(currStage, newStages);
                            getData<BatchStage>(
                              `productions/batch-stages/${batchIdNum}/`,
                              ip,
                              {},
                              (subresult: BatchStage) => {
                                const currStage = `${subresult.current_stage} ${subresult.current_status}`;
                                markCompletedUntil(currStage, newStages);
                                
                              },
                              (error:any)=>{
                                console.log('Get Error ',error.response.data)
                                setErrorLog(error.response.data[0])
                              }
                            );
                      },
                      (error:any)=>{
                            console.log('Error',error.response.data)
                            getData<BatchStage>(
                                `productions/batch-stages/${batchIdNum}/`,
                                ip,
                                {},
                                {},
                                (subresult: BatchStage) => {
                                    const currStage =
                                    `${subresult.current_stage} ${subresult.current_status}`.toUpperCase();

                                    const stageIndex = newStages.findIndex(
                                    stage => stage.toUpperCase() === currStage
                                    );

                                    if (stageIndex === -1) return;

                                    setCompleted(newStages.map((_, idx) => idx <= stageIndex));
                                    setActiveStep(
                                    stageIndex < newStages.length - 1 ? stageIndex + 1 : stageIndex
                                    );
                                }
                            )
                            setErrorLog(error.response.data[0])
                      }
                    )
                  
              },
              (error:any) => {
                  console.error("Error in second API:", error.response.data[0]);
              }
          );
          const stageClosedMap = new Map();
          
          getData<BatchStageHistory[]>(
                `productions/batch-stage-history/`,
                ip,
                {},
                {batch:batchIdNum},
                (stageRes:BatchStageHistory[])=>{
                    for(const obj of stageRes){
                      if(obj.closed_by!=null){
                        stageClosedMap.set(obj.stage,true)
                      }
                    }
                     getData<RejectionReason[]>(
                        `productions/rejections/`,
                        ip,
                        {},
                        {},
                        (res:RejectionReason[])=>{
                          let temp=0
                          for(const obj of res){
                            if(obj.batch==batchIdNum && stageClosedMap.has(obj.stage))
                                temp++;
                          }
                          console.log('total_rej',temp)
                          setFinalRejCnt(temp)
                        }
                    )
                }
          )
       
  }
  

  const handleComplete = (index: number) => {

      const newCompleted = [...completed];
      newCompleted[index] = true;
      setCompleted(newCompleted);

      if (index < stages.length - 1) {
        setActiveStep(index + 1);
      }
  };

  return (
      <Box sx={{ width: '100%', mx: 'auto' }}>
        {/* TextField for QR Scan */}
        <TextField
          label="Scan Batch QRCode Here"
          fullWidth
          autoFocus
          inputRef={batchQRCoderef}
          onChange={() => {
              const batchQRCode = batchQRCoderef.current?.value.trim() || "";
              if(batchQRCode.length==14){
                fetchPlan(batchQRCode);
                batchQRCoderef.current!.value = "";
                    // barcodeRef.current!.value = ""}
              }
          }}
          sx={{
            // position:"sticky",
            // mt:5,
            mb: 5,
            width:500,
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
          }}
        />

        {/* Stepper */}
        {stages.length>0 &&(
            <Stepper activeStep={activeStep} orientation="horizontal"
              sx={{
                    maxWidth: 900,
                  }}
            >
            {stages.map((label, index) => {
              const stepProps: { completed?: boolean; disabled?: boolean } = {};
              stepProps.completed = completed[index];
              stepProps.disabled = index !== activeStep;

              return (
                <Step key={label} {...stepProps}
                  sx={{
                    maxWidth: 600,
                  }}
                  >
                  <StepLabel
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      maxWidth: 600, // max width for wrapping
                      py: 1,
                      "& .MuiStepIcon-root.Mui-completed": {
                          color: "green",
                        },

                        // (optional) active step color
                        "& .MuiStepIcon-root.Mui-active": {
                          color: "blue",
                        },
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 14,
                        // whiteSpace: 'normal',   // allow wrapping
                        // wordBreak: 'break-word', // break long words
                      }}
                    >
                      <b>{label}</b>
                    </Typography>

                  </StepLabel>
                </Step>
              );
            })}
          </Stepper>
        ) }
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
              <Typography variant="h6">{errorLog}</Typography>
              {/* <Typography>Already batches are allocated according to this plan */}
              {/* </Typography> */}
              <Button sx={{ mt: 2 }} onClick={() => setErrorLog('')}>Close</Button>
              </Box>
          </Box>
      </Modal>
        {/* Finished message */}
        {completed.length>0 && completed.every(Boolean) && (
          <Typography sx={{ mt: 2, mb: 1, color: 'green' }}>
            ✅ All steps completed - you're finished
          </Typography>
        )}
        {scanned!=null&&(
              <TableContainer
                  component={Paper}
                  elevation={0}
                  sx={{
                    // maxHeight: 200,          // vertical scrollbar
                    overflowX: "auto",       // horizontal scrollbar
                    overflowY: "auto",
                    border:'none',
                    // marginLeft:'200px',
                    maxWidth:1100
                  }}
               >
                  <Table
                    stickyHeader
                    sx={{ '& .MuiTableCell-root':{
                borderBottom:'none'
            }}}   // force horizontal scroll if screen is smaller
                    aria-label="customized table"
                  >
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>BatchQRCode</StyledTableCell>
                      <StyledTableCell align="center">MPO</StyledTableCell>
                      <StyledTableCell align="center">Buyer</StyledTableCell>
                      <StyledTableCell align="center">Style</StyledTableCell>
                      <StyledTableCell align="center">Size</StyledTableCell>
                      <StyledTableCell align="center">Shades</StyledTableCell>
                      <StyledTableCell align="center">Color</StyledTableCell>
                      <StyledTableCell align="center">Total Quantity</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                      <StyledTableRow >
                        <StyledTableCell component="th" scope="row">
                          {scanned.BatchQRCode}
                        </StyledTableCell>
                       <StyledTableCell align="center">{scanned.MPO}</StyledTableCell>
                       <StyledTableCell align="center">{scanned.Buyer}</StyledTableCell>
                       <StyledTableCell align="center">{scanned.Style}</StyledTableCell>
                       <StyledTableCell align="center">{scanned.Size}</StyledTableCell>
                       <StyledTableCell align="center">{scanned.Shades}</StyledTableCell>
                       <StyledTableCell align="center">{scanned.Color}</StyledTableCell>
                       <StyledTableCell align="center">{scanned.Total_Quantity-finalrejcnt}</StyledTableCell>
                      </StyledTableRow>
                  </TableBody>
                </Table>
            </TableContainer>
        )}
    </Box>
  );
}