import { PoolResponse } from "../../types";
declare type Response = {
    [key: string]: string;
} | null;
declare type Params = {
    pool: PoolResponse | null;
    amount: string | null | undefined;
};
export declare const useLpToTokens: ({ pool, amount }: Params) => Response;
export default useLpToTokens;
