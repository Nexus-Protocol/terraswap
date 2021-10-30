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
  swapRoute: Route[] | null;
  token: string | null;
  amount: string | null;
  reverse: boolean;
};

export const useSwapSimulate = ({
  swapRoute,
  token,
  amount,
  reverse,
}: Params) => {
  const { client } = useTerraWebapp();
  const { router } = useContracts();

  const { data, isLoading } = useQuery<
    unknown,
    unknown,
    SimulationResponse | ReverseSimulationResponse
  >(
    ["simulation", swapRoute, router, token, amount, reverse],
    () => {
      if (
        swapRoute == null ||
        token == null ||
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
          token,
          amount,
        });
      }

      return simulateMonoSwap({
        client,
        swapRoute,
        token,
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
