import type BundleInfo from "./BundleInfo"
import type RouteSteps from "./RouteSteps"

export default interface BatchBundles{
    "id": number,
    "batch_id": number,
    "received_id": number,
    "bundle_no": number,
    "quantity": number,
    "added_at": string,
    "received":BundleInfo
}



export default interface Planning{
    "id": number,
    "mpo": string,
    "color":string,
    "updated_by": string,
    "last_update": string,
    "route_steps": RouteSteps[]
}


// export default interface BatchInstance{
//     "id": number,
//     "mpo": string,
//     "size": string,
//     "color": string,
//     "batch_bundles": BatchBundles[],
//     "total_quantity":number,
//     "planning":Planning,
//     "updated_at":string,
//     "updated_by":string
// }