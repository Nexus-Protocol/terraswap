import { useMemo } from "react";
import { useAddress, useTransaction } from "@arthuryeti/terra";

import { useContracts } from "../../hooks/useContracts";
import { createSwapMsgs as createMonoSwapMsgs } from "../monoSwap";
import { createSwapMsgs as createMultiSwapMsgs } from "../multiSwap";
import { minAmountReceive } from "../helpers";
import { useTerraswap } from "../../context";
import { useSwapRoute } from "./useSwapRoute";
import { useSwapSimulate } from "./useSwapSimulate";

type Params = {
  token1: string | null;
  token2: string | null;
  amount: string | null;
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

  const simulated = useSwapSimulate({
    routes,
    amount: amount ?? "1000000",
    token1,
    token2,
    reverse: false,
  });

  const minReceive = useMemo(() => {
    if (simulated == null) {
      return null;
    }

    return minAmountReceive({
      amount: simulated.amount,
      maxSpread: slippage,
    });
  }, [simulated, slippage]);

  const msgs = useMemo(() => {
    if (
      swapRoute == null ||
      token1 == null ||
      amount == null ||
      simulated == null
    ) {
      return null;
    }

    if (swapRoute.length > 1) {
      return createMultiSwapMsgs(
        {
          token: token1,
          swapRoute,
          amount,
          minReceive,
          router,
        },
        address,
      );
    }

    return createMonoSwapMsgs(
      {
        token: token1,
        swapRoute,
        amount,
        slippage,
        price: simulated.price2,
      },
      address,
    );
  }, [
    address,
    token1,
    amount,
    simulated,
    minReceive,
    slippage,
    router,
    swapRoute,
  ]);

  const { submit, ...rest } = useTransaction({ msgs, onSuccess, onError });

  return {
    ...rest,
    simulated,
    minReceive,
    swap: submit,
  };
};

export default useSwap;
