import { useEffect, useMemo, useState } from "react"
// import { getData, postData } from "./genericApiService"
import { useApiService } from "./genericApiService";
import { Box, Button, FormControl, InputLabel, Menu, MenuItem, Modal, Select, Step, StepLabel, Stepper, Typography } from "@mui/material"
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ProcessRouteBuilder, { type ProcessNode, type ProcessType, type SubProcessType } from "./MasterRoutingStyling";
import type MasterRoute from "../TypeAnnotations/MasterRoute";
import { ip, ptsip } from "../ip";

const ALL_STAGES = [
  "Dry Process",
  "Wet Process",
];


interface Buyer{
    buyers:string
}
interface Style{
    style:{
        style_no:string,
        style_desc:string
    }[]
    
}
interface Color{
    colors:string
}

export function MasterRouting(){
    const {getData,postData}=useApiService()
    const [errorMsg,setErrorMsg]=useState<string>("")
    const [saved,setSaved]=useState(false)
    const [routes, setRoutes] = useState<ProcessNode[]>([])
    const [addAnchorEl, setAddAnchorEl] = useState<HTMLElement | null>(null);
    const [editAnchorEl, setEditAnchorEl] = useState<HTMLElement | null>(null);
    const [stageBeingEdited, setStageBeingEdited] = useState<string | null>(null);
    const [alreadyInPlan,setAlreadyInPlan]=useState<number>(0);
    const [activeStep, setActiveStep] = useState(0);
    const [deleteMsg,setDeleteMsg]=useState(false)
      const [deleteStage,setDeleteStage]=useState<string>('')
   
    const [buyers,setBuyers]=useState<string[]>([])
    const [colors,setColors]=useState<string[]>([])
    const [styles,setStyles]=useState<{
        style_no:string,
        style_desc:string
    }[]>([])
    const [selectedBuyer,setSelectedBuyer]=useState<string>("")
    const [selectedStyle,setSelectedStyle]=useState<string>("")
    const [selectedColor,setSelectedColor]=useState<string>("")
    const wetProcessOptions = ["First Wash", "Second Wash", "Acid Wash"];
    const [subAddAnchorEl, setSubAddAnchorEl] = useState<null | HTMLElement>(null);
    const [parentStage, setParentStage] = useState<string>("");
    const [subEditAnchorEl, setSubEditAnchorEl] = useState<null | HTMLElement>(null);
    const [editParentStage, setEditParentStage] = useState<string>("");
    const generateId = () => Math.random().toString(36).substr(2, 9)
    useEffect(() => {
        if (routes?.length > 0) {
            console.log(routes)
        }
    }, [routes])
    const fetchBuyers=()=>{
        getData<Buyer>(
            `washing/get_buyers/`,
            ptsip,
            {},
            {},
            (res:Buyer)=>{
                let temp=[]
                for(const obj of res.buyers){
                    temp.push(obj)
                }
                setBuyers(temp)
            },
         )
    }

    const fetchStyles=(buyer:string)=>{
        getData<Style>(
            `washing/get_styles/`,
            ptsip,
            {},
            {buyer:buyer},
            (res:Style)=>{
                console.log(buyer)
                let temp=[]
                for(const obj of res.style){
                    temp.push(obj)
                }
                setStyles(temp)
            },
         )
    }

     const fetchColors=(buyer:string,style:string)=>{
        getData<Color>(
            `washing/get_colorAssociated/`,
            ptsip,
            {},
            {buyer:buyer,style:style},
            (res:Color)=>{
                console.log(buyer)
                let temp=[]
                for(const obj of res.colors){
                    temp.push(obj)
                }
                setColors(temp)
            },
         )
    }
    const fetchRoute=(buyer:string,style:string,color:string)=>{
        getData<MasterRoute[]>(
            `common/master-plans/`,
            ip,
            {},
            {buyer:buyer,style:style,color:color},
            (res:MasterRoute[])=>{
                console.log(res)
                
                // console.log()
                let newRoutes:any=[]
                // console.log('Routing Set ',newRoutes)
                // console.log(typeof(res[0].route_steps))
                for(const route of res[0].route_steps){
                    console.log('Ehy ',route)
                    let routeSub=[]
                    //
                    for(const sub of route.sub_steps){
                        routeSub.push({
                            id:generateId(),
                            type: sub.stage as SubProcessType,
                        })
                    }
                    newRoutes.push({
                        id: generateId(),
                        type: route.stage as ProcessType, // ✅ cast
                        subProcesses: routeSub,
                    })
                }
                console.log('Routing Set ',newRoutes)
                setRoutes(newRoutes)  
            },
            (error:any)=>{
                setRoutes([])
            }
         )
    }

    useEffect(() => {
        fetchBuyers();
    }, []);

    // 👉 run when buyer changes
    useEffect(() => {
        if(selectedBuyer!="")
            fetchStyles(selectedBuyer);
    }, [selectedBuyer]);

     useEffect(() => {
        if(selectedBuyer!="" && selectedStyle!="")
            fetchColors(selectedBuyer,selectedStyle);
    }, [selectedBuyer,selectedStyle]);

    useEffect(() => {
        if(selectedBuyer!="" && selectedStyle!="" && selectedColor!="")
            fetchRoute(selectedBuyer,selectedStyle,selectedColor);
    }, [selectedBuyer,selectedStyle,selectedColor]);
    // fetchStyles(selectedBuyer)
    return(
        <div style={{
            display:'flex',
            flexDirection:'column',
            position:'fixed'
        }}>
            <div
                style={
                    {
                        position:'fixed',
                        top:80,
                        left:300,
                        display:'flex',
                        gap:10
                    }
                }
            >   
                <FormControl style={{
                    width:'150px'
                }}>
                            <InputLabel id="demo-simple-select-label">Buyer</InputLabel>
                            <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            // value={age}
                            label="Buyer"
                            onChange={(e) => setSelectedBuyer(e.target.value as string)}
                            >
                            
                            {buyers.map((buyer) => (
                                <MenuItem key={buyer} value={buyer}>{buyer}</MenuItem>
                            ))}
                            </Select>
                </FormControl>
                <FormControl style={{
                    width:'150px'
                }}>
                            <InputLabel id="demo-simple-select-label">Style</InputLabel>
                            <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            // value={age}
                            label="Style"
                            onChange={(e) => setSelectedStyle(e.target.value as string)}
                            >
                            
                            {styles.map((style) => (
                                <MenuItem key={style.style_no} value={style.style_no}>{style.style_no} - {style.style_desc}</MenuItem>
                            ))}
                            </Select>
                </FormControl>
                <FormControl style={{
                    width:'150px'
                }}>
                            <InputLabel id="demo-simple-select-label">Color</InputLabel>
                            <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            // value={age}
                            label="Color"
                            onChange={(e) => setSelectedColor(e.target.value as string)}
                            >
                            
                            {colors.map((color) => (
                                <MenuItem key={color} value={color}>{color}</MenuItem>
                            ))}
                            </Select>
                </FormControl>
                <Button variant="contained" 
                        onClick={()=>
                        {
                            const toSaveRoutes=[]
                            for(const route of routes){
                                // console.log(route.type)
                                let saveObj=
                                {
                                    'stage':route.type,
                                    'sub_steps':[] as any
                                }
                                
                                if(route.subProcesses.length>0){
                                    for(const sub of route.subProcesses){
                                        saveObj.sub_steps.push({
                                            'stage':sub.type
                                        })
                                    }
                                }
                                toSaveRoutes.push(saveObj)
                               
                            }
                            let payload={
                                'buyer':selectedBuyer,
                                'style':selectedStyle,
                                'color':selectedColor,
                                'route_steps':toSaveRoutes
                            }
                            postData<MasterRoute[]>(
                                `common/master-plans/`,
                                ip,
                                payload,
                                (sucessRoute:MasterRoute[])=>{
                                    setSaved(true)
                                    console.log(sucessRoute)
                                },
                                (error:any)=>{
                                    console.log(error.response.data.non_field_errors[0])
                                    setErrorMsg(error.response.data.non_field_errors[0])
                                }
                            )
                                // setSaved(true)
                            // console.log(toSaveRoutes)
                        }}
                        sx={{
                            position:'fixed',
                            top:100,
                            left:1240,
                            backgroundColor: "#485e68",
                            '&:hover': {
                                backgroundColor: '#37474f',
                            },
                        }}>Save</Button>
            </div>
            <div>
                     {/* <Button
                        variant="contained"
                        onClick={(e) => {
                            setAddAnchorEl(e.currentTarget);
                            // setActiveStep((prev) => prev + 1);
                        }}
                        disabled={!selectedBuyer || !selectedStyle || !selectedColor}
                        sx={{
                            position:'fixed',
                            top:150,
                            left:300
                        }}
                        // sx={{ width: 150 }}
                        >
                            + Add Route
                        </Button> */}

                        {/* ADD MENU */}
                        {/* <Menu
                            anchorEl={addAnchorEl}
                            open={Boolean(addAnchorEl)}
                            onClose={() => setAddAnchorEl(null)}
                        >
                            {availableStagesToAdd.map((stage) => (
                            <MenuItem key={stage} onClick={(e) => {
                                if (stage === "Wet Process") {
                                    setParentStage(stage);
                                    setSubAddAnchorEl(e.currentTarget);
                                } 
                            else {
                                handleAddStage(stage);
                                setAddAnchorEl(null);
                            }}}>
                                {stage}
                            </MenuItem>
                            ))}
                        </Menu> */}
                        {/* <Menu
                                anchorEl={subAddAnchorEl}
                                open={Boolean(subAddAnchorEl)}
                                onClose={() => setSubAddAnchorEl(null)}
                            >
                                {wetProcessOptions.map((option) => (
                                    <MenuItem
                                        key={option}
                                        onClick={() => {
                                            handleAddStage(`${parentStage} - ${option}`);
                                            setSubAddAnchorEl(null);
                                            setAddAnchorEl(null);
                                        }}
                                    >
                                        {option}
                                    </MenuItem>
                                ))}
                            </Menu> */}
                        {/* {mpoExists &&(

                        )} */}

                        <ProcessRouteBuilder buyer={selectedBuyer} style={selectedStyle} color={selectedColor} routes={routes} setRoutes={setRoutes}/>
                        {/* STEPPER */}
                        {/* {alreadyInPlan &&(

                        )} */}

                     {/* <div style={{ position:'fixed',display: "flex", flexDirection: "column", gap: "20px", top: 200, left:300 }}> */}
                            
                            {/* Main Stepper */}
                            {/* <Stepper activeStep={activeStep} alternativeLabel>
                                {selectedStages.map((stage, index) => {
                                const isWet = stage.toLowerCase().startsWith("wet process");

                                return (
                                    <Step key={stage + index} completed={false}>
                                    <StepLabel
                                        onClick={(e) => handleStepClick(e, stage)}
                                        sx={{ cursor: "pointer", "&:hover": { color: "#1976d2" } }}
                                    >
                                        <Typography sx={{ fontWeight: "bold" }}>
                                        {isWet
                                            ? stage.replace("Wet Process - ", "").toUpperCase()
                                            : stage.toUpperCase()}
                                        </Typography>
                                    </StepLabel>
                                    </Step>
                                );
                                })}
                            </Stepper> */}

                            {/* Wet Process
                            {selectedStages.some((s) => s.startsWith("Wet Process")) && (
                                <div style={{ display: "flex", gap: "20px" }}>
                                
                                <Typography sx={{ fontWeight: "bold", minWidth: "120px" }}>
                                    WET PROCESS
                                </Typography>

                                <Stepper orientation="vertical">
                                    {selectedStages
                                    .filter((s) => s.startsWith("Wet Process"))
                                    .map((stage) => (
                                        <Step key={stage} completed={false}>
                                        <StepLabel onClick={(e) => handleStepClick(e, stage)}>
                                            {stage.replace("Wet Process - ", "").toUpperCase()}
                                        </StepLabel>
                                        </Step>
                                    ))}
                                </Stepper>
                                </div>
                            )} */}
                            {/* </div> */}



                                                    {/* {selectedStages.length > 0 && (
                            <Stepper activeStep={activeStep} nonLinear={false} style={{position:'fixed',top:250,left:300}}>
                                {selectedStages.map((stage) => (
                                    <Step key={stage} 
                                    completed={false} 
                                    // disabled={false}
                                    >
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
                            )} */}


                        {/* EDIT MENU */}
                        {/* <Menu
                            anchorEl={editAnchorEl}
                            open={Boolean(editAnchorEl)}
                            onClose={() => setEditAnchorEl(null)}
                        >
                            {availableStagesToEdit.map((option) => (
                                <MenuItem
                                    key={option}
                                    onClick={(e) => {
                                        // 👉 if Wet Process open sub-menu
                                        if (option === "Wet Process") {
                                            setEditParentStage(option);
                                            setSubEditAnchorEl(e.currentTarget);
                                        } else {
                                            handleReplaceStage(option);
                                            setEditAnchorEl(null);
                                        }
                                    }}
                                >
                                    {option}
                                </MenuItem>
                            ))}
                        </Menu> */}

                        {/* <Menu
                        anchorEl={subEditAnchorEl}
                        open={Boolean(subEditAnchorEl)}
                        onClose={() => setSubEditAnchorEl(null)}
                        >
                            {wetProcessOptions.map((sub) => (
                                <MenuItem
                                    key={sub}
                                    onClick={() => {
                                        handleReplaceStage(`${editParentStage} - ${sub}`);
                                        setSubEditAnchorEl(null);
                                        setEditAnchorEl(null);
                                    }}
                                >
                                    {sub}
                                </MenuItem>
                            ))}
                    //     </Menu> */}
                    
                 
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
                      
                                         border:'3px solid #e6db55', // light red background for error
                                    p: 4,
                                    borderRadius: 2,
                                    color: "black", // red text for error
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
                                   >Delete</Button>
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
                              <Typography variant="h6">Sucessfully Saved</Typography>
                              {/* <Typography>Already batches are allocated according to this plan */}
                              {/* </Typography> */}
                              <Button sx={{ mt: 2 }} onClick={() => setSaved(false)}>Close</Button>
                              </Box>
                          </Box>
                      </Modal>
                    <Modal open={errorMsg!=""} onClose={() => setErrorMsg("")}>
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
                                  color: "red", // red text for error
                                  width: 400,
                              }}
                              >
                              <Typography variant="h6">{errorMsg}</Typography>
                              {/* <Typography>Already batches are allocated according to this plan */}
                              {/* </Typography> */}
                              <Button sx={{ mt: 2 }} onClick={() => setErrorMsg("")}>Close</Button>
                              </Box>
                          </Box>
                      </Modal>


            </div>
        </div>
    )
   
}