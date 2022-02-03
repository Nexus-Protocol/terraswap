declare type Contracts = {
    factory: string;
    router: string;
};
declare type Networks = {
    mainnet: Contracts;
    testnet: Contracts;
} & {
    [key: string]: Contracts;
};
export declare const useContracts: (initial?: Networks | undefined) => Contracts;
export default useContracts;
