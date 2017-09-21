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
          comments: [],
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
        comments: []
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
          comments: [
            {
              id: commentId,
              parentId: aggregateId,
              text,
              createdAt: event.timestamp,
              createdBy: userId
            }
          ]
        }
      ]

      expect(storyDetails.eventHandlers[COMMENT_CREATED](state, event)).toEqual(
        nextState
      )
    })

    it('eventHandler "COMMENT_CREATED" comment reply', () => {
      const aggregateId = uuid.v4()
      const commentId = uuid.v4()
      const replyId = uuid.v4()
      const userId = uuid.v4()
      const commentText = 'comment'
      const replyText = 'reply'

      const state = storyDetails.initialState.concat({
        id: aggregateId,
        comments: []
      })

      const commentEvent = {
        aggregateId,
        timestamp: Date.now(),
        payload: {
          commentId,
          parentId: aggregateId,
          text: commentText,
          userId
        }
      }
      const replyEvent = {
        aggregateId,
        timestamp: Date.now(),
        payload: {
          commentId: replyId,
          parentId: commentId,
          text: replyText,
          userId
        }
      }

      const finalState = [
        {
          id: aggregateId,
          comments: [
            {
              id: commentId,
              parentId: aggregateId,
              text: commentText,
              createdAt: commentEvent.timestamp,
              createdBy: userId
            },
            {
              id: replyId,
              parentId: commentId,
              text: replyText,
              createdAt: replyEvent.timestamp,
              createdBy: userId
            }
          ]
        }
      ]

      const nextState = storyDetails.eventHandlers[COMMENT_CREATED](
        state,
        commentEvent
      )
      expect(
        storyDetails.eventHandlers[COMMENT_CREATED](nextState, replyEvent)
      ).toEqual(finalState)
    })

    it('gqlResolver comment and reply', async () => {
      const date = Date.now()
      const state = [
        {
          id: 'story-id',
          comments: [
            {
              id: 'comment-id',
              parentId: 'story-id',
              text: 'commentText',
              createdAt: date,
              createdBy: 'unknown-user-id'
            },
            {
              id: 'reply-id',
              parentId: 'comment-id',
              text: 'replyText',
              createdAt: date,
              createdBy: 'user-id'
            }
          ]
        }
      ]
      const getReadModel = async () => {
        return [
          {
            id: 'user-id',
            name: 'user'
          }
        ]
      }

      const replyResult = await storyDetails.gqlResolvers.storyDetails(
        state,
        { commentId: 'reply-id' },
        { getReadModel }
      )
      expect(replyResult).toEqual([
        {
          id: 'story-id',
          comments: [
            {
              id: 'reply-id',
              parentId: 'comment-id',
              text: 'replyText',
              createdAt: date,
              createdBy: 'user-id',
              createdByName: 'user'
            }
          ]
        }
      ])

      const result = await storyDetails.gqlResolvers.storyDetails(
        state,
        { commentId: 'comment-id' },
        { getReadModel }
      )
      expect(result).toEqual([
        {
          id: 'story-id',
          comments: [
            {
              id: 'comment-id',
              parentId: 'story-id',
              text: 'commentText',
              createdAt: date,
              createdBy: 'unknown-user-id',
              createdByName: 'unknown'
            },
            {
              id: 'reply-id',
              parentId: 'comment-id',
              text: 'replyText',
              createdAt: date,
              createdBy: 'user-id',
              createdByName: 'user'
            }
          ]
        }
      ])
    })

    it('gqlResolver story', async () => {
      const date = Date.now()
      const state = [
        {
          id: 'story-id',
          comments: [],
          createdAt: date,
          createdBy: 'user-id'
        }
      ]
      const getReadModel = async () => {
        return [
          {
            id: 'user-id',
            name: 'user'
          }
        ]
      }

      const result = await storyDetails.gqlResolvers.storyDetails(
        state,
        {},
        { getReadModel }
      )
      expect(result).toEqual([
        {
          id: 'story-id',
          comments: [],
          createdAt: date,
          createdBy: 'user-id',
          createdByName: 'user'
        }
      ])
    })

    it('gqlResolver invalid comment', async () => {
      const date = Date.now()
      const state = [
        {
          id: 'story-id',
          comments: [],
          createdBy: 'user-id'
        }
      ]

      const getReadModel = async () => []
      const result = await storyDetails.gqlResolvers.storyDetails(
        state,
        { commentId: 'comment-id' },
        { getReadModel }
      )
      expect(result).toEqual([
        {
          id: 'story-id',
          comments: []
        }
      ])
    })
  })
})
