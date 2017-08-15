import comments from '../../common/aggregates/comments';
import events from '../../common/events';
import { Event } from '../../common/helpers';
import uuid from 'uuid';

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
  });
});
