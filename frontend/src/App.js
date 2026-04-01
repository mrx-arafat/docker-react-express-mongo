import React from "react";
import axios from "axios";
import "./App.scss";
import AddTodo from "./components/AddTodo";
import TodoList from "./components/TodoList";

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      todos: [],
    };

    this.api_dom = 'https://mahfuz-api.devjam.party';
  }

  componentDidMount() {
    axios
      .get(this.api_dom + "/api")
      .then((response) => {
        this.setState({
          todos: response.data.data,
        });
      })
      .catch((e) => console.log("Error : ", e));
  }

  handleAddTodo = (value) => {
    axios
      .post(this.api_dom + "/api/todos", { text: value })
      .then((response) => {
        this.setState({
          todos: [...this.state.todos, response.data.data],
        });
      })
      .catch((e) => console.log("Error : ", e));
  };

  handleDeleteTodo = (id) => {
    axios
      .delete(this.api_dom + "/api/todos/" + id)
      .then(() => {
        this.setState({
          todos: this.state.todos.filter((todo) => todo._id !== id),
        });
      })
      .catch((e) => console.log("Error : ", e));
  };

  handleEditTodo = (id, newText) => {
    axios
      .put(this.api_dom + "/api/todos/" + id, { text: newText })
      .then((response) => {
        this.setState({
          todos: this.state.todos.map((todo) =>
            todo._id === id ? response.data.data : todo
          ),
        });
      })
      .catch((e) => console.log("Error : ", e));
  };

  render() {
    return (
      <div className="App container">
        <div className="app-header">
          <h1 className="app-title">✨ Task Master</h1>
          <p className="app-subtitle">Organize your day with style</p>
        </div>
        <div className="container-fluid">
          <div className="row">
            <div className="col-xs-12 col-sm-8 col-md-8 offset-md-2">
              <div className="todo-app">
                <div className="app-stats">
                  <span className="stat-badge">{this.state.todos.length} Tasks</span>
                </div>
                <AddTodo handleAddTodo={this.handleAddTodo} />
                <TodoList
                  todos={this.state.todos}
                  handleDeleteTodo={this.handleDeleteTodo}
                  handleEditTodo={this.handleEditTodo}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
