declare type Params = {
    token1: string | null;
    token2: string | null;
    amount1: string | null;
    amount2: string | null;
    slippage: string;
    reverse: boolean;
    onSuccess?: (txHash: string) => void;
    onError?: (txHash?: string) => void;
};
export declare const useSwap: ({ token1, token2, amount1, amount2, slippage, reverse, onSuccess, onError, }: Params) => {
    simulated: {
        amount: string;
        spread: string;
        commission: string;
        price: string;
    } | null;
    minReceive: string | null;
    swap: () => Promise<void>;
    fee: import("@terra-money/terra.js").StdFee | null | undefined;
    txStep: import("@arthuryeti/terra").TxStep;
    txInfo: import("@terra-money/terra.js").TxInfo | undefined;
    txHash: string | undefined;
    error: unknown;
    reset: () => void;
};
export default useSwap;
