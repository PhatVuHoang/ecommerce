"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const RoleShop = require("../constants/roles");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");

class AccessService {
  static signUp = async ({ name, email, password }) => {
    try {
      const holderShop = await shopModel.findOne({ email }).lean();
      if (holderShop) {
        return {
          code: "EXISTED",
          message: "Shop already registered!",
        };
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const newShop = await shopModel.create({
        name,
        email,
        password: passwordHash,
        roles: [RoleShop.SHOP],
      });
      if (newShop) {
        const privateKey = crypto.randomBytes(64).toString("hex");
        const publicKey = crypto.randomBytes(64).toString("hex");

        const keyStore = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey,
          privateKey,
        });

        if (!keyStore) {
          return {
            code: "ERROR",
            message: "key store error",
          };
        }

        const tokens = await createTokenPair(
          { userId: newShop._id, email },
          publicKey,
          privateKey
        );

        return {
          code: "CREATED",
          metadata: {
            shop: getInfoData({
              fields: ["_id", "name", "email"],
              object: newShop,
            }),
            tokens,
          },
        };
      }
    } catch (error) {
      return {
        code: "ERROR",
        message: error.message,
        status: "error",
      };
    }
  };
}

module.exports = AccessService;
