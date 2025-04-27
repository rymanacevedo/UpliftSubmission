import { IncidentType } from "./Incident";

export interface Policy {
    policyId: string;
    startDate: Date;
    endDate: Date;
    deductible: number;
    coverageLimit: number;
    coveredIncidents: IncidentType[];
  }