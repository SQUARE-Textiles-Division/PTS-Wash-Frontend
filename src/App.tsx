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
function App() {
  // const [count, setCount] = useState(0)
  return (
    <Router >
      <Navbar />
      <Routes >
        {/* <Route path="/" /> */}
        <Route path="/planning" element={<Planning />} />
        <Route path="/washreceive" element={<WashReceivePass />} />
        <Route path="/createbatch" element={<CreateBatch />} />
        <Route path="/qceditdel" element={<QCEditDel />} />
        <Route path="/whiskerin" element={<WhiskerIn />} />
        <Route path="/whiskerqc" element={<WhiskerQC />} />
        <Route path="/whiskeroutput" element={<WhiskerOutput/>}/>
        <Route path='/laserwhiskerin' element={<LaserWhiskerIn/>}/>
        <Route path='/laserwhiskerqc' element={<LaserWhiskerQC/>}/>
        <Route path='/laserwhiskeroutput' element={<LaserWhiskerOutput/>}/>
        <Route path='/brushin' element={<BrushIn/>}/>
        <Route path='/brushqc' element={<BrushQC/>}/>
        <Route path='/brushoutput' element={<BrushOutput/>}/>
        <Route path='/laserbrushin' element={<LaserBrushIn/>}/>
        <Route path='/laserbrushqc' element={<LaserBrushQC/>}></Route>
        <Route path='/laserbrushoutput' element={<LaserBrushOutput/>}/>
        <Route path='/wrinklein' element={<WrinkleIn/>}/>
        <Route path='/wrinkleqc' element={<WrinkleQC/>}/>
        <Route path='/wrinkleoutput' element={<WrinkleOutput/>}/>
        <Route path='/tagin' element={<TagIn/>}/>
        <Route path='/tagqc' element={<TagQC/>}/>
        <Route path='/tagoutput' element={<TagOutput/>}/>
        <Route path='/tiein' element={<TieIn/>}/>
        <Route path='/tieqc' element={<TieQC/>}/>
        <Route path='/tieoutput' element={<TieOutput/>}/>

        {/* <Route path='/tieoutput' element={<TieOutput/>}/> */}

      </Routes>
    </Router>
  );
}

export default App
