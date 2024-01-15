import { useEffect, useState } from "react";
import { deleteTask, getTask, patchTask } from "../utils";

export const Tasks = ({ tasks, fetchTasks, currentTitle, handleDelete, handleRetrieve }) => {
  // const [checked, setChecked] = useState(tasks.forEach(() => {false}));
  const [checkedTasks, setCheckedTasks] = useState({});
  const [newTitle, setNewTitle] = useState('');

  const handleChecked = async (taskId) => {
    // change state in db from pending to completed
    const task = await getTask(taskId);
    // console.log(task);
    let newStatus = task.status === 'pending' ? 'completed' : 'pending';
    // console.log(newStatus);
    await patchTask(taskId, newStatus);

    setCheckedTasks((prevCheckedTasks) => ({
      ...prevCheckedTasks,
      [taskId]: newStatus === 'completed',
    }));
  }

  useEffect(() => {
    const initialCheckedState = tasks.reduce((acc, task) => {
      return { ...acc, [task.id]: task.status === 'completed' };
    }, {});
    setCheckedTasks(initialCheckedState);
  }, [tasks]);

  const handleChange = async (event, id) => {
    setNewTitle(event.target.value);
  } 


  return (
    <>
      <ul>
        {tasks.map((task) =>
          <li key={task.id}>
            {/* <Checkbox checked={checked} onChange={() => handleChecked(event, task.id)} inputProps={{ 'aria-label': 'uncontrolled' }} value={checked}/> */}
            <input type="checkbox" id={`custom-checkbox-${task.id}`} onChange={() => handleChecked(task.id)} checked={checkedTasks[task.id] || false} />
            <textarea name="" id="" cols="30" rows="1" value={task.title ?? currentTitle} onChange={(event) => handleChange(event, task.id)}></textarea>
            {task.status === 'deleted' ?
              <button onClick={() => handleRetrieve(task.id)}>Retrieve</button> :
              <button onClick={() => handleDelete(task.id)}>X</button> 
            }
          </li>
        )}
      </ul>
    </>
  )
}