/* @flow */

const events = {
  USER_CREATED: 'UserCreated'
}

export type UserCreated = {
  payload: {
    name: string
  }
}

export default events
