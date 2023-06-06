import { MutualFund } from '../../../types/MutualFund';
import { QParams } from '../../../types/QueryParams';
import MutualFundSummary from '@/components/MutualFundSummary';

const MutualFundDetails = async ({ params: { id } }: { params: QParams }) => {

    const data: MutualFund = await getData(id as string);
    console.log(data);
    return (
        <MutualFundSummary data={data} />
    )
}

export async function getData(id: string) {
    const res = await fetch(`https://api.mfapi.in/mf/${id}`)
    return res.json();
}

export default MutualFundDetails;