import { useMemo } from "react";
import { useAddress, useTransaction } from "@arthuryeti/terra";

import useContracts from "../../hooks/useContracts";
import { useSwapRoute } from "./useSwapRoute";
import useSwapSimulate from "./useSwapSimulate";
import monoSwap from "../monoSwap";
import multiSwap from "../multiSwap";
import { minAmountReceive } from "../helpers";
import { useTerraswap } from "../../context";

type Params = {
  token1: string;
  token2: string;
  amount: string;
  slippage: string;
  onSuccess?: (txHash: string) => void;
  onError?: (txHash?: string) => void;
};

export const useSwap = ({
  token1,
  token2,
  amount,
  slippage,
  onSuccess,
  onError,
}: Params) => {
  const { routes } = useTerraswap();
  const address = useAddress();
  const contracts = useContracts();
  const swapRoute = useSwapRoute({ routes, token1, token2 });
  const router = contracts.router;

  const simData = useSwapSimulate({
    routes,
    amount: amount ?? "1000000",
    token1,
    token2,
    reverse: false,
  });

  const minReceive = useMemo(() => {
    if (simData == null) {
      return null;
    }

    return minAmountReceive({
      amount: simData.amount,
      maxSpread: slippage,
    });
  }, [simData]);

  const msgs = useMemo(() => {
    if (swapRoute == null || amount == null) {
      return null;
    }

    if (swapRoute.length > 1) {
      return multiSwap.createSwapMsgs(
        {
          token: token1,
          swapRoute,
          amount,
          minReceive,
          router,
        },
        address
      );
    }

    return monoSwap.createSwapMsgs(
      {
        token: token1,
        swapRoute,
        amount,
        slippage,
      },
      address
    );
  }, [address, token1, amount, minReceive, slippage, router, swapRoute]);

  const { submit, ...rest } = useTransaction({ msgs, onSuccess, onError });

  return {
    ...rest,
    simulated: simData,
    minReceive,
    swap: submit,
  };
};

export default useSwap;
