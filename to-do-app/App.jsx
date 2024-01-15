import { useEffect, useState } from "react";
import { Tasks } from "./Components/Tasks";
import { getTask, getTasks, postTask } from "./utils";
import { Button } from "@mui/material";

export const App = () => {
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [currentTitle, setCurrentTitle] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [showDeletedTasks, setShowDeletedTasks] = useState(false);

  const fetchTasks = async () => {
    setTasks(await getTasks());
    // !showDeletedTasks ? setTasks(fetchedTasks.filter((task) => task.status === 'pending' || task.status === 'completed')) : setTasks(fetchedTasks.filter((task) => task.status === 'deleted'));
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTask = async (taskId) => {
    const task = await getTask(taskId);
    setCurrentTitle(task.title);
  }

  const handleChange = (event) => {
    setTaskTitle(event.target.value);
  }

  const handleSaveTask = async (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      await postTask(taskTitle);
      fetchTasks();
      setShowInput(false);
      setTaskTitle('');
    }
  }

  return (
    <>
      <header>
        <h1>To-do App</h1>
      </header>
      <main>
        <Button variant='contained' onClick={() => setShowInput(!showInput)}>Add</Button>
        {showDeletedTasks === false ?
          <Button variant="contained" onClick={() => setShowDeletedTasks(true)}>Deleted tasks</Button> :
          <Button variant="contained" onClick={() => setShowDeletedTasks(false)}>Pending tasks</Button>
        }
        {showInput ?
          <form action="">
            <input type="text" onChange={handleChange} onKeyDown={handleSaveTask} />
          </form>
          : null}
        <Tasks tasks={!showDeletedTasks ? tasks.filter((task) => task.status === 'pending' || task.status === 'completed') : tasks.filter((task) => task.status === 'deleted')}
          fetchTask={fetchTask} currentTitle={currentTitle} />
      </main>
    </>
  )
}