import React from 'react'
import { Route, Switch } from 'react-router-dom'
import MediaBudget from 'routes/media-budget'
import MediaChannels from 'routes/media-channels'
import SalesChannels from 'routes/sales-channels'
import SalesForecast from 'routes/sales-forecast'
import MixForecast from 'routes/mix-forecast'

export default () => (
  <Switch>
    <Route exact path='/' component={MediaBudget} />
    <Route exact path='/media-budget' component={MediaBudget} />
    <Route exact path='/media-channels' component={MediaChannels} />
    <Route exact path='/sales-channels' component={SalesChannels} />
    <Route exact path='/sales-forecast' component={SalesForecast} />
    <Route path='/mix-forecast' component={MixForecast} />
  </Switch>
)
