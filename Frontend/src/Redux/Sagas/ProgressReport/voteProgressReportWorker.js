import { sendTransaction } from 'Redux/ICON/utils';

const voteStatusMapping = {
    Abstain: '_abstain',
    Reject: '_reject',
    Approve: '_approve'
}

function* voteProgressReportWorker({ payload }) {

    const params = {
        _vote: voteStatusMapping[payload.vote],
        _budget_adjustment_vote: voteStatusMapping[payload.voteProjectTermRevision],
        _vote_reason: payload.voteReason,
        _ipfs_key: payload.proposalKey,
        _report_key: payload.reportKey
    }

    sendTransaction({
        method: 'vote_progress_report',
        params,
    }
    )

    console.log(params);
}

export default voteProgressReportWorker;