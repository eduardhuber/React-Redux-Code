/*
 * Game actions
 */

import {
  GAME_REQUEST,
  GAME_SUCCESS,
  GAME_ERROR,
} from './constants';

export function gameRequest(id) {
  return {
    type: GAME_REQUEST,
    payload: {
      id,
    },
  };
}

export function gameSuccess(data) {
  return {
    type: GAME_SUCCESS,
    data,
  };
}

export function gameError(message) {
  return {
    type: GAME_ERROR,
    message,
  };
}
