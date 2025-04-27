import type { ClaimStatus } from './../models/ClaimStatus';
import { Claim } from "../models/Claim";
import { Policy } from "../models/Policy";
import { ReasonCode } from '../models/ReasonCode';

interface ClaimResult {
    approved: boolean;
    reasonCode: string | null;
    payout: number;
}

export class ClaimProcessor {
    public evaluateClaim(claim: Claim, policy: Policy): ClaimResult {
        if(!policy) {
            return {
                approved: false,
                reasonCode: ReasonCode.POLICY_NOT_FOUND,
                payout: 0
            };
        }

        if(policy.endDate < new Date()) {
            return {
                approved: false,
                reasonCode: ReasonCode.POLICY_EXPIRED,
                payout: 0
            };
        }

        if(!policy.coveredIncidents.includes(claim.incidentType)) {
            return {
                approved: false,
                reasonCode: ReasonCode.NOT_COVERED,
                payout: 0
            };
        }

        const payout = claim.amountClaimed - policy.deductible;

        if(payout <= 0) {
            return {
                approved: false,
                reasonCode: ReasonCode.ZERO_PAYOUT,
                payout: 0
            }
        }


        return {
            approved: true,
            reasonCode: ReasonCode.APPROVED,
            payout
        }
    }
}