const mongoose = require("mongoose");

const mongoURI = process.env.MONGODB;
if (!mongoURI) {
  console.error("mongoUri is not present");
  process.exit(1);
}
const initializeDb = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("Db connected successfully.");
  } catch (error) {
    console.log("Error while connecting db", error.message);
    process.exit(1);
  }
};
module.exports = initializeDb;
