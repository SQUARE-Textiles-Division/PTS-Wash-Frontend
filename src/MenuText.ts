type MenuTextProps = {
  text: string;
};
export function MenuText({text}: MenuTextProps) {
    console.log("MenuText received text:", text); // Debugging log
    if(text=="/planning"){
        return "Dry Process / Planning"
    }
    else if(text=="/washreceive"){
        return "Wash Receive"
    }
    else if(text=="/qceditdel"){
        return "Dry Process / QC Update"
    }
    else if(text=="/whiskerin"){
        return "Dry Process / Whisker In"
    }
    else if(text=="/whiskerqc"){
        return "Dry Process / Whisker QC"
    }
    else if(text=="/whiskeroutput"){
        return "Dry Process / Whisker QC Pass"
    }
    else if(text=="/laserwhiskerin"){
        return "Dry Process / Laser Whisker In"
    }
    else if(text=="/laserwhiskerqc"){
        return "Dry Process / Laser Whisker QC"
    }   
    else if(text=="/laserwhiskeroutput"){
        return "Dry Process / Laser Whisker QC Pass"
    }
    else if(text=="/brushin"){
        return "Dry Process / Brush In"
    }
    else if(text=="/brushqc"){
        return "Dry Process / Brush QC"
    }
    else if(text=="/brushoutput"){
        return "Dry Process / Brush QC Pass"
    }
    else if(text=="/laserbrushin"){
        return "Dry Process / Laser Brush In"
    }
    else if(text=="/laserbrushqc"){
        return "Dry Process / Laser Brush QC"
    }
    else if(text=="/laserbrushoutput"){
        return "Dry Process / Laser Brush QC Pass"
    }
    else if(text=="/wrinklein"){
        return "Dry Process / Wrinkle In"
    }
    else if(text=="/wrinkleqc"){
        return "Dry Process / Wrinkle QC"
    }
    else if(text=="/wrinkleoutput"){
        return "Dry Process / Wrinkle QC Pass"
    }
    else if(text=="/tagin"){
        return "Dry Process / Tag In"
    }
    else if(text=="/tagqc"){
        return "Dry Process / Tag QC"
    }
    else if(text=="/tagoutput"){
        return "Dry Process / Tag QC Pass"
    }
    else if(text=="/tiein"){
        return "Dry Process / Tie In"
    }
    else if(text=="/tieqc"){
        return "Dry Process / Tie QC"
    }   
    else if(text=="/tieoutput"){
        return "Dry Process / Tie QC Pass"
    }
    else if(text=="/firstwash/dryerconveyorin"){
        return "1st Wash / Dryer / Dryer Conveyor In"
    }
    else if(text=="/firstwash/dryerconveyorout"){  
        return "1st Wash / Dryer / Dryer Conveyor Out"
    }
    else if(text=="/firstwash/dryerovenin"){
        return "1st Wash / Dryer / Dryer Oven In"
    }
    else if(text=="/firstwash/dryerovenout"){
        return "1st Wash / Dryer / Dryer Oven Out"
    }
    else if(text=="/firstwash/dryertumblein"){
        return "1st Wash / Dryer / Dryer Tumble In"
    }
    else if(text=="/firstwash/dryertumbleout"){
        return "1st Wash / Dryer / Dryer Tumble Out"
    }
    else if(text=="/firstwash/createbatch"){
        return "1st Wash / Create Batch"
    }
    else if(text=="/firstwash/processfinish"){
        return "1st Wash / Unload / Process Finish & Unload Start"
    }
    else if(text=="/firstwash/hydroout"){
        return "1st Wash / Hydro / Hydro Out"
    }
    else if (text=="/firstwash/unloadfinish"){
        return "1st Wash / Unload / Unload Finish"
    }
    else if(text=="/firstwash/loadfinish"){
        return "1st Wash / Load / Load Finish & Process Start"
    }
    else if(text=="/firstwash/rewashcreatebatch"){
        return "1st Wash / Rewash / Create Batch"
    }
    else if (text=="/firstwash/loadstart"){
        return "1st Wash / Load / Load Start"
    }
    else if (text=="/firstwash/createbatch"){
        return "1st Wash / Create Batch"
    }
    else if(text=="/firstwashqc"){
        return "1st Wash / QC"
    }
    else if(text=="/firstwash/hydroin"){
        return "1st Wash / Hydro / Hydro In"
    }
    else if(text=="/secondwash/createbatch"){
        return "2nd Wash / Create Batch"
    }
    else if(text=="/secondwash/hydroin"){
        return "2nd Wash / Hydro / Hydro In"
    }
    else if(text=="/secondwash/hydroout"){
        return "2nd Wash / Hydro / Hydro Out"
    }
    else if(text=="/secondwash/loadstart"){ 
        return "2nd Wash / Load / Load Start"
    }
    else if(text=="/secondwash/loadfinish"){
        return "2nd Wash / Load / Load Finish & Process Start"
    }
    else if(text=="/secondwash/unloadfinish"){
        return "2nd Wash / Unload / Unload Finish"
    }
    else if(text=="/secondwashqc"){
        return "2nd Wash / QC"
    }
    else if(text=="/secondwash/rewashcreatebatch"){
        return "2nd Wash / Rewash / Create Batch"
    }
    else if(text=="/secondwash/processfinish"){
        return "2nd Wash / Unload / Process Finish & Unload Start"
    }
    else if(text=="/secondwash/dryerconveyorin"){
        return "2nd Wash / Dryer / Dryer Conveyor In"
    }
    else if(text=="/secondwash/dryerconveyorout"){
        return "2nd Wash / Dryer / Dryer Conveyor Out"
    }
    else if(text=="/secondwash/dryerovenin"){
        return "2nd Wash / Dryer / Dryer Oven In"
    }
    else if(text=="/secondwash/dryerovenout"){
        return "2nd Wash / Dryer / Dryer Oven Out"
    }
    else if(text=="/secondwash/dryertumblein"){
        return "2nd Wash / Dryer / Dryer Tumble In"
    }
    else if(text=="/secondwash/dryertumbleout"){
        return "2nd Wash / Dryer / Dryer Tumble Out"
    }   
    else if(text=="/thirdwash/createbatch"){
        return "3rd Wash / Create Batch"
    }
    else if(text=="/thirdwash/hydroin"){
        return "3rd Wash / Hydro / Hydro In"
    }
    else if(text=="/thirdwash/hydroout"){
        return "3rd Wash / Hydro / Hydro Out"
    }
    else if(text=="/thirdwash/loadstart"){ 
        return "3rd Wash / Load / Load Start"
    }
    else if(text=="/thirdwash/loadfinish"){
        return "3rd Wash / Load / Load Finish & Process Start"
    }
    else if(text=="/thirdwash/unloadfinish"){
        return "3rd Wash / Unload / Unload Finish"
    }
    else if(text=="/thirdwashqc"){
        return "3rd Wash / QC"
    }
    else if(text=="/thirdwash/rewashcreatebatch"){
        return "3rd Wash / Rewash / Create Batch"
    }
    else if(text=="/thirdwash/processfinish"){
        return "3rd Wash / Unload / Process Finish & Unload Start"
    }
    else if(text=="/thirdwash/dryerconveyorin"){
        return "3rd Wash / Dryer / Dryer Conveyor In"
    }
    else if(text=="/thirdwash/dryerconveyorout"){
        return "3rd Wash / Dryer / Dryer Conveyor Out"
    }
    else if(text=="/thirdwash/dryerovenin"){
        return "3rd Wash / Dryer / Dryer Oven In"
    }
    else if(text=="/thirdwash/dryerovenout"){
        return "3rd Wash / Dryer / Dryer Oven Out"
    }
    else if(text=="/thirdwash/dryertumblein"){
        return "3rd Wash / Dryer / Dryer Tumble In"
    }
    else if(text=="/thirdwash/dryertumbleout"){
        return "3rd Wash / Dryer / Dryer Tumble Out"
    }   
    

    else if(text=="/finalwash/createbatch"){
        return "Final Wash / Create Batch"
    }
    else if(text=="/finalwash/hydroin"){
        return "Final Wash / Hydro / Hydro In"
    }
    else if(text=="/finalwash/hydroout"){
        return "Final Wash / Hydro / Hydro Out"
    }
    else if(text=="/finalwash/loadstart"){ 
        return "Final Wash / Load / Load Start"
    }
    else if(text=="/finalwash/loadfinish"){
        return "Final Wash / Load / Load Finish & Process Start"
    }
    else if(text=="/finalwash/unloadfinish"){
        return "Final Wash / Unload / Unload Finish"
    }
    else if(text=="/finalwashqc"){
        return "Final Wash / QC"
    }
    else if(text=="/finalwash/rewashcreatebatch"){
        return "Final Wash / Rewash / Create Batch"
    }
    else if(text=="/finalwash/processfinish"){
        return "Final Wash / Unload / Process Finish & Unload Start"
    }
    else if(text=="/finalwash/dryerconveyorin"){
        return "Final Wash / Dryer / Dryer Conveyor In"
    }
    else if(text=="/finalwash/dryerconveyorout"){
        return "Final Wash / Dryer / Dryer Conveyor Out"
    }
    else if(text=="/finalwash/dryerovenin"){
        return "Final Wash / Dryer / Dryer Oven In"
    }
    else if(text=="/finalwash/dryerovenout"){
        return "Final Wash / Dryer / Dryer Oven Out"
    }
    else if(text=="/finalwash/dryertumblein"){
        return "Final Wash / Dryer / Dryer Tumble In"
    }
    else if(text=="/finalwash/dryertumbleout"){
        return "Final Wash / Dryer / Dryer Tumble Out"
    } 
}