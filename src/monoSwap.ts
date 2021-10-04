import {
  toToken,
  createAsset,
  isNativeToken,
  toBase64,
} from "@arthuryeti/terra";
import { LCDClient, Coin, MsgExecuteContract } from "@terra-money/terra.js";

import {
  PairResponse,
  SimulationResponse,
  ReverseSimulationResponse,
} from "./types";

type GetQueryParams = {
  client: LCDClient;
  swapRoute: PairResponse[];
  token: string;
  amount: string;
  reverse?: boolean;
};

export const simulate = ({
  client,
  swapRoute,
  token,
  amount,
  reverse = false,
}: GetQueryParams) => {
  const { contract_addr } = swapRoute[0];

  if (reverse) {
    return client.wasm.contractQuery<ReverseSimulationResponse>(contract_addr, {
      reverse_simulation: {
        ask_asset: toToken({ token, amount }),
      },
    });
  }

  return client.wasm.contractQuery<SimulationResponse>(contract_addr, {
    simulation: {
      offer_asset: toToken({ token, amount }),
    },
  });
};

type CreateSwapMsgsOpts = {
  swapRoute: PairResponse[];
  token: string;
  amount: string;
  slippage: string;
};

const createSwapMsgs = (
  { swapRoute, token, amount, slippage }: CreateSwapMsgsOpts,
  sender: string
) => {
  const [{ contract_addr }] = swapRoute;

  // @ts-expect-error
  const offerAsset = createAsset(token, amount, swapRoute);

  const isNative = isNativeToken(offerAsset.info);

  if (isNative) {
    return [
      new MsgExecuteContract(
        sender,
        contract_addr,
        {
          swap: {
            offer_asset: offerAsset,
            max_spread: slippage,
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
        contract_addr,
        msg: toBase64({
          swap: {
            max_spread: slippage,
          },
        }),
      },
    }),
  ];
};

export default {
  createSwapMsgs,
  simulate,
};
