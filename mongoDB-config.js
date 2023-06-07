require("dotenv").config();
const mongoose = require("mongoose");

mongoose.set("strictQuery", "false");
mongoose.connect(
  `mongodb+srv://admin-moinak:${process.env.MONGO_DB_ATLAS_PASSWORD}@clusterv2.g2smmdo.mongodb.net/desiDimeTestDB`,
  {
    useNewUrlParser: true,
  }
);

const userSchema = mongoose.Schema({
  _id: String,
  proPic: String,
  username: String,
  email: String,
  password: String,
  created_on: String,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
