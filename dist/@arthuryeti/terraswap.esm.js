import { num, toBase64, useTerraWebapp, useAddress, useTransaction } from '@arthuryeti/terra';
import _extends from '@babel/runtime/helpers/esm/extends';
import _objectWithoutPropertiesLoose from '@babel/runtime/helpers/esm/objectWithoutPropertiesLoose';
import React, { createContext, useMemo, useContext, useCallback } from 'react';
import { MsgExecuteContract, Coin } from '@terra-money/terra.js';
import { useQuery } from 'react-query';

function isNativeAssetInfo(value) {
  return value.hasOwnProperty("native_token");
}
var isNativeToken = function isNativeToken(token) {
  if (token === void 0) {
    token = "";
  }

  return token.startsWith("u");
};
var isNativeAsset = function isNativeAsset(info) {
  return "native_token" in info;
};
var toAssetInfo = function toAssetInfo(token) {
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
var toAsset = function toAsset(_ref) {
  var amount = _ref.amount,
      token = _ref.token;
  return {
    amount: amount,
    info: toAssetInfo(token)
  };
};
var findAsset = function findAsset(infos, token) {
  var asset = infos.find(function (info) {
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
var createAsset = function createAsset(amount, route) {
  var from = route[0].from;
  var info = toAssetInfo(from);
  return {
    info: info,
    amount: amount
  };
};
var getTokenDenom = function getTokenDenom(info) {
  if (isNativeAssetInfo(info)) {
    return info.native_token.denom;
  }

  return info.token.contract_addr;
};
var getTokenDenoms = function getTokenDenoms(infos) {
  return infos.map(function (info) {
    return getTokenDenom(info);
  });
};

var minAmountReceive = function minAmountReceive(_ref) {
  var amount = _ref.amount,
      maxSpread = _ref.maxSpread;
  var rate1 = num("1").minus(maxSpread);
  return num(amount).times(rate1).toString();
};
var priceImpact = function priceImpact(_ref2) {
  var offerAmount = _ref2.offerAmount,
      maxSpread = _ref2.maxSpread;
  var amount = num(offerAmount);
  var spread = num(maxSpread);
  return spread.div(amount.plus(spread)).times("100").toString();
};

var simulate$1 = function simulate(_ref) {
  var client = _ref.client,
      swapRoute = _ref.swapRoute,
      token = _ref.token,
      amount = _ref.amount,
      _ref$reverse = _ref.reverse,
      reverse = _ref$reverse === void 0 ? false : _ref$reverse;

  if (swapRoute[0] == null) {
    return null;
  }

  var contract_addr = swapRoute[0].contract_addr;

  if (reverse) {
    return client.wasm.contractQuery(contract_addr, {
      reverse_simulation: {
        ask_asset: toAsset({
          token: token,
          amount: amount
        })
      }
    });
  }

  return client.wasm.contractQuery(contract_addr, {
    simulation: {
      offer_asset: toAsset({
        token: token,
        amount: amount
      })
    }
  });
};
var createSwapMsgs = function createSwapMsgs(_ref2, sender) {
  var swapRoute = _ref2.swapRoute,
      token = _ref2.token,
      amount = _ref2.amount,
      slippage = _ref2.slippage,
      price = _ref2.price;
  var contract_addr = swapRoute[0].contract_addr;
  var offerAsset = createAsset(amount, swapRoute);
  var isNative = isNativeAsset(offerAsset.info);

  if (isNative) {
    return [new MsgExecuteContract(sender, contract_addr, {
      swap: {
        offer_asset: offerAsset,
        max_spread: slippage,
        belief_price: price
      }
    }, [new Coin(token, amount)])];
  }

  return [new MsgExecuteContract(sender, token, {
    send: {
      amount: amount,
      contract: contract_addr,
      msg: toBase64({
        swap: {
          max_spread: slippage,
          belief_price: price
        }
      })
    }
  })];
};

// const formatPair = (
//   routes: Routes,
//   pair: PairResponse,
//   from: AssetInfo,
//   to: AssetInfo,
// ) => {
//   const [tokenFrom, tokenTo] = getTokenDenoms([from, to]);
//   const prevPairs = routes[tokenFrom] || {};
//   return {
//     [tokenFrom]: {
//       ...prevPairs,
//       [tokenTo]: pair,
//     },
//   };
// };
// export const formatPairsToRoutes = (pairs: PairResponse[]): Routes => {
//   return pairs.reduce((routes, pair) => {
//     const [tokenFirst, tokenSecond] = pair.asset_infos;
//     return {
//       ...routes,
//       ...formatPair(routes, pair, tokenFirst, tokenSecond),
//       ...formatPair(routes, pair, tokenSecond, tokenFirst),
//     };
//   }, {});
// };
var toRoutes = function toRoutes(allPairs, r, parentFrom, parentTo, parentContracts, index) {
  return r.map(function (v) {
    var contract_addr = v.contract_addr,
        asset_infos = v.asset_infos;

    var _getTokenDenoms = getTokenDenoms(asset_infos),
        token1 = _getTokenDenoms[0],
        token2 = _getTokenDenoms[1];

    var newParentContracts = [].concat(parentContracts, [contract_addr]);
    var from = parentTo ? parentTo : index == 0 ? token1 : token2;
    var to = from === token1 ? token2 : token1;
    var children = allPairs.filter(function (pair) {
      return findAsset(pair.asset_infos, to);
    }).filter(function (pair) {
      return pair.asset_infos.find(function (asset) {
        return getTokenDenom(asset) !== parentFrom && getTokenDenom(asset) !== parentTo;
      });
    }).filter(function (pair) {
      return pair.contract_addr !== contract_addr && !newParentContracts.includes(pair.contract_addr);
    });
    return {
      contract_addr: contract_addr,
      from: from,
      to: to,
      children: toRoutes(allPairs, children, from, to, newParentContracts)
    };
  });
};
var formatPairsToRoutes = function formatPairsToRoutes(pairs) {
  return [].concat(toRoutes(pairs, pairs, null, null, [], 0), toRoutes(pairs, pairs, null, null, [], 1));
};

var TerraswapContext = /*#__PURE__*/createContext({
  pairs: [],
  routes: null,
  tokens: null,
  data: null
});
var TerraswapProvider = function TerraswapProvider(_ref) {
  var children = _ref.children,
      data = _ref.data;

  var _useTerraWebapp = useTerraWebapp(),
      name = _useTerraWebapp.network.name;

  var pairs = useMemo(function () {
    return data[name].pairs;
  }, [data, name]);
  var tokens = useMemo(function () {
    return data[name].tokens;
  }, [data, name]);
  var routes = useMemo(function () {
    if (pairs.length == 0) {
      return null;
    }

    return formatPairsToRoutes(pairs);
  }, [pairs]);
  return /*#__PURE__*/React.createElement(TerraswapContext.Provider, {
    value: {
      pairs: pairs,
      routes: routes,
      tokens: tokens,
      data: data
    }
  }, children);
};
function useTerraswap() {
  return useContext(TerraswapContext);
}
var TerraswapConsumer = TerraswapContext.Consumer;

var useSwapRoute = function useSwapRoute(_ref) {
  var routes = _ref.routes,
      from = _ref.from,
      to = _ref.to;
  return useMemo(function () {
    var result = [];
    var done = false;
    var path = {};

    if (routes == null || from == null || to == null) {
      return null;
    }

    function traverse(route, key) {
      route.children.forEach(function (child) {
        if (!done) {
          if (child.to === to) {
            //if we found our target push it to the path
            path[key].push(child); //set result to the completed path

            result = path[key]; //set done to true to exit the search

            done = true;
          } else {
            path[key].push(child);
            return traverse(child, key);
          }
        }
      }); //if we leave our for loop but we are not done that means we failed to find our target
      //in this branch, as a result we need to pop each node out of our path before we return

      if (!done) {
        path[key].pop();
      }
    } //set an array of the root nodes of our product tree. These are super-categories that are
    //not saved in the item schema, possibly representing types of items, i.e. different schemas.


    var filteredRoutes = routes.filter(function (route) {
      return route.from === from;
    });
    filteredRoutes.forEach(function (child) {
      path[child.to] = [child];

      if (child.to === to) {
        //set result to the completed path
        result = path[child.to]; //set done to true to exit the search

        done = true;
        return;
      }

      traverse(child, child.to);
    });
    return result;
  }, [routes, from, to]);
};

var defaultContracts = {
  mainnet: {
    factory: "terra1fnywlw4edny3vw44x04xd67uzkdqluymgreu7g",
    router: "terra16t7dpwwgx9n3lq6l6te3753lsjqwhxwpday9zx"
  },
  testnet: {
    factory: "terra15jsahkaf9p0qu8ye873p0u5z6g07wdad0tdq43",
    router: "terra13wf295fj9u209nknz2cgqmmna7ry3d3j5kv7t4"
  }
};
var useContracts = function useContracts(initial) {
  var _useTerraWebapp = useTerraWebapp(),
      name = _useTerraWebapp.network.name;

  var contracts = initial != null ? initial : defaultContracts;
  return useMemo(function () {
    return contracts[name];
  }, [contracts, name]);
};

var getSwapOperations = function getSwapOperations(_ref) {
  var swapRoute = _ref.swapRoute,
      _ref$operations = _ref.operations,
      operations = _ref$operations === void 0 ? [] : _ref$operations;

  if (swapRoute == null || swapRoute.length === 0) {
    return operations;
  }

  var _swapRoute$ = swapRoute[0],
      from = _swapRoute$.from,
      to = _swapRoute$.to;
  var operation = {
    terra_swap: {
      offer_asset_info: toAssetInfo(from),
      ask_asset_info: toAssetInfo(to)
    }
  };

  if ([toAssetInfo(from), toAssetInfo(to)].every(isNativeAssetInfo)) {
    operation = {
      native_swap: {
        offer_denom: from,
        ask_denom: to
      }
    };
  }

  return getSwapOperations({
    swapRoute: swapRoute.slice(1),
    operations: [].concat(operations, [operation])
  });
};
var simulate = function simulate(_ref2) {
  var client = _ref2.client,
      swapRoute = _ref2.swapRoute,
      router = _ref2.router,
      amount = _ref2.amount;
  var operations = getSwapOperations({
    swapRoute: swapRoute
  });
  return client.wasm.contractQuery(router, {
    simulate_swap_operations: {
      offer_amount: amount,
      operations: operations
    }
  });
};

function isMultiSimulation(value) {
  return value.hasOwnProperty("amount");
}

function isReverseSimulation(value) {
  return value.hasOwnProperty("offer_amount");
}

var useSwapSimulate = function useSwapSimulate(_ref) {
  var swapRoute = _ref.swapRoute,
      token = _ref.token,
      amount = _ref.amount,
      reverse = _ref.reverse;

  var _useTerraWebapp = useTerraWebapp(),
      client = _useTerraWebapp.client;

  var _useContracts = useContracts(),
      router = _useContracts.router;

  var _useQuery = useQuery(["simulation", swapRoute, router, token, amount, reverse], function () {
    if (swapRoute == null || token == null || amount == null || swapRoute.length == 0) {
      return;
    }

    if (swapRoute.length > 1) {
      return simulate({
        client: client,
        swapRoute: swapRoute,
        router: router,
        token: token,
        amount: amount
      });
    }

    return simulate$1({
      client: client,
      swapRoute: swapRoute,
      token: token,
      amount: amount,
      reverse: reverse
    });
  }, {
    enabled: swapRoute != null
  }),
      data = _useQuery.data,
      isLoading = _useQuery.isLoading;

  return useMemo(function () {
    if (data == null || amount == null || isLoading) {
      return null;
    }

    if (isMultiSimulation(data)) {
      return {
        amount: data.amount,
        spread: "0",
        commission: "0",
        price: num(amount).div(data.amount).toFixed(18)
      };
    }

    var spread = data.spread_amount;
    var commission = data.commission_amount;

    if (isReverseSimulation(data)) {
      return {
        amount: data.offer_amount,
        spread: spread,
        commission: commission,
        price: num(data.offer_amount).div(amount).toFixed(18)
      };
    }

    return {
      amount: data.return_amount,
      spread: spread,
      commission: commission,
      price: num(amount).div(data.return_amount).toFixed(18)
    };
  }, [amount, data, isLoading]);
};

var _excluded = ["submit"];
var useSwap = function useSwap(_ref) {
  var token1 = _ref.token1,
      token2 = _ref.token2,
      amount1 = _ref.amount1,
      amount2 = _ref.amount2,
      slippage = _ref.slippage,
      _ref$reverse = _ref.reverse,
      reverse = _ref$reverse === void 0 ? false : _ref$reverse,
      onSuccess = _ref.onSuccess,
      onError = _ref.onError;

  var _useTerraswap = useTerraswap(),
      routes = _useTerraswap.routes;

  var address = useAddress();
  var swapRoute = useSwapRoute({
    routes: routes,
    from: token1,
    to: token2
  });
  var simulated = useSwapSimulate({
    swapRoute: swapRoute,
    amount: reverse ? amount2 : amount1,
    token: reverse ? token2 : token1,
    reverse: reverse
  });
  var minReceive = useMemo(function () {
    if (simulated == null || amount2 == null) {
      return null;
    }

    return minAmountReceive({
      amount: reverse ? amount2 : simulated.amount,
      maxSpread: slippage
    });
  }, [simulated, slippage, amount2, reverse]);
  var msgs = useMemo(function () {
    if (swapRoute == null || token1 == null || amount1 == null || simulated == null) {
      return null;
    }

    if (swapRoute.length > 1) {
      return null;
    }

    return createSwapMsgs({
      token: token1,
      swapRoute: swapRoute,
      amount: amount1,
      slippage: slippage,
      price: simulated.price
    }, address);
  }, [address, token1, amount1, simulated, slippage, swapRoute]);

  var _useTransaction = useTransaction({
    msgs: msgs,
    onSuccess: onSuccess,
    onError: onError
  }),
      submit = _useTransaction.submit,
      rest = _objectWithoutPropertiesLoose(_useTransaction, _excluded);

  return _extends({}, rest, {
    simulated: simulated,
    minReceive: minReceive,
    swap: submit
  });
};

var useShareOfPool = function useShareOfPool(_ref) {
  var pool = _ref.pool,
      amount1 = _ref.amount1;
  return useMemo(function () {
    if (pool == null || amount1 == null || num(pool.total_share).isEqualTo(0)) {
      return null;
    }

    var token1Amount = pool.assets[0].amount;
    return num(amount1).div(token1Amount).toFixed(2);
  }, [pool, amount1]);
};

var useTokensToLp = function useTokensToLp(_ref) {
  var pool = _ref.pool,
      amount1 = _ref.amount1;
  var shareOfPool = useShareOfPool({
    pool: pool,
    amount1: amount1
  });
  return useMemo(function () {
    if (pool == null || amount1 == null || shareOfPool == null || num(amount1).isEqualTo(0)) {
      return null;
    }

    return num(shareOfPool).times(pool.total_share).toFixed();
  }, [pool, shareOfPool, amount1]);
};

var useLpToTokens = function useLpToTokens(_ref) {
  var pool = _ref.pool,
      amount = _ref.amount;
  return useMemo(function () {
    if (pool == null || amount == null || num(amount).isEqualTo(0)) {
      return null;
    }

    var assets = pool.assets,
        total_share = pool.total_share;
    return assets.reduce(function (acc, asset) {
      var _extends2;

      return _extends({}, acc, (_extends2 = {}, _extends2[getTokenDenom(asset.info)] = num(amount).times(asset.amount).div(total_share).toFixed(), _extends2));
    }, {});
  }, [pool, amount]);
};

var ONE_TOKEN = 1000000;
var ESTIMATE_TOKEN = "uusd";

var useTokenPriceInUst = function useTokenPriceInUst(token) {
  var _useTerraswap = useTerraswap(),
      routes = _useTerraswap.routes;

  var swapRoute = useSwapRoute({
    routes: routes,
    from: token,
    to: ESTIMATE_TOKEN
  });
  var data = useSwapSimulate({
    swapRoute: swapRoute,
    amount: String(ONE_TOKEN),
    token: token,
    reverse: false
  });

  if (token == "uusd") {
    return String(ONE_TOKEN);
  }

  if (data == null) {
    return null;
  }

  return num("1").div(data.price).times(ONE_TOKEN).toFixed();
};

var useTotalShareInUst = function useTotalShareInUst(_ref) {
  var pool = _ref.pool;
  var token1 = pool && getTokenDenom(pool.assets[0].info);
  var token2 = pool && getTokenDenom(pool.assets[1].info);
  var token1Price = useTokenPriceInUst(token1);
  var token2Price = useTokenPriceInUst(token2);
  var tokenAmounts = useMemo(function () {
    var _ref2;

    if (pool == null) {
      return null;
    }

    return _ref2 = {}, _ref2[getTokenDenom(pool.assets[0].info)] = pool.assets[0].amount, _ref2[getTokenDenom(pool.assets[1].info)] = pool.assets[1].amount, _ref2;
  }, [pool]);
  return useMemo(function () {
    if (pool == null || token1 == null || token2 == null || token1Price == null || token2Price == null || tokenAmounts == null || num(pool.total_share).isEqualTo(0)) {
      return null;
    }

    var totalPrice1 = num(tokenAmounts[token1]).times(token1Price).div(ONE_TOKEN);
    var totalPrice2 = num(tokenAmounts[token2]).times(token2Price).div(ONE_TOKEN);
    return totalPrice1.plus(totalPrice2).toFixed();
  }, [pool, token1, token2, token1Price, token2Price, tokenAmounts]);
};

var useTokenInfo = function useTokenInfo() {
  var _useTerraWebapp = useTerraWebapp(),
      name = _useTerraWebapp.network.name;

  var _useTerraswap = useTerraswap(),
      data = _useTerraswap.data;

  var getSymbol = useCallback(function (token) {
    if (data == null || token == null) {
      return null;
    }

    return data[name].tokens[token].symbol || token;
  }, [name, data]);
  var getIcon = useCallback(function (token) {
    if (data == null || token == null) {
      return null;
    }

    var info = data[name].tokens[token];
    return info.icon || null;
  }, [name, data]);
  return {
    getSymbol: getSymbol,
    getIcon: getIcon
  };
};

export { TerraswapConsumer, TerraswapContext, TerraswapProvider, createAsset, findAsset, getTokenDenom, getTokenDenoms, isNativeAsset, isNativeAssetInfo, isNativeToken, minAmountReceive, priceImpact, toAsset, toAssetInfo, useContracts, useLpToTokens, useShareOfPool, useSwap, useSwapRoute, useSwapSimulate, useTerraswap, useTokenInfo, useTokenPriceInUst, useTokensToLp, useTotalShareInUst };
