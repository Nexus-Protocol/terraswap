import { AssetInfo } from "./types";

export const isNativeToken = (token: string = ""): boolean => {
  return token.startsWith("u");
};

export const isNativeAsset = (info: AssetInfo): boolean => {
  return "native_token" in info;
};

export const toAssetInfo = (token: string): AssetInfo => {
  if (isNativeToken(token)) {
    return { native_token: { denom: token } };
  }

  return { token: { contract_addr: token } };
};

type ToAssetOpts = {
  amount: string;
  token: string;
};

export const toAsset = ({ amount, token }: ToAssetOpts) => {
  return {
    amount,
    info: toAssetInfo(token),
  };
};

export const getTokenDenom = (info: AssetInfo): string => {
  if (isNativeAsset(info)) {
    //@ts-expect-error
    return info.native_token.denom;
  }

  //@ts-expect-error
  return info.token?.contract_addr;
};

export const getTokenDenoms = (infos: AssetInfo[]): string[] => {
  return infos.map((info) => getTokenDenom(info));
};
