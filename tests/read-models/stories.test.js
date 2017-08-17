import uuid from 'uuid';

import '../../common/read-models';
import stories from '../../common/read-models/stories';
import events from '../../common/events';

const {
  STORY_CREATED,
  STORY_UPVOTED,
  STORY_UNVOTED,
  STORY_DELETED,
  COMMENT_CREATED,
  COMMENT_REMOVED
} = events;

describe('read-models', () => {
  describe('comments', () => {
    it('eventHandler "STORY_CREATED" should create a story {type: "ask"}', () => {
      const state = stories.initialState;
      const event = {
        aggregateId: uuid.v4(),
        timestamp: Date.now(),
        payload: {
          title: 'SomeTitle',
          text: 'SomeText',
          userId: uuid.v4(),
          link: undefined
        }
      };

      const nextState = {
        [event.aggregateId]: {
          id: event.aggregateId,
          type: 'ask',
          title: event.payload.title,
          text: event.payload.text,
          userId: event.payload.userId,
          createDate: event.timestamp,
          link: event.payload.link,
          comments: [],
          voted: []
        }
      };

      expect(stories.eventHandlers[STORY_CREATED](state, event)).toEqual(
        nextState
      );
    });

    it('eventHandler "STORY_CREATED" should create a story {type: "story"}', () => {
      const state = stories.initialState;
      const event = {
        aggregateId: uuid.v4(),
        timestamp: Date.now(),
        payload: {
          title: 'SomeTitle',
          text: 'SomeText',
          userId: uuid.v4(),
          link: 'SomeLink'
        }
      };

      const nextState = {
        [event.aggregateId]: {
          id: event.aggregateId,
          type: 'story',
          title: event.payload.title,
          text: event.payload.text,
          userId: event.payload.userId,
          createDate: event.timestamp,
          link: event.payload.link,
          comments: [],
          voted: []
        }
      };

      expect(stories.eventHandlers[STORY_CREATED](state, event)).toEqual(
        nextState
      );
    });

    it('eventHandler "STORY_CREATED" should create a story {type: "show"}', () => {
      const state = stories.initialState;
      const event = {
        aggregateId: uuid.v4(),
        timestamp: Date.now(),
        payload: {
          title: 'Show HN SomeTitle',
          text: 'SomeText',
          userId: uuid.v4(),
          link: 'SomeLink'
        }
      };

      const nextState = {
        [event.aggregateId]: {
          id: event.aggregateId,
          type: 'show',
          title: event.payload.title,
          text: event.payload.text,
          userId: event.payload.userId,
          createDate: event.timestamp,
          link: event.payload.link,
          comments: [],
          voted: []
        }
      };

      expect(stories.eventHandlers[STORY_CREATED](state, event)).toEqual(
        nextState
      );
    });

    it('eventHandler "STORY_UPVOTED" should upvote the story', () => {
      const aggregateId = uuid.v4();

      const state = stories.initialState.merge({
        [aggregateId]: {
          voted: []
        }
      });
      const event = {
        aggregateId,
        timestamp: Date.now(),
        payload: {
          userId: uuid.v4()
        }
      };

      const nextState = {
        [event.aggregateId]: {
          voted: [event.payload.userId]
        }
      };

      expect(stories.eventHandlers[STORY_UPVOTED](state, event)).toEqual(
        nextState
      );
    });

    it('eventHandler "STORY_UNVOTED" should unvote the stories', () => {
      const aggregateId = uuid.v4();
      const userId = uuid.v4();

      const state = stories.initialState.merge({
        [aggregateId]: {
          voted: [userId]
        }
      });
      const event = {
        aggregateId,
        timestamp: Date.now(),
        payload: {
          userId
        }
      };

      const nextState = {
        [event.aggregateId]: {
          voted: []
        }
      };

      expect(stories.eventHandlers[STORY_UNVOTED](state, event)).toEqual(
        nextState
      );
    });

    it('eventHandler "STORY_DELETED" should delete the story', () => {
      const aggregateId = uuid.v4();

      const state = stories.initialState.merge({
        [aggregateId]: {}
      });
      const event = {
        aggregateId
      };

      const nextState = {};

      expect(stories.eventHandlers[STORY_DELETED](state, event)).toEqual(
        nextState
      );
    });

    it('eventHandler "COMMENT_CREATED" should add comment.id to story.comments', () => {
      const parentId = uuid.v4();

      const state = stories.initialState.merge({
        [parentId]: {
          comments: []
        }
      });
      const event = {
        aggregateId: uuid.v4(),
        payload: {
          parentId
        }
      };

      const nextState = {
        [parentId]: {
          comments: [event.aggregateId]
        }
      };

      expect(stories.eventHandlers[COMMENT_CREATED](state, event)).toEqual(
        nextState
      );
    });

    it('eventHandler "COMMENT_CREATED" should do nothing', () => {
      const parentId = uuid.v4();

      const state = stories.initialState;
      const event = {
        aggregateId: uuid.v4(),
        payload: {
          parentId
        }
      };

      const nextState = {};

      expect(stories.eventHandlers[COMMENT_CREATED](state, event)).toEqual(
        nextState
      );
    });

    it('eventHandler "COMMENT_REMOVED" should add comment.id to story.comments', () => {
      const parentId = uuid.v4();
      const commentId = uuid.v4();

      const state = stories.initialState.merge({
        [parentId]: {
          comments: [commentId]
        }
      });
      const event = {
        aggregateId: commentId,
        payload: {
          parentId
        }
      };

      const nextState = {
        [parentId]: {
          comments: []
        }
      };

      expect(stories.eventHandlers[COMMENT_REMOVED](state, event)).toEqual(
        nextState
      );
    });

    it('eventHandler "COMMENT_REMOVED" should do nothing', () => {
      const parentId = uuid.v4();
      const commentId = uuid.v4();

      const state = stories.initialState;
      const event = {
        aggregateId: commentId,
        payload: {
          parentId
        }
      };

      const nextState = {};

      expect(stories.eventHandlers[COMMENT_REMOVED](state, event)).toEqual(
        nextState
      );
    });
  });
});
