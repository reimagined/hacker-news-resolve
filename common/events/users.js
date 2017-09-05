/* @flow */

const events = {
  USER_CREATED: 'UserCreated',
  PASSWORD_CHANGED: 'PasswordChanged'
}

export type UserCreated = {
  aggregateId: string,
  timestamp: string,
  payload: {
    name: string,
    passwordHash: string
  }
}

export type PasswordChanged = {
  aggregateId: string,
  timestamp: string,
  payload: {
    newPassword: string
  }
}

export default events
