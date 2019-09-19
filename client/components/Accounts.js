import React, {Component} from 'react'
import SingleAccount from './SingleAccount'
import AddAccount from './AddAccount'
import axios from 'axios'

export default class Accounts extends Component {

  constructor(props) {
    super(props)
    this.state = {
      accounts: []
    }
    this.addNewAccount = this.addNewAccount.bind(this)
  }

  async componentDidMount() {
    const {data} = await axios.get('/api/accounts')
    this.setState({
      accounts: data
    })
  }

  async addNewAccount () {
    //passing callback function down to AddAccount, but there is a better way to
    //grab input from AddAccount and pass to parent component
    //(repeats componentDidMount code)
    const {data} = await axios.get('/api/accounts')
    this.setState({
      accounts: data
    })
  }

  render() {
    return (
      <div>
        <div>
          {this.state.accounts ? this.state.accounts.map(account => <SingleAccount key={account.id} account={account}/> ) : null}
        </div>

        <div>
          <AddAccount add={this.addNewAccount}/>
        </div>

      </div>
    )
  }
}
