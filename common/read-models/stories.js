// @flow
import {
  STORY_CREATED,
  STORY_UPVOTED,
  STORY_UNVOTED,
  COMMENT_CREATED
} from "../events";

type UserId = string;

type Comment = {
  id: string,
  parentId: string,
  level: number,
  text: string,
  createdAt: number,
  createdBy: UserId
};

type Story = {
  id: string,
  type: "ask" | "show" | "story",
  title: string,
  text: string,
  link: string,
  commentCount: number,
  votes: Array<UserId>,
  comments: Array<Comment>,
  createdAt: number,
  createdBy: UserId
};

type StoriesState = Array<Story>;

export default {
  name: "stories",
  initialState: [],
  projection: {
    [STORY_CREATED]: (
      state: StoriesState,
      event: StoryCreated
    ): StoriesState => {
      const {
        aggregateId,
        timestamp,
        payload: { title, link, userId, text }
      } = event;

      const type = !link ? "ask" : /^(Show HN)/.test(title) ? "show" : "story";

      state.push({
        id: aggregateId,
        type,
        title,
        text,
        link,
        commentCount: 0,
        comments: [],
        votes: [],
        createdAt: timestamp,
        createdBy: userId
      });
      return state;
    },

    [STORY_UPVOTED]: (
      state: StoriesState,
      event: StoryUpvoted
    ): StoriesState => {
      const { aggregateId, payload: { userId } } = event;

      const index = state.findIndex(({ id }) => id === aggregateId);

      if (index < 0) {
        return state;
      }

      state[index].votes.push(userId);
      return state;
    },

    [STORY_UNVOTED]: (
      state: StoriesState,
      event: StoryUnvoted
    ): StoriesState => {
      const { aggregateId, payload: { userId } } = event;

      const index = state.findIndex(({ id }) => id === aggregateId);

      if (index < 0) {
        return state;
      }

      state[index].votes = state[index].votes.filter(id => id !== userId);
      return state;
    },

    [COMMENT_CREATED]: (
      state: StoriesState,
      event: CommentCreated
    ): StoriesState => {
      const {
        aggregateId,
        timestamp,
        payload: { parentId, userId, commentId, text }
      } = event;

      const story = state.find(({ id }) => id === aggregateId);

      if (!story) {
        return state;
      }

      story.commentCount++;

      const parentIndex =
        parentId === aggregateId
          ? -1
          : story.comments.findIndex(({ id }) => id === parentId);

      const level =
        parentIndex === -1 ? 0 : story.comments[parentIndex].level + 1;

      const comment = {
        id: commentId,
        parentId,
        level,
        text,
        createdAt: timestamp,
        createdBy: userId
      };

      if (parentIndex === -1) {
        story.comments.push(comment);
      } else {
        story.comments = story.comments
          .slice(0, parentIndex + 1)
          .concat(comment, story.comments.slice(parentIndex + 1));
      }

      return state;
    }
  }
};
