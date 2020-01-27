import React, {Component} from 'react'
import SingleAccount from './SingleAccount'
import axios from 'axios'

export default class Transactions extends Component {

  constructor(props) {
    super(props)
    this.state = {
      accounts: [],
      deposit: [],
      allTransfers: [],
      transferWithConversion: [],
      transferWithoutConversion: []
    }
  }

  async componentDidMount() {
    //mounts the accounts from database
    const {data} = await axios.get('/api/accounts')
    data.sort(function(a,b) {return a.id - b.id})
    this.setState({
      accounts: data
    })
    this.getDeposits()
    this.getTransfers()
  }

  async getDeposits() {
    const allIncoming = await axios.get('/api/transactions/incoming')
    let deposit = allIncoming.data.filter(transaction => !transaction.isTransfer)
    this.setState({
      deposit
    })
  }

  async getTransfers() {
    const {data} = await axios.get('/api/transactions/transfer')
    let transferWithoutConversion = data.filter(data => !data.isConversion)
    let transferWithConversion = data.filter(data => data.isConversion)
    this.setState({
      allTransfers: data,
      transferWithConversion,
      transferWithoutConversion
    })
  }

  render() {
    return (
      <div>

        <div>
            {this.state.accounts ? this.state.accounts.map(account => <SingleAccount key={account.id} account={account}/> ) : null}
        </div>

        <div>
          {this.state.deposit ? this.state.deposit.map(deposit =>
          <div key={deposit.id}>
            {deposit.amount} was deposited to account ID {deposit.accountId} on {deposit.createdAt.slice(0,10)}
          </div>)
          : null}
        </div>

        <div>
            {this.state.allTransfers ? this.state.allTransfers.map(transfer =>
          <div key={transfer.id}>
  {transfer.outgoing.amount} was taken out of account ID {transfer.outgoing.accountId} and {transfer.incoming.amount} was deposited into account ID {transfer.incoming.accountId} on {transfer.createdAt.slice(0,10)}
          </div>)
          : null}
        </div>

      </div>
    )
  }
}
