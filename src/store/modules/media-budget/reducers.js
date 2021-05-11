import fp from 'lodash/fp'
import { handleActions } from 'redux-actions'
import { SET_MEDIA_BUDGET } from './types'
import { REQUEST_SUCCESS } from '../api'

const init = {
  mediaBudget: 0
}

export default handleActions({
  [SET_MEDIA_BUDGET]: (state, { payload }) => fp.set('mediaBudget', payload)(state),

  [REQUEST_SUCCESS]: (state, { payload: { data: { media_budget }, requestSelectorKey } }) => {
    if (requestSelectorKey === 'load-scenario') {
      return fp.set('mediaBudget', media_budget)(state)
    }
    return state
  }
}, init)
