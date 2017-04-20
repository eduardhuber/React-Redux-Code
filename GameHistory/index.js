/*
 * Game history container
 */

import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Link } from 'react-router';

import { makerRequest, verifyCreditRequest } from 'containers/Maker/actions';
import {
  openAddExp,
  openDeleteExp,
} from 'containers/Modals/actions';

import { selectUser } from 'containers/App/selectors';
import { selectMaker } from 'containers/Maker/selectors';
import GameDetailsCard from 'components/GameDetailsCard';

import s from './styles.css';

class GameHistory extends Component {
  componentWillMount() {
    const { params: { makerID }, user, onGetMaker } = this.props;
    onGetMaker(makerID === 'me' ? user.id : makerID);
  }

  componentWillUpdate(nextProps) {
    const { params: { makerID }, user, onGetMaker } = this.props;
    const nextID = nextProps.params.makerID;
    if (nextProps.params.makerID !== makerID) {
      onGetMaker(nextID === 'me' ? user.id : nextID);
    }
  }

  render() {
    const { params: { makerID }, user, maker, onAddExp, onDeleteExp, onVerifyCredit } = this.props;
    const m = maker || {};
    const u = user || {};
    return (
      <main role="main" className={s.root}>
        <nav className={s.nav}>
          <Link to={`/maker/${makerID}`}><i className="icon-arrow-left" />Back to Profile</Link>
          <a onClick={onAddExp}>Add New</a>
        </nav>
        <div className={s.top}>
          <h1>Game History</h1>
        </div>
        <div className={s.games}>
          {m.credits && m.credits.length > 0 ? m.credits.map((g, idx) => (
            <GameDetailsCard
              key={idx}
              gameID={g.game && g.game.id}
              makerID={m.id}
              endDate={g.endDate}
              location={g.location}
              platforms={g.platforms}
              title={g.game && g.game.name}
              studio={g.company && g.company.name}
              onDeleteExp={onDeleteExp}
              userID={u.id}
              creditID={g.id}
              onVerifyCredit={onVerifyCredit}
              verified={g.verification}/>

          )) : <h3>There are no games to display</h3>}
        </div>
      </main>
    );
  }
}

GameHistory.propTypes = {
  params: PropTypes.object.isRequired,
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    email: PropTypes.string.isRequired,
    isSuperuser: PropTypes.bool.isRequired,
    maker: PropTypes.object,
    recruiter: PropTypes.object,
  }).isRequired,
  maker: PropTypes.shape({
    id: PropTypes.number,
    firstName: PropTypes.string,
    claimed: PropTypes.bool,
    connected: PropTypes.bool,
    connectPending: PropTypes.bool,
    lastName: PropTypes.string,
    location: PropTypes.string,
    currRole: PropTypes.string,
    currCompany: PropTypes.string,
    currGame: PropTypes.string,
    credits: PropTypes.array,
    connections: PropTypes.array,
  }),
  onGetMaker: PropTypes.func.isRequired,
  onAddExp: PropTypes.func.isRequired,
  onDeleteExp: PropTypes.func.isRequired,
  onVerifyCredit: PropTypes.func.isRequired,
};

export default connect(
  createStructuredSelector({
    user: selectUser(),
    maker: selectMaker(),
  }),
  dispatch => ({
    dispatch,
    onGetMaker: id => dispatch(makerRequest(id)),
    onAddExp: () => dispatch(openAddExp()),
    onDeleteExp: creditID => dispatch(openDeleteExp(creditID)),
    onVerifyCredit: (decision, id) => dispatch(verifyCreditRequest(decision, id)),
  })
)(GameHistory);
