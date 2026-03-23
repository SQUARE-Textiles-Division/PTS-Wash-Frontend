export default interface RewashBatchCreateResult{
    id: number,
    buyer: string,
    color: string,
    shade: string,
    created_at: string,
    created_by: string,
    source_batches: 
        {
            id: number,
            content_type: string,
            object_id: number,
            quantity: number
        }[]
}