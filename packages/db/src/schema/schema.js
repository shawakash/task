let mongoose = require("mongoose");

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

module.exports = { List, User };
