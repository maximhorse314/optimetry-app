import React, { useCallback, useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import Typography from '@material-ui/core/Typography'
import FormControl from '@material-ui/core/FormControl'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import InputLabel from '@material-ui/core/InputLabel'
import InputAdornment from '@material-ui/core/InputAdornment'
import { useIntl } from 'react-intl'
import NumberFormat from 'react-number-format'
import { setMediaBudget, mediaBudgetSelector } from 'store/modules/media-budget'
import useGlobalStyles from 'hooks/styles'


const NumberFormatCustom = ({ inputRef, ...other }) => (
  <NumberFormat getInputRef={inputRef} {...other} thousandSeparator />
)

export function MediaBudget({ mediaBudget, setMediaBudget }) {
  const global = useGlobalStyles()
  const intl = useIntl()
  const format = useCallback(
    value => intl.formatNumber(value, { format: 'decimalTwoPossible' }),
    [intl]
  )
  const [budget, setBudget] = useState(0)

  useEffect(() => {
    setBudget(format(mediaBudget))
  }, [format, mediaBudget])
  const handleChanged = ({ value }) => setBudget(value)

  const handleFocus = () => setBudget(mediaBudget)

  const handleBlur = () => {
    setMediaBudget(budget)
    setBudget(format(budget))
    // parseFloat(budget)
  }

  return (
    <div>
      <Typography variant='h5' component='h5' className={global.pageTitle}>
        Media Budget
      </Typography>
      <FormControl variant='outlined'>
        <InputLabel htmlFor='media-budget-input'>
          Enter media budget
        </InputLabel>
        <OutlinedInput
          id='media-budget-input'
          required
          color='primary'
          labelWidth={150}
          startAdornment={<InputAdornment position='start'>$</InputAdornment>}
          onBlur={handleBlur}
          onFocus={handleFocus}
          inputComponent={NumberFormatCustom}
          inputProps={{
            value: budget,
            onValueChange: handleChanged
          }}
        />
      </FormControl>
    </div>
  )
}

const selectors = createStructuredSelector({
  mediaBudget: mediaBudgetSelector
})

const actions = {
  setMediaBudget: setMediaBudget
}

export default connect(selectors, actions)(MediaBudget)


