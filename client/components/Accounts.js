import React, {Component} from 'react'
import SingleAccount from './SingleAccount'
import AddAccount from './AddAccount'
import DepositMoney from './DepositMoney'
import Transfer from './Transfer'
import axios from 'axios'

export default class Accounts extends Component {

  constructor(props) {
    super(props)
    this.state = {
      accounts: []
    }
    this.incorporateUpdates = this.incorporateUpdates.bind(this)
  }

  async componentDidMount() {
    const {data} = await axios.get('/api/accounts')
    data.sort(function(a,b) {return a.id - b.id})
    this.setState({
      accounts: data
    })
  }

  async incorporateUpdates () {
    //there has to be a better way than a callback function to autorefresh, because this repeats componentDidMount code
    const {data} = await axios.get('/api/accounts')
    data.sort(function(a,b) {return a.id - b.id})
    this.setState({
      accounts: data
    })
  }

  render() {
    return (
      <div>
        <div>
          {this.state.accounts ? this.state.accounts.map(account => <SingleAccount key={account.id} account={account}/> ) : null}
        </div>

        <div>
          <AddAccount autorefresh={this.incorporateUpdates}/>
        </div>

        <div>
          <DepositMoney autorefresh={this.incorporateUpdates} accounts={this.state.accounts}/>
        </div>

        <div>
          <Transfer autorefresh={this.incorporateUpdates} accounts={this.state.accounts}/>
        </div>
      </div>
    )
  }
}
