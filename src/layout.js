import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Link, useLocation } from 'react-router-dom'
import clsx from 'clsx'
import { useIntl } from 'react-intl'
import { useAuth0 } from '@auth0/auth0-react'
import { makeStyles, useTheme, duration } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import AppBar from '@material-ui/core/AppBar'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Toolbar from '@material-ui/core/Toolbar'
import CircularProgress from '@material-ui/core/CircularProgress'
import List from '@material-ui/core/List'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import AttachMoneyIcon from '@material-ui/icons/AttachMoney'
import TvIcon from '@material-ui/icons/Tv'
import AccountIcon from '@material-ui/icons/AccountCircle';
import TimelineIcon from '@material-ui/icons/Timeline'
import StoreIcon from '@material-ui/icons/Store'
import BarChartIcon from '@material-ui/icons/BarChart'
import Button from '@material-ui/core/Button'
import Snackbar from '@material-ui/core/Snackbar'
import Alert from '@material-ui/lab/Alert'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import CloudDownloadIcon from '@material-ui/icons/CloudDownload'

import { requestStatusSelector, REQUEST_PENDING, REQUEST_REJECTED, REQUEST_SUCCESS } from 'store/modules/api'
import { mediaBudgetSelector } from 'store/modules/media-budget'
import { mediaChannelsSelector } from 'store/modules/media-channels'
import { salesChannelsSelector, channelsSelector } from 'store/modules/sales-channels'
import { salesForecastSelector, periodSelector } from 'store/modules/sales-forecast'
import { saveScenario, loadScenario, importScenario } from 'store/modules/scenario'
import getScenario, { exportAsExcel, getImportData } from 'helpers/scenario'

const drawerWidth = 240

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  fileInput: {
    display: 'none'
  },
  loading: {
    position: 'fixed',
    margin: 'auto',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 9999
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    paddingTop: theme.spacing(12),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  importButton: {
    marginBottom: theme.spacing(2),
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    background: "#f0f0f0",
  },
  runButton: {
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    '&:not(.Mui-disabled)': {
      background: "linear-gradient(45deg, #ff1b33 100%, #ff1b33 0%)",
      color: "#fff"
    }
  },
  exportButton: {
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    background: "#f0f0f0",
  },
  appbarTitle: {
    flexGrow: 1
  }
}))

const links = [
  {link: '/media-budget', label: 'Media Budget', icon: AttachMoneyIcon},
  {link: '/media-channels', label: 'Media Channels', icon: TvIcon},
  {link: '/sales-channels', label: 'Sales Channels', icon: StoreIcon},
  {link: '/sales-forecast', label: 'Sales Forecast', icon: TimelineIcon},
  {link: '/mix-forecast', label: 'Mix Forecast', icon: BarChartIcon},
]


const RequestStatus = ({ type, message, onClose }) => {
  const classes = useStyles()

  if (type === 'loading') {
    return <CircularProgress className={classes.loading} />
  } else {
    return (
      <Snackbar open={true} autoHideDuration={3000} onClose={onClose}>
        <Alert severity={type} variant='filled'>
          {message}
        </Alert>
      </Snackbar>
    )
  }
}

