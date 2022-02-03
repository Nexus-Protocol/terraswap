import { LCDClient, MsgExecuteContract } from "@terra-money/terra.js";
import { SwapOperation, Route } from "../types";
declare type GetSwapOperationsParams = {
    swapRoute: Route[] | null;
    operations?: SwapOperation[];
};
export declare const getSwapOperations: ({ swapRoute, operations, }: GetSwapOperationsParams) => SwapOperation[];
declare type GetQueryParams = {
    client: LCDClient;
    router: string;
    swapRoute: Route[];
    token: string;
    amount: string;
    reverse?: boolean;
};
export declare const simulate: ({ client, swapRoute, router, amount, }: GetQueryParams) => Promise<unknown>;
declare type CreateSwapMsgsOpts = {
    swapRoute: Route[];
    router: string;
    token: string;
    amount: string;
    minReceive: string | null;
};
export declare const createSwapMsgs: ({ swapRoute, token, router, amount, minReceive }: CreateSwapMsgsOpts, sender: string) => MsgExecuteContract[] | null;
export {};
