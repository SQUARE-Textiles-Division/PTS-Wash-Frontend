
    export default interface FirstWashBatch {
        id: number;
        shade: string;
        created_at: string;
        created_by: string;
        total_quantity: number;
        status: null;
        source_batches: {
            batch: number;
            quantity: number;
        }[];
    }
