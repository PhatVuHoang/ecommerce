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

  async logout(req, res, next) {
    const response = await AccessService.logout(req.keyStore);
    new OK({
      message: "logout success",
      metadata: response,
    }).send(res);
  }

  async handleRefreshToken(req, res, next) {
    const response = await AccessService.handleRefreshToken({
      refreshToken: req.refreshToken,
      user: req.user,
      keyStore: req.keyStore,
    });
    new Created({
      message: "Get token success",
      metadata: response,
    }).send(res);
  }
}

module.exports = new AccessController();
