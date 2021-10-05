import { Coin, MsgExecuteContract } from "@terra-money/terra.js";
import { getTokenDenom, isNativeAsset } from "@arthuryeti/terraswap";

import { Asset, PoolResponse } from "../types";

type CreateProvideMsgsOptions = {
  pool: PoolResponse;
  coin1: Coin;
  coin2: Coin;
  contract: string;
  slippage: string;
};

const createProvideMsgs = (
  options: CreateProvideMsgsOptions,
  sender: string
): MsgExecuteContract[] => {
  const { contract, pool, coin1, coin2, slippage } = options;

  const assets: Asset[] = pool.assets.map((asset) => ({
    info: asset.info,
    amount:
      getTokenDenom(asset.info) === coin1.denom
        ? coin1.amount.toString()
        : coin2.amount.toString(),
  }));

  const coins = assets
    .filter((asset) => isNativeAsset(asset.info))
    .map((asset) => new Coin(getTokenDenom(asset.info), asset.amount));

  const allowanceMsgs = assets.reduce<MsgExecuteContract[]>((acc, asset) => {
    if (isNativeAsset(asset.info)) {
      return acc;
    }

    return [
      ...acc,
      new MsgExecuteContract(
        sender,
        asset.info.token.contract_addr,
        {
          increase_allowance: {
            amount: asset.amount,
            spender: contract,
          },
        },
        coins
      ),
    ];
  }, []);

  const executeMsg = {
    auto_stake: { assets, slippage_tolerance: slippage },
  };

  const msg = new MsgExecuteContract(sender, contract, executeMsg, coins);

  return [...allowanceMsgs, msg];
};

export default createProvideMsgs;
