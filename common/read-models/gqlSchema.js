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
  }
  type StoryDetails {
    id: ID!
    type: String
    title: String
    text: String
    link: String
    comments: [Comment]
    votes: [String]
    createdAt: String
    createdBy: String
    createdByName: String
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
    user(id: ID!): User
  }
`
