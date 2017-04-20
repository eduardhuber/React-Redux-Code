/*
 * Game reducer
 */

import { fromJS } from 'immutable';
import {
  GAME_REQUEST,
  GAME_SUCCESS,
  GAME_ERROR,
} from './constants';

const initialState = fromJS({
  isFetching: false,
  game: {},
  message: '',
});

function makersReducer(state = initialState, action) {
  switch (action.type) {
    case GAME_REQUEST:
      return state
        .set('isFetching', true)
        .set('message', '');
    case GAME_SUCCESS:
      return state
        .set('isFetching', false)
        .set('game', fromJS(action.data))
        .set('message', '');
    case GAME_ERROR:
      return state
        .set('isFetching', false)
        .set('message', action.message);
    default:
      return state;
  }
}

export default makersReducer;
