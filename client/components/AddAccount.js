import React, {Component} from 'react'
import axios from 'axios'

export default class AddAccount extends Component {
  constructor(props) {
    super(props)
    this.state = {
      type: '',
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

    if (["USD", "EUR", "BRL", "INR"].includes(this.state.type)) {
      await axios.post('/api/accounts', this.state)
      this.props.autorefresh()
    }

    else {
      this.setState({invalid: true})
      setTimeout(() => {
        this.setState({invalid: false})}, 3000
      )
    }
    // this.setState({
    //   type: '',
    //   amount: ''
    // })
    //fix this so that this clears the field upon submit
  }

  render() {
    return(
    <div>
      <form>
      {this.state.invalid ? <div>Sorry, you can only open an account with USD, EUR, BRL, or INR.</div>: null}
        <label htmlFor="type">Type of Currency:</label>
        <input type ="text" name="type" onChange={this.handleChange}/>

        <label htmlFor="amount">Amount:</label>
        <input type ="text" name="amount" onChange={this.handleChange}/>

        <button type="button" onClick={this.handleSubmit}>
        New Account
        </button>

      </form>
    </div>
    )}

}



