import axios from 'axios';

export const getTasks = () => {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'http://localhost:3000/tasks',
    headers: {}
  };

  return axios.request(config)
    .then((response) => {
      // console.log(JSON.stringify(response.data));
      return response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

export const getTask = (id) => {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `http://localhost:3000/tasks/${id}`,
    headers: { }
  };
  
  return axios.request(config)
  .then((response) => {
    // console.log(JSON.stringify(response.data));
    return response.data;
  })
  .catch((error) => {
    console.log(error);
  });
}

export const postTask = (taskTitle) => {
  let data = JSON.stringify({
    "title": taskTitle,
    "status": 'pending'
  });
  
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'http://localhost:3000/tasks',
    headers: { 
      'Content-Type': 'application/json'
    },
    data : data
  };
  
  return axios.request(config)
  .then((response) => {
    console.log(JSON.stringify(response.data));
    return response.data;
  })
  .catch((error) => {
    console.log(error);
  });
  
}

export const patchTask = (id, status) => {
  console.log(status);
  let completedAt = status === 'completed' ? new Date() : null;
  let data = JSON.stringify({
    "status": status,
    "markedAsCompletedIn": completedAt
  });
  
  let config = {
    method: 'patch',
    maxBodyLength: Infinity,
    url: `http://localhost:3000/tasks/${id}`,
    headers: { 
      'Content-Type': 'application/json'
    },
    data : data
  };
  
  return axios.request(config)
  .then((response) => {
    // console.log(JSON.stringify(response.data));
    return response.data;
  })
  .catch((error) => {
    console.log(error);
  });
}

export const deleteTask = (id) => {
  let data = JSON.stringify({
    "status": "deleted"
  });
  
  let config = {
    method: 'patch',
    maxBodyLength: Infinity,
    url: `http://localhost:3000/tasks/${id}`,
    headers: { 
      'Content-Type': 'application/json'
    },
    data : data
  };
  
  return axios.request(config)
  .then((response) => {
    // console.log(JSON.stringify(response.data));
    return response.data;
  })
  .catch((error) => {
    console.log(error);
  });
}

export const editTask = (newTitle, id) => {
  let data = JSON.stringify({
    "title": newTitle
  });
  
  let config = {
    method: 'patch',
    maxBodyLength: Infinity,
    url: `http://localhost:3000/tasks/${id}`,
    headers: { 
      'Content-Type': 'application/json'
    },
    data : data
  };
  
  return axios.request(config)
  .then((response) => {
    console.log(JSON.stringify(response.data));
    return response.data
  })
  .catch((error) => {
    console.log(error);
  });
}

export const permanentlyDeleteTask = (id) =>{
  let config = {
    method: 'delete',
    maxBodyLength: Infinity,
    url: `http://localhost:3000/tasks/${id}`,
    headers: { }
  };
  
  return axios.request(config)
  .then((response) => {
    console.log(JSON.stringify(response.data));
    return response.data;
  })
  .catch((error) => {
    console.log(error);
  });
}