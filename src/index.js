import React from 'react'
import ReactDOM from 'react-dom/client'
import './bootstrap.min.css'
import './index.css'
import App from './App'
import { store } from './redux/store'
import { Provider } from 'react-redux'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  // strict mode at times causes the app to render 2x.
  <Provider store={store}>
    <App />
  </Provider>
)
