import React, {Component} from 'react'
import axios from 'axios'

export default class Transfer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      from_accountId: 0,
      isTransfer: '',
      amount: 0,
      to_accountId: 0,
      overdraft: ''
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.transferOrConversion = this.transferOrConversion.bind(this)
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  transferOrConversion(accounts) {
    //currently relies on all accounts belonging to one person, because this checks the type of the accounts based on their position in the array, but this will not work if [{id:0}, {id:4}]
    if (accounts[this.state.from_accountId-1].type === accounts[this.state.to_accountId-1].type) {
      this.setState({isTransfer: true})
    }
    else {
      this.setState({isTransfer: false})
    }
  }

  async handleSubmit(event) {
    let accounts = this.props.accounts
    event.preventDefault()
    await this.transferOrConversion(accounts)

    if (this.state.amount > accounts[this.state.from_accountId -1].amount) {
      //tells you you've overdrafted the account, and then the "notification" disappears after three seconds
      this.setState({overdraft: true})
      setTimeout(() => {
        this.setState({overdraft: false})}, 3000
      )
    }

    else {
      if (this.state.isTransfer) {
        await axios.post('/api/transactions/incoming', {
          accountId: this.state.to_accountId,
          isTransfer: this.state.isTransfer,
          //is there a disadvantage to hardcoding this to be true?
          amount: this.state.amount
        })
        await axios.post('/api/transactions/outgoing', {
          accountId: this.state.from_accountId,
          isTransfer: this.state.isTransfer,
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
        console.log("this requires conversion logic")
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

