import uuid from 'uuid';
import news from '../../common/aggregates/news';
import events from '../../common/events';
import { Event } from '../../common/helpers';

const { NEWS_CREATED, NEWS_UPVOTED, NEWS_UNVOTED, NEWS_DELETED } = events;

describe('aggregates', () => {
  describe('news', () => {
    it('command "createNews" should create an event to create a news', () => {
      const title = 'SomeTitle';
      const text = 'SomeText';
      const link = 'SomeLink';
      const userId = uuid.v4();

      const state = {};
      const command = {
        payload: {
          title,
          text,
          link,
          userId
        }
      };

      const event = news.commands.createNews(state, command);

      expect(event).toEqual(
        new Event(NEWS_CREATED, {
          title,
          text,
          link,
          userId
        })
      );
    });

    it('command "createNews" should throw Error "Aggregate already exists"', () => {
      const title = 'SomeTitle';
      const text = 'SomeText';
      const link = 'SomeLink';
      const userId = uuid.v4();

      const state = {
        createdAt: Date.now(),
        createdBy: userId
      };
      const command = {
        payload: {
          title,
          text,
          link,
          userId
        }
      };

      expect(() => news.commands.createNews(state, command)).toThrowError(
        'Aggregate already exists'
      );
    });

    it('command "createNews" should throw Error "Title is required"', () => {
      const title = undefined;
      const text = 'SomeText';
      const link = 'SomeLink';
      const userId = uuid.v4();

      const state = {};
      const command = {
        payload: {
          title,
          text,
          link,
          userId
        }
      };

      expect(() => news.commands.createNews(state, command)).toThrowError(
        'Title is required'
      );
    });

    it('command "createNews" should throw Error "UserId is required"', () => {
      const title = 'SomeTitle';
      const text = 'SomeText';
      const link = 'SomeLink';
      const userId = undefined;

      const state = {};
      const command = {
        payload: {
          title,
          text,
          link,
          userId
        }
      };

      expect(() => news.commands.createNews(state, command)).toThrowError(
        'UserId is required'
      );
    });

    it('command "upvoteNews" should create an event to upvote the news', () => {
      const userId = uuid.v4();

      const state = {
        createdAt: Date.now(),
        createdBy: userId,
        votedUsers: []
      };
      const command = {
        payload: {
          userId
        }
      };

      const event = news.commands.upvoteNews(state, command);

      expect(event).toEqual(
        new Event(NEWS_UPVOTED, {
          userId
        })
      );
    });

    it('command "upvoteNews" should throw Error "User already voted"', () => {
      const userId = uuid.v4();

      const state = {
        createdAt: Date.now(),
        createdBy: userId,
        votedUsers: [userId]
      };
      const command = {
        payload: {
          userId
        }
      };

      expect(() => news.commands.upvoteNews(state, command)).toThrowError(
        'User already voted'
      );
    });

    it('command "upvoteNews" should throw Error "Aggregate is not exist"', () => {
      const userId = uuid.v4();

      const state = {};
      const command = {
        payload: {
          userId
        }
      };

      expect(() => news.commands.upvoteNews(state, command)).toThrowError(
        'Aggregate is not exist'
      );
    });

    it('command "upvoteNews" should throw Error "UserId is required"', () => {
      const userId = undefined;

      const state = {
        createdAt: Date.now(),
        createdBy: userId,
        votedUsers: []
      };
      const command = {
        payload: {
          userId
        }
      };

      expect(() => news.commands.upvoteNews(state, command)).toThrowError(
        'UserId is required'
      );
    });

    it('command "unvoteNews" should create an event to unvote the news', () => {
      const userId = uuid.v4();

      const state = {
        createdAt: Date.now(),
        createdBy: userId,
        votedUsers: [userId]
      };
      const command = {
        payload: {
          userId
        }
      };

      const event = news.commands.unvoteNews(state, command);

      expect(event).toEqual(
        new Event(NEWS_UNVOTED, {
          userId
        })
      );
    });

    it('command "unvoteNews" should throw Error "User has not voted"', () => {
      const userId = uuid.v4();

      const state = {
        createdAt: Date.now(),
        createdBy: userId,
        votedUsers: []
      };
      const command = {
        payload: {
          userId
        }
      };

      expect(() => news.commands.unvoteNews(state, command)).toThrowError(
        'User has not voted'
      );
    });

    it('command "unvoteNews" should throw Error "Aggregate is not exist"', () => {
      const userId = uuid.v4();

      const state = {};
      const command = {
        payload: {
          userId
        }
      };

      expect(() => news.commands.unvoteNews(state, command)).toThrowError(
        'Aggregate is not exist'
      );
    });

    it('command "unvoteNews" should throw Error "UserId is required"', () => {
      const userId = undefined;

      const state = {
        createdAt: Date.now(),
        createdBy: userId,
        votedUsers: [userId]
      };
      const command = {
        payload: {
          userId
        }
      };

      expect(() => news.commands.unvoteNews(state, command)).toThrowError(
        'UserId is required'
      );
    });

    it('command "deleteNews" should create an event to delete the news', () => {
      const userId = uuid.v4();

      const state = {
        createdAt: Date.now(),
        createdBy: userId
      };
      const command = {};

      const event = news.commands.deleteNews(state, command);

      expect(event).toEqual(new Event(NEWS_DELETED));
    });

    it('command "deleteNews" should throw Error "Aggregate is not exist"', () => {
      const state = {};
      const command = {
        payload: {}
      };

      expect(() => news.commands.deleteNews(state, command)).toThrowError(
        'Aggregate is not exist'
      );
    });

    it('eventHandler "NEWS_CREATED" should set createdAt, createdBy and votedUsers to state', () => {
      const createdAt = Date.now();
      const userId = uuid.v4();

      const state = news.initialState;
      const event = {
        timestamp: createdAt,
        payload: {
          userId
        }
      };
      const nextState = {
        createdAt,
        createdBy: userId,
        votedUsers: []
      };

      expect(news.eventHandlers[NEWS_CREATED](state, event)).toEqual(nextState);
    });

    it('eventHandler "NEWS_UPVOTED" should add userId to state.votedUsers', () => {
      const createdAt = Date.now();
      const userId = uuid.v4();

      const state = news.initialState.merge({
        createdAt,
        createdBy: userId,
        votedUsers: []
      });
      const event = {
        payload: {
          userId
        }
      };
      const nextState = {
        createdAt,
        createdBy: userId,
        votedUsers: [userId]
      };

      expect(news.eventHandlers[NEWS_UPVOTED](state, event)).toEqual(nextState);
    });

    it('eventHandler "NEWS_UNVOTED" should remove userId from state.votedUsers', () => {
      const createdAt = Date.now();
      const userId = uuid.v4();

      const state = news.initialState.merge({
        createdAt,
        createdBy: userId,
        votedUsers: [userId]
      });
      const event = {
        payload: {
          userId
        }
      };
      const nextState = {
        createdAt,
        createdBy: userId,
        votedUsers: []
      };

      expect(news.eventHandlers[NEWS_UNVOTED](state, event)).toEqual(nextState);
    });
  });
});
