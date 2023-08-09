// const app = require('./app')

// app.listen(3000, () => {
//   console.log("Server running. Use our API on port: 3000")
// })

import mongoose from "mongoose";
import  "dotenv/config";
import app from "./app.js";

const { DB_HOST, PORT } = process.env;

mongoose.connect(DB_HOST)
  .then(() => {
    app.listen(PORT, () => {
      console.log("Database connection successful")
    });
  })
  .catch(err => {
    console.log(err.message);
    process.exit(1);
  });
