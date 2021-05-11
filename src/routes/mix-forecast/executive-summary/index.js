import { makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList } from 'recharts';
import { mediaColors } from 'config/constants'
import { useIntl } from 'react-intl'

const data = [
  { 'name': 'Starting Spend', 'TV': 35.15, 'Digital': 9.54, 'Paid Social': 5.02, 'Radio': 2.78, 'Other': 3.6 },
  { 'name': 'Final Spend', 'TV': 44.16, 'Digital': 24.38, 'Paid Social': 14.15, 'Radio': 6.95, 'Other': 10.81 }
]

const media = ['TV', 'Digital', 'Paid Social', 'Radio', 'Other'].sort()

const useStyles = makeStyles(theme => ({
  root: {
    padding: `${theme.spacing(2)}px 0 ${theme.spacing(4)}px`
  },
  chartContainer: {
    margin: 'auto'
  }
}))

export default () => {
  const styles = useStyles()
  const intl = useIntl()
  
  return (
    <div className={styles.root}>
      <Typography align='center'>Starting vs. Final Spend</Typography>
      <BarChart
        width={800}
        height={500}
        className={styles.chartContainer}
        data={data}
        margin={{
          top: 20, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis label={{ value: 'Spend', angle: -90, position: 'insideLeft' }}/>
        <Tooltip />
        <Legend />

        {media.map((dataKey, key) => (
          <Bar
            key={key}
            dataKey={dataKey}
            fill={mediaColors[key % mediaColors.length]}
            stackId='a'
            label={{
              fill: 'white',
              valueAccessor: entry => entry[dataKey],
              content: data => data.value
            }}
          >
            {key === media.length - 1 && (
              <LabelList
                position="top"
                valueAccessor={({ payload }) => {
                  const sum = payload['TV'] + payload['Digital'] + payload['Paid Social'] + payload['Radio'] + payload['Other']
                  return `${payload.name}: ${intl.formatNumber(sum, { format: 'currencyWithoutCents' })}`
                }}
              />
            )}
          </Bar>
        ))}
      </BarChart>
    </div>
  )
}
