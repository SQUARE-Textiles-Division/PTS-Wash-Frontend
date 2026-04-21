export default interface WetProcessBatchMeta{
    source: {
        id: number,
        mpo: string,
        style: string,
        so: string
    },
    batch: {
        id: number,
        buyer: string,
        color: string,
        shade: string,
        stage: string,
        type: string,
        rejection_count:number,
        total_quantity:number
    },
    quantity: number,
    rewash_quantity: number,
    // remaining_rewash_quantity: number
}