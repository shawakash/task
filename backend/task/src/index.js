let express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();
let { ProducerWorker } = require("./worker/producer");

let { dbConnect } = require("./db/mongoose");
let listRouter = require("./routes/list");
let mailRouter = require("./routes/mail");
const morgan = require("morgan");

const app = express();

app.use(express.json());
app.use(cors());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms"),
);

app.get("/_health", (req, res) => {
  return res.status(200).json({
    upTime: process.uptime(),
    message: "I am alive",
  });
});

app.get("/", (req, res) => {
  return res.status(200).json({
    upTime: process.uptime(),
    message: "I am alive",
  });
});

app.use("/list", listRouter);
app.use("/mail", mailRouter);

Promise.all([
  new Promise(async (resolve, reject) => {
    await ProducerWorker.getInstance()
      .connectProducer()
      .then(() => resolve());
  }),
  new Promise(async (resolve, reject) => {
    console.log("Connecting to database...");
    await dbConnect().then(() => resolve());
  }),
]).then(() => {
  app.listen(8080, () => {
    console.log("Server is running on port 8080");
  });
});
