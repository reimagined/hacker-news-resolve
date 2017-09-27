import uuid from 'uuid'

import '../../common/read-models'
import comments from '../../common/read-models/comments'
import events from '../../common/events'

const { COMMENT_CREATED } = events

describe('read-models', () => {
  describe('comments', () => {
    it('eventHandler "COMMENT_CREATED" should create a comment', () => {
      const state = comments.initialState
      const commentId = uuid.v4()

      const event = {
        aggregateId: uuid.v4(),
        timestamp: Date.now(),
        payload: {
          text: 'SomeText',
          parentId: uuid.v4(),
          userId: uuid.v4(),
          commentId
        }
      }

      const nextState = [
        {
          id: commentId,
          text: event.payload.text,
          parentId: event.payload.parentId,
          storyId: event.aggregateId,
          createdAt: event.timestamp,
          createdBy: event.payload.userId
        }
      ]

      expect(comments.eventHandlers[COMMENT_CREATED](state, event)).toEqual(
        nextState
      )
    })

    it('eventHandler "COMMENT_CREATED" should create a comment and update parent comment', () => {
      const parentId = uuid.v4()

      const prevEvent = {
        aggregateId: uuid.v4(),
        timestamp: Date.now(),
        payload: {
          text: 'SomeText',
          parentId: uuid.v4(),
          userId: uuid.v4(),
          commentId: parentId
        }
      }

      const state = comments.initialState.concat({
        text: prevEvent.payload.text,
        id: parentId,
        parentId: prevEvent.payload.parentId,
        storyId: prevEvent.aggregateId,
        createdAt: prevEvent.timestamp,
        createdBy: prevEvent.payload.userId
      })

      const commentId = uuid.v4()

      const event = {
        aggregateId: uuid.v4(),
        timestamp: Date.now(),
        payload: {
          text: 'SomeText',
          parentId,
          userId: uuid.v4(),
          commentId
        }
      }

      const nextState = [
        {
          text: event.payload.text,
          id: commentId,
          parentId: event.payload.parentId,
          storyId: event.aggregateId,
          createdAt: event.timestamp,
          createdBy: event.payload.userId
        },
        {
          text: prevEvent.payload.text,
          id: parentId,
          parentId: prevEvent.payload.parentId,
          storyId: prevEvent.aggregateId,
          createdAt: prevEvent.timestamp,
          createdBy: prevEvent.payload.userId
        }
      ]

      expect(comments.eventHandlers[COMMENT_CREATED](state, event)).toEqual(
        nextState
      )
    })

    it('gqlResolver', async () => {
      const root = [{ id: 'comment-id', createdBy: 'user-id' }]
      const getReadModel = async () => [{ id: 'user-id', name: 'username' }]

      const result = await comments.gqlResolvers.comments(
        root,
        { page: 1 },
        { getReadModel }
      )
      expect(result).toEqual([
        {
          id: 'comment-id',
          createdBy: 'user-id',
          createdByName: 'username'
        }
      ])
    })
  })
})
