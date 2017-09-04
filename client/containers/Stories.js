import React from 'react';
import { connect } from 'react-redux';

import Story from '../components/Story';
import Paginator from '../components/Paginator';
import { NUMBER_OF_ITEMS_PER_PAGE } from '../../common/constants';
import actions from '../actions/stories';
import '../styles/stories.css';

export const Stories = props => {
  let { stories, type, page } = props;

  const hasNext = !!stories[NUMBER_OF_ITEMS_PER_PAGE];

  const firstStoryIndex = NUMBER_OF_ITEMS_PER_PAGE * (page ? page - 1 : 0);

  return (
    <div>
      <div className="stories">
        <ol className="stories__list" start={firstStoryIndex + 1}>
          {stories.slice(0, NUMBER_OF_ITEMS_PER_PAGE).map(story => {
            const { type } = story;

            const link = story.link || `/storyDetails/${story.id}`;
            const title =
              type === 'ask' ? `Ask HN: ${story.title}` : story.title;

            const user = props.users.find(({ id }) => id === story.userId);

            return (
              <li key={story.id} className="stories__item">
                <Story
                  id={story.id}
                  title={title}
                  link={link}
                  date={new Date(+story.createDate)}
                  score={story.voted.length}
                  user={user}
                  commentCount={story.commentsCount}
                  voted={story.voted.includes(props.user.id)}
                  onUpvote={() => props.onUpvote(story.id, props.user.id)}
                  onUnvote={() => props.onUnvote(story.id, props.user.id)}
                  loggedIn={!!props.user.id}
                />
              </li>
            );
          })}
        </ol>
      </div>
      <Paginator
        page={page}
        hasNext={hasNext}
        location={`/${type || 'newest'}`}
      />
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
