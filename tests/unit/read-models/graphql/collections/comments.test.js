import uuid from 'uuid'

import comments from '../../../../../common/read-models/graphql/collections/comments'
import { STORY_COMMENTED } from '../../../../../common/events'

describe('read-models', () => {
  describe('comments', () => {
    it('eventHandler "STORY_COMMENTED" should create a comment', () => {
      const state = []
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

      expect(comments.projection[STORY_COMMENTED](state, event)).toEqual(
        nextState
      )
    })

    it('eventHandler "STORY_COMMENTED" should create a comment and update parent comment', () => {
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

      const state = [
        {
          text: prevEvent.payload.text,
          id: parentId,
          parentId: prevEvent.payload.parentId,
          storyId: prevEvent.aggregateId,
          createdAt: prevEvent.timestamp,
          createdBy: prevEvent.payload.userId
        }
      ]

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
          text: prevEvent.payload.text,
          id: parentId,
          parentId: prevEvent.payload.parentId,
          storyId: prevEvent.aggregateId,
          createdAt: prevEvent.timestamp,
          createdBy: prevEvent.payload.userId
        },
        {
          text: event.payload.text,
          id: commentId,
          parentId: event.payload.parentId,
          storyId: event.aggregateId,
          createdAt: event.timestamp,
          createdBy: event.payload.userId
        }
      ]

      expect(comments.projection[STORY_COMMENTED](state, event)).toEqual(
        nextState
      )
    })
  })
})
