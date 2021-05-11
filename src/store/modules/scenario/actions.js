import { createAction } from 'redux-actions'

import * as types from './types'

export const saveScenario = createAction(types.SAVE_SCENARIO)
export const loadScenario = createAction(types.LOAD_SCENARIO)
export const importScenario = createAction(types.IMPORT_SCENARIO)
