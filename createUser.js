const User = require("./mongoDB-config");
const short = require("short-uuid");

module.exports = async function createUser(username, email, password) {
  const currentDate = new Date();
  try {
    const newUser = new User({
      _id: short.generate(),
      proPic: "https://cdn.onlinewebfonts.com/svg/img_511291.png",
      username: username,
      email: email,
      password: password,
      created_on: currentDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      }),
    });
    const user = await newUser.save();
    return user;
  } catch (err) {
    throw err;
  }
};
