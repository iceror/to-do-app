import { useEffect, useState } from "react";
import { Tasks } from "./Components/Tasks";
import { getTask, getTasks, postTask, deleteTask, patchTask } from "./utils";
import { Button, ButtonGroup } from "@mui/material";

export const App = () => {
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [currentTitle, setCurrentTitle] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [showDeletedTasks, setShowDeletedTasks] = useState(false);
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);

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

  const handleDelete = async (taskId) => {
    const deletedTask = await deleteTask(taskId);
    fetchTasks();
    console.log(deletedTask);
  }

  const handleRetrieve = async (id) => {
    const task = await getTask(id);
    let status = task.status === 'deleted' ? 'pending' : task.status;
    let retrievedTask = await patchTask(id, status);
    fetchTasks();
  }

  return (
    <>
      <header>
        <h1>To-do App</h1>
      </header>
      <main>

        <ButtonGroup variant="contained" aria-label="outlined primary button group">
          <Button variant="contained" onClick={() => { setShowCompletedTasks(false); setShowDeletedTasks(false) }}>Pending tasks</Button>
          <Button variant="contained" onClick={() => { setShowCompletedTasks(true); setShowDeletedTasks(false) }}>Completed tasks</Button>
          <Button variant="contained" onClick={() => setShowDeletedTasks(true)}>Deleted tasks</Button>
        </ButtonGroup>

        <Button variant='contained' onClick={() => setShowInput(!showInput)}>Add</Button>
        {showInput ?
          <form action="">
            <input type="text" onChange={handleChange} onKeyDown={handleSaveTask} />
          </form>
          : null}
        <Tasks tasks={
          !showDeletedTasks
            ? showCompletedTasks
              ? tasks.filter((task) => task.status === 'completed')
              : tasks.filter((task) => task.status === 'pending')
            : tasks.filter((task) => task.status === 'deleted')
        }
          fetchTask={fetchTask} currentTitle={currentTitle} handleDelete={handleDelete} handleRetrieve={handleRetrieve} />
      </main>
    </>
  )
}