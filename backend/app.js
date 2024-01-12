const express = require('express');
const fs = require('fs').promises;
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('App listening in port: ', PORT);
})

