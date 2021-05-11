import fp from 'lodash/fp'
import { handleActions } from 'redux-actions'
import { SET_MEDIA_CHANNELS } from './types'
import { REQUEST_SUCCESS } from '../api'

export const init = {
  data: []
}

export default handleActions({
  [SET_MEDIA_CHANNELS]: (state, { payload }) => fp.set('data', payload)(state),

  [REQUEST_SUCCESS]: (state, { payload: { data: { media_channels }, requestSelectorKey } }) => {
    if (requestSelectorKey === 'load-scenario') {
      return fp.set('data', media_channels)(state)
    }
    return state
  }
}, init)
