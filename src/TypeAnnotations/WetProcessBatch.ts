
    export default interface WetProcessBatch {
        id: string,
        buyer: string,
        color: string,
        shade: string,
        stage: string,
        type: string,
        status: string,
        total_quantity: number,
        total_received_quantity:number,
        total_rewash_quantity: number,
        total_rejection_quantity: number,
        created_at: string,
        operator: string,
        sources: 
        {
            id: number,
            mpo : string,
            style: string,
            so: string,
            quantity: number,
            received_quantity:number,
            rewash_quantity: number,
            rejection_quantity: number
        }[]
    }
