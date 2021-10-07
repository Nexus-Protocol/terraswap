import { toBase64 } from "@arthuryeti/terra";
import { LCDClient, Coin, MsgExecuteContract } from "@terra-money/terra.js";

import { PairResponse } from "../types";
import { getTokenDenom, isNativeAsset, findAsset } from "../asset";

type GetSwapOperationsParams = {
  token: string;
  swapRoute: PairResponse[];
  operations?: any[] | any;
};

export const getSwapOperations = ({
  token,
  swapRoute,
  operations = [],
}: GetSwapOperationsParams): any | any[] => {
  if (swapRoute == null || swapRoute.length === 0) {
    return operations;
  }

  const [{ asset_infos }] = swapRoute;

  const sortedAssets = [...asset_infos].sort((a) => {
    return getTokenDenom(a) === token ? -1 : 1;
  });

  let operation: any = {
    terra_swap: {
      offer_asset_info: sortedAssets[0],
      ask_asset_info: sortedAssets[1],
    },
  };

  if (sortedAssets.every(isNativeAsset)) {
    operation = {
      native_swap: {
        // @ts-expect-error
        offer_denom: sortedAssets[0].native_token.denom,
        // @ts-expect-error
        ask_denom: sortedAssets[1].native_token.denom,
      },
    };
  }

  const nextToken = getTokenDenom(sortedAssets[1]);

  return getSwapOperations({
    token: nextToken,
    swapRoute: swapRoute.slice(1),
    operations: [...operations, operation],
  });
};

type GetQueryParams = {
  client: LCDClient;
  router: string;
  swapRoute: PairResponse[];
  token: string;
  amount: string;
  reverse?: boolean;
};

export const simulate = ({
  client,
  swapRoute,
  router,
  token,
  amount,
}: GetQueryParams) => {
  const operations = getSwapOperations({ token, swapRoute });

  return client.wasm.contractQuery(router, {
    simulate_swap_operations: {
      offer_amount: amount,
      operations,
    },
  });
};

type CreateSwapMsgsOpts = {
  swapRoute: PairResponse[];
  router: string;
  token: string;
  amount: string;
  minReceive: string | null;
};

const createSwapMsgs = (
  { swapRoute, token, router, amount, minReceive }: CreateSwapMsgsOpts,
  sender: string
): MsgExecuteContract[] => {
  if (minReceive == null) {
    return [];
  }

  const [{ asset_infos }] = swapRoute;

  const info = findAsset(asset_infos, token);

  const isNative = isNativeAsset(info);

  const operations = getSwapOperations({ token, swapRoute });

  if (isNative) {
    return [
      new MsgExecuteContract(
        sender,
        router,
        {
          execute_swap_operations: {
            offer_amount: amount,
            operations,
            minimum_receive: minReceive,
          },
        },
        [new Coin(token, amount)]
      ),
    ];
  }

  return [
    new MsgExecuteContract(sender, token, {
      send: {
        amount,
        contract: router,
        msg: toBase64({
          execute_swap_operations: {
            offer_amount: amount,
            operations,
            minimum_receive: minReceive,
          },
        }),
      },
    }),
  ];
};

export default {
  simulate,
  createSwapMsgs,
};
