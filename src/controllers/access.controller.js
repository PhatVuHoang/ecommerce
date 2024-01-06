"use strict";

const AccessService = require("../services/access.service");
const { Created, OK } = require("../core/success.response");

class AccessController {
  async signup(req, res, next) {
    const response = await AccessService.signUp(req.body);
    new Created({
      message: "registered success",
      metadata: response,
    }).send(res);
  }

  async login(req, res, next) {
    const response = await AccessService.login(req.body);

    new OK({
      message: "login success",
      metadata: response,
    }).send(res);
  }
}

module.exports = new AccessController();
