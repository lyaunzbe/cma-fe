import { hot } from 'react-hot-loader'
import React, { } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import Home from 'routes/home'


import classNames from 'classnames/bind'
import style from './App.module.scss'
const cx = classNames.bind(style)

const App = () => {
  return (
    <div className={cx('app')}>
      <Router>
        <div className={cx('app__content')}>
          <Switch>
            <Route path='/'>
              <Home />
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  )
}

export default hot(module)(App)
