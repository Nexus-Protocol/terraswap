import { useCallback } from "react";
import { useTerraWebapp } from "@arthuryeti/terra";

import { useTerraswap } from "../context";

export const useTokenInfo = () => {
  const {
    network: { name },
  } = useTerraWebapp();
  const { data } = useTerraswap();

  const getSymbol = useCallback(
    (token: string | null) => {
      if (data == null || token == null) {
        return null;
      }

      return data[name].tokens[token].symbol || token;
    },
    [name, data],
  );

  const getIcon = useCallback(
    (token: string | null) => {
      if (data == null || token == null) {
        return null;
      }

      const info = data[name].tokens[token];

      return info.icon || null;
    },
    [name, data],
  );

  return {
    getSymbol,
    getIcon,
  };
};

export default useTokenInfo;
