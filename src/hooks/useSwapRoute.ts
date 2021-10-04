import { useMemo } from "react";

import { PairResponse } from "../types";

type Params = {
  routes: any;
  token1: string;
  token2: string;
};

export const useSwapRoute = ({
  routes,
  token1,
  token2,
}: Params): PairResponse[] | null => {
  return useMemo(() => {
    if (!routes[token1]) {
      return null;
    }

    if (routes[token1][token2]) {
      return [routes[token1][token2]];
    }

    if (routes[token1]["uusd"] && routes["uusd"][token2]) {
      return [routes[token1]["uusd"], routes["uusd"][token2]];
    }

    if (routes[token1]["uluna"] && routes["uluna"][token2]) {
      return [routes[token1]["uluna"], routes["uluna"][token2]];
    }

    if (routes[token1]["uluna"] && routes["uusd"][token2]) {
      return [
        routes[token1]["uluna"],
        routes["uluna"]["uusd"],
        routes["uusd"][token2],
      ];
    }

    return [
      routes[token1]["uusd"],
      routes["uusd"]["uluna"],
      routes["uluna"][token2],
    ];
  }, [routes, token1, token2]);
};

export default useSwapRoute;
