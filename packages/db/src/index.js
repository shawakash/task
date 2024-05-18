const mongoose = require("mongoose");
const { List, User } = require("./schema/schema");
let dotenv = require("dotenv");
dotenv.config();

let alreadyConnected = false;

const { MONGODB_URI } = process.env;

const dbConnect = () => {
  if (alreadyConnected) {
    return;
  }
  alreadyConnected = true;
  if (!MONGODB_URI || MONGODB_URI.length == 0) {
    throw new Error("Please define the MONGODB_URI environment variable");
  }

  return mongoose.connect(MONGODB_URI, {
    dbName: "task",
  });
};


module.export = {
  List, User, dbConnect
}
