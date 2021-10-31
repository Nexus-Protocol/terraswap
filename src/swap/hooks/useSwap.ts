import { useMemo } from "react";
import { useAddress, useTransaction } from "@arthuryeti/terra";

import { createSwapMsgs as createMonoSwapMsgs } from "../monoSwap";
import { minAmountReceive } from "../helpers";
import { useTerraswap } from "../../context";
import { useSwapRoute } from "./useSwapRoute";
import { useSwapSimulate } from "./useSwapSimulate";

type Params = {
  token1: string | null;
  token2: string | null;
  amount1: string | null;
  amount2: string | null;
  slippage: string;
  reverse: boolean;
  onSuccess?: (txHash: string) => void;
  onError?: (txHash?: string) => void;
};

export const useSwap = ({
  token1,
  token2,
  amount1,
  amount2,
  slippage,
  reverse = false,
  onSuccess,
  onError,
}: Params) => {
  const { routes } = useTerraswap();
  const address = useAddress();
  const swapRoute = useSwapRoute({ routes, from: token1, to: token2 });

  const simulated = useSwapSimulate({
    swapRoute,
    amount: reverse ? amount2 : amount1,
    token: reverse ? token2 : token1,
    reverse,
  });

  const minReceive = useMemo(() => {
    if (simulated == null || amount2 == null) {
      return null;
    }

    return minAmountReceive({
      amount: reverse ? amount2 : simulated.amount,
      maxSpread: slippage,
    });
  }, [simulated, slippage, amount2, reverse]);

  const msgs = useMemo(() => {
    if (
      swapRoute == null ||
      token1 == null ||
      amount1 == null ||
      simulated == null
    ) {
      return null;
    }

    if (swapRoute.length > 1) {
      return null;
    }

    return createMonoSwapMsgs(
      {
        token: token1,
        swapRoute,
        amount: amount1,
        slippage,
        price: simulated.price,
      },
      address,
    );
  }, [address, token1, amount1, simulated, slippage, swapRoute]);

  const { submit, ...rest } = useTransaction({ msgs, onSuccess, onError });

  return {
    ...rest,
    simulated,
    minReceive,
    swap: submit,
  };
};

export default useSwap;
