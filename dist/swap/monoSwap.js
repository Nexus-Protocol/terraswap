"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.simulate = exports.createSwapMsgs = void 0;

var _terra = require("@arthuryeti/terra");

var _terra2 = require("@terra-money/terra.js");

var _asset = require("../asset");

const simulate = ({
  client,
  swapRoute,
  token,
  amount,
  reverse = false
}) => {
  if (swapRoute[0] == null) {
    return null;
  }

  const {
    contract_addr
  } = swapRoute[0];

  if (reverse) {
    return client.wasm.contractQuery(contract_addr, {
      reverse_simulation: {
        ask_asset: (0, _asset.toAsset)({
          token,
          amount
        })
      }
    });
  }

  return client.wasm.contractQuery(contract_addr, {
    simulation: {
      offer_asset: (0, _asset.toAsset)({
        token,
        amount
      })
    }
  });
};

exports.simulate = simulate;

const createSwapMsgs = ({
  swapRoute,
  token,
  amount,
  slippage,
  price
}, sender) => {
  const [{
    contract_addr
  }] = swapRoute;
  const offerAsset = (0, _asset.createAsset)(amount, swapRoute);
  const isNative = (0, _asset.isNativeAsset)(offerAsset.info);

  if (isNative) {
    return [new _terra2.MsgExecuteContract(sender, contract_addr, {
      swap: {
        offer_asset: offerAsset,
        max_spread: slippage,
        belief_price: price
      }
    }, [new _terra2.Coin(token, amount)])];
  }

  return [new _terra2.MsgExecuteContract(sender, token, {
    send: {
      amount,
      contract: contract_addr,
      msg: (0, _terra.toBase64)({
        swap: {
          max_spread: slippage,
          belief_price: price
        }
      })
    }
  })];
};

exports.createSwapMsgs = createSwapMsgs;