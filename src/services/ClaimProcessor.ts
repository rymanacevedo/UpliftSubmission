import type { ClaimStatus } from './../models/ClaimStatus';
import { Claim } from "../models/Claim";
import { Policy } from "../models/Policy";
import { ReasonCode } from '../models/ReasonCode';

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
                reasonCode: ReasonCode.POLICY_NOT_FOUND,
                payout: 0
            };
        }

        if(policy.endDate < new Date()) {
            return {
                status: 'denied',
                reasonCode: ReasonCode.POLICY_EXPIRED,
                payout: 0
            };
        }

        if(!policy.coveredIncidents.includes(claim.incidentType)) {
            return {
                status: 'denied',
                reasonCode: ReasonCode.NOT_COVERED,
                payout: 0
            };
        }

        const payout = claim.amountClaimed - policy.deductible;

        if(payout <= 0) {
            return {
                status: 'denied',
                reasonCode: ReasonCode.ZERO_PAYOUT,
                payout: 0
            }
        }


        return {
            status: 'approved',
            reasonCode: null,
            payout
        }
    }
}