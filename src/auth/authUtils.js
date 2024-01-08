"use strict";

const jwt = require("jsonwebtoken");
const asyncHandler = require("../helpers/asyncHandler");
const { HEADER } = require("../constants");
const {
  AuthFailureError,
  BadRequestError,
  NotFoundError,
} = require("../core/error.response");
const KeyTokenService = require("../services/keyToken.service");

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = await jwt.sign(payload, publicKey, {
      expiresIn: "5m",
    });
    const refreshToken = await jwt.sign(payload, privateKey, {
      expiresIn: "7d",
    });

    return { accessToken, refreshToken };
  } catch (error) {}
};

const authentication = asyncHandler(async (req, res, next) => {
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) {
    throw new AuthFailureError("Invalid request");
  }

  const keyStore = await KeyTokenService.findByUserId(userId);
  if (!keyStore) {
    throw new NotFoundError("Not found keyStore");
  }

  if (req.headers[HEADER.REFRESH_TOKEN]) {
    try {
      const refreshToken = req.headers[HEADER.REFRESH_TOKEN];
      const decodeUser = jwt.verify(refreshToken, keyStore.privateKey);

      if (userId !== decodeUser.userId) {
        throw new AuthFailureError("Invalid user id");
      }

      req.keyStore = keyStore;
      req.user = decodeUser;
      req.refreshToken = refreshToken;
      return next();
    } catch (error) {
      throw error;
    }
  }

  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) {
    throw new AuthFailureError("Invalid request");
  }

  try {
    const token = accessToken.split(" ")[1];
    const decodeUser = jwt.verify(token, keyStore.publicKey);

    if (userId !== decodeUser.userId) {
      throw new AuthFailureError("Invalid user id");
    }

    req.keyStore = keyStore;
    req.user = decodeUser;
    return next();
  } catch (error) {
    throw error;
  }
});

const verifyJwt = async (token, keySecret) => {
  return await jwt.verify(token, keySecret);
};

module.exports = {
  createTokenPair,
  authentication,
  verifyJwt,
};
