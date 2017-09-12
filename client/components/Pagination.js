import React from 'react'
import { Link } from 'react-router-dom'

import '../styles/pagination.css'

const Pagination = ({ page, hasNext, location }) => {
  if (page === 1 && !hasNext) {
    return null
  }

  const nextDisabledClassName = (!hasNext && 'pagination__disabled') || ''
  const prevDisabledClassName = (page <= 1 && 'pagination__disabled') || ''

  return (
    <div className="pagination">
      <Link
        className={`pagination__link ${prevDisabledClassName}`}
        to={`${location}/${Number(page) - 1}`}
      >
        Prev
      </Link>
      {` | ${page} | `}
      <Link
        className={`pagination__link ${nextDisabledClassName}`}
        to={`${location}/${Number(page) + 1}`}
      >
        More
      </Link>
    </div>
  )
}

Pagination.defaultProps = {
  page: 1
}

export default Pagination
