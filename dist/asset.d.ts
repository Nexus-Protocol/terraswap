import { AssetInfo, CW20AssetInfo, NativeAssetInfo, Route } from "./types";
export declare function isNativeAssetInfo(value: NativeAssetInfo | CW20AssetInfo): value is NativeAssetInfo;
export declare const isNativeToken: (token?: string) => boolean;
export declare const isNativeAsset: (info: AssetInfo) => boolean;
export declare const toAssetInfo: (token: string) => AssetInfo;
declare type ToAssetOpts = {
    amount: string;
    token: string;
};
export declare const toAsset: ({ amount, token }: ToAssetOpts) => {
    amount: string;
    info: AssetInfo;
};
export declare const findAsset: (infos: AssetInfo[], token: string) => AssetInfo | null;
export declare const createAsset: (amount: string, route: Route[]) => {
    info: AssetInfo;
    amount: string;
};
export declare const getTokenDenom: (info: AssetInfo) => string;
export declare const getTokenDenoms: (infos: AssetInfo[]) => string[];
export {};
