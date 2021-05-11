import React from 'react'
import { Switch, Route, Link, useLocation, useRouteMatch } from 'react-router-dom'
import Typography from '@material-ui/core/Typography'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
// import ExecutiveSummary from './executive-summary'
import SalesResponse from './sales-response'
import DetailedResults from './detailed-results'

const routes = [
  // { label: 'Executive Summary', link: '/executive-summary', component: ExecutiveSummary },
  { label: 'Sales Response', link: '/sales-response', component: SalesResponse },
  { label: 'Detailed Results', link: '/detailed-results', component: DetailedResults }
]

export default function MixForecast() {
  const routeMatch = useRouteMatch()
  const location = useLocation()

  return (
    <div>
      <Typography variant='h5' component='h5' className={global.pageTitle}>
        Mix Forecast
      </Typography>
      <Tabs
        value={Math.max(0, routes.findIndex(route => routeMatch.path + route.link === location.pathname))}
        indicatorColor='primary'
        textColor='primary'
        centered
      >
        {routes.map(({ label, link }) => (
          <Tab
            label={label}
            component={Link}
            to={routeMatch.path + link}
            key={link}
          />
        ))}
      </Tabs>
      
      <Switch>
        {routes.map(({ link, component }) => (
          <Route key={link} path={routeMatch.path + link} component={component} />
        ))}
        <Route path={routeMatch.path} component={routes[0].component} />
      </Switch>
    </div>
  )
}
