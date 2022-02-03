import { Route } from "../../types";
declare type Params = {
    swapRoute: Route[] | null;
    token: string | null;
    amount: string | null;
    reverse: boolean;
};
export declare const useSwapSimulate: ({ swapRoute, token, amount, reverse, }: Params) => {
    amount: string;
    spread: string;
    commission: string;
    price: string;
} | null;
export default useSwapSimulate;
