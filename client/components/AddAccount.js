import React, {Component} from 'react'
import axios from 'axios'

export default class AddAccount extends Component {
  constructor(props) {
    super(props)
    this.state = {
      type: '',
      amount: '',
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

    if (["USD", "EUR", "BRL", "INR"].includes(this.state.type)) {
      await axios.post('/api/accounts', this.state)
      this.props.autorefresh()
      this.setState({
        type: '',
        amount: '',
        invalid: false
      })
    }

    else {
      this.setState({invalid: true})
      setTimeout(() => {
        this.setState({invalid: false})}, 3000
      )
    }
  }

  render() {
    return(
      <form onSubmit={this.handleSubmit}>
      {this.state.invalid ? <div>Sorry, you can only open an account with USD, EUR, BRL, or INR.</div>: null}
        <div>
        <label htmlFor="type">Type of Currency:</label>
        <input type ="text" value={this.state.type} name="type" class="input-text" onChange={this.handleChange}/>
        </div>

        <div>
        <label htmlFor="amount">Amount:</label>
        <input type ="text" value={this.state.amount} name="amount" class="input-text" onChange={this.handleChange}/>
        </div>

        <button type="submit" >
        New Account
        </button>
      </form>
    )}

}



