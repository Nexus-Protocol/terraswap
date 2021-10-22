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
    factory: "terra1ulgw0td86nvs4wtpsc80thv6xelk76ut7a7apj",
    router: "terra19qx5xe6q9ll4w0890ux7lv2p4mf3csd4qvt3ex",
  },
  testnet: {
    factory: "terra18qpjm4zkvqnpjpw0zn0tdr8gdzvt8au35v45xf",
    router: "terra14z80rwpd0alzj4xdtgqdmcqt9wd9xj5ffd60wp",
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
