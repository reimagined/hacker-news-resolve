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

      const state = {};
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

    it('command "unvoteNews" should create an event to unvote the news', () => {
      const userId = uuid.v4();

      const state = {};
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

    it('command "deleteNews" should create an event to delete the news', () => {
      const state = {};
      const command = {};

      const event = news.commands.deleteNews(state, command);

      expect(event).toEqual(new Event(NEWS_DELETED));
    });
  });
});
