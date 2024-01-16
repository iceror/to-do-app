import * as React from 'react';
import { useEffect, useState } from "react";
import { deleteTask, editTask, getTask, patchTask } from "../utils";
import { Button, ButtonGroup, Checkbox, FormControlLabel, TextField } from "@mui/material";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SubdirectoryArrowLeftRoundedIcon from '@mui/icons-material/SubdirectoryArrowLeftRounded';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

export const Tasks = ({ tasks, fetchTasks, handleEdit, handleDelete, handleRetrieve, handlePermanentlyDelete }) => {
  const [checkedTasks, setCheckedTasks] = useState({});
  const [taskEdits, setTaskEdits] = useState({});
  const [newTitle, setNewTitle] = useState('');
  const [editId, setEditId] = useState(1);
  const [open, setOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

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
      // console.log('edited task');
    }, 1000)

    return () => clearTimeout(getData)
  }, [newTitle, editId]);

  // Style functions
  const handleSnackbar = (message) => {
    setOpen(true);
    setSnackbarMessage(message)
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <>
      <ul style={{ listStyle: 'none' }}>
        {tasks.map((task) =>
          <li key={task.id} style={{
            marginBottom: '1rem',
            borderBottom: 'solid 2px #168E9B',
            // borderRadius: '.8rem',
            padding: '.5rem 1.5rem'
          }}>
            <FormControlLabel control={<Checkbox onClick={() => handleSnackbar('Task completed!')}/>} id={`custom-checkbox-${task.id}`} onChange={() => handleChecked(task.id)} checked={checkedTasks[task.id] || false} ></FormControlLabel>
            <input
              style={{
                width: '500px',
                border: 'none',
                fontSize: '1rem',
                outline: 'none',
                height: '1.5rem',
                padding: '.5rem',
                fontFamily: 'Poppins',
                fontWeight: '300'
              }}
              multiline='true'
              // maxRows={4}
              defaultValue={task.title}
              onChange={(event) => handleChange(task.id, event)}
            />
            {task.status === 'deleted' ?
              <ButtonGroup aria-label="text button group" style={{ marginLeft: '1rem' }}>
                <SubdirectoryArrowLeftRoundedIcon style={{color: '#23B51C', cursor: 'pointer', marginRight: '10px'}} onClick={() => {handleRetrieve(task.id); handleSnackbar('Task retrieved')}} ></SubdirectoryArrowLeftRoundedIcon>
                <DeleteForeverIcon onClick={() =>{ handlePermanentlyDelete(task.id); handleSnackbar('Task permanently deleted')}} style={{color: '#E70606', cursor: 'pointer'}}></DeleteForeverIcon>
              </ButtonGroup>
              :
              <DeleteOutlineIcon  onClick={() => {handleDelete(task.id); handleSnackbar('Task deleted')}} style={{ marginLeft: '1rem', color:'#F16B11', cursor: 'pointer' }}></DeleteOutlineIcon>
            }
          </li>
        )}
      </ul>
      <Snackbar open={open}
        autoHideDuration={5000}
        onClose={handleClose}
        message={snackbarMessage}
        action={action}/>
    </>
  )
}