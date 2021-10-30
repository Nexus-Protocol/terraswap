import { num } from "@arthuryeti/terra";
import { ONE_TOKEN, ESTIMATE_TOKEN } from "../constants";
import { useTerraswap } from "../context";
import { useSwapSimulate, useSwapRoute } from "../swap";

export const useTokenPriceInUst = (token: string | null) => {
  const { routes } = useTerraswap();
  const swapRoute = useSwapRoute({ routes, from: token, to: ESTIMATE_TOKEN });

  const data = useSwapSimulate({
    swapRoute,
    amount: String(ONE_TOKEN),
    token,
    reverse: false,
  });

  if (token == "uusd") {
    return String(ONE_TOKEN);
  }

  if (data == null) {
    return null;
  }

  return num("1").div(data.price).times(ONE_TOKEN).toFixed();
};

export default useTokenPriceInUst;
