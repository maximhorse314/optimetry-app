import React, { useMemo } from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core';
import Paper from '@material-ui/core/Paper'
import MaterialTable from 'material-table'
import { headerStyle } from 'helpers/styles'

const useStyles = makeStyles(theme => ({
  hideActionOnEdit: {
    '& .MuiTableRow-root .MuiTableCell-root.MuiTableCell-paddingNone': {
      display: 'none'
    }
  }
}))

export default ({
  options,
  localization,
  components,
  hideActionOnEdit,
  ...other
}) => {
  const styles = useStyles()

  const opt = useMemo(() => ({
    headerStyle: {
      textTransform: 'uppercase',
      ...headerStyle
    },
    rowStyle: row => ({
      backgroundColor: row.tableData.id % 2 === 0 ? 'white' : '#f2f2f2',
      textTransform: 'uppercase',
      color: '#191919'
    }),
    ...options
  }), [options])

  const local = useMemo(() => ({
    header: {
      actions: ''
    },
    ...localization
  }), [localization])

  
  const Container = ({ className, ...props }) => (
    <Paper
      {...props}
      className={clsx(className, {[styles.hideActionOnEdit]: hideActionOnEdit})}
      elevation={0}
      variant='outlined'
    />
  )

  return (
    <MaterialTable
      title='Sales Forecast'
      options={opt}
      localization={local}
      components={components || { Container }}
      {...other}
    />
  )
}
