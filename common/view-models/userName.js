import type { Event, UserCreated } from '../../flow-types/events'

import { USER_CREATED } from '../events'

export default {
  name: 'userName',
  projection: {
    Init: () => '',
    [USER_CREATED]: (_: any, { payload: { name } }: Event<UserCreated>) => {
      return name
    }
  },
  serializeState: (state: any) => state,
  deserializeState: (state: any) => state
}
