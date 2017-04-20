/*
 * GameDetails container
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import selectGameDetails from './selectors';

import s from './styles.css';

const GameDetails = ({ params: { gameID } }) => (
  <main role="main" className={s.root}>
    Details for game with ID: {gameID}
  </main>
);

GameDetails.propTypes = {
  params: PropTypes.object.isRequired,
};

export default connect(
  selectGameDetails(),
  dispatch => ({
    dispatch,
  })
)(GameDetails);
