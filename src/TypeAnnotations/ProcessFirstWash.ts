import type BundleInfo from "./BundleInfo";
import type { Machine } from "./Machine";



export interface BatchBundle {
  id: number;
  received: BundleInfo;
}
export interface Batch {
  id: number;
  batch_bundles: BatchBundle[];
}

export interface SourceBatch {
  batch: Batch;
  quantity: number;
}
export interface BatchForFirstWash {
  id: number;
  shade: string;
  total_quantity: number;
  status: string | null;
  source_batches: SourceBatch[];
}
export interface ProcessFirstWash {
  id: number;
  batch_for_first_wash: BatchForFirstWash;
  machine: Machine;
  loading_start: string;
  loading_started_by: string;
  loading_finish: string | null;
  loading_finished_by: string | null;
  process_finish: string | null;
  process_finished_by: string | null;
  unload_finish: string | null;
  unload_finished_by: string | null;
}