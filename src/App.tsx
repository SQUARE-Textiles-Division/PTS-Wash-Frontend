import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import 'bootstrap/dist/css/bootstrap.css'
import './App.css'
// import '@fontsource/inter'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import WashReceivePass from './components/WashReceivePass'
import Navbar from './components/Navbar'
import CreateBatch from './components/CreateBatch'
import Planning from './components/PlanningComponent'
import WhiskerIn from './components/InProcess/WhiskerIn'
import WhiskerOutput from './components/OutProcess/WhiskerOutput'
import BrushIn from './components/InProcess/BrushIn'
import BrushOutput from './components/OutProcess/BrushOutput'
import WrinkleIn from './components/InProcess/WrinkleIn'
import WrinkleOutput from './components/OutProcess/WrinkleOutput'
import TagOutput from './components/OutProcess/TagOutput'
import TagIn from './components/InProcess/TagIn'
import LaserWhiskerIn from './components/InProcess/LaserWhikserIn'
import LaserBrushIn from './components/InProcess/LaserBrushIn'
import LaserWhiskerOutput from './components/OutProcess/LaserWhiskerOutput'
import TieIn from './components/InProcess/TieIn'
import TieOutput from './components/OutProcess/TieOutput'
import LaserBrushOutput from './components/OutProcess/LaserBrushOutput'
import WhiskerQC from './components/QC/WhiskerQC'
import LaserWhiskerQC from './components/QC/LaserWhiskerQC'
import BrushQC from './components/QC/BrushQC'
import LaserBrushQC from './components/QC/LaserBrushQC'
import WrinkleQC from './components/QC/WrinkleQC'
import TagQC from './components/QC/TagQC'
import TieQC from './components/QC/TieQC'
import QCEditDel from './components/QCEditDel'
import BatchCreateDry from './components/WetProcess/BatchCreateDry'
import BatchCreateDirect from './components/WetProcess/BatchCreateDirect'
import HydroIn from './components/WetProcess/HydroIn'
import HydroOut from './components/WetProcess/HydroOut'
import LoadStart from './components/WetProcess/LoadStart'
import LoadFinish from './components/WetProcess/LoadFinish'
import ProcessFinish from './components/WetProcess/ProcessFinish'
// import UnloadStart from './components/WetProcess/UnloadFinish'
import DryerConveyorIn from './components/WetProcess/DryerConveyorIn'

