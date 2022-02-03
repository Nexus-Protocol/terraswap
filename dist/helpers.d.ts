import { PairResponse, Route } from "./types";
export declare const toRoutes: (allPairs: PairResponse[], r: PairResponse[], parentFrom: string | null, parentTo: string | null, parentContracts: string[], index?: number | undefined) => Route[];
export declare const formatPairsToRoutes: (pairs: PairResponse[]) => Route[];
