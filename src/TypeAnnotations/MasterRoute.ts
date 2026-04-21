interface SubSteps{
    id: number,
    sequence: number,
    stage: string
}
interface RouteSteps{
    id: number,
    sequence: number,
    stage: string,
    sub_steps:SubSteps[]
}
export default interface MasterRoute{
    id: number,
    buyer: string,
    style:string,
    color: string,
    last_update: string,
    updated_by: string,
    route_steps:RouteSteps[]
}