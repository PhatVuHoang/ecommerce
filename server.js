const app = require("./src/app");

const PORT = process.env.PORT || 3000;
const ENV = process.env.NODE_ENV || "develop";

const server = app.listen(PORT, () => {
  console.log(`Server started at port ${PORT} enviroment ${ENV}`);
});

// server exit
process.on("SIGINT", () => {
  server.close(() => console.log("Exit server"));
});
