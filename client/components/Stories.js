import React from 'react'
import { Redirect } from 'react-router-dom'
import styled from 'styled-components'

import Story from '../containers/Story'
import Pagination from './Pagination'
import { NUMBER_OF_ITEMS_PER_PAGE } from '../../common/constants'

const Wrapper = styled.div`padding: 0 0.5em;`

const Item = styled.li`margin-bottom: 12px;`

const ItemList = 'ol'

const Stories = ({ items, page, type, refetch }) =>
  page && !Number.isInteger(Number(page)) ? (
    <Redirect push to="/error?text=No such page" />
  ) : (
    <Wrapper>
      <ItemList start={NUMBER_OF_ITEMS_PER_PAGE * (page ? page - 1 : 0) + 1}>
        {items.slice(0, NUMBER_OF_ITEMS_PER_PAGE).map(story => (
          <Item key={story.id}>
            <Story refetch={refetch} story={story} />
          </Item>
        ))}
      </ItemList>
      <Pagination
        page={page}
        hasNext={!!items[NUMBER_OF_ITEMS_PER_PAGE]}
        location={`/${type}`}
      />
    </Wrapper>
  )

export default Stories
