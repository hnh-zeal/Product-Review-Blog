const app = require("./app");
const connectDatabase = require("./database/database");

const dotenv = require("dotenv");
dotenv.config();

process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  process.exit(1); // Exit Code 1 indicates that a container shut down, either because of an application failure.
});

// Connect Database
connectDatabase();

const http = require("http");

const server = http.createServer(app);

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.log(err);
  console.log("UNHANDLED REJECTION! Shutting down ...");
  server.close(() => {
    process.exit(1);
  });
});
