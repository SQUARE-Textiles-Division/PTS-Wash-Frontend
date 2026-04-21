import {
  Box,
  Button,
  Menu,
  MenuItem,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  Modal
} from "@mui/material";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useRef, useState, useMemo } from "react";
import { getData,postData,patchData } from "./genericApiService";
import type Planning from '../TypeAnnotations/BatchInstance'
import type RouteSteps from "../TypeAnnotations/BatchInstance";
import React from "react";
import { ip, ptsip } from "../ip";


const ALL_STAGES = [
  "Whisker",
  "Laser Whisker",
  "Brush",
  "Laser Brush",
  "Wrinkle",
  "Tag",
  "Tie"
];

export default function PlanningComponent() {
  const [saved,setSaved]=useState(false)
  const [alarm,setAlarm]=useState(false)
  const mpoRef = useRef<HTMLInputElement>(null);
  const [mpoNo,setMpoNo]=useState<string>('')
  const [buyer,setBuyer]=useState<string>('')
  const [style,setStyle]=useState<string>('')
  const [mpoExists, setMpoExists] = useState<boolean | null>(null);
  const [selectedStages, setSelectedStages] = useState<string[]>([]);
  const [addAnchorEl, setAddAnchorEl] = useState<HTMLElement | null>(null);
  const [editAnchorEl, setEditAnchorEl] = useState<HTMLElement | null>(null);
  const [stageBeingEdited, setStageBeingEdited] = useState<string | null>(null);
  const [alreadyInPlan,setAlreadyInPlan]=useState<number>(0);
  const [activeStep, setActiveStep] = React.useState(0);
  const [deleteMsg,setDeleteMsg]=useState(false)
  const [deleteStage,setDeleteStage]=useState<string>('')

  /* ------------------ DERIVED AVAILABLE STAGES ------------------ */
  // stages available to ADD
  const availableStagesToAdd = useMemo(
    () => ALL_STAGES.filter((stage) => !selectedStages.includes(stage)),
    [selectedStages]
  );

  // stages available to REPLACE (exclude all selected except the one being edited)
//   const availableStagesToEdit = useMemo(
//     () =>
//       ALL_STAGES.filter(
//         (stage) =>
//           !selectedStages.includes(stage) || stage === stageBeingEdited
//       ),
//     [selectedStages, stageBeingEdited]
//   );
  const availableStagesToEdit=ALL_STAGES
  /* ------------------ MPO CHECK ------------------ */
 const fetchMpo = (mpo: string) => {
  if (!mpo) {
    setMpoExists(null);
    setSelectedStages([]);
    setAlreadyInPlan(0);
    return;
  }

  // RESET before new request
  setMpoExists(null);
  setAlreadyInPlan(0);
  setSelectedStages([]);

  getData<{ data_found: boolean ,buyer:string,style:string}>(
    `pp/${mpo}`,
    ptsip,
    {},
    {},
    (res) => {
      if (!res.data_found) {
        setMpoExists(false);
        return;
      }

      // MPO EXISTS
      setMpoExists(true);
      setMpoNo(mpo);
      setBuyer(res.buyer)
      setStyle(res.style)

      // 🔥 SECOND REQUEST (chained safely)
      getData<Planning>(
        `productions/plannings`,
        ip,
        {},
        { search: mpo },
        (planning:any) => {
          if (!planning) return;

          setAlreadyInPlan(planning[0].id);
          console.log(planning[0].id)
          const routes=planning[0].route_steps
          const newStages: string[] = [];
          const routeData=routes.sort((a:RouteSteps, b:RouteSteps) => a.sequence - b.sequence);
          for (let i = 0; i < routeData.length; i++) {
            const stage = routeData[i].stage  
            newStages.push(`${stage}`);
            // newStages.push(`${stage} CLOSE`);
          }

          setSelectedStages(newStages);
        },
        (error:any) => {
          console.error("Planning fetch error:", error);
        }
      );
    },
    (error) => {
      console.error("MPO check error:", error);
      setMpoExists(false);
    }
  );
};

  /* ------------------ ADD STAGE ------------------ */
  const handleAddStage = (stage: string) => {
    setSelectedStages((prev) => [...prev, stage]);
    setAddAnchorEl(null);
    setActiveStep(prev => {
      const nextStep = prev + 1;
      return nextStep < selectedStages.length ? nextStep : selectedStages.length - 1;
  })
}

  /* ------------------ EDIT STAGE ------------------ */
  const handleStepClick = (
    event: React.MouseEvent<HTMLElement>,
    stage: string
  ) => {
    setStageBeingEdited(stage);
    setEditAnchorEl(event.currentTarget);
  };

const handleReplaceStage = (newStage: string) => {
  if (!stageBeingEdited) return;

  setSelectedStages((prev) => {
    const indexBeingEdited = prev.indexOf(stageBeingEdited);
    const indexOfNew = prev.indexOf(newStage);

    // If newStage is already in Stepper, swap positions
    if (indexOfNew !== -1 && indexOfNew !== indexBeingEdited) {
      const newArray = [...prev];
      newArray[indexBeingEdited] = newStage;
      newArray[indexOfNew] = stageBeingEdited; // swap
      return newArray;
    }

    // If newStage is not in Stepper, just replace
    return prev.map((s) => (s === stageBeingEdited ? newStage : s));
  });

  setStageBeingEdited(null);
  setEditAnchorEl(null);
};
 const handleDelete = (stageToDelete: string) => {
    setSelectedStages((prev) => prev.filter((stage) => stage !== stageToDelete));
    setDeleteStage('');
    setDeleteMsg(false);
  };
  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: "auto",
        // mt: 4,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {/* MPO INPUT */}
      <TextField
        label="Enter MPO"
        style={{position:'fixed',top:80,left:300}}
        inputRef={mpoRef}
        autoFocus
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            const mpo = mpoRef.current?.value.trim() || "";
            fetchMpo(mpo);
            mpoRef.current!.value = "";
          }
        }}
        sx={{
          width: 220,
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
              height: 40, // total height
          },
        }}
      />

      {mpoExists === false && (
        <Typography sx={{position:'fixed',top:120,left:300}} color="error">❌ MPO does not exist</Typography>
      )}
      {mpoExists === true && (
        <>
           <Typography sx={{
            fontWeight:'bold',
            position:'fixed',
            textAlign:'center',
            top:120,
            left:300
           }}>MPO - {mpoNo},    Buyer - {buyer},     Style - {style} </Typography>
          <Typography color="green" sx={{position:'fixed',
            top:150,left:400}}>✅ MPO exists</Typography>
        </>
       
      )}

      {/* MAIN CONTENT */}
      {mpoExists && (
        <>
          {/* ADD BUTTON */}
      <Button
          variant="contained"
          onClick={(e) => {
            setAddAnchorEl(e.currentTarget);
            // setActiveStep((prev) => prev + 1);
          }}
          disabled={availableStagesToAdd.length === 0}
          sx={{ width: 150,position:'fixed',top:200,left:300 }}
        >
            + Add Stage
          </Button>

          {/* ADD MENU */}
          <Menu
            anchorEl={addAnchorEl}
            open={Boolean(addAnchorEl)}
            onClose={() => setAddAnchorEl(null)}
          >
            {availableStagesToAdd.map((stage) => (
              <MenuItem key={stage} onClick={() => handleAddStage(stage)}>
                {stage}
              </MenuItem>
            ))}
          </Menu>
          
          {/* {mpoExists &&(

          )} */}


          {/* STEPPER */}
          {/* {alreadyInPlan &&(

          )} */}
         {selectedStages.length > 0 && (
              <Stepper activeStep={activeStep} nonLinear={true} sx={{position:'fixed',top:250,left:300, width: 990 }}>
              {selectedStages.map((stage) => (
                <Step key={stage} completed={false} disabled={false}>
                  <StepLabel
                    onClick={(e) => handleStepClick(e, stage)}
                    sx={{
                      cursor: "pointer",
                      userSelect: "none",
                      "&:hover": { color: "#1976d2" },
                      color: "inherit", // prevent MUI from graying it out
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 14,
                        whiteSpace: "normal",
                        wordBreak: "break-word",
                        fontWeight: "bold",
                        display:'flex',
                        gap:1,
                      }}
                    >
                      {stage.toUpperCase()}
                      <DeleteForeverIcon
                        color='error' 
                        fontSize='medium'
                        onClick={(e)=>{ e.stopPropagation();setDeleteMsg(true);setDeleteStage(stage)}}
                      ></DeleteForeverIcon>
                    </Typography>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>

            )}


          {/* EDIT MENU */}
          <Menu
            anchorEl={editAnchorEl}
            open={Boolean(editAnchorEl)}
            onClose={() => setEditAnchorEl(null)}
          >
            {availableStagesToEdit.map((option) => (
              <MenuItem
                key={option}
                onClick={() => handleReplaceStage(option)}
              >
                {option}
              </MenuItem>
            ))}
          </Menu>
        </>
      )}

      {alreadyInPlan===0 && selectedStages.length>0 &&(
        <Button variant="contained"
            onClick={()=>
                postData<Planning>(
                    `productions/plannings/`,
                    ip,
                    {
                        mpo:mpoNo,
                        stages:selectedStages
                    },
                    (result)=>{
                        console.log(result)
                        setAlreadyInPlan(result.id)
                        setSaved(true)
                    },
                    (error:any)=>{
                        console.log(error.response.data.mpo)
                        if(error){

                            patchData<Planning>(
                              // 'prod'
                              `productions/plannings/${alreadyInPlan}/`,
                              ip,
                              {stages:selectedStages},
                              (success:any)=>{
                                  console.log(success)
                                  
                              },
                              (error:any)=>{
                                setAlarm(true)
                              }
                            )
                            // patchData<>(

                            // )
                        }
                        //     patchData()
                        // }
                    }

                )
            }
            // disabled={availableStagesToAdd.length === 0}
            sx={{ width: 100,mt:10 ,background: "#485e68"}}>
            Save
        </Button>
      )}

      {alreadyInPlan!=0 && selectedStages.length>0 &&(
        <Button variant="contained"
            onClick={()=>
                // console.log(alreadyInPlan)
                // console.log(alreadyInPlan),
                patchData<Planning>(
                    `productions/plannings/${alreadyInPlan}/`,
                    ip,
                    {
                        mpo:mpoNo,
                        stages:selectedStages
                    },
                    (result)=>{
                        console.log(result)
                        setSaved(true)
                    },
                    (error:any)=>{
                        
                      
                          setAlarm(true)
                        
                        //     patchData()
                        // }
                    }

                )
            }
            // disabled={availableStagesToAdd.length === 0}
            sx={{ width: 100,mt:10
             ,background: "#485e68"}}>
            Save
        </Button>
      )}

      <Modal open={deleteMsg} onClose={() => setDeleteMsg(false)}>
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
                      color: "#9c9999", // red text for error
                      width: 400,
                  }}
                >
                <Typography variant="h4">Are you Sure?</Typography>
                  <Typography variant="h6">Delete <b>{deleteStage.toUpperCase()}</b> Stage from the Plan?
                  </Typography>
              {/* <Typography>Already batches are allocated according to this plan */}
              {/* </Typography> */}
              <div style={{
                display:'flex',
                justifyContent:'space-between'
              }}>
                  <Button sx={{ mt: 2 ,background:'red',color:'white'}}
                      onClick={()=>handleDelete(deleteStage)}>Delete</Button>
                   <Button sx={{ mt: 2 ,background:'green',color:'white'}} onClick={() => setDeleteMsg(false)}>Cancel</Button>
              </div>
              
              </Box>
          </Box>
      </Modal>


      <Modal open={saved} onClose={() => setSaved(false)}>
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
              <Typography variant="h6">Sucessfully {alreadyInPlan==0?'Saved':'Edited'}</Typography>
              {/* <Typography>Already batches are allocated according to this plan */}
              {/* </Typography> */}
              <Button sx={{ mt: 2 }} onClick={() => setSaved(false)}>Close</Button>
              </Box>
          </Box>
      </Modal>
        <Modal open={alarm} onClose={() => setAlarm(false)}>
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
              <Typography variant="h6">Edit is Not Allowed</Typography>
              <Typography>Already batches are allocated according to this plan
              </Typography>
              <Button sx={{ mt: 2 }} onClick={() => setAlarm(false)}>Close</Button>
              </Box>
          </Box>
      </Modal>
    </Box>
  );
}
