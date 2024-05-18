const { kafka } = require("./admin");
const { sendEmail } = require("../utils/utils");

class ConsumerWorker {
  static instance;
  consumer;

  constructor() {}

  static getInstance() {
    if (!this.instance) {
      this.instance = new ConsumerWorker();
    }
    return this.instance;
  }

  async connectConsumer(groupId, topics, fromBeginning) {
    this.consumer = kafka.consumer({ groupId });
    await this.consumer.connect();
    console.log(`consumer connected successfully`);
    await this.consumer.subscribe({ topics, fromBeginning });
    return this.consumer;
  }

  async disconnectConsumer() {
    await this.consumer.disconnect();
    return;
  }

  async runConsumer() {
    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const payload = JSON.parse(message.value.toString() || "");

          switch (topic) {
            case "mail":
              console.log("\nmail sent event received\n");
              await sendEmail(
                payload.listId,
                payload.emailBody,
                payload.subject,
              );
              break;

            default:
              console.log("That topic is not yet supported");
              break;
          }
          return;
        } catch (e) {
          console.log(e);
          return;
        }
      },
    });
  }
}

module.exports = {
  ConsumerWorker,
};
