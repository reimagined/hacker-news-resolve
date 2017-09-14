import App from './containers/App'
import NewestByPage from './containers/NewestByPage'
import ShowByPage from './containers/ShowByPage'
import AskByPage from './containers/AskByPage'
import CommentsByPage from './containers/CommentsByPage'
import CommentById from './containers/CommentById'
import Submit from './containers/Submit'
import Login from './components/Login'

import UserById from './containers/UserById'
import Error from './components/Error'
import StoryDetails from './containers/StoryDetails'
import ReplyById from './containers/ReplyById'

const routes = [
  {
    path: '/',
    component: App,
    routes: [
      {
        path: '/',
        redirectTo: '/newest/',
        exact: true
      },
      {
        path: '/newest/:page?',
        component: NewestByPage
      },
      {
        path: '/show/:page?',
        component: ShowByPage
      },
      {
        path: '/ask/:page?',
        component: AskByPage
      },
      {
        path: '/comments/:page?',
        component: CommentsByPage
      },
      {
        path: '/storyDetails/:storyId/comments/:commentId/reply',
        component: ReplyById
      },
      {
        path: '/storyDetails/:storyId/comments/:commentId',
        component: CommentById
      },
      {
        path: '/submit',
        component: Submit
      },
      {
        path: '/login',
        component: Login
      },
      {
        path: '/user/:userId',
        component: UserById
      },
      {
        path: '/error',
        component: Error
      },
      {
        path: '/storyDetails/:storyId',
        component: StoryDetails
      }
    ]
  }
]

export default routes
