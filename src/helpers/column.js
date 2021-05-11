import React from 'react'
import { FormattedNumber, FormattedDate } from 'react-intl'
import TextField from '@material-ui/core/TextField'
import { makeStyles } from '@material-ui/core/styles'
import NumberFormat from 'react-number-format'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%'
  },
  cellEdit: {
    fontSize: 'small',
    textAlign: 'right'
  }
}))

export const renderFormattedNumber = (field, format) => row => (
  <FormattedNumber value={row[field] || 0} format={format} />
)

export const renderFormattedDate = (field, format) => row => (
  <FormattedDate value={row[field] || 0} format={format} />
)

export const NumberFormatCustom = ({ inputRef, ...other }) => (
  <NumberFormat getInputRef={inputRef} {...other} thousandSeparator />
)

export const numericEdit = placeholder => props => {
  const handleValueChange = ({ value }) => props.onChange(Number(value))
  const styles = useStyles()

  return (
    <TextField
      placeholder={placeholder}
      className={styles.root}
      inputProps={{
        value: props.value,
        onValueChange: handleValueChange,
        className: styles.cellEdit
      }}
      InputProps={{
        inputComponent: NumberFormatCustom
      }}
    />
  )
}
