import React, {useState, useEffect, useReducer} from 'react';
import { API, graphqlOperation} from 'aws-amplify';
import logo from './logo.svg';
import './App.css';

import { getHackerNewsPosts, getTrendingGithubRepos, listTodoss } from './graphql/queries'
import { createTodos } from './graphql/mutations'
import { onCreateTodos } from './graphql/subscriptions'

import { BrowserRouter as Router, Route, Link } from "react-router-dom";


function Home() {
  return (
    <div>
      <h2>Home</h2>
    </div>
  );
}

const initialState = {todos:[]};
const reducer = (state, action) =>{
  switch(action.type){
    case 'QUERY':
      return {...state, todos:action.todos}
    case 'SUBSCRIPTION':
      return {...state, todos:[...state.todos, action.todo]}
    default:
      return state
  }
}

function HackerNews({ match }) {
  console.log("Trying to get HN posts")
  const posts = function getPosts() {
    API.graphql(graphqlOperation(getHackerNewsPosts))
      .then(result => {
        console.log("Results Below")
        console.log(result);
        return result

      })
      .catch(error => {
        console.log("ERROR: " + JSON.stringify(error, null, 4));
      })
  }
  return (
    <div>
      <h1>HEY IT"S HACKER NEWS</h1>
      <p>My content: {posts() ? posts() : "Nothing yet"}</p>
      <h3>{match.params.topicId}</h3>

    </div>
  );
}

function GithubRepos({ match }) {
  console.log("Trying to get github repos")
  const repos = function getRepos() {
    API.graphql(graphqlOperation(getTrendingGithubRepos))
      .then(result => {
        console.log("Results Below")
        console.log(result);
        return result

      })
      .catch(error => {
        console.log("ERROR: " + JSON.stringify(error, null, 4));
      })
  }
  return (
    <div>
      <h1>Trending GitHub Repos</h1>
      <p>My content: {repos() ? repos() : "Nothing yet"}</p>
      <h3>{match.params.topicId}</h3>

    </div>
  );
}

function MyTodoList({ match }) {
  console.log("Trying to get my todo list")
  // Create a new Note according to the columns we defined earlier
  const [state, dispatch] = useReducer(reducer, initialState)
  useEffect(() => {
    getData()
    const subscription = API.graphql(graphqlOperation(onCreateTodos)).subscribe({
      next: (eventData) => {
        const todo = eventData.value.data.onCreateTodo;
        dispatch({type:'SUBSCRIPTION', todo})
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  async function createNewTodo() {
    const todo = { title: "Use AppSync" , post: "Realtime and Offline"}
    try {
      var resp = await API.graphql(graphqlOperation(createTodos, { input: todo }))
      console.log(resp)

    } catch(err) {console.log(err)}
     
  }

  async function getData() {
    try {
      var todoData = await API.graphql(graphqlOperation(listTodoss))
      console.log(todoData)
    } catch(err) {console.log(err)}
    dispatch({type:'QUERY', todos: todoData.data.listTodoss.items});
  }

  return (
    <div>
      <div className="App">
        <button onClick={createNewTodo}>Add Todo</button>
      </div>
      <p>My Todo List</p>
      <div>{ state.todos.map((todo, i) => <p key={todo.id}>{todo.title} : {todo.post}</p>) }</div>
      <form>
        <label>
          Name:
          <input type="text" name="name" />
        </label>
         <label>
          Details:
          <input type="text" name="post" />
        </label>

        <input type="submit" value="Submit" />
      </form>

    </div>
  );
}
function App() {

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Router>
          <div>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/hackerNews">Hacker News</Link>
              </li>
              <li>
                <Link to="/trending-github-repos">Trending GitHub Repos</Link>
              </li>
              <li>
                <Link to="/todos">My Todo List</Link>
              </li>

            </ul>

            <hr />

            <Route exact path="/" component={Home} />
            <Route path="/hackerNews" component={HackerNews} />
            <Route path="/todos" component={MyTodoList} />
            <Route path="/trending-github-repos" component={GithubRepos} />
          </div>
        </Router>
      </header>
      <div id="content">
        <h4>This is some content: </h4>

      </div>
    </div>
  );

}

export default App;
