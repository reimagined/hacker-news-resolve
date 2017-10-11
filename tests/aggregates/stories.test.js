import uuid from 'uuid'

import '../../common/aggregates'
import stories from '../../common/aggregates/story'
import events from '../../common/events'
import { Event } from '../../common/helpers'

const { STORY_CREATED, STORY_UPVOTED, STORY_UNVOTED, COMMENT_CREATED } = events

describe('aggregates', () => {
  describe('stories', () => {
    it('command "createStory" should create an event to create a story', () => {
      const title = 'SomeTitle'
      const text = 'SomeText'
      const link = 'SomeLink'
      const userId = uuid.v4()

      const state = {}
      const command = {
        payload: {
          title,
          text,
          link,
          userId
        }
      }

      const event = stories.commands.createStory(state, command)

      expect(event).toEqual(
        new Event(STORY_CREATED, {
          title,
          text,
          link,
          userId
        })
      )
    })

    it('command "createStory" should throw Error "Aggregate already exists"', () => {
      const title = 'SomeTitle'
      const text = 'SomeText'
      const link = 'SomeLink'
      const userId = uuid.v4()

      const state = {
        createdAt: Date.now(),
        createdBy: userId
      }
      const command = {
        payload: {
          title,
          text,
          link,
          userId
        }
      }

      expect(() => stories.commands.createStory(state, command)).toThrowError(
        'Aggregate already exists'
      )
    })

    it('command "createStory" should throw Error "Title is required"', () => {
      const title = undefined
      const text = 'SomeText'
      const link = 'SomeLink'
      const userId = uuid.v4()

      const state = {}
      const command = {
        payload: {
          title,
          text,
          link,
          userId
        }
      }

      expect(() => stories.commands.createStory(state, command)).toThrowError(
        'Title is required'
      )
    })

    it('command "createStory" should throw Error "UserId is required"', () => {
      const title = 'SomeTitle'
      const text = 'SomeText'
      const link = 'SomeLink'
      const userId = undefined

      const state = {}
      const command = {
        payload: {
          title,
          text,
          link,
          userId
        }
      }

      expect(() => stories.commands.createStory(state, command)).toThrowError(
        'UserId is required'
      )
    })

    it('command "upvoteStory" should create an event to upvote the story', () => {
      const userId = uuid.v4()

      const state = {
        createdAt: Date.now(),
        createdBy: userId,
        voted: []
      }
      const command = {
        payload: {
          userId
        }
      }

      const event = stories.commands.upvoteStory(state, command)

      expect(event).toEqual(
        new Event(STORY_UPVOTED, {
          userId
        })
      )
    })

    it('command "upvoteStory" should throw Error "User already voted"', () => {
      const userId = uuid.v4()

      const state = {
        createdAt: Date.now(),
        createdBy: userId,
        voted: [userId]
      }
      const command = {
        payload: {
          userId
        }
      }

      expect(() => stories.commands.upvoteStory(state, command)).toThrowError(
        'User already voted'
      )
    })

    it('command "upvoteStory" should throw Error "Aggregate is not exist"', () => {
      const userId = uuid.v4()

      const state = {}
      const command = {
        payload: {
          userId
        }
      }

      expect(() => stories.commands.upvoteStory(state, command)).toThrowError(
        'Aggregate is not exist'
      )
    })

    it('command "upvoteStory" should throw Error "UserId is required"', () => {
      const userId = undefined

      const state = {
        createdAt: Date.now(),
        createdBy: userId,
        voted: []
      }
      const command = {
        payload: {
          userId
        }
      }

      expect(() => stories.commands.upvoteStory(state, command)).toThrowError(
        'UserId is required'
      )
    })

    it('command "unvoteStory" should create an event to unvote the story', () => {
      const userId = uuid.v4()

      const state = {
        createdAt: Date.now(),
        createdBy: userId,
        voted: [userId]
      }
      const command = {
        payload: {
          userId
        }
      }

      const event = stories.commands.unvoteStory(state, command)

      expect(event).toEqual(
        new Event(STORY_UNVOTED, {
          userId
        })
      )
    })

    it('command "unvoteStory" should throw Error "User has not voted"', () => {
      const userId = uuid.v4()

      const state = {
        createdAt: Date.now(),
        createdBy: userId,
        voted: []
      }
      const command = {
        payload: {
          userId
        }
      }

      expect(() => stories.commands.unvoteStory(state, command)).toThrowError(
        'User has not voted'
      )
    })

    it('command "unvoteStory" should throw Error "Aggregate is not exist"', () => {
      const userId = uuid.v4()

      const state = {}
      const command = {
        payload: {
          userId
        }
      }

      expect(() => stories.commands.unvoteStory(state, command)).toThrowError(
        'Aggregate is not exist'
      )
    })

    it('command "unvoteStory" should throw Error "UserId is required"', () => {
      const userId = undefined

      const state = {
        createdAt: Date.now(),
        createdBy: userId,
        voted: [userId]
      }
      const command = {
        payload: {
          userId
        }
      }

      expect(() => stories.commands.unvoteStory(state, command)).toThrowError(
        'UserId is required'
      )
    })

    it('eventHandler "STORY_CREATED" should set createdAt, createdBy and voted to state', () => {
      const createdAt = Date.now()
      const userId = uuid.v4()

      const state = {}
      const event = {
        timestamp: createdAt,
        payload: {
          userId
        }
      }
      const nextState = {
        createdAt,
        createdBy: userId,
        voted: [],
        comments: {}
      }

      expect(stories.projection[STORY_CREATED](state, event)).toEqual(nextState)
    })

    it('eventHandler "STORY_UPVOTED" should add userId to state.voted', () => {
      const createdAt = Date.now()
      const userId = uuid.v4()

      const state = {
        createdAt,
        createdBy: userId,
        voted: []
      }
      const event = {
        payload: {
          userId
        }
      }
      const nextState = {
        createdAt,
        createdBy: userId,
        voted: [userId]
      }

      expect(stories.projection[STORY_UPVOTED](state, event)).toEqual(nextState)
    })

    it('eventHandler "STORY_UNVOTED" should remove userId from state.voted', () => {
      const createdAt = Date.now()
      const userId = uuid.v4()

      const state = {
        createdAt,
        createdBy: userId,
        voted: [userId]
      }
      const event = {
        payload: {
          userId
        }
      }
      const nextState = {
        createdAt,
        createdBy: userId,
        voted: []
      }

      expect(stories.projection[STORY_UNVOTED](state, event)).toEqual(nextState)
    })
  })

  describe('comments', () => {
    it('command "createComment" should create an event to create a comment', () => {
      const text = 'SomeText'
      const parentId = uuid.v4()
      const userId = uuid.v4()

      const state = {
        createdAt: Date.now()
      }

      const command = {
        payload: {
          text,
          parentId,
          userId
        }
      }

      const event = stories.commands.createComment(state, command)

      expect(event).toEqual(
        new Event(COMMENT_CREATED, {
          text,
          parentId,
          userId
        })
      )
    })

    it('command "createComment" should throw Error "Text is required"', () => {
      const text = undefined
      const parentId = uuid.v4()
      const userId = uuid.v4()

      const state = {
        createdAt: Date.now()
      }

      const command = {
        payload: {
          text,
          parentId,
          userId
        }
      }

      expect(() => stories.commands.createComment(state, command)).toThrowError(
        'Text is required'
      )
    })

    it('command "createComment" should throw Error "ParentId is required"', () => {
      const text = 'SomeText'
      const parentId = undefined
      const userId = uuid.v4()

      const state = {
        createdAt: Date.now()
      }

      const command = {
        payload: {
          text,
          parentId,
          userId
        }
      }

      expect(() => stories.commands.createComment(state, command)).toThrowError(
        'ParentId is required'
      )
    })

    it('command "createComment" should throw Error "UserId is required"', () => {
      const text = 'SomeText'
      const parentId = uuid.v4()
      const userId = undefined

      const state = {
        createdAt: Date.now()
      }

      const command = {
        payload: {
          text,
          parentId,
          userId
        }
      }

      expect(() => stories.commands.createComment(state, command)).toThrowError(
        'UserId is required'
      )
    })

    it('eventHandler "COMMENT_CREATED" should set new comment to state', () => {
      const createdAt = Date.now()
      const userId = uuid.v4()
      const commentId = uuid.v4()

      const state = stories.initialState
      const event = {
        timestamp: createdAt,
        payload: {
          userId,
          commentId
        }
      }
      const nextState = {
        comments: {
          [commentId]: {
            createdAt,
            createdBy: userId
          }
        }
      }

      expect(stories.projection[COMMENT_CREATED](state, event)).toEqual(
        nextState
      )
    })
  })
})
