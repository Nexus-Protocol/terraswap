import { num } from "@arthuryeti/terra";
import { ONE_TOKEN, ESTIMATE_TOKEN } from "../constants";
import { useTerraswap } from "../context";
import { useSwapSimulate } from "../swap";

export const useTokenPriceInUst = (token1: string | null) => {
  const { routes } = useTerraswap();

  const data = useSwapSimulate({
    routes,
    amount: String(ONE_TOKEN),
    from: token1,
    to: ESTIMATE_TOKEN,
    reverse: false,
  });

  if (token1 == "uusd") {
    return String(ONE_TOKEN);
  }

  if (data == null) {
    return null;
  }

  return num("1").div(data.price).times(ONE_TOKEN).toFixed();
};

export default useTokenPriceInUst;
