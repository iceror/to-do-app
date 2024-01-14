import { useEffect, useState } from "react";
import { Tasks } from "./Components/Tasks";
import { getTasks } from "./utils";

export const App = () => {
  const [tasks, setTasks] = useState([]);
  const fetchTasks = async () => {
    setTasks(await getTasks())
  }
  console.log(tasks);

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <>
      <header>
        <h1>To-do App</h1>
      </header>
      <main>
        <Tasks tasks={tasks} />
      </main>
    </>
  )
}