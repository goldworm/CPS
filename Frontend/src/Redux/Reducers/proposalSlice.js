import { createSlice } from '@reduxjs/toolkit';
import {IconConverter} from 'icon-sdk-js';
import {proposalStatusMapping} from 'Constants';
import { voteProgressReport } from './progressReportSlice';

const initialState = {
    numberOfSubmittedProposals: 29,
    totalSubmittedProposalBudget: 1240000,

    numberOfApprovedProposals: 29,
    totalApprovedProposalBudget: 1240000,

    numberOfPendingProposals: 235,
    totalPendingProposalBudge: 42900,
    cpfRemainingFunds: 549300,
    submittingProposal: false,
    proposalDetail: null,
    modalShowSponsorRequests: false,
    modalShowVoting: false,


    proposalList: {
        Active: [],
        Voting: [],
        Completed: [],
        Pending: [],
        Disqualified: [],
        Paused: [],
        Rejected: [],
        Draft: []
    },

    totalPages: {
        Active: 0,
        Voting: 0,
        Completed: 0,
        Pending: 0,
        Disqualified: 0,
        Paused: 0,
        Rejected: 0
    },

    totalCount: {
        Active: 0,
        Voting: 0,
        Completed: 0,
        Pending: 0,
        Disqualified: 0,
        Paused: 0,
        Rejected: 0
    },

    sponsorRequestsList: {
        Pending: [],
        Approved: [],
        Rejected: [],
    },

    totalPagesSponsorRequests: {
        Pending: 0,
        Approved: 0,
        Rejected: 0,
    },

    proposalByAddress: [],

    votesByProposal: [],

    projectAmounts: {
        Active: {
            amount: 0,
            count: 0,
        },
        Voting: {
            amount: 0,
            count: 0,
        },
        Completed: {
            amount: 0,
            count: 0,
        },
        Pending: {
            amount: 0,
            count: 0,
        },
        Disqualified: {
            amount: 0,
            count: 0,
        },
        Paused: {
            amount: 0,
            count: 0,
        },
        Rejected: {
            amount: 0,
            count: 0,
        }
    }
};

