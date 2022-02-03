"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toRoutes = exports.formatPairsToRoutes = void 0;

var _asset = require("./asset");

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
const toRoutes = (allPairs, r, parentFrom, parentTo, parentContracts, index) => {
  return r.map(v => {
    const {
      contract_addr,
      asset_infos
    } = v;
    const [token1, token2] = (0, _asset.getTokenDenoms)(asset_infos);
    const newParentContracts = [...parentContracts, contract_addr];
    const from = parentTo ? parentTo : index == 0 ? token1 : token2;
    const to = from === token1 ? token2 : token1;
    const children = allPairs.filter(pair => {
      return (0, _asset.findAsset)(pair.asset_infos, to);
    }).filter(pair => {
      return pair.asset_infos.find(asset => {
        return (0, _asset.getTokenDenom)(asset) !== parentFrom && (0, _asset.getTokenDenom)(asset) !== parentTo;
      });
    }).filter(pair => {
      return pair.contract_addr !== contract_addr && !newParentContracts.includes(pair.contract_addr);
    });
    return {
      contract_addr,
      from,
      to,
      children: toRoutes(allPairs, children, from, to, newParentContracts)
    };
  });
};

exports.toRoutes = toRoutes;

const formatPairsToRoutes = pairs => {
  return [...toRoutes(pairs, pairs, null, null, [], 0), ...toRoutes(pairs, pairs, null, null, [], 1)];
};

exports.formatPairsToRoutes = formatPairsToRoutes;