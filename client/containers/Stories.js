import React from 'react'
import { connect } from 'react-redux'

import Story from '../containers/Story'
import Paginator from '../components/Paginator'
import { NUMBER_OF_ITEMS_PER_PAGE } from '../../common/constants'
import '../styles/stories.css'

export const Stories = ({ stories, page, type }) => {
  const hasNext = !!stories[NUMBER_OF_ITEMS_PER_PAGE]

  const firstStoryIndex = NUMBER_OF_ITEMS_PER_PAGE * (page ? page - 1 : 0)

  return (
    <div>
      <div className="stories">
        <ol className="stories__list" start={firstStoryIndex + 1}>
          {stories.slice(0, NUMBER_OF_ITEMS_PER_PAGE).map(story => (
            <li key={story.id} className="stories__item">
              <Story id={story.id} />
            </li>
          ))}
        </ol>
      </div>
      <Paginator
        page={page}
        hasNext={hasNext}
        location={`/${type || 'newest'}`}
      />
    </div>
  )
}

export const mapStateToProps = ({ stories }) => ({
  stories
})

export default connect(mapStateToProps)(Stories)
