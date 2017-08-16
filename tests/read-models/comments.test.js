import uuid from 'uuid';

import '../../common/aggregates';
import comments from '../../common/read-models/comments';
import events from '../../common/events';

const { COMMENT_CREATED, COMMENT_UPDATED, COMMENT_REMOVED } = events;

describe('read-models', () => {
  describe('comments', () => {
    it('eventHandler "COMMENT_CREATED" should create a comment', () => {
      const state = comments.initialState;
      const event = {
        aggregateId: uuid.v4(),
        timestamp: Date.now(),
        payload: {
          text: 'SomeText',
          parentId: uuid.v4(),
          userId: uuid.v4()
        }
      };

      const nextState = {
        [event.aggregateId]: {
          text: event.payload.text,
          id: event.aggregateId,
          parentId: event.payload.parentId,
          createdAt: event.timestamp,
          createdBy: event.payload.userId,
          replies: []
        }
      };

      expect(comments.eventHandlers[COMMENT_CREATED](state, event)).toEqual(
        nextState
      );
    });

    it('eventHandler "COMMENT_CREATED" should create a comment and update parent comment', () => {
      const parentId = uuid.v4();
      const prevEvent = {
        aggregateId: parentId,
        timestamp: Date.now(),
        payload: {
          text: 'SomeText',
          parentId: uuid.v4(),
          userId: uuid.v4()
        }
      };

      const state = comments.initialState.merge({
        [parentId]: {
          text: prevEvent.payload.text,
          id: prevEvent.aggregateId,
          parentId: prevEvent.payload.parentId,
          createdAt: prevEvent.timestamp,
          createdBy: prevEvent.payload.userId,
          replies: []
        }
      });
      const event = {
        aggregateId: uuid.v4(),
        timestamp: Date.now(),
        payload: {
          text: 'SomeText',
          parentId,
          userId: uuid.v4()
        }
      };

      const nextState = {
        [parentId]: {
          text: prevEvent.payload.text,
          id: prevEvent.aggregateId,
          parentId: prevEvent.payload.parentId,
          createdAt: prevEvent.timestamp,
          createdBy: prevEvent.payload.userId,
          replies: [event.aggregateId]
        },
        [event.aggregateId]: {
          text: event.payload.text,
          id: event.aggregateId,
          parentId: event.payload.parentId,
          createdAt: event.timestamp,
          createdBy: event.payload.userId,
          replies: []
        }
      };

      expect(comments.eventHandlers[COMMENT_CREATED](state, event)).toEqual(
        nextState
      );
    });

    it('eventHandler "COMMENT_UPDATED" should update the comment', () => {
      const aggregateId = uuid.v4();

      const state = comments.initialState.merge({
        [aggregateId]: {
          text: 'SomeText'
        }
      });
      const event = {
        aggregateId,
        payload: {
          text: 'NewText'
        }
      };

      const nextState = {
        [aggregateId]: {
          text: event.payload.text
        }
      };

      expect(comments.eventHandlers[COMMENT_UPDATED](state, event)).toEqual(
        nextState
      );
    });

    it('eventHandler "COMMENT_REMOVED" should remove the comment', () => {
      const aggregateId = uuid.v4();
      const prevEvent = {
        aggregateId,
        timestamp: Date.now(),
        payload: {
          text: 'SomeText',
          parentId: uuid.v4(),
          userId: uuid.v4()
        }
      };

      const state = comments.initialState.merge({
        [aggregateId]: {
          text: prevEvent.payload.text,
          id: prevEvent.aggregateId,
          parentId: prevEvent.payload.parentId,
          createdAt: prevEvent.timestamp,
          createdBy: prevEvent.payload.userId,
          replies: []
        }
      });
      const event = {
        aggregateId
      };

      const nextState = {};

      expect(comments.eventHandlers[COMMENT_REMOVED](state, event)).toEqual(
        nextState
      );
    });

    it('eventHandler "COMMENT_REMOVED" should remove the comment and update parent comment', () => {
      const firstAggregateId = uuid.v4();
      const secondAggregateId = uuid.v4();
      const firstEvent = {
        aggregateId: firstAggregateId,
        timestamp: Date.now(),
        payload: {
          text: 'SomeText',
          parentId: uuid.v4(),
          userId: uuid.v4()
        }
      };
      const secondEvent = {
        aggregateId: secondAggregateId,
        timestamp: Date.now(),
        payload: {
          text: 'SomeText',
          parentId: uuid.v4(),
          userId: uuid.v4()
        }
      };

      const state = comments.initialState.merge({
        [firstAggregateId]: {
          text: firstEvent.payload.text,
          id: firstEvent.aggregateId,
          parentId: firstEvent.payload.parentId,
          createdAt: firstEvent.timestamp,
          createdBy: firstEvent.payload.userId,
          replies: [secondAggregateId]
        },
        [secondAggregateId]: {
          text: secondEvent.payload.text,
          id: secondEvent.aggregateId,
          parentId: firstAggregateId,
          createdAt: secondEvent.timestamp,
          createdBy: secondEvent.payload.userId,
          replies: []
        }
      });
      const event = {
        aggregateId: secondAggregateId
      };

      const nextState = {
        [firstAggregateId]: {
          text: firstEvent.payload.text,
          id: firstEvent.aggregateId,
          parentId: firstEvent.payload.parentId,
          createdAt: firstEvent.timestamp,
          createdBy: firstEvent.payload.userId,
          replies: []
        }
      };

      expect(comments.eventHandlers[COMMENT_REMOVED](state, event)).toEqual(
        nextState
      );
    });
  });
});
