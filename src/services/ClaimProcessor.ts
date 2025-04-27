import type { ClaimStatus } from './../models/ClaimStatus';
import { Claim } from "../models/Claim";
import { Policy } from "../models/Policy";


export class ClaimProcessor {
    private claimStatus: ClaimStatus;

    constructor() {
        this.claimStatus = 'pending';
    }

    public evaluateClaim(claim: Claim, policy: Policy) {
        if(!policy) {
            this.claimStatus = 'denied';
            return;
        }

        if(policy.endDate < new Date()) {
            this.claimStatus = 'denied';
            return;
        }

        if(!policy.coveredIncidents.includes(claim.incidentType)) {
            this.claimStatus = 'denied';
            return;
        }
    }

    public getClaimStatus(): ClaimStatus {
        return this.claimStatus;
    }
}