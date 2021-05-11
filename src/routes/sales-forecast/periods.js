import React, { useState, useEffect } from 'react'
import DateFnsUtils from '@date-io/date-fns';
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import { makeStyles } from '@material-ui/core';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';


const useStyles = makeStyles(theme => ({
  periods: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    '& .MuiFormControl-root': {
      marginRight: theme.spacing(3)
    }
  },
  datepicker: {
    margin: 0
  }
}))

export default ({ data, onPeriodChange }) => {
  const [startDate, setStartDate] = useState(0)
  const [periods, setPeriods] = useState(0)
  const [frequency, setFrequency] = useState(0)
  const styles = useStyles()

  const handleStartDateChange = date => {
    const value = date.getTime()
    setStartDate(value)
    onPeriodChange({ startDate: value, periods, frequency })
  }
  const handlePeriodsChange = e => {
    const min = Math.max(parseInt(e.target.value) || 0, 0)
    const value = Math.min(min, 100)
    setPeriods(value)
    onPeriodChange({ startDate, periods: value, frequency })
  }
  
  const handleFrequencyChange = e => {
    const min = Math.max(parseInt(e.target.value) || 0, 0)
    const value = Math.min(min, 1000)
    setFrequency(value)
    onPeriodChange({ startDate, periods, frequency: value })
  }

  useEffect(() => {
    setStartDate(data.startDate)
    setPeriods(data.periods)
    setFrequency(data.frequency)
  }, [data])

  return (
    <Paper className={styles.periods} elevation={0} variant='outlined'>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          disableToolbar
          variant='inline'
          format='MM/dd/yyyy'
          margin='normal'
          id='date-picker-inline'
          label='Start Date'
          value={startDate}
          onChange={handleStartDateChange}
          className={styles.datepicker}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
      </MuiPickersUtilsProvider>
      <TextField
        id='period'
        type='number'
        label='Periods'
        value={periods}
        inputProps={{ step: 1 }}
        onChange={handlePeriodsChange}
      />
      <TextField
        id='frequency'
        type='number'
        label='Frequency'
        value={frequency}
        inputProps={{ step: 1 }}
        onChange={handleFrequencyChange}
      />
    </Paper>
  )
}
