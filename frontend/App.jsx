import { useEffect, useState } from "react";
import { Tasks } from "./Components/Tasks";
import { getTask, getTasks, postTask, deleteTask, patchTask, editTask, permanentlyDeleteTask } from "./utils";
import { Button, ButtonGroup, TextField, Typography } from "@mui/material";
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    header: {
      fontFamily: 'Poppins',
      fontWeight: 500
    },
    inputs: {
      fontFamily: 'Poppins',
      fontWeightnt: 300
    }
  },
  palette: {
    primary: {
      main: '#0097a7',
      light: '#33abb8',
      dark: '#006974'
    }
  }
})


export const App = () => {
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [currentTitle, setCurrentTitle] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [showDeletedTasks, setShowDeletedTasks] = useState(false);
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);

  const fetchTasks = async () => {
    setTasks(await getTasks());
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTask = async (taskId) => {
    const task = await getTask(taskId);
    setCurrentTitle(task.title);
  }

  const handleTitle = (event) => {
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

  const handleEdit = async (event, newTitle, id) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      await editTask(newTitle, id);
      fetchTasks();
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

  const handlePermanentlyDelete = async (id) => {
    await permanentlyDeleteTask(id);
    fetchTasks();
  }

  return (
    <>
      <ThemeProvider theme={theme}>

        <header>
          <Typography><h1 variant={'header'}
            style={{
              height: '6rem',
              margin: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#006974',
              color: 'white'
            }}>To-do List</h1></Typography>
        </header>

        <main style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>

          <ButtonGroup variant="contained" aria-label="outlined primary button group" style={{ margin: '1rem' }}>
            <Button variant="contained" onClick={() => { setShowCompletedTasks(false); setShowDeletedTasks(false) }}>Pending tasks</Button>
            <Button variant="contained" onClick={() => { setShowCompletedTasks(true); setShowDeletedTasks(false) }}>Completed tasks</Button>
            <Button variant="contained" onClick={() => setShowDeletedTasks(true)}>Deleted tasks</Button>
          </ButtonGroup>

          <section style={{
            display: 'flex',
          }}>
            <Button variant='contained' onClick={() => setShowInput(!showInput)} style={{ marginRight: '1rem' }}>Add</Button>
            {showInput ?
              <form action="">
                <TextField variant='outlined' type="text" size="small" onChange={handleTitle} onKeyDown={handleSaveTask} />
              </form>
              : null}
          </section>

          <Tasks tasks={
            !showDeletedTasks
              ? showCompletedTasks
                ? tasks.filter((task) => task.status === 'completed')
                : tasks.filter((task) => task.status === 'pending')
              : tasks.filter((task) => task.status === 'deleted')
          }
            fetchTasks={fetchTasks} currentTitle={currentTitle} handleDelete={handleDelete} handleRetrieve={handleRetrieve} handleEdit={handleEdit} handlePermanentlyDelete={handlePermanentlyDelete} />
        </main>
      </ThemeProvider>
    </>
  )
}