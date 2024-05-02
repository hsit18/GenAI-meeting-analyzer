import {
    Stat,
    StatLabel,
    StatNumber,
    Spinner,
  } from "@chakra-ui/react";
import { ReactNode } from "react";

export const StatBox = ({ loading, label, value }: {loading: boolean; label: string, value: ReactNode}) => {
  return (
    <Stat
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: "10px",
        textAlign: "center",
        flexGrow: 0,
        padding: "16px",
        margin: "8px 16px",
        minWidth: "150px",
        minHeight: "100px",
      }}
    >
      <StatLabel>{label}</StatLabel>
      <StatNumber>
        {loading ? <Spinner /> : value}
      </StatNumber>
    </Stat>
  );
};
