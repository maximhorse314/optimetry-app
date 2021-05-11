import fp from 'lodash/fp'
import { handleActions } from 'redux-actions'
import { SET_SALES_CHANNELS, SET_CHANNELS } from './types'
import { REQUEST_SUCCESS } from '../api'
import { SET_MEDIA_CHANNELS } from '../media-channels'
import mapKeys from 'lodash/mapKeys'
import { setKeys } from 'helpers/utils'

const init = {
  data: [],
  channels: []
}

export default handleActions({
  [SET_SALES_CHANNELS]: (state, { payload }) => fp.set('data', payload)(state),

  [SET_MEDIA_CHANNELS]: (state, { payload }) => {
    const defaultChannelValues = {}
    state.channels.forEach(({ key }) => defaultChannelValues[key] = 1)
    const data = payload.map((_, key) => key < state.data.length ? state.data[key] : defaultChannelValues)
    return fp.set('data', data)(state)
  },
  
  [SET_CHANNELS]: (state, { payload }) => {
    const keys = payload.map(d => ({ ...d, default: 1 }))
    return fp.compose(
      fp.set('data',  setKeys(state.data, keys)),
      fp.set('channels', payload)
    )(state)
  },

  [REQUEST_SUCCESS]: (state, { payload: { data: { channels, sales_channels }, requestSelectorKey } }) => {
    if (requestSelectorKey === 'load-scenario' && sales_channels.length) {
      const data = sales_channels.map(({ Media, Channel, ...other }) =>
        mapKeys(other, (_, k) => channels.find(({ label }) => label === k).key))
      return { channels, data }
    }

    return state
  }
}, init)
