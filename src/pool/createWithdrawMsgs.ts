import { toBase64 } from "@arthuryeti/terra";
import { MsgExecuteContract } from "@terra-money/terra.js";

type CreateWithdrawMsgsOptions = {
  pairContract: string;
  lpTokenContract: string;
  amount: string;
};

const createWithdrawMsgs = (
  options: CreateWithdrawMsgsOptions,
  sender: string
) => {
  const { pairContract, lpTokenContract, amount } = options;

  const msg = {
    send: {
      contract: pairContract,
      amount,
      msg: toBase64({
        withdraw_liquidity: {},
      }),
    },
  };

  return [new MsgExecuteContract(sender, lpTokenContract, msg)];
};

export default createWithdrawMsgs;
