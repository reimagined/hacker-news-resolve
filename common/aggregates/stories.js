import Immutable from 'seamless-immutable';

import type {
  StoryCreated,
  StoryUpvoted,
  StoryUnvoted,
  StoryDeleted
} from '../events/stories';
import events from '../events/stories';
import { Event } from '../helpers';
import throwIfAggregateAlreadyExists from './validators/throwIfAggregateAlreadyExists';
import throwIfAggregateIsNotExists from './validators/throwIfAggregateIsNotExists';

const { STORY_CREATED, STORY_UPVOTED, STORY_UNVOTED, STORY_DELETED } = events;

export default {
  name: 'stories',
  initialState: Immutable({}),
  eventHandlers: {
    [STORY_CREATED]: (state, event) =>
      state.merge({
        createdAt: event.timestamp,
        createdBy: event.payload.userId,
        voted: [event.payload.userId]
      }),

    [STORY_UPVOTED]: (state, event) =>
      state.update('voted', voted => voted.concat(event.payload.userId)),

    [STORY_UNVOTED]: (state, event) =>
      state.update('voted', voted =>
        voted.filter(userId => userId !== event.payload.userId)
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
    }
  }
};
