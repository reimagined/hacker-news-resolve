import Immutable from 'seamless-immutable';
import throwIfAggregateAlreadyExists from './validators/throwIfAggregateAlreadyExists';

import type {
  NewsCreated,
  NewsUpvoted,
  NewsUnvoted,
  NewsDeleted
} from '../events/news';
import events from '../events/news';
import { Event } from '../helpers';

const { NEWS_CREATED, NEWS_UPVOTED, NEWS_UNVOTED, NEWS_DELETED } = events;

export default {
  name: 'news',
  initialState: Immutable({}),
  eventHandlers: {
    [NEWS_CREATED]: (state, event) =>
      state.merge({
        createdAt: event.timestamp,
        createdBy: event.payload.userId,
        votedUsers: []
      }),
    [NEWS_UPVOTED]: (state, event) =>
      state.update('votedUsers', votedUsers =>
        votedUsers.concat(event.payload.userId)
      ),
    [NEWS_UNVOTED]: (state, event) =>
      state.update('votedUsers', votedUsers =>
        votedUsers.filter(userId => userId !== event.payload.userId)
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

      if (!userId) {
        throw new Error('UserId is required');
      }

      return new Event(NEWS_UPVOTED, {
        userId
      });
    },
    unvoteNews: (state: any, command: NewsUnvoted) => {
      const { userId } = command.payload;

      if (!userId) {
        throw new Error('UserId is required');
      }

      return new Event(NEWS_UNVOTED, {
        userId
      });
    },
    deleteNews: (state: any, command: NewsDeleted) => new Event(NEWS_DELETED)
  }
};
