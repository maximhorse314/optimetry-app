import React, { useMemo } from 'react'
import MaterialTable from 'components/data-table'
import { renderFormattedNumber, numericEdit } from 'helpers/column'

export default function MediaChannels(props) {
  const columns = useMemo(() => (
    [
      {
        title: 'Media',
        field: 'Media',
        align: 'left',
        editable: 'never'
      },
      {
        title: 'Channel',
        field: 'Channel',
        align: 'left',
        editable: 'never'
      }
    ].concat(props.columns.map(({ label, key }) => ({
      title: label,
      field: key,
      align: 'right',
      editComponent: numericEdit(label),
      render: renderFormattedNumber(key, 'percentOne')
    }))).map(col => ({
      ...col,
      width: 'auto',
      headerStyle: { textAlign: col.align }
    }))),
    [props.columns]
  )

  const actions = [
    {
      icon: 'add_box',
      tooltip: 'Add',
      isFreeAction: true,
      onClick: props.onColumnEdit
    }
  ]

  const editable = {
    onBulkUpdate: changes =>
      new Promise(resolve => {
        const updated = [...props.data]
        Object.keys(changes).forEach(key => {
          const { newData, oldData } = changes[key]
          updated[oldData.tableData.id] = newData
        })
        props.onUpdate(updated.map(d => {
          const row = {}
          props.columns.forEach(({ key }) => row[key] = d[key])
          return row
        }))
        resolve()
      }),
  }

  return (
    <MaterialTable
      title="Enter each media channel's impact on sales channels."
      columns={columns}
      data={props.data}
      editable={props.columns.length ? editable : undefined}
      actions={actions}
      hideActionOnEdit
      options={{
        paging: false
      }}
    />
  )
}
