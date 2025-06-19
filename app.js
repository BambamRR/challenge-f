const express = require("express");
const app = express();
require("dotenv").config();
const PORT = 3000 || process.env.PORT;

const routes = require('./src/routes/index')

app.use(express.json());

app.use('/api/v1',routes)

app.get('/health-check', (req, res) => {
  res.json({ message: 'API is running with success' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
