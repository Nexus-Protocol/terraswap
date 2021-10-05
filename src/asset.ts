import { AssetInfo, PairResponse } from "./types";

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

export const findAsset = (infos: AssetInfo[], token: string) => {
  const asset = infos.find((info) => {
    if (isNativeAsset(info)) {
      // @ts-expect-error
      return info.native_token.denom === token;
    }

    // @ts-expect-error
    return info.token.contract_addr === token;
  });

  if (!asset) {
    throw new Error("Asset not found");
  }

  return asset;
};

export const createAsset = (
  from: string,
  amount: string,
  route: PairResponse[]
): any => {
  const [{ asset_infos }] = route;
  const info = findAsset(asset_infos, from);

  return {
    info,
    amount,
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
