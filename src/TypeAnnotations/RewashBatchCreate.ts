export default interface RewashBatchCreate{
    buyer:string,
    color: string,
    shade: string,
    source_batches:
        {
            content_type:string,
            object_id: number,
            quantity: number
        }[],
}