import uuid from 'uuid'

import '../../../../../common/read-models/graphql/collections/index'
import stories from '../../../../../common/read-models/graphql/collections/stories'

import {
  STORY_CREATED,
  STORY_UPVOTED,
  STORY_UNVOTED,
  STORY_COMMENTED
} from '../../../../../common/events'

describe('read-models', () => {
  describe('stories', () => {
    it('eventHandler "STORY_CREATED" should create a story {type: "story"}', () => {
      const state = []

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
          comments: [],
          votes: []
        }
      ]

      expect(stories.projection[STORY_CREATED](state, event)).toEqual(nextState)
    })

    it('eventHandler "STORY_CREATED" should create a story {type: "ask"}', () => {
      const state = []

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
          comments: [],
          votes: []
        }
      ]

      expect(stories.projection[STORY_CREATED](state, event)).toEqual(nextState)
    })

    it('eventHandler "STORY_CREATED" should create a story {type: "show"}', () => {
      const state = []

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
          comments: [],
          votes: []
        }
      ]

      expect(stories.projection[STORY_CREATED](state, event)).toEqual(nextState)
    })

    it('eventHandler "STORY_UPVOTED"', () => {
      const aggregateId = uuid.v4()
      const userId = uuid.v4()
      const timestamp = Date.now()

      const state = [
        {
          id: aggregateId,
          type: 'story',
          title: 'Show HN: Google',
          link: 'https://google.com',
          commentCount: 0,
          comments: [],
          votes: [],
          createdAt: timestamp,
          createdBy: userId
        }
      ]

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
          comments: [],
          votes: [userId],
          createdAt: timestamp,
          createdBy: userId
        }
      ]

      expect(stories.projection[STORY_UPVOTED](state, event)).toEqual(nextState)
    })

    it('eventHandler "STORY_UPVOTED" with incorrect aggregateId', () => {
      const aggregateId = uuid.v4()
      const userId = uuid.v4()
      const timestamp = Date.now()

      const state = [
        {
          id: aggregateId,
          type: 'story',
          title: 'Show HN: Google',
          link: 'https://google.com',
          commentCount: 0,
          comments: [],
          votes: [],
          createdAt: timestamp,
          createdBy: userId
        }
      ]

      const event = {
        aggregateId: 'incorrectId',
        payload: {
          userId
        }
      }

      expect(stories.projection[STORY_UPVOTED](state, event)).toEqual(state)
    })

    it('eventHandler "STORY_UNVOTED"', () => {
      const aggregateId = uuid.v4()
      const userId = uuid.v4()
      const timestamp = Date.now()

      const state = [
        {
          id: aggregateId,
          type: 'story',
          title: 'Show HN: Google',
          link: 'https://google.com',
          commentCount: 0,
          comments: [],
          votes: [userId],
          createdAt: timestamp,
          createdBy: userId
        }
      ]

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
          comments: [],
          votes: [],
          createdAt: timestamp,
          createdBy: userId
        }
      ]

      expect(stories.projection[STORY_UNVOTED](state, event)).toEqual(nextState)
    })

    it('eventHandler "STORY_UNVOTED" with incorrect aggregateId', () => {
      const aggregateId = uuid.v4()
      const userId = uuid.v4()
      const timestamp = Date.now()

      const state = [
        {
          id: aggregateId,
          type: 'story',
          title: 'Show HN: Google',
          link: 'https://google.com',
          commentCount: 0,
          comments: [],
          votes: [userId],
          createdAt: timestamp,
          createdBy: userId
        }
      ]

      const event = {
        aggregateId: 'incorrectId',
        payload: {
          userId
        }
      }

      expect(stories.projection[STORY_UNVOTED](state, event)).toEqual(state)
    })

    it('eventHandler "STORY_COMMENTED"', () => {
      const aggregateId = uuid.v4()
      const commentId = uuid.v4()
      const userId = uuid.v4()
      const timestamp = Date.now()

      const state = [
        {
          id: aggregateId,
          type: 'story',
          title: 'Show HN: Google',
          link: 'https://google.com',
          commentCount: 0,
          comments: [],
          votes: [],
          createdAt: timestamp,
          createdBy: userId
        }
      ]

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
          comments: [
            {
              id: event.payload.commentId,
              parentId: event.payload.parentId,
              text: event.payload.text,
              level: 0,
              createdAt: event.timestamp,
              createdBy: event.payload.userId
            }
          ],
          votes: [],
          createdAt: timestamp,
          createdBy: userId
        }
      ]

      expect(stories.projection[STORY_COMMENTED](state, event)).toEqual(
        nextState
      )
    })

    it('eventHandler "STORY_COMMENTED" for reply', () => {
      const aggregateId = uuid.v4()
      const commentId = uuid.v4()
      const userId = uuid.v4()
      const parentId = uuid.v4()
      const timestamp = Date.now()
      const lastCommentId = uuid.v4()

      const state = [
        {
          id: aggregateId,
          type: 'story',
          title: 'Show HN: Google',
          link: 'https://google.com',
          commentCount: 0,
          comments: [
            {
              id: parentId,
              level: 0
            },
            {
              id: lastCommentId,
              level: 0
            }
          ],
          votes: [],
          createdAt: timestamp,
          createdBy: userId
        }
      ]

      const event = {
        aggregateId,
        timestamp: Date.now(),
        payload: {
          commentId,
          parentId,
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
          comments: [
            {
              id: parentId,
              level: 0
            },
            {
              id: event.payload.commentId,
              parentId: event.payload.parentId,
              text: event.payload.text,
              level: 1,
              createdAt: event.timestamp,
              createdBy: event.payload.userId
            },
            {
              id: lastCommentId,
              level: 0
            }
          ],
          votes: [],
          createdAt: timestamp,
          createdBy: userId
        }
      ]

      expect(stories.projection[STORY_COMMENTED](state, event)).toEqual(
        nextState
      )
    })

    it('eventHandler "STORY_COMMENTED" with incorrect aggregateId', () => {
      const aggregateId = uuid.v4()
      const commentId = uuid.v4()
      const userId = uuid.v4()
      const timestamp = Date.now()

      const state = [
        {
          id: aggregateId,
          type: 'story',
          title: 'Show HN: Google',
          link: 'https://google.com',
          commentCount: 0,
          comments: [],
          votes: [],
          createdAt: timestamp,
          createdBy: userId
        }
      ]

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

      expect(stories.projection[STORY_COMMENTED](state, event)).toEqual(state)
    })
  })
})
