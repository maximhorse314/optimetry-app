import { all } from 'redux-saga/effects'
import { saga as scenario } from './scenario'

export default function* rootSaga() {
  yield all([
    scenario()
  ])
}
