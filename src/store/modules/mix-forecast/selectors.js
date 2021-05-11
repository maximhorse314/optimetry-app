import fp from 'lodash/fp'

const subSelector = (subname, defaultValue = null) =>
  fp.compose(
    fp.defaultTo(defaultValue),
    fp.get(subname),
    fp.get('mixForecast')
  )

export const detailedResultsHiddenColumnsSelector = subSelector('detailedResults.hiddenColumns')

export const detailedResultsSelector = subSelector('detailedResults.data')

export const detailedResultsColumnsSelector = subSelector('detailedResults.columns')

export const salesResponseSelector = subSelector('salesResponse')
