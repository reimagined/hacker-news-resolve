import resolveStorage from 'resolve-storage';
import storageDriver from 'resolve-storage-file';
import uuid from 'uuid';

import eventTypes from '../common/events/index';
import HNServiceRest from './services/HNServiceRest';

const MAX_STORY_COUNT = 30;

let events = [];
let users = {};
let storyIds = [];

const storage = resolveStorage({
  driver: storageDriver({ pathToFile: './storage.json' })
});

const {
  USER_CREATED,
  STORY_CREATED,
  // STORY_UPVOTED,
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
  addEvent(USER_CREATED, aggregateId, new Date(3600 * 24 * 1000).getTime(), {
    name,
    passwordHash: 'TODO:'
  });
  users[name] = aggregateId;
  return aggregateId;
};

const userProc = userName => {
  if (users[userName]) return users[userName];
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
    return comment.kids
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

const storiesProc = ids => {
  const fetchIds = removeDuplicate(ids);
  return fetchItems(fetchIds).then(stories =>
    stories.reduce(
      (promise, story) =>
        promise.then(
          () =>
            story && !story.deleted && story.by
              ? generateStoryEvents(story)
              : null
        ),
      Promise.resolve()
    )
  );
};

const getStories = path =>
  HNServiceRest.storiesRef(path).then(res => res.json());

function populate() {
  console.time('populate');
  return Promise.all([
    getStories('topstories'),
    getStories('newstories'),
    getStories('beststories'),
    getStories('askstories'),
    getStories('showstories'),
    getStories('jobstories')
  ])
    .then(categories => {
      let stories = categories.reduce(
        (stories, category) =>
          stories.concat(
            category.slice(0, Math.ceil(MAX_STORY_COUNT / categories.length))
          ),
        []
      );
      return storiesProc(stories);
    })
    .then(() =>
      events.reduce(
        (promise, event) => promise.then(() => storage.saveEvent(event)),
        Promise.resolve()
      )
    )
    .then(() => {
      console.timeEnd('populate');
      console.log('Events generated');
    })
    .catch(err => console.error(err));
}

populate();
