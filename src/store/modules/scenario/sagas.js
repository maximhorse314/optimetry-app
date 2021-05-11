import { takeLatest, put } from 'redux-saga/effects'
import { apiCallSaga, requestSuccess } from '../api'
import { LOAD_SCENARIO, SAVE_SCENARIO, IMPORT_SCENARIO } from './types'
import { uuid } from 'helpers/utils'

const getChannels = salesChannels =>
  salesChannels.length ?
    Object.keys(salesChannels[0])
      .filter(label => label !== 'Media' && label !== 'Channel')
      .map(label => ({ label, key: uuid() }))
    : []

const loadScenario = apiCallSaga({
  type: LOAD_SCENARIO,
  method: 'get',
  allowedParamKeys: [],
  path: '',
  selectorKey: 'scenario',
  requestSelectorKey: 'load-scenario',
  payloadOnSuccess: data => ({
    channels: getChannels(data.sales_channels),
    ...data
  })
})

const saveScenario = apiCallSaga({
  type: SAVE_SCENARIO,
  method: 'post',
  path: '',
  selectorKey: 'scenario',
  requestSelectorKey: 'save-scenario'
})

const importScenario = function* ({ payload: { success, fail, data } }) {
  const requestSelectorKey = 'load-scenario'
  const selectorKey = 'scenario'
  const fakeMethod = 'get'

  try {
    yield put(
      requestSuccess({
        selectorKey,
        requestSelectorKey,
        method: fakeMethod,
        data: {
          ...data,
          channels: getChannels(data.sales_channels)
        }
      })
    )
    yield success()
  } catch (err) {
    console.error(err)
    yield fail()
  }
}

export default function* rootSaga() {
  yield takeLatest(SAVE_SCENARIO, saveScenario)
  yield takeLatest(LOAD_SCENARIO, loadScenario)
  yield takeLatest(IMPORT_SCENARIO, importScenario)
}
