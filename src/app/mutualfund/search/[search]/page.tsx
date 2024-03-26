import { MutualFund } from '@/types/MutualFund';
import MutualFundList from '@/components/MutualFundList'
import { QParams } from '@/types/QueryParams';

const MutualFunds = async ({ params: { search } }: { params: QParams }) => {

    const data: MutualFund[] = await getData(search as string);
    return <MutualFundList data={data} />
}

async function getData(search: string) {
    const res = await fetch(`https://api.mfapi.in/mf/search?q=${search}`)
    return res.json();
}

export default MutualFunds;