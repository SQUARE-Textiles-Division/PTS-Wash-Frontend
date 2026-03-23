export default interface FetchFirstWash{
    id:number,
    content_type:string,
    object_id:number,
    batch_details:{
        shade:string,
        buyer:string,
        color:string
    }
    total_quantity:number,
    rewash_quantity:number,
    remaining_rewash_quantity:number,
    rejections:number,
    status:any
}