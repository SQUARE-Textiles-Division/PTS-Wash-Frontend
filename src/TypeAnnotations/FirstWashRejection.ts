export default interface FirstWashRejection{
    id: number,
    individual_barcode: string,
    reason: string,
    stage: string,
    rejected_at: string,
    rejected_by: string,
    content_type: string,
    object_id: number
}