import React from 'react';
import { connect } from 'react-redux';
import CommentComponent from './CommentComponent';

function findRoot(id, comments) {
  if (comments[id]) {
    return findRoot(comments[id].parentId, comments);
  }
  return id;
}

const CommentsComponent = props => {
  return (
    <div>
      {Object.keys(props.comments).map(id => {
        const comment = props.comments[id];
        const parentId = comment.parentId;
        const rootId = findRoot(parentId, props.comments);

        const parent =
          parentId === rootId
            ? `/story?id=${parentId}`
            : `/comment?id=${parentId}`;

        const root = props.news[rootId];

        return (
          <CommentComponent
            replies={comment.replies}
            id={comment.id}
            content={comment.text}
            user={props.users[comment.createdBy].name}
            date={new Date(comment.createdAt)}
            parent={parent}
            root={root}
            expanded
          />
        );
      })}
    </div>
  );
};

function mapStateToProps({ news, users, comments, user }) {
  return {
    news,
    users,
    comments
  };
}

export default connect(mapStateToProps)(CommentsComponent);
