import { useMemo } from "react";

import { PairResponse, Routes } from "../../types";

type Params = {
  routes: Routes | null;
  token1: string | null;
  token2: string | null;
};

export const useSwapRoute = ({
  routes,
  token1,
  token2,
}: Params): PairResponse[] | null => {
  return useMemo(() => {
    if (token1 == null || token2 == null || routes == null) {
      return null;
    }

    if (routes[token1] == null) {
      return null;
    }

    if (routes[token1][token2]) {
      return [routes[token1][token2]];
    }

    if (routes[token1].uusd && routes.uusd[token2]) {
      return [routes[token1].uusd, routes.uusd[token2]];
    }

    if (routes[token1].uluna && routes.uluna[token2]) {
      return [routes[token1].uluna, routes.uluna[token2]];
    }

    if (routes[token1].uluna && routes.uusd[token2]) {
      return [routes[token1].uluna, routes.uluna.uusd, routes.uusd[token2]];
    }

    return [routes[token1].uusd, routes.uusd.uluna, routes.uluna[token2]];
  }, [routes, token1, token2]);
};

export default useSwapRoute;
