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

function getId(event) {
  return event.aggregateId;
}

const eventHandlers = {
  // News
  [NEWS_CREATED]: (state: any, event: NewsCreated) => {
    const id = getId(event);

    const type = !event.payload.link
      ? 'question'
      : /^(Show HN)/.test(event.payload.title) ? 'show' : 'story';

    const news = {
      id,
      title: event.payload.title,
      userId: event.payload.userId,
      createDate: event.timestamp,
      link: event.payload.link,
      comments: [],
      type,
      voted: [event.payload.userId]
    };

    return state.setIn([id], news);
  },
  [NEWS_UPVOTED]: (state: any, event: NewsUpvoted) =>
    state.updateIn([getId(event), 'voted'], list => list.concat(event.userId)),
  [NEWS_UNVOTED]: (state: any, event: NewsUnvoted) =>
    state.updateIn([getId(event), 'voted'], list =>
      list.filter(x => x !== event.userId)
    ),
  [NEWS_DELETED]: (state: any, event: NewsDeleted) =>
    state.updateIn(obj => obj.without(getId(event))),

  // Comments
  [COMMENT_CREATED]: (state: any, event: CommentCreated) => {
    const id = getId(event);
    const parentId = event.payload.parentId;

    if (!Object.keys(state).includes(parentId)) {
      return state;
    }

    return state.updateIn([parentId, 'comments'], list => list.concat(id));
  },
  [COMMENT_REMOVED]: (state: any, event: CommentRemoved) => {
    const id = getId(event);
    const parentId = event.payload.parentId;

    if (!Object.keys(state).includes(parentId)) {
      return state;
    }

    return state.updateIn([parentId, 'comments'], list =>
      list.filter(x => x !== id)
    );
  }
};

export default {
  name: 'news',
  initialState: Immutable({}),
  eventHandlers
};
