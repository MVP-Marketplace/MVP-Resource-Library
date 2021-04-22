const {db} = require('../utils/admin');

exports.getAllTodos = async (req, res) => {
    try {
      const data = await db
        .collection('todos')
        .orderBy('createdAt', 'desc')
        .get();
      let todos = [];
      data.forEach((doc) => {
        todos.push({
          todoId: doc.id,
          title: doc.data().title,
          description: doc.data().description,
          createdAt: doc.data().createdAt
        });
      });
      return res.json(todos);
    } catch (error) {
      console.log(error);
    }
  };

  exports.postOneTodo = (req, res) => {
    if (req.body.description.trim() === '') {
      return res.status(400).json({ description: 'Must not be empty' });
    }
  
    if (req.body.title.trim() === '') {
      return res.status(400).json({ title: 'Must not be empty' });
    }
  
    const newTodoItem = {
      title: req.body.title,
      body: req.body.description,
      createdAt: new Date().toISOString()
    };
    db.collection('todos')
      .add(newTodoItem)
      .then((doc) => {
        const responseTodoItem = newTodoItem;
        responseTodoItem.id = doc.id;
        return res.json(responseTodoItem);
      })
      .catch((err) => {
        res.status(500).json({ error: 'Something went wrong' });
        console.error(err);
      });
  };