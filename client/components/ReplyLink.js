import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const Href = styled.div`
  text-decoration: underline;
  margin-top: 0.33em;
  color: #000;
`

const ReplyLink = ({ storyId, commentId, level }) => (
  <Link to={`/storyDetails/${storyId}/comments/${commentId}`}>
    <Href>reply</Href>
  </Link>
)

export default ReplyLink
