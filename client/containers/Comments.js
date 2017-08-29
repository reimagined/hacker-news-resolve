import React from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';

import Comment from '../components/Comment';
import { getPageStories, hasNextStories } from '../helpers/getPageStories';
import Paginator from '../components/Paginator';

export const findRoot = (id, comments) => {
  const comment = comments.find(c => c.id === id);

  if (!comment) {
    return id;
  }

  return findRoot(comment.parentId, comments);
};

export const Comments = props => {
  const { page } = queryString.parse(props.location.search);
  const { comments } = props;

  const hasNext = hasNextStories(comments, page);

  return (
    <div>
      {getPageStories(comments, page).map(comment => {
        const parentId = comment.parentId;
        const rootId = findRoot(parentId, comments);

        const parent =
          parentId === rootId
            ? `/storyDetails?id=${parentId}`
            : `/comment?id=${parentId}`;

        const root = props.stories[rootId];

        return (
          <Comment
            key={comment.id}
            replies={comment.replies}
            id={comment.id}
            content={comment.text}
            user={props.users[comment.createdBy].name}
            date={new Date(comment.createdAt)}
            parent={parent}
            root={root}
          />
        );
      })}
      <Paginator page={page} hasNext={hasNext} location={props.location} />
    </div>
  );
};

export const mapStateToProps = ({ stories, users, comments, user }) => {
  return {
    stories,
    users,
    comments
  };
};

export default connect(mapStateToProps)(Comments);
