import uuid from 'uuid';

import '../../common/read-models';
import news from '../../common/read-models/news';
import events from '../../common/events';

const {
  NEWS_CREATED,
  NEWS_UPVOTED,
  NEWS_UNVOTED,
  NEWS_DELETED,
  COMMENT_CREATED,
  COMMENT_REMOVED
} = events;

describe('read-models', () => {
  describe('comments', () => {
    it('eventHandler "NEWS_CREATED" should create a news {type: "ask"}', () => {
      const state = news.initialState;
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

      expect(news.eventHandlers[NEWS_CREATED](state, event)).toEqual(nextState);
    });

    it('eventHandler "NEWS_CREATED" should create a news {type: "story"}', () => {
      const state = news.initialState;
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

      expect(news.eventHandlers[NEWS_CREATED](state, event)).toEqual(nextState);
    });

    it('eventHandler "NEWS_CREATED" should create a news {type: "show"}', () => {
      const state = news.initialState;
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

      expect(news.eventHandlers[NEWS_CREATED](state, event)).toEqual(nextState);
    });

    it('eventHandler "NEWS_UPVOTED" should upvote the news', () => {
      const aggregateId = uuid.v4();

      const state = news.initialState.merge({
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

      expect(news.eventHandlers[NEWS_UPVOTED](state, event)).toEqual(nextState);
    });

    it('eventHandler "NEWS_UNVOTED" should unvote the news', () => {
      const aggregateId = uuid.v4();
      const userId = uuid.v4();

      const state = news.initialState.merge({
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

      expect(news.eventHandlers[NEWS_UNVOTED](state, event)).toEqual(nextState);
    });

    it('eventHandler "NEWS_DELETED" should delete the news', () => {
      const aggregateId = uuid.v4();

      const state = news.initialState.merge({
        [aggregateId]: {}
      });
      const event = {
        aggregateId
      };

      const nextState = {};

      expect(news.eventHandlers[NEWS_DELETED](state, event)).toEqual(nextState);
    });

    it('eventHandler "COMMENT_CREATED" should add comment.id to news.comments', () => {
      const parentId = uuid.v4();

      const state = news.initialState.merge({
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

      expect(news.eventHandlers[COMMENT_CREATED](state, event)).toEqual(
        nextState
      );
    });

    it('eventHandler "COMMENT_CREATED" should do nothing', () => {
      const parentId = uuid.v4();

      const state = news.initialState;
      const event = {
        aggregateId: uuid.v4(),
        payload: {
          parentId
        }
      };

      const nextState = {};

      expect(news.eventHandlers[COMMENT_CREATED](state, event)).toEqual(
        nextState
      );
    });

    it('eventHandler "COMMENT_REMOVED" should add comment.id to news.comments', () => {
      const parentId = uuid.v4();
      const commentId = uuid.v4();

      const state = news.initialState.merge({
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

      expect(news.eventHandlers[COMMENT_REMOVED](state, event)).toEqual(
        nextState
      );
    });

    it('eventHandler "COMMENT_REMOVED" should do nothing', () => {
      const parentId = uuid.v4();
      const commentId = uuid.v4();

      const state = news.initialState;
      const event = {
        aggregateId: commentId,
        payload: {
          parentId
        }
      };

      const nextState = {};

      expect(news.eventHandlers[COMMENT_REMOVED](state, event)).toEqual(
        nextState
      );
    });
  });
});
