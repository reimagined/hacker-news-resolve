import uuid from 'uuid';
import '../../common/aggregates';
import comments from '../../common/aggregates/comments';
import events from '../../common/events';
import { Event } from '../../common/helpers';

const { COMMENT_CREATED, COMMENT_UPDATED, COMMENT_REMOVED } = events;

describe('aggregates', () => {
  describe('comments', () => {
    it('command "createComment" should create an event to create a comment', () => {
      const text = 'SomeText';
      const parentId = uuid.v4();
      const userId = uuid.v4();

      const state = {};
      const command = {
        payload: {
          text,
          parentId,
          userId
        }
      };

      const event = comments.commands.createComment(state, command);

      expect(event).toEqual(
        new Event(COMMENT_CREATED, {
          text,
          parentId,
          userId
        })
      );
    });

    it('command "createComment" should throw Error "Aggregate already exists"', () => {
      const text = 'SomeText';
      const parentId = uuid.v4();
      const userId = uuid.v4();

      const state = {
        createdAt: Date.now(),
        createdBy: userId
      };
      const command = {
        payload: {
          text,
          parentId,
          userId
        }
      };

      expect(() =>
        comments.commands.createComment(state, command)
      ).toThrowError('Aggregate already exists');
    });

    it('command "createComment" should throw Error "Text is required"', () => {
      const text = undefined;
      const parentId = uuid.v4();
      const userId = uuid.v4();

      const state = {};
      const command = {
        payload: {
          text,
          parentId,
          userId
        }
      };

      expect(() =>
        comments.commands.createComment(state, command)
      ).toThrowError('Text is required');
    });

    it('command "createComment" should throw Error "ParentId is required"', () => {
      const text = 'SomeText';
      const parentId = undefined;
      const userId = uuid.v4();

      const state = {};
      const command = {
        payload: {
          text,
          parentId,
          userId
        }
      };

      expect(() =>
        comments.commands.createComment(state, command)
      ).toThrowError('ParentId is required');
    });

    it('command "createComment" should throw Error "UserId is required"', () => {
      const text = 'SomeText';
      const parentId = uuid.v4();
      const userId = undefined;

      const state = {};
      const command = {
        payload: {
          text,
          parentId,
          userId
        }
      };

      expect(() =>
        comments.commands.createComment(state, command)
      ).toThrowError('UserId is required');
    });

    it('command "updateComment" should create an event to update the comment', () => {
      const text = 'SomeText';
      const userId = uuid.v4();

      const state = {
        createdAt: Date.now(),
        createdBy: userId
      };
      const command = {
        payload: {
          text,
          userId
        }
      };

      const event = comments.commands.updateComment(state, command);

      expect(event).toEqual(
        new Event(COMMENT_UPDATED, {
          text
        })
      );
    });

    it('command "updateComment" should throw Error "Aggregate is not exist"', () => {
      const text = 'SomeText';
      const userId = uuid.v4();

      const state = {};
      const command = {
        payload: {
          text,
          userId
        }
      };

      expect(() =>
        comments.commands.updateComment(state, command)
      ).toThrowError('Aggregate is not exist');
    });

    it('command "updateComment" should throw Error "Permission denied"', () => {
      const text = 'SomeText';
      const userId = uuid.v4();

      const state = {
        createdAt: Date.now(),
        createdBy: uuid.v4()
      };
      const command = {
        payload: {
          text,
          userId
        }
      };

      expect(() =>
        comments.commands.updateComment(state, command)
      ).toThrowError('Permission denied');
    });

    it('command "updateComment" should throw Error "Text is required"', () => {
      const text = undefined;
      const userId = uuid.v4();

      const state = {
        createdAt: Date.now(),
        createdBy: userId
      };
      const command = {
        payload: {
          text,
          userId
        }
      };

      expect(() =>
        comments.commands.updateComment(state, command)
      ).toThrowError('Text is required');
    });

    it('command "removeComment" should create an event to remove the comment', () => {
      const userId = uuid.v4();

      const state = {
        createdAt: Date.now(),
        createdBy: userId
      };
      const command = {
        payload: {
          userId
        }
      };

      const event = comments.commands.removeComment(state, command);

      expect(event).toEqual(new Event(COMMENT_REMOVED));
    });

    it('command "removeComment" should throw Error "Aggregate is not exist"', () => {
      const userId = uuid.v4();

      const state = {};
      const command = {
        payload: {
          userId
        }
      };

      expect(() =>
        comments.commands.removeComment(state, command)
      ).toThrowError('Aggregate is not exist');
    });

    it('command "removeComment" should throw Error "Permission denied"', () => {
      const userId = uuid.v4();

      const state = {
        createdAt: Date.now(),
        createdBy: uuid.v4()
      };
      const command = {
        payload: {
          userId
        }
      };

      expect(() =>
        comments.commands.removeComment(state, command)
      ).toThrowError('Permission denied');
    });

    it('eventHandler "COMMENT_CREATED" should set createdAt and createdBy to state', () => {
      const createdAt = Date.now();
      const userId = uuid.v4();

      const state = comments.initialState;
      const event = {
        timestamp: createdAt,
        payload: {
          userId
        }
      };
      const nextState = {
        createdAt,
        createdBy: userId
      };

      expect(comments.eventHandlers[COMMENT_CREATED](state, event)).toEqual(
        nextState
      );
    });

    it('eventHandler "COMMENT_REMOVED" should set removedAt to state', () => {
      const createdAt = Date.now();
      const removedAt = Date.now() + 1;
      const userId = uuid.v4();

      const state = comments.initialState.merge({
        createdAt,
        createdBy: userId
      });
      const event = {
        timestamp: removedAt
      };
      const nextState = {
        createdAt,
        removedAt,
        createdBy: userId
      };

      expect(comments.eventHandlers[COMMENT_REMOVED](state, event)).toEqual(
        nextState
      );
    });
  });
});
