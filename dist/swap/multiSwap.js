"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.simulate = exports.getSwapOperations = exports.createSwapMsgs = void 0;

var _terra = require("@arthuryeti/terra");

var _terra2 = require("@terra-money/terra.js");

var _asset = require("../asset");

const getSwapOperations = ({
  swapRoute,
  operations = []
}) => {
  if (swapRoute == null || swapRoute.length === 0) {
    return operations;
  }

  const [{
    from,
    to
  }] = swapRoute;
  let operation = {
    terra_swap: {
      offer_asset_info: (0, _asset.toAssetInfo)(from),
      ask_asset_info: (0, _asset.toAssetInfo)(to)
    }
  };

  if ([(0, _asset.toAssetInfo)(from), (0, _asset.toAssetInfo)(to)].every(_asset.isNativeAssetInfo)) {
    operation = {
      native_swap: {
        offer_denom: from,
        ask_denom: to
      }
    };
  }

  return getSwapOperations({
    swapRoute: swapRoute.slice(1),
    operations: [...operations, operation]
  });
};

exports.getSwapOperations = getSwapOperations;

const simulate = ({
  client,
  swapRoute,
  router,
  amount
}) => {
  const operations = getSwapOperations({
    swapRoute
  });
  return client.wasm.contractQuery(router, {
    simulate_swap_operations: {
      offer_amount: amount,
      operations
    }
  });
};

exports.simulate = simulate;

const createSwapMsgs = ({
  swapRoute,
  token,
  router,
  amount,
  minReceive
}, sender) => {
  if (minReceive == null) {
    return null;
  }

  const [{
    to,
    from
  }] = swapRoute;
  const assetInfos = [(0, _asset.toAssetInfo)(from), (0, _asset.toAssetInfo)(to)];
  const info = (0, _asset.findAsset)(assetInfos, token);

  if (info == null) {
    return null;
  }

  const isNative = (0, _asset.isNativeAsset)(info);
  const operations = getSwapOperations({
    swapRoute
  });

  if (isNative) {
    return [new _terra2.MsgExecuteContract(sender, router, {
      execute_swap_operations: {
        offer_amount: amount,
        operations,
        minimum_receive: minReceive
      }
    }, [new _terra2.Coin(token, amount)])];
  }

  return [new _terra2.MsgExecuteContract(sender, token, {
    send: {
      amount,
      contract: router,
      msg: (0, _terra.toBase64)({
        execute_swap_operations: {
          offer_amount: amount,
          operations,
          minimum_receive: minReceive
        }
      })
    }
  })];
};

exports.createSwapMsgs = createSwapMsgs;