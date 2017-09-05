import React from "react";
import Stories from "./Stories";
import subscribe from "../decorators/subscribe";

const ShowByPage = ({ match }) => (
  <Stories page={match.params.page} type="show" />
);

export default subscribe(({ match }) => ({
  graphQL: [
    {
      readModel: "stories",
      query:
        'query ($page: Int!) { stories(page: $page, type: "show") { id, type, title, text, userId, createDate, link, comments, commentsCount, voted } }',
      variables: {
        page: match.params.page || "1"
      }
    }
  ]
}))(ShowByPage);
