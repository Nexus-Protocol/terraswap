import { useMemo } from "react";
import {
  useTerra,
  isValidAmount,
  useAddress,
  useTransaction,
} from "@arthuryeti/terra";
import {} from "lodash";

import useContracts from "./useContracts";
import { useSwapRoute } from "./useSwapRoute";
import useSwapSimulate from "./useSwapSimulate";
import monoSwap from "../monoSwap";
import multiSwap from "../multiSwap";
import { minAmountReceive } from "../math";

type Params = {
  token1: string;
  token2: string;
  amount: string;
  slippage: string;
  onSuccess: () => void;
  onError: () => void;
};

export const useSwap = ({
  token1,
  token2,
  amount,
  slippage,
  onSuccess,
}: Params) => {
  const { routes } = useTerra();
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
      offerAmount: simData.amount,
      maxSpread: simData.spread,
      beliefPrice: simData.price,
      commission: simData.commission,
    });
  }, [simData]);

  const msgs = useMemo(() => {
    if (!isValidAmount(amount) || swapRoute == null) {
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

  // @ts-expect-error
  const { submit, ...rest } = useTransaction({ msgs, onSuccess });

  return {
    ...rest,
    simulated: simData,
    minReceive,
    swap: submit,
  };
};

export default useSwap;
