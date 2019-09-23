import React, {Component} from 'react'
import SingleAccount from './SingleAccount'
import axios from 'axios'

export default class Transactions extends Component {

  constructor(props) {
    super(props)
    this.state = {
      accounts: [],
      deposit: [],
      // withdrawal: [],
      transferWithConversion: [],
      transferWithoutConversion: []
    }
  }

  async componentDidMount () {
    //mounts the accounts from database
    const {data} = await axios.get('/api/accounts')
    data.sort(function(a,b) {return a.id - b.id})
    this.setState({
      accounts: data
    })
    //mounts all deposits and withdrawals from database
    const allIncoming = await axios.get('/api/transactions/incoming')
    let deposit = allIncoming.data.filter(transaction => !transaction.isTransfer)
    // const allOutgoing = await axios.get('/api/transactions/outgoing')
    // let withdrawal = allOutgoing.data.filter(transaction => !transaction.isTransfer)
    this.setState({
      deposit
    })
  }

  render() {
    return (
      <div>
        <div>
            {this.state.accounts ? this.state.accounts.map(account => <SingleAccount key={account.id} account={account}/> ) : null}
          </div>
        <div>
          {this.state ? this.state.deposit.map(transaction =>
          <div key={transaction.id}>
            {transaction.incomingAmount} was deposited to account ID {transaction.accountId} on {transaction.createdAt.slice(0,10)}
          </div>)
          : null}
        </div>
      </div>
    )
  }
}
