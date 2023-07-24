import express from "express";
import cors from "cors";
import crypto from "crypto";

const app = express();

app.use(cors());
app.use(express.json());

let todos = [];

// Empty Text Validation Middleware
const emptyTextValidation = (req, res, next) => {
  const propsInRequestBody = Object.keys(req.body);

  if (propsInRequestBody.includes("text")) {
    const { text } = req.body;
    if (!text || text.trim().length === 0) {
      return res.status(400).send("Todo text cannot be empty");
    }
  }

  next();
};

const duplicateTextValidation = (req, res, next) => {
  const { text } = req.body;

  const duplicateTodo = todos.find((todo) => {
    if (text == todo.text) return todo;
  });

  if (duplicateTodo) {
    return res.status(400).send("A similar todo already exists");
  }

  next();
};

app.post("/todos", emptyTextValidation, duplicateTextValidation, (req, res) => {
  const text = req.body.text;

  const newTodo = {
    id: crypto.randomUUID(),
    text: text,
    completed: false,
    date: "",
  };

  todos.push(newTodo);
  res.send(todos);
});

app.delete("/todos/:id", (req, res) => {
  const todoID = req.params.id;
  const filteredTodos = todos.filter((todo) => todoID != todo.id);

  todos = filteredTodos;
  res.send(filteredTodos);
});

app.put(
  "/todos/:id",
  emptyTextValidation,
  duplicateTextValidation,
  (req, res) => {
    const todoID = req.params.id;
    const text = req.body.text;
    const date = req.body.date;
    const completed = req.body.completed;
    console.log(completed);

    const updatedTodos = todos.map((todo) => {
      if (todo.id == todoID) {
        if (text) {
          todo.text = text;
        }

        if (completed) {
          if (todo.completed == false) {
            todo.completed = true;
          } else {
            todo.completed = !completed;
          }
        }

        if (date) {
          todo.date = date;
        }
      }

      return todo;
    });

    todos = updatedTodos;

    res.send(todos);
  }
);

app.get("/todos/:id", (req, res) => {
  const todoID = req.params.id;
  const filteredTodo = todos.filter((todo) => todoID == todo.id);

  todos = filteredTodo;

  res.send(filteredTodo);
});

app.get("/todos", (req, res) => {
  res.send(todos);
});

app.listen(3000, () => {
  console.log("server started at port 3000");
});
