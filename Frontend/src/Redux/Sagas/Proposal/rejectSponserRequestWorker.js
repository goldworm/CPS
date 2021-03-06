import { sendTransaction } from 'Redux/ICON/utils';

function* rejectSponserRequestWorker({ payload }) {

    const params = {
        _ipfs_key: payload.ipfsKey,
        _vote: '_reject',
        _vote_reason: payload.reason,

    }

    sendTransaction({
        method: 'sponsor_vote',
        params,
        id: 'reject_sponsor'
    }
    )

    console.log(params);
}

export default rejectSponserRequestWorker;