import uuid from 'uuid'

import '../../common/read-models'
import storyDetails from '../../common/read-models/storyDetails'
import events from '../../common/events'

const { STORY_CREATED, STORY_UPVOTED, STORY_UNVOTED, COMMENT_CREATED } = events

describe('read-models', () => {
  describe('storyDetails', () => {
    it('eventHandler "STORY_CREATED" should create a story {type: "ask"}', () => {
      const state = storyDetails.initialState
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
          repliesCount: 0,
          votes: []
        }
      ]

      expect(storyDetails.eventHandlers[STORY_CREATED](state, event)).toEqual(
        nextState
      )
    })

    it('eventHandler "STORY_CREATED" should create a story {type: "story"}', () => {
      const state = storyDetails.initialState
      const event = {
        aggregateId: uuid.v4(),
        timestamp: Date.now(),
        payload: {
          title: 'SomeTitle',
          text: 'SomeText',
          userId: uuid.v4(),
          link: 'SomeLink'
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
          repliesCount: 0,
          votes: []
        }
      ]

      expect(storyDetails.eventHandlers[STORY_CREATED](state, event)).toEqual(
        nextState
      )
    })

    it('eventHandler "STORY_CREATED" should create a story {type: "show"}', () => {
      const state = storyDetails.initialState
      const event = {
        aggregateId: uuid.v4(),
        timestamp: Date.now(),
        payload: {
          title: 'Show HN SomeTitle',
          text: 'SomeText',
          userId: uuid.v4(),
          link: 'SomeLink'
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
          repliesCount: 0,
          votes: []
        }
      ]

      expect(storyDetails.eventHandlers[STORY_CREATED](state, event)).toEqual(
        nextState
      )
    })

    it('eventHandler "STORY_UPVOTED" should upvote the story', () => {
      const aggregateId = uuid.v4()

      const state = storyDetails.initialState.concat({
        id: aggregateId,
        votes: []
      })

      const event = {
        aggregateId,
        timestamp: Date.now(),
        payload: {
          userId: uuid.v4()
        }
      }

      const nextState = [
        {
          id: aggregateId,
          votes: [event.payload.userId]
        }
      ]

      expect(storyDetails.eventHandlers[STORY_UPVOTED](state, event)).toEqual(
        nextState
      )
    })

    it('eventHandler "STORY_UNVOTED" should unvote the storyDetails', () => {
      const aggregateId = uuid.v4()
      const userId = uuid.v4()

      const state = storyDetails.initialState.concat({
        id: aggregateId,
        votes: [userId]
      })

      const event = {
        aggregateId,
        timestamp: Date.now(),
        payload: {
          userId
        }
      }

      const nextState = [
        {
          id: aggregateId,
          votes: []
        }
      ]

      expect(storyDetails.eventHandlers[STORY_UNVOTED](state, event)).toEqual(
        nextState
      )
    })

    it('eventHandler "COMMENT_CREATED" should add comment.id to story.comments and increment comments count', () => {
      const aggregateId = uuid.v4()
      const commentId = uuid.v4()
      const userId = uuid.v4()
      const text = 'text'

      const state = storyDetails.initialState.concat({
        id: aggregateId,
        repliesCount: 0
      })

      const event = {
        aggregateId,
        timestamp: Date.now(),
        payload: {
          commentId,
          parentId: aggregateId,
          userId,
          text
        }
      }

      const nextState = [
        {
          id: aggregateId,
          repliesCount: 1
        },
        {
          id: commentId,
          createdAt: Date.now(),
          createdBy: userId,
          parentId: aggregateId,
          text
        }
      ]

      expect(storyDetails.eventHandlers[COMMENT_CREATED](state, event)).toEqual(
        nextState
      )
    })

    it('eventHandler "COMMENT_CREATED" should increment comments count', () => {
      const userId = uuid.v4()
      const parentId = uuid.v4()
      const commentId = uuid.v4()
      const aggregateId = uuid.v4()
      const text = 'text'

      const state = storyDetails.initialState.concat({
        id: aggregateId,
        repliesCount: 0
      })

      const event = {
        aggregateId,
        timestamp: Date.now(),
        payload: {
          commentId,
          parentId: aggregateId,
          userId,
          text
        }
      }

      const nextState = [
        {
          id: aggregateId,
          repliesCount: 1
        },
        {
          id: commentId,
          parentId: aggregateId,
          createdBy: userId,
          createdAt: event.timestamp,
          text
        }
      ]

      expect(storyDetails.eventHandlers[COMMENT_CREATED](state, event)).toEqual(
        nextState
      )
    })
  })
})
