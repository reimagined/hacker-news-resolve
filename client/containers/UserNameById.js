import React from 'react'
import { gqlConnector } from 'resolve-redux'

export const UserNameById = ({ data: { user } }) => {
  return <span>{(user && user.name) || null}</span>
}

export default gqlConnector(
  `
    query($id: ID!) {
      user(id: $id) {
        name
      }
    }
  `,
  {
    options: ({ id }) => ({
      variables: {
        id
      }
    })
  }
)(UserNameById)
