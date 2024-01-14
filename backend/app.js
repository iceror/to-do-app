const express = require('express');
const fs = require('fs').promises;
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('App listening in port: ', PORT);
})

async function readJsonFile() {
  try {
    const data = await fs.readFile('db.json', 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(error);
    throw new Error('Error reading JSON file');
  }
}

app.get('/tasks', async (request, response) => {
  try {
    const notes = await readJsonFile();
    response.json(notes);
  } catch (error) {
    console.error(error);
    response.status(500).send('Internal Server Error');
  }
});

app.get('/tasks/:id', async (request, response) => {
  try {
    const tasks = await readJsonFile();
    const id = parseInt(request.params.id);
    const task = tasks.find(task => task.id === id);
    if (task) {
      response.json(task);
    } else {
      response.status(404).send('Task not found');
    }
  } catch (error) {
    console.error(error);
    response.status(500).send('Internal Server Error');
  }
});

app.post('/tasks', async (request, response) => {
  console.log(request.body);
  // create one note 
  // default status will be 'pending' 
  try {
    const tasks = await readJsonFile();
    const newTask = {
      'title': request.body.title,
      'status': 'pending',
      'id': tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1
    };
    tasks.push(newTask);
    await fs.writeFile('db.json', JSON.stringify(tasks, null, 2), 'utf8');
    response.json(newTask);

  } catch (error) {
    console.error(error);
    response.status(500).send('Internal Server Error');
  }
});

app.patch('/tasks/:id', async (request, response) => {
  try {
    const tasks = await readJsonFile();
    const id = parseInt(request.params.id);
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex !== -1) {
      console.log(tasks[taskIndex]);
      tasks[taskIndex] = {
        ...tasks[taskIndex],
        'title': request.body.title || tasks[taskIndex].title,
        'status': request.body.status || tasks[taskIndex].status
      };
      await fs.writeFile('db.json', JSON.stringify(tasks, null, 2), 'utf8');
      response.json(tasks[taskIndex]);
    } else {
      response.status(404).send('Task not found')
    }
  } catch (error) {
    console.log(error);
    response.status(500).send('Internal Server Error');
  }
});