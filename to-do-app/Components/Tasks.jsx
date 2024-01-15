import { useEffect, useState } from "react";
import { deleteTask, editTask, getTask, patchTask } from "../utils";
import { Button, ButtonGroup, Checkbox, FormControlLabel, TextField } from "@mui/material";

export const Tasks = ({ tasks, fetchTasks, handleEdit, handleDelete, handleRetrieve, handlePermanentlyDelete }) => {
  const [checkedTasks, setCheckedTasks] = useState({});
  const [taskEdits, setTaskEdits] = useState({});
  const [newTitle, setNewTitle] = useState('');
  const [editId, setEditId] = useState(1)

  const handleChecked = async (taskId) => {
    // change state in db from pending to completed
    const task = await getTask(taskId);
    let newStatus = task.status === 'pending' ? 'completed' : 'pending';
    await patchTask(taskId, newStatus);
    fetchTasks();
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
    // let newTitle = event.target.value;
    setNewTitle(event.target.value);
    setEditId(taskId);
    setTaskEdits((prevTaskEdits) => ({
      ...prevTaskEdits,
      [taskId]: newTitle,
    }));
  }

  useEffect(() => {
    const getData = setTimeout(async () => {
      await editTask(newTitle, editId);
      console.log('edited task');
    }, 1000)

    return () => clearTimeout(getData)
  }, [newTitle, editId])

  return (
    <>
      <ul style={{ listStyle: 'none' }}>
        {tasks.map((task) =>
          <li key={task.id} style={{ marginBottom: '1rem' }}>
            {/* <Checkbox checked={checked} onChange={() => handleChecked(event, task.id)} inputProps={{ 'aria-label': 'uncontrolled' }} value={checked}/> */}
            <FormControlLabel control={<Checkbox />} id={`custom-checkbox-${task.id}`} onChange={() => handleChecked(task.id)} checked={checkedTasks[task.id] || false} ></FormControlLabel>
            {/* <input type="checkbox" id={`custom-checkbox-${task.id}`} onChange={() => handleChecked(task.id)} checked={checkedTasks[task.id] || false} /> */}
            {/* <input variant="outlined" name="" id="" cols="30" rows="1" defaultValue={taskEdits[task.id] || ''} onChange={(event) => handleChange(task.id, event)} /> */}
            <TextField
              id="outlined-helperText"
              // label={taskEdits[task.id] || ''} 
              size='small'
              // fullWidth
              style={{
                width: '500px'
              }}
              multiline
              maxRows={4}
              defaultValue={task.title}
              onChange={(event) => handleChange(task.id, event)}
            />
            {task.status === 'deleted' ?
              <ButtonGroup style={{ marginLeft: '1rem' }}>
                <Button variant='contained' onClick={() => handleRetrieve(task.id)} >Retrieve</Button>
                <Button variant='contained' onClick={() => handlePermanentlyDelete(task.id)} >Delete</Button>
              </ButtonGroup>
              :
              <Button variant='contained' onClick={() => handleDelete(task.id)} style={{ marginLeft: '1rem' }}>Delete</Button>
            }
          </li>
        )}
      </ul>
    </>
  )
}