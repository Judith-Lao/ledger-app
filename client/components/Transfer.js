import React, {Component} from 'react'
import axios from 'axios'

export default class Transfer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      from_accountId: '',
      isConversion: '',
      amount: '',
      to_accountId: '',
      overdraft: ''
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.isConversion = this.transferOrConversion.bind(this)
    this.transferMoney = this.transferMoney.bind(this)
    this.convertMoney = this.convertMoney.bind(this)
    this.setOverdraftNotification = this.setOverdraftNotification.bind(this)
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  transferOrConversion(accounts) {
    //currently relies on all accounts belonging to one person, because this checks the type of the accounts based on their position in the array, but this will not work if [{id:0}, {id:4}]
    if (accounts[this.state.from_accountId-1].type === accounts[this.state.to_accountId-1].type) {
      this.setState({isConversion: false})
    }
    else {
      this.setState({isConversion: true})
    }
  }

  async transferMoney() {
    await axios.post('/api/transactions/incoming', {
      accountId: this.state.to_accountId,
      isTransfer: true,
      amount: this.state.amount
    })
    await axios.post('/api/transactions/outgoing', {
      accountId: this.state.from_accountId,
      isTransfer: true,
      amount: this.state.amount
    })
    this.props.autorefresh(this.state.amount, this.state.from_accountId)

    let responseIncoming = await axios.get('/api/transactions/incoming')
    let responseOutgoing = await axios.get('/api/transactions/outgoing')
    await this.setState({
      from_accountId: '',
      isConversion: '',
      amount: '',
      to_accountId: '',
      overdraft: ''
    })
    await axios.post('/api/transactions/transfer', {
      //to grab the specific transactions, get the id of the last outgoing transaction and the last incoming transaction
      isConversion: false,
      outgoingTransactionId: responseOutgoing.data.length,
      incomingTransactionId: responseIncoming.data.length
    })
  }

  async convertMoney() {
    //conversionrate.data.rate accesses the multiplier
    let fromAccount = await axios.get(`/api/accounts/${this.state.from_accountId}`)
    let toAccount = await axios.get(`/api/accounts/${this.state.to_accountId}`)
    let conversionrate = await axios.get('/api/conversionrates', {
      params: {
        fromCurrencyType: fromAccount.data.type,
        toCurrencyType: toAccount.data.type
      }
    })

    //makes the outgoing transaction
    await axios.post('/api/transactions/outgoing', {
      accountId: this.state.from_accountId,
      isTransfer: true,
      amount: this.state.amount
    })

    //makes incoming transaction
    await axios.post('/api/transactions/incoming', {
      accountId: this.state.to_accountId,
      isTransfer: true,
      amount: this.state.amount*conversionrate.data.rate
    })

    this.props.autorefresh(this.state.amount, this.state.from_accountId)

    let responseIncoming = await axios.get('/api/transactions/incoming')
    let responseOutgoing = await axios.get('/api/transactions/outgoing')

    await this.setState({
      from_accountId: '',
      isConversion: '',
      amount: '',
      to_accountId: '',
      overdraft: ''
    })

    await axios.post('/api/transactions/transfer', {
      //to grab the specific transactions, get the id of the last outgoing transaction and the last incoming transaction
      isConversion: true,
      outgoingTransactionId: responseOutgoing.data.length,
      incomingTransactionId: responseIncoming.data.length
    })
  }

  setOverdraftNotification() {
    //tells you you've overdrafted the account, and then the "notification" disappears after three seconds
    this.setState({overdraft: true})
      setTimeout(() => {
        this.setState({overdraft: false})}, 3000
      )
  }

  async handleSubmit(event) {
    const accounts = this.props.accounts
    const accountToWithdrawFrom = this.state.from_accountId -1
    const isOverdrafted = this.state.amount > accounts[accountToWithdrawFrom].amount
    event.preventDefault()

    await this.transferOrConversion(accounts)
    if (isOverdrafted) {
      this.setOverdraftNotification()
      return
    }
    if (!this.state.isConversion) {
      this.transferMoney()
      return
    }
    if (this.state.isConversion) {
      this.convertMoney()
      return
    }
  }

  render() {
    return(
    <div>
      <form onSubmit={this.handleSubmit}>
        {this.state.overdraft ? <div>Sorry, you do not have enough money in this account to transfer.</div>: null}
        <div>
        <label htmlFor="type">Transfer from Account #:</label>
        <input type ="text" value={this.state.from_accountId} name="from_accountId" class="input-text" onChange={this.handleChange}/>
        </div>

        <div>
        <label htmlFor="amount">How much money would you like to transfer out of this account?</label>
        <input type ="text" value={this.state.amount} name="amount" class="input-text"  onChange={this.handleChange}/>
        </div>

        <div>
        <label htmlFor="amount">Into Account #:</label>
        <input type ="text" value={this.state.to_accountId} name="to_accountId" class="input-text" onChange={this.handleChange}/>
        </div>

        <button type="submit">
        Transfer
        </button>

      </form>
    </div>
    )}
}

