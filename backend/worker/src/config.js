let dotenv = require("dotenv");
dotenv.config();

const KAFKA_URL = process.env.KAFKA_URL || "localhost:9092";
const KAFKA_CLIENT_ID =
  process.env.KAFKA_CLIENT_ID ||
  "a0098b856fa177997c6a7e85170b7519d3fb2405adaea9721a63dec8ad464511";

const MAIL_SERVICE = process.env.MAIL_SERVICE || "";
const GMAIL = process.env.GMAIL || "";
const GMAIL_APP_PASS = process.env.GMAIL_APP_PASS || "";

module.exports = {
  KAFKA_URL,
  KAFKA_CLIENT_ID,
  MAIL_SERVICE,
  GMAIL,
  GMAIL_APP_PASS,
};
