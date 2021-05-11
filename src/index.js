import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { Auth0Provider } from '@auth0/auth0-react';
import { Router } from 'react-router-dom'
import { IntlProvider } from 'react-intl'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import App from './App'
import store, { history } from 'store'
import intlConfig from 'config/intl'
import * as serviceWorker from './serviceWorker'
import './index.css'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#2aaae3",
    }
  }
})

const auth0 = {
  domain: process.env.REACT_APP_AUTH0_DOMAIN,
  clientId: process.env.REACT_APP_AUTH0_CLIENT_ID
}

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <IntlProvider {...intlConfig}>
          <Auth0Provider
            {...auth0}
            redirectUri={window.location.origin}
            cacheLocation='localstorage'
          >
            <Router history={history}>
              <App />
            </Router>
          </Auth0Provider>
        </IntlProvider>
      </Provider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
