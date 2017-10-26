# hacker-news-resolve &middot; [![Build Status](https://travis-ci.org/reimagined/hacker-news-resolve.svg?branch=master)](https://travis-ci.org/reimagined/hacker-news-resolve) [![Coverage Status](https://coveralls.io/repos/github/reimagined/hacker-news-resolve/badge.svg?branch=master)](https://coveralls.io/github/reimagined/hacker-news-resolve?branch=master)
A React & Redux & Resolve implementation of Hacker News

[<img src="https://user-images.githubusercontent.com/5055654/31942409-d8d6cf98-b8cd-11e7-93f4-613acda010dc.png" height="100">](https://github.com/facebook/react)
[<img src="https://raw.githubusercontent.com/reactjs/redux/master/logo/logo.png" height="100">](https://github.com/reactjs/redux)
[<img src="https://avatars2.githubusercontent.com/u/27729046" height="100">](https://github.com/reimagined/resolve/)

# Getting Started

### Installation

```bash
git clone https://github.com/reimagined/hacker-news-resolve.git
cd hacker-news-resolve
npm install
```

### Run Application

```bash
npm run dev
```

Starts the app in development mode.
Provides hot reloading, source mapping and other development capabilities.

```bash
npm run build
npm start
```

Starts the application in production mode.

After you run the application you can view it at [http://localhost:3000/](http://localhost:3000/).

### Data Import

```bash
npm run import
```

Imports data (up to 500 stories with comments) from [HackerNews](https://news.ycombinator.com/).
Press `Crtl-C` to stop importing or wait until it is finished.

# Reproducing Hacker News using ReSolve

This tutorial guides you through the process of creating a Hacker News application.
It consists of the following steps:

* [Requirements](#requirements)
* [Creating a New ReSolve Application](#creating-a-new-resolve-application)
* [Domain Model Analysis](#domain-model-analysis)
* [Adding Users](#adding-users)
  * [Login View](#login-view)
  * [User View](#user-view)
  * [Write Side](#write-side)
  * [Read Side](#read-side)
  * [Authentication](#authentication)
* [Adding Stories](#adding-stories)
  * [Stories View](#stories-view)
  * [Story View](#story-view)
  * [Submit View](#submit-view)
  * [Write Side](#write-side-1)
  * [Read Side](#read-side-1)
  * [GraphQL](#graphql)
  * [Linking Client and Server Sides](#linking-client-and-server-sides)
* [Adding Comments](#adding-comments)
  * [Story View Extension](#story-view-extension)
  * [Comments View](#comments-view)
  * [Write Side](#write-side-2)
  * [Read Side](#read-side-2)
  * [GraphQL](#graphql-1)
* [Data Importer](#data-importer)

This demo is implemented using the [reSolve](https://github.com/reimagined/resolve) framework.
You need to be familiar with React and Redux, as well as with DDD, CQRS and Event Sourcing.
If you are new to these concepts, refer to the following links to learn the basics:

* [Event Sourcing](https://martinfowler.com/eaaDev/EventSourcing.html)
* [Command/Query Responsibility Segregation and Domain-Driven Design](http://cqrs.nu/)
* [React](https://reactjs.org/)
* [Redux](http://redux.js.org/docs/introduction/)
* [GraphQL](http://graphql.org/learn/)

You can also read the following articles for more information:

* [Why using DDD, CQRS and Event Sourcing](https://github.com/cer/event-sourcing-examples/wiki/WhyEventSourcing)
* [Building Scalable Applications Using Event Sourcing and CQRS](https://medium.com/technology-learning/event-sourcing-and-cqrs-a-look-at-kafka-e0c1b90d17d8)
* [May the source be with you](http://arkwright.github.io/event-sourcing.html)
* [Using logs to build a solid data infrastructure](https://www.confluent.io/blog/using-logs-to-build-a-solid-data-infrastructure-or-why-dual-writes-are-a-bad-idea/)

## Requirements

* node 8.2.0, or later
* npm 5.3.0, or later

## Creating a New ReSolve Application

Use the [create-resolve-app](https://github.com/reimagined/resolve/tree/master/packages/create-resolve-app) CLI tool to create a new reSolve project.

Install create-resolve-app globally.

```
npm i -g create-resolve-app
```

Create an empty reSolve project and run the application in the development mode.

```
create-resolve-app hn-resolve
cd hn-resolve
npm run dev
```

The application opens in the browser at [http://localhost:3000/](http://localhost:3000/).

After the installation is completed, your project has the default structure:

![Project structure](./docs/project-structure.png)

## Domain Model Analysis

At this point, we need to analyze the domain.
Event Sourcing and CQRS require identifying Domain Aggregates and their corresponding commands and events.
We can then use these events to build the required read models.

Hacker News is a social news website focusing on computer science.
Its users can post news, ask questions and comment on news, and reply to other comments.
Posts are called Stories, so we will use this name in further.

**Users** can post **Stories** and **Comments**.
* Story - news or question
* Comment - a short message written about news or question
* User - a registered and logged in user that can perform actions (post news, ask questions, write comments)

Now we need to identify domain aggregate roots.
To do this, detect which commands the Hacker News application should perform and which entities they are addressed to:
* create a **User**
* create a **Story**
* comment a **Story**
* upvote a **Story**
* unvote a **Story**

We only need the User and Story aggregate roots since there are no commands addressed to Comment.
Note that when using CQRS and Event Sourcing, we make a hard and important design decision on the Write Side: we identify which events should be captured, and then we can calculate necessary read models from these events.

To summarize the domain analysis:
There are two aggregate roots - User and Story with the following commands and events:
* User
  * CreateUser generates the UserCreated event
* Story
  * CreateStory generates the StoryCreated event
  * CreateComment generates the CommentCreated event
  * UpvoteStory generates the StoryUpvoted event
  * UnvoteStory generates the StoryUnvoted event

## Adding Users

Add user registration and authentication functionality to the application.
For demo purposes, we omitted password checking.
If needed, you can implement hashing and storing passwords in later.

A user has the following fields:
* id - a unique user ID created on the server side automatically
* name - a unique user name which a user provides in the registration form
* createdAt - the user's registration timestamp

### Login View

The app layout contains meta information, an application header with a menu, user info and some content.

Install the following packages:
* `react-helmet` - to pass meta information to the HTML header
* `react-router` - to implement routing
* `redux` and `react-redux` - to store data 
* `seamless-immutable` - to enforce state immutability
* `js-cookie` - to manipulate cookies 
* `styled-components` -  to style components

```bash
npm install --save react-helmet react-router react-router-dom seamless-immutable js-cookie styled-components
```

Implement the login view.
It is based on the [AuthForm](./client/components/AuthForm.js) component and rendered by the [Login](./client/components/Login.js) component.

The login view is placed in the main layout.
Follow the steps below to implement the layout:
* Prepare Redux [user actions](./client/actions/userActions.js).
* Add the [Splitter](./client/components/Splitter.js) component that serves a vertical menu splitter.
* Add the [App](./client/containers/App.js) container implementing the layout.
In the `containers/App.js` file, comment the `uiActions` import and the `onSubmitViewShown` action in the `mapDispatchToProps` function, and add the header's [logo](./static/reSolve-logo.svg). 

Add the layout and login view to the root component.
* Add routes. To do this, create the `client/routes.js` file.
In this file, comment all imports excluding the `App` container and the `Login` component, and all routes excluding the `/login` path.
* Implement the `RouteWithSubRoutes` component to provide routes.

Use a Redux store for data storing.
In the [client/store/index.js](./client/store/index.js) file, add the [devtools](https://github.com/zalmoxisus/redux-devtools-extension) and [resolve-redux](https://github.com/reimagined/resolve/tree/master/packages/resolve-redux#-utils) middlewares, and implement the logout middleware.

Prepare the `App` component by adding router providers.

Now you can go to http://localhost:3000 to see the login view.

### User View

Implement the user view to show an authenticated user.

To get user data using GraphQL, import the `gqlConnector` from the `resolve-redux` package.

Implement the [UserById](./client/containers/UserById.js) container.
Uncomment this container import in [routes](./client/routes.js) and add the `/user/:userId` path.

### Write Side

Create a user aggregate.
Implement event types:

```js
// ./common/events.js

export const USER_CREATED = 'UserCreated'
```

Add the `createUser` command that should return the `UserCreated` event.
Validate input data to ensure that a user name exists and it is not empty.
Add projection handlers and an initial state to check whether a user already exists.

```js
// ./common/aggregates/validation.js

export default {
  stateIsAbsent: (state, type) => {
    if (Object.keys(state).length > 0) {
      throw new Error(`${type} already exists`)
    }
  },

  fieldRequired: (payload, field) => {
    if (!payload[field]) {
      throw new Error(`The "${field}" field is required`)
    }
  }
}
```

```js
// ./common/aggregates/user.js

// @flow
import { USER_CREATED } from '../events'
import validate from './validation'

export default {
  name: 'user',
  initialState: {},
  commands: {
    createUser: (state: any, command: any) => {
      validate.stateIsAbsent(state, 'User')

      const { name } = command.payload

      validate.fieldRequired(command.payload, 'name')

      const payload: UserCreatedPayload = { name }
      return { type: USER_CREATED, payload }
    }
  },
  projection: {
    [USER_CREATED]: (state, { timestamp }) => ({
      ...state,
      createdAt: timestamp
    })
  }
}
```

Add aggregate for passing to the config.

```js
// ./common/aggregates/index.js

import user from './user'

export default [user]
```

### Read Side

Implement a read side.
The simplest way to store users is using a users array.

```js
// ./common/read-models/graphql/collections/users.js

// @flow
import { USER_CREATED } from '../../../events'

type User = {
  id: string,
  name: string,
  createdAt: number
}

type UsersState = Array<User>

export default {
  name: 'users',
  initialState: [],
  projection: {
    [USER_CREATED]: (state: UsersState, event: UserCreated): UsersState => {
      const { aggregateId, timestamp, payload: { name } } = event

      state.push({
        id: aggregateId,
        name,
        createdAt: timestamp
      })
      return state
    }
  }
}
```

Add the default export for collections.

```js
// ./common/read-models/graphql/collections/index.js

import users from './users'

export default [users]
```

Describe a schema and implement resolvers to get data using GraphQL.

```js
// ./common/read-models/graphql/schema.js

export default `
  type User {
    id: ID!
    name: String
    createdAt: String
  }
  type Query {
    user(id: ID, name: String): User
  }
`
```

Implement resolvers.

```js
// ./common/read-models/graphql/resolvers.js

export default {
  user: async (read, { id, name }) => {
    const root = await read('users')

    return id
      ? root.find(user => user.id === id)
      : root.find(user => user.name === name)
  }
}
```

Export GraphQL parts of the read model from the `graphql` folder root.

```js
// ./common/read-models/graphql/index.js

import collections from './collections'
import resolvers from './resolvers'
import schema from './schema'

export { collections, resolvers, schema }
```

Update the `read-models` folder export.

```js
// ./common/read-models/index.js

import { collections, schema, resolvers } from './graphql'

export default [
  {
    name: 'graphql',
    projection: collections,
    gqlSchema: schema,
    gqlResolvers: resolvers
  }
]
```

### Authentication

We can create users and get a list of users.
The last server-side issue is implementing registration and authentication.

Install the necessary packages.

```bash
npm install --save body-parser jsonwebtoken uuid
```

Implement the `getUserByName` util function that uses the `executeQuery` function passed with the express request.

```js
// ./server/extendExpress.js

const getUserByName = async (executeQuery, name) => {
  const { user } = await executeQuery(
    `query ($name: String!) {
      user(name: $name) {
        id,
        name,
        createdAt
      }
    }`,
    { name: name.trim() }
  )

  return user
}
```

Add the list of necessary server parameters.

```js
// ./server/constants.js

export const authorizationSecret = 'auth-secret'
export const cookieName = 'authorizationToken'
export const cookieMaxAge = 1000 * 60 * 60 * 24 * 365
```

Generate a token using the [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) library and pass it to request cookies.

```js
// ./server/extendExpress.js

import jwt from 'jsonwebtoken'

import { authorizationSecret, cookieName, cookieMaxAge } from './constants'

// getUserByName implementation

const authorize = (req, res, user) => {
  try {
    const authorizationToken = jwt.sign(user, authorizationSecret)
    res.cookie(cookieName, authorizationToken, {
      maxAge: cookieMaxAge
    })

    res.redirect(req.query.redirect || '/')
  } catch (error) {
    res.redirect('/error?text=Unauthorized')
  }
}
```

Implement the `/register` route in the `extendExpress` function using util functions.
This function is passed to `resolve.server.config.js` later:

```js
// ./server/extendExpress.js

import jwt from 'jsonwebtoken'
import bodyParser from 'body-parser'
import uuid from 'uuid'

import { authorizationSecret, cookieMaxAge, cookieName } from './constants'

// getUserByName and authorize implementation

export default express => {
  express.post(
    '/register',
    bodyParser.urlencoded({ extended: false }),
    async (req, res) => {
      const executeQuery = req.resolve.readModelExecutors.graphql

      const existingUser = await getUserByName(
        executeQuery,
        req.body.name
      )

      if (existingUser) {
        res.redirect('/error?text=User already exists')
        return
      }

      try {
        const user = {
          name: req.body.name.trim(),
          id: uuid.v4()
        }

        await req.resolve.executeCommand({
          type: 'createUser',
          aggregateId: user.id,
          aggregateName: 'user',
          payload: user
        })

        return authorize(req, res, user)
      } catch (error) {
        res.redirect(`/error?text=${error.toString()}`)
      }
    }
  )
}
```

The reSolve library's `readModelExecutors` object and `executeCommand` function are accessible from each request.

Add the `/login` route to allow registered users to log in.

```js
// ./server/extendExpress.js

// imports, getUserByName and authorize implementation

export default express => {
  // Here should be registration implementation

  express.post(
    '/login',
    bodyParser.urlencoded({ extended: false }),
    async (req, res) => {
      const executeQuery = req.resolve.readModelExecutors.graphql
      
      const user = await getUserByName(
	    executeQuery,
	    req.body.name
	  )

      if (!user) {
        res.redirect('/error?text=No such user')
        return
      }

      return authorize(req, res, user)
    }
  )
}
```

Add authentication middleware to have an authenticated user through all routes.

```js
// ./server/extendExpress.js

// imports, getUserByName and authorize implementation

const authorizationMiddleware = (req, res, next) => {
  req.getJwt((_, user) => {
    if (user) {
      req.body.userId = user.id
    }
    next()
  })
}

export default express => {
  express.use('/', authorizationMiddleware)

  // Here should be registration implementation
  // and here should be login implementation
}
```

Add the `initialState` function to pass a user to the client side.

```js
// ./server/initialState.js

import jwt from 'jsonwebtoken'

import { authorizationSecret, cookieName } from './constants'

export const getCurrentUser = async (executeQuery, cookies) => {
  try {
    const { id } = jwt.verify(cookies[cookieName], authorizationSecret)

    if (!id) {
      return null
    }

    const { user } = await executeQuery(
      `query ($id: ID!) {
        user(id: $id) {
          id,
          name,
          createdAt
        }
      }`,
      { id }
    )

    return user
  } catch (error) {
    return null
  }
}

export default async ({ graphql: executeQuery }, { cookies }) => {
  const user = await getCurrentUser(executeQuery, cookies)

  return {
    user: user || {}
  }
}
```

Pass the express extension and `initialState` function to the server config.

```js
// ./resolve.server.config.js

import path from 'path'
import fileDriver from 'resolve-storage-lite'
import busDriver from 'resolve-bus-memory'

import aggregates from './common/aggregates'
import clientConfig from './resolve.client.config'
import extendExpress from './server/extendExpress'
import initialState from './server/initialState'

import {
  collections as gqlCollections,
  schema as gqlSchema,
  resolvers as gqlResolvers
} from './common/read-models/graphql'

if (module.hot) {
  module.hot.accept()
}

const { NODE_ENV = 'development' } = process.env
const dbPath = path.join(__dirname, `${NODE_ENV}.db`)

export default {
  entries: clientConfig,
  bus: { driver: busDriver },
  storage: {
    driver: fileDriver,
    params: { pathToFile: dbPath }
  },
  initialState,
  aggregates,
  initialSubscribedEvents: { types: [], ids: [] },
  readModels: [{
    name: 'graphql',
    projection: gqlCollections,
    gqlSchema,
    gqlResolvers
  }],
  extendExpress
}
```

Now we have a server side that works with users: a user can be registered and authenticated.

## Adding Stories

A story is news or question a user posts.
In Hacker News, stories are displayed on the following pages:
* Newest - the newest stories
* Ask - users’ questions (Ask HNs)
* Show - users’ news (Show HNs)

A story can have the following fields:
* id - a unique ID
* title - the story's title
* link - a link to the original news or external website
* text - the story's content
* createdAt - the story's creation timestamp
* createdBy - the story's author

### Stories View

Implement a component rendering a list of stories.

Install packages:
* url - to parse URL
* plur - to pluralize words
* react-timeago - to display elapsed time
* sanitizer - to sanitize story content markup

```bash
npm i --save url plur react-timeago sanitizer
```

Add the [Pagination]((./client/components/Pagination.js)) component.

Then add the [Story](./client/containers/Story.js) container.
In this file, comment the `redux` and actions import.
Also comment the `mapDispatchToProps` function and temporarily delete it from the `connect` function arguments.

Create [common constants](./common/constants.js).

Implement the [Stories](./client/components/Stories.js) component for displaying stories.

Implement specific story containers such as [NewestByPage](./client/containers/NewestByPage.js), [AskByPage](./client/containers/AskByPage.js) and [ShowByPage](./client/containers/ShowByPage.js).
In each file, delete the `commentCount` field from `query`.

In the `client/reducers/` directory, create [UI](./client/reducers/ui.js) and [user](./client/reducers/user.js) reducers.
Add them to the [root reducer export](./client/reducers/index.js).

Add created containers to [routes](./client/routes.js) with the `/newest/:page?`, `/show/:page?` and `/ask/:page?` paths.

### Story View

Implement the [StoryDetails](./client/containers/StoryDetails.js) container to display a story by id with additional information.
Delete the actions import and `mapDispatchToProps`.
`ChildrenComments` is implemented later, so delete its import and usage in JSX.

Add the created container to [routes](./client/routes.js) with the `/storyDetails/:storyId` path.

### Submit View

Implement the [Submit](./client/containers/Submit.js) container to add new stories.
Temporarily delete actions import and `mapDispatchToProps`.

Add the created container to [routes](./client/routes.js) with the `/submit` path.

### Write Side

Add the story aggregate and the `createStory` command for creating a story.
The command should validate input data and check whether the aggregate exists.
Add the `storyCreated` handler for this purpose.
In the original Hacker News, users can upvote and unvote stories.
This can be accomplished by adding the corresponding commands to the story aggregate.

```js
// ./common/aggregates/validation.js

export default {
  stateExists: (state, type) => {
    if (!state || Object.keys(state).length === 0) {
      throw new Error(`${type} does not exist`)
    }
  },

  // stateIsAbsent and fieldRequired implementation

  userNotVoted: (state, userId) => {
    if (state.voted.includes(userId)) {
      throw new Error('User already voted')
    }
  },

  userVoted: (state, userId) => {
    if (!state.voted.includes(userId)) {
      throw new Error('User did not vote')
    }
  }
}
```

Update event list by adding story event names.

```js
// ./common/events.js

export const STORY_CREATED = 'StoryCreated'
export const STORY_UPVOTED = 'StoryUpvoted'
export const STORY_UNVOTED = 'StoryUnvoted'

export const USER_CREATED = 'UserCreated'
```

```js
// ./common/aggregates/story.js

// @flow
import {
  STORY_CREATED,
  STORY_UPVOTED,
  STORY_UNVOTED
} from '../events'

import validate from './validation'

export default {
  name: 'story',
  initialState: {},
  commands: {
    createStory: (state: any, command: any) => {
      validate.stateIsAbsent(state, 'Story')

      const { title, link, userId, text } = command.payload

      validate.fieldRequired(command.payload, 'userId')
      validate.fieldRequired(command.payload, 'title')

      const payload: StoryCreatedPayload = { title, text, link, userId }
      return { type: STORY_CREATED, payload }
    },

    upvoteStory: (state: any, command: any) => {
      validate.stateExists(state, 'Story')

      const { userId } = command.payload

      validate.fieldRequired(command.payload, 'userId')
      validate.userNotVoted(state, userId)

      const payload: StoryUpvotedPayload = { userId }
      return { type: STORY_UPVOTED, payload }
    },

    unvoteStory: (state: any, command: any) => {
      validate.stateExists(state, 'Story')

      const { userId } = command.payload

      validate.fieldRequired(command.payload, 'userId')
      validate.userVoted(state, userId)

      const payload: StoryUnvotedPayload = { userId }
      return { type: STORY_UNVOTED, payload }
    }
  },
  projection: {
    [STORY_CREATED]: (
      state,
      { timestamp, payload: { userId } }: StoryCreated
    ) => ({
      ...state,
      createdAt: timestamp,
      createdBy: userId,
      voted: [],
      comments: {}
    }),

    [STORY_UPVOTED]: (state, { payload: { userId } }: StoryUpvoted) => ({
      ...state,
      voted: state.voted.concat(userId)
    }),

    [STORY_UNVOTED]: (state, { payload: { userId } }: StoryUnvoted) => ({
      ...state,
      voted: state.voted.filter(curUserId => curUserId !== userId)
    })
  }
}
```

Modify the `aggregates` default export.

```js
// ./common/aggregates/index.js

import user from './user'
import story from './story'

export default [user, story]
```

Add all the event names to the server config.

```js
// import list
import * as events from './common/events'

// module hot acceptions and store initialization

const eventTypes = Object.keys(events).map(key => events[key])

export default {
    // other options
    initialSubscribedEvents: { types: eventTypes, ids: [] }
}
```

### Read Side

Implement a read side.
It should store the list of stories.

```js
// ./common/read-models/graphql/collections/stories.js

// @flow
import {
  STORY_CREATED,
  STORY_UPVOTED,
  STORY_UNVOTED
} from '../../../events'

type UserId = string

type Story = {
  id: string,
  type: 'ask' | 'show' | 'story',
  title: string,
  text: string,
  link: string,
  votes: Array<UserId>,
  createdAt: number,
  createdBy: UserId
}

type StoriesState = Array<Story>

export default {
  name: 'stories',
  initialState: [],
  projection: {
    [STORY_CREATED]: (
      state: StoriesState,
      event: StoryCreated
    ): StoriesState => {
      const {
        aggregateId,
        timestamp,
        payload: { title, link, userId, text }
      } = event

      const type = !link ? 'ask' : /^(Show HN)/.test(title) ? 'show' : 'story'

      state.push({
        id: aggregateId,
        type,
        title,
        text,
        link,
        votes: [],
        createdAt: timestamp,
        createdBy: userId
      })

      return state
    },

    [STORY_UPVOTED]: (
      state: StoriesState,
      event: StoryUpvoted
    ): StoriesState => {
      const { aggregateId, payload: { userId } } = event

      const index = state.findIndex(({ id }) => id === aggregateId)

      if (index < 0) {
        return state
      }

      state[index].votes.push(userId)
      return state
    },

    [STORY_UNVOTED]: (
      state: StoriesState,
      event: StoryUnvoted
    ): StoriesState => {
      const { aggregateId, payload: { userId } } = event

      const index = state.findIndex(({ id }) => id === aggregateId)

      if (index < 0) {
        return state
      }

      state[index].votes = state[index].votes.filter(id => id !== userId)
      return state
    }
  }
}
```

Modify the collections export.

```js
// ./common/read-models/graphql/collections

import users from './users'
import stories from './stories'

export default [users, stories]
```

### GraphQL

The Hacker News application displays a list of stories without extra information for each one, and provides story details when a user opens the story.
For this, support the GraphQL with GraphQL resolvers that works with read model collections.

Add the `./common/read-models/gqlSchema.js` file.
Describe the `Story` type and two queries to request a list of stories and a single story - the `stories` and `story` queries.

```js
// ./common/read-models/graphql/schema.js

export default `
  type User {
    id: ID!
    name: String
    createdAt: String
  }
  type Story {
    id: ID!
    type: String!
    title: String!
    link: String
    text: String
    votes: [String]
    createdAt: String!
    createdBy: String!
    createdByName: String!
  }
  type Query {
    user(id: ID, name: String): User
    stories(page: Int!, type: String): [Story]
    story(id: ID!): Story
  }
`
```

Add the appropriate resolves.

```js
// ./common/read-models/graphql/resolves.js

import { NUMBER_OF_ITEMS_PER_PAGE } from '../../constants'

async function withUserNames(items, getReadModel) {
  const users = await getReadModel('users')

  return items.map(item => {
    const user = users.find(user => user.id === item.createdBy)

    return {
      ...item,
      createdByName: user ? user.name : 'unknown'
    }
  })
}

export default {
  // user implementation

  stories: async (read, { page, type }) => {
    const root = await read('stories')
  
    const filteredStories = type
      ? root.filter(story => story.type === type)
      : root
  
    const stories = filteredStories
      .slice(
        filteredStories.length - (+page * NUMBER_OF_ITEMS_PER_PAGE + 1),
        filteredStories.length - (+page - 1) * NUMBER_OF_ITEMS_PER_PAGE
      )
      .reverse()
  
    return withUserNames(stories, read)
  },
  story: async (read, { id }) => {
    const root = await read('stories')
  
    let story = root.find(s => s.id === id)
  
    if (!story) {
      return null
    }
    story = (await withUserNames([story], read))[0]
    story.comments = await withUserNames(story.comments, read)
    return story
  }
}
```

### Linking Client and Server Sides

The `resolve-redux` package contains functions allowing you to create client side actions from aggregates.

Implement [stories actions](./client/actions/storiesActions.js).

Import these actions in the [Story](./client/containers/Story.js), [StoryDetails](./client/containers/StoryDetails.js) and [Submit](./client/containers/Submit.js) containers.

Implement [UI actions](./client/actions/uiActions.js) and import them in the [App](./client/containers/App.js) container.

## Adding Comments

Extend the application logic to allow users to comment.
Comment is a short message written about news or question.
So, a comment relates to a story.
Implement also comments which reply to other comments.

A comment has the following fields:
* id - a unique ID
* parentId - the parent comment's id, or the story's id if it is a root comment
* storyId - the story's id
* text - the comment's content
* replies - a list of replies
* createdAt - the story's creation timestamp
* createdBy - the comment's author

### Story View Extension

Add the [Comment](./client/components/Comment.js) component to display comment information.

Add the [ReplyLink](./client/components/ReplyLink.js) component to implement the 'reply' link.

Add the [ChildrenComments](./client/components/ChildrenComments.js) component for building a comments tree.

A comment depends on a story, so you need to extend the existing [StoryDetails](./client/containers/StoryDetails.js) container.
Add a comments tree with text area for new comment creation.

Extend GraphQL query with the `comments` field.

### Comments View

Implement the [CommentsByPage](./client/containers/CommentsByPage.js) container to display the list of the latest comments.

Implement the [CommentsById](./client/containers/CommentById.js) container to display the selected comment with replies.

Add the created containers to [routes](./client/routes.js) with the `/comments/:page?` and `/storyDetails/:storyId/comments/:commentId` paths.

### Write Side

Add a comment event to the [events](./common/events.js) file.

```js
// ./common/events.js

export const STORY_CREATED = 'StoryCreated'
export const STORY_UPVOTED = 'StoryUpvoted'
export const STORY_UNVOTED = 'StoryUnvoted'
export const COMMENT_CREATED = 'CommentCreated'

export const USER_CREATED = 'UserCreated'
```

Extend [validation](./common/aggregates/validation.js) for commands.

```js
// ./common/aggregates/validation.js

export default {
  // other validation functions

  commentNotExists: (state, commentId) => {
    if (state.comments[commentId]) {
      throw new Error('Comment already exists')
    }
  }
}
```

We can use the existing story aggregate without creating a particular aggregate for a comment, as it depends on a story.
You should validate all input fields and check whether an aggregate exists.

```js
// ./common/aggregates/story.js

// @flow
import {
  STORY_CREATED,
  STORY_UPVOTED,
  STORY_UNVOTED,
  COMMENT_CREATED
} from '../events'

import validate from './validation'

export default {
  name: 'story',
  initialState: {},
  commands: {
    // the createStory,  upvoteStory and unvoteStory implementation

    createComment: (state: any, command: any) => {
      validate.stateExists(state, 'Story')

      const { commentId, parentId, userId, text } = command.payload

      validate.fieldRequired(command.payload, 'userId')
      validate.fieldRequired(command.payload, 'parentId')
      validate.fieldRequired(command.payload, 'text')
      validate.commentNotExists(state, commentId)

      const payload: CommentCreatedPayload = {
        commentId,
        parentId,
        userId,
        text
      }
      return { type: COMMENT_CREATED, payload }
    }
  },
  projection: {
    // the STORY_CREATED, STORY_UPVOTED and STORY_UNVOTED implementation
    [COMMENT_CREATED]: (
      state,
      { timestamp, payload: { commentId, userId } }: CommentCreated
    ) => ({
      ...state,
      comments: {
        ...state.comments,
        [commentId]: {
          createdAt: timestamp,
          createdBy: userId
        }
      }
    })
  }
}
```

### Read Side

Despite there is a single aggregate for comment and story, provide different collections for GraphQL implementation and add an independent `comments` read model.

```js
// ./common/read-model/graphql/collections/comments.js

// @flow
import { COMMENT_CREATED } from '../../../events'

type Comment = {
  id: string,
  text: string,
  parentId: string,
  storyId: string,
  createdAt: number,
  createdBy: string
}

type CommentsState = Array<Comment>

export default {
  name: 'comments',
  initialState: [],
  projection: {
    [COMMENT_CREATED]: (state: CommentsState, event: CommentCreated) => {
      const {
        aggregateId,
        timestamp,
        payload: { parentId, userId, commentId, text }
      } = event

      state.push({
        id: commentId,
        text,
        parentId: parentId,
        storyId: aggregateId,
        createdAt: timestamp,
        createdBy: userId
      })
      return state
    }
  }
}
```

Add the implemented read side to the list of collections.

```js
// ./common/read-models/graphql/collections/index.js

import users from './users'
import stories from './stories'
import comments from './comments'

export default [users, stories, comments]
```

Update the `stories` read side.

```js
// ./common/read-models/graphql/collections/stories.js

// @flow
import {
  STORY_CREATED,
  STORY_UPVOTED,
  STORY_UNVOTED,
  COMMENT_CREATED
} from '../../../events'

type UserId = string

type Comment = {
  id: string,
  parentId: string,
  level: number,
  text: string,
  createdAt: number,
  createdBy: UserId
}

type Story = {
  id: string,
  type: 'ask' | 'show' | 'story',
  title: string,
  text: string,
  link: string,
  commentCount: number,
  votes: Array<UserId>,
  comments: Array<Comment>,
  createdAt: number,
  createdBy: UserId
}

type StoriesState = Array<Story>

export default {
  name: 'stories',
  initialState: [],
  projection: {
    [STORY_CREATED]: (
      state: StoriesState,
      event: StoryCreated
    ): StoriesState => {
      const {
        aggregateId,
        timestamp,
        payload: { title, link, userId, text }
      } = event

      const type = !link ? 'ask' : /^(Show HN)/.test(title) ? 'show' : 'story'

      state.push({
        id: aggregateId,
        type,
        title,
        text,
        link,
        commentCount: 0,
        comments: [],
        votes: [],
        createdAt: timestamp,
        createdBy: userId
      })
      return state
    },

    [STORY_UPVOTED]: (
      state: StoriesState,
      event: StoryUpvoted
    ): StoriesState => {
      const { aggregateId, payload: { userId } } = event

      const index = state.findIndex(({ id }) => id === aggregateId)

      if (index < 0) {
        return state
      }

      state[index].votes.push(userId)
      return state
    },

    [STORY_UNVOTED]: (
      state: StoriesState,
      event: StoryUnvoted
    ): StoriesState => {
      const { aggregateId, payload: { userId } } = event

      const index = state.findIndex(({ id }) => id === aggregateId)

      if (index < 0) {
        return state
      }

      state[index].votes = state[index].votes.filter(id => id !== userId)
      return state
    },

    [COMMENT_CREATED]: (
      state: StoriesState,
      event: CommentCreated
    ): StoriesState => {
      const {
        aggregateId,
        timestamp,
        payload: { parentId, userId, commentId, text }
      } = event

      const story = state.find(({ id }) => id === aggregateId)

      if (!story) {
        return state
      }

      story.commentCount++

      const parentIndex =
        parentId === aggregateId
          ? -1
          : story.comments.findIndex(({ id }) => id === parentId)

      const level =
        parentIndex === -1 ? 0 : story.comments[parentIndex].level + 1

      const comment = {
        id: commentId,
        parentId,
        level,
        text,
        createdAt: timestamp,
        createdBy: userId
      }

      if (parentIndex === -1) {
        story.comments.push(comment)
      } else {
        story.comments = story.comments
          .slice(0, parentIndex + 1)
          .concat(comment, story.comments.slice(parentIndex + 1))
      }

      return state
    }
  }
}
```

### GraphQL

Extend the GraphQL schema file by adding the `Comment` type and queries.
A comment contains the `replies` field which is a list of comments.
It provides a tree-like structure for all the included comments.

You need to also add a comments array to the `Story` type.

```js
// ./common/read-models/graphql/schema.js

export default `
  type Story {
    id: ID!
    type: String!
    title: String!
    link: String
    text: String
    commentCount: Int!
    comments: [Comment]
    votes: [String]
    createdAt: String!
    createdBy: String!
    createdByName: String!
  }
  type Comment {
    id: ID!
    parentId: ID!
    storyId: ID!
    text: String!
    replies: [Comment]
    createdAt: String!
    createdBy: String!
    createdByName: String
    level: Int
  }
  type User {
    id: ID!
    name: String
    createdAt: String
  }
  type Query {
    comments(page: Int!): [Comment]
    comment(id: ID!): Comment
    stories(page: Int!, type: String): [Story]
    story(id: ID!): Story
    user(id: ID, name: String): User
  }
`
```

Implement comment resolves.
Extend the stories resolver to get comments.

```js
// ./common/read-models/graphql/resolvers.js

// import list

function getReplies(comments, commentIndex) {
  const result = []
  const commentsCount = comments.length
  let replyIndex = commentIndex + 1

  while (replyIndex < commentsCount) {
    result.push(comments[replyIndex])
    replyIndex++
  }

  return result
}

export default {
  // implemented resolvers

  story: async (read, { id }) => {
    const root = await read('stories')
  
    let story = root.find(s => s.id === id)
  
    if (!story) {
      return null
    }
    story = (await withUserNames([story], read))[0]
    story.comments = await withUserNames(story.comments, read)
    return story
  },
  comment: async (read, { id }) => {
    const root = await read('comments')
  
    const commentIndex = root.findIndex(c => c.id === id)
  
    if (commentIndex === -1) {
      return null
    }
  
    const comment = root[commentIndex]
    const [resultComment] = await withUserNames([comment], read)
    const replies = getReplies(root, commentIndex)
  
    return {
      ...resultComment,
      replies: await withUserNames(replies, read)
    }
  },
  comments: async (read, { page }) => {
    const root = await read('comments')
  
    const comments = root.slice(
      +page * NUMBER_OF_ITEMS_PER_PAGE - NUMBER_OF_ITEMS_PER_PAGE,
      +page * NUMBER_OF_ITEMS_PER_PAGE + 1
    )
    return withUserNames(comments, read)
  }
}
```

## Data Importer

Implement an importer in the [import](./import) folder to get data from the real Hacker News website.
This importer uses the website's REST API, and transforms data to events.
