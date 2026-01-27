import type BatchInstance from "./BatchInstance";

export default interface RejectionReason{
    id:number,
    individual_barcode:string,
    batch:number,
    details:{
        mpo:string,
        marker:string,
        size:string,
        color:string,
        shade:string,
    }
    stage:string,
    reason:string,
    rejected_at:string,
    rejected_by:string
}