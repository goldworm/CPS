import React from 'react';
import { FaBars } from 'react-icons/fa';
import {
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import Dashboard from '../Dashboard';
import ProgressReports from '../ProgressReports';
import Proposals from '../Proposals';
import ProposalCreationPage from '../ProposalCreationPage';
import ProgressReportCreationPage from '../ProgressReportCreationPage';
import SponsorRequests from '../SponsorRequests';
import Voting from '../Voting';
import BackedProjects from '../BackedProjects';
import { connect } from 'react-redux';

const Main = ({
  handleToggleSidebar,
  isPrep
}) => {

  const prepRoute = (component) => (
    isPrep ?
      component :
      <Redirect to='/' />
  )

  const userRoute = (component) => (
    !isPrep ?
      component :
      <Redirect to='/' />
  )

  return (
    <main>
      <div className="btn-toggle" onClick={() => handleToggleSidebar(true)}>
        <FaBars />
      </div>

      <div className="block ">
        <Switch>
          <Route path="/dashboard">
            <Dashboard />
          </Route>
          <Route path="/proposals">
            {userRoute(<Proposals />)}
          </Route>
          <Route path="/progress-reports">
            {userRoute(<ProgressReports />)}
          </Route>
          <Route path="/newProposal">
            {userRoute(<ProposalCreationPage />)}
          </Route>
          <Route path="/newProgressReport">
            {userRoute(<ProgressReportCreationPage />)}
          </Route>
          <Route path="/sponsorRequests">
            {prepRoute(<SponsorRequests />)}

          </Route>
          <Route path="/voting">
            {prepRoute(<Voting />)}
          </Route>
          <Route path="/backed-projects">
            {prepRoute(<BackedProjects />)}
          </Route>
          <Route path="/">
            <Dashboard />
          </Route>
        </Switch>
      </div>



    </main>
  );
};



const mapStateToProps = state => (
  {
    isPrep: state.account.isPrep
  }
)

export default connect(mapStateToProps)(Main);