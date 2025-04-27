import { Policy } from '../../src/models/Policy';
import { ReasonCode } from '../../src/models/ReasonCode';
import { exampleClaim } from './../../data/claim';
import { ClaimProcessor } from './../../src/services/ClaimProcessor';

it('should deny claim if no policy is expired', async() => {
    const processor = new ClaimProcessor();
    const expiredPolicy: Policy = {
        policyId: 'POL123',
        startDate: new Date('2022-01-01'),
        endDate: new Date('2023-01-01'),
        deductible: 500,
        coverageLimit: 10000,
        coveredIncidents: ['accident', 'fire'],
    }
    const {status} = processor.evaluateClaim(exampleClaim, expiredPolicy);
    expect(status).toBe('denied');
});

it('should deny claim if incidentType is not covered', async() => {
    const processor = new ClaimProcessor();
    const notCoveredPolicy: Policy = {
        policyId: 'POL123',
        startDate: new Date('2022-01-01'),
        endDate: new Date('2023-01-01'),
        deductible: 500,
        coverageLimit: 10000,
        coveredIncidents: ['accident', 'fire'],
    }
    const {status} = processor.evaluateClaim(exampleClaim, notCoveredPolicy);
    expect(status).toBe('denied');
});

it('should payout the amount claimed minus deductible', async() => {
    const processor = new ClaimProcessor();
    const validPolicy: Policy = {
        policyId: 'POL123',
        startDate: new Date('2022-01-01'),
        endDate: new Date('2025-12-31'),
        deductible: 500,
        coverageLimit: 10000,
        coveredIncidents: ['accident', 'fire'],
    }
    
    const {payout} = processor.evaluateClaim(exampleClaim, validPolicy);
    expect(payout).toBe(exampleClaim.amountClaimed - validPolicy.deductible);
}
);

it('should return zero if payout is negative', async() => {
    const processor = new ClaimProcessor();
    const validPolicyWithLargeDeductible: Policy = {
        policyId: 'POL123',
        startDate: new Date('2022-01-01'),
        endDate: new Date('2025-12-31'),
        deductible: 5000,
        coverageLimit: 10000,
        coveredIncidents: ['accident', 'fire'],
    }
    const {payout, reasonCode} = processor.evaluateClaim(exampleClaim, validPolicyWithLargeDeductible);
    expect(payout).toBe(0);
    expect(reasonCode).toBe(ReasonCode.ZERO_PAYOUT);
});

it('should return zero if payout is zero because deductible is equal to amount claimed', async() => {
    const processor = new ClaimProcessor();
    const validPolicyWithEqualDeductible: Policy = {
        policyId: 'POL123',
        startDate: new Date('2022-01-01'),
        endDate: new Date('2025-12-31'),
        deductible: exampleClaim.amountClaimed,
        coverageLimit: 10000,
        coveredIncidents: ['accident', 'fire'],
    }
    const {payout, reasonCode} = processor.evaluateClaim(exampleClaim, validPolicyWithEqualDeductible);
    expect(payout).toBe(0);
    expect(reasonCode).toBe(ReasonCode.ZERO_PAYOUT);
});

// it('should approve a claim', async() => {
//     const processor = new ClaimProcessor();
//     processor.evaluateClaim({}, []);
//     expect(processor.getClaimStatus()).toBe('approved');
// });