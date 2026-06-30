import { useState } from "react";
// import type BundleInfo from "../TypeAnnotations/BundleInfo";
import WashReceive from "./WashReceive";
import ReceivedBundles from "./ReceivedBundles";
import type IndividualInfo from "../TypeAnnotations/IndividualInfo";


export default function WashReceivePass(){
    const [items, setItems] = useState<IndividualInfo[]>([]);
     return (
            <div style={
            {
                display:'flex',
                flexDirection:'column',
                alignItems:'center',
            }
            }>
                <WashReceive items={items} setItems={setItems} />
                <ReceivedBundles rows={items} />
            </div>
  )
}