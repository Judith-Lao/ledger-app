import React, {Component} from 'react'
import axios from 'axios'

export default class DepositMoney extends Component {
  constructor(props) {
    super(props)
    this.state = {
      accountId: 0,
      isTransfer: false,
      amount: 0,
      invalid: false
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  async handleSubmit(event) {
    event.preventDefault()
    if(this.state.accountId > this.props.accounts.length) {
      this.setState({invalid: true})
      setTimeout(() => {
        this.setState({invalid: false})}, 3000
      )
    }
    else {
      await axios.post('/api/transactions/incoming', this.state)
      this.props.autorefresh()
    }
  }

  render() {
    return(
    <div>
      <form>
      {this.state.invalid ? <div>This account does not exist. </div>: null}

      <div>
        <label htmlFor="type">Account #</label>
        <input type ="text" name="accountId" class="input-text" onChange={this.handleChange}/>
      </div>

      <div>
        <label htmlFor="amount">How much money would you like to deposit?</label>
        <input type ="text" name="amount" class="input-text" onChange={this.handleChange}/>
      </div>

      <button type="button" onClick={this.handleSubmit}>
        Deposit
      </button>

      </form>
    </div>
    )}

}
