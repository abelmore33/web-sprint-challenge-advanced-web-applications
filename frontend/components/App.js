import React, { useState } from "react";
import { NavLink, Routes, Route, useNavigate } from "react-router-dom";
import Articles from "./Articles";
import LoginForm from "./LoginForm";
import Message from "./Message";
import ArticleForm from "./ArticleForm";
import Spinner from "./Spinner";
import axios from "axios";

const articlesUrl = "http://localhost:9000/api/articles";
const loginUrl = "http://localhost:9000/api/login";

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState("");
  const [articles, setArticles] = useState([]);
  const [currentArticleId, setCurrentArticleId] = useState();
  const [spinnerOn, setSpinnerOn] = useState(false);

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate();
  const redirectToLogin = () => {
    /* ✨ implement */
    navigate("/");
  };
  const redirectToArticles = () => {
    /* ✨ implement */
    navigate("/articles");
  };

  const logout = () => {
    // ✨ implement
    // If a token is in local storage it should be removed,
    localStorage.clear("token");
    // and a message saying "Goodbye!" should be set in its proper state.
    setMessage("GoodBye!");
    // In any case, we should redirect the browser back to the login screen,
    redirectToLogin();
    // using the helper above.
  };

  const login = ({ username, password }) => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    setMessage;
    setSpinnerOn(true);
    // and launch a request to the proper endpoint.
    axios
      .post("http://localhost:9000/api/login", {
        username: username,
        password: password,
      })
      .then((res) => {
        setSpinnerOn(false);
        localStorage.setItem("token", res.data.token);
        setMessage(res.data.message);
        redirectToArticles();
      })
      .catch((err) => console.log(err));
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!
  };

  const getArticles = () => {
    // ✨ implement
    // We should flush the message state, turn on the spinner

    setSpinnerOn(true);
    // and launch an authenticated request to the proper endpoint.
    const token = localStorage.getItem("token");

    axios
      .create({ headers: { authorization: token } })
      .get("http://localhost:9000/api/articles")
      .then((res) => {
        console.log(res.data);
        setArticles(res.data.articles);

        setMessage(res.data.message);

        setSpinnerOn(false);
      })
      .catch((err) => redirectToLogin());
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!
  };

  const postArticle = (article) => {
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
    const token = localStorage.getItem("token");
    setSpinnerOn(true);
    axios
      .create({
        headers: {
          authorization: token,
        },
      })
      .post("http://localhost:9000/api/articles", article)
      .then((res) => {
        [...articles, article];
        setMessage(res.data.message);
        setSpinnerOn(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const updateArticle = ({ article_id, article }) => {
    // ✨ implement
    // You got this!
    const token = localStorage.getItem("token");
    axios
      .create({
        headers: {
          authorization: token,
        },
      })
      .put(`http://localhost:9000/api/articles/${article_id}`, article)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  const deleteArticle = (article_id) => {
    // ✨ implement
    setSpinnerOn(true);

    const token = localStorage.getItem("token");
    axios
      .create({
        headers: {
          authorization: token,
        },
      })
      .delete(`http://localhost:9000/api/articles/${article_id}`)
      .then((res) => {
        setArticles(articles.filter((art) => article_id !== art.article_id));
        setMessage(res.data.message);
        setSpinnerOn(false);
      })
      .catch((err) => console.log(err));
  };

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn} />
      <Message message={message} />
      <button id="logout" onClick={logout}>
        Logout from app
      </button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}>
        {" "}
        {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">
            Login
          </NavLink>
          <NavLink id="articlesScreen" to="/articles">
            Articles
          </NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} />} />
          <Route
            path="articles"
            element={
              <>
                <ArticleForm
                  postArticle={postArticle}
                  updateArticle={updateArticle}
                  setCurrentArticleId={setCurrentArticleId}
                  articles={articles}
                  currentArticleId={currentArticleId}
                />
                <Articles
                  articles={articles}
                  getArticles={getArticles}
                  deleteArticle={deleteArticle}
                  setCurrentArticleId={setCurrentArticleId}
                  currentArticleId={currentArticleId}
                />
              </>
            }
          />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  );
}
