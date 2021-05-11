import fp from 'lodash/fp'

const subSelector = (subname, defaultValue = null) =>
  fp.compose(
    fp.defaultTo(defaultValue),
    fp.get(subname),
    fp.get('salesForecast')
  )

export const salesForecastSelector = subSelector('data')

export const periodSelector = subSelector('period')

