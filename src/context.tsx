import {
  FC,
  ReactNode,
  useMemo,
  Context,
  createContext,
  useContext,
  Consumer,
} from "react";
import { useWallet } from "@terra-money/wallet-provider";

import { PairResponse, Routes, Tokens, Data } from "./types";
import { formatPairsToRoutes } from "./helpers";

type Terraswap = {
  pairs: PairResponse[] | any[];
  routes: Routes | any[];
  tokens: Tokens | any[];
  data: Data | null;
};

export const TerraswapContext: Context<Terraswap> = createContext<Terraswap>({
  pairs: [],
  routes: [],
  tokens: [],
  data: null,
});

type Props = {
  children: ReactNode;
  data: Data;
};

export const TerraswapProvider: FC<Props> = ({ children, data }) => {
  const { network } = useWallet();

  const pairs = useMemo(() => {
    return data[network.name].pairs;
  }, [network.name]);

  const tokens = useMemo(() => {
    return data[network.name].tokens;
  }, [network.name]);

  const routes = useMemo(() => {
    if (!pairs) {
      return [];
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
