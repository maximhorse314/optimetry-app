import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import api from './api'
import mediaBudget from './media-budget'
import mediaChannels from './media-channels'
import salesChannels from './sales-channels'
import salesForecast from './sales-forecast'
import mixForecast from './mix-forecast'

export default history =>
  combineReducers({
    api,
    mediaBudget,
    mediaChannels,
    salesChannels,
    salesForecast,
    mixForecast,
    router: connectRouter(history)
  })
