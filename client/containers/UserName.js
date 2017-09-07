import React from 'react'
import users from '../../common/read-models/users'

import { executeQuery } from '../decorators/subscribe'

class UserName extends React.PureComponent {
  state = {
    name: null
  }

  async componentDidMount() {
    if (!this.props.userId) {
      return
    }

    const resultOfQuery = await executeQuery({
      readModel: users,
      query:
        'query ($aggregateId: ID!) { users(aggregateId: $aggregateId) { name } }',
      variables: {
        aggregateId: this.props.userId
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
