import fs from 'fs';
import uuid from 'uuid';
import resolveStorage from 'resolve-storage';
import storageDriver from 'resolve-storage-file';

import eventTypes from '../common/events/index';
import HNServiceRest from './services/HNServiceRest';

const MAX_STORY_COUNT = 50;

const events = [];
const users = {};
const storyIds = [];

const dbPath = './storage.json';
let canceled = false;
const USER_CREATED_TIMESTAMP = 3600 * 24 * 1000;

const storage = resolveStorage({
  driver: storageDriver({ pathToFile: dbPath })
});

const {
  USER_CREATED,
  STORY_CREATED,
  STORY_UPVOTED,
  COMMENT_CREATED
} = eventTypes;

const addEvent = (type, aggregateId, timestamp, payload) =>
  events.push({
    type,
    aggregateId,
    timestamp,
    payload
  });

const generateUserEvents = name => {
  const aggregateId = uuid.v4();
  addEvent(USER_CREATED, aggregateId, USER_CREATED_TIMESTAMP, {
    name,
    passwordHash: 'TODO:'
  });
  users[name] = aggregateId;
  return aggregateId;
};

const userProc = userName => {
  if (users[userName]) {
    return users[userName];
  }
  const aggregateId = generateUserEvents(userName);
  users[userName] = aggregateId;
  return aggregateId;
};

const generateCommentEvents = (comment, aggregateId, parentId) => {
  const userId = userProc(comment.by);
  const commentId = uuid.v4();
  addEvent(COMMENT_CREATED, aggregateId, comment.time * 1000, {
    userId,
    text: comment.text,
    commentId,
    parentId
  });
  return commentId;
};

const commentProc = (comment, aggregateId, parentId) => {
  return new Promise(resolve => {
    const commentId = generateCommentEvents(comment, aggregateId, parentId);
    return !canceled && comment.kids
      ? commentsProc(comment.kids, aggregateId, commentId).then(() =>
          resolve(aggregateId)
        )
      : resolve(aggregateId);
  });
};

const fetchItems = ids =>
  new Promise(resolve =>
    HNServiceRest.fetchItems(ids, result => resolve(result))
  );

function commentsProc(ids, aggregateId, parentId) {
  return fetchItems(ids).then(comments =>
    comments.reduce(
      (promise, comment) =>
        promise.then(
          comment && comment.by
            ? commentProc(comment, aggregateId, parentId)
            : null
        ),
      Promise.resolve()
    )
  );
}

const generatePointEvents = (aggregateId, pointCount) => {
  const keys = Object.keys(users);
  for (let i = 0; i < Math.min(keys.length, pointCount); i++) {
    addEvent(STORY_UPVOTED, aggregateId, Date.now(), {
      userId: users[keys[i]]
    });
  }
};

const generateStoryEvents = story => {
  return new Promise(resolve => {
    if (story && story.by) {
      const aggregateId = uuid.v4();
      const userId = userProc(story.by);
      addEvent(STORY_CREATED, aggregateId, story.time * 1000, {
        title: story.title,
        text: story.text,
        userId,
        link: story.url
      });
      if (story.score) {
        generatePointEvents(aggregateId, story.score);
      }
      return story.kids
        ? commentsProc(story.kids, aggregateId, aggregateId).then(() =>
            resolve(aggregateId)
          )
        : resolve(aggregateId);
    }
  });
};

const needUpload = id => storyIds.indexOf(id) === -1;

const removeDuplicate = ids => {
  const result = ids.filter(needUpload);
  result.forEach(id => storyIds.push(id));
  return result;
};

const storiesProc = (ids, tickCallback) => {
  return fetchItems(ids).then(stories =>
    stories.reduce(
      (promise, story) =>
        promise.then(() => {
          tickCallback();
          return !canceled && story && !story.deleted && story.by
            ? generateStoryEvents(story)
            : null;
        }),
      Promise.resolve()
    )
  );
};

const getStories = path =>
  HNServiceRest.storiesRef(path).then(res => res.json());

export const start = (countCallback, tickCallback) => {
  canceled = false;
  return Promise.all([
    getStories('topstories'),
    getStories('newstories'),
    getStories('beststories'),
    getStories('askstories'),
    getStories('showstories'),
    getStories('jobstories')
  ])
    .then(categories => {
      const stories = categories.reduce(
        (stories, category) =>
          stories.concat(
            removeDuplicate(category).slice(
              0,
              Math.ceil(MAX_STORY_COUNT / categories.length)
            )
          ),
        []
      );
      countCallback(Math.min(stories.length, MAX_STORY_COUNT));
      return storiesProc(stories.slice(0, MAX_STORY_COUNT), tickCallback);
    })
    .then(() => {
      if (fs.existsSync(dbPath)) {
        fs.unlinkSync(dbPath);
      }
      return events.reduce(
        (promise, event) => promise.then(() => storage.saveEvent(event)),
        Promise.resolve()
      );
    })
    .catch(err => console.error(err));
};

export const stop = () => {
  canceled = true;
};
