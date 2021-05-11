import React, { useMemo } from 'react'
import { makeStyles } from '@material-ui/core'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { salesResponseSelector } from 'store/modules/mix-forecast'
import { mediaColors } from 'config/constants'
import { useIntl } from 'react-intl'

const useStyles = makeStyles(theme => ({
  root: {
    padding: `${theme.spacing(2)}px 0 ${theme.spacing(4)}px`
  },
  chartContainer: {
    margin: 'auto'
  }
}))

const SalesResponse = ({ data }) => {
  const styles = useStyles()
  const intl = useIntl()
  
  const tooltipFormatter = value => intl.formatNumber(value, { format: 'currency' })

  const tickFormatter = x => intl.formatDate(x, { format: 'twoDigit'})

  const charts = useMemo(
    () => data.length ?
      Object.keys(data[0])
        .filter(c => c !== 'name')
        .map(c => ({
          name: c,
          type: c.toLowerCase().includes('sales') ? 'sales' : 'spend'
        })) : [],
    [data]
  )

  return (
    <div className={styles.root}>
      <ComposedChart
        width={1000}
        height={500}
        className={styles.chartContainer}
        data={data}
        margin={{
          top: 20, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          label={{ value: 'Period', position: 'bottom'}}
          dataKey="name"
          tickFormatter={tickFormatter}
        />
        <YAxis
          yAxisId='sales'
          orientation='left'
          label={{ value: 'Sales', angle: -90, offset: 20, position: 'insideLeft' }}
        />
        <YAxis
          yAxisId='spend'
          orientation='right'
          label={{ value: 'Spend', angle: 90, offset: 10, position: 'insideRight' }}
        />
        <Tooltip
          formatter={tooltipFormatter}
          labelFormatter={tickFormatter}
        />
        <Legend wrapperStyle={{ position: 'static' }} />

        {charts.map(({ name, type }, key) =>
          type === 'sales' ? (
            <Line
              key={key}
              yAxisId='sales'
              type='linear'
              dataKey={name}
              dot={{ strokeWidth: 2, r: 1 }}
              stroke={mediaColors[key % mediaColors.length]}
            />
          ) : (
            <Bar
              key={key}
              yAxisId='spend'
              dataKey={name}
              stackId='a'
              fill={mediaColors[key % mediaColors.length]}
            />
          )
        )}
      </ComposedChart>
    </div>
  )
}

const selectors = createStructuredSelector({
  data: salesResponseSelector,
})

export default connect(selectors)(SalesResponse)

