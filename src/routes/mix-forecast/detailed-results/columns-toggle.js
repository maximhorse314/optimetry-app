import React, { useState, useEffect } from 'react'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Checkbox from '@material-ui/core/Checkbox'
import ColumnIcon from '@material-ui/icons/ViewColumn'
import xor from 'lodash/xor'

export default ({ columns, hiddenColumns, onColumnToggled, className }) => {
  const [anchorEl, setAnchorEl] = useState(null)

  const [hidden, setHidden] = useState([])

  useEffect(() => {
    setHidden(hiddenColumns)
  }, [hiddenColumns])

  const handleButtonClick = e => setAnchorEl(e.currentTarget)

  const handleCloseMenu = () => setAnchorEl(null)

  const handleColumnClicked = index => () => {
    const updated = xor(hidden, [index])
    onColumnToggled && onColumnToggled(updated)
    // setHidden(updated)
  }

  return (
    <div className={className}>
      <Tooltip title='Toggle Columns'>
        <IconButton onClick={handleButtonClick} >
          <ColumnIcon />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={handleCloseMenu}
      >
        <MenuItem disabled style={{ opacity: 1 }}>
          Select columns to show
        </MenuItem>
        {columns.map(({ field, label }, key) => (
          <MenuItem key={field} component='label' htmlFor={`column-toggle-${field}`}>
            <Checkbox
              checked={!hidden.includes(key)}
              id={`column-toggle-${field}`}
              onChange={handleColumnClicked(key)}
            />
            <span>{label}</span>
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}
