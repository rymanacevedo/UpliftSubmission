import { createPolicy } from './../helpers/createPolicy';
import { createClaim } from './../helpers/createClaim';
import { ReasonCode } from '../../src/models/ReasonCode';
import { ClaimProcessor } from './../../src/services/ClaimProcessor';

describe('ClaimProcessor Evaluation', () => {
    let processor: ClaimProcessor;
    beforeEach(() => {
        processor = new ClaimProcessor();
    });

    it('should deny claim if policy is expired', async() => {
        const expiredPolicy = createPolicy({
            startDate: new Date('2023-07-01'),
            endDate: new Date('2024-07-01'),
          });
          const claim = createClaim();
      
        const {approved} = processor.evaluateClaim(claim, expiredPolicy);
        expect(approved).toBe(false);
    });

    it('should deny claim if claim is before policy start date', async() => {
        const policy = createPolicy({
            startDate: new Date('2023-07-01'),
          });
          const claimBeforeStartDate = createClaim({
            incidentDate: new Date('2023-06-01')
          });   
          const {approved} = processor.evaluateClaim(claimBeforeStartDate, policy);
          expect(approved).toBe(false);
    });
    
    it('should deny claim if incidentType is not covered', async() => {

        const notCoveredPolicy = createPolicy({
            coveredIncidents: ['accident', 'theft'],
        })
        const claim = createClaim({incidentType: 'fire'});
        const {approved} = processor.evaluateClaim(claim, notCoveredPolicy);
        expect(approved).toBe(false);
    });
    
    it('should payout the amount claimed minus deductible', async() => {
        const validPolicy = createPolicy({
            deductible: 500
        });
        const claim = createClaim({amountClaimed: 2000});
        
        const {payout} = processor.evaluateClaim(claim, validPolicy);
        expect(payout).toBe(claim.amountClaimed - validPolicy.deductible);
    }
    );
    
    it('should return zero if payout is negative', async() => {
        const validPolicyWithLargeDeductible = createPolicy({
            deductible: 3000
        });
        const claim = createClaim({amountClaimed: 2000});
        const {payout, reasonCode} = processor.evaluateClaim(claim, validPolicyWithLargeDeductible);
        expect(payout).toBe(0);
        expect(reasonCode).toBe(ReasonCode.ZERO_PAYOUT);
    });
    
    it('should return zero if payout is zero because deductible is equal to amount claimed', async() => {
        const validPolicyWithEqualDeductible = createPolicy({
            deductible: 3000
        });
        const claim = createClaim({amountClaimed: 3000});
        const {payout, reasonCode} = processor.evaluateClaim(claim, validPolicyWithEqualDeductible);
        expect(payout).toBe(0);
        expect(reasonCode).toBe(ReasonCode.ZERO_PAYOUT);
    });
    
    it('should return no more then the coverage limit', async() => {
        const policyWithLowCoverageLimit = createPolicy({
            coverageLimit: 1000
        });
        const claim = createClaim({amountClaimed: 2000});
    
        const {payout} = processor.evaluateClaim(claim, policyWithLowCoverageLimit);
        expect(payout).toBeLessThanOrEqual(policyWithLowCoverageLimit.coverageLimit);
    });
}
);