import { Claim } from "../src/models/Claim";

export const exampleClaim: Claim = {
    policyId: 'POL123',
    incidentType: 'fire',
    incidentDate: new Date('2023-06-15'),
    amountClaimed: 3000,
  };