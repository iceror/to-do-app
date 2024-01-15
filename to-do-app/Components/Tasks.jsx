import { useEffect, useState } from "react";
import { deleteTask, editTask, getTask, patchTask } from "../utils";

export const Tasks = ({ tasks, fetchTasks, currentTitle, handleEdit, handleDelete, handleRetrieve }) => {
  // const [checked, setChecked] = useState(tasks.forEach(() => {false}));
  const [checkedTasks, setCheckedTasks] = useState({});
  const [newTitle, setNewTitle] = useState('');
  const [taskEdits, setTaskEdits] = useState({});

  const handleChecked = async (taskId) => {
    // change state in db from pending to completed
    const task = await getTask(taskId);
    // console.log(task);
    let newStatus = task.status === 'pending' ? 'completed' : 'pending';
    // let newStatus;
    // if (task.status === 'pending') {
    //   newStatus = 'completed'
    // }
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

  useEffect(() => {
    const initialEditState = tasks.reduce((acc, task) => {
      return { ...acc, [task.id]: task.title };
    }, {});
    setTaskEdits(initialEditState);
  }, [tasks]);

  const handleChange = async (taskId, event) => {
    let newTitle = event.target.value
    await editTask(newTitle, taskId)
    // setNewTitle(event.target.value);
    setTaskEdits((prevTaskEdits) => ({
      ...prevTaskEdits,
      [taskId]: newTitle,
    }));
  }

  return (
    <>
      <ul>
        {tasks.map((task) =>
          <li key={task.id}>
            {/* <Checkbox checked={checked} onChange={() => handleChecked(event, task.id)} inputProps={{ 'aria-label': 'uncontrolled' }} value={checked}/> */}
            <input type="checkbox" id={`custom-checkbox-${task.id}`} onChange={() => handleChecked(task.id)} checked={checkedTasks[task.id] || false} />
            <input name="" id="" cols="30" rows="1" defaultValue={taskEdits[task.id] || ''} onChange={(event) => handleChange(task.id, event)} ></input>
            {/* onKeyDown={() => handleEdit(event, newTitle, task.id ) */}
            {task.status === 'deleted' ?
              <button onClick={() => handleRetrieve(task.id)}>Retrieve</button> :
              <button onClick={() => handleDelete(task.id)}>Delete</button>
            }
          </li>
        )}
      </ul>
    </>
  )
}