import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import subscribe from '../decorators/subscribe'
import '../styles/profile.css'

export const User = ({ id, name, createdAt, karma }) => {
  if (!id) {
    return (
      <div>
        <h1>Error</h1>
        User not found
      </div>
    )
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
            <td>{new Date(createdAt).toLocaleString('en-US')}</td>
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
  const { id } = match.params
  return id ? users.find(item => item.id === id) : user
}

export default subscribe(({ match }) => ({
  graphQL: [
    {
      readModel: 'users',
      query:
        'query ($id: ID!) { users(id: $id) { id, name, createdAt, karma } }',
      variables: {
        id: match.params.id
      }
    }
  ]
}))(connect(mapStateToProps)(User))
