/*
 * Games sagas
 */

import { take, call, put } from 'redux-saga/effects';
import { push, replace } from 'react-router-redux';

import {
  makeRequest,
  removeUserData,
  getAuthToken,
  checkAuthToken,
  removeAuthToken,
} from 'utils';

import {
  GAMES_REQUEST,
} from './constants';

import {
  openMessage,
} from 'containers/Modals/actions';
import {
  gamesSuccess,
  gamesError,
} from './actions';

// watcher for games requests
function* gamesRequestWatcher() {
  while (yield take(GAMES_REQUEST)) {
    try {
      // check auth token for expiration
      if (checkAuthToken()) {
        const { token } = yield call(getAuthToken);
        // request user data
        const req = yield call(makeRequest, 'GET', {}, 'browse/games', {
          'X-Auth-Token': token,
        });
        yield put(gamesSuccess(req.data));
      } else {
        // if expired remove token and user data
        yield call(removeAuthToken);
        yield call(removeUserData);
        // redirect user to Home and show the unauthorized message
        yield put(gamesError('Login credentials have expired'));
        yield put(replace('/?unauthorized'));
      }
    } catch (e) {
      // console.log(e.toString());
      yield put(gamesError(e.toString()));
      yield put(openMessage());
      yield put(push('/'));
    }
  }
}

export default [
  gamesRequestWatcher,
];
