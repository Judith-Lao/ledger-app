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
      <div>
        {account.type}
        {account.amount}
      </div>
    )
  }
}
