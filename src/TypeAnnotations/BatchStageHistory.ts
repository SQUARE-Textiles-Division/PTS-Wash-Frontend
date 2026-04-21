export default interface BatchStageHistory{
    id:number,
    batch: number,
    stage: string,
    sequence: number,
    entered_at: string,
    closed_at: string,
    entered_by: string,
    closed_by: string
}