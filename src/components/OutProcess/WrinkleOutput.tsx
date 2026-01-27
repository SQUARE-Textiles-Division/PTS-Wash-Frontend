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
import type Rejection from '../../TypeAnnotations/Rejection';
// import { postData } from './genericApiService';
// import Typography from '@mui/material/Typography';
export default function LaserWhiskerIn() {
  const [stages,setStages]=useState<string[]>([])
  const [activeStep, setActiveStep] = React.useState(0); // step that is currently clickable
  const [completed, setCompleted] = React.useState<boolean[]>(stages.map(() => false)); 
  const [errorLog,setErrorLog]=useState<string>('')
  const [rejCnt,setRejCnt]=useState<number>(-1)
  const [batchNum,setBatchNum]=useState<number>()
  // console.log(c,ompleted)
  // cos
  // useEffect(() => {
  //   setCompleted(stages.map(() => false));
  //   setActiveStep(0);
  // }, [stages])
  let batchIdNum=0
  const batchQRCoderef=useRef<HTMLInputElement>(null);
  const fetchPlan=(batchQRCode:string)=>{
      if (!batchQRCode) {
          console.warn("No BatchQRCode entered");
          return;
      }
        const str = batchQRCode
        const index = str.indexOf("B");      // find position of ":"
        let batchId = str.substring(index + 1);
        batchIdNum = parseInt(batchId, 10);
        setBatchNum(batchIdNum)
        
      getData<BatchInstance>(
              `productions/batches/${batchIdNum}/`,
              "http://172.26.2.94:8000",
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
                  const payload={
                      batch:batchIdNum,
                      current_stage:"Laser Whisker",
                      current_status:"in"
                    }
                  getData<BatchStage>(
                              `productions/batch-stages/${batchIdNum}/`,
                              "http://172.26.2.94:8000",
                              {},
                              {},
                              (subresult: BatchStage) => {
                                
                                const currStage =
                                  `${subresult.current_stage} ${subresult.current_status}`.toUpperCase();

                                const stageIndex = newStages.findIndex(
                                  stage => stage.toUpperCase() === currStage
                                );

                                if (stageIndex === -1) return;

                                console.log(currStage)

                                setCompleted(newStages.map((_, idx) => idx <= stageIndex));
                                setActiveStep(
                                  stageIndex < newStages.length - 1 ? stageIndex + 1 : stageIndex
                                );
                                
                              },
                              (error:any)=>{
                                console.log('Get Error ',error.response.data)
                                setErrorLog(error.response.data[0])
                              }
                );   
        },
        (error:any) => {
              console.error("Error in second API:", error.response.data[0]);
          }
      );
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
              if(batchQRCode.length==24){
                fetchPlan(batchQRCode);
                batchQRCoderef.current!.value = "";
                    // barcodeRef.current!.value = ""}
              }
          }}
          sx={{
            position:"sticky",
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
                    {label.includes('CLOSE')&&!stepProps.disabled&&(
                      <Button sx={{
                        background:'blue',
                        color:'white'
                      }}
                      onClick={() =>
                          getData<Rejection[]>(
                            "productions/qc-stage-summaries",
                            "http://172.26.2.94:8000",
                            {}, // ✅ data (GET ignores this, but required by signature)
                            {
                              batch: batchIdNum,
                              stage: "Wrinkle",
                            },
                            (rejres: Rejection[]) => {
                              setRejCnt(rejres.length==1?rejres[0].rejection_count:0);
                            },
                            (error: any) => {
                              console.log(error);
                            }
                          )
                        }
                      >
                        CLOSE
                    </Button>
                    )}
                     
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
                bgcolor: "rgba(0,0,0,0.5)", // dark overlay
              }}
          >
              <Box
              sx={{
                  bgcolor: "rgba(180, 11, 11, 0.92)", // light red background for error
                  p: 4,
                  borderRadius: 2,
                  color: "white", // red text for error
                  width: 400,
              }}
              >
                <Typography variant="h6">{errorLog}</Typography>
                {/* <Typography>Already batches are allocated according to this plan */}
                {/* </Typography> */}
                <Button sx={{ mt: 2 }} onClick={() => {setErrorLog('')
                  setRejCnt(-1)
                }}>Close</Button>
              </Box>
          </Box>
      </Modal>
      <Modal open={rejCnt!=-1} onClose={()=>setRejCnt(-1)}>
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
                  <Typography variant="h6">You have total {rejCnt} rejections in Wrinkle
                  </Typography>
                <div style={{
                  display:"flex",
                  // alignContent:'flex-end',
                  alignItems:'flex-end',
                  justifyContent:"space-between",
                  gap:'40px'
                }}>
                    <Button
                      sx={{ mt: 2 ,background:'blue',color:'white'}}
                      onClick={() =>{
                          
                        postData<BatchStage>(
                          'productions/batch-stages/',
                          'http://172.26.2.94:8000',
                          {
                            batch: batchNum,
                            current_stage: "Wrinkle",
                            current_status: "closed",
                          },
                          (closeRes: BatchStage) => {
                            console.log(closeRes)
                            const currStage = `${closeRes.current_stage} ${closeRes.current_status}`.toUpperCase();
                            const stageIndex = stages.findIndex(
                              stage => stage.toUpperCase() === currStage
                            );

                            if (stageIndex === -1) return;

                            setCompleted(stages.map((_, idx) => idx <= stageIndex));
                            setActiveStep(
                              stageIndex < stages.length - 1 ? stageIndex + 1 : stageIndex
                            );
                            setRejCnt(-1);
                          },
                          (error: any) => {
                            // console.log(batchIdNum)
                            console.log(error.response.data[0]);
                            setErrorLog(error.response.data[0]);
                          }
                        )
                      }}
                    >
                      Yes
                    </Button>
                  <Button sx={{ mt: 2 ,background:'red',color:'white'}} onClick={() => setRejCnt(-1)}>No</Button>
                </div>
                </Box>
          </Box>
        </Modal>
        {/* Finished message */}
        {completed.length>0 && completed.every(Boolean) && (
          <Typography sx={{ mt: 2, mb: 1, color: 'green' }}>
            ✅ All steps completed - you're finished
          </Typography>
        )}
    </Box>
  );
}