import DryerOvenIn from './components/WetProcess/DryerOvenIn'
import UnloadFinish from './components/WetProcess/UnloadFinish'
import DryerConveyorOut from './components/WetProcess/DryerConveyorOut'
import DryerTumbleIn from './components/WetProcess/DryerTumbleIn'
import DryerOvenOut from './components/WetProcess/DryerOvenOut'
import DryerTumbleOut from './components/WetProcess/DryerTumbleOut'
import FirstWashQC from './components/WetProcess/FirstWashQC'
import Rewash from './components/WetProcess/Rewash'
import { MasterRouting } from './components/MasterRouting'
import { InputAdornment } from '@mui/material'
import InProcessGen from './components/InProcess/InProcessGen'
import OutProcessGen from './components/OutProcess/OutProcessGen'
import QCGen from './components/QC/QCGen'
import BatchCreateAggGen from './components/WetProcess/BatchCreateAggGen'
function App() {
  // const [count, setCount] = useState(0)
  return (
    <Router >
      <Navbar />
      <Routes >
        {/* <Route path="/" /> */}
        <Route path="/planning" element={<Planning />} />
        <Route path='/firstwash/hydroin' element={<HydroIn key='first-wash-hydroin'  stage="first_wash"/>}/>
        <Route path='/firstwash/hydroout' element={<HydroOut key='first-wash-hydroout'  stage="first_wash" />} />
        <Route path='/firstwash/loadstart' element={<LoadStart key='first-wash-loadstart'   stage='first_wash'/>} />
        <Route path='/firstwash/loadfinish' element={<LoadFinish key='first-wash-loadfinish' stage='first_wash' />} />
        <Route path='/firstwashqc' element={<FirstWashQC key='first-wash-qc' stage='first_wash' />} />
        <Route path='/firstwash/rewashcreatebatch' element={<Rewash key='first-wash-rewash' stage='first_wash' />}/>
        
        <Route path='/firstwash/processfinish' element={<ProcessFinish key='first-wash-processfinish' stage='first_wash'/>}  />
        <Route path='/firstwash/unloadfinish' element={<UnloadFinish key='first-wash-unloadfinish'  stage='first_wash'/>} />
        <Route path="/firstwash/dryerconveyorin" element={<DryerConveyorIn key='first-wash-dryerconveyorin' stage="first_wash" />} />
        <Route path="/firstwash/dryerconveyorout" element={<DryerConveyorOut key='first-wash-dryerconveyorout' stage="first_wash" />}/>
        <Route path='/firstwash/dryerovenin' element={<DryerOvenIn key='first-wash-dryerovenin' stage="first_wash" />} />
        <Route path='/firstwash/dryerovenout' element={<DryerOvenOut key='first-wash-dryerovenout' stage="first_wash" />} />
        <Route path='/firstwash/dryertumblein' element={<DryerTumbleIn key='first-wash-dryertumblein' stage="first_wash" />}/>
        <Route path='/firstwash/dryertumbleout' element={<DryerTumbleOut key='first-wash-dryertumbleout' stage="first_wash" />} />
        {/* <Route path='/firstwash/batchwithdry' element={<BatchCreateDry/>}/> */}
        <Route path='/firstwash/createbatch' element={<BatchCreateDirect/>}/>
        <Route path='/secondwash/createbatch' element={<BatchCreateAggGen key='second-wash-createbatch' stage='second_wash' />} />

        <Route path='/secondwash/hydroin' element={<HydroIn key='second-wash-hydroin'   stage="second_wash"/>}/>
        <Route path='/secondwash/hydroout' element={<HydroOut key='second-wash-hydroout'  stage="second_wash" />} />
        <Route path='/secondwash/loadstart' element={<LoadStart key='second-wash-loadstart'   stage='second_wash'/>} />
        <Route path='/secondwash/loadfinish' element={<LoadFinish key='second-wash-loadfinish' stage='second_wash' />} />
        <Route path='/secondwashqc' element={<FirstWashQC key='second-wash-qc' stage='second_wash' />} />
        <Route path='/secondwash/rewashcreatebatch' element={<Rewash key='second-wash-rewash' stage='second_wash' />}/>
        
        <Route path='/secondwash/processfinish' element={<ProcessFinish key='second-wash-processfinish'  stage='second_wash'/>}  />
        <Route path='/secondwash/unloadfinish' element={<UnloadFinish key='second-wash-unloadfinish'  stage='second_wash'/>} />
        <Route path="/secondwash/dryerconveyorin" element={<DryerConveyorIn key='second-wash-dryerconveyorin' stage="second_wash" />} />
        <Route path="/secondwash/dryerconveyorout" element={<DryerConveyorOut key='second-wash-dryerconveyorout' stage="second_wash" />} />
        <Route path='/secondwash/dryertumblein' element={<DryerTumbleIn key='second-wash-dryertumblein' stage="second_wash" />}/>
        <Route path='/secondwash/dryerovenin' element={<DryerOvenIn key='second-wash-dryerovenin' stage="second_wash" />} />
        <Route path='/secondwash/dryerovenout' element={<DryerOvenOut key='second-wash-dryerovenout' stage="second_wash" />} />
        <Route path='/secondwash/dryertumbleout' element={<DryerTumbleOut key='second-wash-dryertumbleout' stage="second_wash" />} />

        <Route path='/thirdwash/createbatch' element={<BatchCreateAggGen key='third-wash-createbatch' stage='third_wash' />} />
        <Route path='/thirdwash/hydroin' element={<HydroIn key='third-wash-hydroin'   stage="third_wash"/>}/>
        <Route path='/thirdwash/hydroout' element={<HydroOut key='third-wash-hydroout'  stage="third_wash" />} />
        <Route path='/thirdwash/loadstart' element={<LoadStart key='third-wash-loadstart'   stage='third_wash'/>} />
        <Route path='/thirdwash/loadfinish' element={<LoadFinish key='third-wash-loadfinish' stage='third_wash' />} />
        <Route path='/thirdwashqc' element={<FirstWashQC key='third-wash-qc' stage='third_wash' />} />
        <Route path='/thirdwash/rewashcreatebatch' element={<Rewash key='third-wash-rewash' stage='third_wash' />}/>
        
        <Route path='/thirdwash/processfinish' element={<ProcessFinish key='third-wash-processfinish'  stage='third_wash'/>}  />
        <Route path='/thirdwash/unloadfinish' element={<UnloadFinish key='third-wash-unloadfinish'  stage='third_wash'/>} />
        <Route path="/thirdwash/dryerconveyorin" element={<DryerConveyorIn key='third-wash-dryerconveyorin' stage="third_wash" />} />
        <Route path="/thirdwash/dryerconveyorout" element={<DryerConveyorOut key='third-wash-dryerconveyorout' stage="third_wash" />} />
        <Route path='/thirdwash/dryertumblein' element={<DryerTumbleIn key='third-wash-dryertumblein' stage="third_wash" />}/>
        <Route path='/thirdwash/dryerovenin' element={<DryerOvenIn key='third-wash-dryerovenin' stage="third_wash" />} />
        <Route path='/thirdwash/dryerovenout' element={<DryerOvenOut key='third-wash-dryerovenout' stage="third_wash" />} />
        <Route path='/thirdwash/dryertumbleout' element={<DryerTumbleOut key='third-wash-dryertumbleout' stage="third_wash" />} />


        <Route path='/finalwash/createbatch' element={<BatchCreateAggGen key='final-wash-createbatch' stage='final_wash' />} />
        <Route path='/finalwash/hydroin' element={<HydroIn key='final-wash-hydroin'   stage="final_wash"/>}/>
        <Route path='/finalwash/hydroout' element={<HydroOut key='final-wash-hydroout'  stage="final_wash" />} />
        <Route path='/finalwash/loadstart' element={<LoadStart key='final-wash-loadstart'   stage='final_wash'/>} />
        <Route path='/finalwash/loadfinish' element={<LoadFinish key='final-wash-loadfinish' stage='final_wash' />} />
        <Route path='/finalwashqc' element={<FirstWashQC key='final-wash-qc' stage='final_wash' />} />
        <Route path='/finalwash/rewashcreatebatch' element={<Rewash key='final-wash-rewash' stage='final_wash' />}/>
        
        <Route path='/finalwash/processfinish' element={<ProcessFinish key='final-wash-processfinish'  stage='final_wash'/>}  />
        <Route path='/finalwash/unloadfinish' element={<UnloadFinish key='final-wash-unloadfinish'  stage='final_wash'/>} />
        <Route path='/finalwash/unloadfinish' element={<UnloadFinish key='final-wash-unloadfinish'  stage='third_wash'/>} />
        <Route path="/finalwash/dryerconveyorin" element={<DryerConveyorIn key='final-wash-dryerconveyorin' stage="final_wash" />} />
        <Route path="/finalwash/dryerconveyorout" element={<DryerConveyorOut key='final-wash-dryerconveyorout' stage="final_wash" />} />
        <Route path='/finalwash/dryertumblein' element={<DryerTumbleIn key='final-wash-dryertumblein' stage="final_wash" />}/>
        <Route path='/finalwash/dryerovenin' element={<DryerOvenIn key='final-wash-dryerovenin' stage="final_wash" />} />
        <Route path='/finalwash/dryerovenout' element={<DryerOvenOut key='final-wash-dryerovenout' stage="final_wash" />} />
        <Route path='/finalwash/dryertumbleout' element={<DryerTumbleOut key='final-wash-dryertumbleout' stage="final_wash" />} />

        <Route path="/washreceive" element={<WashReceivePass />} />
        <Route path="/createbatch" element={<CreateBatch />} />
        <Route path="/qceditdel" element={<QCEditDel />} />
        {/* <Route path="/whiskerin" element={<WhiskerIn />} /> */}
        <Route path="/whiskerin" element={<InProcessGen  key="whisker" processName="whisker"  processDisplay='Whisker'/>}/>
        {/* <Route path="/whiskerqc" element={<WhiskerQC />} /> */}
        <Route path="/whiskerqc" element={<QCGen  key="whisker" processName="whisker" processDisplay='Whisker'/>} />
        {/* <Route path="/whiskeroutput" element={<WhiskerOutput/>}/> */}
        <Route path="/whiskeroutput" element={<OutProcessGen  key="whisker" processName="whisker" processDisplay='Whisker'/>}/>

        {/* <Route path='/laserwhiskerin' element={<LaserWhiskerIn/>}/> */}
        <Route path='/laserwhiskerin' element={<InProcessGen  key="laser_whisker" processName="laser_whisker" processDisplay='Laser Whisker'/>}/>
        {/* <Route path='/laserwhiskerqc' element={<LaserWhiskerQC/>}/> */}
        <Route path='/laserwhiskerqc' element={<QCGen  key="laser_whisker" processName="laser_whisker" processDisplay='Laser Whisker'/>} />
        {/* <Route path='/laserwhiskeroutput' element={<LaserWhiskerOutput/>}/> */}
        <Route path='/laserwhiskeroutput' element={<OutProcessGen  key="laser_whisker" processName="laser_whisker" processDisplay='Laser Whisker'/>}/>
        {/* <Route path='/brushin' element={<BrushIn/>}/> */}
        <Route path='/brushin' element={<InProcessGen  key="brush" processName="brush" processDisplay='Brush'/>}/>
        {/* <Route path='/brushqc' element={<BrushQC/>}/> */}
        <Route path='/brushqc' element={<QCGen  key="brush" processName="brush" processDisplay='Brush'/>} />
        {/* <Route path='/brushoutput' element={<BrushOutput/>}/> */}
        <Route path='/brushoutput' element={<OutProcessGen  key="brush" processName="brush" processDisplay='Brush'/>}/>
        {/* <Route path='/laserbrushin' element={<LaserBrushIn/>}/> */}
        <Route path='/laserbrushin' element={<InProcessGen  key="laser_brush" processName="laser_brush" processDisplay='Laser Brush'/>}/>
        {/* <Route path='/laserbrushqc' element={<LaserBrushQC/>}></Route> */}
        <Route path='/laserbrushqc' element={<QCGen  key="laser_brush" processName="laser_brush" processDisplay='Laser Brush'/>} />
        {/* <Route path='/laserbrushoutput' element={<LaserBrushOutput/>}/> */}
        <Route path='/laserbrushoutput' element={<OutProcessGen  key="laser_brush" processName="laser_brush" processDisplay='Laser Brush'/>}/>
        {/* <Route path='/wrinklein' element={<WrinkleIn/>}/> */}
        <Route path='/wrinklein' element={<InProcessGen  key="wrinkle" processName="wrinkle" processDisplay='Wrinkle'/>}/>
        {/* <Route path='/wrinkleqc' element={<WrinkleQC/>}/> */}
        <Route path='/wrinkleqc' element={<QCGen  key="wrinkle" processName="wrinkle" processDisplay='Wrinkle'/>} />
        {/* <Route path='/wrinkleoutput' element={<WrinkleOutput/>}/> */}
        <Route path='/wrinkleoutput' element={<OutProcessGen  key="wrinkle" processName="wrinkle" processDisplay='Wrinkle'/>}/>
        {/* <Route path='/tagin' element={<TagIn/>}/> */}
        <Route path='/tagin' element={<InProcessGen  key="tag" processName="tag" processDisplay='Tag'/>}/>
        {/* <Route path='/tagqc' element={<TagQC/>}/> */}
        <Route path='/tagqc' element={<QCGen  key="tag" processName="tag" processDisplay='Tag'/>} />
        {/* <Route path='/tagoutput' element={<TagOutput/>}/> */}
        <Route path='/tagoutput' element={<OutProcessGen  key="tag" processName="tag" processDisplay='Tag'/>}/>
        {/* <Route path='/tiein' element={<TieIn/>}/> */}
        <Route path='/tiein' element={<InProcessGen  key="tie" processName="tie" processDisplay='Tie'/>}/>
        {/* <Route path='/tieqc' element={<TieQC/>}/> */}
        <Route path='/tieqc' element={<QCGen  key="tie" processName="tie" processDisplay='Tie'/>} />
        {/* <Route path='/tieoutput' element={<TieOutput/>}/> */}
        <Route path='/tieoutput' element={<OutProcessGen  key="tie" processName="tie" processDisplay='Tie'/>}/>
        <Route path='/masterroute' element={<MasterRouting/>}/>

        {/* <Route path='/tieoutput' element={<TieOutput/>}/> */}

      </Routes>
    </Router>
  );
}

export default App
