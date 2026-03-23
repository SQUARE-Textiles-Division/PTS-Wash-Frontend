export default interface FirstWashBatchDirectCreate
{
    id: number,
    shade: string,
    created_at: string,
    created_by: string,
    total_quantity: number,
    status: any,
    source_batches: any[],
    source_bundles: 
        {
            bundle: {
                id:number,
                so: string,
                mpo: string,
                buyer: string,
                style: string,
                marker: string,
                bundle_no: number,
                bundle_barcode: string,
                size: string,
                shade: string,
                color: string,
                quantity: number,
                received_at: string,
                received_by: string,
                status: string
            },
            quantity: number
        }[],
}


