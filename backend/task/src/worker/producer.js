const { Producer } = require("kafkajs");
let { KAFKA_URL, KAFKA_CLIENT_ID } = require("../config");
const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: KAFKA_CLIENT_ID,
  brokers: [KAFKA_URL],
});

class ProducerWorker {
  producer;
  static instance;

  constructor() {
    this.producer = kafka.producer();
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ProducerWorker();
    }
    return this.instance;
  }

  async connectProducer() {
    this.producer = kafka.producer();
    await this.producer.connect();
    console.log("Producer Connected Successfully");
    return;
  }

  async disconnectProducer() {
    await this.producer.disconnect();
    return;
  }

  async publishOne(payload) {
    await this.producer.send({
      topic: payload.topic,
      messages: payload.message,
    });
    console.log("payload published successfully");
    return;
  }

  async publishMany(payloads) {
    await this.producer.sendBatch({
      topicMessages: payloads.map((payload) => {
        return {
          topic: payload.topic,
          messages: payload.message,
        };
      }),
    });
    return;
  }
}

module.exports = {
  ProducerWorker,
};
