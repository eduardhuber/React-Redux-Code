/*
 * Games reducer
 */

import { fromJS } from 'immutable';
import { curry } from 'lodash';
import {
  GAMES_REQUEST,
  GAMES_SUCCESS,
  GAMES_ERROR,
  SEARCH_GAMES,
  TOGGLE_SEARCH,
  NEXT_PAGE_REQUEST,
  START_SPINNER, // temp while BE search route not implemented
} from './constants';

const initialState = fromJS({
  isFetching: false,
  isSearching: false,
  isLastPage: false,
  data: [],
  games: [],
  search: [],
  message: '',
});

const isMatch = curry((query, game) => new RegExp(query, 'i').test(game.get('name')));
// this is implementaion is temporary; it is set up this way to mirror
// how searching is done for makers and jobs and to make refactoring faster
// when the appropriate route for searchgame is implemented on the BE
function gamesReducer(state = initialState, action) {
  switch (action.type) {
    case GAMES_REQUEST:
      return state
        .set('isFetching', true)
        .set('isSearching', false)
        .set('message', '');
    case GAMES_SUCCESS:
      return state
        .set('isFetching', false)
        .set('data', fromJS(action.data))
        .set('games', fromJS(action.data.slice(0, 20)))
        .set('message', '');
    case GAMES_ERROR:
      return state
        .set('isFetching', false)
        .set('message', action.message);
    case TOGGLE_SEARCH:
      return state
        .set('isSearching', !state.get('isSearching'));
    case SEARCH_GAMES: {
      const results = state.get('data').filter(isMatch(action.query)).take(20);
      return state
        .set('isFetching', false)
        .set('message', '')
        .set('search', results)
        .set('isLastPage', results.length < 20);
    }
    case NEXT_PAGE_REQUEST: {
      const data = state.get('data');
      const { query } = action;
      const target = state.get('isSearching') ? 'search' : 'games';
      const offset = state.get(target).size;
      const results = (query ? data.filter(isMatch(query)) : data).take(offset + 20);
      return state
        .set(target, results)
        .set('isLastPage', results.size === 200 || results.size % 20 !== 0)
        .set('message', '');
    }
    case START_SPINNER:
      return state
        .set('isFetching', true);
    default:
      return state;
  }
}

export default gamesReducer;
