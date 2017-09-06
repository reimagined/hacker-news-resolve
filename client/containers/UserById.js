import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import subscribe from '../decorators/subscribe'
import users from '../../common/read-models/users'
import '../styles/profile.css'

export const UserById = ({ id, name, createdAt, karma }) => {
  if (!id) {
    return null
  }

  return (
    <div className="profile__content">
      <table>
        <tbody>
          <tr>
            <td>name:</td>
            <td>{name}</td>
          </tr>
          <tr>
            <td>created:</td>
            <td>{new Date(+createdAt).toLocaleString('en-US')}</td>
          </tr>
          <tr>
            <td>karma:</td>
            <td>{karma}</td>
          </tr>
        </tbody>
      </table>
      <div>
        <Link to="/changepw">change password</Link>
      </div>
    </div>
  )
}

export const mapStateToProps = ({ user, users }, { match }) => {
  const { userId } = match.params
  return userId ? users.find(({ id }) => id === userId) : user
}

export default subscribe(({ match }) => ({
  graphQL: [
    {
      readModel: users,
      query:
        'query ($aggregateId: ID!) { users(aggregateId: $aggregateId) { id, name, createdAt, karma } }',
      variables: {
        aggregateId: match.params.userId
      }
    }
  ]
}))(connect(mapStateToProps)(UserById))
