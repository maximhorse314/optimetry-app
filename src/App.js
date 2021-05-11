import React, { useEffect } from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { useAuth0 } from '@auth0/auth0-react'
import Route from './routes'
import AppLayout from './layout'
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  fullScreen: {
    width: '100%',
    display: 'flex',
    height: '100vh'
  },
  centerScreen: {
    margin: 'auto',
    textAlign: 'center'
  }
}))

export default () => {
  const { isLoading, error, isAuthenticated, loginWithRedirect } = useAuth0()
  const classes = useStyles()

  useEffect(() => {
    if (!error && !isAuthenticated && !isLoading) {
      loginWithRedirect()
    }
  }, [loginWithRedirect, isAuthenticated, isLoading, error])

  return isAuthenticated ? (
    <>
      <CssBaseline />
      <AppLayout>
        <Route />
      </AppLayout>
    </>
  ) : (
    <div className={classes.fullScreen}>
      {error ? (
        <div className={classes.centerScreen}>
          <Typography variant='h6' gutterBottom>{error.message}</Typography>
          <Button onClick={loginWithRedirect} variant='outlined'>Retry</Button>
        </div>
      ) : (
        <img
          src='https://www.symamobile.com/version-201812/images/loader.svg'
          alt='loading...'
          className={classes.centerScreen}
        />
      )}
    </div>
  )
}
