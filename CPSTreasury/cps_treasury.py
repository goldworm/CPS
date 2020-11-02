from iconservice import *

_MULTIPLIER = 10 ** 18

class CPF_TREASURY_INTERFACE(InterfaceScore):
    @interface
    def disqualify_proposal_fund(self, _ipfs_key: str):
        pass


class CPS_TREASURY(IconScoreBase):
    _PROPOSALS_KEYS = "_proposals_keys"
    _PROPOSALS_DETAILS = "_proposals_details"

    _TOTAL_INSTALLMENT_COUNT = "_total_installment_count"

    _TOTAL_TIMES_INSTALLMENT_PAID = "_total_times_installment_paid"
    _TOTAL_TIMES_REWARD_PAID = "_total_times_reward_paid"

    _CPS_SCORE = "_cps_score"
    _CPF_TREASURY_SCORE = "_cpf_treasury_score"

    _TOTAL_BUDGET = "_total_budget"
    _TOTAL_INSTALLMENT_PAID = "_total_installment_paid"
    _TOTAL_REWARD_PAID = "_total_reward_paid"
    _SPONSOR_ADDRESS = '_sponsor_address'
    _CONTRIBUTOR_ADDRESS = "_contributor_address"
    _STATUS = "_status"
    _PROPOSAL_TITLE = "_proposal_title"
    _IPFS_KEY = "_ipfs_key"
    _SPONSOR_REWARD = "_sponsor_reward"

    _ACTIVE = "active"
    _DISQUALIFIED = "disqualified"

    @eventlog(indexed=3)
    def ProposalFundDeposited(self, _ipfs_key: str, _total_budget: int, note: str):
        pass

    @eventlog(indexed=3)
    def ProposalFundSent(self, _receiver_address: Address, _fund: int, note: str):
        pass

    @eventlog(indexed=2)
    def ProposalDisqualified(self, _ipfs_key: str, note: str):
        pass

    def __init__(self, db: IconScoreDatabase) -> None:
        super().__init__(db)
        self._proposals_keys = ArrayDB(self._PROPOSALS_KEYS, db, value_type=str)
        self._proposals_details = DictDB(self._PROPOSALS_DETAILS, db, value_type=str, depth=2)

        self._cpf_treasury_score = VarDB(self._CPF_TREASURY_SCORE, db, value_type=Address)
        self._cps_score = VarDB(self._CPS_SCORE, db, value_type=Address)

    def on_install(self) -> None:
        super().on_install()

    def on_update(self) -> None:
        super().on_update()

    @external(readonly=True)
    def name(self) -> str:
        return "CPS_TREASURY_SCORE"

    @external
    def set_cps_score(self, _score: Address) -> None:
        if self.msg.sender == self.owner and _score.is_contract:
            self._cps_score.set(_score)

    @external(readonly=True)
    def get_cps_score(self) -> Address:
        return self._cps_score.get()

    @external
    def set_cpf_treasury_score(self, _score: Address) -> None:
        if self.msg.sender == self.owner and _score.is_contract:
            self._cpf_treasury_score.set(_score)

    @external(readonly=True)
    def get_cpf_treasury_score(self) -> Address:
        return self._cpf_treasury_score.get()

    @external(readonly=True)
    def get_total_fund(self) -> int:
        return self.icx.get_balance(self.address)

    @external
    @payable
    def deposit_proposal_fund(self, _ipfs_key: str, _total_installment_count: int, _title: str, _sponsor_address: str,
                           _contributor_address: str, _total_budget: int) -> None:
        if _ipfs_key not in self._proposals_keys:
            self._proposals_keys.put(_ipfs_key)
            self._proposals_details[_ipfs_key][self._TOTAL_INSTALLMENT_COUNT] = str(_total_installment_count)
            self._proposals_details[_ipfs_key][self._PROPOSAL_TITLE] = _title
            self._proposals_details[_ipfs_key][self._TOTAL_BUDGET] = str(_total_budget)
            self._proposals_details[_ipfs_key][self._SPONSOR_REWARD] = str(int(self.msg.value) - _total_budget)
            self._proposals_details[_ipfs_key][self._TOTAL_INSTALLMENT_PAID] = str(0)
            self._proposals_details[_ipfs_key][self._TOTAL_TIMES_INSTALLMENT_PAID] = str(0)
            self._proposals_details[_ipfs_key][self._TOTAL_TIMES_REWARD_PAID] = str(0)
            self._proposals_details[_ipfs_key][self._TOTAL_REWARD_PAID] = str(0)
            self._proposals_details[_ipfs_key][self._SPONSOR_ADDRESS] = _sponsor_address
            self._proposals_details[_ipfs_key][self._CONTRIBUTOR_ADDRESS] = _contributor_address
            self._proposals_details[_ipfs_key][self._STATUS] = self._ACTIVE

            self.ProposalFundDeposited(_ipfs_key, _total_budget, "Successfully deposited fund")
        else:
            revert("IPFS key already Exists")

    @external
    @payable
    def update_proposal_fund(self, _ipfs_key: str, _total_added_budget: int = 0, _total_added_installment_count: int = 0) -> None:
        if _ipfs_key in self._proposals_keys:
            if self._proposals_details[_ipfs_key][self._STATUS] == self._DISQUALIFIED:
                revert('The project has been disqualified.')

            self._proposals_details[_ipfs_key][self._TOTAL_BUDGET] = str(
                int(self._proposals_details[_ipfs_key][self._TOTAL_BUDGET]) + _total_added_budget)

            self._proposals_details[_ipfs_key][self._SPONSOR_REWARD] = str(
                int(self._proposals_details[_ipfs_key][self._SPONSOR_REWARD]) + int(self.msg.value) - _total_added_budget
            )

            self._proposals_details[_ipfs_key][self._TOTAL_INSTALLMENT_COUNT] = str(
                int(self._proposals_details[_ipfs_key][self._TOTAL_INSTALLMENT_COUNT]) + _total_added_installment_count
            )

            self.ProposalFundDeposited(_ipfs_key, _total_added_budget, "Successfully updated fund")
        else:
            revert("IPFS key doesn't exist")

    @external
    def send_installment_to_contributor(self, _ipfs_key: str) -> None:
        if _ipfs_key in self._proposals_keys:
            try:
                amount = int((int(self._proposals_details[_ipfs_key][self._TOTAL_BUDGET]) - int(self._proposals_details[_ipfs_key][self._TOTAL_INSTALLMENT_PAID])) / (int(self._proposals_details[_ipfs_key][self._TOTAL_INSTALLMENT_COUNT]) - int(self._proposals_details[_ipfs_key][self._TOTAL_TIMES_INSTALLMENT_PAID])))

                self._proposals_details[_ipfs_key][self._TOTAL_INSTALLMENT_PAID] = str(
                    int(self._proposals_details[_ipfs_key][self._TOTAL_INSTALLMENT_PAID]) + amount)

                self._proposals_details[_ipfs_key][self._TOTAL_TIMES_INSTALLMENT_PAID] = str(
                    int(self._proposals_details[_ipfs_key][self._TOTAL_TIMES_INSTALLMENT_PAID]) + 1)
                
                self.icx.transfer(Address.from_string(self._proposals_details[_ipfs_key][self._CONTRIBUTOR_ADDRESS]),
                                amount)

                self.ProposalFundSent(Address.from_string(self._proposals_details[_ipfs_key][self._CONTRIBUTOR_ADDRESS]), amount, "Fund transferred to contributor")
            except BaseException as e:
                revert(f'Network problem. Sending project funds. {e}')

    @external
    def send_reward_to_sponsor(self, _ipfs_key: str) -> None:
        if _ipfs_key in self._proposals_keys:
            try:
                amount = int((int(self._proposals_details[_ipfs_key][self._SPONSOR_REWARD]) - int(self._proposals_details[_ipfs_key][self._TOTAL_REWARD_PAID])) / (int(self._proposals_details[_ipfs_key][self._TOTAL_INSTALLMENT_COUNT]) - int(self._proposals_details[_ipfs_key][self._TOTAL_TIMES_REWARD_PAID])))

                self._proposals_details[_ipfs_key][self._TOTAL_REWARD_PAID] = str(
                    int(self._proposals_details[_ipfs_key][self._TOTAL_REWARD_PAID]) + amount)

                self._proposals_details[_ipfs_key][self._TOTAL_TIMES_REWARD_PAID] = str(
                    int(self._proposals_details[_ipfs_key][self._TOTAL_TIMES_REWARD_PAID]) + 1)
                
                self.icx.transfer(Address.from_string(self._proposals_details[_ipfs_key][self._SPONSOR_ADDRESS]),
                                amount)

                self.ProposalFundSent(Address.from_string(self._proposals_details[_ipfs_key][self._SPONSOR_ADDRESS]), amount, "Fund transferred to sponsor")
            except BaseException as e:
                revert(f'Network problem. Sending project funds. {e}')

    @external
    def disqualify_project(self, _ipfs_key: str) -> None:
        if _ipfs_key in self._proposals_keys:
            self._proposals_details[_ipfs_key][self._STATUS] = self._DISQUALIFIED
            self._proposals_details[_ipfs_key][self._TOTAL_BUDGET] = self._proposals_details[_ipfs_key][self._TOTAL_INSTALLMENT_PAID]

            total_disqualified_budget = int(self._proposals_details[_ipfs_key][self._TOTAL_BUDGET]) - int(self._proposals_details[_ipfs_key][self._TOTAL_INSTALLMENT_PAID])
            total_disqualified_reward = int(self._proposals_details[_ipfs_key][self._SPONSOR_REWARD]) - int(self._proposals_details[_ipfs_key][self._TOTAL_REWARD_PAID])
            # return remaining fund amount to the CPF
            try:
                cpf_treasury_score = self.create_interface_score(self._cpf_treasury_score.get(), CPF_TREASURY_INTERFACE)
                cpf_treasury_score.icx(total_disqualified_budget + total_disqualified_reward).disqualify_proposal_fund(_ipfs_key)

                self.ProposalDisqualified(_ipfs_key, "Proposal disqualified")
            except BaseException as e:
                revert(f"Network problem. Sending proposal funds. {e}")
        else:
            revert("IPFS key doesn't exist")

    @external(readonly=True)
    def get_proposals_details_list(self, _start_index: int = 0, _end_index: int = 20) -> dict:
        _proposals_details_list = []
        _proposals_keys = self._proposals_keys

        if _end_index - _start_index > 50:
            return {-1: "Page length must not be greater than 50."}
        if _start_index < 0:
            _start_index = 0
        count = len(_proposals_keys)

        _range = range(_start_index, count if _end_index > count else _end_index)

        for _keys in _range:
            _proposal_detail = {self._STATUS: self._proposals_details[_proposals_keys[_keys]][self._STATUS],
                             self._PROPOSAL_TITLE: self._proposals_details[_proposals_keys[_keys]][self._PROPOSAL_TITLE],
                             self._CONTRIBUTOR_ADDRESS: self._proposals_details[_keys][
                                 self._CONTRIBUTOR_ADDRESS],
                             self._TOTAL_BUDGET: self._proposals_details[_proposals_keys[_keys]][self._TOTAL_BUDGET],
                             self._SPONSOR_ADDRESS: self._proposals_details[_proposals_keys[_keys]][self._CONTRIBUTOR_ADDRESS],
                             self._TOTAL_INSTALLMENT_COUNT: self._proposals_details[_proposals_keys[_keys]][self._TOTAL_INSTALLMENT_COUNT],
                             self._TOTAL_TIMES_INSTALLMENT_PAID: self._proposals_details[_proposals_keys[_keys]][self._TOTAL_TIMES_INSTALLMENT_PAID],
                             self._SPONSOR_REWARD: self._proposals_details[_proposals_keys[_keys]][self._SPONSOR_REWARD],
                             self._TOTAL_INSTALLMENT_PAID: self._proposals_details[_proposals_keys[_keys]][self._TOTAL_INSTALLMENT_PAID],
                             self._IPFS_KEY: _proposals_keys[_keys]}
            _proposals_details_list.append(_proposal_detail)

        _proposals_dict_list = {"data": _proposals_details_list, "count": len(_proposals_details_list)}
        return _proposals_dict_list

    @external
    def empty_treasury(self):
        self.icx.transfer(self.icx.get_balance(self.address), self.owner)
