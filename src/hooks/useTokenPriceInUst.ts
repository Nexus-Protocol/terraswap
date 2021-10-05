import { BN } from "@arthuryeti/terra";
import { ONE_TOKEN, ESTIMATE_TOKEN } from "../constants";
import { useTerraswap } from "../context";
import { useSwapSimulate } from "../swap";

export const useTokenPriceInUst = (token1: string) => {
  const { routes } = useTerraswap();

  // TODO: Change type
  const data: any = useSwapSimulate({
    routes,
    amount: String(ONE_TOKEN),
    token1,
    token2: ESTIMATE_TOKEN,
    reverse: false,
  });

  if (token1 == "uusd") {
    return String(ONE_TOKEN);
  }

  if (data == null) {
    return null;
  }

  return BN("1").div(data.price).times(ONE_TOKEN).toFixed();
};

export default useTokenPriceInUst;
