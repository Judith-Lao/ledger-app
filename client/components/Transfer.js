import React, {Component} from 'react'
import axios from 'axios'

export default class Transfer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      from_accountId: 0,
      isConversion: '',
      amount: 0,
      to_accountId: 0,
      overdraft: ''
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.isConversion = this.transferOrConversion.bind(this)
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  transferOrConversion(accounts) {
    //currently relies on all accounts belonging to one person, because this checks the type of the accounts based on their position in the array, but this will not work if [{id:0}, {id:4}]
    if (accounts[this.state.from_accountId-1].type === accounts[this.state.to_accountId-1].type) {
      this.setState({isConversion: false})
    }
    else {
      this.setState({isConversion: true})
    }
  }

  async handleSubmit(event) {
    let accounts = this.props.accounts
    event.preventDefault()
    await this.isConversion(accounts)

    if (this.state.amount > accounts[this.state.from_accountId -1].amount) {
      //tells you you've overdrafted the account, and then the "notification" disappears after three seconds
      this.setState({overdraft: true})
      setTimeout(() => {
        this.setState({overdraft: false})}, 3000
      )
    }

    else {
      if (!this.state.isConversion) {
        await axios.post('/api/transactions/incoming', {
          accountId: this.state.to_accountId,
          isTransfer: true,
          amount: this.state.amount
        })
        await axios.post('/api/transactions/outgoing', {
          accountId: this.state.from_accountId,
          isTransfer: true,
          amount: this.state.amount
        })
        this.props.autorefresh()

        let responseIncoming = await axios.get('/api/transactions/incoming')
        let responseOutgoing = await axios.get('/api/transactions/outgoing')
        await axios.post('/api/transactions/transfer', {
          //to grab the specific transactions, get the id of the last outgoing transaction and the last incoming transaction
          isConversion: false,
          outgoingTransactionId: responseOutgoing.data.length,
          incomingTransactionId: responseIncoming.data.length
        })
      }
      else {
        //conversionrate.data.rate accesses the multiplier
        let fromAccount = await axios.get(`/api/accounts/${this.state.from_accountId}`)
        let toAccount = await axios.get(`/api/accounts/${this.state.to_accountId}`)
        let conversionrate = await axios.get('/api/conversionrates', {
          params: {
            fromCurrencyType: fromAccount.data.type,
            toCurrencyType: toAccount.data.type
          }
        })

        //makes the outgoing transaction
        await axios.post('/api/transactions/outgoing', {
          accountId: this.state.from_accountId,
          isTransfer: true,
          amount: this.state.amount
        })

        //makes incoming transaction
        await axios.post('/api/transactions/incoming', {
          accountId: this.state.to_accountId,
          isTransfer: true,
          amount: this.state.amount*conversionrate.data.rate
        })

        this.props.autorefresh()

        let responseIncoming = await axios.get('/api/transactions/incoming')
        let responseOutgoing = await axios.get('/api/transactions/outgoing')
        await axios.post('/api/transactions/transfer', {
          //to grab the specific transactions, get the id of the last outgoing transaction and the last incoming transaction
          isConversion: true,
          outgoingTransactionId: responseOutgoing.data.length,
          incomingTransactionId: responseIncoming.data.length
        })

      }
    }

  }

  render() {
    return(
    <div>
      <form>
        {this.state.overdraft ? <div>Sorry, you do not have enough money in this account to transfer.</div>: null}
        <label htmlFor="type">Transfer from Account #:</label>
        <input type ="text" name="from_accountId" onChange={this.handleChange}/>

        <label htmlFor="amount">How much money would you like to transfer out of this account?</label>
        <input type ="text" name="amount" onChange={this.handleChange}/>

        <label htmlFor="amount">Into Account #:</label>
        <input type ="text" name="to_accountId" onChange={this.handleChange}/>

        <button type="button" onClick={this.handleSubmit}>
        Transfer
        </button>

      </form>
    </div>
    )}
}

