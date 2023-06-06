import MutualFundHouseList from "@/components/MutualFundHouseList";
import SearchMutualFund from "@/components/SearchMutualFund";
import data from './api/fundlist/route';

export default function Home() {
  return (
    <main className="flex ">
      <SearchMutualFund />
      <MutualFundHouseList data={data}  />
    </main>
  )
}
