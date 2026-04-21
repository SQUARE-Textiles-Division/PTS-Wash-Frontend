export default interface WetWashRejection{
    id: number,
    individual_barcode: string,
    batch:number,
    reason: string,
    stage: string,
    rejected_at: string,
    rejected_by: string,
}