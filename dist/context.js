"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TerraswapProvider = exports.TerraswapContext = exports.TerraswapConsumer = void 0;
exports.useTerraswap = useTerraswap;

var _react = _interopRequireWildcard(require("react"));

var _terra = require("@arthuryeti/terra");

var _helpers = require("./helpers");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const TerraswapContext = /*#__PURE__*/(0, _react.createContext)({
  pairs: [],
  routes: null,
  tokens: null,
  data: null
});
exports.TerraswapContext = TerraswapContext;

const TerraswapProvider = ({
  children,
  data
}) => {
  const {
    network: {
      name
    }
  } = (0, _terra.useTerraWebapp)();
  const pairs = (0, _react.useMemo)(() => {
    return data[name].pairs;
  }, [data, name]);
  const tokens = (0, _react.useMemo)(() => {
    return data[name].tokens;
  }, [data, name]);
  const routes = (0, _react.useMemo)(() => {
    if (pairs.length == 0) {
      return null;
    }

    return (0, _helpers.formatPairsToRoutes)(pairs);
  }, [pairs]);
  return /*#__PURE__*/_react.default.createElement(TerraswapContext.Provider, {
    value: {
      pairs,
      routes,
      tokens,
      data
    }
  }, children);
};

exports.TerraswapProvider = TerraswapProvider;

function useTerraswap() {
  return (0, _react.useContext)(TerraswapContext);
}

const TerraswapConsumer = TerraswapContext.Consumer;
exports.TerraswapConsumer = TerraswapConsumer;