import { Claim } from "../../src/models/Claim";

export const createClaim = (overrides?: Partial<Claim>): Claim => {
    const baseClaim: Claim = {
        policyId: 'POL-TEST',
        incidentType: 'fire',
        incidentDate: new Date('2023-06-15'),
        amountClaimed: 3000,
    };
    return { ...baseClaim, ...overrides };
  };