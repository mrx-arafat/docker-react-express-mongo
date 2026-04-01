const express = require("express");
const serverResponses = require("../utils/helpers/responses");
const messages = require("../config/messages");
const { Todo } = require("../models/todos/todo");

const routes = (app) => {
  const router = express.Router();

  router.post("/todos", (req, res) => {
    const todo = new Todo({
      text: req.body.text,
    });

    todo
      .save()
      .then((result) => {
        serverResponses.sendSuccess(res, messages.SUCCESSFUL, result);
      })
      .catch((e) => {
        serverResponses.sendError(res, messages.BAD_REQUEST, e);
      });
  });

  router.get("/", (req, res) => {
    Todo.find({}, { __v: 0 })
      .then((todos) => {
        serverResponses.sendSuccess(res, messages.SUCCESSFUL, todos);
      })
      .catch((e) => {
        serverResponses.sendError(res, messages.BAD_REQUEST, e);
      });
  });

  router.delete("/todos/:id", (req, res) => {
    Todo.findByIdAndDelete(req.params.id)
      .then((todo) => {
        if (!todo) {
          return serverResponses.sendError(res, messages.NOT_FOUND);
        }
        serverResponses.sendSuccess(res, messages.SUCCESSFUL_DELETE, todo);
      })
      .catch((e) => {
        serverResponses.sendError(res, messages.BAD_REQUEST, e);
      });
  });

  router.put("/todos/:id", (req, res) => {
    Todo.findByIdAndUpdate(
      req.params.id,
      { text: req.body.text },
      { new: true, runValidators: true }
    )
      .then((todo) => {
        if (!todo) {
          return serverResponses.sendError(res, messages.NOT_FOUND);
        }
        serverResponses.sendSuccess(res, messages.SUCCESSFUL_UPDATE, todo);
      })
      .catch((e) => {
        serverResponses.sendError(res, messages.BAD_REQUEST, e);
      });
  });

  //it's a prefix before api it is useful when you have many modules and you want to
  //differentiate b/w each module you can use this technique
  app.use("/api", router);
};
module.exports = routes;
