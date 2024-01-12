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