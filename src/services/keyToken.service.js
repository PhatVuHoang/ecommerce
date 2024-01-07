"use strict";

const { Types } = require("mongoose");
const keyTokenModel = require("../models/keyToken.model");

class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    try {
      const filter = {
        user: userId,
      };

      const update = {
        publicKey,
        privateKey,
        refreshTokenUsed: [],
        refreshToken,
      };

      const options = {
        upsert: true,
        new: true,
      };

      const tokens = await keyTokenModel.findOneAndUpdate(
        filter,
        update,
        options
      );

      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  };

  static findByUserId = async (userId) => {
    return await keyTokenModel
      .findOne({ user: new Types.ObjectId(userId) })
      .lean();
  };

  static removeKeyById = async (id) => {
    return await keyTokenModel.deleteOne({
      _id: new Types.ObjectId(id),
    });
  };
}

module.exports = KeyTokenService;
