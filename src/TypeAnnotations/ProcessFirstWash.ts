import type BundleInfo from "./BundleInfo";
import type { Machine } from "./Machine";



export interface BatchBundle {
  received: BundleInfo;
}
export interface Batch {
  id: number;
  batch_bundles: BatchBundle[];
}
export interface SourceBundle{
  bundle:BundleInfo;
  quantity:number,
}
export interface SourceBatch {
  batch: Batch;
  quantity: number;
}
export interface BatchForFirstWash {
  id: number;
  buyer:string,
  color:string
  shade: string;
  stage:string,
  type:string,
  rejection_count:number, 
  total_quantity:number
}
export interface ProcessFirstWash {
  id: number;
  batch: BatchForFirstWash;
  machine: Machine;
  standard_time:string,
  loading_start: string;
  loading_started_by: string;
  loading_finish: string | null;
  loading_finished_by: string | null;
  process_finish: string | null;
  process_finished_by: string | null;
  unload_finish: string | null;
  unload_finished_by: string | null;
}