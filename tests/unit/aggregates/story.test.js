import uuid from 'uuid'

import '../../../common/aggregates'
import story from '../../../common/aggregates/story'
import {
  STORY_CREATED,
  STORY_UPVOTED,
  STORY_UNVOTED,
  STORY_COMMENTED
} from '../../../common/events'

describe('aggregates', () => {
  describe('story', () => {
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

      const event = story.commands.createStory(state, command, () => {})

      expect(event).toEqual({
        type: STORY_CREATED,
        payload: { title, text, link, userId }
      })
    })

    it('command "createStory" should throw Error "Story already exists"', () => {
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

      expect(() =>
        story.commands.createStory(state, command, () => {})
      ).toThrowError('Story already exists')
    })

    it('command "createStory" should throw Error "The title field is required"', () => {
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

      expect(() =>
        story.commands.createStory(state, command, () => {})
      ).toThrowError('The "title" field is required')
    })

    it('command "createStory" should throw Error "The userId field is required"', () => {
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

      expect(() =>
        story.commands.createStory(state, command, () => {})
      ).toThrowError('The "userId" field is required')
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

      const event = story.commands.upvoteStory(state, command, () => {})

      expect(event).toEqual({ type: STORY_UPVOTED, payload: { userId } })
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

      expect(() =>
        story.commands.upvoteStory(state, command, () => {})
      ).toThrowError('User already voted')
    })

    it('command "upvoteStory" should throw Error "Story does not exist"', () => {
      const userId = uuid.v4()

      const state = {}
      const command = {
        payload: {
          userId
        }
      }

      expect(() =>
        story.commands.upvoteStory(state, command, () => {})
      ).toThrowError('Story does not exist')
    })

    it('command "upvoteStory" should throw Error "The userId field is required"', () => {
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

      expect(() =>
        story.commands.upvoteStory(state, command, () => {})
      ).toThrowError('The "userId" field is required')
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

      const event = story.commands.unvoteStory(state, command, () => {})

      expect(event).toEqual({ type: STORY_UNVOTED, payload: { userId } })
    })

    it('command "unvoteStory" should throw Error "User did not vote"', () => {
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

      expect(() =>
        story.commands.unvoteStory(state, command, () => {})
      ).toThrowError('User did not vote')
    })

    it('command "unvoteStory" should throw Error "Story does not exist"', () => {
      const userId = uuid.v4()

      const state = {}
      const command = {
        payload: {
          userId
        }
      }

      expect(() =>
        story.commands.unvoteStory(state, command, () => {})
      ).toThrowError('Story does not exist')
    })

    it('command "unvoteStory" should throw Error "The userId field is required"', () => {
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

      expect(() =>
        story.commands.unvoteStory(state, command, () => {})
      ).toThrowError('The "userId" field is required')
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

      expect(story.projection[STORY_CREATED](state, event)).toEqual(nextState)
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

      expect(story.projection[STORY_UPVOTED](state, event)).toEqual(nextState)
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

      expect(story.projection[STORY_UNVOTED](state, event)).toEqual(nextState)
    })
  })

  describe('comments', () => {
    it('command "commentStory" should create an event to create a comment', () => {
      const text = 'SomeText'
      const parentId = uuid.v4()
      const userId = uuid.v4()

      const state = {
        createdAt: Date.now(),
        comments: {}
      }

      const command = {
        payload: {
          text,
          parentId,
          userId
        }
      }

      const event = story.commands.commentStory(state, command, () => {})

      expect(event).toEqual({
        type: STORY_COMMENTED,
        payload: { text, parentId, userId }
      })
    })

    it('command "commentStory" should throw Error "Comment already exists"', () => {
      const text = 'SomeText'
      const parentId = uuid.v4()
      const userId = uuid.v4()
      const commentId = uuid.v4()

      const state = {
        createdAt: Date.now(),
        comments: {
          [commentId]: {}
        }
      }

      const command = {
        payload: {
          text,
          parentId,
          userId,
          commentId
        }
      }

      expect(() =>
        story.commands.commentStory(state, command, () => {})
      ).toThrowError('Comment already exists')
    })

    it('command "commentStory" should throw Error "The text field is required"', () => {
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

      expect(() =>
        story.commands.commentStory(state, command, () => {})
      ).toThrowError('The "text" field is required')
    })

    it('command "commentStory" should throw Error "The parentId field is required"', () => {
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

      expect(() =>
        story.commands.commentStory(state, command, () => {})
      ).toThrowError('The "parentId" field is required')
    })

    it('command "commentStory" should throw Error "The userId field is required"', () => {
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

      expect(() =>
        story.commands.commentStory(state, command, () => {})
      ).toThrowError('The "userId" field is required')
    })

    it('eventHandler "STORY_COMMENTED" should set new comment to state', () => {
      const createdAt = Date.now()
      const userId = uuid.v4()
      const commentId = uuid.v4()

      const state = story.initialState
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

      expect(story.projection[STORY_COMMENTED](state, event)).toEqual(nextState)
    })
  })
})
