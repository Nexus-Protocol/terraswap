import { Route } from "../../types";
declare type Params = {
    routes: Route[] | null;
    from: string | null;
    to: string | null;
};
export declare const useSwapRoute: ({ routes, from, to }: Params) => Route[] | null;
export default useSwapRoute;
