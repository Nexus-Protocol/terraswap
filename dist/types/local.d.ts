import { PairResponse } from "./terraswap";
export declare type Token = {
    protocol: string;
    symbol: string;
    token: string;
    icon: string;
};
export declare type Tokens = {
    [token: string]: Token;
};
export declare type Route = {
    contract_addr: string;
    from: string;
    to: string;
    children: Route[];
};
export declare type DataNetwork = {
    tokens: Tokens;
    pairs: PairResponse[];
};
export declare type Data = {
    mainnet: DataNetwork;
    testnet: DataNetwork;
} & {
    [key: string]: DataNetwork;
};
