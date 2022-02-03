export declare type CW20AssetInfo = {
    token: {
        contract_addr: string;
    };
};
export declare type NativeAssetInfo = {
    native_token: {
        denom: string;
    };
};
export declare type AssetInfo = CW20AssetInfo | NativeAssetInfo;
export declare type CW20Asset = {
    amount: string;
    info: CW20AssetInfo;
};
export declare type NativeAsset = {
    amount: string;
    info: NativeAssetInfo;
};
export declare type Asset = CW20Asset | NativeAsset;
export declare type Pair = {
    pair: {
        asset_infos: [AssetInfo, AssetInfo];
    };
};
export declare type PairResponse = {
    asset_infos: [AssetInfo, AssetInfo];
    /** Pair contract address */
    contract_addr: string;
    /** LP contract address (not lp minter cw20 token) */
    liquidity_token: string;
};
export declare type ProvideLiquidity = {
    provide_liquidity: {
        assets: [Asset, Asset];
        slippage_tolerance?: string;
        receiver?: string;
    };
};
export declare type Swap = {
    swap: {
        offer_asset: Asset;
        belief_price?: string;
        max_spread?: string;
        to?: string;
    };
};
export declare type SwapHook = {
    swap: {
        belief_price?: string;
        max_spread?: string;
        to?: string;
    };
};
export declare type Pool = {
    pool: {};
};
export declare type PoolResponse = {
    total_share: string;
    assets: [Asset, Asset];
};
export declare type Simulation = {
    simulation: {
        offer_asset: {
            info: AssetInfo;
            amount: string;
        };
    };
};
export declare type SimulationResponse = {
    commission_amount: string;
    return_amount: string;
    spread_amount: string;
};
export declare type ReverseSimulation = {
    reverse_simulation: {
        ask_asset: {
            info: AssetInfo;
            amount: string;
        };
    };
};
export declare type ReverseSimulationResponse = {
    commission_amount: string;
    offer_amount: string;
    spread_amount: string;
};
export declare type MultiSimulationResponse = {
    amount: string;
};
export declare type NativeSwapOperation = {
    native_swap: {
        offer_denom: string;
        ask_denom: string;
    };
};
export declare type CW20SwapOperation = {
    terra_swap: {
        offer_asset_info: AssetInfo;
        ask_asset_info: AssetInfo;
    };
};
export declare type SwapOperation = NativeSwapOperation | CW20SwapOperation;
