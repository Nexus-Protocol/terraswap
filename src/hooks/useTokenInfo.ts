import { useCallback } from "react";
import { useWallet } from "@terra-money/wallet-provider";

import { useTerraswap } from "../context";

export const useTokenInfo = () => {
  const { network } = useWallet();
  const { data } = useTerraswap();

  const getSymbol = useCallback(
    (token: string) => {
      if (data == null) {
        return token;
      }

      return data[network.name].tokens[token]?.symbol ?? token;
    },
    [network.name, data]
  );

  const getIcon = useCallback(
    (token: string) => {
      if (data == null) {
        return "";
      }

      const info = data[network.name].tokens[token];

      if (info?.icon) {
        return info?.icon;
      }

      return "";
    },
    [network.name, data]
  );

  return {
    getSymbol,
    getIcon,
  };
};

export default useTokenInfo;
