import uuid from 'uuid'

import '../../common/read-models'
import stories from '../../common/read-models/stories'
import events from '../../common/events'

const { STORY_CREATED, STORY_UPVOTED, STORY_UNVOTED, COMMENT_CREATED } = events

describe('read-models', () => {
  describe('stories', () => {
    it('eventHandler "STORY_CREATED" should create a story {type: "story"}', () => {
      const state = stories.initialState
      const event = {
        aggregateId: uuid.v4(),
        timestamp: Date.now(),
        payload: {
          title: 'Google',
          link: 'https://google.com',
          userId: uuid.v4()
        }
      }

      const nextState = [
        {
          id: event.aggregateId,
          type: 'story',
          title: event.payload.title,
          text: event.payload.text,
          createdBy: event.payload.userId,
          createdAt: event.timestamp,
          link: event.payload.link,
          commentCount: 0,
          votes: []
        }
      ]

      expect(stories.eventHandlers[STORY_CREATED](state, event)).toEqual(
        nextState
      )
    })

    it('eventHandler "STORY_CREATED" should create a story {type: "ask"}', () => {
      const state = stories.initialState
      const event = {
        aggregateId: uuid.v4(),
        timestamp: Date.now(),
        payload: {
          title: 'SomeTitle',
          text: 'SomeText',
          userId: uuid.v4(),
          link: undefined
        }
      }

      const nextState = [
        {
          id: event.aggregateId,
          type: 'ask',
          title: event.payload.title,
          text: event.payload.text,
          createdBy: event.payload.userId,
          createdAt: event.timestamp,
          link: event.payload.link,
          commentCount: 0,
          votes: []
        }
      ]

      expect(stories.eventHandlers[STORY_CREATED](state, event)).toEqual(
        nextState
      )
    })

    it('eventHandler "STORY_CREATED" should create a story {type: "show"}', () => {
      const state = stories.initialState
      const event = {
        aggregateId: uuid.v4(),
        timestamp: Date.now(),
        payload: {
          title: 'Show HN: Google',
          link: 'https://google.com',
          userId: uuid.v4()
        }
      }

      const nextState = [
        {
          id: event.aggregateId,
          type: 'show',
          title: event.payload.title,
          text: event.payload.text,
          createdBy: event.payload.userId,
          createdAt: event.timestamp,
          link: event.payload.link,
          commentCount: 0,
          votes: []
        }
      ]

      expect(stories.eventHandlers[STORY_CREATED](state, event)).toEqual(
        nextState
      )
    })

    it('eventHandler "STORY_UPVOTED"', () => {
      const aggregateId = uuid.v4()
      const userId = uuid.v4()
      const timestamp = Date.now()
      const state = stories.initialState.concat({
        id: aggregateId,
        type: 'story',
        title: 'Show HN: Google',
        link: 'https://google.com',
        commentCount: 0,
        votes: [],
        createdAt: timestamp,
        createdBy: userId
      })

      const event = {
        aggregateId: aggregateId,
        payload: {
          userId
        }
      }

      const nextState = [
        {
          id: aggregateId,
          type: 'story',
          title: 'Show HN: Google',
          link: 'https://google.com',
          commentCount: 0,
          votes: [userId],
          createdAt: timestamp,
          createdBy: userId
        }
      ]

      expect(stories.eventHandlers[STORY_UPVOTED](state, event)).toEqual(
        nextState
      )
    })

    it('eventHandler "STORY_UPVOTED" with incorrect aggregateId', () => {
      const aggregateId = uuid.v4()
      const userId = uuid.v4()
      const timestamp = Date.now()
      const state = stories.initialState.concat({
        id: aggregateId,
        type: 'story',
        title: 'Show HN: Google',
        link: 'https://google.com',
        commentCount: 0,
        votes: [],
        createdAt: timestamp,
        createdBy: userId
      })

      const event = {
        aggregateId: 'incorrectId',
        payload: {
          userId
        }
      }

      expect(stories.eventHandlers[STORY_UPVOTED](state, event)).toEqual(state)
    })

    it('eventHandler "STORY_UNVOTED"', () => {
      const aggregateId = uuid.v4()
      const userId = uuid.v4()
      const timestamp = Date.now()
      const state = stories.initialState.concat({
        id: aggregateId,
        type: 'story',
        title: 'Show HN: Google',
        link: 'https://google.com',
        commentCount: 0,
        votes: [userId],
        createdAt: timestamp,
        createdBy: userId
      })

      const event = {
        aggregateId: aggregateId,
        payload: {
          userId
        }
      }

      const nextState = [
        {
          id: aggregateId,
          type: 'story',
          title: 'Show HN: Google',
          link: 'https://google.com',
          commentCount: 0,
          votes: [],
          createdAt: timestamp,
          createdBy: userId
        }
      ]

      expect(stories.eventHandlers[STORY_UNVOTED](state, event)).toEqual(
        nextState
      )
    })

    it('eventHandler "STORY_UNVOTED" with incorrect aggregateId', () => {
      const aggregateId = uuid.v4()
      const userId = uuid.v4()
      const timestamp = Date.now()

      const state = stories.initialState.concat({
        id: aggregateId,
        type: 'story',
        title: 'Show HN: Google',
        link: 'https://google.com',
        commentCount: 0,
        votes: [userId],
        createdAt: timestamp,
        createdBy: userId
      })

      const event = {
        aggregateId: 'incorrectId',
        payload: {
          userId
        }
      }

      expect(stories.eventHandlers[STORY_UNVOTED](state, event)).toEqual(state)
    })

    it('eventHandler "COMMENT_CREATED"', () => {
      const aggregateId = uuid.v4()
      const commentId = uuid.v4()
      const userId = uuid.v4()
      const timestamp = Date.now()
      const state = stories.initialState.concat({
        id: aggregateId,
        type: 'story',
        title: 'Show HN: Google',
        link: 'https://google.com',
        commentCount: 0,
        votes: [],
        createdAt: timestamp,
        createdBy: userId
      })

      const event = {
        aggregateId,
        timestamp: Date.now(),
        payload: {
          commentId,
          parentId: aggregateId,
          userId,
          text: 'comment'
        }
      }

      const nextState = [
        {
          id: aggregateId,
          type: 'story',
          title: 'Show HN: Google',
          link: 'https://google.com',
          commentCount: 1,
          votes: [],
          createdAt: timestamp,
          createdBy: userId
        }
      ]

      expect(stories.eventHandlers[COMMENT_CREATED](state, event)).toEqual(
        nextState
      )
    })

    it('eventHandler "COMMENT_CREATED" with incorrect aggregateId', () => {
      const aggregateId = uuid.v4()
      const commentId = uuid.v4()
      const userId = uuid.v4()
      const timestamp = Date.now()

      const state = stories.initialState.concat({
        id: aggregateId,
        type: 'story',
        title: 'Show HN: Google',
        link: 'https://google.com',
        commentCount: 0,
        votes: [],
        createdAt: timestamp,
        createdBy: userId
      })

      const event = {
        aggregateId: 'incorrectId',
        timestamp: Date.now(),
        payload: {
          commentId,
          parentId: aggregateId,
          userId,
          text: 'comment'
        }
      }

      expect(stories.eventHandlers[COMMENT_CREATED](state, event)).toEqual(
        state
      )
    })
  })
})
