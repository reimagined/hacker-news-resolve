import uuid from 'uuid';

import '../../common/aggregates';
import stories from '../../common/aggregates/stories';
import events from '../../common/events';
import { Event } from '../../common/helpers';

const { STORY_CREATED, STORY_UPVOTED, STORY_UNVOTED, STORY_DELETED } = events;

describe('aggregates', () => {
  describe('stories', () => {
    it('command "createStory" should create an event to create a story', () => {
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

      const event = stories.commands.createStory(state, command);

      expect(event).toEqual(
        new Event(STORY_CREATED, {
          title,
          text,
          link,
          userId
        })
      );
    });

    it('command "createStory" should throw Error "Aggregate already exists"', () => {
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

      expect(() => stories.commands.createStory(state, command)).toThrowError(
        'Aggregate already exists'
      );
    });

    it('command "createStory" should throw Error "Title is required"', () => {
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

      expect(() => stories.commands.createStory(state, command)).toThrowError(
        'Title is required'
      );
    });

    it('command "createStory" should throw Error "UserId is required"', () => {
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

      expect(() => stories.commands.createStory(state, command)).toThrowError(
        'UserId is required'
      );
    });

    it('command "upvoteStory" should create an event to upvote the story', () => {
      const userId = uuid.v4();

      const state = {
        createdAt: Date.now(),
        createdBy: userId,
        voted: []
      };
      const command = {
        payload: {
          userId
        }
      };

      const event = stories.commands.upvoteStory(state, command);

      expect(event).toEqual(
        new Event(STORY_UPVOTED, {
          userId
        })
      );
    });

    it('command "upvoteStory" should throw Error "User already voted"', () => {
      const userId = uuid.v4();

      const state = {
        createdAt: Date.now(),
        createdBy: userId,
        voted: [userId]
      };
      const command = {
        payload: {
          userId
        }
      };

      expect(() => stories.commands.upvoteStory(state, command)).toThrowError(
        'User already voted'
      );
    });

    it('command "upvoteStory" should throw Error "Aggregate is not exist"', () => {
      const userId = uuid.v4();

      const state = {};
      const command = {
        payload: {
          userId
        }
      };

      expect(() => stories.commands.upvoteStory(state, command)).toThrowError(
        'Aggregate is not exist'
      );
    });

    it('command "upvoteStory" should throw Error "UserId is required"', () => {
      const userId = undefined;

      const state = {
        createdAt: Date.now(),
        createdBy: userId,
        voted: []
      };
      const command = {
        payload: {
          userId
        }
      };

      expect(() => stories.commands.upvoteStory(state, command)).toThrowError(
        'UserId is required'
      );
    });

    it('command "unvoteStory" should create an event to unvote the story', () => {
      const userId = uuid.v4();

      const state = {
        createdAt: Date.now(),
        createdBy: userId,
        voted: [userId]
      };
      const command = {
        payload: {
          userId
        }
      };

      const event = stories.commands.unvoteStory(state, command);

      expect(event).toEqual(
        new Event(STORY_UNVOTED, {
          userId
        })
      );
    });

    it('command "unvoteStory" should throw Error "User has not voted"', () => {
      const userId = uuid.v4();

      const state = {
        createdAt: Date.now(),
        createdBy: userId,
        voted: []
      };
      const command = {
        payload: {
          userId
        }
      };

      expect(() => stories.commands.unvoteStory(state, command)).toThrowError(
        'User has not voted'
      );
    });

    it('command "unvoteStory" should throw Error "Aggregate is not exist"', () => {
      const userId = uuid.v4();

      const state = {};
      const command = {
        payload: {
          userId
        }
      };

      expect(() => stories.commands.unvoteStory(state, command)).toThrowError(
        'Aggregate is not exist'
      );
    });

    it('command "unvoteStory" should throw Error "UserId is required"', () => {
      const userId = undefined;

      const state = {
        createdAt: Date.now(),
        createdBy: userId,
        voted: [userId]
      };
      const command = {
        payload: {
          userId
        }
      };

      expect(() => stories.commands.unvoteStory(state, command)).toThrowError(
        'UserId is required'
      );
    });

    it('command "deleteStory" should create an event to delete the story', () => {
      const userId = uuid.v4();

      const state = {
        createdAt: Date.now(),
        createdBy: userId
      };
      const command = {};

      const event = stories.commands.deleteStory(state, command);

      expect(event).toEqual(new Event(STORY_DELETED));
    });

    it('command "deleteStory" should throw Error "Aggregate is not exist"', () => {
      const state = {};
      const command = {
        payload: {}
      };

      expect(() => stories.commands.deleteStory(state, command)).toThrowError(
        'Aggregate is not exist'
      );
    });

    it('eventHandler "STORY_CREATED" should set createdAt, createdBy and voted to state', () => {
      const createdAt = Date.now();
      const userId = uuid.v4();

      const state = stories.initialState;
      const event = {
        timestamp: createdAt,
        payload: {
          userId
        }
      };
      const nextState = {
        createdAt,
        createdBy: userId,
        voted: [userId]
      };

      expect(stories.eventHandlers[STORY_CREATED](state, event)).toEqual(
        nextState
      );
    });

    it('eventHandler "STORY_UPVOTED" should add userId to state.voted', () => {
      const createdAt = Date.now();
      const userId = uuid.v4();

      const state = stories.initialState.merge({
        createdAt,
        createdBy: userId,
        voted: []
      });
      const event = {
        payload: {
          userId
        }
      };
      const nextState = {
        createdAt,
        createdBy: userId,
        voted: [userId]
      };

      expect(stories.eventHandlers[STORY_UPVOTED](state, event)).toEqual(
        nextState
      );
    });

    it('eventHandler "STORY_UNVOTED" should remove userId from state.voted', () => {
      const createdAt = Date.now();
      const userId = uuid.v4();

      const state = stories.initialState.merge({
        createdAt,
        createdBy: userId,
        voted: [userId]
      });
      const event = {
        payload: {
          userId
        }
      };
      const nextState = {
        createdAt,
        createdBy: userId,
        voted: []
      };

      expect(stories.eventHandlers[STORY_UNVOTED](state, event)).toEqual(
        nextState
      );
    });
  });
});
