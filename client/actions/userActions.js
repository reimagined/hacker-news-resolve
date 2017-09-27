import { createActions } from 'resolve-redux'
import aggregate from '../../common/aggregates/user'

export const logout = () => ({
  type: 'USER_LOGOUT'
})

export default createActions(aggregate)
