'use strict';
const express = require('express');
let todos = [
  { id: 1, title: 'Name', completed: false },
  { id: 2, title: 'Draft', completed: true }
];
const app = express();
app.use(express.json());

app.get('/api/todos', (req, res) => {
  if (!req.query.completed) {
    return res.json(todos);
  }
  const completed = req.query.completed === 'true';
  res.json(todos.filter(todo => todo.completed === completed));
});

let id = 2;
app.post('/api/todos', (req, res, next) => {
  const { title } = req.body;
  if (typeof title !== 'string' || !title) {
    const err = new Error('title is required');
    err.statusCode = 400;
    return next(err);
  }
  const todo = { id: id += 1, title, completed: false };
  todos.push(todo)
    res.status(201).json(todo);
  });

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({ error: err.message }); 
});

app.listen(3000);

const next = require('next');
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
nextApp.prepare().then(
  () => app.get('*', nextApp.getRequestHandler()),
  err => {
    console.error(err)
    process.exit(1)
  }
 );