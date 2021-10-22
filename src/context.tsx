import React, {
  FC,
  ReactNode,
  useMemo,
  Context,
  createContext,
  useContext,
  Consumer,
} from "react";
import { useTerraWebapp } from "@arthuryeti/terra";

import { PairResponse, Routes, Tokens, Data } from "./types";
import { formatPairsToRoutes } from "./helpers";

type Terraswap = {
  pairs: PairResponse[] | null;
  routes: Routes | null;
  tokens: Tokens | null;
  data: Data | null;
};

export const TerraswapContext: Context<Terraswap> = createContext<Terraswap>({
  pairs: [],
  routes: null,
  tokens: null,
  data: null,
});

type Props = {
  children: ReactNode;
  data: Data;
};

export const TerraswapProvider: FC<Props> = ({ children, data }) => {
  const {
    network: { name },
  } = useTerraWebapp();

  const pairs = useMemo(() => {
    return data[name].pairs;
  }, [data, name]);

  const tokens = useMemo(() => {
    return data[name].tokens;
  }, [data, name]);

  const routes = useMemo(() => {
    if (pairs.length == 0) {
      return null;
    }
    return formatPairsToRoutes(pairs);
  }, [pairs]);

  return (
    <TerraswapContext.Provider
      value={{
        pairs,
        routes,
        tokens,
        data,
      }}
    >
      {children}
    </TerraswapContext.Provider>
  );
};

export function useTerraswap(): Terraswap {
  return useContext(TerraswapContext);
}

export const TerraswapConsumer: Consumer<Terraswap> = TerraswapContext.Consumer;
