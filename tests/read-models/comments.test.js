import uuid from 'uuid';

import '../../common/read-models';
import comments from '../../common/read-models/comments';
import events from '../../common/events';

const { COMMENT_CREATED, COMMENT_UPDATED, COMMENT_REMOVED } = events;

describe('read-models', () => {
  describe('comments', () => {
    it('eventHandler "COMMENT_CREATED" should create a comment', () => {
      const state = comments.initialState;
      const commentId = uuid.v4();

      const event = {
        aggregateId: uuid.v4(),
        timestamp: Date.now(),
        payload: {
          text: 'SomeText',
          parentId: uuid.v4(),
          userId: uuid.v4(),
          commentId
        }
      };

      const nextState = {
        [commentId]: {
          text: event.payload.text,
          id: commentId,
          parentId: event.payload.parentId,
          storyId: event.aggregateId,
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
        aggregateId: uuid.v4(),
        timestamp: Date.now(),
        payload: {
          text: 'SomeText',
          parentId: uuid.v4(),
          userId: uuid.v4(),
          commentId: parentId
        }
      };

      const state = comments.initialState.merge({
        [parentId]: {
          text: prevEvent.payload.text,
          id: parentId,
          parentId: prevEvent.payload.parentId,
          storyId: prevEvent.aggregateId,
          createdAt: prevEvent.timestamp,
          createdBy: prevEvent.payload.userId,
          replies: []
        }
      });

      const commentId = uuid.v4();
      const event = {
        aggregateId: uuid.v4(),
        timestamp: Date.now(),
        payload: {
          text: 'SomeText',
          parentId,
          userId: uuid.v4(),
          commentId
        }
      };

      const nextState = {
        [parentId]: {
          text: prevEvent.payload.text,
          id: parentId,
          parentId: prevEvent.payload.parentId,
          storyId: prevEvent.aggregateId,
          createdAt: prevEvent.timestamp,
          createdBy: prevEvent.payload.userId,
          replies: [commentId]
        },
        [commentId]: {
          text: event.payload.text,
          id: commentId,
          parentId: event.payload.parentId,
          storyId: event.aggregateId,
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
      const commentId = uuid.v4();

      const state = comments.initialState.merge({
        [commentId]: {
          text: 'SomeText'
        }
      });
      const event = {
        aggregateId: uuid.v4(),
        payload: {
          text: 'NewText',
          commentId
        }
      };

      const nextState = {
        [commentId]: {
          text: event.payload.text
        }
      };

      expect(comments.eventHandlers[COMMENT_UPDATED](state, event)).toEqual(
        nextState
      );
    });

    it('eventHandler "COMMENT_REMOVED" should remove the comment', () => {
      const commentId = uuid.v4();
      const aggregateId = uuid.v4();

      const prevEvent = {
        aggregateId,
        timestamp: Date.now(),
        payload: {
          text: 'SomeText',
          parentId: uuid.v4(),
          userId: uuid.v4(),
          commentId
        }
      };

      const state = comments.initialState.merge({
        [commentId]: {
          text: prevEvent.payload.text,
          id: commentId,
          storyId: prevEvent.aggregateId,
          parentId: prevEvent.payload.parentId,
          createdAt: prevEvent.timestamp,
          createdBy: prevEvent.payload.userId,
          replies: []
        }
      });
      const event = {
        aggregateId,
        payload: {
          commentId
        }
      };

      const nextState = {};

      expect(comments.eventHandlers[COMMENT_REMOVED](state, event)).toEqual(
        nextState
      );
    });

    it('eventHandler "COMMENT_REMOVED" should remove the comment and update parent comment', () => {
      const aggregateId = uuid.v4();
      const firstCommentId = uuid.v4();
      const secondCommentId = uuid.v4();

      const firstEvent = {
        aggregateId,
        timestamp: Date.now(),
        payload: {
          text: 'SomeText',
          parentId: uuid.v4(),
          userId: uuid.v4(),
          commentId: firstCommentId
        }
      };
      const secondEvent = {
        aggregateId,
        timestamp: Date.now(),
        payload: {
          text: 'SomeText',
          parentId: uuid.v4(),
          userId: uuid.v4(),
          commentId: secondCommentId
        }
      };

      const state = comments.initialState.merge({
        [firstCommentId]: {
          text: firstEvent.payload.text,
          id: firstCommentId,
          parentId: firstEvent.payload.parentId,
          createdAt: firstEvent.timestamp,
          storyId: aggregateId,
          createdBy: firstEvent.payload.userId,
          replies: [secondCommentId]
        },
        [secondCommentId]: {
          text: secondEvent.payload.text,
          id: secondCommentId,
          parentId: firstCommentId,
          storyId: aggregateId,
          createdAt: secondEvent.timestamp,
          createdBy: secondEvent.payload.userId,
          replies: []
        }
      });
      const event = {
        aggregateId: aggregateId,
        payload: {
          commentId: secondCommentId
        }
      };

      const nextState = {
        [firstCommentId]: {
          text: firstEvent.payload.text,
          id: firstCommentId,
          parentId: firstEvent.payload.parentId,
          storyId: aggregateId,
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
