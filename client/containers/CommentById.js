import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { gqlConnector } from 'resolve-redux'
import uuid from 'uuid'
import styled from 'styled-components'

import actions from '../actions/storiesActions'
import ChildrenComments from '../components/ChildrenComments'
import Comment from '../components/Comment'

const Reply = styled.div`
  padding: 1em 1.25em 0 1.25em;
  margin-bottom: 1em;
`

export class CommentById extends React.PureComponent {
  componentDidUpdate = () => {
    const { refetchStory, onRefetched, data: { refetch } } = this.props

    if (refetchStory) {
      refetch()
      onRefetched()
    }
  }

  saveComment = () => {
    const {
      match: { params: { storyId } },
      data: { comment },
      userId
    } = this.props

    this.props.commentStory({
      storyId,
      parentId: comment.id,
      text: this.textarea.value,
      userId
    })

    this.textarea.value = ''
  }

  render() {
    const {
      match: { params: { storyId } },
      data: { comment },
      loggedIn
    } = this.props

    if (!comment) {
      return null
    }

    return (
      <Comment storyId={storyId} level={0} {...comment}>
        {loggedIn ? (
          <Reply>
            <textarea
              ref={element => {
                if (element) {
                  this.textarea = element
                }
              }}
              name="text"
              rows="6"
              cols="70"
            />
            <div>
              <button onClick={this.saveComment}>reply</button>
            </div>
          </Reply>
        ) : null}
        <ChildrenComments
          storyId={storyId}
          comments={comment.replies}
          parentId={comment.id}
        />
      </Comment>
    )
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      commentStory: ({ storyId, parentId, userId, text }) =>
        actions.commentStory(storyId, {
          commentId: uuid.v4(),
          parentId,
          userId,
          text
        }),
      onRefetched: () => ({
        type: 'STORY_REFETCHED'
      })
    },
    dispatch
  )

const mapStateToProps = ({ user, ui: { refetchStory } }) => ({
  userId: user.id,
  loggedIn: !!user.id,
  refetchStory
})

export default gqlConnector(
  `
    fragment CommentWithReplies on Comment {
      id
      parentId
      text
      createdAt
      createdBy
      createdByName
      replies {
        ...CommentWithReplies
      }
    }

    query($id: ID!) {
      comment(id: $id) {
        ...CommentWithReplies
      }
    }
  `,
  {
    options: ({ match: { params: { commentId } } }) => ({
      variables: {
        id: commentId
      }
    })
  }
)(connect(mapStateToProps, mapDispatchToProps)(CommentById))
