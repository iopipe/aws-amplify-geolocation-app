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

class HackerNews extends React.Component {
  constructor(props) {
    super(props);
    this.posts = [];
    this.state = {
      loading: true
    }
  }

  componentDidMount() {
    this.getPosts();
  }

  async getPosts() {
    await API.graphql(graphqlOperation(getHackerNewsPosts))
    .then(res => {
      this.posts = res.data.getHackerNewsPosts;
      this.setState({ loading: true });
    });
  };

  render() {
    return (
      <div>
        <h1>HACKER NEWS</h1>
        {this.posts.map(post => {
          const { title, url } = post;
          return (
            <div key={title}>
              <h2>{title}</h2>
              <a href={url}>view live</a>
            </div>
          )
        })}
      </div>
    )
  }
}

class GithubRepos extends React.Component {
  constructor(props) {
    super(props)
    this.repos = []
    this.state = {
      loading: true
    }
  }

  componentDidMount() {
    this.getRepos()
  }

  async getRepos() {
    await API.graphql(graphqlOperation(getTrendingGithubRepos))
    .then(res => {
      this.repos = res.data.getTrendingGithubRepos;
      this.setState({ loading: true });
    })  
  }

  render() {
    return (
      <div>
        <h1>Trending GitHub Repos</h1>
        {this.repos.map(repo => {
          return(
            <div key={repo.name}>
                <a href={repo.url}>{repo.author}/{repo.name}</a>
            </div>
          )
        })}
      </div>
    );
  }
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
            <ul id="menu">
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

            <Route exact path="/" component={Home} />
            <Route path="/hackerNews" component={HackerNews} />
            <Route path="/todos" component={MyTodoList} />
            <Route path="/trending-github-repos" component={GithubRepos} />
          </div>
        </Router>
      </header>
      <div id="content">
      </div>
    </div>
  );

}

export default App;
