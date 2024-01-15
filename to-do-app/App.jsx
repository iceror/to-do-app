import { useEffect, useState } from "react";
import { Tasks } from "./Components/Tasks";
import { getTask, getTasks, postTask } from "./utils";

export const App = () => {
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [currentTitle, setCurrentTitle] = useState('');
  const [showInput, setShowInput] = useState(false);

  const fetchTasks = async () => {
    setTasks(await getTasks())
  }
  // console.log(tasks);

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
        <button onClick={() => setShowInput(!showInput)}>Add</button>
        {showInput ?
          <form action="">
            <input type="text" onChange={handleChange} onKeyDown={handleSaveTask} />
          </form>
          : null}
        <Tasks tasks={tasks} fetchTask={fetchTask} currentTitle={currentTitle} />
      </main>
    </>
  )
}