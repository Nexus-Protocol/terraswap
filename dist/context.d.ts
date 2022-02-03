import { FC, ReactNode, Context, Consumer } from "react";
import { PairResponse, Route, Tokens, Data } from "./types";
declare type Terraswap = {
    pairs: PairResponse[] | null;
    routes: Route[] | null;
    tokens: Tokens | null;
    data: Data | null;
};
export declare const TerraswapContext: Context<Terraswap>;
declare type Props = {
    children: ReactNode;
    data: Data;
};
export declare const TerraswapProvider: FC<Props>;
export declare function useTerraswap(): Terraswap;
export declare const TerraswapConsumer: Consumer<Terraswap>;
export {};
