import uuid from 'uuid'

import '../../common/read-models'
import storyDetails from '../../common/read-models/storyDetails'
import events from '../../common/events'

const {
  STORY_CREATED,
  STORY_UPVOTED,
  STORY_UNVOTED,
  STORY_DELETED,
  COMMENT_CREATED,
  COMMENT_REMOVED
} = events

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
          comments: [],
          commentsCount: 0,
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
          comments: [],
          commentsCount: 0,
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
          comments: [],
          commentsCount: 0,
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

    it('eventHandler "COMMENT_CREATED" should add comment.id to story.comments', () => {
      const parentId = uuid.v4()
      const commentId = uuid.v4()

      const state = storyDetails.initialState.concat({
        id: parentId,
        comments: [],
        commentsCount: 0
      })

      const event = {
        aggregateId: parentId,
        payload: {
          parentId,
          commentId
        }
      }

      const nextState = [
        {
          id: parentId,
          comments: [commentId],
          commentsCount: 1
        }
      ]

      expect(storyDetails.eventHandlers[COMMENT_CREATED](state, event)).toEqual(
        nextState
      )
    })

    it('eventHandler "COMMENT_CREATED" should increment comments count', () => {
      const parentId = uuid.v4()
      const aggregateId = uuid.v4()

      const state = storyDetails.initialState.concat({
        id: aggregateId,
        comments: [],
        commentsCount: 0
      })

      const event = {
        aggregateId,
        payload: {
          parentId
        }
      }

      const nextState = [
        {
          id: aggregateId,
          comments: [],
          commentsCount: 1
        }
      ]

      expect(storyDetails.eventHandlers[COMMENT_CREATED](state, event)).toEqual(
        nextState
      )
    })

    it('eventHandler "COMMENT_REMOVED" should remove comment.id from story.comments', () => {
      const parentId = uuid.v4()
      const commentId = uuid.v4()

      const state = storyDetails.initialState.concat({
        id: parentId,
        comments: [commentId],
        commentsCount: 1
      })

      const event = {
        aggregateId: parentId,
        payload: {
          parentId,
          commentId
        }
      }

      const nextState = [
        {
          id: parentId,
          comments: [],
          commentsCount: 0
        }
      ]

      expect(storyDetails.eventHandlers[COMMENT_REMOVED](state, event)).toEqual(
        nextState
      )
    })

    it('eventHandler "COMMENT_REMOVED" should decrement comments count', () => {
      const parentId = uuid.v4()
      const aggregateId = uuid.v4()

      const state = storyDetails.initialState.concat({
        id: aggregateId,
        comments: [],
        commentsCount: 1
      })

      const event = {
        aggregateId,
        payload: {
          parentId
        }
      }

      const nextState = [
        {
          id: aggregateId,
          comments: [],
          commentsCount: 0
        }
      ]

      expect(storyDetails.eventHandlers[COMMENT_REMOVED](state, event)).toEqual(
        nextState
      )
    })
  })
})
