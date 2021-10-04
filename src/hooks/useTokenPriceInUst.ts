import { useTerra } from "@arthuryeti/terra";
import { ONE_TOKEN, ESTIMATE_TOKEN } from "../constants";
import { useSwapSimulate } from "./useSwapSimulate";

export const useTokenPriceInUst = (token1: string) => {
  const { routes } = useTerra();
  const data = useSwapSimulate({
    routes,
    amount: String(ONE_TOKEN),
    token1,
    token2: ESTIMATE_TOKEN,
    reverse: false,
  });

  return data?.price;
};

export default useTokenPriceInUst;
