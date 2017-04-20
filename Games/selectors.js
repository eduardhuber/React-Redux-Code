/*
 * Games selectors
 */

import { createSelector } from 'reselect';

// Direct selector to the games state domain
const selectGamesDomain = () => state => state.get('games');

// Default selector used by Games
const selectGames = () => createSelector(
  selectGamesDomain(),
  substate => substate.toJS()
);

export default selectGames;
