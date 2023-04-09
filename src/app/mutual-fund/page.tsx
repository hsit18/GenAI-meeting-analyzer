import { MutualFund } from '../../types/MutualFund';
import MutualFundList from '../../components/MutualFundList'

const MutualFundDetails = async () => {

    const data: MutualFund[] = await getData();
    return <MutualFundList data={data} />
}

export async function getData() {
    const res = await fetch(`https://api.mfapi.in/mf/search?q=hdfc`)
    return res.json();
}

export default MutualFundDetails;