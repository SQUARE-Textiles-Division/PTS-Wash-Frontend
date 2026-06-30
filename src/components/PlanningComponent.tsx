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
  Modal,
  FormControl,
  InputLabel,
  Select
} from "@mui/material";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useRef, useState, useMemo } from "react";
// import { getData,postData,patchData } from "./genericApiService";
import { getDataPublic, useApiService } from "./genericApiService";
import type Planning from '../TypeAnnotations/BatchInstance'
import type RouteSteps from "../TypeAnnotations/RouteSteps";
import React from "react";
import { ip, ptsip } from "../ip";
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell, { tableCellClasses } from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TableRow from '@mui/material/TableRow';
// import Paper from '@mui/material/Paper';
import type { Color } from "./MasterRouting";
// import { styled } from '@mui/material/styles';
// import { tbCellColor, tbRowColor } from "./Colors/Colors";
// const ALL_STAGES = [
//   "Whisker",
//   "Laser Whisker",
//   "Brush",
//   "Laser Brush",
//   "Wrinkle",
//   "Tag",
//   "Tie"
// ];

  // const StyledTableCell = styled(TableCell)(({  }) => ({
  // [`&.${tableCellClasses.head}`]: {
  //     // backgroundColor: theme.palette.common.black,
  //     // backgroundColor: '#485e68',
  //     backgroundColor: tbCellColor,
  //     color: "white",
  //     lineHeight: 0.2 ,             // reduce text height
  //     // fontSize: 14,
        
  // },
  // [`&.${tableCellClasses.body}`]: {
  //       lineHeight: 0.1,   
  //     fontSize: 14,
  //     padding: "0px", 
  // },
  // }));

  // const StyledTableRow = styled(TableRow)(({  }) => ({
  // '&:nth-of-type(odd)': {
  //     backgroundColor: tbRowColor
  // },
  // // hide last border
  // '&:last-child td, &:last-child th': {
  //     border: 0,
  // },
  // }));

const ALL_STAGES = [
  "whisker",
  "laser_whisker",
  "brush",
  "laser_brush",
  "wrinkle",
  "tag",
  "tie"
]

