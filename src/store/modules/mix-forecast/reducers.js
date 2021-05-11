import fp from 'lodash/fp'
import set from 'lodash/set'
import { handleActions } from 'redux-actions'
import { SET_DETAILED_RESULTS_HIDDEN_COLUMNS } from './types'
import { REQUEST_SUCCESS } from '../api'

const init = {
  detailedResults: {
    hiddenColumns: [],
    columns: [],
    data: {},
  },
  salesResponse: []
}

export default handleActions({
  [SET_DETAILED_RESULTS_HIDDEN_COLUMNS]: (state, { payload }) => fp.set('detailedResults.hiddenColumns', payload)(state),

  [REQUEST_SUCCESS]: (state, { payload: { data: { sales_response, detailed_results }, requestSelectorKey } }) => {
    if (requestSelectorKey === 'save-scenario') {
      const data = {}
      let columns = []
      let hiddenColumns = []

      detailed_results.forEach(({ Media, Channel, ...other}) => {
        set(data, Media + '.' + Channel, other)
        /* frontend side total */
        // if (Channel.toLowerCase() !== 'total') {
        //   set(data, Media + '.' + Channel, other)
        // }
      })

      if (detailed_results.length) {
        const { Media, Channel, ...other } = detailed_results[0]
        columns = Object.keys(other)
        hiddenColumns = Array(columns.length)
          .fill(0)
          .map((_, key) => key)
          .filter(i => ![
              'Starting Spend',
              'Final Spend',
              'Incremental Spend',
              'CPM',
              'Starting Outcome',
              'Final Outcome',
              'Incremental Outcome',
              'Starting ROAS',
              'Final ROAS',
              'Incremental ROAS'
            ].includes(columns[i])
          )
      }

      const salesResponse = sales_response.map(({ Period, ...other }) => ({ name: Period, ...other }))

      return fp.compose(
        fp.set('salesResponse', salesResponse),
        fp.set('detailedResults.data', data),
        fp.set('detailedResults.columns', columns),
        fp.set('detailedResults.hiddenColumns', hiddenColumns),
      )(state)
    }
    return state
  }
}, init)
