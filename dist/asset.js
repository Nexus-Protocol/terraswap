"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isNativeAsset = exports.getTokenDenoms = exports.getTokenDenom = exports.findAsset = exports.createAsset = void 0;
exports.isNativeAssetInfo = isNativeAssetInfo;
exports.toAssetInfo = exports.toAsset = exports.isNativeToken = void 0;

function isNativeAssetInfo(value) {
  return value.hasOwnProperty("native_token");
}

const isNativeToken = (token = "") => {
  return token.startsWith("u");
};

exports.isNativeToken = isNativeToken;

const isNativeAsset = info => {
  return "native_token" in info;
};

exports.isNativeAsset = isNativeAsset;

const toAssetInfo = token => {
  if (isNativeToken(token)) {
    return {
      native_token: {
        denom: token
      }
    };
  }

  return {
    token: {
      contract_addr: token
    }
  };
};

exports.toAssetInfo = toAssetInfo;

const toAsset = ({
  amount,
  token
}) => {
  return {
    amount,
    info: toAssetInfo(token)
  };
};

exports.toAsset = toAsset;

const findAsset = (infos, token) => {
  const asset = infos.find(info => {
    if (isNativeAssetInfo(info)) {
      return info.native_token.denom === token;
    }

    return info.token.contract_addr === token;
  });

  if (!asset) {
    return null;
  }

  return asset;
};

exports.findAsset = findAsset;

const createAsset = (amount, route) => {
  const [{
    from
  }] = route;
  const info = toAssetInfo(from);
  return {
    info,
    amount
  };
};

exports.createAsset = createAsset;

const getTokenDenom = info => {
  if (isNativeAssetInfo(info)) {
    return info.native_token.denom;
  }

  return info.token.contract_addr;
};

exports.getTokenDenom = getTokenDenom;

const getTokenDenoms = infos => {
  return infos.map(info => getTokenDenom(info));
};

exports.getTokenDenoms = getTokenDenoms;