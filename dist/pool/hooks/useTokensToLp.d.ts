import { PoolResponse } from "../../types";
declare type Params = {
    pool: PoolResponse | null;
    amount1: string | null;
};
export declare const useTokensToLp: ({ pool, amount1 }: Params) => string | null;
export default useTokensToLp;
