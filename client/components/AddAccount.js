import React, {Component} from 'react'
import axios from 'axios'

export default class AddAccount extends Component {
  constructor(props) {
    super(props)
    this.state = {
      type: '',
      amount: ''
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
    await axios.post('/api/accounts', this.state)
    this.props.add() //so that you don't need to refresh to see the new account
    this.setState({
      type: '',
      amount: ''
    })
    //fix this so that this clears the field upon submit
  }

  render() {
    return(
    <div>
      <form>

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



