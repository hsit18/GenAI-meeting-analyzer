import {MutualFund} from '../../types/MutualFund';

const MutualFundDetails = async () => {

    const data: MutualFund[] = await getData();
    return <div>
        Search Mutual fund
        <ul>
            {data.map((d: MutualFund) => <li key={d.schemeCode}>{d.schemeCode} - {d.schemeName}</li>)}
        </ul>
    </div>
}

export async function getData() {
    const res = await fetch(`https://api.mfapi.in/mf/search?q=hdfc`)
    return res.json();
}

export default MutualFundDetails;