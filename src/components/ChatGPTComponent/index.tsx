"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Sector,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
  Heading,
  Box,
  SkeletonCircle,
  Divider,
  SkeletonText,
  Card,
  CardBody,
  Stack,
} from "@chakra-ui/react";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export const ChatGPTComponent = () => {
  const [data, setData] = useState({});
  const [loading, setIsLoading] = useState(true);

  const askModel = async (query, format = "text") => {
    const res = await fetch(`/api/ask-model`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        format,
      }),
    });
    return await res.json();
  };

  const getAllStats = async () => {
    const summary = await askModel("Can you summarize the meeting.");
    const participants = await askModel(
      "Provide list of participants joined and put that in JSON format"
    );
    const percentages = await askModel(
      "Can you tell me the percentage on how close each person is from the meeting agenda for each topic discussed?. Return output in raw JSON like {topics: [{topic: '<TOPIC_NAME>', participants: {'person1': 20, 'person2': 20}}]} ",
      "json_object"
    );

    console.log({
      summary,
      participants: JSON.parse(participants),
      percentages: (JSON.parse(percentages) || {}).topics,
    });
    setData({
      ...data,
      summary,
      participants: JSON.parse(participants),
      percentages: JSON.parse(percentages).topics,
    });
    setIsLoading(false);
  };

  const getChartData = (index) => {
    return Object.keys(data?.percentages[index]?.participants || {}).map(
      (name, index) => ({
        name,
        value: data?.percentages[index]?.participants[name] || 0,
      })
    );
  };

  useEffect(() => {
    getAllStats();
  }, []);

  if (loading) {
    return (
      <Box padding="6" boxShadow="lg" bg="white">
        <SkeletonCircle size="10" />
        <SkeletonText mt="4" noOfLines={4} spacing="4" skeletonHeight="2" />
      </Box>
    );
  }

  return (
    <Tabs>
      <TabList>
        <Tab>Summary</Tab>
        <Tab>Statistics</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <p>{data?.summary || ""}</p>
        </TabPanel>
        <TabPanel>
          {(data?.percentages || []).map((topicObj, index) => (
            <Card
              key={topicObj.topic}
              direction={{ base: "column", sm: "row" }}
              overflow="hidden"
              variant="outline"
            >
              <PieChart width={350} height={350}>
                <Pie
                  dataKey="value"
                  isAnimationActive={false}
                  data={getChartData([index])}
                  cx="50%"
                  cy="50%"
                  outerRadius={130}
                  fill="#8884d8"
                  label
                >
                  {getChartData([index]).map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
              <Stack>
                <CardBody>
                  <Heading as="h2" size="md" noOfLines={1}>
                    {topicObj.topic || ""}
                  </Heading>

                  <StatGroup>
                    {Object.keys(topicObj.participants || {}).map((name) => (
                      <Stat key={name}>
                        <StatLabel>{(name || "").toUpperCase()}</StatLabel>
                        <StatHelpText>
                          <StatArrow
                            type={
                              (topicObj.participants[name] || 0) < 50
                                ? "decrease"
                                : "increase"
                            }
                          />
                          {topicObj.participants[name] || 0}%
                        </StatHelpText>
                      </Stat>
                    ))}
                  </StatGroup>
                </CardBody>
              </Stack>
            </Card>
          ))}
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};
