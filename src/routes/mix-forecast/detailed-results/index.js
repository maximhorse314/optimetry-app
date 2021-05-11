import React, { useMemo } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { makeStyles } from '@material-ui/core/styles'
import {
  setDetailedResultsHiddenColumns,
  detailedResultsHiddenColumnsSelector,
  detailedResultsSelector,
  detailedResultsColumnsSelector
} from 'store/modules/mix-forecast'
import DataTable from './data-table'
import ColumnsToggle from './columns-toggle'

/*
const columns = [
  { field: 'startingSpend', label: 'Starting Spend', format: 'currency' },
  { field: 'finalSpend', label: 'Final Spend', format: 'currency' },
  { field: 'incrementalSpend', label: 'Incremental Spend', format: 'currency' },
  { field: 'cpm', label: 'CPM', format: 'currency' },
  { field: 'startingOutcome', label: 'Starting Outcome', format: 'currency' },
  { field: 'finalOutcome', label: 'Final Outcome', format: 'currency' },
  { field: 'incrementalOutcome', label: 'Incremental Outcome', format: 'currency' },
  { field: 'startingRoas', label: 'Starting ROAS', format: 'currency' },
  { field: 'finalRoas', label: 'Final ROAS', format: 'currency' },
  { field: 'incrementalRoas', label: 'Incremental ROAS', format: 'currency' },
]

const mockRow = {
  startingSpend: 1,
  finalSpend: 1,
  incrementalSpend: 0,
  cpm: 0,
  startingOutcome: 0,
  finalOutcome: 1,
  incrementalOutcome: 0,
  startingRoas: 0,
  finalRoas: 0,
  incrementalRoas: 0,
}

const data = {
  digital: {
    display: mockRow,
    olv: mockRow,
    other: mockRow,
  },
  other: {
    ooh: mockRow,
  },
  paidSocial: {
    fbInsta: mockRow,
    other: mockRow,
    snapchat: mockRow,
    twitter: mockRow,
  },
  radio: {
    streaming: mockRow,
  },
  tv: {
    platformAgnostic: mockRow,
    traditional: mockRow,
  }
}
*/

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative'
  },
  columnsButton: {
    position: 'absolute',
    top: `-${theme.spacing(6)}px`,
    right: 0
  }
}))

const DetailedResults = ({ hiddenColumns, setHiddenColumns, columns, data }) => {
  const styles = useStyles()

  const tableColumns = useMemo(
    () => columns.map(col => {
      const c = col.toLowerCase()
      if (c.includes('spend') || c.includes('outcome')) {
        return { field: col, label: col, format: 'currency' }
      } else if (c.includes('%')) {
        return { field: col, label: col, format: 'percentOne' }
      } else {
        return { field: col, label: col, format: 'currency' }
      }
    }),
    [columns]
  )

  const visibleColumns = useMemo(
    () => Array(columns.length)
      .fill(0)
      .map((_, key) => key)
      .filter(i => !hiddenColumns.includes(i))
      .map(i => tableColumns[i]),
    [columns, tableColumns, hiddenColumns]
  )

  return (
    <div className={styles.root}>
      <ColumnsToggle
        columns={tableColumns}
        hiddenColumns={hiddenColumns}
        onColumnToggled={setHiddenColumns}
        className={styles.columnsButton}
      />
      <DataTable
        columns={visibleColumns}
        data={data}
      />
    </div>
  )
}


const selectors = createStructuredSelector({
  hiddenColumns: detailedResultsHiddenColumnsSelector,
  data: detailedResultsSelector,
  columns: detailedResultsColumnsSelector
})

const actions = {
  setHiddenColumns: setDetailedResultsHiddenColumns
}

export default connect(selectors, actions)(DetailedResults)
