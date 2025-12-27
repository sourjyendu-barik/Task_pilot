//Importing dotenv in index so we can use it anywhere after it
require("dotenv").config();

//Importing the dunction initialzeDB which will start the databse
const initializeDb = require("./db/db.connect");

//importing the app from app.js
const app = require("./app");

//Assigning port value from .env (dotenv is already congiguered)
const port = process.env.PORT || 3000;

//After initializeDb server should start so using async await
const startServer = async () => {
  try {
    await initializeDb();
    app.listen(port, () => {
      console.log("Server is running on port", port);
    });
  } catch (error) {
    console.error("Error while starting server", error.message);
    process.exit(1);
  }
};
startServer();
