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
      accounts: [],
      totalMoneyMoved: 0
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

  async convertToUSD(value, accountId) {
    //takes in value and accountId
    //if accountId.type is USD, return value
    //else, make the get request and return the conversionrate*value
    const isUSD = this.state.accounts[accountId].type === "USD"
    if (isUSD) {
      return value
    }
    else {
      const conversionRate = await axios.get('/api/conversionrates', {
        params: {
          fromCurrencyType: "EUR",
          toCurrencyType: "USD"
        }
        })
        return value * conversionRate.data.rate
    }
  }

  async incorporateUpdates (value, accountId) {
    //what is a better way than a callback function to autorefresh, because this repeats componentDidMount code
    const {data} = await axios.get('/api/accounts')
    data.sort(function(a,b) {return a.id - b.id})

    const USDmoved = await this.convertToUSD(value, accountId)

    this.setState({
      accounts: data,
      totalMoneyMoved: USDmoved
    }, () => console.log(this.state.totalMoneyMoved))
  }

  render() {
    return (
      <div className="container">
        <div className="accountcontainer">
          {this.state.accounts ? this.state.accounts.map(account => <SingleAccount key={account.id} account={account}/> ) : null}
        </div>

        <p>
          Since opening this application, you have moved {Number(this.state.totalMoneyMoved)} USD.
        </p>

        <div className="form-container">

        <AddAccount autorefresh={this.incorporateUpdates}/>

        <DepositMoney autorefresh={this.incorporateUpdates} accounts={this.state.accounts}/>

        <Transfer autorefresh={this.incorporateUpdates} accounts={this.state.accounts}/>

        </div>
      </div>
    )
  }
}
