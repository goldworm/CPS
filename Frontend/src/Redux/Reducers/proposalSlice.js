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

    votesByProposal: [
        {
            sponsorAddress: 'hxe59539154a3d77023943c3bbd5fc3a081d697e6a',
            status: 'Approved',
            timestamp: 1600872145290985
        },

        {
            sponsorAddress: 'hxe59539154a3d77023943c3bbd5fc3a081d697e6a',
            status: 'Approved',
            timestamp: 1600872145290985
        },

        {
            sponsorAddress: 'hxe59539154a3d77023943c3bbd5fc3a081d697e6a',
            status: 'Rejected',
            timestamp: 1600872145290985
        },

        {
            sponsorAddress: 'hxe59539154a3d77023943c3bbd5fc3a081d697e6a',
            status: 'Rejected',
            timestamp: 1600872145290985
        },

        
    ]
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
                        ipfsKey: proposal._ipfs_key
                    }
                )
            );
            console.log(fetchProposalListSuccess);
            // console.log(Math.ceil(IconConverter.toNumber(action.payload.response[0].count) / 10));
            console.log(action.payload.status);
            // state.totalPages[action.payload.status] = Math.ceil(IconConverter.toNumber(action.payload.response[0].count) / 10)
            state.totalPages[action.payload.status] = Math.ceil(IconConverter.toNumber(action.payload.response.count) / 10)
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
                    ipfsKey: proposal._ipfs_key
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

            
            return;
        },  
        fetchVoteResultFailure() {
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
    fetchVoteResultRequest, fetchVoteResultSuccess, fetchVoteResultFailure } = proposalSlice.actions;
export default proposalSlice.reducer;