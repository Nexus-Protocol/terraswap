import { PoolResponse } from "../../types";
declare type Response = string | null;
declare type Params = {
    pool: PoolResponse | null;
    amount1: string | null;
};
export declare const useShareOfPool: ({ pool, amount1 }: Params) => Response;
export default useShareOfPool;
