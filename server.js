const app = require("./src/app");

const PORT = 3000;

const server = app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});

// server exit
process.on("SIGINT", () => {
  server.close(() => console.log("Exit server"));
});
