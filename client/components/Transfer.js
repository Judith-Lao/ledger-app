import React, {Component} from 'react'
import axios from 'axios'

export default class Transfer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      from_accountId: 0,
      conversion: '',
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
    if (accounts[this.state.from_accountId-1].type == accounts[this.state.to_accountId-1].type) {
      this.setState({conversion: false})
    }
    else {
      this.setState({conversion: true})
    }
  }

  async handleSubmit(event) {
    let accounts = this.props.accounts
    event.preventDefault()

    if (this.state.amount > accounts[this.state.from_accountId -1].amount) {
      //tells you you've overdrafted the account, and then the "notification" disappears after three seconds
      this.setState({overdraft: true})
      setTimeout(() => {
        this.setState({overdraft: false})}, 3000
      )
    }

    else {
      this.transferOrConversion(accounts)
    }

    // await axios.post('/api/transactions/incoming', this.state)
    // await axios.post('/api/transactions/outgoing', this.state)
    this.props.autorefresh()
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

