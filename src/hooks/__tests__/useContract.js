import walletProvider from "@terra-money/wallet-provider";
import { renderHook } from "@testing-library/react-hooks";

import { useContracts } from "../useContracts";

jest.mock("@terra-money/wallet-provider", () => ({
  useWallet: () => ({
    network: { name: "testnet" },
  }),
}));

test("exposes testnet contracts", () => {
  jest.spyOn(walletProvider, "useWallet").mockImplementation(() => ({
    network: { name: "testnet" },
  }));
  const { result } = renderHook(useContracts);

  expect(result.current).toStrictEqual({
    factory: "terra18qpjm4zkvqnpjpw0zn0tdr8gdzvt8au35v45xf",
    router: "terra14z80rwpd0alzj4xdtgqdmcqt9wd9xj5ffd60wp",
  });
});

test("exposes mainnet contracts", () => {
  jest.spyOn(walletProvider, "useWallet").mockImplementation(() => ({
    network: { name: "mainnet" },
  }));
  const { result } = renderHook(useContracts);

  expect(result.current).toStrictEqual({
    factory: "terra1ulgw0td86nvs4wtpsc80thv6xelk76ut7a7apj",
    router: "terra19qx5xe6q9ll4w0890ux7lv2p4mf3csd4qvt3ex",
  });
});
