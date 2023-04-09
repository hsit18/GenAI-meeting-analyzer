import { MutualFund } from '../../../types/MutualFund';
import { QParams } from '../../../types/QueryParams';

const MutualFundDetails = async ({ params: { id } }: {params: QParams}) => {

    const data: MutualFund = await getData(id as string);
    return <div>
        Mutual fund Details
        {data.meta.fund_house}
    </div>
}

export async function getData(id: string) {
    const res = await fetch(`https://api.mfapi.in/mf/${id}`)
    return res.json();
}

export default MutualFundDetails;