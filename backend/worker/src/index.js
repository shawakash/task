const cluster = require("cluster");
const express = require("express");
const { Kafka } = require("kafkajs");
const os = require("os");

let { KAFKA_URL, KAFKA_CLIENT_ID } = require("./config");
const { WorkerAdmin } = require("./kafka/admin");
const { ConsumerWorker } = require("./kafka/consumer");
const { dbConnect } = require("./db/mongoose");

const workers = {},
  count = os.cpus().length;

function spawn() {
  const worker = cluster.fork();
  workers[worker.pid] = worker;
  return worker;
}

if (cluster.isPrimary) {
  for (let i = 0; i < count; i++) {
    spawn();
  }
  cluster.on("death", function (worker) {
    console.log("worker " + worker.pid + " died. spawning a new process...");
    delete workers[worker.pid];
    spawn();
  });
  const app = express();

  (async () => {
    await WorkerAdmin.getInstance().init([
      { topicName: "mail", partitions: 1 },
    ]);
  })();

  app.listen(8081, async () => {
    console.log(`Server listening on port: ${8081}\n`);
  });
} else {
  (async () => {
    try {
      await ConsumerWorker.getInstance().connectConsumer(
        "worker",
        ["mail"],
        true,
      );
      await dbConnect();
      await ConsumerWorker.getInstance().runConsumer();
    } catch (error) {
      console.log(`Error in consumer operations: ${error}`);
      process.exit(1);
    }
  })();
}

process.on("uncaughtException", function (err) {
  console.log("Caught exception: " + err);
});
