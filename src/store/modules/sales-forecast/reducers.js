import fp from 'lodash/fp'
import { handleActions } from 'redux-actions'
import mapKeys from 'lodash/mapKeys'
import { SET_SALES_FORECAST, SET_PERIOD } from './types'
import { SET_CHANNELS } from '../sales-channels'
import { REQUEST_SUCCESS } from '../api'
import { setKeys } from 'helpers/utils'

const init = {
  data: [],
  period: {
    startDate: Date.now(),
    periods: 1,
    frequency: 7
  }
}

export default handleActions({
  [SET_SALES_FORECAST]: (state, { payload }) => fp.set('data', payload)(state),
  
  [SET_PERIOD]: (state, { payload }) => fp.set('period', payload)(state),

  [SET_CHANNELS]: (state, { payload }) => {
    const keys = payload
      .map(d => ({ ...d, default: 0 }))
      .concat([
        { key: 'Period', default: 0 },
        { key: 'Target', default: true }
      ])
    return fp.set('data',  setKeys(state.data, keys))(state)
  },

  [REQUEST_SUCCESS]: (state, { payload: { data: { channels, sales_forecast }, requestSelectorKey } }) => {
    if (requestSelectorKey === 'load-scenario') {
      const data = sales_forecast.map(({ Target, Period, ...other }) => ({
        Target,
        Period: Number(Period),
        ...mapKeys(other, (_, k) => channels.find(({ label }) => `${label} Sales` === k).key)
      }))
      const period = sales_forecast.length ? {
        startDate: Number(sales_forecast[0].Period),
        periods: sales_forecast.length,
        frequency: sales_forecast.length > 1
          ? Math.round((sales_forecast[1].Period - sales_forecast[0].Period) / 1000 / 3600 / 24)
          : state.period.frequency
      } : state.period
      return { data, period }
    }
    return state
  }
}, init)
