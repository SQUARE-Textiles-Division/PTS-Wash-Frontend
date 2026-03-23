
    export default interface FirstWashBatch {
        id: number;
        buyer: string,
        color: string,
        shade: string;
        created_at: string;
        created_by: string;
        total_quantity: number;
        status: any;
        source_batches: {
            id: number,
            mpo: string,
            style: string,
            so: string,
            quantity: number;
        }[];
        source_bundles: 
        {
            id: number,
            received: {
                id: number,
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
                status: any
            },
            quantity: number
        }[],
    }
