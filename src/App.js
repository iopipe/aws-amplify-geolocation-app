import React, {useState, useEffect} from 'react';
import { API, graphqlOperation} from 'aws-amplify';
import logo from './logo.svg';
import './App.css';

import { getHackerNewsPosts, getTrendingGithubRepos } from './graphql/queries'

import { BrowserRouter as Router, Route, Link } from "react-router-dom";


function Home() {
  return (
    <div>
      <h2>Home</h2>
    </div>
  );
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
  const todoList = function getTodos() {
    // API.graphql(graphqlOperation(getTrendingGithubRepos))
    //   .then(result => {
    //     console.log("Results Below")
    //     console.log(result);
    //     return result

    //   })
    //   .catch(error => {
    //     console.log("ERROR: " + JSON.stringify(error, null, 4));
    //   })
  }
  return (
    <div>
      <p>My Todo List</p>
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
