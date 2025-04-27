import type { ClaimStatus } from './../models/ClaimStatus';
import { Claim } from "../models/Claim";
import { Policy } from "../models/Policy";

interface ClaimResult {
    status: ClaimStatus;
    reasonCode: string | null;
    payout: number;
}

export class ClaimProcessor {


    public evaluateClaim(claim: Claim, policy: Policy): ClaimResult {
        if(!policy) {
            return {
                status: 'denied',
                reasonCode: 'policy_not_found',
                payout: 0
            };
        }

        if(policy.endDate < new Date()) {
            return {
                status: 'denied',
                reasonCode: 'policy_expired',
                payout: 0
            };
        }

        if(!policy.coveredIncidents.includes(claim.incidentType)) {
            return {
                status: 'denied',
                reasonCode: 'incident_not_covered',
                payout: 0
            };
        }

        const payout = claim.amountClaimed - policy.deductible;

        return {
            status: 'approved',
            reasonCode: null,
            payout
        }
    }
}