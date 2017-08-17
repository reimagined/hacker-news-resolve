import React from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';
import Comment from '../components/Comment';
import { getPageItems, hasNextItems } from '../helpers/getPageItems';
import Paginator from '../components/Paginator';

const findRoot = (id, comments) => {
  if (comments[id]) {
    return findRoot(comments[id].parentId, comments);
  }
  return id;
};

const Comments = props => {
  let { page } = queryString.parse(props.location.search);
  let comments = Object.keys(props.comments);

  const hasNext = hasNextItems(comments, page);
  comments = getPageItems(comments, page);

  return (
    <div>
      {comments.map(id => {
        const comment = props.comments[id];
        const parentId = comment.parentId;
        const rootId = findRoot(parentId, props.comments);

        const parent =
          parentId === rootId
            ? `/storyDetails?id=${parentId}`
            : `/comment?id=${parentId}`;

        const root = props.stories[rootId];

        return (
          <Comment
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

const mapStateToProps = ({ stories, users, comments, user }) => {
  return {
    stories,
    users,
    comments
  };
};

export default connect(mapStateToProps)(Comments);
