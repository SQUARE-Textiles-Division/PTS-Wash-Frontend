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
  // "id",
  // "buyer",
  // "color",
  // "shade",
  // "stage",
  // "type",
  // "rejection_count",
  // "total_quantity",
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
  unloading_finish: string | null;
  unloading_finished_by: string | null;
}


//  "id",
//   "batch",
//   "machine",
//   "standard_time",
//   "loading_start",
//   "loading_started_by",
//   "loading_finish",
//   "loading_finished_by",
//   "process_finish",
//   "process_finished_by",
//   "unload_finish",
//   "unload_finished_by",