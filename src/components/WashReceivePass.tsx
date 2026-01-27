import React, { useState } from "react";
import type BundleInfo from "../TypeAnnotations/BundleInfo";
import WashReceive from "./WashReceive";
import ReceivedBundles from "./ReceivedBundles";


export default function WashReceivePass(){
    const [items, setItems] = useState<BundleInfo[]>([]);
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