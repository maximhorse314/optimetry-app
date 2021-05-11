import React, { useState, useMemo } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import Typography from '@material-ui/core/Typography'
import useGlobalStyles from 'hooks/styles'
import DataTable from './data-table'
import ColumnEdit from './column-edit'
import { mediaChannelsSelector } from 'store/modules/media-channels'
import { salesChannelsSelector, channelsSelector, setSalesChannels, setChannels } from 'store/modules/sales-channels'

function SalesChannels({
  setSalesChannels,
  setChannels,
  channels,
  mediaChannels,
  salesChannels
}) {
  const global = useGlobalStyles()
  const [dialog, setDialog] = useState(false)

  const data = useMemo(
    () => mediaChannels.map(({ Media, Channel }, key) => ({
      Media,
      Channel,
      ...salesChannels[key]
    })),
    [mediaChannels, salesChannels]
  )

  const handleUpdateData = data => setSalesChannels(data)

  const handleColumnEdit = () => setDialog(true)

  const handleCancelDialog = () => setDialog(false)

  const handleOkayDialog = cols => {
    setChannels(cols)
    setDialog(false)
  }
  
  return (
    <div>
      <Typography variant='h5' component='h5' className={global.pageTitle}>
        Sales Channels
      </Typography>
      <DataTable
        columns={channels}
        data={data}
        onUpdate={handleUpdateData}
        onColumnEdit={handleColumnEdit}
      />
      <ColumnEdit
        open={dialog}
        columns={channels}
        onCancel={handleCancelDialog}
        onOkay={handleOkayDialog}
      />
    </div>
  )
}

const selectors = createStructuredSelector({
  mediaChannels: mediaChannelsSelector,
  salesChannels: salesChannelsSelector,
  channels: channelsSelector
})

const actions = {
  setSalesChannels,
  setChannels
}

export default connect(selectors, actions)(SalesChannels)
