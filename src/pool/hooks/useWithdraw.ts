import { useMemo } from "react";
import { useAddress, useTransaction } from "@arthuryeti/terra";

import { createWithdrawMsgs, useGetStakerInfo } from "modules/pool";

type Params = {
  pairContract: string;
  lpTokenContract: string;
  stakingContract: string;
  amount: string;
  onSuccess: () => void;
};

export const useWithdraw = ({
  pairContract,
  lpTokenContract,
  stakingContract,
  amount,
  onSuccess,
}: Params) => {
  const address = useAddress();
  const { data: stakerInfo } = useGetStakerInfo({ stakingContract, address });

  const staked = useMemo(() => {
    if (stakerInfo == null) {
      return "0";
    }

    return stakerInfo.bond_amount;
  }, [stakerInfo]);

  const msgs = useMemo(() => {
    return createWithdrawMsgs(
      {
        pairContract,
        lpTokenContract,
        stakingContract,
        amount,
      },
      address
    );
  }, [address, pairContract, stakingContract, lpTokenContract, amount]);

  const { submit, ...rest } = useTransaction({
    msgs,
    onSuccess,
  });

  return {
    ...rest,
    staked,
    withdraw: submit,
  };
};

export default useWithdraw;
