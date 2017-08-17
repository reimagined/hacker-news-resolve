import React from 'react';
import { Link } from 'react-router-dom';

import '../styles/paginator.css';

const Paginator = ({ page = 1, hasNext, location }) => {
  const route = location.pathname;
  const onClick = () =>
    setTimeout(function() {
      window.scrollTo(0, 0);
    }, 0);

  if (page === 1 && !hasNext) {
    return null;
  }
  const nextDisabledClassName = !hasNext && 'paginator__disabled';
  const prevDisabledClassName = page <= 1 && 'paginator__disabled';

  return (
    <div className="paginator">
      <Link
        className={prevDisabledClassName}
        to={`${route}?page=${Number(page) - 1}`}
        onClick={onClick}
      >
        <span className={prevDisabledClassName}>Prev</span>
      </Link>
      {` | ${page} | `}
      <Link
        className={nextDisabledClassName}
        to={`${route}?page=${Number(page) + 1}`}
        onClick={onClick}
      >
        <span className={nextDisabledClassName}>More</span>
      </Link>
    </div>
  );
};

export default Paginator;
