import { Policy } from '../../src/models/Policy';
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
    processor.evaluateClaim(exampleClaim, expiredPolicy);
    expect(processor.getClaimStatus()).toBe('denied');
});

it('should approve a claim', async() => {
    const processor = new ClaimProcessor();
    processor.evaluateClaim({}, []);
    expect(processor.getClaimStatus()).toBe('approved');
});