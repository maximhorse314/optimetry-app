import React, { useState, useEffect, useRef } from 'react'
import { makeStyles, Typography } from '@material-ui/core'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import EditIcon from '@material-ui/icons/Edit'
import CheckIcon from '@material-ui/icons/Check'
import AddIcon from '@material-ui/icons/Add'
import CloseIcon from '@material-ui/icons/Close'
import { uuid } from 'helpers/utils'


const useStyles = makeStyles({
  listItem: {
    padding: '0em'
  },
  dialogContent: {
    width: '30em'
  },
  columnForm: {
    flexGrow: 1
  },
  columnEdit: {
    width: '100%'
  },
  newColumn: {
    padding: '0em',
    justifyContent: 'space-between'
  }
})

const ColumnEdit = ({ onChange, placeholder, value, onCancel, onSave}) => {
  const styles = useStyles()
  
  const handleSubmit = e => {
    onSave()
    e.preventDefault()
  }

  return (
    <>
      <form onSubmit={handleSubmit} className={styles.columnForm}>
        <TextField
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={styles.columnEdit}
          autoFocus
        />
      </form>
      <Tooltip title='Update'>
        <IconButton onClick={onSave}>
          <CheckIcon/>
        </IconButton>
      </Tooltip>
      <Tooltip title='Cancel'>
        <IconButton onClick={onCancel}>
          <CloseIcon/>
        </IconButton>
      </Tooltip>
    </>
  )
}

const Column = ({ label, onDelete, onEdit }) => (
  <>
    <ListItemText>{label}</ListItemText>
    <Tooltip title='Edit'>
      <IconButton onClick={onEdit}>
        <EditIcon/>
      </IconButton>
    </Tooltip>
    <Tooltip title='Delete'>
      <IconButton onClick={onDelete}>
        <CloseIcon/>
      </IconButton>
    </Tooltip>
  </>
)

const ConfirmDialog = ({ onYes, onNo, open }) => (
  <Dialog open={open} onClose={onNo}>
    <DialogTitle></DialogTitle>
    <DialogContent>You have an uncomplete column now. Will you discard and continue?</DialogContent>
    <DialogActions>
      <Button onClick={onNo} color="primary">
        No
      </Button>
      <Button onClick={onYes} color="primary" autoFocus>
        Yes
      </Button>
    </DialogActions>
  </Dialog>
)

export default props => {
  const [columns, setColumns] = useState(props.columns)
  const [editKey, setEditKey] = useState(null)
  const [editValue, setEditValue] = useState('')
  const [confirm, setConfirm] = useState(false)
  const nextAction = useRef(null)

  const styles = useStyles()
  
  useEffect(() => {
    setEditKey(null)
    setEditValue('')
    setConfirm(false)
    nextAction.current = null
  }, [props.open])
  
  useEffect(() => {
    setColumns(props.columns)
  }, [props.columns])
  
  const handleOkay = () => {
    if (editKey) {
      nextAction.current = 'okay'
      setConfirm(true)
    } else {
      props.onOkay(columns)
    }
  }
  
  const handleCancel = () => {
    if (editKey) {
      nextAction.current = 'cancel'
      setConfirm(true)
    } else {
      props.onCancel()
    }
  }

  const handleEditValueCancel = () => {
    setEditKey(null)
    setEditValue('')
  }
  
  const handleEditValueSave = () => {
    if (editValue) {
      setColumns(cols => {
        if (editKey === 'new') {
          return cols.concat([{ key: uuid(), label: editValue }])
        } else {
          return cols.map(col => col.key === editKey ? ({ key: col.key, label: editValue }) : col)
        }
      })
      setEditKey(null)
      setEditValue('')
    }
  }
    
  const handleEditValueChange = e => setEditValue(e.target.value)
  
  const handleDelete = key => () =>
    setColumns(cols => cols.filter(col => col.key !== key))

  const handleEdit = key => () => {
    if (editKey) {
      setConfirm(true)
      nextAction.current = key
    } else {
      const col = columns.find(col => col.key === key)
      setEditKey(key)
      if (col) {
        setEditValue(col.label)
      }
    }
  }

  const handleEditNewColumn = () => {
    if (editKey) {
      setConfirm(true)
      nextAction.current = 'new'
    } else {
      setEditKey('new')
    }
  }
  
  const handleConfirmYes = () => {
    switch (nextAction.current) {
      case 'okay':
        props.onOkay(columns)
        break
      case 'cancel':
        props.onCancel()
        break
      case 'new':
        setEditKey('new')
        break
      default:
        setEditKey(nextAction.current)
      }
      setConfirm(false)
    }

  const handleConfirmNo = () => setConfirm(false)

  return (
    <Dialog
      open={props.open}
      onClose={handleCancel}
      aria-labelledby="column-dialog-title"
      aria-describedby="column-dialog-description"
    >
      <DialogTitle id="column-dialog-title">Column Edit</DialogTitle>
      <DialogContent className={styles.dialogContent}>
        <List>
          {columns.map(({ label, key }) => (
            <ListItem key={key} className={styles.listItem}>
              {editKey === key ? (
                <ColumnEdit
                  value={editValue}
                  onChange={handleEditValueChange}
                  onCancel={handleEditValueCancel}
                  onSave={handleEditValueSave}
                />
              ) : (
                <Column
                  label={label}
                  onDelete={handleDelete(key)}
                  onEdit={handleEdit(key)}
                />
              )}
            </ListItem>
          ))}
          <ListItem className={styles.newColumn}>
            {editKey === 'new' ? (
              <ColumnEdit
                value={editValue}
                onChange={handleEditValueChange}
                onCancel={handleEditValueCancel}
                onSave={handleEditValueSave}
                placeholder='Add new column'
              />
            ) : (
              <>
                <Typography>Add new column</Typography>
                <Tooltip title='Add New'>
                  <IconButton onClick={handleEditNewColumn}>
                    <AddIcon/>
                  </IconButton>
                </Tooltip>
              </>
            )}
          </ListItem>
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="primary">
          Cancel
        </Button>
        <Button onClick={handleOkay} color="primary" autoFocus>
          Okay
        </Button>
      </DialogActions>
      <ConfirmDialog open={confirm} onYes={handleConfirmYes} onNo={handleConfirmNo} />
    </Dialog>
  )
}
