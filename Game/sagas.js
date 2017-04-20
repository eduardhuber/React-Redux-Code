/*
 * Game sagas
 */

import { take, call, put } from 'redux-saga/effects';  // eslint-disable-line no-unused-vars
import { replace } from 'react-router-redux';

import {
  makeRequest,
  removeUserData,
  getAuthToken,
  checkAuthToken,
  removeAuthToken,
} from 'utils';

import {
  GAME_REQUEST,
} from './constants';

import {
  gameSuccess,
  gameError,
} from './actions';

// watcher for maker data requests
function* gameRequestWatcher() {
  while (true) {
    const { payload: { id } } = yield take(GAME_REQUEST);
    try {
      // check auth token for expiration
      if (checkAuthToken()) {
        const { token } = yield call(getAuthToken);
        // request maker data
        const req = yield call(makeRequest, 'GET', {}, `game/${id}/gamemakers`, {
          'X-Auth-Token': token,
        });
        yield put(gameSuccess(req.data));
      } else {
        // if expired remove token and user data
        yield call(removeAuthToken);
        yield call(removeUserData);
        // redirect user to Home and show the unauthorized message
        yield put(gameError('Login credentials have expired'));
        yield put(replace('/?unauthorized'));
      }
    } catch (e) {
      // console.log(e);
      yield put(gameError(e));
      // TODO:30 find a way to keep the url but still display the error page
      yield put(replace('/error'));
    }
  }
}

export default [
  gameRequestWatcher,
];
