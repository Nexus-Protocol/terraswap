import { useMemo } from "react";
import { useAddress } from "@arthuryeti/terra";
import { getTokenDenom } from "../../asset";
import { useTokenPriceInUst } from "../../hooks/useTokenPriceInUst";

import {
  calculateSharePrice,
  useGetPool,
  useGetStakerInfo,
  calculateTokensAmounts,
} from "../helpers";

type Params = {
  pairContract: string;
  stakingContract: string;
};

export const usePool: any = ({ pairContract, stakingContract }: Params) => {
  const address = useAddress();
  const { data: pool } = useGetPool(pairContract);
  const { data: stakerInfo } = useGetStakerInfo({ stakingContract, address });

  const staked = useMemo(() => {
    if (stakerInfo == null) {
      return "0.00";
    }

    return stakerInfo.bond_amount;
  }, [stakerInfo]);

  const token1 = useMemo(() => {
    if (pool == null) {
      return null;
    }

    return getTokenDenom(pool.assets[0].info);
  }, [pool]);

  const token2 = useMemo(() => {
    if (pool == null) {
      return null;
    }

    return getTokenDenom(pool.assets[1].info);
  }, [pool]);

  const token1Price = useTokenPriceInUst(token1);
  const token2Price = useTokenPriceInUst(token2);

  const myShareInUST = useMemo(() => {
    if (
      token1Price == null ||
      token2Price == null ||
      staked == null ||
      pool == null
    ) {
      return "0.00";
    }

    return calculateSharePrice(pool, staked, token1Price, token2Price);
  }, [pool, staked, token1Price, token2Price]);

  const totalShareInUST = useMemo(() => {
    if (token1Price == null || token2Price == null || pool == null) {
      return "0.00";
    }

    return calculateSharePrice(
      pool,
      pool.total_share,
      token1Price,
      token2Price
    );
  }, [pool, token1Price, token2Price]);

  const tokenAmounts = useMemo(() => {
    if (pool == null || staked == null) {
      return null;
    }

    return calculateTokensAmounts(pool, staked);
  }, [pool, staked]);

  return {
    ...pool,
    staked,
    myShareInUST,
    totalShareInUST,
    tokenAmounts,
    token1,
    token2,
  };
};

export default usePool;
