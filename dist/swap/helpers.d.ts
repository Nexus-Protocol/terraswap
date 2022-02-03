declare type minAmountReceiveParams = {
    amount: string;
    maxSpread: string;
};
export declare const minAmountReceive: ({ amount, maxSpread, }: minAmountReceiveParams) => string;
declare type PriceImpactParams = {
    offerAmount: string;
    maxSpread: string;
};
export declare const priceImpact: ({ offerAmount, maxSpread, }: PriceImpactParams) => string;
export {};
