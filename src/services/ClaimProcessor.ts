import type { Claim } from '../models/Claim';
import type { Policy } from '../models/Policy';
import { ReasonCode } from '../models/ReasonCode';

interface ClaimResult {
	approved: boolean;
	reasonCode: string | null;
	payout: number;
}

export class ClaimProcessor {
	public evaluateClaim(claim: Claim, policy: Policy): ClaimResult {
		if (!policy) {
			return {
				approved: false,
				reasonCode: ReasonCode.POLICY_NOT_FOUND,
				payout: 0,
			};
		}

		if (policy.endDate < new Date() || claim.incidentDate < policy.startDate) {
			return {
				approved: false,
				reasonCode: ReasonCode.POLICY_EXPIRED,
				payout: 0,
			};
		}

		if (!policy.coveredIncidents.includes(claim.incidentType)) {
			return {
				approved: false,
				reasonCode: ReasonCode.NOT_COVERED,
				payout: 0,
			};
		}

		const payout = claim.amountClaimed - policy.deductible;

		if (payout <= 0) {
			return {
				approved: false,
				reasonCode: ReasonCode.ZERO_PAYOUT,
				payout: 0,
			};
		}

		if (payout > policy.coverageLimit) {
			return {
				approved: true,
				reasonCode: ReasonCode.COVERAGE_LIMIT_EXCEEDED,
				payout: policy.coverageLimit,
			};
		}

		return {
			approved: true,
			reasonCode: ReasonCode.APPROVED,
			payout,
		};
	}
}
