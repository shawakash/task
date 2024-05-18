const mailRouter = require("express").Router();
const { ProducerWorker } = require("../worker/producer");
const { SendMailSchema } = require("../utils/valid");

mailRouter.post("/send", async (req, res) => {
  try {
    const { listId, emailBody, subject } = SendMailSchema.parse(req.body);

    //todo: distribute this by sending offsets to the consumer
    await ProducerWorker.getInstance().publishOne({
      topic: "mail",
      message: [
        {
          partition: 0,
          value: JSON.stringify({
            listId,
            emailBody,
            subject,
          }),
          key: "mail",
        },
      ],
    });

    return res.status(200).json({
      message: "Email sent",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      error: e,
    });
  }
});

module.exports = mailRouter;
