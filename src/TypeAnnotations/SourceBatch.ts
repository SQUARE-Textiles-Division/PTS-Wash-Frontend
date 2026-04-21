export default interface BatchSourceEntry {
    shade:string,
    buyer:string,
    color:string,
    stage: string,
    type: string,
    sources_input:
    {
        type: string,
        mpo: string,
        style: string,
        so: string,
        quantity: number
    }[]
}