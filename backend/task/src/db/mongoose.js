const mongoose = require("mongoose");

let alreadyConnected = false;

const { MONGODB_URI } = process.env;

const customPropertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  defaultValue: { type: String, required: true },
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  subscribe: { type: Boolean, default: true },
  properties: { type: Map, of: String },
});

const listSchema = new mongoose.Schema({
  title: { type: String, required: true },
  customProperties: [customPropertySchema],
  users: [userSchema],
});

const List = mongoose.model("List", listSchema);
const User = mongoose.model("User", userSchema);

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

module.exports = { dbConnect, List, User };