// type Mpocolortype={
//   mpo:string,
//   buyer:string,
//   color:string,
//   style:string
// }
// type MpoColorDetails={
//   'data_found':boolean,
//   'details':Mpocolortype[]
// }
export default function PlanningComponent() {
  const [colors,setColors]=useState<string[]>([])
  const {getData,postData,patchData}=useApiService()
  const [selectedColor,setSelectedColor]=useState<string>("")
  const [saved,setSaved]=useState(false)
  const [alarm,setAlarm]=useState(false)
  const mpoRef = useRef<HTMLInputElement>(null);
  const [mpoNo,setMpoNo]=useState<string>('')
  // const [color,setColor]=useState<string>('')
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
  // const [mpoColorList,setMpoColorList]=useState<Mpocolortype[]>([])
  //  const [filters, setFilterss] = useState({
  //             buyer: "",
  //             color: "",
  //             mpo:"",
  //             style:"",
  //             so:""
  //         });

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
// useEffect(() => {
//   if (activeStep >= selectedStages.length) {
//     setActiveStep(1);
//   }
// }, [selectedStages]);
  /* ------------------ MPO CHECK ------------------ */
// useEffect(()=>{
//   fetchMpoColor()
// },[])


//  const fetchMpoColor=()=>{
//     getDataPublic<MpoColorDetails>(
//       `pp/mpo-color/`,
//       ptsip,
//       {},
//       {},
//       (res:MpoColorDetails)=>{
//         if(!res.data_found)
//           return
//         let details=[]
//         for(const obj of res['details']){
//             details.push({
//               'mpo':obj.mpo,
//               'color':obj.color,
//               'style':obj.style,
//               'buyer':obj.buyer
//             })
//         }
//         console.log(details)
//         setMpoColorList(details)
//       },
//       (err:any)=>{
//         console.log(err)
//       }
//     )
//  }
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

  getDataPublic<{ data_found: boolean ,buyer:string,style:string}>(
    `pp/${mpo}`,
    ptsip,
    {},
    {},
    (res) => {
      if (!res.data_found) {
        setMpoExists(false);
        setSelectedColor("")
        setAlreadyInPlan(0)
        return;
      }

      // MPO EXISTS
      setMpoExists(true);
      setMpoNo(mpo);
      setBuyer(res.buyer)
      setStyle(res.style)
      
      getDataPublic<Color>(
        `washing/get_mpocolorAssociated/`,
          ptsip,
          {},
          {mpo:mpo},
          (colorRes:Color)=>{
            // const resStyle = res.style.split("-")[0];
            setSelectedColor("")
            console.log('Colors Fetched',colorRes)
            let temp=[]
            for(const obj of colorRes.colors){
                console.log('Color  ',obj)
                temp.push(obj)
            }
            setColors(temp)
          
      

          // 🔥 SECOND REQUEST (chained safely)
         
        },
        (error) => {
          console.error("MPO check error:", error);
          setMpoExists(false);
        }
    );
  })
};

  /* ------------------ ADD STAGE ------------------ */
  const handleAddStage = (stage: string) => {
    console.log(activeStep)
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
      {mpoExists&&(

         <FormControl style={{
                    position:'fixed',
                    top:80,
                    width:'150px'
        }}>
                    <InputLabel id="demo-simple-select-label">Color</InputLabel>
                    <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    // value={selectedColor}
                    // value={age}
                    label="Color"
                    onChange={(e) => {
                      setSelectedColor(e.target.value as string)
                      // setAlreadyInPlan(0)
                       getData<Planning[]>(
                        `dry-process/plannings`,
                        ip,
                        {},
                        { mpo: mpoNo,color:e.target.value },
                        (planning:any) => {
                          console.log('Planned ',planning )
                          if (planning.length==0){
                            setSelectedStages([])
                            // setSelectedColor(e.target.value as string)
                            return;
                          } 

                          // setSelectedColor("")
                          setAlreadyInPlan(planning[0].id);
                          // setSelectedColor(planning.color)
                          // console.log(planning[0].id)
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

                    }}
                    >
                    
                    {colors.map((color) => (
                        <MenuItem key={color} value={color}>{color}</MenuItem>
                    ))}
                    </Select>
        </FormControl>



      )}
        
      {mpoExists === false && (
        <Typography sx={{position:'fixed',top:120,left:300}} color="error">❌ MPO does not exist</Typography>
      )}
      {mpoExists &&(
        <Typography color="green" sx={{position:'fixed',
            top:170,left:400}}>✅ MPO exists</Typography>
      )}

      {mpoExists && (alreadyInPlan !== 0 || selectedColor!="")&& (
        <>
           <Typography sx={{
            fontWeight:'bold',
            position:'fixed',
            textAlign:'center',
            top:150,
            left:300
           }}>MPO - {mpoNo},    Buyer - {buyer},  Color - {selectedColor},   Style - {style} </Typography>
          
        </>
       
      )}
   
      {/* MAIN CONTENT */}
      {mpoExists && selectedColor!="" &&(
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
                {stage.toUpperCase()}
              </MenuItem>
            ))}
          </Menu>
          
          {/* {mpoExists &&(

          )} */}


          {/* STEPPER */}
          {/* {alreadyInPlan &&(

          )} */}
         {selectedStages.length > 0 && (
              <Stepper  nonLinear={true} sx={{position:'fixed',top:250,left:300, width: 990 }}>
              {selectedStages.map((stage) => (
                <Step key={stage} active={true} completed={false} disabled={false}>
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
                    `dry-process/plannings/`,
                    ip,
                    {
                        mpo:mpoNo,
                        color:selectedColor,
                        stages:selectedStages
                    },
                    (result)=>{
                        console.log(result)
                        setAlreadyInPlan(result.id)
                        setSelectedColor(result.color)
                        setSaved(true)
                    },
                    (error:any)=>{
                        console.log(error.response.data.mpo)
                        if(error){

                            patchData<Planning>(
                              // 'prod'
                              `dry-process/plannings/${alreadyInPlan}/`,
                              ip,
                              {stages:selectedStages},
                              (success:any)=>{
                                  console.log(success)
                                  
                              },
                              (error:any)=>{
                                console.log(error)
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
            sx={{ width: 100,
                position:'fixed',
                top:80,
                left:1000,
            
                background: "#485e68"}}>
            Save
        </Button>
      )}

      {alreadyInPlan!=0 && selectedStages.length>0 &&(
        <Button variant="contained"
            onClick={()=>
                // console.log(alreadyInPlan)
                // console.log(alreadyInPlan),
                patchData<Planning>(
                    `dry-process/plannings/${alreadyInPlan}/`,
                    ip,
                    {
                        mpo:mpoNo,
                        color:selectedColor,
                        stages:selectedStages
                    },
                    (result)=>{
                        console.log(result)
                        setSaved(true)
                    },
                    (error:any)=>{
                        
                         console.log(error)
                          setAlarm(true)
                        
                        //     patchData()
                        // }
                    }

                )
            }
            // disabled={availableStagesToAdd.length === 0}
            sx={{ width: 100,position:'fixed',
                top:80,
                left:1000,
             background: "#485e68"}}>
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
                // bgcolor: "rgba(148, 131, 131, 0.5)", // dark overlay
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
