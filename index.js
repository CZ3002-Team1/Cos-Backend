const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const cors = require("cors");
const upload = require("express-fileupload");

const app = express();
const PORT = 5000;

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "COS Team 1",
      version: "1.0.0",
      description: "API Documentation",
    },
    servers: [
      //   {
      //     url: process.env.PUBLIC_SERVER_URL,
      //   },
      //   {
      //     url: process.env.SERVER_URL,
      //   },
      { url: "http://localhost:5000" },
    ],
  },
  apis: ["./routes/*.js"],
};
const specs = swaggerJsDoc(options);

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

app.use(express.json());

app.use(upload());

app.use(cors());

app.use("/api/event", require("./routes/event"));
app.use("/api/indexSwap", require("./routes/indexSwap"));

mongoose
  .connect(
    `mongodb+srv://costeam1:${process.env.MONGOPASSWORD}@cluster0.amabfnl.mongodb.net/?retryWrites=true&w=majority`
  )
  .then((result) => {
    console.log("Connected to Database");
    app.listen(PORT);
    console.log("Server listening on port " + PORT);
  })
  .catch((err) => console.log("err", err));
