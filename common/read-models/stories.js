import Immutable from '../immutable';

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
    [STORY_CREATED]: (state: any, event: StoryCreated) => {
      const {
        aggregateId,
        timestamp,
        payload: { title, link, userId, text }
      } = event;

      const type = !link ? 'ask' : /^(Show HN)/.test(title) ? 'show' : 'story';

      return state.set(aggregateId, {
        id: aggregateId,
        type,
        title,
        text,
        userId,
        createDate: timestamp,
        link,
        comments: [],
        commentsCount: 0,
        voted: []
      });
    },

    [STORY_UPVOTED]: (state: any, event: StoryUpvoted) => {
      const { aggregateId, payload: { userId } } = event;

      return state.updateIn([aggregateId, 'voted'], voted =>
        voted.concat(userId)
      );
    },

    [STORY_UNVOTED]: (state: any, event: StoryUnvoted) => {
      const { aggregateId, payload: { userId } } = event;

      return state.updateIn([aggregateId, 'voted'], voted =>
        voted.filter(id => id !== userId)
      );
    },

    [STORY_DELETED]: (state: any, event: StoryDeleted) =>
      state.without(event.aggregateId),

    [COMMENT_CREATED]: (state: any, event: CommentCreated) => {
      const { parentId, commentId } = event.payload;
      const newState = state.updateIn(
        [event.aggregateId, 'commentsCount'],
        count => count + 1
      );

      if (!newState[parentId]) {
        return newState;
      }

      return newState.updateIn([parentId, 'comments'], comments =>
        comments.concat(commentId)
      );
    },

    [COMMENT_REMOVED]: (state: any, event: CommentRemoved) => {
      const { parentId, commentId } = event.payload;

      const newState = state.updateIn(
        [event.aggregateId, 'commentsCount'],
        count => count - 1
      );

      if (!newState[parentId]) {
        return newState;
      }

      return newState.updateIn([parentId, 'comments'], comments =>
        comments.filter(id => id !== commentId)
      );
    }
  }
};
