import Immutable from '../immutable';

import type {
  StoryCreated,
  StoryUpvoted,
  StoryUnvoted,
  StoryDeleted
} from '../events/stories';
import type {
  CommentCreated,
  CommentUpdated,
  CommentRemoved
} from '../events/comments';
import storiesEvents from '../events/stories';
import commentsEvents from '../events/comments';
import { Event } from '../helpers';
import throwIfAggregateAlreadyExists from './validators/throwIfAggregateAlreadyExists';
import throwIfAggregateIsNotExists from './validators/throwIfAggregateIsNotExists';
import throwIfPermissionDenied from './validators/throwIfPermissionDenied';

const {
  STORY_CREATED,
  STORY_UPVOTED,
  STORY_UNVOTED,
  STORY_DELETED
} = storiesEvents;
const { COMMENT_CREATED, COMMENT_UPDATED, COMMENT_REMOVED } = commentsEvents;

export default {
  name: 'stories',
  initialState: Immutable({}),
  eventHandlers: {
    [STORY_CREATED]: (state, event) =>
      state.merge({
        createdAt: event.timestamp,
        createdBy: event.payload.userId,
        voted: [],
        comments: {}
      }),

    [STORY_UPVOTED]: (state, event) =>
      state.update('voted', voted => voted.concat(event.payload.userId)),

    [STORY_UNVOTED]: (state, event) =>
      state.update('voted', voted =>
        voted.filter(userId => userId !== event.payload.userId)
      ),
    [COMMENT_CREATED]: (state, event) =>
      state.setIn(['comments', event.payload.commentId], {
        createdAt: event.timestamp,
        createdBy: event.payload.userId
      }),

    [COMMENT_REMOVED]: (state, event) =>
      state.setIn(
        ['comments', event.payload.commentId, 'removedAt'],
        event.timestamp
      )
  },
  commands: {
    createStory: (state: any, command: StoryCreated) => {
      const { title, link, userId, text } = command.payload;

      throwIfAggregateAlreadyExists(state, command);

      if (!title) {
        throw new Error('Title is required');
      }

      if (!userId) {
        throw new Error('UserId is required');
      }

      return new Event(STORY_CREATED, {
        title,
        text,
        link,
        userId
      });
    },

    upvoteStory: (state: any, command: StoryUpvoted) => {
      const { userId } = command.payload;

      throwIfAggregateIsNotExists(state, command);

      if (state.voted.includes(userId)) {
        throw new Error('User already voted');
      }

      if (!userId) {
        throw new Error('UserId is required');
      }

      return new Event(STORY_UPVOTED, {
        userId
      });
    },

    unvoteStory: (state: any, command: StoryUnvoted) => {
      const { userId } = command.payload;

      throwIfAggregateIsNotExists(state, command);

      if (!state.voted.includes(userId)) {
        throw new Error('User has not voted');
      }

      if (!userId) {
        throw new Error('UserId is required');
      }

      return new Event(STORY_UNVOTED, {
        userId
      });
    },

    deleteStory: (state: any, command: StoryDeleted) => {
      throwIfAggregateIsNotExists(state, command);

      return new Event(STORY_DELETED);
    },

    createComment: (state: any, command: CommentCreated) => {
      throwIfAggregateIsNotExists(state, command);

      const { text, parentId, userId, commentId } = command.payload;

      if (!text) {
        throw new Error('Text is required');
      }

      if (!parentId) {
        throw new Error('ParentId is required');
      }

      if (!userId) {
        throw new Error('UserId is required');
      }

      return new Event(COMMENT_CREATED, {
        text,
        parentId,
        userId,
        commentId
      });
    },

    updateComment: (state: any, command: CommentUpdated) => {
      const { text, commentId } = command.payload;

      throwIfAggregateIsNotExists(state, command);
      throwIfPermissionDenied(state, command);

      if (!text) {
        throw new Error('Text is required');
      }

      return new Event(COMMENT_UPDATED, {
        text,
        commentId
      });
    },

    removeComment: (state: any, command: CommentRemoved) => {
      const { commentId } = command.payload;

      throwIfAggregateIsNotExists(state, command);
      throwIfPermissionDenied(state, command);

      return new Event(COMMENT_REMOVED, { commentId });
    }
  }
};
