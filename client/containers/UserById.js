import React from 'react'
import { graphql, gql } from 'react-apollo'

import '../styles/profile.css'

export const UserById = ({ data: { user } }) => {
  if (!user) {
    return null
  }

  return (
    <div className="profile__content">
      <table>
        <tbody>
          <tr>
            <td>name:</td>
            <td>{user.name}</td>
          </tr>
          <tr>
            <td>created:</td>
            <td>{new Date(+user.createdAt).toLocaleString('en-US')}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default graphql(
  gql`
    query($id: ID!) {
      user(id: $id) {
        id
        name
        createdAt
      }
    }
  `,
  {
    options: ({ match: { params: { userId } } }) => ({
      variables: {
        id: userId
      }
    })
  }
)(UserById)
