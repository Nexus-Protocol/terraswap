import { PoolResponse } from "../../types";
declare type Params = {
    pool: PoolResponse | null;
};
export declare const useTotalShareInUst: ({ pool }: Params) => string | null;
export default useTotalShareInUst;
