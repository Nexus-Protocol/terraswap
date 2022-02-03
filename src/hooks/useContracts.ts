import { useMemo } from "react";
import { useTerraWebapp } from "@arthuryeti/terra";

type Contracts = {
  factory: string;
  router: string;
};

type Networks = {
  mainnet: Contracts;
  testnet: Contracts;
} & { [key: string]: Contracts };

const defaultContracts: Networks = {
  mainnet: {
    factory: "terra1fnywlw4edny3vw44x04xd67uzkdqluymgreu7g",
    router: "terra16t7dpwwgx9n3lq6l6te3753lsjqwhxwpday9zx",
  },
  testnet: {
    factory: "terra15jsahkaf9p0qu8ye873p0u5z6g07wdad0tdq43",
    router: "terra13wf295fj9u209nknz2cgqmmna7ry3d3j5kv7t4",
  },
};

export const useContracts = (initial?: Networks): Contracts => {
  const {
    network: { name },
  } = useTerraWebapp();

  const contracts = initial ?? defaultContracts;

  return useMemo(() => {
    return contracts[name];
  }, [contracts, name]);
};

export default useContracts;
