import React from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';

import Comment from '../components/Comment';
import { getPageStories, hasNextStories } from '../helpers/getPageStories';
import Paginator from '../components/Paginator';
import getById from '../helpers/getById';

export const findRoot = (id, comments) => {
  const comment = getById(comments, id);

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

        const root = getById(props.stories, rootId);
        const user = getById(props.users, comment.createdBy);

        return (
          <Comment
            key={comment.id}
            replies={comment.replies}
            id={comment.id}
            content={comment.text}
            user={user.name}
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
