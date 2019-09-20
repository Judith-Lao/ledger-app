import React, {Component} from 'react'
import axios from 'axios'

export default class DepositMoney extends Component {
  constructor(props) {
    super(props)
    this.state = {
      accountId: 0,
      amount: 0
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
    await axios.post('/api/transactions/incoming', this.state)
    this.props.autorefresh()
  }

  render() {
    return(
    <div>
      <form>

        <label htmlFor="type">Account #</label>
        <input type ="text" name="account" onChange={this.handleChange}/>

        <label htmlFor="amount">How much money would you like to deposit?</label>
        <input type ="text" name="amount" onChange={this.handleChange}/>

        <button type="button" onClick={this.handleSubmit}>
        Deposit
        </button>

      </form>
    </div>
    )}

}

