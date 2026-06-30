import * as React from 'react'
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Stack,
  StepContent,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import DeleteIcon from '@mui/icons-material/Delete'

export type ProcessType = 'Dry Process' | 'Wet Process' | 'After Wet Dry Process';
export type SubProcessType = 'First Wash' | 'Second Wash' | 'Acid Wash';

export interface SubProcessNode {
  id: string;
  type: SubProcessType;
}

export interface ProcessNode {
  id: string;
  type: ProcessType;
  subProcesses: SubProcessNode[];
}
interface Props {
    buyer:string,
    style:string,
    color:string,
    routes:ProcessNode[],
    setRoutes:React.Dispatch<React.SetStateAction<ProcessNode[]>>;
}
const generateId = () => Math.random().toString(36).substr(2, 9)

export default function ProcessRouteBuilder({buyer,style,color,routes,setRoutes}: Props) {
  // const [routes, setRoutes] = React.useState<ProcessNode[]>([])
  
  // Dialog State for Adding
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false)
   const [isSubAddDialogOpen, setIsSubAddDialogOpen] = React.useState(false)
  const [selectedMainType, setSelectedMainType] = React.useState<ProcessType | ''>('')
  const [seletectedSubAddMainIndex,setSelectedSubAddMainIndex]=React.useState<number>(-1)
  // const [seletectedSubAddSubIndex,setSelectedSubAddSubIndex]=React.useState<number>(-1)
  const [selectedSubType, setSelectedSubType] = React.useState<SubProcessType | ''>('')

  // Dialog State for Editing Main Step
  const [editStepId, setEditStepId] = React.useState<string | null>(null)
  const [editMainType, setEditMainType] = React.useState<ProcessType | ''>('')

  // Dialog State for Editing Sub Step
  const [editSubInfo, setEditSubInfo] = React.useState<{ mainIndex: number; subIndex: number } | null>(null)
  const [editSubType, setEditSubType] = React.useState<SubProcessType | ''>('')
 
  // console.log(routes)
  const handleAddOpen = () => {
    setSelectedMainType('')
    setSelectedSubType('')
    setIsAddDialogOpen(true)
  }
  const handleAddSubOpen= (routeType:ProcessType,mainIndex:number) =>{
    setSelectedMainType(routeType)
    setSelectedSubAddMainIndex(mainIndex)
    setSelectedSubType('')
    setIsSubAddDialogOpen(true)
  }
  const handleAddSubSubmit= (mainIndex:number)=>{
    let subfound=false
    for(const route of routes){
      let found=false
      for(const sub of route.subProcesses){
        if(sub.type==selectedSubType){
          subfound=true
          found=true
          break
        }
      }
      if(found)
        break
    }
    if(subfound){
      return
    }
    setRoutes((prev) => {
    const newRoutes = [...prev];

     const newSubProcess = selectedSubType 
        ? { id: generateId(), type: selectedSubType } 
        : null;

      if (newRoutes[mainIndex] != null && newSubProcess) {
        newRoutes[mainIndex] = {
          ...newRoutes[mainIndex],
          subProcesses: [
            ...newRoutes[mainIndex].subProcesses,
            newSubProcess,
          ],
        };
      }
        

      return newRoutes;
    });
    setIsSubAddDialogOpen(false)
  }
  const handleAddSubmit = () => {
    if (!selectedMainType) return
    // if(selectedMainType=='Wet Process' && selectedSubType=='')
    //   return
    
    if(selectedMainType==='After Wet Dry Process'){
      let ok=false
      for(const route of routes){
          if(route.type==='Wet Process'){
              ok=true
              break
          }
      }
      if(!ok)
      return
    }
    
    // let mainfound=false
    let subfound=false
    const mainMap=new Map<string,number>()
    let cnt=0
    // const subfound=new Map<string,number>()
    for(const route of routes){
        if(route.type==selectedMainType){
          // mainfound=true
          // break
          ++cnt
          mainMap.set(selectedMainType,cnt)
        }
    }
    for(const route of routes){
      let found=false
      for(const sub of route.subProcesses){
        if(sub.type==selectedSubType){
          subfound=true
          found=true
          break
        }
      }
      if(found)
        break
    }
    if(subfound){
      return
    }
   
    // if(mainfound && subfound){
    //   return
    // }
    // else if(mainfound && selectedSubType==''){
    //   // return
    //   if(mainMap.get(selectedMainType)==2)
    //       return
    // }
    // if()
    // else if(mainfound && !subfound){

    // }
    // let wetIndex=-1
    for(let i=routes.length-1;i>=0;i--){
      if(routes[i].type=='Wet Process' ){
          // wetIndex=i
          break
      }
    }
    setRoutes((prev) => {
      const newRoutes = [...prev]
      const newSubProcess = selectedSubType 
        ? { id: generateId(), type: selectedSubType } 
        : null

      // Group if last route is Wet and we are adding another Wet
      if (
        selectedMainType === 'Wet Process' && 
        newRoutes.length > 0 && 
        // wetIndex!=-1 &&
        newRoutes[newRoutes.length-1].type === 'Wet Process' &&
        newSubProcess
      ) {
        // FIX: Deep copy the last element's subProcesses array instead of mutating with push()
        const lastIndex = newRoutes.length - 1
        newRoutes[lastIndex] = {
          ...newRoutes[lastIndex],
          subProcesses: [...newRoutes[lastIndex].subProcesses, newSubProcess],
        }
      } 
      else if (
        selectedMainType === 'After Wet Dry Process' && 
        newRoutes.length > 0 && 
        // wetIndex!=-1 &&
        newRoutes[newRoutes.length-1].type === 'After Wet Dry Process' &&
        newSubProcess
      ) {
        // FIX: Deep copy the last element's subProcesses array instead of mutating with push()
        const lastIndex = newRoutes.length - 1
        newRoutes[lastIndex] = {
          ...newRoutes[lastIndex],
          subProcesses: [...newRoutes[lastIndex].subProcesses, newSubProcess],
        }
      } 
      else {
        // Create new horizontal step
        
        newRoutes.push({
          id: generateId(),
          type: selectedMainType,
          subProcesses: newSubProcess ? [newSubProcess] : [],
        })
      }
      return newRoutes
    })
    setIsAddDialogOpen(false)
  }

  const handleSwapMain = (index: number, direction: 'left' | 'right') => {
    // let ok=false
    // if(selectedMainType==='After Wet Dry Process'){
    //   for(const route of routes){
    //       if(route.type==='Wet Process'){
    //           ok=true
    //           break
    //       }
    //   }
    // }
    // if(!ok)
    //   return
    setRoutes((prev) => {
      const newRoutes = [...prev]
      const targetIndex = direction === 'left' ? index - 1 : index + 1
      if (targetIndex >= 0 && targetIndex < newRoutes.length) {
        const temp = newRoutes[index]
        newRoutes[index] = newRoutes[targetIndex]
        newRoutes[targetIndex] = temp
      }
      return newRoutes
    })
  }

  const handleDeleteMain = (index: number) => {
    
    // if(routes[index].type==='Wet Process'){
    //   let ok=true
    //   for(const route of routes){
    //       if(route.type==='After Wet Dry Process'){
    //           ok=false
    //           break
    //       }
    //   }
    //   if(!ok)
    //   return
    // }
    
    setRoutes((prev) => prev.filter((_, i) => i !== index))
  }

  // const handleOpenEditMain = (step: ProcessNode) => {
    
  //   setEditStepId(step.id)
  //   setEditMainType(step.type)
  // }

  const handleSaveEditMain = () => {
    setRoutes((prev) => 
      prev.map((r) => {
        if (r.id === editStepId) {
          // If changing from Wet to Dry, clear sub processes
          const subProcesses = editMainType === 'Dry Process' ? [] : r.subProcesses
          return { ...r, type: editMainType as ProcessType, subProcesses }
        }
        return r
      }),
    )
    setEditStepId(null)
  }

  const handleOpenEditSub = (mainIndex: number, subIndex: number, currentType: SubProcessType) => {
    console.log(mainIndex,' ',subIndex,' ',currentType)
    setEditSubInfo({ mainIndex, subIndex })
    setEditSubType(currentType)
  }

  const handleSaveEditSub = () => {
    if (!editSubInfo || !editSubType) return
    let subfound=false
    
    for(const route of routes){
      let found=false
      for(const sub of route.subProcesses ){
        console.log(sub.type,' ',editSubType)
        if(sub.type==editSubType){
           console.log(editSubType)
          found=true
          break
        }
      }
      if(found){
        subfound=true
        break
      }
    }
    if(subfound)
    {
     console.log(editSubType) 
      // setEditSubInfo(null)
      // setEditSubType('')
      return
    }
    setRoutes((prev) => {
      const newRoutes = JSON.parse(JSON.stringify(prev))
      newRoutes[editSubInfo.mainIndex].subProcesses[editSubInfo.subIndex].type = editSubType
      return newRoutes
    })
    setEditSubInfo(null)
  }

  const handleSwapSub = (mainIndex: number, subIndex: number, direction: 'up' | 'down') => {
    setRoutes((prev) => {
      const newRoutes = JSON.parse(JSON.stringify(prev)) // Deep clone for safety
      const subProcesses = newRoutes[mainIndex].subProcesses
      const targetIndex = direction === 'up' ? subIndex - 1 : subIndex + 1
      
      if (targetIndex >= 0 && targetIndex < subProcesses.length) {
        const temp = subProcesses[subIndex]
        subProcesses[subIndex] = subProcesses[targetIndex]
        subProcesses[targetIndex] = temp
      }
      return newRoutes
    })
  }

  const handleDeleteSub = (mainIndex: number, subIndex: number) => {
    setRoutes((prev) => {
      const newRoutes = JSON.parse(JSON.stringify(prev))
      newRoutes[mainIndex].subProcesses.splice(subIndex, 1)
      return newRoutes
    })
  }

  return (
    <Box sx={{ position:'fixed',top:150,left:300, height:10,width: '1000px', bgcolor: '#f5f5f5' }}>
      <Paper sx={{ p: 1,display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* <Typography variant="h5" fontWeight="bold">Process Route Configuration</Typography> */}
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={handleAddOpen}
          disabled={!buyer || !style || !color}
        >
          Add Route 
        </Button>
      </Paper>

      {routes.length === 0 ? (
        <Paper sx={{ p: 5, textAlign: 'center', color: 'text.secondary' }}>
          <Typography>No routes defined yet. Click "Add Route" to begin.</Typography>
        </Paper>
      ) : (
        <Box sx={{ width: '100%', overflowX: 'auto'}}>
          <Stepper alternativeLabel sx={{ alignItems: 'flex-start' }}>
            {routes.map((route, index) => (
              <Step key={route.id} active={true}>
                <StepLabel
                  StepIconComponent={() => (
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        bgcolor: route.type === 'Wet Process' ? 'primary.main' : 'secondary.main',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        zIndex: 1,
                      }}
                    >
                      {index + 1}
                    </Box>
                  )}
                >
                  <Stack alignItems="center" spacing={1}>
                    <Typography fontWeight="bold">{route.type}</Typography>
                    
                    {/* Main Step Controls */}
                    <Box sx={{ display: 'flex', gap: 0.5, bgcolor: 'background.paper', borderRadius: 1, boxShadow: 1 }}>
                      <Tooltip title="Move Left">
                        <span>
                          <IconButton size="small" onClick={() => handleSwapMain(index, 'left')} disabled={index === 0}>
                            <ArrowBackIosIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                      {
                          (route.type==='Wet Process' || route.type==='After Wet Dry Process') &&
                          ( 
                            <Tooltip title="Add Sub Process">
                                <IconButton size="small" color="primary" onClick={() => handleAddSubOpen(route.type,index)}>
                                
                                      <Button 
                                      variant="contained" 
                                      startIcon={<AddIcon />} 
                                      
                                      sx={{
                                        width:'150px',
                                        padding:0,

                                       
                                      }}
                                      // disabled={!buyer || !style || !color}
                                    >
                                     Sub Process
                                    </Button>
                                  
                                
                                </IconButton>
                              </Tooltip>
                          )
                        }
                      
                      <Tooltip title="Delete">
                        <IconButton size="small" color="error" onClick={() => handleDeleteMain(index)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Move Right">
                        <span>
                          <IconButton size="small" onClick={() => handleSwapMain(index, 'right')} disabled={index === routes.length - 1}>
                            <ArrowForwardIosIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </Box>

                    {/* Nested Vertical Stepper for Sub Processes */}
                    {route.subProcesses.length > 0 && (
                      <Box sx={{  height :'1000px' ,width: 200, textAlign: 'left', bgcolor: 'white', borderRadius: 1, boxShadow: 1 }}>
                        <Stepper orientation="vertical" activeStep={route.subProcesses.length}>
                          {route.subProcesses.map((sub, subIndex) => (
                            <Step key={sub.id} active={true}>
                              <StepLabel>
                                <Typography variant="body2">{sub.type}</Typography>
                              </StepLabel>
                              <StepContent>
                                <Box sx={{ display: 'flex', gap: 0.5  }}>
                                  <IconButton 
                                    size="small" 
                                    onClick={() => handleSwapSub(index, subIndex, 'up')}
                                    disabled={subIndex === 0}
                                  >
                                    <KeyboardArrowUpIcon fontSize="small" />
                                  </IconButton>
                                  <IconButton 
                                    size="small" 
                                    onClick={() => handleSwapSub(index, subIndex, 'down')}
                                    disabled={subIndex === route.subProcesses.length - 1}
                                  >
                                    <KeyboardArrowDownIcon fontSize="small" />
                                  </IconButton>
                                  <IconButton 
                                    size="small" 
                                    color="primary"
                                    
                                    onClick={() => handleOpenEditSub(index, subIndex, sub.type)}
                                  >
                                    <EditIcon fontSize="small" />
                                  </IconButton>
                                  <IconButton 
                                    size="small" 
                                    color="error"
                                    onClick={() => handleDeleteSub(index, subIndex)}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Box>
                              </StepContent>
                            </Step>
                          ))}
                        </Stepper>
                      </Box>
                    )}
                  </Stack>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
      )}

      {/* Dialog for Adding New Route */}
      <Dialog open={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Add New Route</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel>Process Type</InputLabel>
            <Select
              value={selectedMainType}
              label="Process Type"
              onChange={(e) => {
                setSelectedMainType(e.target.value as ProcessType)
                if (e.target.value === 'Dry Process') setSelectedSubType('')
              }}
            >
              <MenuItem value="Dry Process">Dry Process</MenuItem>
              <MenuItem value="Wet Process">Wet Process</MenuItem>
               <MenuItem value="After Wet Dry Process">After Wet Dry Process</MenuItem>
            </Select>
          </FormControl>

          {/* {selectedMainType === 'Wet Process' && ( */}
                {/* <FormControl fullWidth>
                  <InputLabel>Sub Process Type </InputLabel>
                  <Select
                    value={selectedSubType}
                    label="Sub Process Type"
                    onChange={(e) => setSelectedSubType(e.target.value as SubProcessType)}
                  > */}
                    {/* <MenuItem value=""><em>None</em></MenuItem> */}
                    {/* <MenuItem value="First Wash">First Wash</MenuItem>
                    <MenuItem value="Second Wash">Second Wash</MenuItem>
                    <MenuItem value="Acid Wash">Acid Wash</MenuItem> */}
                  {/* </Select>
                </FormControl> */}
          {/* )} */}
          
          {/* {selectedMainType === 'After Wet Dry Process' && ( */}
            {/* <FormControl fullWidth>
              <InputLabel>Sub Process Type </InputLabel>
              <Select
                value={selectedSubType}
                label="Sub Process Type"
                onChange={(e) => setSelectedSubType(e.target.value as SubProcessType)}
              > */}
                {/* <MenuItem value=""><em>None</em></MenuItem> */}
                {/* <MenuItem value="PP">PP</MenuItem>
                <MenuItem value="Grinding">Grinding</MenuItem>
                <MenuItem value="Store">Store</MenuItem> */}
              {/* </Select>
            </FormControl> */}
          {/* )} */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddSubmit} variant="contained" disabled={!selectedMainType}>
            Add
          </Button>
        </DialogActions>
      </Dialog>


       <Dialog open={isSubAddDialogOpen} onClose={() => setIsSubAddDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Add </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>


          {selectedMainType === 'Wet Process' && ( 
                <FormControl fullWidth>
                  <InputLabel>Sub Process Type </InputLabel>
                  <Select
                    value={selectedSubType}
                    label="Sub Process Type"
                    onChange={(e) => setSelectedSubType(e.target.value as SubProcessType)}
                  > 
                    {/* <MenuItem value=""><em>None</em></MenuItem> */}
                    <MenuItem value="First Wash">First Wash</MenuItem>
                    <MenuItem value="Second Wash">Second Wash</MenuItem>
                    <MenuItem value="Acid Wash">Acid Wash</MenuItem>
                 </Select>
                </FormControl> )}
         
          
          {selectedMainType === 'After Wet Dry Process' && (
           <FormControl fullWidth>
              <InputLabel>Sub Process Type </InputLabel>
              <Select
                value={selectedSubType}
                label="Sub Process Type"
                onChange={(e) => setSelectedSubType(e.target.value as SubProcessType)}
              > 
                {/* <MenuItem value=""><em>None</em></MenuItem> */}
                <MenuItem value="PP">PP</MenuItem>
                <MenuItem value="Grinding">Grinding</MenuItem>
                <MenuItem value="Store">Destroy</MenuItem>
              </Select>
            </FormControl> )
          }
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsSubAddDialogOpen(false)}>Cancel</Button>
          <Button onClick={()=>handleAddSubSubmit(seletectedSubAddMainIndex)} variant="contained" disabled={!selectedSubType}>
            Add
          </Button>
        </DialogActions>
      </Dialog>




      {/* Dialog for Editing Main Step Type */}
      <Dialog open={!!editStepId} onClose={() => setEditStepId(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Edit Process Step</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel>Change Process Type</InputLabel>
            <Select
              value={editMainType}
              label="Change Process Type"
              onChange={(e) => setEditMainType(e.target.value as ProcessType)}
            >
              <MenuItem value="Dry Process">Dry Process</MenuItem>
              <MenuItem value="Wet Process">Wet Process</MenuItem>
            </Select>
          </FormControl>
          {/* {editMainType === 'Dry Process' && (
            <Typography variant="caption" color="warning.main" sx={{ mt: 1, display: 'block' }}>
              Warning: Changing to Dry Process will remove any configured sub-processes.
            </Typography>
          )} */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditStepId(null)}>Cancel</Button>
          <Button onClick={handleSaveEditMain} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for Editing Sub Step Type */}
      <Dialog open={!!editSubInfo} onClose={() => setEditSubInfo(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Edit Sub Process</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel>Sub Process Type</InputLabel>
            <Select
              value={editSubType}
              label="Sub Process Type"
              onChange={(e) => setEditSubType(e.target.value as SubProcessType)}
            >
              {editSubInfo != null &&
                  routes[editSubInfo.mainIndex].type === 'Wet Process' && [
                    <MenuItem key="fw" value="First Wash">First Wash</MenuItem>,
                    <MenuItem key="sw" value="Second Wash">Second Wash</MenuItem>,
                    <MenuItem key="aw" value="Acid Wash">Acid Wash</MenuItem>,
                  ]}

                {editSubInfo != null &&
                  routes[editSubInfo.mainIndex].type === 'After Wet Dry Process' && [
                    <MenuItem key="pp" value="PP">PP</MenuItem>,
                    <MenuItem key="gr" value="Grinding">Grinding</MenuItem>,
                    <MenuItem key="st" value="Store">Store</MenuItem>,
                  ]}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditSubInfo(null)}>Cancel</Button>
          <Button onClick={handleSaveEditSub} variant="contained" color="primary" disabled={!editSubType}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}