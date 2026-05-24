export default interface BatchSourceEntry {
    shade:string,
    buyer:string,
    color:string,
    stage: string,
    type: string,
    input_type:string,
    input_sources:
    {
        mpo: string,
        style: string,
        so: string,
        quantity: number
    }[]
}