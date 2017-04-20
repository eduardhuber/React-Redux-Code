/*
 * Games actions
 */

import {
  GAMES_REQUEST,
  GAMES_SUCCESS,
  GAMES_ERROR,
  SEARCH_GAMES,
  TOGGLE_SEARCH,
  NEXT_PAGE_REQUEST,
  START_SPINNER,
} from './constants';

export function gamesRequest() {
  return {
    type: GAMES_REQUEST,
  };
}

export function gamesSuccess(data) {
  return {
    type: GAMES_SUCCESS,
    data,
  };
}

export function gamesError(message) {
  return {
    type: GAMES_ERROR,
    message,
  };
}

export function gamesSearch(query) {
  return {
    type: SEARCH_GAMES,
    query,
  };
}

export function toggleSearch() {
  return {
    type: TOGGLE_SEARCH,
  };
}

export function nextPageRequest(query) {
  return {
    type: NEXT_PAGE_REQUEST,
    query,
  };
}

export function startSpinner() {
  return {
    type: START_SPINNER,
  };
}
