const functions = require('firebase-functions');

const cors =require('cors');
const app = require('express') ()


app.use(cors());

const { getAllTodos, postOneTodo } = require('./api/todos');
const { loginUser } = require('./api/users');


app.get('/todos', getAllTodos);
app.post('/todos', postOneTodo);

app.post('/login', loginUser);

exports.api = functions.https.onRequest(app);