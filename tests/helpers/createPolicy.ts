import { Policy } from "../../src/models/Policy";

export const createPolicy = (overrides?: Partial<Policy>): Policy => {
    const basePolicy: Policy = {
      policyId: 'POL-TEST',
      startDate: new Date('2022-01-01'),
      endDate: new Date('2025-12-31'),
      deductible: 500,
      coverageLimit: 10000,
      coveredIncidents: ['accident', 'fire', 'theft', 'water damage'],
    };
    return { ...basePolicy, ...overrides };
  };