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

export const patchTask = (id, status) => {
  let data = JSON.stringify({
    "status": status
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