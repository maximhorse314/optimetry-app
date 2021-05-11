import React from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import Typography from '@material-ui/core/Typography'
import MaterialTable from 'components/data-table'
import useGlobalStyles from 'hooks/styles'
import { mediaChannelsSelector, setMediaChannels } from 'store/modules/media-channels'
import { renderFormattedNumber, numericEdit } from 'helpers/column'

const columns = [
  {
    title: 'Media',
    align: 'left',
    initialEditValue: '',
  },
  {
    title: 'Channel',
    align: 'left',
    initialEditValue: ''
  },
  {
    title: 'Lower Spend',
    align: 'right',
    editComponent: numericEdit('Lower Spend'),
    render: renderFormattedNumber('Lower Spend', 'currency'),
    initialEditValue: 0
  },
  {
    title: 'Starting Spend',
    align: 'right',
    editComponent: numericEdit('Starting Spend'),
    render: renderFormattedNumber('Starting Spend', 'currency'),
    initialEditValue: 0
  },
  {
    title: 'Upper Spend',
    align: 'right',
    editComponent: numericEdit('Upper Spend'),
    render: renderFormattedNumber('Upper Spend', 'currency'),
    initialEditValue: 0
  },
  {
    title: 'CPM',
    align: 'right',
    editComponent: numericEdit('CPM'),
    render: renderFormattedNumber('CPM', 'currency'),
    initialEditValue: 0
  },
  {
    title: 'Half-Life',
    align: 'right',
    editComponent: numericEdit('Half-Life'),
    render: renderFormattedNumber('Half-Life', 'decimalOne'),
    initialEditValue: 0
  },
  {
    title: 'Starting Saturation %',
    align: 'right',
    editComponent: numericEdit('Starting Saturation %'),
    render: renderFormattedNumber('Starting Saturation %', 'percentOne'),
    initialEditValue: 0
  },
  {
    title: 'Starting ROAS',
    align: 'right',
    editComponent: numericEdit('Starting ROAS'),
    render: renderFormattedNumber('Starting ROAS', 'currency'),
    initialEditValue: 0
  }
].map(col => ({
  ...col,
  field: col.title,
  width: 'auto',
  headerStyle: { textAlign: col.align }
}))

function MediaChannels({ data, setMediaChannels }) {
  const global = useGlobalStyles()

  const editable = {
    onRowAdd: newData =>
      new Promise(resolve => {
        setMediaChannels(data.concat([newData]))
        resolve()
      }),
    onBulkUpdate: changes =>
      new Promise(resolve => {
        const updated = [...data]
        Object.keys(changes).forEach(key => {
          const { newData, oldData } = changes[key]
          updated[oldData.tableData.id] = newData
        })
        setMediaChannels(updated)
        resolve()
      }),
    onRowDelete: oldData =>
      new Promise(resolve => {
        const updated = [...data]
        updated.splice(updated.indexOf(oldData), 1)
        setMediaChannels(updated)
        resolve()
      })
  }

  return (
    <div>
      <Typography variant='h5' component='h5' className={global.pageTitle}>
        Media Channels
      </Typography>
      <MaterialTable
        title='Enter media channels.'
        columns={columns}
        data={data}
        editable={editable}
        options={{
          paging: false
        }}
      />
    </div>
  )
}

const selectors = createStructuredSelector({
  data: mediaChannelsSelector
})

const actions = {
  setMediaChannels
}

export default connect(selectors, actions)(MediaChannels)
