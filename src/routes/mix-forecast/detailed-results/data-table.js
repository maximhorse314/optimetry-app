import React, { useMemo } from 'react'
import { FormattedNumber } from 'react-intl'
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableHead from '@material-ui/core/TableHead'
import TableCell from '@material-ui/core/TableCell'
import MuiRow from '@material-ui/core/TableRow'
import { mediaColors } from 'config/constants'
import { headerStyle } from 'helpers/styles'

const useStyles = makeStyles(theme => ({
  dataHeader: headerStyle,
  metaCell: {
    padding: theme.spacing(1),
    textTransform: 'uppercase'
  },
  dataCell: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1)
  }
}))

const TableRow = withStyles(theme => ({
  root: {
    '&:nth-of-type(even)': {
      backgroundColor: '#f2f2f2'
    }
  }
}))(MuiRow)

export default ({ columns, data }) => {
  const styles = useStyles()
  
  const renderDataCells = (row, className, total = false) => {
    const Typography = total ? 'strong' : React.Fragment
    return (
      <React.Fragment>
        {columns.map(({ field, format }) => (
          <TableCell align='right' key={field} className={className}>
            <Typography>
              <FormattedNumber value={row[field]} format={format} />
            </Typography>
          </TableCell>
        ))}
      </React.Fragment>
    )
  }

  /*
  frontend side total
  const total = useMemo(() => {
    const total = { all: {} }
    const media = Object.keys(data)
    
    media.forEach(medium => {
      const channels = Object.keys(data[medium])
      total[medium] = {}
      columns.forEach(col => total[medium][col.field] =
        channels.map(ch => data[medium][ch][col.field]).reduce((acc, data) => acc + data)
      )
    })
    columns.forEach(col => total['all'][col.field] =
      media.map(medium => total[medium][col.field]).reduce((acc, data) => acc + data)
    )
    return total
  }, [data, columns])
  */

  const media = useMemo(
    () => {
      const media = Object.keys(data).sort().filter(m => m !== 'All')
      if (media.length) {
        return media.concat(['All'])
      } else {
        return []
      }
    },
    [data]
  )

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell align='center' className={styles.dataHeader}>Medium</TableCell>
          <TableCell align='center' className={styles.dataHeader}>Channel</TableCell>
          {columns.map(({ field, label }) => (
            <TableCell align='right' className={styles.dataHeader} key={field}>{label}</TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {media.map((medium, fkey) => {
          const channels = Object.keys(data[medium])
          const color = mediaColors[fkey % mediaColors.length]

          return channels.map((ch, skey) => (
            <TableRow key={`${medium}-${ch}`}>
              {skey === 0 && (
                <TableCell
                  rowSpan={channels.length}
                  className={medium === 'All' ? styles.dataHeader : styles.metaCell}
                  style={medium === 'All' ? { fontWeight: 'bold' } : { backgroundColor: color, color: 'white' }}
                  align='center'
                >
                  {medium}
                </TableCell>
              )}
              <TableCell
                align='center'
                className={medium === 'All' ? styles.dataHeader : styles.metaCell}
                style={medium === 'All' ? { fontWeight: 'bold' } : ch === 'Total' ? { color, fontWeight: 'bold' } : undefined}
              >
                {ch}
              </TableCell>
              {renderDataCells(data[medium][ch], medium === 'All' ? styles.dataHeader : styles.dataCell, ch === 'Total')}
            </TableRow>
          ))
        })}
      </TableBody>
    </Table>
  )

  /* front end side total
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell align='center' className={styles.dataHeader}>Medium</TableCell>
          <TableCell align='center' className={styles.dataHeader}>Channel</TableCell>
          {columns.map(({ field, label }) => (
            <TableCell align='right' className={styles.dataHeader} key={field}>{label}</TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {Object.keys(data).sort().map((medium, fkey) => {
          const channels = Object.keys(data[medium])
          const color = mediaColors[fkey % mediaColors.length]

          return [
            channels.map((ch, skey) => (
              <TableRow key={`${medium}-${ch}`}>
                {skey === 0 && (
                  <TableCell
                    rowSpan={channels.length + 1}
                    className={styles.metaCell}
                    align='center'
                    style={{
                      backgroundColor: color,
                      color: 'white'
                    }}
                  >
                    {medium}
                  </TableCell>
                )}
                <TableCell align='center' className={styles.metaCell}>{ch}</TableCell>
                {renderDataCells(data[medium][ch], styles.dataCell)}
              </TableRow>
            )), (
              <TableRow key={`${medium}-total`}>
                <TableCell align='center' className={styles.metaCell} style={{ color }}>
                  <strong>Total</strong>
                </TableCell>
                {renderDataCells(total[medium], styles.dataCell, true)}
              </TableRow>
            )
          ]
        })}
        <TableRow>
          <TableCell align='center' className={styles.dataHeader}>
            All
          </TableCell>
          <TableCell align='center' className={styles.dataHeader}>
            <strong>TOTAL</strong>
          </TableCell>
          {renderDataCells(total['all'], styles.dataHeader, true)}
        </TableRow>
      </TableBody>
    </Table>
    )
  */
}
