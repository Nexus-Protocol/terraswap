import { useMemo } from "react";
import { num, useTerraWebapp } from "@arthuryeti/terra";
import { useQuery } from "react-query";

import {
  Route,
  SimulationResponse,
  ReverseSimulationResponse,
  MultiSimulationResponse,
} from "../../types";
import { useContracts } from "../../hooks/useContracts";
import { simulate as simulateMultiSwap } from "../multiSwap";
import { simulate as simulateMonoSwap } from "../monoSwap";
import { useSwapRoute } from "./useSwapRoute";

function isMultiSimulation(
  value:
    | ReverseSimulationResponse
    | SimulationResponse
    | MultiSimulationResponse,
): value is MultiSimulationResponse {
  return value.hasOwnProperty("amount");
}

function isReverseSimulation(
  value: ReverseSimulationResponse | SimulationResponse,
): value is ReverseSimulationResponse {
  return value.hasOwnProperty("offer_amount");
}

type Params = {
  routes: Route[] | null;
  from: string | null;
  to: string | null;
  amount: string | null;
  reverse: boolean;
};

export const useSwapSimulate = ({
  routes,
  from,
  to,
  amount,
  reverse,
}: Params) => {
  const { client } = useTerraWebapp();
  const contracts = useContracts();
  const swapRoute = useSwapRoute({ routes, from, to });
  const router = contracts.router;

  const { data, isLoading } = useQuery<
    unknown,
    unknown,
    SimulationResponse | ReverseSimulationResponse
  >(
    ["simulation", swapRoute, router, from, amount, reverse],
    () => {
      if (
        swapRoute == null ||
        from == null ||
        amount == null ||
        swapRoute.length == 0
      ) {
        return;
      }

      if (swapRoute.length > 1) {
        return simulateMultiSwap({
          client,
          swapRoute,
          router,
          token: from,
          amount,
        });
      }

      return simulateMonoSwap({
        client,
        swapRoute,
        token: from,
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

    if (isMultiSimulation(data)) {
      return {
        amount: data.amount,
        spread: "0",
        commission: "0",
        price: num(amount).div(data.amount).toString(),
        price2: num("1").div(num(amount).div(data.amount)).toString(),
      };
    }

    const spread = data.spread_amount;
    const commission = data.commission_amount;

    if (isReverseSimulation(data)) {
      return {
        amount: data.offer_amount,
        spread,
        commission,
        price: num(amount).div(data.offer_amount).toString(),
        price2: num("1").div(num(amount).div(data.offer_amount)).toString(),
      };
    }

    return {
      amount: data.return_amount,
      spread,
      commission,
      price: num(amount).div(data.return_amount).toString(),
      price2: num("1").div(num(amount).div(data.return_amount)).toString(),
    };
  }, [amount, data, isLoading]);
};

export default useSwapSimulate;
