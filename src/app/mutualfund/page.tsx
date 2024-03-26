
import MutualFundHouseList from "@/components/MutualFundHouseList";
import SearchMutualFund from "@/components/SearchMutualFund";
import { data } from '@/data/fund';

const mutualfund = async () => {
    return (
        <>
            <SearchMutualFund />
            <MutualFundHouseList data={data} />
        </>
    )
}

export default mutualfund;