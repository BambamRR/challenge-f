const express = require("express");
const app = express();
require("dotenv").config();
const PORT = 3000 || process.env.PORT;

const conn = require("./src/database/conn");

const routes = require("./src/routes/index");

app.use(express.json({
  type: ['application/json', 'application/json-patch+json']
}));

app.use("/api/v1", routes);

app.get("/health-check", (req, res) => {
  res.json({ message: "API is running with success" });
});

conn
  .sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.log("Error to connect server", error);
  });
