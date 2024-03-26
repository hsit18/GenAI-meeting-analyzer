import Link from "next/link";

export default function Home() {
  return (
    <main className="flex ">
      <Link href="/mutualfund">Mutual Fund</Link>
      <Link href="/meeting">meeting</Link>
    </main>
  )
}
