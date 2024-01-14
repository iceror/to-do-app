import { useEffect, useState } from "react";
import { getTask, patchTask } from "../utils";

export const Tasks = ({ tasks }) => {
  // const [checked, setChecked] = useState(tasks.forEach(() => {false}));
  const [checkedTasks, setCheckedTasks] = useState({})

  const handleChange = async (taskId) => {
    // change state in db from pending to completed
    const task = await getTask(taskId);
    console.log(task);
    let newStatus = task.status === 'pending' ? 'completed' : 'pending';
    console.log(newStatus);
    await patchTask(taskId, newStatus);

    setCheckedTasks((prevCheckedTasks) => ({
      ...prevCheckedTasks,
      [taskId]: newStatus === 'completed',
    }));
  } 

  useEffect(() => {
    // Set the initial checked state based on tasks
    const initialCheckedState = tasks.reduce((acc, task) => {
      return { ...acc, [task.id]: task.status === 'completed' };
    }, {});
    setCheckedTasks(initialCheckedState);
  }, [tasks]);



  return (
    <>
      <ul>
        {tasks.map((task) =>
          <li key={task.id}>
            {/* <Checkbox checked={checked} onChange={() => handleChange(event, task.id)} inputProps={{ 'aria-label': 'uncontrolled' }} value={checked}/> */}
            <input type="checkbox" id={`custom-checkbox-${task.id}`} onClick={() => handleChange(task.id)} checked={checkedTasks[task.id] || false}/>
            <textarea name="" id="" cols="30" rows="1" value={task.title}></textarea>
          </li>
        )}
      </ul>
    </>
  )
}