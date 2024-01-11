"use strict";

const mongoose = require("mongoose");
const { countConnect } = require("../helpers/check.connect");
const {
  database: { uri },
} = require("../configs");

const connectString = uri;

class Database {
  constructor() {
    this.connect();
  }

  connect(type = "mongodb") {
    if (process.env.NODE_ENV === "develop") {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }

    mongoose
      .connect(connectString, {
        maxPoolSize: 50, // default: 100
      })
      .then(() => {
        console.log("Connect MongoDB success");
        countConnect();
      })
      .catch(() => console.log("Connect failed"));
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }

    return Database.instance;
  }
}

const instanceMongodb = Database.getInstance();

module.exports = instanceMongodb;
