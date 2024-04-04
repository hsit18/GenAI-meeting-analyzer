"use client";

import { askModel } from "@/utils/apiUtils";
import { useEffect, useState } from "react";
import { Box, Heading, SkeletonText, Text } from "@chakra-ui/react";

export const Summary = ({ meetingId }: {meetingId: number}) => {
  const [loading, setLoading] = useState(true);
  const [summaryData, setSummaryData] = useState("");

  const getSummary = async () => {
    const summary = await askModel(
      meetingId,
      "Can you summarize the meeting.",
      "response1"
    );
    setSummaryData(summary)
    setLoading(false);
  };
  
  useEffect(() => {
    getSummary();
  }, []);

  if (loading) {
    return (
      <Box padding="4" boxShadow="xlg" bg="white" width="100%">
        <SkeletonText mt="4" noOfLines={10} spacing="4" skeletonHeight="2" />
      </Box>
    );
  }
  return <Text>{summaryData || ""}</Text>;
};
