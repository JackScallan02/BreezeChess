const express = require('express');
const app = express();
const port = 9001;

app.get('/', (req, res) => {
  res.send('Hello from the backend server!');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
