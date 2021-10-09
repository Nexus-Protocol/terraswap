import { useMemo } from "react";
import { BN, useTerraWebapp } from "@arthuryeti/terra";
import { useQuery } from "react-query";

import useContracts from "../../hooks/useContracts";
import { useSwapRoute } from "./useSwapRoute";
import monoSwap from "../monoSwap";
import multiSwap from "../multiSwap";

type Params = {
  routes: any;
  token1: string;
  token2: string;
  amount: string;
  reverse: boolean;
};

export const useSwapSimulate = ({
  routes,
  token1,
  token2,
  amount,
  reverse,
}: Params) => {
  const { client } = useTerraWebapp();
  const contracts = useContracts();
  const swapRoute = useSwapRoute({ routes, token1, token2 });
  const router = contracts.router;

  const { data, isLoading } = useQuery<unknown, unknown, any>(
    ["simulation", swapRoute, router, token1, amount, reverse],
    () => {
      if (swapRoute == null) {
        return;
      }

      if (swapRoute.length > 1) {
        return multiSwap.simulate({
          client,
          swapRoute,
          router,
          token: token1,
          amount,
        });
      }

      return monoSwap.simulate({
        client,
        swapRoute,
        token: token1,
        amount,
        reverse,
      });
    },
    {
      enabled: swapRoute != null,
    }
  );

  return useMemo(() => {
    if (data == null || isLoading) {
      return null;
    }

    const spread = data.spread_amount;
    const commission = data.commission_amount;

    if (reverse) {
      return {
        amount: data.offer_amount,
        spread,
        commission,
        price: BN(amount).div(data.offer_amount).toFixed(6).toString(),
        price2: BN("1")
          .div(BN(amount).div(data.offer_amount))
          .toFixed(6)
          .toString(),
      };
    }

    return {
      amount: data.return_amount,
      spread,
      commission,
      price: BN(amount).div(data.return_amount).toFixed(6).toString(),
      price2: BN("1")
        .div(BN(amount).div(data.return_amount))
        .toFixed(6)
        .toString(),
    };
  }, [amount, data, reverse]);
};

export default useSwapSimulate;
