"use strict";

const { HEADER } = require("../constants");
const { findById } = require("../services/apikey.service");

const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();
    if (!key) {
      return res.status(403).json({
        code: "FORBIDDEN",
        message: "Forbidden Error",
      });
    }

    const objectKey = await findById(key);
    if (!objectKey) {
      return res.status(403).json({
        code: "FORBIDDEN",
        message: "Forbidden Error",
      });
    }
    req.objectKey = objectKey;

    return next();
  } catch (error) {
    next(error);
  }
};

const permission = (permission) => {
  return (req, res, next) => {
    if (!req.objectKey.permissions) {
      return res.status(403).json({
        code: "PERMISSION_DENIED",
        message: "Permission denied",
      });
    }

    const validPermission = req.objectKey.permissions.includes(permission);
    if (!validPermission) {
      return res.status(403).json({
        code: "PERMISSION_DENIED",
        message: "Permission denied",
      });
    }

    return next();
  };
};

const asyncHandler = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

module.exports = {
  apiKey,
  permission,
  asyncHandler,
};
