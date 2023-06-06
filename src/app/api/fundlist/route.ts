import { NextResponse } from "next/server";

const data: string[] = [
  "Aditya Birla Sun Life Mutual Fund",
  "Axis Mutual Fund",
  "Bandhan Mutual Fund",
  "Baroda BNP Paribas Mutual Fund",
  "Canara Robeco Mutual Fund",
  "DSP Mutual Fund",
  "Edelweiss Mutual Fund",
  "Franklin Templeton Mutual Fund",
  "HDFC Mutual Fund",
  "HSBC Mutual Fund",
  "ICICI Prudential Mutual Fund",
  "Invesco Mutual Fund",
  "JM Financial Mutual Fund",
  "Kotak Mahindra Mutual Fund",
  "LIC Mutual Fund",
  "Mahindra Manulife Mutual Fund",
  "Mirae Asset Mutual Fund",
  "Motilal Oswal Mutual Fund",
  "Navi Mutual Fund",
  "Nippon India Mutual Fund",
  "PGIM India Mutual Fund",
  "PPFAS Mutual Fund",
  "Quant Mutual Fund",
  "Quantum Mutual Fund",
  "SBI Mutual Fund",
  "Sundaram Mutual Fund",
  "Tata Mutual Fund",
  "UTI Mutual Fund",
];

export async function GET() {
  return NextResponse.json(data);
}

export default data;