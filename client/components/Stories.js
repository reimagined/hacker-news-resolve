import React from 'react'
import { Redirect } from 'react-router-dom'

import Story from '../containers/Story'
import Pagination from './Pagination'
import { NUMBER_OF_ITEMS_PER_PAGE } from '../../common/constants'
import '../styles/stories.css'

const Stories = ({ items, page, type }) =>
  page && !Number.isInteger(Number(page)) ? (
    <Redirect push to={`/error?text=No such page`} />
  ) : (
    <div>
      <div className="stories">
        <ol
          className="stories__list"
          start={NUMBER_OF_ITEMS_PER_PAGE * (page ? page - 1 : 0) + 1}
        >
          {items.slice(0, NUMBER_OF_ITEMS_PER_PAGE).map(story => (
            <li key={story.id} className="stories__item">
              <Story story={story} />
            </li>
          ))}
        </ol>
      </div>
      <Pagination
        page={page}
        hasNext={!!items[NUMBER_OF_ITEMS_PER_PAGE]}
        location={`/${type}`}
      />
    </div>
  )

export default Stories
