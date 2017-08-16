import Immutable from 'seamless-immutable';

import type {
  NewsCreated,
  NewsUpvoted,
  NewsUnvoted,
  NewsDeleted
} from '../events/news';
import events from '../events/news';
import { Event } from '../helpers';
import throwIfAggregateAlreadyExists from './validators/throwIfAggregateAlreadyExists';
import throwIfAggregateIsNotExists from './validators/throwIfAggregateIsNotExists';

const { NEWS_CREATED, NEWS_UPVOTED, NEWS_UNVOTED, NEWS_DELETED } = events;

export default {
  name: 'news',
  initialState: Immutable({}),
  eventHandlers: {
    [NEWS_CREATED]: (state, event) =>
      state.merge({
        createdAt: event.timestamp,
        createdBy: event.payload.userId,
        voted: [event.payload.userId]
      }),

    [NEWS_UPVOTED]: (state, event) =>
      state.update('voted', voted => voted.concat(event.payload.userId)),

    [NEWS_UNVOTED]: (state, event) =>
      state.update('voted', voted =>
        voted.filter(userId => userId !== event.payload.userId)
      )
  },
  commands: {
    createNews: (state: any, command: NewsCreated) => {
      const { title, link, userId, text } = command.payload;

      throwIfAggregateAlreadyExists(state, command);

      if (!title) {
        throw new Error('Title is required');
      }

      if (!userId) {
        throw new Error('UserId is required');
      }

      return new Event(NEWS_CREATED, {
        title,
        text,
        link,
        userId
      });
    },

    upvoteNews: (state: any, command: NewsUpvoted) => {
      const { userId } = command.payload;

      throwIfAggregateIsNotExists(state, command);

      if (state.voted.includes(userId)) {
        throw new Error('User already voted');
      }

      if (!userId) {
        throw new Error('UserId is required');
      }

      return new Event(NEWS_UPVOTED, {
        userId
      });
    },

    unvoteNews: (state: any, command: NewsUnvoted) => {
      const { userId } = command.payload;

      throwIfAggregateIsNotExists(state, command);

      if (!state.voted.includes(userId)) {
        throw new Error('User has not voted');
      }

      if (!userId) {
        throw new Error('UserId is required');
      }

      return new Event(NEWS_UNVOTED, {
        userId
      });
    },

    deleteNews: (state: any, command: NewsDeleted) => {
      throwIfAggregateIsNotExists(state, command);

      return new Event(NEWS_DELETED);
    }
  }
};
