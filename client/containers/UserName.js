import React from 'react'
import users from '../../common/read-models/users'

import { executeQuery } from '../decorators/subscribe'

const cache = {}

export class UserName extends React.PureComponent {
  state = {
    name: null
  }

  async componentDidMount() {
    const { userId } = this.props

    if (!userId) {
      return
    }

    if (cache[userId]) {
      return this.setState({
        name: cache[userId]
      })
    }

    const resultOfQuery = await executeQuery({
      readModel: users,
      query:
        'query ($aggregateId: ID!) { users(aggregateId: $aggregateId) { name } }',
      variables: {
        aggregateId: userId
      }
    })

    const [user] = resultOfQuery.users
    if (this.refs.name) {
      this.setState({ name: user ? user.name : null })
    }
  }

  render() {
    const { name } = this.state

    return <span ref="name">{name}</span>
  }
}

export default UserName
