import React, {Component} from 'react'
import SingleAccount from './SingleAccount'
import axios from 'axios'

export default class Accounts extends Component {

  constructor(props) {
    super(props)
    this.state = {
      transactions: []
    }
  }

  async componentDidMount () {
    const {data} = await axios.get('/api/transactions')
    this.setState({
      transactions: data
    })
  }

  render() {
    return (
      <div>
        {this.state.transactions ? this.state.transactions.map(transaction =>
        <div key={transaction.id}>
          {transaction.incomingAmount}
          {transaction.outgoingAmount}
        </div>)
        : null}
      </div>
    )
  }
}
