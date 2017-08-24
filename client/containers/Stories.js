import React from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';

import Story from '../components/Story';
import Paginator from '../components/Paginator';

import {
  STORIES_ON_ONE_PAGE,
  getPageStories,
  hasNextStories
} from '../helpers/getPageStories';
import actions from '../actions/stories';
import '../styles/stories.css';

export const Stories = props => {
  let { page } = queryString.parse(props.location.search);

  let stories = Object.keys(props.stories).reverse();
  if (props.location.pathname.includes('ask')) {
    stories = stories.filter(id => props.stories[id].type === 'ask');
  } else if (props.location.pathname.includes('show')) {
    stories = stories.filter(id => props.stories[id].type === 'show');
  } else if (props.location.pathname === '/') {
    // TODO sort flow stories in some special order
  }

  const hasNext = hasNextStories(stories, page);
  stories = getPageStories(stories, page);
  const firstStoryIndex = STORIES_ON_ONE_PAGE * (page ? page - 1 : 0);

  return (
    <div>
      <div className="stories">
        <ol className="stories__list" start={firstStoryIndex + 1}>
          {stories.map(id => {
            const story = props.stories[id];
            const type = story.type;

            const link = type === 'ask' ? `/storyDetails?id=${id}` : story.link;
            const title =
              type === 'ask' ? `Ask HN: ${story.title}` : story.title;

            const user = props.users[story.userId];
            return (
              <li key={id} className="stories__item">
                <Story
                  id={id}
                  title={title}
                  link={link}
                  date={new Date(story.createDate)}
                  score={story.voted.length}
                  user={user}
                  commentCount={story.commentsCount}
                  voted={story.voted.includes(props.user.id)}
                  onUpvote={() => props.onUpvote(id, props.user.id)}
                  onUnvote={() => props.onUnvote(id, props.user.id)}
                  loggedIn={!!props.user.id}
                />
              </li>
            );
          })}
        </ol>
      </div>
      <Paginator page={page} hasNext={hasNext} location={props.location} />
    </div>
  );
};

export const mapStateToProps = ({ stories, users, comments, user }) => {
  return {
    stories,
    users,
    user,
    comments
  };
};

export const mapDispatchToProps = dispatch => {
  return {
    onUpvote(id, userId) {
      return dispatch(
        actions.upvoteStory(id, {
          userId
        })
      );
    },
    onUnvote(id, userId) {
      return dispatch(
        actions.unvoteStory(id, {
          userId
        })
      );
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Stories);
