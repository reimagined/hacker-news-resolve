// @flow
export type StoresReadModel = Immutable<
  Array<{
    id: string,
    type: string,
    title: string,
    text: string,
    link: string,
    commentCount: number,
    votes: Array<String>,
    createdAt: number,
    createdBy: string
  }>
>
