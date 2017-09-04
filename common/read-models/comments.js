import Immutable from '../immutable';
import { NUMBER_OF_ITEMS_PER_PAGE } from '../constants';

import type {
  CommentCreated,
  CommentUpdated,
  CommentRemoved
} from '../events/comments';
import events from '../events/comments';

const { COMMENT_CREATED, COMMENT_UPDATED, COMMENT_REMOVED } = events;

const getCommentsByStoryId = (comments, storyId) =>
  comments.filter(comment => comment.storyId === storyId);

const getCommentWithChildren = (comments, id) => {
  const comment = comments.find(comment => comment.id === id);
  const result = [];
  if (comment) {
    result.push(comment);
    comment.replies.forEach(commentId =>
      result.push(...getCommentWithChildren(comments, commentId))
    );
  }
  return result;
};

export default {
  name: 'comments',
  initialState: Immutable([]),
  eventHandlers: {
    [COMMENT_CREATED]: (state: any, event: CommentCreated) => {
      const {
        aggregateId,
        timestamp,
        payload: { parentId, userId, text }
      } = event;

      const id = event.payload.commentId;
      let nextState = state;
      const parentIndex = state.findIndex(({ id }) => id === parentId);

      if (parentIndex >= 0) {
        nextState = nextState.updateIn([parentIndex, 'replies'], replies =>
          replies.concat(id)
        );
      }

      return Immutable(
        [
          {
            text,
            id,
            parentId: parentId,
            storyId: aggregateId,
            createdAt: timestamp,
            createdBy: userId,
            replies: []
          }
        ].concat(nextState)
      );
    },

    [COMMENT_UPDATED]: (state: any, event: CommentUpdated) => {
      const { text } = event.payload;
      const id = event.payload.commentId;
      const index = state.findIndex(comment => comment.id === id);
      return state.setIn([index, 'text'], text);
    },

    [COMMENT_REMOVED]: (state: any, event: CommentRemoved) => {
      const id = event.payload.commentId;
      const commentIndex = state.findIndex(comment => comment.id === id);
      const parentId = state[commentIndex].parentId;
      const parentIndex = state.findIndex(comment => comment.id === parentId);

      let nextState = state;

      if (parentIndex >= 0) {
        nextState = nextState.updateIn([parentIndex, 'replies'], replies =>
          replies.filter(replyId => replyId !== id)
        );
      }

      return nextState
        .slice(0, commentIndex)
        .concat(nextState.slice(commentIndex + 1));
    }
  },
  gqlSchema: `
    type Comment {
      text: String!
      id: ID!
      parentId: ID!
      storyId: ID!
      createdAt: String!
      createdBy: String!
      replies: [String!]!
    }
    type Query {
      comments: [Comment]
      comments(page: Int, id: ID, storyId: ID): [Comment]
    }
  `,
  gqlResolvers: {
    comments: (root, { id, storyId, page }) =>
      storyId
        ? getCommentsByStoryId(root, id)
        : id
          ? getCommentWithChildren(root, id)
          : page
            ? root.slice(
                +page * NUMBER_OF_ITEMS_PER_PAGE - NUMBER_OF_ITEMS_PER_PAGE,
                +page * NUMBER_OF_ITEMS_PER_PAGE + 1
              )
            : root
  }
};
