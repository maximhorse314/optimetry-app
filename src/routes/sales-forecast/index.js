import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import debounce from 'lodash/debounce'
import { makeStyles } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import MaterialTable from 'components/data-table'
import { channelsSelector } from 'store/modules/sales-channels'
import { setPeriod, setSalesForecast, periodSelector, salesForecastSelector } from 'store/modules/sales-forecast'
import Periods from './periods'
import useGlobalStyles from 'hooks/styles'
import { renderFormattedDate, renderFormattedNumber, numericEdit } from 'helpers/column'

const useStyles = makeStyles({
  root: {
    '& .MuiTableRow-root[mode=bulk] td:last-child': {
      textAlign: 'center'
    }
  }
})

function SalesForecast({ salesChannels, period, setPeriod, setSalesForecast, data }) {
  const global = useGlobalStyles()
  const styles = useStyles()
  const [initPeriod] = useState(period)

  const columns = useMemo(
    () => [{
      title: 'Period',
      field: 'Period',
      align: 'left',
      type: 'date',
      editable: 'never',
      render: renderFormattedDate('Period', 'numericDate'),
    }].concat(salesChannels.map(({ label, key }) => ({
      title: `${label} Sales`,
      field: key,
      align: 'right',
      render: renderFormattedNumber(key, 'currency'),
      editComponent: numericEdit(`${label} Sales`),
    }))).concat([{
      title: 'Target',
      field: 'Target',
      align: 'center',
      type: 'boolean'
    }]).map(col => ({
      ...col,
      width: 'auto',
      headerStyle: { textAlign: col.align }
    })),
    [salesChannels]
  )

  const initData = useCallback(
    period => Array(period.periods)
      .fill(0)
      .map((_, key) => {
        const row = {
          Target: true,
          Period: period.startDate + key * 1000 * 3600 * 24 * period.frequency
        }
        salesChannels.forEach(({ key }) => row[key] = 0)
        return row
      }),
    [salesChannels]
  )
  
  useEffect(() => {
    if (!data.length) {
      setSalesForecast(initData(initPeriod))
    }
  }, [initPeriod, setSalesForecast, data, initData])
  
  const handlePeriodChange = useCallback(
    debounce(period => {
      setPeriod(period)
      setSalesForecast(initData(period))
    }, 150),
    []
  )

  const editable = {
    onBulkUpdate: changes =>
      new Promise(resolve => {
        const updated = [...data]
        Object.keys(changes).forEach(key => {
          const { newData, oldData } = changes[key]
          updated[oldData.tableData.id] = newData
        })
        setSalesForecast(updated)
        resolve()
      })
  }

  return (
    <div className={styles.root}>
      <Typography variant='h5' component='h5' className={global.pageTitle}>
        Sales Forecast
      </Typography>
      
      <Periods data={period} onPeriodChange={handlePeriodChange} />

      <MaterialTable
        title='Enter sales forecast.'
        columns={columns}
        data={data || []}
        editable={editable}
        hideActionOnEdit
        options={{
          paging: false
        }}
      />
    </div>
  )
}

const selectors = createStructuredSelector({
  salesChannels: channelsSelector,
  data: salesForecastSelector,
  period: periodSelector
})

const actions = {
  setPeriod,
  setSalesForecast
}

export default connect(selectors, actions)(SalesForecast)
