import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import subscribe from '../decorators/subscribe'
import users from '../../common/read-models/users'
import '../styles/profile.css'

export const UserById = ({ user, user: { name, createdAt, karma } }) => {
  if (!user) {
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

export const mapStateToProps = (
  { user, users },
  { match: { params: { userId } } }
) => ({
  user: userId ? users.find(({ id }) => id === userId) : user
})

export default subscribe(({ match: { params: { userId } } }) => ({
  graphQL: [
    {
      readModel: users,
      query:
        'query ($aggregateId: ID!) { users(aggregateId: $aggregateId) { id, name, createdAt, karma } }',
      variables: {
        aggregateId: userId
      }
    }
  ]
}))(connect(mapStateToProps)(UserById))
