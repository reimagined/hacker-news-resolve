import React from 'react'
import { Link } from 'react-router-dom'
import styled, { css } from 'styled-components'

import Splitter from './Splitter'

const Wrapper = styled.div`
  margin-left: 3em;
  padding: 0.5em 0;
`

const Href = styled.div`
  display: inline;
  font-weight: bold;
  color: #000;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }

  ${props =>
    props.disabled &&
    css`
      pointer-events: none;
      cursor: default;
      color: gray;
    `};
`

const Pagination = ({ page, hasNext, location }) => {
  if (page === 1 && !hasNext) {
    return null
  }

  const prevDisabled = page <= 1
  const nextDisabled = !hasNext

  return (
    <Wrapper>
      <Link to={`${location}/${Number(page) - 1}`}>
        <Href disabled={prevDisabled}>Prev</Href>
      </Link>
      <Splitter />
      {page}
      <Splitter />
      <Link to={`${location}/${Number(page) + 1}`}>
        <Href disabled={nextDisabled}>More</Href>
      </Link>
    </Wrapper>
  )
}

Pagination.defaultProps = {
  page: 1
}

export default Pagination
