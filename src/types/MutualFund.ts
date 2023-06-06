export type MutualFundMeta = {
    fund_house: string;
    scheme_type: string;
    scheme_category: string;
    scheme_code: number;
    scheme_name: string;
}

export type MutualFund = {
    meta: MutualFundMeta;
    schemeCode: number;
    schemeName: string;
}
