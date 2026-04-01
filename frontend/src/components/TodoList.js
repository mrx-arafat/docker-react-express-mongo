import React from "react";

export default class TodoList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeIndex: 0,
      editingId: null,
      editText: "",
      removingId: null,
    };
  }

  handleActive(index) {
    this.setState({
      activeIndex: index,
    });
  }

  handleStartEdit(todo) {
    this.setState({
      editingId: todo._id,
      editText: todo.text,
    });
  }

  handleCancelEdit() {
    this.setState({
      editingId: null,
      editText: "",
    });
  }

  handleSaveEdit(id) {
    if (this.state.editText.trim().length > 0) {
      this.props.handleEditTodo(id, this.state.editText.trim());
    }
    this.setState({
      editingId: null,
      editText: "",
    });
  }

  handleEditChange(e) {
    this.setState({ editText: e.target.value });
  }

  handleDelete(id) {
    this.setState({ removingId: id });
    setTimeout(() => {
      this.props.handleDeleteTodo(id);
      this.setState({ removingId: null });
    }, 300);
  }

  renderTodos(todos) {
    return (
      <ul className="todo-list">
        {todos.map((todo, i) => {
          const isEditing = this.state.editingId === todo._id;
          const isRemoving = this.state.removingId === todo._id;

          return (
            <li
              className={
                "todo-item" +
                (i === this.state.activeIndex ? " active" : "") +
                (isRemoving ? " todo-exit" : " todo-enter")
              }
              key={todo._id || i}
              onClick={() => this.handleActive(i)}
            >
              {isEditing ? (
                <div className="todo-edit">
                  <input
                    type="text"
                    className="form-control"
                    value={this.state.editText}
                    onChange={(e) => this.handleEditChange(e)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") this.handleSaveEdit(todo._id);
                      if (e.key === "Escape") this.handleCancelEdit();
                    }}
                    autoFocus
                  />
                  <button
                    className="btn-icon btn-save"
                    onClick={(e) => {
                      e.stopPropagation();
                      this.handleSaveEdit(todo._id);
                    }}
                    title="Save"
                  >
                    &#10003;
                  </button>
                  <button
                    className="btn-icon btn-cancel"
                    onClick={(e) => {
                      e.stopPropagation();
                      this.handleCancelEdit();
                    }}
                    title="Cancel"
                  >
                    &#10005;
                  </button>
                </div>
              ) : (
                <div className="todo-display">
                  <span className="todo-text">{todo.text}</span>
                  <div className="todo-actions">
                    <button
                      className="btn-icon btn-edit"
                      onClick={(e) => {
                        e.stopPropagation();
                        this.handleStartEdit(todo);
                      }}
                      title="Edit"
                    >
                      &#9998;
                    </button>
                    <button
                      className="btn-icon btn-delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        this.handleDelete(todo._id);
                      }}
                      title="Delete"
                    >
                      &#128465;
                    </button>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    );
  }

  render() {
    let { todos } = this.props;
    return todos.length > 0 ? (
      this.renderTodos(todos)
    ) : (
      <div className="alert alert-primary" role="alert">
        No Todos yet — add one above!
      </div>
    );
  }
}
