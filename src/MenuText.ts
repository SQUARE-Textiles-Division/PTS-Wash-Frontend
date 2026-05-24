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
        return "First Wash / Dryer / Dryer Conveyor In"
    }
    else if(text=="/firstwash/dryerconveyorout"){  
        return "First Wash / Dryer / Dryer Conveyor Out"
    }
    else if(text=="/firstwash/dryerovenin"){
        return "First Wash / Dryer / Dryer Oven In"
    }
    else if(text=="/firstwash/dryerovenout"){
        return "First Wash / Dryer / Dryer Oven Out"
    }
    else if(text=="/firstwash/dryertumblein"){
        return "First Wash / Dryer / Dryer Tumble In"
    }
    else if(text=="/firstwash/dryertumbleout"){
        return "First Wash / Dryer / Dryer Tumble Out"
    }
    else if(text=="/firstwash/createbatch"){
        return "First Wash / Create Batch"
    }
    else if(text=="/firstwash/processfinish"){
        return "First Wash / Unload / Process Finish & Unload Start"
    }
    else if(text=="/firstwash/hydroout"){
        return "First Wash / Hydro / Hydro Out"
    }
    else if (text=="/firstwash/unloadfinish"){
        return "First Wash / Unload / Unload Finish"
    }
    else if(text=="/firstwash/loadfinish"){
        return "First Wash / Load / Load Finish & Process Start"
    }
    else if(text=="/firstwash/rewashcreatebatch"){
        return "First Wash / Rewash / Create Batch"
    }
    else if (text=="/firstwash/loadstart"){
        return "First Wash / Load / Load Start"
    }
    else if (text=="/firstwash/createbatch"){
        return "First Wash / Create Batch"
    }
    else if(text=="/firstwashqc"){
        return "First Wash / QC"
    }
    else if(text=="/firstwash/hydroin"){
        return "First Wash / Hydro / Hydro In"
    }
}