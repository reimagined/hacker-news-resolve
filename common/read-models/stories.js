import Immutable from 'seamless-immutable';

import type {
  StoryCreated,
  StoryUpvoted,
  StoryUnvoted,
  StoryDeleted
} from '../events/stories';
import type { CommentCreated, CommentRemoved } from '../events/comments';
import storiesEvents from '../events/stories';
import commentsEvents from '../events/comments';

const {
  STORY_CREATED,
  STORY_UPVOTED,
  STORY_UNVOTED,
  STORY_DELETED
} = storiesEvents;
const { COMMENT_CREATED, COMMENT_REMOVED } = commentsEvents;

export default {
  name: 'stories',
  initialState: Immutable({}),
  eventHandlers: {
    [STORY_CREATED]: (state: any, event: StoriesCreated) => {
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
        voted: []
      });
    },

    [STORY_UPVOTED]: (state: any, event: StoryUpvoted) =>
      state.updateIn([event.aggregateId, 'voted'], voted =>
        voted.concat(event.payload.userId)
      ),

    [STORY_UNVOTED]: (state: any, event: StoryUnvoted) =>
      state.updateIn([event.aggregateId, 'voted'], voted =>
        voted.filter(id => id !== event.payload.userId)
      ),

    [STORY_DELETED]: (state: any, event: StoryDeleted) =>
      state.without(event.aggregateId),

    [COMMENT_CREATED]: (state: any, event: CommentCreated) => {
      const { parentId } = event.payload;

      if (!state[parentId]) {
        return state;
      }

      return state.updateIn([parentId, 'comments'], comments =>
        comments.concat(event.aggregateId)
      );
    },

    [COMMENT_REMOVED]: (state: any, event: CommentRemoved) => {
      const { parentId } = event.payload;

      if (!state[parentId]) {
        return state;
      }

      return state.updateIn([parentId, 'comments'], comments =>
        comments.filter(id => id !== event.aggregateId)
      );
    }
  }
};
