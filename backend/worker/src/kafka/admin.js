const { Kafka } = require("kafkajs");
const { KAFKA_URL, KAFKA_CLIENT_ID } = require("../config");

const kafka = new Kafka({
  clientId: KAFKA_CLIENT_ID,
  brokers: [KAFKA_URL],
});

class WorkerAdmin {
  static instance;
  admin;

  constructor() {
    this.admin = kafka.admin();
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new WorkerAdmin();
    }
    return this.instance;
  }

  async init(topics) {
    await this.admin.connect();
    await this.admin.createTopics({
      topics: topics.map((topic) => ({
        topic: topic.topicName,
        numPartitions: topic.partitions,
      })),
    });
    console.log("\n Kafka Ready");
    await this.admin.disconnect();
  }
}

module.exports = { WorkerAdmin, kafka };
