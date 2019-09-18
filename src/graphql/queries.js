/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getHackerNewsPosts = `query GetHackerNewsPosts {
  getHackerNewsPosts {
    id
    title
    url
    by
  }
}
`;
export const getTrendingGithubRepos = `query GetTrendingGithubRepos {
  getTrendingGithubRepos {
    author
    name
    url
    stars
    language
    forks
    currentPeriodStars
  }
}
`;
export const getTodoList = `query GetTodoList {
  getTodoList {
    title
    post
  }
}
`;
export const getTodos = `query GetTodos($id: ID!) {
  getTodos(id: $id) {
    title
    post
  }
}
`;
export const listTodoss = `query ListTodoss(
  $filter: ModelTodosFilterInput
  $limit: Int
  $nextToken: String
) {
  listTodoss(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      title
      post
    }
    nextToken
  }
}
`;
