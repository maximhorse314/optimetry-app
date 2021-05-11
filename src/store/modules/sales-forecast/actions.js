import { createAction } from 'redux-actions'

import * as types from './types'

export const setSalesForecast = createAction(types.SET_SALES_FORECAST)
export const setPeriod = createAction(types.SET_PERIOD)
