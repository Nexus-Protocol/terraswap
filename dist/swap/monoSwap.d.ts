import { LCDClient, MsgExecuteContract } from "@terra-money/terra.js";
import { Route, SimulationResponse, ReverseSimulationResponse } from "../types";
declare type GetQueryParams = {
    client: LCDClient;
    swapRoute: Route[];
    token: string;
    amount: string;
    reverse?: boolean;
};
export declare const simulate: ({ client, swapRoute, token, amount, reverse, }: GetQueryParams) => Promise<ReverseSimulationResponse> | Promise<SimulationResponse> | null;
declare type CreateSwapMsgsOpts = {
    swapRoute: Route[];
    token: string;
    amount: string;
    slippage: string;
    price: string;
};
export declare const createSwapMsgs: ({ swapRoute, token, amount, slippage, price }: CreateSwapMsgsOpts, sender: string) => MsgExecuteContract[];
export {};
