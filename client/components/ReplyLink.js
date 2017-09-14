import React from 'react'
import { Link } from 'react-router-dom'

import '../styles/comment.css'

const ReplyLink = ({ storyId, commentId, level }) => (
  <div className={`comment--level${Math.min(level, 15)}`}>
    <div className="comment__reply-link">
      <Link
        className="comment__reply"
        to={`/storyDetails/${storyId}/comments/${commentId}/reply`}
      >
        reply
      </Link>
    </div>
  </div>
)

export default ReplyLink