const proposalSlice = createSlice({
    name: 'proposal',
    initialState,
    reducers: {
        submitProposalRequest(state) {
            state.submittingProposal = true
        },
        submitProposalSuccess(state) {
            state.submittingProposal = false
        },
        submitProposalFailure(state) {
            state.submittingProposal = false
        },

        fetchProposalListRequest(state) {
            return;
        },
        fetchProposalListSuccess(state, action) {
            // state.proposalList = action.payload
            // state.proposalList.


            state.proposalList[action.payload.status][action.payload.pageNumber - 1] = action.payload.response.data.map (
                proposal => (
                    {
                        _status: proposal._status,
                        _proposal_title: proposal._proposal_title,
                        _contributor_address: proposal._contributor_address,
                        budget: parseInt(proposal.budget),
                        _timestamp: proposal._timestamp,
                        ipfsHash: proposal._ipfs_hash,
                        ipfsKey: proposal._ipfs_key,
                        approvedVotes: IconConverter.toBigNumber(proposal.approved_votes),
                        totalVotes: IconConverter.toBigNumber(proposal.total_votes),
                        approvedPercentage: (!proposal.total_votes || parseInt(proposal.total_votes) === 0) ? 0 : ((proposal.approved_votes / proposal.total_votes) * 100),
                        completedPercentage: parseInt(IconConverter.toBigNumber(proposal.percentage_completed)),
                        // if(parseInt(totalVoters) === 0) {
                        //     return 0;
                        //   }
                        //   return (approvedVoters/totalVoters) * 100;
                    }
                )
            );
            console.log(fetchProposalListSuccess);
            // console.log(Math.ceil(IconConverter.toNumber(action.payload.response[0].count) / 10));
            console.log(action.payload.status);
            // state.totalPages[action.payload.status] = Math.ceil(IconConverter.toNumber(action.payload.response[0].count) / 10)
            state.totalPages[action.payload.status] = Math.ceil(IconConverter.toNumber(action.payload.response.count) / 10);
            state.totalCount[action.payload.status] = IconConverter.toNumber(action.payload.response.count)

            return;
        },
        fetchProposalListFailure(state) {
            return;
        },
        updateProposalStatus(state, action) {
            return;
        },

        fetchProposalDetailRequest() {
            return;
        },

        fetchProposalDetailSuccess(state, payload) {
            state.proposalDetail =  payload.payload.response;
        },

        fetchProposalDetailFailure() {
            return;
        },


        fetchSponsorRequestsListRequest(state) {
            return;
        },
        fetchSponsorRequestsListSuccess(state, action) {

            // state.proposalList[action.payload.status][action.payload.pageNumber - 1] = action.payload.response.data.map (
            //     proposal => (
            //         {
            //             _status: proposal._status,
            //             _proposal_title: proposal._proposal_title,
            //             _contributor_address: proposal._contributor_address,
            //             budget: proposal.budget,
            //             _timestamp: proposal._timestamp,
            //             ipfsHash: proposal._ipfs_hash,
            //             ipfsKey: proposal._ipfs_key
            //         }
            //     )
            // );
            // console.log(fetchProposalListSuccess);
            // // console.log(Math.ceil(IconConverter.toNumber(action.payload.response[0].count) / 10));
            // console.log(action.payload.status);
            // // state.totalPages[action.payload.status] = Math.ceil(IconConverter.toNumber(action.payload.response[0].count) / 10)
            // state.totalPages[action.payload.status] = Math.ceil(IconConverter.toNumber(action.payload.response.count) / 10)
            // return;

            state.sponsorRequestsList[action.payload.status][action.payload.pageNumber - 1] = action.payload.response.data.map (
                proposal => (
                    {
                        _status: proposal._status,
                        _proposal_title: proposal._proposal_title,
                        _contributor_address: proposal._contributor_address,
                        budget: parseInt(proposal.budget),
                        _timestamp: proposal._timestamp,
                        ipfsHash: proposal._ipfs_hash,
                        ipfsKey: proposal._ipfs_key
                    }
                )
            );
            state.totalPagesSponsorRequests[action.payload.status] = Math.ceil(IconConverter.toNumber(action.payload.response.count) / 10)
            return;
        },
        fetchSponsorRequestsListFailure(state) {
            return;
        },

        approveSponserRequest(state) {
            return;
        },
        rejectSponsorRequest(state) {
            return;
        },

        voteProposal(state) {
            return;
        },


        saveDraftRequest(state) {
            return;
        },
        saveDraftSuccess(state) {
            return;
        },
        saveDraftFailure(state) {
            return;
        },

        fetchDraftsRequest(state) {
            return;
        },
        fetchDraftsSuccess(state, payload) {
            state.proposalList["Draft"] = payload.payload.response.data;
        },
        fetchDraftsFailure(state) {
            return;
        },

        fetchProposalByAddressRequest(state) {
            return;
        },

        fetchProposalByAddressSuccess(state, action) {
            console.group("fetchProposalByAddressSuccess");
            console.log("fetchProposalByAddressSuccess");
            console.groupEnd();
            state.proposalByAddress = action.payload.response.map(proposal => (
                {
                    _proposal_title: proposal._proposal_title,
                    ipfsKey: proposal._ipfs_key,
                    newProgressReport: !!parseInt(proposal.new_progress_report)
                }
            ));
            return;
        },

        fetchProposalByAddressFailure(state) {
            return;
        },
        setModalShowSponsorRequests(state, action) {
            state.modalShowSponsorRequests = action.payload;
        },
        setModalShowVoting(state, action) {
            state.modalShowVoting = action.payload;
        },

        fetchVoteResultRequest() {
            return;
        },
        fetchVoteResultSuccess(state, action) {
            state.votesByProposal = action.payload.response.data.map(vote => (
                {
                    sponsorAddress: vote.address,
                    status: proposalStatusMapping.find(mapping =>
                        mapping.status === vote.vote)?.name,
                    timestamp: vote._timestamp
                }
            ));
            state.votesByProposal = state.votesByProposal.filter(vote => 
                vote.status);

            state.approvedVotes = IconConverter.toBigNumber(action.payload.response.approved_votes);
            state.totalVotes = IconConverter.toBigNumber(action.payload.response.total_votes);
            state.rejectedVotes = IconConverter.toBigNumber(action.payload.response.rejected_votes);

            state.approvedVoters = IconConverter.toBigNumber(action.payload.response.approve_voters);
            state.rejectedVoters = IconConverter.toBigNumber(action.payload.response.reject_voters);
            state.totalVoters = IconConverter.toBigNumber(action.payload.response.total_voters);

            
            return;
        },  
        fetchVoteResultFailure() {
            return;
        },
        
        
        fetchProjectAmountsRequest(state) {
            return;
        },
        fetchProjectAmountsSuccess(state, action) {
            // state.proposalList = action.payload
            // state.proposalList.
            for(const proposalStatus of proposalStatusMapping) {
                state.projectAmounts[proposalStatus.name] = {
                    amount: parseFloat(IconConverter.toBigNumber(action.payload[proposalStatus.status]?._total_amount ?? 0)),
                    count: parseInt(IconConverter.toBigNumber(action.payload[proposalStatus.status]?._count ?? 0))
                }
            }
            return;
        },
        fetchProjectAmountsFailure(state) {
            return;
        },
    },
})

export const { submitProposalRequest, submitProposalSuccess, submitProposalFailure,
    fetchProposalListRequest, fetchProposalListSuccess, fetchProposalListFailure, updateProposalStatus,
    fetchProposalDetailRequest, fetchProposalDetailSuccess, fetchProposalDetailFailure,
    fetchSponsorRequestsListRequest, fetchSponsorRequestsListSuccess, fetchSponsorRequestsListFailure, 
    approveSponserRequest, rejectSponsorRequest,
    saveDraftRequest, saveDraftSuccess, saveDraftFailure,
    fetchDraftsRequest, fetchDraftsSuccess, fetchDraftsFailure,
    voteProposal,
    fetchProposalByAddressRequest, fetchProposalByAddressSuccess, fetchProposalByAddressFailure,
    setModalShowSponsorRequests, setModalShowVoting, 
    fetchVoteResultRequest, fetchVoteResultSuccess, fetchVoteResultFailure,
    fetchProjectAmountsRequest, fetchProjectAmountsSuccess, fetchProjectAmountsFailure } = proposalSlice.actions;
export default proposalSlice.reducer;