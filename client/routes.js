import App from "./containers/App";
import NewestByPage from "./containers/NewestByPage";
import ShowByPage from "./containers/ShowByPage";
import AskByPage from "./containers/AskByPage";
import CommentsByPage from "./containers/CommentsByPage";
import CommentById from "./containers/CommentById";
import Submit from "./containers/Submit";
import Login from "./components/Login";

import UserById from "./containers/UserById";
import ChangePassword from "./containers/ChangePassword";
import Error from "./components/Error";
import StoryDetails from "./containers/StoryDetails";
import Reply from "./containers/Reply";

const routes = [
  {
    path: "/",
    component: App,
    routes: [
      {
        path: "/",
        redirectTo: "/newest/1",
        exact: true
      },
      {
        path: "/newest/:page?",
        component: NewestByPage
      },
      {
        path: "/show/:page?",
        component: ShowByPage
      },
      {
        path: "/ask/:page?",
        component: AskByPage
      },
      {
        path: "/comments/:page?",
        component: CommentsByPage
      },
      {
        path: "/comment/:id",
        component: CommentById
      },
      {
        path: "/submit",
        component: Submit
      },
      {
        path: "/login",
        component: Login
      },
      {
        path: "/user/:id",
        component: UserById
      },
      {
        path: "/changepw",
        component: ChangePassword
      },
      {
        path: "/error",
        component: Error
      },
      {
        path: "/storyDetails/:id",
        component: StoryDetails
      },
      {
        path: "/reply/:id",
        component: Reply
      }
    ]
  }
];

export default routes;
