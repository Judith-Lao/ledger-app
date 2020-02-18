import React, {Component} from 'react'
import {BrowserRouter as Router, Link, Route} from 'react-router-dom'
import Accounts from './components/Accounts'
import Transactions from './components/Transactions'

const Main = () => {
    return (
      <Router>
      <div id='app' className='row container'>

        <nav>
          <div>
            {/* <Link to='/'>Home</Link> */}
            <Link to='/accounts'>Accounts</Link>
            <Link to='/transactions'>Transactions</Link>
          </div>
        </nav>

        <main>
          <h1>Ledger App</h1>
          <div>
            <Route exact path='/accounts' component={Accounts} />
            <Route exact path='/transactions' component={Transactions} />
          </div>
        </main>

      </div>
      </Router>
    )
}

export default Main
