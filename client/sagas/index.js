import 'regenerator-runtime/runtime'
import { call, put, takeEvery } from 'redux-saga/effects'
import fetch from 'isomorphic-fetch'
import { actions } from 'resolve-redux'
import Immutable from 'seamless-immutable'

function getState(storyId) {
  return fetch(`/api/query/storyDetails?aggregateIds[]=${[storyId]}`)
    .then(res => res.json())
    .catch(err => console.error(new Date(), err))
}

function* loadStory(action) {
  try {
    yield put(actions.replaceState('storyDetails', null))
    const storyId = action.storyId
    const state = yield call(() => getState(storyId))
    yield put(
      actions.replaceState(
        'storyDetails',
        Immutable(JSON.parse(state).storyDetails)
      )
    )
    yield put({
      type: 'SET_SUBSCRIPTION',
      aggregateIds: [storyId]
    })
  } catch (err) {
    console.log(err) // eslint-disable-line no-console
  }
}

export default function* rootSaga() {
  yield takeEvery('LOAD_STORY', loadStory)
}
