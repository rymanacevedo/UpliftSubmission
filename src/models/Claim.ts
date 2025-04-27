import { IncidentType } from "./Incident";

export type Claim = {
 policyId: string;
 incidentType: IncidentType;
 incidentDate: Date;
 amountClaimed: number;
}