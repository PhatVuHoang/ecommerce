const app = require("./src/app");
const {
  app: { port },
} = require("./src/configs");

const enviroment = process.env.NODE_ENV || "develop";
const server = app.listen(port, () => {
  console.log(
    `${
      enviroment === "develop"
        ? `Server is listening on localhost:${port}`
        : "Server started"
    }`
  );
});

// server exit
process.on("SIGINT", () => {
  server.close(() => console.log("Server exited"));
});
