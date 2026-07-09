import type IndividualInfo from "./IndividualInfo";

export default interface IndividualInOut {
    id: number;
    garment_unit: IndividualInfo;
    stage: string;
    action: string;
    rejection_reason: string;
    scanned_at: string;
    operator: string;
}