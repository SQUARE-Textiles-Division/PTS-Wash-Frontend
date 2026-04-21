
    export default interface WetProcessBatch {
        id: number;
        buyer: string,
        color: string,
        shade: string;
        stage: string,
        type: string,
        created_at: string;
        created_by: string;
        total_quantity: number;
        status: any;
        sources: 
        {
            id: number,
            source: {
                mpo: string,
                style: string,
                so: string
            },
            quantity: number
        }[],
    }
