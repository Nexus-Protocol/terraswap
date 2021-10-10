import { useMemo } from "react";
import { num, useTerraWebapp } from "@arthuryeti/terra";
import { useQuery } from "react-query";

import {
  Routes,
  SimulationResponse,
  ReverseSimulationResponse,
} from "../../types";
import { useContracts } from "../../hooks/useContracts";
import { simulate as simulateMultiSwap } from "../multiSwap";
import { simulate as simulateMonoSwap } from "../monoSwap";
import { useSwapRoute } from "./useSwapRoute";

function isTypeReverseSimulationResponse(
  value: ReverseSimulationResponse | SimulationResponse,
): value is ReverseSimulationResponse {
  return value.hasOwnProperty("offer_amount");
}

type Params = {
  routes: Routes | null;
  token1: string | null;
  token2: string | null;
  amount: string | null;
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

  const { data, isLoading } = useQuery<
    unknown,
    unknown,
    SimulationResponse | ReverseSimulationResponse
  >(
    ["simulation", swapRoute, router, token1, amount, reverse],
    () => {
      if (swapRoute == null || token1 == null || amount == null) {
        return;
      }

      if (swapRoute.length > 1) {
        return simulateMultiSwap({
          client,
          swapRoute,
          router,
          token: token1,
          amount,
        });
      }

      return simulateMonoSwap({
        client,
        swapRoute,
        token: token1,
        amount,
        reverse,
      });
    },
    {
      enabled: swapRoute != null,
    },
  );

  return useMemo(() => {
    if (data == null || amount == null || isLoading) {
      return null;
    }

    const spread = data.spread_amount;
    const commission = data.commission_amount;

    if (isTypeReverseSimulationResponse(data)) {
      return {
        amount: data.offer_amount,
        spread,
        commission,
        price: num(amount).div(data.offer_amount).toFixed(6).toString(),
        price2: num("1")
          .div(num(amount).div(data.offer_amount))
          .toFixed(6)
          .toString(),
      };
    }

    return {
      amount: data.return_amount,
      spread,
      commission,
      price: num(amount).div(data.return_amount).toFixed(6).toString(),
      price2: num("1")
        .div(num(amount).div(data.return_amount))
        .toFixed(6)
        .toString(),
    };
  }, [amount, data, isLoading]);
};

export default useSwapSimulate;
