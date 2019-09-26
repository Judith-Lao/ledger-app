import React, {Component} from 'react'

export default class SingleAccount extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  render() {
    const account = this.props.account
    return (
      <div class="account">
        Account Number: {account.id}
        <br></br>
        {account.amount}
        {account.type}
      </div>
    )
  }
}
