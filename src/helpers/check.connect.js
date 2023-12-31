"use strict";

const mongoose = require("mongoose");
const os = require("os");
const process = require("process");
const _SECONDS = 5000;

// count connections
const countConnect = () => {
  const numberOfConnection = mongoose.connections.length;
  console.log(`Number of connection: ${numberOfConnection}`);
};

// check overload connections
const checkOverload = () => {
  setInterval(() => {
    const numberOfConnection = mongoose.connections.length;
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;

    // example: maximum number of connections based on number of cores
    const maxConnections = numCores * 5;
    console.log(`Active connections: ${numberOfConnection}`);
    console.log(`Memory usage: ${memoryUsage / 1024 / 1024}MB`);
    if (numberOfConnection > maxConnections) {
      console.log("Connection overload detected");
    }
  }, _SECONDS); // monitor every 5s
};

module.exports = {
  countConnect,
  checkOverload,
};
