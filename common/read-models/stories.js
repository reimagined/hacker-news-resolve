import Immutable from '../immutable';
import { STORIES_ON_ONE_PAGE } from '../../client/helpers/getPageStories';

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
  initialState: Immutable([]),
  eventHandlers: {
    [STORY_CREATED]: (state: any, event: StoryCreated) => {
      const {
        aggregateId,
        timestamp,
        payload: { title, link, userId, text }
      } = event;

      const type = !link ? 'ask' : /^(Show HN)/.test(title) ? 'show' : 'story';

      return Immutable(
        [
          {
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
          }
        ].concat(state)
      );
    },

    [STORY_UPVOTED]: (state: any, event: StoryUpvoted) => {
      const { aggregateId, payload: { userId } } = event;

      const index = state.findIndex(({ id }) => id === aggregateId);

      if (index < 0) {
        return state;
      }

      return state.updateIn([index, 'voted'], voted => voted.concat(userId));
    },

    [STORY_UNVOTED]: (state: any, event: StoryUnvoted) => {
      const { aggregateId, payload: { userId } } = event;

      const index = state.findIndex(({ id }) => id === aggregateId);

      if (index < 0) {
        return state;
      }

      return state.updateIn([index, 'voted'], voted =>
        voted.filter(id => id !== userId)
      );
    },

    [STORY_DELETED]: (state: any, event: StoryDeleted) =>
      state.filter(({ id }) => id !== event.aggregateId),

    [COMMENT_CREATED]: (state: any, event: CommentCreated) => {
      const { parentId, commentId } = event.payload;
      const storyIndex = state.findIndex(({ id }) => id === event.aggregateId);

      if (storyIndex < 0) {
        return state;
      }

      let newState = state.updateIn(
        [storyIndex, 'commentsCount'],
        count => count + 1
      );

      const parentIndex = state.findIndex(({ id }) => id === parentId);

      if (parentIndex < 0) {
        return newState;
      }

      return newState.updateIn([parentIndex, 'comments'], comments =>
        comments.concat(commentId)
      );
    },

    [COMMENT_REMOVED]: (state: any, event: CommentRemoved) => {
      const { parentId, commentId } = event.payload;
      const storyIndex = state.findIndex(({ id }) => id === event.aggregateId);

      if (storyIndex < 0) {
        return state;
      }

      let newState = state.updateIn(
        [storyIndex, 'commentsCount'],
        count => count - 1
      );

      const parentIndex = state.findIndex(({ id }) => id === parentId);

      if (parentIndex < 0) {
        return newState;
      }

      return newState.updateIn([parentIndex, 'comments'], comments =>
        comments.filter(id => id !== commentId)
      );
    }
  },
  gqlSchema: `
    type Story {
      id: ID!
      type: String!
      title: String!
      text: String
      userId: String!
      createDate: String!
      link: String
      comments: [String]
      commentsCount: Int!
      voted: [String]
    }
    type Query {
      stories: [Story]
      stories(page: Int, id: ID, type: String): [Story]
    }
  `,
  gqlResolvers: {
    stories: (root, args) =>
      args.id
        ? [root.find(({ id }) => id === args.id)].filter(story => story)
        : args.page
          ? root.slice(
              +args.page * STORIES_ON_ONE_PAGE - STORIES_ON_ONE_PAGE,
              +args.page * STORIES_ON_ONE_PAGE + 1
            )
          : root
  }
};