function Layout({
  children,

  // selectors
  mediaBudget,
  mediaChannels,
  salesChannels,
  channels,
  salesForecast,
  period,
  saveScenarioRequestStatus,
  loadScenarioRequestStatus,

  //actions
  saveScenario,
  loadScenario,
  importScenario
}) {
  const { user, logout } = useAuth0()

  const location = useLocation()

  const classes = useStyles()

  const theme = useTheme()

  const [menuEl, setMenuEl] = useState(null)

  const [drawerOpen, setDrawerOpen] = useState(true)

  const [requestStatus, setRequestStatus] = useState(false)

  const intl = useIntl()
  
  const handleMenuOpen = event => setMenuEl(event.currentTarget)

  const handleMenuClose = () => setMenuEl(null)

  const handleDrawerOpen = () => setDrawerOpen(true)

  const handleDrawerClose = () => setDrawerOpen(false)

  const handleSignOut = () => {
    setMenuEl(null)
    logout({ returnTo: window.location.origin})
  }

  const handleImportScenario = e => {
    const [f] = e.target.files
    const reader = new FileReader()
    reader.onload = e => importScenario({
      data: getImportData(e.target.result),
      success: () => setRequestStatus({ type: 'success', message: 'Scenario imported'}),
      fail: () => setRequestStatus({ type: 'error', message: 'Invalid senario file'})
    })
    reader.readAsArrayBuffer(f)
    e.target.value = null
  }

  const handleExportScenario = () =>
    exportAsExcel(getScenario({
      mediaBudget,
      mediaChannels,
      salesChannels,
      channels,
      salesForecast,
      period
    }), intl)

  const handleRunScenarioClick = () =>
    saveScenario({
      data: getScenario({
        mediaBudget,
        mediaChannels,
        salesChannels,
        channels,
        salesForecast,
        period
      })
    })
  
  useEffect(() => {
    window.dispatchEvent(new Event('resize'))
  }, [drawerOpen])

  useEffect(() => {
    loadScenario()
  }, [loadScenario])

  useEffect(() => {
    switch (loadScenarioRequestStatus) {
      case REQUEST_PENDING:
        return setRequestStatus({ type: 'loading' })

      case REQUEST_SUCCESS:
        setRequestStatus(false)
        break

      case REQUEST_REJECTED:
        setRequestStatus({ type: 'error', message: 'Failed to load scenario'})
        break
      
      default:
    }
  }, [loadScenarioRequestStatus])

  useEffect(() => {
    switch (saveScenarioRequestStatus) {
      case REQUEST_PENDING:
        return setRequestStatus({ type: 'loading' })

      case REQUEST_SUCCESS:
        setRequestStatus({ type: 'success', message: 'Scenario saved'})
        break

      case REQUEST_REJECTED:
        setRequestStatus({ type: 'error', message: 'Failed to save scenario'})
        break
      
      default:
    }
  }, [saveScenarioRequestStatus])

  const handleHideRequestResult = () => setRequestStatus(false)
  
  return (
    <div className={classes.root}>
      {requestStatus && (
        <RequestStatus
          type={requestStatus.type}
          message={requestStatus.message}
          onClose={handleHideRequestResult}
        />
      )}

      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: drawerOpen,
        })}
        style={{ background: '#2aaae3', color: '#fff' }}
      >
        <Toolbar className={classes.root}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, drawerOpen && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.appbarTitle} noWrap >
            Optimetry
          </Typography>

          {true && (
            <div>
              <Button
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenuOpen}
                color="inherit"
              >
                <AccountIcon />
                &nbsp;
                {user && user.name}
              </Button>
              <Menu
                id="menu-appbar"
                anchorEl={menuEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={!!menuEl}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleSignOut} style={{ color: 'red' }}>LOG OUT</MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
      
      <Drawer
        className={classes.drawer}
        anchor="left"
        open={drawerOpen}
        classes={{
          paper: classes.drawerPaper,
        }}
        transitionDuration={{ enter: duration.enteringScreen, exit: duration.leavingScreen }}
        variant="persistent"
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <input
          type='file'
          accept='.xls, .xlsx'
          className={classes.fileInput}
          id='import-scenario'
          onChange={handleImportScenario}
        />
        <label htmlFor='import-scenario'>
          <Button
          component='span'
            variant='contained'
            color='default'
            className={classes.importButton}
            startIcon={<CloudUploadIcon />}
            disableElevation
          >
            Import Scenario
          </Button>
        </label>
        <Divider />
        <List>
          {links.map(({ link, label, icon: Icon }) => (
            <ListItem
              button
              key={link}
              component={Link}
              to={link}
              selected={location.pathname.startsWith(link)}
            >
              <ListItemIcon><Icon /></ListItemIcon>
              <ListItemText>{label}</ListItemText>
            </ListItem>
          ))}
        </List>
        <Divider />
        <Button
          variant="contained"
          className={classes.runButton}
          startIcon={<PlayArrowIcon />}
          onClick={handleRunScenarioClick}
          disabled={saveScenarioRequestStatus === REQUEST_PENDING}
          disableElevation
        >
          Run Scenario
        </Button>
        <Button
          variant="contained"
          className={classes.exportButton}
          startIcon={<CloudDownloadIcon />}
          onClick={handleExportScenario}
          disableElevation
        >
          Export Scenario
        </Button>
      </Drawer>
      
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: drawerOpen,
        })}
      >
        {children}
      </main>
    </div>
  )
}


const selectors = createStructuredSelector({
  mediaBudget: mediaBudgetSelector,
  mediaChannels: mediaChannelsSelector,
  salesChannels: salesChannelsSelector,
  channels: channelsSelector,
  salesForecast: salesForecastSelector,
  period: periodSelector,
  saveScenarioRequestStatus: requestStatusSelector('save-scenario', 'post'),
  loadScenarioRequestStatus: requestStatusSelector('load-scenario')
})

const actions = {
  saveScenario,
  loadScenario,
  importScenario
}

export default connect(selectors, actions)(Layout)
