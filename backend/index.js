const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

const { connected } = require('./db');
const { route } = require('./routes/route');


app.use('/users', route);
app.use('/posts', route);

app.listen(PORT, async() => {
    await connected
  console.log(`Server is running on port ${PORT}`);
});
