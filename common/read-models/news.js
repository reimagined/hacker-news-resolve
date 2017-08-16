import Immutable from 'seamless-immutable';

import type {
  NewsCreated,
  NewsUpvoted,
  NewsUnvoted,
  NewsDeleted
} from '../events/news';
import type { CommentCreated, CommentRemoved } from '../events/comments';
import newsEvents from '../events/news';
import commentsEvents from '../events/comments';

const { NEWS_CREATED, NEWS_UPVOTED, NEWS_UNVOTED, NEWS_DELETED } = newsEvents;
const { COMMENT_CREATED, COMMENT_REMOVED } = commentsEvents;

export default {
  name: 'news',
  initialState: Immutable({}),
  eventHandlers: {
    [NEWS_CREATED]: (state: any, event: NewsCreated) => {
      const type = !event.payload.link
        ? 'ask'
        : /^(Show HN)/.test(event.payload.title) ? 'show' : 'story';

      return state.set(event.aggregateId, {
        id: event.aggregateId,
        type,
        title: event.payload.title,
        text: event.payload.text,
        userId: event.payload.userId,
        createDate: event.timestamp,
        link: event.payload.link,
        comments: [],
        voted: [event.payload.userId]
      });
    },

    [NEWS_UPVOTED]: (state: any, event: NewsUpvoted) =>
      state.updateIn([event.aggregateId, 'voted'], voted =>
        voted.concat(event.payload.userId)
      ),

    [NEWS_UNVOTED]: (state: any, event: NewsUnvoted) =>
      state.updateIn([event.aggregateId, 'voted'], voted =>
        voted.filter(x => x !== event.payload.userId)
      ),

    [NEWS_DELETED]: (state: any, event: NewsDeleted) =>
      state.updateIn(obj => obj.without(event.aggregateId)),

    [COMMENT_CREATED]: (state: any, event: CommentCreated) => {
      const id = event.aggregateId;
      const parentId = event.payload.parentId;

      if (!Object.keys(state).includes(parentId)) {
        return state;
      }

      return state.updateIn([parentId, 'comments'], comments =>
        comments.concat(id)
      );
    },

    [COMMENT_REMOVED]: (state: any, event: CommentRemoved) => {
      const id = event.aggregateId;
      const parentId = event.payload.parentId;

      if (!Object.keys(state).includes(parentId)) {
        return state;
      }

      return state.updateIn([parentId, 'comments'], comments =>
        comments.filter(x => x !== id)
      );
    }
  }
};
